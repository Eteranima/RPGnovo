from pathlib import Path
from PIL import Image
import json,numpy as np
root=Path(r'C:/Users/Diego/OneDrive/Documentos/GitHub/RPGnovo')
for hero in ['seiji','ophelia']:
 m=json.loads((root/'art-source'/'v29'/hero/'manifest.json').read_text(encoding='utf-8'))
 for asset,a in m['assets'].items():
  alpha=np.asarray(Image.open(root/'public'/'assets'/'v29'/hero/(asset+'.png')).getchannel('A'))
  for i,(f,metric) in enumerate(zip(a['frames'],a['measurements'])):
   if not metric['edgePixelsAbove20']:continue
   x,y,w,h=[f[k] for k in ['x','y','w','h']]; cut=alpha[y:y+h,x:x+w]
   print(json.dumps(dict(hero=hero,asset=asset,index=i,frame=f,partition=metric['partition'],primary=metric['primary'],edges={name: [[int(p),int(v)] for p,v in enumerate(row) if v>20] for name,row in [('top',cut[0]),('bottom',cut[-1]),('left',cut[:,0]),('right',cut[:,-1])]})))

