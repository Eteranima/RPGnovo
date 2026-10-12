/* The build replaces CONFIG using content hashes. Development never registers this template. */
const CONFIG = /* build:pwa-config */ null;
if (!CONFIG) throw new Error('Build the production PWA before registering its service worker.');
const PREFIX = 'eter-anima-pwa-';
const SHELL = `${PREFIX}shell-${CONFIG.revision}`;
const RUNTIME = `${PREFIX}images-${CONFIG.revision}`;
const ORIGIN = self.location.origin;
const shellPaths = new Set(CONFIG.assets);
let writes = Promise.resolve();
const absolute = path => new URL(path, ORIGIN).href;

function eligible(request, url) {
  return request.method === 'GET' && url.origin === ORIGIN && !request.headers.has('Range') &&
    !request.headers.has('Authorization') && !request.headers.has('RSC') &&
    !request.headers.has('Next-Router-Prefetch') && !url.search;
}
function okay(response) {
  return response.ok && response.status === 200 && response.type !== 'opaque' &&
    !response.redirected && !response.headers.has('Content-Range') &&
    !/no-store|private/i.test(response.headers.get('Cache-Control') || '') &&
    response.headers.get('Vary') !== '*';
}
function shellMimeMatches(path, response) {
  const mime = response.headers.get('Content-Type') || '';
  if (path === CONFIG.offlinePath) return /^text\/html/i.test(mime);
  if (/\.js$/.test(path)) return /(?:java|ecma)script/i.test(mime);
  if (/\.css$/.test(path)) return /^text\/css/i.test(mime);
  if (/\.png$/.test(path)) return /^image\/png/i.test(mime);
  if (/\.webmanifest$/.test(path)) return /^application\/(manifest\+json|json)/i.test(mime);
  if (/\.woff2$/.test(path)) return /^(font\/woff2|application\/font-woff)/i.test(mime);
  return false;
}
async function fetchBounded(request, timeout = 15000, cache) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try { return await fetch(request, { ...(cache ? { cache } : {}), signal: controller.signal }); }
  finally { clearTimeout(timer); }
}
async function bufferBounded(response, limit, timeout = 15000) {
  const declared = Number(response.headers.get('Content-Length'));
  if (declared > limit) { void response.body?.cancel().catch(() => {}); throw new Error('PWA response exceeds its budget.'); }
  const reader = response.body?.getReader();
  if (!reader) return { response, bytes: 0 };
  let timer;
  const deadline = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('PWA response body timed out.')), timeout); });
  const pieces = []; let bytes = 0;
  try {
    for (;;) {
      const item = await Promise.race([reader.read(), deadline]);
      if (item.done) break;
      bytes += item.value.byteLength;
      if (bytes > limit) throw new Error('PWA response exceeds its budget.');
      pieces.push(item.value);
    }
    const data = new Uint8Array(bytes); let offset = 0;
    for (const piece of pieces) { data.set(piece, offset); offset += piece.byteLength; }
    const headers = new Headers(response.headers);
    headers.delete('Content-Encoding'); headers.delete('Content-Length');
    return { response: new Response(data, { status: response.status, headers }), bytes };
  } catch (error) { void reader.cancel().catch(() => {}); throw error; }
  finally { clearTimeout(timer); reader.releaseLock(); }
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    try {
      // Sequential work limits installation pressure. A failed dependency invalidates this version only.
      for (const path of CONFIG.assets) {
        const response = await fetchBounded(new Request(absolute(path), { cache: 'reload', credentials: 'omit' }));
        if (!okay(response) || !shellMimeMatches(path, response)) throw new Error(`PWA dependency unavailable: ${path}`);
        const buffered = await bufferBounded(response, 8 * 1024 * 1024);
        if (!buffered.bytes) throw new Error(`PWA dependency is empty: ${path}`);
        if (path === CONFIG.offlinePath) {
          const digest = await crypto.subtle.digest('SHA-256', await buffered.response.clone().arrayBuffer());
          const sha256 = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
          if (sha256 !== CONFIG.offlineSha256) throw new Error('PWA offline document does not match this deployment.');
        }
        await cache.put(absolute(path), buffered.response);
      }
      let root = await fetchBounded(new Request(absolute('/'), { cache: 'reload', credentials: 'omit' }));
      if (!okay(root) || !/text\/html/i.test(root.headers.get('Content-Type') || '')) throw new Error('PWA shell unavailable.');
      root = (await bufferBounded(root, 4 * 1024 * 1024)).response;
      const html = await root.clone().text();
      const refs = [...html.matchAll(/(?:src|href)=["'](\/_next\/static\/[^"']+\.(?:js|css))["']/g)].map(match => match[1]);
      if (!refs.length || refs.some(path => !shellPaths.has(path))) throw new Error('PWA deployment changed during install. Retry after deployment completes.');
      await cache.put(absolute('/'), root);
    } catch (error) { await caches.delete(SHELL); throw error; }
    // No skipWaiting: the new version waits for the player or for every game tab to close.
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // Retain one previous shell for old hashed chunks during a controlled transition.
    const oldShells = keys.filter(key => key.startsWith(`${PREFIX}shell-`) && key !== SHELL);
    const keep = oldShells.slice(-1);
    await Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== SHELL && key !== RUNTIME && !keep.includes(key)).map(key => caches.delete(key)));
    // No clients.claim: an already open document is never unexpectedly adopted.
  })());
});

