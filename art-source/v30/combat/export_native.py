from pathlib import Path
from PIL import Image
import numpy as np, json, hashlib, shutil
ROOT=Path(__file__).resolve().parents[3];SRC=ROOT/'art-source/v30/combat';DEST=ROOT/'public/assets/v30/combat'
DEST.mkdir(parents=True,exist_ok=True)
ASSETS={};FRAMES={};MAN=dict(tool='built-in imagegen',pixelPolicy='Native generated RGBA, only copy or rectangular crop; no pixel paint/resize/mask.',assets={})
def measured(im,region,pad=2):
 a=np.asarray(im.getchannel('A'));x,y,w,h=region
 yy,xx=np.nonzero(a[y:y+h,x:x+w]>20)
 x0=max(x,x+int(xx.min())-pad);y0=max(y,y+int(yy.min())-pad)
 x1=min(x+w,x+int(xx.max())+pad+1);y1=min(y+h,y+int(yy.max())+pad+1)
 cut=a[y0:y1,x0:x1];edge=np.r_[cut[0],cut[-1],cut[:,0],cut[:,-1]]
 return [x0,y0,x1-x0,y1-y0],dict(alpha0Percent=round(float((cut==0).mean()*100),2),edgePixelsAbove20=int((edge>20).sum()))
def export(name,source,region):
 im=Image.open(SRC/source);box,qa=measured(im,region)
 x,y,w,h=box;out=im.crop((x,y,x+w,y+h));dest=DEST/(name+'.png');out.save(dest)
 assert np.array_equal(np.asarray(out),np.asarray(im)[y:y+h,x:x+w])
 ASSETS[name]='/assets/v30/combat/'+name+'.png';FRAMES[name]=[dict(x=0,y=0,w=w,h=h,anchorX=w/2,anchorY=h/2)]
 MAN['assets'][name]=dict(source=source,nativeSourceBox=box,size=[w,h],sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),**qa)
for name,region in zip(['turn_active','turn_waiting','turn_enemy'],[[0,80,1024,480],[0,560,1024,450],[0,1010,1024,470]]):
 export(name,'turn-plates-source.png',region)
export('victory_emblem','victory-ui-source.png',[0,0,1024,1070])
export('victory_continue','victory-ui-source.png',[0,1070,1024,466])
source=SRC/'victory-celebration-source.png';dest=DEST/'victory_celebration.png';shutil.copy2(source,dest)
im=Image.open(source);w,h=im.size;frames=[];measurements=[]
for row in range(2):
 for col in range(4):
  x0=round(col*w/4);x1=round((col+1)*w/4);y0=round(row*h/2);y1=round((row+1)*h/2)
  box,qa=measured(im,[x0,y0,x1-x0,y1-y0]);x,y,cw,ch=box
  frames.append(dict(x=x,y=y,w=cw,h=ch,anchorX=(x0+x1)/2,anchorY=(y0+y1)/2))
  measurements.append(dict(nativeSourceBox=box,**qa))
ASSETS['victory_celebration']='/assets/v30/combat/victory_celebration.png';FRAMES['victory_celebration']=frames
MAN['assets']['victory_celebration']=dict(source=source.name,size=[w,h],frames=frames,measurements=measurements,sha256=hashlib.sha256(dest.read_bytes()).hexdigest())
(SRC/'manifest.json').write_text(json.dumps(MAN,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
module="import type {SpriteCrop} from '../game/sprites';\n\n// v30 original native combat sprites; prompts and measurements: art-source/v30/combat.\n"
module+="export const COMBAT_V30_ASSETS:Record<string,string>="+json.dumps(ASSETS,indent=2)+";\n\n"
module+="export const COMBAT_V30_FRAMES:Record<string,SpriteCrop[]>="+json.dumps(FRAMES,indent=2)+";\n"
(ROOT/'lib/art/combatV30.ts').write_text(module,encoding='utf-8')
print(json.dumps(MAN))
