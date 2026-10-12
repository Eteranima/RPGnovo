import assert from 'node:assert/strict';
import vm from 'node:vm';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createHash, webcrypto } from 'node:crypto';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPwa } from '../scripts/build-pwa.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const template = await readFile(resolve(root, 'public/sw.js'), 'utf8');
const manifest = JSON.parse(await readFile(resolve(root, 'public/manifest.webmanifest'), 'utf8'));
let checks = 0;
const ok = (value, message) => { checks++; assert.ok(value, message); };
const eq = (value, expected, message) => { checks++; assert.deepEqual(value, expected, message); };
const ORIGIN = 'https://eter.test';
const offlineSha256 = createHash('sha256').update('offline-page').digest('hex');
const config = { revision: 'test-v2', assets: ['/_next/static/page-test.js', '/pwa-offline', '/pwa/icon-192.png'], offlinePath: '/pwa-offline', offlineSha256, maxRuntimeEntries: 2, maxRuntimeBytes: 24, maxEntryBytes: 16 };

function harness(settings = {}) {
  const origin = settings.origin || ORIGIN;
  const stores = settings.stores || new Map();
  const listeners = new Map();
  let skipCalls = 0;
  let claimCalls = 0;
  let calls = [];
  const fetchOptions = [];
  const address = request => typeof request === 'string' ? new URL(request, origin).href : request.url;
  const caches = {
    open: async name => {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {
        match: async req => store.get(address(req))?.clone(),
        put: async (req, res) => { store.set(address(req), res.clone()); },
        delete: async req => store.delete(address(req)),
        keys: async () => [...store.keys()].map(url => new Request(url)),
      };
    },
    keys: async () => [...stores.keys()],
    delete: async name => stores.delete(name),
  };
  const tabs = settings.tabs || [{ id: 'game', url: origin + '/' }];
  const self = {
    location: { origin },
    addEventListener: (name, fn) => listeners.set(name, fn),
    skipWaiting: async () => { skipCalls++; if (settings.skipFailure) throw new Error('activation rejected'); },
    clients: {
      get: async id => tabs.find(tab => tab.id === id),
      matchAll: async () => tabs,
      claim: async () => { claimCalls++; },
    },
  };
  const fetch = async (request, init) => {
    const url = address(request); calls.push(url);
    fetchOptions.push({ url, cache: init?.cache || request.cache || 'default' });
    if (settings.networkFetch) return settings.networkFetch(request, init);
    if (settings.stall?.(url)) return new Promise((_, reject) => init.signal.addEventListener('abort', () => reject(new Error('stalled network'))));
    if (settings.fail?.(url)) throw new Error('offline');
    const path = new URL(url).pathname;
    if (settings.stallBody?.(url)) return new Response(new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('first-part')); } }), { headers: { 'Content-Type': 'text/javascript' } });
    if (settings.wrongMime?.(url)) return new Response('html-error', { headers: { 'Content-Type': 'text/html' } });
    if (path === '/') return new Response(`<html><script src="${settings.rootRef || '/_next/static/page-test.js'}"></script></html>`, { headers: { 'Content-Type': 'text/html' } });
    if (path === '/pwa-offline') return new Response(settings.offlineBody || 'offline-page', { headers: { 'Content-Type': 'text/html' } });
    if (path.endsWith('.js')) return new Response('client-code', { headers: { 'Content-Type': 'text/javascript' } });
    return new Response(settings.body || '12345678', { status: settings.status || 200, headers: { 'Content-Type': settings.contentType || 'image/png', ...(settings.headers || {}) } });
  };
  vm.runInNewContext(template.replace('/* build:pwa-config */ null', JSON.stringify({ ...config, ...settings.config })), { self, caches, fetch, Request, Response, Headers, URL, TextEncoder, AbortController, crypto: webcrypto, setTimeout: settings.realTimers ? setTimeout : (callback, delay) => setTimeout(callback, Math.min(delay, 25)), clearTimeout });
  async function dispatch(name, properties = {}) {
    const waits = [];
    let response;
    const event = { ...properties, waitUntil: promise => waits.push(promise), respondWith: promise => { response = promise; } };
    listeners.get(name)(event);
    const result = response ? await response : undefined;
    await Promise.all(waits);
    return result;
  }
  function request(path, overrides = {}) {
    return { url: new URL(path, origin).href, method: 'GET', headers: new Headers(), mode: 'cors', destination: 'image', ...overrides };
  }
  async function message(data, source = 'game') {
    const messages = [];
    await dispatch('message', { data, source: { id: source }, ports: [{ postMessage: value => messages.push(value) }] });
    return messages;
  }
  return { caches, stores, self, dispatch, request, message, calls, fetchOptions, stats: () => ({ skipCalls, claimCalls }), settings };
}

