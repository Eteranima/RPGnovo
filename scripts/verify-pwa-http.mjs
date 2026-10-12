import assert from 'node:assert/strict';
import vm from 'node:vm';
import { createHash, webcrypto } from 'node:crypto';
const origin = new URL(process.argv[2] || 'http://127.0.0.1:5173/');
if (origin.protocol !== 'https:' && !['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) throw new Error('PWA requires HTTPS or loopback.');
let checks = 0;
async function get(path, init = {}) {
  const response = await fetch(new URL(path, origin), { ...init, signal: AbortSignal.timeout(15000) });
  return response;
}
function ok(value, message) { checks++; assert.ok(value, message); }
const html = await (await get('/')).text();
ok(/rel="manifest"[^>]*href="\/manifest.webmanifest"|href="\/manifest.webmanifest"[^>]*rel="manifest"/.test(html), 'HTML manifest link missing');
ok(html.includes('apple-touch-icon') && html.includes('/pwa/apple-touch-icon.png'), 'Apple touch icon missing');
ok(html.includes('theme-color') && html.includes('#0c1425'), 'Theme color missing');
const manifestResponse = await get('/manifest.webmanifest');
ok(manifestResponse.ok, 'Manifest response');
ok(/application\/(manifest\+json|json)/.test(manifestResponse.headers.get('Content-Type') || ''), 'Manifest MIME');
const manifest = await manifestResponse.json();
ok(manifest.scope === '/' && manifest.id === '/' && manifest.start_url === '/', 'Scope and app identity');
ok(manifest.display === 'standalone', 'Standalone display');
for (const size of [192, 512]) ok(manifest.icons.some(icon => icon.sizes === `${size}x${size}`), `Icon ${size}`);
for (const icon of manifest.icons) {
  const response = await get(icon.src); ok(response.ok, `Icon response: ${icon.src}`);
  ok(response.headers.get('Content-Type')?.startsWith('image/png'), `PNG MIME: ${icon.src}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const view = new DataView(bytes.buffer);
  const [width, height] = icon.sizes.split('x').map(Number);
  ok(view.getUint32(16) === width && view.getUint32(20) === height, `PNG dimensions: ${icon.src}`);
}
const worker = await get('/sw.js');
ok(worker.ok, 'SW response');
ok(/javascript/.test(worker.headers.get('Content-Type') || ''), 'SW MIME');
ok(/no-store|no-cache/.test(worker.headers.get('Cache-Control') || ''), 'SW cannot use immutable HTTP cache');
ok(worker.headers.get('X-Content-Type-Options') === 'nosniff', 'SW nosniff');
const script = await worker.text();
ok(!script.includes('/* build:pwa-config */ null'), 'Production SW config missing');
const reportResponse = await get('/pwa-build.json'); ok(reportResponse.ok, 'PWA build report response');
const report = await reportResponse.json();
ok(script.includes(report.revision), 'SW/build revisions agree');
ok(report.offlinePath === '/pwa-offline', 'Canonical offline URL missing: file.html redirects under Cloudflare HTML handling');
ok(report.assets.some(asset => asset.url === report.offlinePath) && !report.assets.some(asset => asset.url === '/pwa-offline.html'), 'Shell must use canonical offline URL, not redirecting physical alias');
const offline = await get(report.offlinePath);
const offlineProof = { status: offline.status, redirected: offline.redirected, finalURL: offline.url, contentType: offline.headers.get('Content-Type') };
ok(offline.status === 200 && !offline.redirected, 'Offline asset must be200 WITHOUT a redirect');
ok(offline.url === new URL(report.offlinePath, origin).href, 'Offline asset finalURL must be the canonical URL');
ok(/^text\/html/i.test(offline.headers.get('Content-Type') || ''), 'Offline asset MIME');
ok(createHash('sha256').update(new Uint8Array(await offline.arrayBuffer())).digest('hex') === report.offlineSha256, 'Offline response must be the expected native deployment bytes, not a genericHTML page');
ok(report.shellBytes <= 8 * 1024 * 1024 && report.assets.every(asset => asset.url.startsWith('/_next/static/') || !asset.url.startsWith('/assets/')), 'Small shell excludes game artwork/media');
const chunk = report.assets.find(asset => asset.url.endsWith('.js'));
ok(chunk && (await get(chunk.url)).ok, 'Critical client chunk reachable');
const range = await get('/assets/v34/quest-cinematics/long-tinta.mp4', { headers: { Range: 'bytes=0-31' } });
ok(range.status === 206, 'Server must preserve video Range responses');
ok(/^bytes 0-31\/\d+$/.test(range.headers.get('Content-Range') || ''), 'Video Content-Range');
ok((await range.arrayBuffer()).byteLength === 32, 'Exact requested video range');

// Execute the deployed worker's unmodified install handler with native fetch and
// Response metadata. Only CacheStorage/self events are in-memory substitutes.
const stores = new Map(), listeners = new Map(), installedResponses = [];
const address = request => typeof request === 'string' ? new URL(request, origin).href : request.url;
const caches = {
  async open(name) {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name);
    return {
      match: async request => store.get(address(request))?.clone(),
      put: async (request, response) => { store.set(address(request), response.clone()); },
      delete: async request => store.delete(address(request)),
      keys: async () => [...store.keys()].map(url => new Request(url)),
    };
  },
  keys: async () => [...stores.keys()],
  delete: async name => stores.delete(name),
};
let disconnected = false, skipCalls = 0;
const nativeFetch = async (request, init) => {
  if (disconnected) throw new Error('Isolated offline check');
  const response = await fetch(request, init);
  installedResponses.push({ request: address(request), status: response.status, redirected: response.redirected, finalURL: response.url, contentType: response.headers.get('Content-Type') });
  return response;
};
const self = { location: { origin: origin.origin }, addEventListener: (name, listener) => listeners.set(name, listener), skipWaiting: () => { skipCalls++; } };
vm.runInNewContext(script, { self, caches, fetch: nativeFetch, Request, Response, Headers, URL, TextEncoder, AbortController, crypto: webcrypto, setTimeout, clearTimeout }, { filename: new URL('/sw.js', origin).href });
ok(listeners.has('install'), 'Deployed SW registers its actual install listener');
const waits = [];
listeners.get('install')({ waitUntil: promise => waits.push(promise) });
await Promise.all(waits);
const shell = stores.get(`eter-anima-pwa-shell-${report.revision}`);
ok(!!shell && shell.size === report.assets.length + 1, 'Actual install caches every dependency and root atomically');
ok(installedResponses.length === report.assets.length + 1, 'Install performed real network fetches for every dependency and root');
for (const response of installedResponses) ok(response.status === 200 && !response.redirected && response.finalURL === response.request, `Install response must not redirect or rewrite identity: ${response.request}`);
ok(skipCalls === 0, 'Successful install still does not take over a running game');
disconnected = true;
const request = { url: new URL('/', origin).href, method: 'GET', headers: new Headers(), mode: 'navigate', destination: 'document' };
async function offlineNavigation() {
  let pending; const background = [];
  listeners.get('fetch')({ request, respondWith: promise => { pending = promise; }, waitUntil: promise => background.push(promise) });
  const response = await pending; await Promise.all(background); return response;
}
const cachedHtml = await (await offlineNavigation()).text();
const pinnedRefs = [...cachedHtml.matchAll(/(?:src|href)=["'](\/_next\/static\/[^"']+\.(?:js|css))["']/g)].map(match => match[1]);
ok(pinnedRefs.length > 0 && pinnedRefs.every(path => report.assets.some(asset => asset.url === path)), 'Installed actual shell opens with its pinned entry dependencies when network is unavailable');
shell.delete(new URL('/', origin).href);
const fallback = await offlineNavigation();
ok(createHash('sha256').update(new Uint8Array(await fallback.arrayBuffer())).digest('hex') === report.offlineSha256, 'Canonical offline fallback works through the actual fetch handler with network unavailable');
console.info('PWA offline response: ' + JSON.stringify(offlineProof));
console.info(`PWA HTTP: ${checks} checks passed at ${origin.origin}, including deployed install/fetch handlers with nativeHTTP Responses and isolated CacheStorage. Browser promotion/OS installation and live browser SW offline/update are still separate, unverified checks.`);
