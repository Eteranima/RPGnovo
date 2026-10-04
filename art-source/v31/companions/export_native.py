"""Byte-copy native fullbody RGBA; rectangular face crops preserve every source pixel."""
from pathlib import Path
from PIL import Image
import numpy as np
import hashlib, json, shutil
ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
FACES = {'umbra': (270,20,650,650), 'mika': (275,35,565,565), 'shin': (180,90,600,600), 'vajra': (150,35,620,620), 'dante': (380,12,520,520)}
entries = []; checks = 0
for name,(x,y,w,h) in FACES.items():
 source = HERE / f'{name}-source.png'
 out = ROOT / f'public/assets/v31/companions/{name}'
 out.mkdir(parents=True,exist_ok=True)
 fullbody,face = out/'fullbody.png',out/'face.png'
 if source.resolve()!=fullbody.resolve(): shutil.copyfile(source,fullbody)
 im = Image.open(source)
 assert im.mode=='RGBA'
 a=np.asarray(im.getchannel('A'))
 edge=int(np.count_nonzero(np.r_[a[0],a[-1],a[:,0],a[:,-1]]>24))
 assert edge==0, (name,'clipped canvas edge',edge)
 assert np.count_nonzero(a==0)>a.size*.35, (name,'opaque background')
 assert x>=0 and y>=0 and x+w<=im.width and y+h<=im.height
 crop=im.crop((x,y,x+w,y+h));crop.save(face)
 assert np.array_equal(np.asarray(Image.open(face)),np.asarray(im)[y:y+h,x:x+w])
 assert hashlib.sha256(source.read_bytes()).digest()==hashlib.sha256(fullbody.read_bytes()).digest()
 entries.append(dict(id=name,source=source.name,size=list(im.size),faceCrop=dict(x=x,y=y,w=w,h=h),alpha0Percent=round(float((a==0).mean()*100),2),visibleCanvasEdgePixels=edge,sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest(),fullbody=f'/assets/v31/companions/{name}/fullbody.png',face=f'/assets/v31/companions/{name}/face.png',faceNativeRgbaExact=True))
 checks+=6
manifest=dict(tool='built-in image_gen',processing='Byte-copy original RGBA; only native rectangular crops for faces. No repaint/resize/recolour.',canonicalReferences=['public/assets/v30/ui/opening-companions.png','public/assets/v30/ui/opening-ink-garden.png','public/assets/v30/ui/opening-star-watch.png'],heroMapping=dict(seiji='shin',ophelia='mika',marin='umbra',max='vajra',gabriel='dante'),checks=checks,entries=entries,rejection='Original Shin clipped left brush/right hair; repaired through built-in imagegen. Rejected source archived.')
(HERE/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(dict(companions=5,runtimePNGs=10,checks=checks)))