async function shellResponse(request, path) {
  const cache = await caches.open(SHELL);
  const cached = await cache.match(absolute(path));
  if (cached) return cached;
  try {
    const response = await fetchBounded(request);
    if (response.ok) return response;
  } catch { /* Offline shell fallback below. */ }
  if (path === '/') return (await cache.match(absolute(CONFIG.offlinePath))) || Response.error();
  return Response.error();
}
async function oldChunk(request) {
  for (const key of await caches.keys()) {
    if (!key.startsWith(`${PREFIX}shell-`)) continue;
    const response = await (await caches.open(key)).match(request);
    if (response) return response;
  }
  return fetch(request);
}
async function rememberImage(request, response) {
  if (!okay(response) || !/^image\//i.test(response.headers.get('Content-Type') || '')) return;
  const buffered = await bufferBounded(response, CONFIG.maxEntryBytes);
  const bytes = buffered.bytes;
  if (!bytes || bytes > CONFIG.maxEntryBytes) return;
  const cache = await caches.open(RUNTIME);
  const headers = new Headers(buffered.response.headers);
  headers.set('X-Eter-Cache-Bytes', String(bytes));
  const stored = new Response(buffered.response.body, { status: 200, headers });
  await cache.delete(request);
  await cache.put(request, stored);
  let keys = await cache.keys();
  let total = 0;
  for (const key of keys) total += Number((await cache.match(key)).headers.get('X-Eter-Cache-Bytes')) || 0;
  while (keys.length > CONFIG.maxRuntimeEntries || total > CONFIG.maxRuntimeBytes) {
    const oldest = keys.shift();
    total -= Number((await cache.match(oldest)).headers.get('X-Eter-Cache-Bytes')) || 0;
    await cache.delete(oldest);
  }
}
async function imageResponse(event) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(event.request);
  if (cached) return cached;
  // A new accepted revision must fetch the deployed pixels, not a stale HTTP-cache copy.
  // The active version's existing runtime hits remain untouched until activation.
  const response = await fetchBounded(event.request, 15000, 'reload');
  const copy = response.clone();
  writes = writes.catch(() => {}).then(() => rememberImage(event.request, copy)).catch(() => {});
  event.waitUntil(writes);
  return response;
}
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (!eligible(request, url)) return;
  // Audio/video, including full non-Range requests, always remain on the network.
  if (/\.(mp4|webm|mov|mp3|ogg|wav|m4a|aac)(?:$)/i.test(url.pathname) || request.destination === 'video' || request.destination === 'audio') return;
  if (url.pathname === '/' && request.mode === 'navigate') {
    event.respondWith(shellResponse(request, '/'));
  } else if (shellPaths.has(url.pathname)) {
    event.respondWith(shellResponse(request, url.pathname));
  } else if (url.pathname.startsWith('/_next/static/') && /\.(js|css|woff2)$/.test(url.pathname)) {
    event.respondWith(oldChunk(request));
  } else if (url.pathname.startsWith('/assets/') && /\.(png|webp|jpg|jpeg|avif)$/.test(url.pathname)) {
    event.respondWith(imageResponse(event));
  }
});

self.addEventListener('message', event => {
  const port = event.ports?.[0];
  if (!event.source?.id) return;
  event.waitUntil((async () => {
    const client = await self.clients.get(event.source.id);
    if (!client || new URL(client.url).origin !== ORIGIN || new URL(client.url).pathname !== '/') return;
    if (event.data?.type === 'ETER_PWA_WARM' && Array.isArray(event.data.urls)) {
      const urls = [...new Set(event.data.urls)].slice(0, 64).filter(value => {
        if (typeof value !== 'string') return false;
        try { const url = new URL(value); return url.origin === ORIGIN && !url.search && /^\/assets\/.+\.(png|webp|jpe?g|avif)$/.test(url.pathname); }
        catch { return false; }
      });
      for (const url of urls) {
        const request = new Request(url, { credentials: 'omit', cache: 'reload' });
        if (await (await caches.open(RUNTIME)).match(request)) continue;
        try {
          const response = await fetchBounded(request);
          writes = writes.catch(() => {}).then(() => rememberImage(request, response)).catch(() => {});
          await writes;
        } catch { /* The first visit must keep working even if optional warming fails. */ }
      }
      return;
    }
    if (!port) return;
    if (event.data?.type === 'ETER_PWA_STATUS') {
      const tabs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const gameTabs = tabs.filter(tab => new URL(tab.url).origin === ORIGIN && new URL(tab.url).pathname === '/');
      port.postMessage({ type: 'ETER_PWA_STATUS', revision: CONFIG.revision, gameTabs: gameTabs.length });
    } else if (event.data?.type === 'ETER_PWA_ACTIVATE' && event.data.saved === true) {
      const tabs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const gameTabs = tabs.filter(tab => new URL(tab.url).origin === ORIGIN && new URL(tab.url).pathname === '/');
      if (gameTabs.length !== 1 || gameTabs[0].id !== client.id) {
        port.postMessage({ type: 'ETER_PWA_ACTIVATE', okay: false, reason: 'other-tabs' }); return;
      }
      port.postMessage({ type: 'ETER_PWA_ACTIVATE', okay: true });
      await self.skipWaiting();
    }
  })());
});
