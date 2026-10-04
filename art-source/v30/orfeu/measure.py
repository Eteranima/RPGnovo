"""Read native RGBA alpha; export rectangle icon crops without scaling/painting."""
from pathlib import Path
from PIL import Image
import numpy as np
import hashlib,json

ROOT=Path(__file__).resolve().parents[3]
ART=ROOT/"art-source/v30/orfeu"
OUT=ROOT/"public/assets/v30/orfeu"
SPECS={"cast":(3,2,"battle_orfeu_cast"),"ultimate":(4,2,"battle_orfeu_ultimate"),
       "vfx":(3,2,"battle_fx_orfeu"),"icons":(3,2,"skill_icons_orfeu")}
AXES={"cast":[230,750,1250,235,740,1250],
      "ultimate":[200,565,955,1355,200,550,985,1355]}
VFX_ORDER=["impacto físico","Palma de Ruptura","Guarda Nula","silêncio antimágico","ruptura ampla","Domínio Nulo"]
ICON_ORDER=["ataque físico","Palma de Ruptura","Guarda Nula","silêncio antimágico","ruptura ampla","Domínio Nulo"]
THRESHOLD=24

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def cut(counts,nominal,radius):
    lo=max(0,int(nominal-radius));hi=min(len(counts),int(nominal+radius))
    z=np.flatnonzero(counts[lo:hi]==0)+lo
    runs=np.split(z,np.flatnonzero(np.diff(z)>1)+1)
    runs=[g for g in runs if len(g)>=2]
    if not runs:
        raise ValueError(f"No empty two-pixel alpha corridor near {nominal}")
    run=min(runs,key=lambda g:abs(float(g.mean())-nominal))
    return int(run[len(run)//2]),[int(run[0]),int(run[-1])]

assets={};frames={}
for state,(cols,rows,key) in SPECS.items():
    source=ART/(state+"-source.png")
    runtime=OUT/(state+".png")
    im=Image.open(source)
    assert im.mode=="RGBA"
    assert np.array_equal(np.array(im),np.array(Image.open(runtime)))
    alpha=np.array(im.getchannel("A"));v=alpha>THRESHOLD
    h,w=v.shape;yc=[0];row_gaps=[]
    for k in range(1,rows):
        y,gap=cut(v.sum(axis=1),k*h/rows,75);yc.append(y);row_gaps.append(gap)
    yc.append(h);crops=[];cells=[];column_gaps=[]
    for row in range(rows):
        xc=[0];gaps=[]
        for k in range(1,cols):
            x,gap=cut(v[yc[row]:yc[row+1]].sum(axis=0),k*w/cols,100)
            xc.append(x);gaps.append(gap)
        xc.append(w);column_gaps.append(gaps)
        for col in range(cols):
            mask=v[yc[row]:yc[row+1],xc[col]:xc[col+1]]
            yy,xx=np.nonzero(mask)
            assert len(xx)
            x=max(xc[col],xc[col]+int(xx.min())-2)
            y=max(yc[row],yc[row]+int(yy.min())-2)
            right=min(xc[col+1],xc[col]+int(xx.max())+3)
            bottom=min(yc[row+1],yc[row]+int(yy.max())+3)
            i=len(crops)
            anchor_x=AXES[state][i] if state in AXES else (x+right)/2
            anchor_y=yc[row]+int(yy.max()) if state in AXES else (y+bottom)/2
            c={"x":x,"y":y,"w":right-x,"h":bottom-y,"anchorX":anchor_x,"anchorY":anchor_y}
            local=v[y:bottom,x:right]
            edge=int(local[0].sum()+local[-1].sum()+local[:,0].sum()+local[:,-1].sum())
            assert edge==0,(state,i)
            crops.append(c)
            cell={"index":i,"row":row,"col":col,"crop":c,"visibleCropEdgePixels":edge}
            if state=="icons":
                (OUT/"icons").mkdir(exist_ok=True)
                path=OUT/"icons"/(str(i)+".png")
                native=im.crop((x,y,right,bottom));native.save(path)
                assert np.array_equal(np.array(native),np.array(Image.open(path)))
                icon_key=f"skill_icon_orfeu_{i}"
                assets[icon_key]=f"/assets/v30/orfeu/icons/{i}.png"
                cell.update({"runtime":assets[icon_key],"sha256":sha(path),"meaning":ICON_ORDER[i]})
            elif state=="vfx":
                cell["meaning"]=VFX_ORDER[i]
            cells.append(cell)
    assets[key]=f"/assets/v30/orfeu/{state}.png";frames[key]=crops
    edge=int(v[0].sum()+v[-1].sum()+v[:,0].sum()+v[:,-1].sum())
    assert edge==0
    info={"source":source.name,"runtime":assets[key],"key":key,"sha256":sha(source),
          "size":[w,h],"mode":im.mode,"alphaMin":int(alpha.min()),"alphaMax":int(alpha.max()),
          "fullyTransparentPixels":int((alpha==0).sum()),"visibleEdgePixels":edge,
          "visibleAlphaThreshold":THRESHOLD,"rowCuts":yc,"rowEmptyCorridorsInclusive":row_gaps,
          "columnEmptyCorridorsInclusive":column_gaps,"columns":cols,"rows":rows,
          "combatFacing":"right" if state in AXES else None,"cells":cells,
          "anchorMethod":"waist axis visually measured; feet from opaque bottom; VFX/icons centered",
          "pixelTransform":"none; native RGBA copied, icons rectangle crops only",
          "outsideArtworkAlphaSamples":[{"x":px,"y":py,"alpha":int(alpha[py,px])}
             for px,py in [(0,0),(w-1,h-1),(w//3,0),(w//2,yc[1])]]}
    (ART/(state+"-manifest.json")).write_text(json.dumps(info,indent=2,ensure_ascii=False),encoding="utf-8")
    print(json.dumps({"state":state,"count":len(crops),"emptyCropEdges":True,"nativePixels":True,"size":[w,h]}))
module=ROOT/"lib/game/orfeuArtV30.ts"
module.write_text("import type { SpriteCrop } from './sprites';\n\n"
    "// v30 Orfeu: neutral physical/anti-magic artwork, native measured RGBA crops.\n"
    "// Portrait, walk and basic attack remain the approved prior artwork.\n"
    "export const ORFEU_ASSETS_V30: Record<string,string> = "+json.dumps(assets,indent=2)+";\n\n"
    "export const ORFEU_FRAMES_V30: Record<string,SpriteCrop[]> = "+json.dumps(frames,indent=2)+";\n",
    encoding="utf-8")
print(json.dumps({"runtimePNGs":len(list(OUT.rglob("*.png"))),"assetKeys":len(assets),"frameKeys":len(frames)}))