eq(manifest.id, '/'); eq(manifest.start_url, '/'); eq(manifest.scope, '/'); eq(manifest.display, 'standalone');
for (const size of [192, 512]) ok(manifest.icons.some(icon => icon.sizes === `${size}x${size}` && icon.purpose === 'any'), 'Required icon size');
ok(manifest.icons.some(icon => icon.purpose === 'maskable'), 'Maskable icon separate');
for (const icon of manifest.icons) {
  const png = await readFile(resolve(root, 'public' + icon.src));
  const [width, height] = icon.sizes.split('x').map(Number);
  eq(png.readUInt32BE(16), width); eq(png.readUInt32BE(20), height);
}
const h = harness();
await h.dispatch('install');
eq(h.stats(), { skipCalls: 0, claimCalls: 0 }, 'Install never takes over a game');
ok(h.stores.get('eter-anima-pwa-shell-test-v2').has(ORIGIN + '/'), 'HTML cached with its dependencies');
const cachedCode = await h.dispatch('fetch', { request: h.request('/_next/static/page-test.js') });
eq(await cachedCode.text(), 'client-code');
h.settings.fail = () => true;
const offlineHome = await h.dispatch('fetch', { request: h.request('/', { mode: 'navigate', destination: 'document' }) });
ok((await offlineHome.text()).includes('page-test.js'), 'Offline opens the actual pinned game shell');
await (await h.caches.open('eter-anima-pwa-shell-test-v2')).delete(ORIGIN + '/');
const offlineFallback = await h.dispatch('fetch', { request: h.request('/', { mode: 'navigate', destination: 'document' }) });
eq(await offlineFallback.text(), 'offline-page');
for (const path of ['/assets/test.mp4', '/assets/music.ogg', '/assets/quest.webm']) {
  eq(await h.dispatch('fetch', { request: h.request(path) }), undefined, 'Media never intercepted');
}
for (const [path, overrides] of [
  ['/assets/a.png', { headers: new Headers({ Range: 'bytes=0-100' }) }],
  ['/assets/a.png', { headers: new Headers({ Authorization: 'secret' }) }],
  ['https://other.test/assets/a.png', {}], ['/assets/a.png?token=private', {}],
  ['/', { method: 'POST', mode: 'navigate' }],
  ['/', { headers: new Headers({ RSC: '1' }), mode: 'navigate' }],
  ['/?_rsc=private', { mode: 'navigate' }],
]) eq(await h.dispatch('fetch', { request: h.request(path, overrides) }), undefined, 'Sensitive/partial/nonlocal requests bypass');
h.settings.fail = null;
for (let index = 0; index < 4; index++) await h.dispatch('fetch', { request: h.request(`/assets/frame-${index}.png`) });
const imageCache = await h.caches.open('eter-anima-pwa-images-test-v2');
eq((await imageCache.keys()).length, 2, 'Image count bounded');
ok(!await imageCache.match(ORIGIN + '/assets/frame-0.png'), 'Oldest image evicted');
const byteBound = harness({ config: { maxRuntimeEntries: 8, maxRuntimeBytes: 12 } });
for (let index = 0; index < 3; index++) await byteBound.dispatch('fetch', { request: byteBound.request(`/assets/byte-${index}.png`) });
eq((await (await byteBound.caches.open('eter-anima-pwa-images-test-v2')).keys()).length, 1, 'Byte budget independently evicts before entry count');
h.settings.fail = () => true;
eq(await (await h.dispatch('fetch', { request: h.request('/assets/frame-3.png') })).text(), '12345678', 'Visited image available offline');
await assert.rejects(() => h.dispatch('fetch', { request: h.request('/assets/unvisited.png') })); checks++;
h.settings.fail = null;
h.settings.body = '012345678901234567890';
await h.dispatch('fetch', { request: h.request('/assets/oversize.png') });
ok(!await imageCache.match(ORIGIN + '/assets/oversize.png'), 'Oversize art not retained');
h.settings.body = '12345678'; h.settings.headers = { 'Cache-Control': 'private' };
await h.dispatch('fetch', { request: h.request('/assets/private.png') });
ok(!await imageCache.match(ORIGIN + '/assets/private.png'), 'Private data not cached');
h.settings.headers = {}; h.settings.status = 206;
await h.dispatch('fetch', { request: h.request('/assets/partial.png') });
ok(!await imageCache.match(ORIGIN + '/assets/partial.png'), 'Partial response not cached');
h.settings.status = 200; h.settings.contentType = 'text/html';
await h.dispatch('fetch', { request: h.request('/assets/html-disguised.png') });
ok(!await imageCache.match(ORIGIN + '/assets/html-disguised.png'), 'HTML error cannot poison raster cache');
const failed = harness({ fail: url => url.includes('icon-192') });
await (await failed.caches.open('eter-anima-pwa-shell-test-v1')).put(ORIGIN + '/', new Response('old-game'));
await assert.rejects(() => failed.dispatch('install')); checks++;
ok(!failed.stores.has('eter-anima-pwa-shell-test-v2'), 'Incomplete installation rolled back');
ok(failed.stores.has('eter-anima-pwa-shell-test-v1'), 'Previous game preserved after failure');
const stalled = harness({ stall: url => url.includes('page-test.js') });
await assert.rejects(() => stalled.dispatch('install')); checks++;
ok(!stalled.stores.has('eter-anima-pwa-shell-test-v2'), 'Network stall times out and rolls back installation');
const stalledBody = harness({ stallBody: url => url.includes('page-test.js') });
await assert.rejects(() => stalledBody.dispatch('install')); checks++;
ok(!stalledBody.stores.has('eter-anima-pwa-shell-test-v2'), 'Response-body stall also times out and rolls back');
const poisonedShell = harness({ wrongMime: url => url.includes('page-test.js') });
await assert.rejects(() => poisonedShell.dispatch('install')); checks++;
ok(!poisonedShell.stores.has('eter-anima-pwa-shell-test-v2'), 'HTML cannot be stored as a critical script');
const genericOffline = harness({ offlineBody: '<html>unrelated successful error page</html>' });
await assert.rejects(() => genericOffline.dispatch('install'), /offline document does not match/); checks++;
ok(!genericOffline.stores.has('eter-anima-pwa-shell-test-v2'), 'A200HTML generic page cannot replace the expected hashed offline document');
const mismatched = harness({ rootRef: '/_next/static/page-other-deployment.js' });
await assert.rejects(() => mismatched.dispatch('install')); checks++;
ok(!mismatched.stores.has('eter-anima-pwa-shell-test-v2'), 'Mixed deployment refused');
for (const name of ['unrelated-cache', 'eter-anima-pwa-shell-v0', 'eter-anima-pwa-shell-v1', 'eter-anima-pwa-images-v1']) await h.caches.open(name);
await h.dispatch('activate');
ok(h.stores.has('unrelated-cache'), 'Other apps caches untouched');
ok(h.stores.has('eter-anima-pwa-shell-v1'), 'One previous shell retained');
ok(!h.stores.has('eter-anima-pwa-shell-v0'), 'Older shells pruned');
eq(h.stats().claimCalls, 0, 'Activation never claims current documents');
eq((await h.message({ type: 'ETER_PWA_STATUS' }))[0].gameTabs, 1);
eq(await h.message({ type: 'ETER_PWA_ACTIVATE', saved: false }), [], 'No activation without save consent');
eq(await h.message({ type: 'ETER_PWA_ACTIVATE', saved: true }, 'unknown'), [], 'Unknown sender ignored');
await h.message({ type: 'SKIP_WAITING' }); eq(h.stats().skipCalls, 0, 'Generic skip messages ignored');
eq((await h.message({ type: 'ETER_PWA_ACTIVATE', saved: true }))[0].okay, true); eq(h.stats().skipCalls, 1);
const multiple = harness({ tabs: [{ id: 'game', url: ORIGIN + '/' }, { id: 'other', url: ORIGIN + '/' }] });
eq((await multiple.message({ type: 'ETER_PWA_ACTIVATE', saved: true }))[0].reason, 'other-tabs'); eq(multiple.stats().skipCalls, 0);
const refusedActivation = harness({ skipFailure: true });
eq((await refusedActivation.message({ type: 'ETER_PWA_ACTIVATE', saved: true }))[0].okay, false, 'Activation failure cannot acknowledge a successful promotion');
eq(refusedActivation.stats().skipCalls, 1, 'Failure fixture reaches the actual skipWaiting promise');
const warming = harness();
await warming.message({ type: 'ETER_PWA_WARM', urls: [ORIGIN + '/assets/visited.png', 'https://other.test/assets/stolen.png', ORIGIN + '/assets/movie.mp4', ORIGIN + '/assets/private.png?token=1', '/not-an-absolute-url'] });
eq(warming.calls, [ORIGIN + '/assets/visited.png'], 'First-visit warming only accepts local raster URLs');
ok(!template.includes('localStorage') && !template.includes('indexedDB'), 'SW never reads/writes save or audio storage');

