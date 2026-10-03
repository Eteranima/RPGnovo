from pathlib import Path
from PIL import Image
from collections import deque
import json
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
manifest=json.loads((HERE/"manifest.json").read_text(encoding="utf-8"))
SEEDS={'portrait-ring': (264, 724), 'hp-vessel': (1100, 655), 'mp-vessel': (1100, 855), 'card-frame': (275, 275)}
for name,(sourceX,sourceY) in SEEDS.items():
 asset=manifest["assets"][name];box=asset["sourceBox"]
 im=Image.open(ROOT/("public"+asset["path"]));alpha=im.getchannel("A");pixels=alpha.load();w,h=im.size
 seed=(sourceX-box[0],sourceY-box[1]);assert pixels[seed]<=24
 queue=deque([seed]);seen={seed};minX=maxX=seed[0];minY=maxY=seed[1];clear=0
 while queue:
  x,y=queue.popleft();minX=min(minX,x);maxX=max(maxX,x);minY=min(minY,y);maxY=max(maxY,y);clear+=pixels[x,y]==0
  for xx,yy in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
   if 0<=xx<w and 0<=yy<h and (xx,yy)not in seen and pixels[xx,yy]<=24:seen.add((xx,yy));queue.append((xx,yy))
 assert minX>0 and minY>0 and maxX<w-1 and maxY<h-1,"Internal opening must not connect to canvas exterior"
 field="framePortraitOpening"if name=="card-frame"else"opening"
 opening={"x":minX,"y":minY,"w":maxX-minX+1,"h":maxY-minY+1}
 asset[field]=opening
 asset[field+"Percent"]={"left":round(minX/w*100,3),"top":round(minY/h*100,3),"width":round(opening["w"]/w*100,3),"height":round(opening["h"]/h*100,3)}
 asset["openingTransparency"]={"componentThreshold":24,"componentPixels":len(seen),"fullyTransparentPixels":clear,"seed":seed}
manifest["measuredClearancesAboveAlpha24"]={'cardToRing': 42, 'ringToBars': 49, 'hpToMp': 24}
(HERE/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
