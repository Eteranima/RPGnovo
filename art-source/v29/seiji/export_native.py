"""Export pixel-identical native sheets/crops and measure their alpha bounds/foot anchors."""
from pathlib import Path
from PIL import Image
import numpy as np
import json, shutil, hashlib
from measure_native import components

ROOT=Path(__file__).resolve().parents[3]
FINAL={
 "seiji":{"walk":3,"attack":2,"cast":1,"ultimate":1,"vfx":1,"icons":1},
 "ophelia":{"walk":2,"attack":2,"cast":2,"ultimate":2,"vfx":1,"icons":1}
}
FACES={"seiji":(445,18,290,290),"ophelia":(354,15,336,336)}
ASSETS={}; FRAMES={}

def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()

def atlas(im,count,rows,body=True):
 a=np.asarray(im.getchannel('A'));w,h=im.size;cols=count//rows
 cc=components(a,32,10000)
 if len(cc)!=count:raise ValueError(f"Expected {count} primary components, found {len(cc)}")
 rr=[]
 for row in range(rows):
  these=[c for c in cc if int((c['y']+c['h']/2)*rows/h)==row]
  these.sort(key=lambda c:c['x']+c['w']/2)
  if len(these)!=cols:raise ValueError(f"row {row}: {len(these)}")
  rr.append(these)
 ybounds=[0]
 for row in range(rows-1):
  top=max(c['y']+c['h'] for c in rr[row]);bottom=min(c['y'] for c in rr[row+1])
  if bottom<top:raise ValueError(f"Overlapping rows: {top}>{bottom}")
  ybounds.append((top+bottom)//2)
 ybounds.append(h)
 out=[];metrics=[]
 for row,these in enumerate(rr):
  xbounds=[0]
  for i in range(cols-1):
   left=these[i]['x']+these[i]['w'];right=these[i+1]['x']
   if right<left:raise ValueError(f"Overlapping columns: {left}>{right}")
   xbounds.append((left+right)//2)
  xbounds.append(w)
  for col,c in enumerate(these):
   x0,x1=xbounds[col:col+2]
   y0=0 if row==0 else (rr[row-1][col]['y']+rr[row-1][col]['h']+c['y'])//2
   y1=h if row==rows-1 else (c['y']+c['h']+rr[row+1][col]['y'])//2
   if count==6 and body and c['x']==522 and c['y']==524:
    x1+=12  # Seiji's separate ivory talisman extends beyond the main body component.
   yy,xx=np.nonzero(a[y0:y1,x0:x1]>20)
   bx0=max(x0,x0+int(xx.min())-2);by0=max(y0,y0+int(yy.min())-2)
   bx1=min(x1,x0+int(xx.max())+3);by1=min(y1,y0+int(yy.max())+3)
   cut=a[by0:by1,bx0:bx1]
   edge=np.r_[cut[0,:],cut[-1,:],cut[:,0],cut[:,-1]]
   if body:
    ca=a[c['y']:c['y']+c['h'],c['x']:c['x']+c['w']]
    fy,fx=np.nonzero(ca>200)
    bottom=int(fy.max())
    feet_x=fx[fy>=bottom-7]
    ax=round(c['x']+float(np.median(feet_x)),1)
    ay=c['y']+bottom
   else: ax=round((bx0+bx1)/2,1);ay=round((by0+by1)/2,1)
   out.append(dict(x=bx0,y=by0,w=bx1-bx0,h=by1-by0,anchorX=ax,anchorY=ay))
   metrics.append(dict(primary=c,partition=[x0,y0,x1-x0,y1-y0],alpha0Percent=round(float((cut==0).mean()*100),2),edgePixelsAbove20=int((edge>20).sum())))
 return out,metrics

for hero,items in FINAL.items():
 source=ROOT/'art-source'/'v29'/hero;runtime=ROOT/'public'/'assets'/'v29'/hero
 runtime.mkdir(parents=True,exist_ok=True)
 review=source/'review';review.mkdir(exist_ok=True)
 manifest=dict(hero=hero,tool='built-in imagegen',pixelPolicy='Generated native RGBA; exports only copy or rectangular crop, no resize/repaint/masking/alpha replacement.',element='Tinta' if hero=='seiji' else 'Gelo / cura',walkOrder=['S','S','S','W','W','W','E','E','E','N','N','N'],combatFacing='RIGHT',vfxOrder=['basic-impact','projectile-slash','healing-protection','control-seal','signature','ultimate'],iconOrder=['magic-attack','base-skill-1','base-skill-2','control','signature','ultimate'],assets={})
 portrait=runtime/'portrait.png'
 ASSETS['portrait_'+hero]='/assets/v29/'+hero+'/portrait.png'
 ASSETS['dlg_'+hero]=ASSETS['portrait_'+hero]
 face=FACES[hero];im=Image.open(portrait)
 im.crop((face[0],face[1],face[0]+face[2],face[1]+face[3])).save(runtime/'face.png')
 assert np.array_equal(np.asarray(Image.open(runtime/'face.png')),np.asarray(im)[face[1]:face[1]+face[3],face[0]:face[0]+face[2]])
 ASSETS['face_'+hero]='/assets/v29/'+hero+'/face.png'
 manifest['portrait']=dict(size=list(im.size),sha256=sha(portrait),faceCrop=dict(x=face[0],y=face[1],w=face[2],h=face[3]),alpha0Percent=round(float((np.asarray(im.getchannel('A'))==0).mean()*100),2))
 for asset,rev in items.items():
  src=source/f'{asset}-r{rev}-source.png'
  dest=runtime/f'{asset}.png'
  im=Image.open(src)
  nativeBox=[0,0,*im.size]
  if hero=='seiji' and asset=='walk' and rev==2:
   nativeBox=[27,0,im.width-27,im.height]
   im=im.crop((27,0,im.width,im.height));im.save(dest)
   assert np.array_equal(np.asarray(Image.open(dest)),np.asarray(Image.open(src))[:,27:])
  else: shutil.copy2(src,dest)
  count,rows=(12,4) if asset=='walk' else (8,2) if asset=='ultimate' else (6,2)
  frames,metrics=atlas(im,count,rows,asset not in ['vfx','icons'])
  key=hero if asset=='walk' else f'battle_fx_{hero}' if asset=='vfx' else f'skill_icons_{hero}' if asset=='icons' else f'battle_{hero}_{asset}'
  ASSETS[key]=f'/assets/v29/{hero}/{asset}.png';FRAMES[key]=frames
  manifest['assets'][asset]=dict(source=src.name,revision=rev,nativeSourceBox=nativeBox,size=list(im.size),sha256=sha(dest),frames=frames,measurements=metrics)
  for i in ([0,3,6,11] if asset=='walk' else [0,3] if asset in ['attack','cast'] else [1,5] if asset=='ultimate' else []):
   f=frames[i];im.crop((f['x'],f['y'],f['x']+f['w'],f['y']+f['h'])).save(review/f'{asset}-{i}.png')
  if asset=='icons':
   (runtime/'icons').mkdir(exist_ok=True)
   for i,f in enumerate(frames):
    target=runtime/'icons'/f'{i}.png'
    im.crop((f['x'],f['y'],f['x']+f['w'],f['y']+f['h'])).save(target)
    assert np.array_equal(np.asarray(Image.open(target)),np.asarray(im)[f['y']:f['y']+f['h'],f['x']:f['x']+f['w']])
    ASSETS[f'skill_icon_{hero}_{i}']=f'/assets/v29/{hero}/icons/{i}.png'
 (source/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(json.dumps(dict(hero=hero,assets=len(manifest['assets']),frames=sum(len(a['frames']) for a in manifest['assets'].values()),edgeAbove20={name:[m['edgePixelsAbove20'] for m in a['measurements']] for name,a in manifest['assets'].items()})))

module="import type {SpriteCrop} from './sprites';\n\n// v29 native anime assets; prompts, source boxes and alpha/foot measurements: art-source/v29/{hero}.\n// Walk crops follow S/W/E/N; combat poses all face right. Gameplay is unchanged by this art map.\n"
module+="export const REMAKE_ASSETS_SEIJI_OPHELIA: Record<string,string> = "+json.dumps(ASSETS,ensure_ascii=False,indent=2)+";\n\n"
module+="export const REMAKE_FRAMES_SEIJI_OPHELIA: Record<string,SpriteCrop[]> = "+json.dumps(FRAMES,ensure_ascii=False,indent=2)+";\n"
(ROOT/'lib'/'game'/'remakeArtSeijiOphelia.ts').write_text(module,encoding='utf-8')

