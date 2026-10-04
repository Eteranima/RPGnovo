from pathlib import Path
from PIL import Image
import numpy as np,json
ROOT=Path(__file__).resolve().parents[3];SRC=ROOT/'art-source/v30/combat';DEST=ROOT/'public/assets/v30/combat'
m=json.loads((SRC/'manifest.json').read_text(encoding='utf-8'));checks=0
for name,asset in m['assets'].items():
 out=np.asarray(Image.open(DEST/(name+'.png')))
 source=np.asarray(Image.open(SRC/asset['source']))
 if name!='victory_celebration':
  x,y,w,h=asset['nativeSourceBox'];assert np.array_equal(out,source[y:y+h,x:x+w]);assert asset['edgePixelsAbove20']==0;checks+=2
 else:
  assert np.array_equal(out,source);checks+=1
  for frame,qa in zip(asset['frames'],asset['measurements']):
   assert qa['edgePixelsAbove20']==0
   assert frame['x']<=frame['anchorX']<=frame['x']+frame['w']
   assert frame['y']<=frame['anchorY']<=frame['y']+frame['h']
   checks+=3
  frames=asset['frames']
  for i,f in enumerate(frames):
   for q in frames[i+1:]:
    assert min(f['x']+f['w'],q['x']+q['w'])<=max(f['x'],q['x']) or min(f['y']+f['h'],q['y']+q['h'])<=max(f['y'],q['y'])
    checks+=1
print('PASS',checks,'checks: native RGBA equality, isolated celebration cells, anchors and transparent borders.')
