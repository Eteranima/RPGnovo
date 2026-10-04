from pathlib import Path
from PIL import Image
import json,shutil,hashlib
import numpy as np
root=Path(__file__).resolve().parents[3]
src=root/'art-source/v30/ui';out=root/'public/assets/v30/ui';out.mkdir(parents=True,exist_ok=True)
jobs=json.loads((src/'prompts.json').read_text(encoding='utf-8'));frames={};assets={};proof=[]

def copy_native(source,destination):
 # Archived sources can also be the selected input on another machine.
 if destination.exists() and source.samefile(destination):
  return
 shutil.copy2(source,destination)

def select_source(job,archive):
 original=Path(job['source'])
 if original.is_file():
  return original
 if archive.is_file():
  return archive
 raise FileNotFoundError(f'No generated or archived source for {job["key"]}: {original}; {archive}')

for job in jobs:
 key=job['key'];archive=src/(key+'.png');source=select_source(job,archive)
 copy_native(source,archive);target=out/(key+'.png');copy_native(source,target)
 assets[key]='/assets/v30/ui/'+key+'.png';img=Image.open(source);arr=np.asarray(img)
 cols,rows=(4,4) if key=='gacha-tier5-cinematic' else (4,2) if key.startswith('gacha-tier') else (2,3) if key=='gacha-plaques' else (1,1)
 crops=[]
 for index in range(cols*rows):
  x=index%cols*img.width//cols;y=index//cols*img.height//rows;ex=(index%cols+1)*img.width//cols;ey=(index//cols+1)*img.height//rows
  # Film frames have illustrated black separators, deliberately excluded from source rectangles.
  if key=='gacha-tier5-cinematic':x+=4;y+=4;ex-=4;ey-=4
  f={'x':x,'y':y,'w':ex-x,'h':ey-y};crops.append(f)
  if key=='gacha-plaques':
   crop=img.crop((x,y,ex,ey));pixel=np.asarray(crop);ys,xs=np.where(pixel[:,:,3]>210)
   if len(xs):
    bounds=(max(0,int(xs.min())-4),max(0,int(ys.min())-4),min(crop.width,int(xs.max())+5),min(crop.height,int(ys.max())+5));native=crop.crop(bounds);native.save(out/f'plaque-{index}.png');assets[f'plaque-{index}']=f'/assets/v30/ui/plaque-{index}.png'
    if not np.array_equal(np.asarray(native),pixel[bounds[1]:bounds[3],bounds[0]:bounds[2]]):raise RuntimeError('native crop mismatch')
  if 'A' in img.getbands():
   alpha=arr[y:ey,x:ex,3];border=np.concatenate((alpha[0],alpha[-1],alpha[:,0],alpha[:,-1]));proof.append({'key':key,'cell':index,'visibleBorderPixels':int(np.count_nonzero(border>210)),'transparentPixels':int(np.count_nonzero(alpha==0))})
 frames[key]=crops;job['status']='native bytes preserved; source grids inspected';job['sha256']=hashlib.sha256(source.read_bytes()).hexdigest();job['size']=[img.width,img.height]
(src/'manifest.json').write_text(json.dumps(jobs,ensure_ascii=False,indent=2),encoding='utf-8')
(src/'crops.json').write_text(json.dumps(frames,indent=2),encoding='utf-8')
(src/'alpha-proof.json').write_text(json.dumps(proof,indent=2),encoding='utf-8')
module=root/'lib/art/gachaV30.ts'
module.write_text('// Native generated artwork and source rectangles. No recoloring or synthetic alpha.\nexport const GACHA_ART_V30='+json.dumps(assets,indent=2)+' as const;\nexport const GACHA_FRAMES_V30='+json.dumps(frames,indent=2)+' as const;\n',encoding='utf-8')
print(json.dumps({'assets':len(assets),'frames':sum(map(len,frames.values())),'alphaBorders':sum(p['visibleBorderPixels'] for p in proof)}))
