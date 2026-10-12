import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
// Keep this allowlist explicit: no arbitrary public files or remote origins.
export const MEDIA_PATHS = Object.freeze([
  '/assets/v33/opening/eter-anima-opening-24fps.mp4',
  '/assets/v34/quest-cinematics/long-tinta.mp4',
  '/assets/v34/quest-cinematics/long-geada.mp4',
  '/assets/v34/quest-cinematics/long-brasa.mp4',
  '/assets/v34/quest-cinematics/long-trovao.mp4',
  '/assets/v34/quest-cinematics/long-nulo.mp4',
]);

export async function collectMediaManifest(publicRoot = resolve(root, 'public')) {
  const manifest = {};
  for (const url of MEDIA_PATHS) {
    const file = resolve(publicRoot, '.' + url);
    const before = await stat(file);
    if (!before.isFile() || !Number.isSafeInteger(before.size) || before.size <= 0) throw new Error(`Invalid media asset: ${url}`);
    const hash = createHash('sha256');
    let bytes = 0;
    for await (const chunk of createReadStream(file)) { hash.update(chunk); bytes += chunk.byteLength; }
    const after = await stat(file);
    if (bytes !== before.size || after.size !== before.size || after.mtimeMs !== before.mtimeMs) throw new Error(`Media changed while preparing the build: ${url}`);
    manifest[url] = { bytes, sha256: hash.digest('hex') };
  }
  return manifest;
}

export async function buildMediaManifest(publicRoot, output = resolve(root, 'worker/media-manifest.ts')) {
  const manifest = await collectMediaManifest(publicRoot);
  await writeFile(output, '// Generated before bundling by scripts/build-media-manifest.mjs. Do not edit.\n'
    + 'export const MEDIA_MANIFEST = ' + JSON.stringify(manifest, null, 2) + ' as const;\n');
  return manifest;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildMediaManifest();
  console.info(`Prepared byte lengths and native hashes for ${MEDIA_PATHS.length} videos.`);
}
