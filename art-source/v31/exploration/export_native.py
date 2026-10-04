"""Measure generated RGBA, copy whole sheets, and export TypeScript crops. No repaint/resize."""
from pathlib import Path
from PIL import Image
import numpy as np
import hashlib, json, shutil, importlib.util

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
OUT = ROOT / 'public/assets/v31/exploration'
OUT.mkdir(parents=True, exist_ok=True)
spec = importlib.util.spec_from_file_location('native_alpha', ROOT / 'art-source/v29/seiji/measure_native.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
DIRS = ('south', 'west', 'east', 'north')
# Torso/feet axes read from the native sheets, never from floating cloak tips/staffs.
AXES = {
 'abel_south': [210,582,953,1330,201,582,950,1331],
 'abel_west': [168,550,935,1324,168,550,935,1326],
 'abel_east': [225,615,999,1382,230,615,1000,1384],
 'abel_north': [199,599,973,1349,205,601,978,1343],
 'orfeu_south': [205,580,960,1333,201,582,960,1334],
 'orfeu_west': [204,574,948,1342,202,583,955,1341],
 'orfeu_east': [201,599,967,1360,199,604,966,1360],
 'orfeu_north': [208,593,958,1338,201,593,959,1338],
}

def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def edge_count(a, threshold=24):
 return int(np.count_nonzero(np.r_[a[0], a[-1], a[:,0], a[:,-1]] > threshold))

assets, frames, sheets = {}, {}, []
checks = 0
for hero in ('abel','orfeu'):
 for direction in DIRS:
  source = HERE / f'{hero}-{direction}-source.png'
  runtime = OUT / f'{hero}-{direction}-walk.png'
  if source.resolve() != runtime.resolve(): shutil.copyfile(source, runtime)
  im = Image.open(source)
  assert im.mode == 'RGBA', f'{source}: expected native RGBA'
  a = np.asarray(im.getchannel('A'))
  bodies = native.components(a, threshold=32, min_pixels=10000)
  assert len(bodies) == 8, (source, len(bodies))
  bodies = sorted(bodies, key=lambda b: (int((b['y']+b['h']/2) >= im.height/2), b['x']))
  key = f'walk_{hero}_{direction}'
  crops, proof = [], []
  for i,b in enumerate(bodies):
   left,top,right,bottom = b['x'],b['y'],b['x']+b['w'],b['y']+b['h']
   # Expand the measured body until the RGBA alpha edge is empty at visible threshold.
   pad = 4
   while True:
    box = (max(0,left-pad),max(0,top-pad),min(im.width,right+pad),min(im.height,bottom+pad))
    tile = a[box[1]:box[3],box[0]:box[2]]
    if edge_count(tile) == 0: break
    pad += 1
    assert pad <= 16, f'{key}[{i}]: neighbour/cut on native crop edge'
   x,y,r,bt = box
   crop = dict(x=x,y=y,w=r-x,h=bt-y,anchorX=AXES[f'{hero}_{direction}'][i],anchorY=bottom-2)
   assert x < crop['anchorX'] < r and y < crop['anchorY'] <= bt
   comps = native.components(tile, threshold=32, min_pixels=1000)
   assert len(comps) == 1, f'{key}[{i}]: neighbouring body fragment entered crop'
   # Native silhouettes are visibly different poses, not repeated bytes.
   rgba = np.asarray(im)[y:bt,x:r]
   proof.append(dict(index=i,body=b,crop=crop,alpha0=int(np.count_nonzero(tile==0)),visibleEdgePixels=edge_count(tile),rgbaSha256=hashlib.sha256(rgba.tobytes()).hexdigest()))
   crops.append(crop)
   checks += 5
  assert len(set(p['rgbaSha256'] for p in proof)) == 8
  assert sha(source) == sha(runtime)
  assert edge_count(a) == 0
  checks += 5
  assets[key] = f'/assets/v31/exploration/{runtime.name}'
  frames[key] = crops
  sheets.append(dict(hero=hero,direction=direction,source=source.name,runtime=assets[key],size=list(im.size),mode=im.mode,alpha0Percent=round(float((a==0).mean()*100),2),sourceSha256=sha(source),runtimeSha256=sha(runtime),frames=proof))
 # The existing actor key remains a real south sheet for loading/backwards compatibility.
 assets[hero] = assets[f'walk_{hero}_south']
 frames[hero] = frames[f'walk_{hero}_south']

manifest = dict(tool='built-in image_gen',processing='Whole native PNG byte copy; alpha measurement only; no repaint, resizing or mirroring.',order=list(DIRS),framesPerDirection=8,totalFrames=64,anchorMethod='Manual torso axis; measured lowest boot baseline minus2 native pixels.',checks=checks,sheets=sheets,rejected=['First32-frame sheets repeated stride; replaced by directional eight-phase sources.','First Abel side sheets had insufficient rectangular gutters; replaced via imagegen spacing edits.'])
(HERE / 'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
header = "import type { SpriteCrop } from './sprites';\n\n// Eight native poses per direction; S/W/E/N, never mirrored.\n"
source = header + 'export const EXPLORATION_ASSETS_V31: Record<string, string> = '+json.dumps(assets,indent=2)+';\n\n'
source += 'export const EXPLORATION_FRAMES_V31: Record<string, SpriteCrop[]> = '+json.dumps(frames,separators=(',',':'))+';\n\n'
source += """export const EXPLORATION_DIRECTIONS_V31 = ['south', 'west', 'east', 'north'] as const;
export const EXPLORATION_FRAME_MS_V31 = 95;
export const EXPLORATION_IDLE_FRAME_V31 = 2;

/** Existing actor IDs work for NPC Abel as well as playable Orfeu. */
export function explorationWalkFrame(actor: string, facing: number, time: number, moving: boolean): { key: string; index: number; crop: SpriteCrop } | undefined {
  if (actor !== 'abel' && actor !== 'orfeu') return undefined;
  const direction = EXPLORATION_DIRECTIONS_V31[Math.max(0, Math.min(3, Number.isFinite(facing) ? Math.trunc(facing) : 0))];
  const key = `walk_${actor}_${direction}`;
  const index = moving ? Math.floor(Math.max(0, Number.isFinite(time) ? time : 0) / EXPLORATION_FRAME_MS_V31) % 8 : EXPLORATION_IDLE_FRAME_V31;
  return { key, index, crop: EXPLORATION_FRAMES_V31[key][index] };
}
"""
(ROOT / 'lib/game/explorationArtV31.ts').write_text(source,encoding='utf-8')
print(json.dumps(dict(sheets=len(sheets),frames=64,checks=checks,bytes=sum((OUT/Path(x['runtime']).name).stat().st_size for x in sheets))))
