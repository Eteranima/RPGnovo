import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm, open } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { Readable } from 'node:stream';
import ts from 'typescript';
import { MEDIA_PATHS, collectMediaManifest, buildMediaManifest } from '../scripts/build-media-manifest.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = await mkdtemp(resolve(tmpdir(), 'eter-media-range-'));
let checks = 0;
const eq = (a, b, message) => { checks++; assert.deepEqual(a, b, message); };
const ok = (value, message) => { checks++; assert.ok(value, message); };
const compiled = ts.transpileModule(await readFile(resolve(root, 'worker/media-range.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
await writeFile(resolve(temporary, 'media-range.mjs'), compiled);
const { serveMediaAsset, sliceMediaStream } = await import(pathToFileURL(resolve(temporary, 'media-range.mjs')));
const bytes = Uint8Array.from({ length: 1024 }, (_, i) => (i * 17 + 43) % 256);
const url = 'https://eter.test' + MEDIA_PATHS[1];
const manifest = { [MEDIA_PATHS[1]]: { bytes: bytes.length, sha256: 'fixture' } };
const request = (headers = {}, method = 'GET', path = url) => new Request(path, { method, headers });

function source(payload = bytes, step = 37) {
  const state = { reads: 0, cancelled: false, position: 0, reason: null };
  const body = new ReadableStream({
    pull(controller) {
      state.reads++;
      if (state.position === payload.length) { controller.close(); return; }
      const next = Math.min(state.position + step, payload.length);
      controller.enqueue(payload.subarray(state.position, next)); state.position = next;
    },
    cancel(reason) { state.cancelled = true; state.reason = reason; },
  }, { highWaterMark: 0 });
  return { body, state };
}
function asset(options = {}) {
  const stream = source(options.bytes || bytes, options.step || 37);
  const calls = [];
  const response = new Response(options.head ? null : stream.body, { status: options.status || 200, headers: {
    'Content-Type': 'video/mp4', 'ETag': '"native-etag"', 'Last-Modified': 'Wed, 07 Oct 2026 12:00:00 GMT', 'Cache-Control': 'public, max-age=0', ...(options.headers || {}),
  } });
  return { ...stream, calls, response, fetch: req => { calls.push(req); return response; } };
}
async function delivered(response) { return new Uint8Array(await response.arrayBuffer()); }

let runtime;
try {
  // Real Web Streams, with discontinuous chunks and offsets through chunk boundaries.
  for (const [range, start, end] of [
    ['bytes=0-31', 0, 31], ['bytes=36-75', 36, 75], ['bytes=999-', 999, 1023],
    ['bytes=-17', 1007, 1023], ['bytes=1000-999999', 1000, 1023], ['bytes=-999999', 0, 1023],
    ['bytes=001-002', 1, 2], ['BYTES=7-7', 7, 7],
  ]) {
    const a = asset(); const req = request({ Range: range });
    const result = await serveMediaAsset(req, a, manifest);
    eq(a.calls, [req], 'Forward original method, range and conditional fields');
    eq(result.status, 206); eq(result.headers.get('Content-Range'), `bytes ${start}-${end}/${bytes.length}`);
    eq(result.headers.get('Content-Length'), String(end - start + 1));
    eq(result.headers.get('Accept-Ranges'), 'bytes'); eq(result.headers.get('ETag'), '"native-etag"');
    eq(await delivered(result), bytes.slice(start, end + 1), `Exact bytes: ${range}`);
    await Promise.resolve(); ok(a.state.cancelled, 'Cancel upstream as soon as the selected bytes finish');
    ok(a.state.position <= end + 37, 'No read-ahead of the remaining file');
  }
  for (const range of ['bytes=1024-', 'bytes=1025-2048', 'bytes=-0', 'bytes=80-79', 'bytes=99999999999999999999-']) {
    const a = asset(); const result = await serveMediaAsset(request({ Range: range }), a, manifest);
    eq(result.status, 416); eq(result.headers.get('Content-Range'), 'bytes */1024');
    eq((await delivered(result)).length, 0); eq(a.state.reads, 0); ok(a.state.cancelled);
  }
  // Invalid or unsupported ranges fall back to the intact representation.
  for (const range of ['', 'items=0-31', 'bytes=-', 'bytes=abc-1', 'bytes=0-1,4-9']) {
    const a = asset(); const result = await serveMediaAsset(request({ Range: range }), a, manifest);
    eq(result.status, 200); eq(result.headers.get('Content-Range'), null); eq(await delivered(result), bytes);
  }
  for (const [validator, expected] of [
    ['"native-etag"', 206], ['"other-etag"', 200], ['W/"native-etag"', 200],
    ['Wed, 07 Oct 2026 12:00:00 GMT', 206], ['Tue, 06 Oct 2026 12:00:00 GMT', 200],
    ['Thu, 08 Oct 2026 12:00:00 GMT', 200], ['invalid', 200],
  ]) {
    const a = asset(); const result = await serveMediaAsset(request({ Range: 'bytes=0-31', 'If-Range': validator }), a, manifest);
    eq(result.status, expected); eq(await delivered(result), expected === 206 ? bytes.slice(0, 32) : bytes);
  }
  const noDate = asset({ headers: { 'Last-Modified': '' } });
  eq((await serveMediaAsset(request({ Range: 'bytes=0-31', 'If-Range': 'Wed, 07 Oct 2026 12:00:00 GMT' }), noDate, manifest)).status, 200, 'Unknown date validator cannot enable a partial response');
  await noDate.response.body.cancel();
  for (const status of [206, 304, 404, 416, 500]) {
    const a = asset({ status, head: status === 304 });
    const result = await serveMediaAsset(request({ Range: 'bytes=0-31', 'If-None-Match': '"native-etag"' }), a, manifest);
    eq(result, a.response, 'Native partial/conditional/error response returned untouched');
    eq(a.state.reads, 0); await result.body?.cancel();
  }
  const full = asset(); const fullResponse = await serveMediaAsset(request(), full, manifest);
  eq(fullResponse.status, 200); eq(fullResponse.body, full.response.body, 'Full GET retains the native source stream');
  eq(await delivered(fullResponse), bytes);
  const head = asset({ head: true }); const headResponse = await serveMediaAsset(request({ Range: 'bytes=0-31' }, 'HEAD'), head, manifest);
  eq(headResponse.status, 200); eq(headResponse.headers.get('Content-Length'), '1024'); eq(headResponse.headers.get('Content-Range'), null);
  eq(headResponse.body, null); eq(head.calls[0].method, 'HEAD'); eq(head.state.reads, 0);
  const mismatch = asset({ headers: { 'Content-Length': '1023' } });
  eq((await serveMediaAsset(request({ Range: 'bytes=0-31' }), mismatch, manifest)).status, 502); ok(mismatch.state.cancelled);
  const outside = asset();
  for (const path of ['https://eter.test/', 'https://eter.test/assets/v34/quest-cinematics/not-listed.mp4', 'https://eter.test/assets/v34/quest-cinematics/long-tinta.jpg']) eq(await serveMediaAsset(request({}, 'GET', path), outside, manifest), null);
  eq(await serveMediaAsset(request({}, 'POST'), outside, manifest), null); eq(outside.calls.length, 0, 'Other SSR/assets/methods never fetched here');
  await outside.body.cancel();

  const cancelled = asset({ step: 16 }); const cancelResponse = await serveMediaAsset(request({ Range: 'bytes=0-999' }), cancelled, manifest);
  eq(cancelled.state.reads, 0, 'Returning headers does not eagerly consume the file');
  const consumer = cancelResponse.body.getReader(); eq((await consumer.read()).value.length, 16);
  const beforeCancel = cancelled.state.reads; await consumer.cancel('player closed'); await Promise.resolve();
  ok(cancelled.state.cancelled); eq(cancelled.state.reads, beforeCancel, 'Disconnect stops further reads');
  const early = source(bytes.slice(0, 21));
  await assert.rejects(() => new Response(sliceMediaStream(early.body, 0, 32)).arrayBuffer(), /ended before/); checks++;
  await new Promise(resolve => setImmediate(resolve));
  ok(!early.body.locked, 'A short asset releases the reader rather than retaining a dead stream');
  const failure = new ReadableStream({ pull(controller) { controller.error(new Error('asset read failed')); } });
  await assert.rejects(() => new Response(sliceMediaStream(failure, 0, 32)).arrayBuffer(), /asset read failed/); checks++;

  // Read requested bytes from every real MP4 without loading complete films into memory.
  const liveManifest = await collectMediaManifest();
  const generated = ts.transpileModule(await readFile(resolve(root, 'worker/media-manifest.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  await writeFile(resolve(temporary, 'manifest.mjs'), generated);
  eq((await import(pathToFileURL(resolve(temporary, 'manifest.mjs')))).MEDIA_MANIFEST, liveManifest, 'Bundled sizes/hashes match all six current native files');
  eq(Object.keys(liveManifest), MEDIA_PATHS);
  // Execute the actual Worker wrapper with only the virtual SSR handler substituted.
  const workerSource = (await readFile(resolve(root, 'worker/index.ts'), 'utf8'))
    .replace('"vinext/server/fetch-handler"', '"./ssr-stub.mjs"')
    .replace('"./media-manifest"', '"./manifest.mjs"')
    .replace('"./media-range"', '"./media-range.mjs"');
  await writeFile(resolve(temporary, 'ssr-stub.mjs'), 'export default { fetch: request => new Response("SSR:" + new URL(request.url).pathname, {status: 299}) };');
  await writeFile(resolve(temporary, 'worker.mjs'), ts.transpileModule(workerSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText);
  const worker = (await import(pathToFileURL(resolve(temporary, 'worker.mjs')))).default;
  let unexpectedAssetCalls = 0;
  for (const path of ['/', '/assets/v34/quest-cinematics/long-tinta.jpg', '/assets/other.mp4']) {
    const result = await worker.fetch(request({}, 'GET', 'https://eter.test' + path), { ASSETS: { fetch: () => { unexpectedAssetCalls++; throw new Error('Unexpected media fetch'); } } }, {});
    eq(result.status, 299); eq(await result.text(), 'SSR:' + path, 'Real Worker delegates other pages/assets to Vinext');
  }
  eq(unexpectedAssetCalls, 0);
  for (const path of MEDIA_PATHS) {
    const file = resolve(root, 'public', '.' + path); const length = liveManifest[path].bytes;
    for (const [range, offset] of [['bytes=0-31', 0], ['bytes=-32', length - 32], [`bytes=${length - 32}-`, length - 32]]) {
      const body = Readable.toWeb(createReadStream(file, { highWaterMark: 65536 }));
      const result = await serveMediaAsset(request({ Range: range }, 'GET', 'https://eter.test' + path), { fetch: () => new Response(body, { headers: { 'Content-Type': 'video/mp4' } }) }, liveManifest);
      eq(result.status, 206); eq(result.headers.get('Content-Range'), `bytes ${offset}-${offset + 31}/${length}`);
      const handle = await open(file); const expected = new Uint8Array(32);
      try { eq((await handle.read(expected, 0, 32, offset)).bytesRead, 32); } finally { await handle.close(); }
      eq(await delivered(result), expected, `Native MP4 bytes preserved: ${path}, ${range}`);
    }
  }

  // Generator fails if any allowlisted file is absent; no partial manifest is published.
  const fixtures = resolve(temporary, 'assets');
  for (const path of MEDIA_PATHS) { const file = resolve(fixtures, '.' + path); await mkdir(dirname(file), { recursive: true }); await writeFile(file, bytes); }
  await buildMediaManifest(fixtures, resolve(temporary, 'fixture-manifest.ts'));
  const missing = resolve(fixtures, '.' + MEDIA_PATHS[5]); await rm(missing);
  await assert.rejects(() => buildMediaManifest(fixtures, resolve(temporary, 'missing-manifest.ts')), { code: 'ENOENT' }); checks++;
  await assert.rejects(() => readFile(resolve(temporary, 'missing-manifest.ts')), { code: 'ENOENT' }); checks++;
  await writeFile(missing, bytes);

  // Actual workerd/Assets HTTP (ephemeral isolated origin), not a mocked header implementation.
  const require = createRequire(import.meta.url);
  const { Miniflare, Log, LogLevel } = await import(pathToFileURL(require.resolve('miniflare', { paths: [require.resolve('wrangler')] })));
  const fixtureManifest = Object.fromEntries(MEDIA_PATHS.map(path => [path, { bytes: bytes.length, sha256: 'fixture' }]));
  const routing = ['/assets/v33/opening/*', '/assets/v34/quest-cinematics/*'];
  const config = JSON.parse(await readFile(resolve(root, 'wrangler.jsonc'), 'utf8'));
  eq(config.assets.run_worker_first, routing, 'Only the two known film directories invoke the Worker first');
  runtime = new Miniflare({
    modules: true, compatibilityDate: config.compatibility_date, compatibilityFlags: config.compatibility_flags,
    host: '127.0.0.1', port: 0, log: new Log(LogLevel.NONE),
    script: compiled + '\nconst manifest = ' + JSON.stringify(fixtureManifest) + ';\nexport default { async fetch(request, env) { return await serveMediaAsset(request, env.ASSETS, manifest) ?? new Response("SSR kept", {status: 418}); } };',
    assets: { directory: fixtures, binding: 'ASSETS', assetConfig: { html_handling: 'none', not_found_handling: 'none' }, routerConfig: { has_user_worker: true, static_routing: { user_worker: routing } } },
  });
  const origin = await runtime.ready;
  for (const [range, offset, count] of [['bytes=0-31', 0, 32], ['bytes=-32', 992, 32], ['bytes=1000-', 1000, 24]]) {
    const result = await fetch(new URL(MEDIA_PATHS[1], origin), { headers: { Range: range } });
    eq(result.status, 206); eq(result.headers.get('Content-Length'), String(count), 'Native FixedLengthStream gives a real HTTP length');
    eq(result.headers.get('Content-Range'), `bytes ${offset}-${offset + count - 1}/1024`);
    eq(await delivered(result), bytes.slice(offset, offset + count));
  }
  const actualHead = await fetch(new URL(MEDIA_PATHS[1], origin), { method: 'HEAD', headers: { Range: 'bytes=0-31' } });
  eq(actualHead.status, 200); eq(actualHead.headers.get('Content-Length'), '1024', 'Native HEAD reports complete representation size');
  eq((await delivered(actualHead)).length, 0);
  const actualFull = await fetch(new URL(MEDIA_PATHS[1], origin));
  eq(actualFull.status, 200); eq(await delivered(actualFull), bytes); eq(actualFull.headers.get('Accept-Ranges'), 'bytes');
  const notModified = await fetch(new URL(MEDIA_PATHS[1], origin), { headers: { 'If-None-Match': actualFull.headers.get('ETag'), Range: 'bytes=0-31' } });
  eq(notModified.status, 304); eq((await delivered(notModified)).length, 0);
  const matching = await fetch(new URL(MEDIA_PATHS[1], origin), { headers: { 'If-Range': actualFull.headers.get('ETag'), Range: 'bytes=0-31' } });
  eq(matching.status, 206); eq(await delivered(matching), bytes.slice(0, 32));
  const stale = await fetch(new URL(MEDIA_PATHS[1], origin), { headers: { 'If-Range': '"stale"', Range: 'bytes=0-31' } });
  eq(stale.status, 200); eq(await delivered(stale), bytes);
  const unsatisfied = await fetch(new URL(MEDIA_PATHS[1], origin), { headers: { Range: 'bytes=1024-' } });
  eq(unsatisfied.status, 416); eq(unsatisfied.headers.get('Content-Range'), 'bytes */1024'); eq((await delivered(unsatisfied)).length, 0);
  const ssr = await fetch(new URL('/', origin)); eq(ssr.status, 418); eq(await ssr.text(), 'SSR kept');
  for (const path of MEDIA_PATHS) {
    const result = await fetch(new URL(path, origin), { headers: { Range: 'bytes=0-31' } });
    eq(result.status, 206); eq(result.headers.get('Content-Length'), '32'); eq(await delivered(result), bytes.slice(0, 32));
  }
  console.info(`Media Range: ${checks} checks passed (real streams, six native files and isolated workerd HTTP).`);
} finally {
  await runtime?.dispose();
  if (dirname(temporary) !== resolve(tmpdir()) || !basename(temporary).startsWith('eter-media-range-')) throw new Error('Unexpected test cleanup path.');
  await rm(temporary, { recursive: true, force: true });
}
