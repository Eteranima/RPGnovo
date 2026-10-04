from PIL import Image
import numpy as np,json
from pathlib import Path
root=Path(r'C:/Users/Diego/OneDrive/Documentos/GitHub/RPGnovo')
for p in (root/'art-source/v30/combat').glob('*-source.png'):
 a=np.asarray(Image.open(p).getchannel('A'))
 print(p.name, {side:int((v>20).sum()) for side,v in [('top',a[0]),('bottom',a[-1]),('left',a[:,0]),('right',a[:,-1])]})
