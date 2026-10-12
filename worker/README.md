# Native video byte ranges

Wrangler 4.92.0 / Miniflare 4.20260515.0 Assets returned the entire MP4 (200) for `Range: bytes=0-31`. The installed asset worker uses the header for cache eligibility but does not slice its body. The application service worker bypasses Range and all video requests.

## Scope and build

- `wrangler.jsonc` invokes our Worker first only for `/assets/v33/opening/*` and `/assets/v34/quest-cinematics/*`.
- `media-range.ts` handles only the six exact MP4 paths in `media-manifest.ts`. Other assets, methods and application requests still delegate to the existing Vinext handler.
- `scripts/run-framework.mjs build` runs `build-media-manifest.mjs` **before** either the local or managed Linux server bundling path. It streams native SHA-256 hashes and records file lengths; missing, empty or concurrently changing files fail the build. The generated small TypeScript manifest is bundled with the Worker.
- Build metadata must describe the shipped native files. Replacing a film requires rebuilding; no runtime whole-film hashing or buffering is performed.

## HTTP behavior

Native non-200 responses, including 206, 304 and 404, pass through unchanged. A full GET retains the native body stream. HEAD ignores Range and reports the complete representation size. Single `bytes=start-end`, `bytes=start-` and `bytes=-suffix` requests produce 206 with exact Content-Range and length. Unsatisfiable requests produce 416 with `bytes */total`; malformed, unsupported-unit and multipart requests receive the complete 200 representation. If-Range accepts a matching strong ETag or exactly matching Last-Modified date; a stale, weak or unknown validator receives the complete representation.

The fallback reads one upstream chunk at a time under backpressure, emits only the selected bytes, and cancels after the requested endpoint or a client disconnect. It never calls `arrayBuffer()`, `text()` or `tee()` on the film. A short or failed source errors the stream rather than padding it. On workerd, the result flows through the supported `FixedLengthStream`, so the runtime emits a real Content-Length rather than replacing it with chunked transfer encoding.

**Limit:** Assets currently provides no random-access binding. Seeking to a late byte offset reads and discards earlier chunks; memory remains bounded by upstream chunks/stream queues, but those earlier bytes still incur internal I/O. Native 206 can pass through when the platform supports it later. The MP4s, codec, resolution, frame count and audio are untouched.

## Verification

Run `node tests/media-range.test.mjs`. It checks actual bytes across all six native films, chunk-boundary ranges, validators, native responses, source errors, early cancellation, generator failures and the real Worker delegation. An ephemeral isolated Miniflare/workerd origin verifies actual 206/Content-Range/Content-Length, HEAD, 304, 416 and full GET. It does not stop the shared review server or deploy anything. After rebuilding the application, the unchanged `scripts/verify-pwa-http.mjs` gate must pass on the production review origin.

Local result on 2026-10-11: **291 checks passed**. The focused TypeScript check for the helper/manifest passed; `git diff --check` passed. The shared production-server gate is verified separately after its owner rebuilds.

## Primary references

- [Cloudflare selective Worker-first routing and Assets binding](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Cloudflare streams and bounded body processing](https://developers.cloudflare.com/workers/runtime-apis/streams/)
- [Cloudflare Response / FixedLengthStream length semantics](https://developers.cloudflare.com/workers/runtime-apis/response/)
- [HTTP If-Range and range responses (RFC 9110)](https://www.rfc-editor.org/rfc/rfc9110.html#section-13.1.5)
- [Cloudflare SDK issue 8967: Wrangler Assets byte serving](https://github.com/cloudflare/workers-sdk/issues/8967)
