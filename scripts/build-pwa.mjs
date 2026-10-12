import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const offlinePath = '/pwa-offline';
// Cloudflare's default HTML handling serves file.html at /file without a redirect.
const fixed = ['/manifest.webmanifest', offlinePath, '/pwa/icon-192.png', '/pwa/icon-512.png', '/pwa/icon-maskable-512.png', '/pwa/apple-touch-icon.png'];
async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? filesBelow(resolve(directory, entry.name)) : [resolve(directory, entry.name)]));
  return nested.flat();
}

async function runtimeAssetFingerprint(outDir) {
  const directory = resolve(outDir, 'assets');
  const files = await filesBelow(directory).catch(error => { if (error.code === 'ENOENT') return []; throw error; });
  const records = [];
  for (const file of files.sort()) {
    const hash = createHash('sha256');
    let bytes = 0;
    // Stream native bytes instead of buffering the large artwork/video collection.
    for await (const chunk of createReadStream(file)) { hash.update(chunk); bytes += chunk.length; }
    records.push({ url: '/' + relative(outDir, file).split(sep).join('/'), bytes, sha256: hash.digest('hex') });
  }
  return { files: records.length, bytes: records.reduce((sum, item) => sum + item.bytes, 0), sha256: createHash('sha256').update(JSON.stringify(records)).digest('hex') };
}

export async function buildPwa(outDir = resolve(root, 'dist/client')) {
  const template = await readFile(resolve(root, 'public/sw.js'), 'utf8');
  const built = (await filesBelow(resolve(outDir, '_next/static'))).filter(path => /\.(js|css|woff2)$/.test(path));
  if (!built.some(path => /\.js$/.test(path))) throw new Error('PWA: client JavaScript is missing. Run after the client build.');
  const assets = [...built.map(path => '/' + relative(outDir, path).split(sep).join('/')), ...fixed].sort();
  const hashes = [];
  let bytes = 0;
  for (const url of assets) {
    const path = resolve(outDir, '.' + (url === offlinePath ? '/pwa-offline.html' : url));
    const data = await readFile(path);
    bytes += data.length;
    hashes.push({ url, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex') });
  }
  if (bytes > 8 * 1024 * 1024) throw new Error(`PWA shell exceeded the 8 MiB budget (${bytes} bytes). Review the selection.`);
  // Prefer new versioned /assets/vNN URLs for future patches. Native content hashing also
  // catches same-URL replacements, additions and removals without precaching game assets.
  const runtimeAssets = await runtimeAssetFingerprint(outDir);
  const revision = createHash('sha256').update(template).update(JSON.stringify(hashes)).update(runtimeAssets.sha256).digest('hex').slice(0, 20);
  const offlineSha256 = hashes.find(asset => asset.url === offlinePath).sha256;
  const config = { revision, assets, offlinePath, offlineSha256, shellBytes: bytes, runtimeAssets, maxRuntimeEntries: 64, maxRuntimeBytes: 64 * 1024 * 1024, maxEntryBytes: 8 * 1024 * 1024 };
  const worker = template.replace('/* build:pwa-config */ null', JSON.stringify(config));
  if (worker === template) throw new Error('PWA template marker is missing.');
  await writeFile(resolve(outDir, 'sw.js'), worker);
  await writeFile(resolve(outDir, 'pwa-build.json'), JSON.stringify({ ...config, assets: hashes, rootHtml: 'Captured atomically on service-worker install; not bundled into the build.', media: 'Network only. All Range requests bypass the service worker.' }, null, 2) + '\n');
  console.info(`PWA ${revision}: ${assets.length} shell files, ${bytes} bytes; runtime bounded to 64 MiB.`);
  return config;
}

/** @returns {import('vite').Plugin} */
export function pwaBuildPlugin() {
  return {
    name: 'eter-anima-pwa', apply: 'build', enforce: 'post',
    closeBundle: {
      order: 'post', sequential: true,
      async handler() {
        if (this.environment?.name !== 'client') return;
        await buildPwa(resolve(root, this.environment.config.build.outDir || 'dist/client'));
      },
    },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const outDir = process.argv[2] ? resolve(process.argv[2]) : resolve(root, 'dist/client');
  await stat(outDir);
  await buildPwa(outDir);
}
