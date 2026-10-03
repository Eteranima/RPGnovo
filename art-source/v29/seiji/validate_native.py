from pathlib import Path
from PIL import Image
import json,numpy as np
root=Path(r'C:/Users/Diego/OneDrive/Documentos/GitHub/RPGnovo')
total=0
for hero in ['seiji','ophelia']:
 m=json.loads((root/'art-source'/'v29'/hero/'manifest.json').read_text(encoding='utf-8'))
 for name,a in m['assets'].items():
  path=root/'public'/'assets'/'v29'/hero/(name+'.png');im=Image.open(path);w,h=im.size
  source=Image.open(root/'art-source'/'v29'/hero/a['source'])
  assert np.array_equal(np.asarray(im),np.asarray(source))
  for f,metric in zip(a['frames'],a['measurements']):
   assert 0<=f['x']<f['x']+f['w']<=w and 0<=f['y']<f['y']+f['h']<=h
   assert f['x']<=f['anchorX']<=f['x']+f['w'] and f['y']<=f['anchorY']<=f['y']+f['h']
   assert metric['edgePixelsAbove20']==0
   total+=1
  for i,f in enumerate(a['frames']):
   for q in a['frames'][i+1:]:
    assert min(f['x']+f['w'],q['x']+q['w'])<=max(f['x'],q['x']) or min(f['y']+f['h'],q['y']+q['h'])<=max(f['y'],q['y']), (hero,name,'crop-overlap')
 print(hero,'native RGBA equality, anchor bounds and non-overlapping frame rectangles: PASS')
print('Validated',total,'frames; 28 runtime PNGs.')

