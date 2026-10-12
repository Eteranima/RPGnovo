import sharp from '../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = resolve(root, 'public/assets/v25/ui/stone-reach-hud-atlas.png');
const directory = resolve(root, 'public/pwa');
const crop = { left: 264, top: 975, width: 246, height: 246 };
const native = await sharp(source).extract(crop).png().toBuffer();
await mkdir(directory, { recursive: true });
const outputs = [];
for (const [name, size, ratio] of [['icon-192.png', 192, .82], ['icon-512.png', 512, .82], ['icon-maskable-512.png', 512, .66], ['apple-touch-icon.png', 180, .82]]) {
  const artSize = Math.round(size * ratio);
  const art = await sharp(native).resize(artSize, artSize, { kernel: 'lanczos3' }).png().toBuffer();
  const offset = Math.floor((size - artSize) / 2);
  const data = await sharp({ create: { width: size, height: size, channels: 4, background: '#0c1425' } }).composite([{ input: art, left: offset, top: offset }]).png().toBuffer();
  await writeFile(resolve(directory, name), data);
  outputs.push({ path: '/pwa/' + name, width: size, height: size, artSize, offset, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex') });
}
await writeFile(resolve(directory, 'provenance.json'), JSON.stringify({ source: '/assets/v25/ui/stone-reach-hud-atlas.png', sourceSha256: createHash('sha256').update(await readFile(source)).digest('hex'), crop, transformation: 'Approved HUD emblem extracted, resized only for platform icon sizes, centered on the existing navy brand color. No new illustration or text. Maskable art fits the centered 80% safe circle.', outputs }, null, 2) + '\n');
console.info('PWA icons exported from the approved Éter Anima emblem.');
