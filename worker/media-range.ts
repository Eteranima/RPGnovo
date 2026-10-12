export type MediaManifest = Readonly<Record<string, { readonly bytes: number; readonly sha256: string }>>;
type AssetFetcher = { fetch(request: Request): Promise<Response> | Response };
type ByteRange = { start: number; end: number } | 'unsatisfiable' | null;

/** Unsupported units, malformed headers and multipart ranges are ignored per HTTP semantics. */
export function parseMediaRange(header: string | null, length: number): ByteRange {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/i.exec(header.trim());
  if (!match || (!match[1] && !match[2])) return null;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (suffix === 0) return 'unsatisfiable';
    return { start: Math.max(0, length - suffix), end: length - 1 };
  }
  const start = Number(match[1]);
  const end = match[2] ? Number(match[2]) : length - 1;
  if (!Number.isSafeInteger(start) || start >= length || end < start) return 'unsatisfiable';
  return { start, end: Math.min(end, length - 1) };
}

function matchesIfRange(request: Request, response: Response): boolean {
  const validator = request.headers.get('If-Range');
  if (!validator) return true;
  if (validator.startsWith('"')) return validator === response.headers.get('ETag');
  if (validator.startsWith('W/')) return false;
  const date = Date.parse(validator);
  const modified = Date.parse(response.headers.get('Last-Modified') || '');
  // If-Range uses exact validator equality, unlike If-Unmodified-Since.
  return Number.isFinite(date) && Number.isFinite(modified) && modified === date;
}

/** One upstream chunk at a time, backpressure preserved; no whole-file buffer or tee. */
export function sliceMediaStream(source: ReadableStream<Uint8Array>, start: number, count: number): ReadableStream<Uint8Array> {
  const reader = source.getReader();
  let position = 0;
  let remaining = count;
  let stopped = false;
  const stop = (reason: unknown) => {
    if (stopped) return;
    stopped = true;
    void reader.cancel(reason).catch(() => {}).finally(() => reader.releaseLock());
  };
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        while (!stopped) {
          const { done, value } = await reader.read();
          if (stopped) return;
          if (done) throw new Error('Video asset ended before the requested byte range.');
          const offset = Math.max(0, start - position);
          position += value.byteLength;
          if (offset >= value.byteLength) continue;
          const take = Math.min(value.byteLength - offset, remaining);
          controller.enqueue(value.subarray(offset, offset + take));
          remaining -= take;
          if (remaining === 0) { controller.close(); stop('Requested media range delivered.'); }
          return;
        }
      } catch (error) {
        if (!stopped) { controller.error(error); stop(error); }
      }
    },
    cancel(reason) { stop(reason); },
  }, { highWaterMark: 0 });
}

function fixedLengthBody(body: ReadableStream<Uint8Array>, length: number): ReadableStream<Uint8Array> {
  // Workerd derives Content-Length from this stream, not from a manually set header.
  // Standard Web Streams remain usable in the isolated Node tests.
  if (typeof FixedLengthStream === 'undefined') return body;
  return body.pipeThrough(new FixedLengthStream(length));
}

function cancelBody(response: Response): void {
  void response.body?.cancel().catch(() => {});
}

/** Null delegates to the existing SSR/static handler. Only six exact native MP4 paths qualify. */
export async function serveMediaAsset(request: Request, assets: AssetFetcher, manifest: MediaManifest): Promise<Response | null> {
  const pathname = new URL(request.url).pathname;
  if (!Object.prototype.hasOwnProperty.call(manifest, pathname) || !['GET', 'HEAD'].includes(request.method)) return null;
  const asset = manifest[pathname];
  const response = await assets.fetch(request);
  // Native partial, conditional and error responses are already authoritative.
  if (response.status !== 200) return response;
  const suppliedLength = response.headers.get('Content-Length');
  if (!Number.isSafeInteger(asset.bytes) || asset.bytes <= 0 || (suppliedLength !== null && Number(suppliedLength) !== asset.bytes)) {
    cancelBody(response);
    return new Response('Media length does not match the build manifest.', { status: 502 });
  }
  if (!response.headers.get('Content-Type')?.toLowerCase().startsWith('video/mp4') || /^(?!identity$).+/.test(response.headers.get('Content-Encoding') || '')) return response;
  const headers = new Headers(response.headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Content-Length', String(asset.bytes));
  // Range applies to GET only. HEAD exposes the complete representation metadata.
  if (request.method === 'HEAD') { cancelBody(response); return new Response(null, { status: 200, headers }); }
  const range = matchesIfRange(request, response) ? parseMediaRange(request.headers.get('Range'), asset.bytes) : null;
  if (range === 'unsatisfiable') {
    cancelBody(response);
    headers.set('Content-Range', `bytes */${asset.bytes}`);
    headers.set('Content-Length', '0');
    return new Response(null, { status: 416, headers });
  }
  if (!range) return new Response(response.body, { status: 200, headers });
  if (!response.body) return new Response('Video asset body is missing.', { status: 502 });
  const length = range.end - range.start + 1;
  headers.set('Content-Range', `bytes ${range.start}-${range.end}/${asset.bytes}`);
  headers.set('Content-Length', String(length));
  const stream = sliceMediaStream(response.body, range.start, length);
  return new Response(fixedLengthBody(stream, length), { status: 206, headers });
}