// Real fetch/Response preserves redirect metadata. The former fake-only install
// accidentally returned200 with redirected=false for file.html, hiding Cloudflare's307.
const server = createServer((request, response) => {
  if (request.url === '/pwa-offline.html') { response.writeHead(307, { Location: '/pwa-offline' }); response.end(); return; }
  const mime = request.url.endsWith('.js') ? 'text/javascript' : request.url.endsWith('.png') ? 'image/png' : 'text/html';
  response.writeHead(200, { 'Content-Type': mime });
  response.end(request.url === '/' ? '<html><script src="/_next/static/page-test.js"></script></html>' : request.url === '/pwa-offline' ? 'offline-page' : request.url.endsWith('.js') ? 'client-code' : 'png');
});
server.listen(0, '127.0.0.1'); await once(server, 'listening');
try {
  const origin = `http://127.0.0.1:${server.address().port}`;
  const original = await fetch(origin + '/pwa-offline.html');
  eq(original.status, 200, 'Old alias returns200 only AFTER following its real307');
  eq(original.redirected, true, 'Native HTTPResponse exposes redirect that former unit stub missed');
  eq(original.url, origin + '/pwa-offline', 'Native finalURL is the canonical document');
  ok(original.headers.get('Content-Type').startsWith('text/html'), 'Redirect still hasHTML MIME and therefore200/MIME alone is insufficient');
  const broken = harness({ origin, realTimers: true, networkFetch: fetch, config: { assets: config.assets.map(path => path === config.offlinePath ? '/pwa-offline.html' : path), offlinePath: '/pwa-offline.html' } });
  await (await broken.caches.open('eter-anima-pwa-shell-prior')).put(origin + '/', new Response('previous-game'));
  await assert.rejects(() => broken.dispatch('install'), /dependency unavailable: \/pwa-offline.html/); checks++;
  ok(!broken.stores.has('eter-anima-pwa-shell-test-v2'), 'Real redirect rejects install atomically');
  ok(broken.stores.has('eter-anima-pwa-shell-prior'), 'Redirect install failure preserves prior working shell');
  const canonical = await fetch(origin + config.offlinePath);
  eq(canonical.status, 200); eq(canonical.redirected, false); eq(canonical.url, origin + config.offlinePath);
  const working = harness({ origin, realTimers: true, networkFetch: fetch });
  await working.dispatch('install');
  ok(working.stores.get('eter-anima-pwa-shell-test-v2').has(origin + '/pwa-offline'), 'Unmodified actual install handler caches canonicalHTML using native HTTPResponses');
  ok(working.stores.get('eter-anima-pwa-shell-test-v2').has(origin + '/'), 'Actual install completes after offline document and root dependencies');
  eq(working.stats(), { skipCalls: 0, claimCalls: 0 }, 'Real-network install still cannot take over a running game');
  working.settings.networkFetch = async () => { throw Error('offline'); };
  await (await working.caches.open('eter-anima-pwa-shell-test-v2')).delete(origin + '/');
  eq(await (await working.dispatch('fetch', { request: working.request('/', { mode: 'navigate', destination: 'document' }) })).text(), 'offline-page', 'Canonical document is the actual offline navigation fallback');
} finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
const client = await readFile(resolve(root, 'components/pwa-install-control.tsx'), 'utf8');
ok(client.includes('await pwa.applyUpdate()'), 'Manual controls use the same guarded promotion owner as automatic updates');
eq((client.match(/window\.location\.reload\(/g) || []).length, 0, 'Settings cannot bypass the central saved reload path');
const provider = await readFile(resolve(root, 'components/pwa-provider.tsx'), 'utf8');
eq((provider.match(/window\.location\.reload\(/g) || []).length, 1, 'One guarded application reload path');
ok(!provider.includes('controllerchange'), 'Controller changes do not reload a game');
ok(provider.includes("process.env.NODE_ENV === 'production'"), 'Development excludes SW');
const transfer = await readFile(resolve(root, 'components/pwa-save-transfer.tsx'), 'utf8');
ok(transfer.includes('file.size > MAX_PWA_SAVE_FILE_BYTES'), 'Local file size bounded');
ok(transfer.includes('callbacks.current.previewSave(text)'), 'Preview uses engine validator');
ok(transfer.includes('callbacks.current.importSave(pending.text)'), 'Storage import is delegated to engine');
ok(transfer.includes('Confirmar substituição') && transfer.includes('canImport'), 'Explicit import confirmation only in safe state');
ok(!transfer.includes('fetch(') && !transfer.includes('localStorage'), 'File transfer has no network or direct storage writes');

const temporary = await mkdtemp(resolve(tmpdir(), 'eter-pwa-test-'));
try {
  const paths = ['/_next/static/page-fixture.js', '/manifest.webmanifest', '/pwa-offline.html', '/pwa/icon-192.png', '/pwa/icon-512.png', '/pwa/icon-maskable-512.png', '/pwa/apple-touch-icon.png'];
  for (const path of paths) { await mkdir(dirname(resolve(temporary, '.' + path)), { recursive: true }); await writeFile(resolve(temporary, '.' + path), path); }
  const first = await buildPwa(temporary);
  eq(first.offlinePath, '/pwa-offline', 'Build uses Cloudflare canonical requestURL rather than physical file.html');
  ok(first.assets.includes('/pwa-offline') && !first.assets.includes('/pwa-offline.html'), 'Install assets contain no redirecting offline alias');
  eq(first.offlineSha256, createHash('sha256').update('/pwa-offline.html').digest('hex'), 'CanonicalURL fingerprints bytes from the physicalHTML file');
  const second = await buildPwa(temporary); eq(first.revision, second.revision, 'Revision deterministic');
  const artPath = resolve(temporary, 'assets/v36/same-address.png');
  await mkdir(dirname(artPath), { recursive: true }); await writeFile(artPath, 'old-pixels');
  const oldArtBuild = await buildPwa(temporary);
  eq(oldArtBuild.runtimeAssets.files, 1, 'Native runtime files fingerprinted without adding them to shell');
  ok(oldArtBuild.revision !== second.revision, 'Adding game art changes SW revision even with identical code');
  const artUnchanged = await buildPwa(temporary); eq(oldArtBuild.revision, artUnchanged.revision, 'Native artwork fingerprint deterministic');
  await writeFile(artPath, 'new-pixels');
  const newArtBuild = await buildPwa(temporary);
  ok(newArtBuild.runtimeAssets.sha256 !== oldArtBuild.runtimeAssets.sha256 && newArtBuild.revision !== oldArtBuild.revision, 'Art-only mutation at identical URL changes native content hash and worker revision');
  eq(newArtBuild.assets, oldArtBuild.assets, 'Art-only patch keeps the small shell selection unchanged');
  const oldVersion = harness({config:{revision:oldArtBuild.revision},body:'old-pixels'});
  await oldVersion.dispatch('install');
  eq(await (await oldVersion.dispatch('fetch', {request:oldVersion.request('/assets/v36/same-address.png')})).text(), 'old-pixels');
  const newVersion = harness({stores:oldVersion.stores,config:{revision:newArtBuild.revision},body:'new-pixels'});
  await newVersion.dispatch('install');
  eq(newVersion.stats().skipCalls, 0, 'Art-only patch waits instead of interrupting the current game');
  oldVersion.settings.fail=()=>true;
  eq(await (await oldVersion.dispatch('fetch', {request:oldVersion.request('/assets/v36/same-address.png')})).text(), 'old-pixels', 'Current revision keeps its cached art offline while the new revision waits');
  ok(newVersion.stores.has(`eter-anima-pwa-images-${oldArtBuild.revision}`), 'Installing new artwork cannot purge active artwork');
  eq((await newVersion.message({type:'ETER_PWA_ACTIVATE',saved:true}))[0].okay,true,'Artwork update uses the same explicit saved activation protocol');
  await newVersion.dispatch('activate');
  ok(!newVersion.stores.has(`eter-anima-pwa-images-${oldArtBuild.revision}`), 'Accepted revision purges outdated art cache');
  eq(await (await newVersion.dispatch('fetch', {request:newVersion.request('/assets/v36/same-address.png')})).text(), 'new-pixels', 'New revision fetches changed art at the same URL');
  eq(newVersion.fetchOptions.at(-1).cache, 'reload', 'First new-revision raster bypasses stale HTTP cache');
  newVersion.settings.fail=()=>true;
  eq(await (await newVersion.dispatch('fetch', {request:newVersion.request('/assets/v36/same-address.png')})).text(), 'new-pixels', 'Downloaded changed art is available offline in the accepted revision');
  await rm(artPath);
  const artRemoved = await buildPwa(temporary);
  ok(artRemoved.revision !== newArtBuild.revision && artRemoved.runtimeAssets.files === 0, 'Removing runtime art also changes revision');
  await writeFile(resolve(temporary, '_next/static/page-fixture.js'), 'changed-code');
  const third = await buildPwa(temporary); ok(first.revision !== third.revision, 'Code content changes SW revision');
  const worker = await readFile(resolve(temporary, 'sw.js'), 'utf8'); ok(!worker.includes('/* build:pwa-config */ null'), 'Build emits real configuration');
  ok(third.assets.every(path => !/\.(mp4|ogg|png)$/.test(path) || path.startsWith('/pwa/')), 'No giant game art or media precached');
} finally {
  if (!temporary.startsWith(resolve(tmpdir(), 'eter-pwa-test-'))) throw new Error('Unexpected temporary output path.');
  await rm(temporary, { recursive: true, force: true });
}
console.info(`PWA: ${checks} checks passed (install, offline, bounded cache, Range bypass, update/save, scope, build revision).`);
