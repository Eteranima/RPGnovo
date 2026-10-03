"""Measure native RGBA atlases and export only unmodified rectangle crops.

All generation/editing is performed by built-in imagegen. This file reads alpha,
finds genuine empty corridors, stores native source crop/feet metadata, and
exports face/icon rectangles without scaling or painting any pixels.
"""
from pathlib import Path
from PIL import Image
import numpy as np
import json, hashlib

ROOT = Path(__file__).resolve().parents[3]
HEROES = ["gabriel", "gabriel_lycan", "marin", "max"]
LAYOUTS = {"walk": (3,4), "attack": (3,2), "cast": (3,2),
           "ultimate": (4,2), "vfx": (3,2), "icons": (3,2)}
FACE_CROPS = {"gabriel": [280,0,300,285], "gabriel_lycan": [310,0,330,330],
              "marin": [350,0,290,290], "max": [420,0,270,270]}
THRESHOLD = 24
BODY_AXES = {
    'gabriel': {
        'attack': [280,805,1285,285,790,1280],
        'cast': [270,775,1290,260,740,1285],
        'ultimate': [200,580,990,1380,185,555,980,1340]},
    'gabriel_lycan': {
        'attack': [255,810,1285,285,790,1285],
        'cast': [265,790,1320,230,770,1320],
        'ultimate': [225,610,965,1355,185,555,965,1340]},
    'marin': {
        'attack': [245,780,1265,290,815,1275],
        'cast': [260,775,1305,295,815,1305],
        'ultimate': [210,610,990,1360,235,615,985,1360]},
    'max': {
        'attack': [235,790,1240,285,775,1260],
        'cast': [248,780,1260,270,745,1270],
        'ultimate': [190,560,965,1340,190,570,980,1350]}}

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def empty_cut(counts, nominal, radius):
    lo = max(0, int(nominal-radius))
    hi = min(len(counts), int(nominal+radius))
    zeros = np.flatnonzero(counts[lo:hi] == 0) + lo
    if not len(zeros):
        raise ValueError(f"No empty visible-alpha corridor near {nominal}")
    groups = np.split(zeros, np.flatnonzero(np.diff(zeros) > 1) + 1)
    usable = [g for g in groups if len(g) >= 2]
    if not usable:
        raise ValueError(f"No two-pixel empty corridor near {nominal}")
    run = min(usable, key=lambda g: abs(float(g.mean()) - nominal))
    return int(run[len(run)//2]), [int(run[0]), int(run[-1])]

def opaque_bounds(mask):
    yy, xx = np.nonzero(mask)
    return [int(xx.min()), int(yy.min()), int(xx.max()+1), int(yy.max()+1)]

def alpha_stats(image):
    a = np.array(image.getchannel("A"))
    v = a > THRESHOLD
    return {"mode": image.mode, "size": list(image.size),
            "alphaMin": int(a.min()), "alphaMax": int(a.max()),
            "fullyTransparentPixels": int((a==0).sum()),
            "visiblePixels": int(v.sum()), "visibleBoundsXYXY": opaque_bounds(v),
            "visibleEdgePixels": int(v[0].sum()+v[-1].sum()+v[:,0].sum()+v[:,-1].sum())}

assets, frames = {}, {}
for hero in HEROES:
    runtime = ROOT/"public/assets/v29"/hero
    source = ROOT/"art-source/v29"/hero
    portrait = runtime/"portrait.png"
    im = Image.open(portrait)
    x,y,w,h = FACE_CROPS[hero]
    face = runtime/"face.png"
    im.crop((x,y,x+w,y+h)).save(face)
    a = im.getchannel("A")
    portrait_data = alpha_stats(im)
    portrait_data.update({"source": "portrait-source.png", "runtime": f"/assets/v29/{hero}/portrait.png",
                         "sha256": sha(portrait), "faceCrop": {"x":x,"y":y,"w":w,"h":h},
                         "faceRuntime": f"/assets/v29/{hero}/face.png", "faceSha256": sha(face),
                         "outsideSilhouetteAlphaSamples": [
                             {"x":px,"y":py,"alpha":a.getpixel((px,py))}
                             for px,py in [(60,300),(950,300),(60,700),(950,700),(60,1400),(950,1400)]],
                         "faceAlphaSamples": [
                             {"x":px,"y":py,"alpha":Image.open(face).getchannel("A").getpixel((px,py))}
                             for px,py in [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]],
                         "pixelTransform": "none; portrait copied native RGBA; face rectangle crop only"})
    (source/"portrait-manifest.json").write_text(json.dumps(portrait_data,indent=2),encoding="utf-8")
    assets[f"dlg_{hero}"] = f"/assets/v29/{hero}/portrait.png"
    assets[f"face_{hero}"] = f"/assets/v29/{hero}/face.png"
    for state,(cols,rows) in LAYOUTS.items():
        path = runtime/(state+".png")
        if not path.exists():
            continue
        image = Image.open(path)
        alpha = np.array(image.getchannel("A"))
        visible = alpha > THRESHOLD
        height,width = visible.shape
        yc = [0]; row_corridors=[]
        for k in range(1,rows):
            cut,corridor=empty_cut(visible.sum(axis=1),k*height/rows,75)
            yc.append(cut);row_corridors.append(corridor)
        yc.append(height)
        crops=[];cells=[];col_corridors=[]
        for row in range(rows):
            xc=[0];cs=[]
            for k in range(1,cols):
                cut,corridor=empty_cut(visible[yc[row]:yc[row+1]].sum(axis=0),k*width/cols,125)
                xc.append(cut);cs.append(corridor)
            xc.append(width);col_corridors.append(cs)
            for col in range(cols):
                cell=visible[yc[row]:yc[row+1],xc[col]:xc[col+1]]
                bx,by,br,bb=opaque_bounds(cell)
                left=max(xc[col],xc[col]+bx-2)
                top=max(yc[row],yc[row]+by-2)
                right=min(xc[col+1],xc[col]+br+2)
                bottom=min(yc[row+1],yc[row]+bb+2)
                local=visible[top:bottom,left:right]
                edges=int(local[0].sum()+local[-1].sum()+local[:,0].sum()+local[:,-1].sum())
                if edges:
                    raise ValueError(f"Visible alpha touches crop boundary: {hero} {state} {len(crops)}")
                # Axis from the narrow upper torso, excluding coat tails, fists and VFX.
                body_top=yc[row]+by;body_bottom=yc[row]+bb
                torso_y=body_top+int((body_bottom-body_top)*0.36)
                torso=visible[max(body_top,torso_y-4):torso_y+5,xc[col]:xc[col+1]]
                tx=np.flatnonzero(torso.any(axis=0))
                axis=float(xc[col]+(tx.min()+tx.max())/2) if len(tx) else float((left+right)/2)
                if state in BODY_AXES[hero]:
                    axis=BODY_AXES[hero][state][len(crops)]
                foot_y=int(body_bottom-1)
                crop={"x":left,"y":top,"w":right-left,"h":bottom-top,
                      "anchorX":axis,"anchorY":foot_y}
                if state in ["vfx","icons"]:
                    crop["anchorX"]=(left+right)/2;crop["anchorY"]=(top+bottom)/2
                crops.append(crop)
                cells.append({"index":len(crops)-1,"row":row,"col":col,
                              "cell":{"x":xc[col],"y":yc[row],"w":xc[col+1]-xc[col],"h":yc[row+1]-yc[row]},
                              "crop":crop,"visibleEdgePixels":edges})
                if state=="icons":
                    icon_dir=runtime/"icons";icon_dir.mkdir(exist_ok=True)
                    icon=icon_dir/(str(len(crops)-1)+".png")
                    image.crop((left,top,right,bottom)).save(icon)
                    assets[f"skill_icon_{hero}_{len(crops)-1}"]=f"/assets/v29/{hero}/icons/{len(crops)-1}.png"
                    cells[-1]["runtime"]=assets[f"skill_icon_{hero}_{len(crops)-1}"]
                    cells[-1]["sha256"]=sha(icon)
        key=hero if state=="walk" else f"skill_icons_{hero}" if state=="icons" else f"battle_fx_{hero}" if state=="vfx" else f"battle_{hero}_{state}"
        assets[key]=f"/assets/v29/{hero}/{state}.png";frames[key]=crops
        info=alpha_stats(image)
        info.update({"source":state+"-source.png","runtime":assets[key],"key":key,"sha256":sha(path),
                     "columns":cols,"rows":rows,"walkDirectionOrder":["S","W","E","N"] if state=="walk" else None,
                     "combatFacing":"right" if state in ["attack","cast","ultimate"] else None,
                     "alphaThresholdForVisibleBounds":THRESHOLD,"rowCuts":yc,"rowEmptyCorridorsInclusive":row_corridors,
                     "columnEmptyCorridorsInclusive":col_corridors,"cells":cells,
                     "anchorMethod":"combat body axis visually measured at waist, feet from opaque bottom; walk upper-torso axis and opaque feet; FX/icons centered",
                     "pixelTransform":"none; runtime atlas copied source RGBA; icons native rectangle crops only"})
        (source/(state+"-manifest.json")).write_text(json.dumps(info,indent=2),encoding="utf-8")
        print(json.dumps({"hero":hero,"state":state,"crops":crops}))
assets["battle_fx_gabriel_lycan"]=assets["battle_fx_gabriel"]
frames["battle_fx_gabriel_lycan"]=frames["battle_fx_gabriel"]
assets["skill_icons_gabriel_lycan"]=assets["skill_icons_gabriel"]
frames["skill_icons_gabriel_lycan"]=frames["skill_icons_gabriel"]
for k in range(6):
    assets[f"skill_icon_gabriel_lycan_{k}"]=assets[f"skill_icon_gabriel_{k}"]
module=ROOT/"lib/game/remakeArtGabrielMarinMax.ts"
module.write_text(
    "import type { SpriteCrop } from './sprites';\n\n"
    "// v29: native imagegen RGBA sheets; per-pose crops measured against visible alpha.\n"
    "// Walk row order S/W/E/N. Combat faces right; attack frame0 contains no VFX.\n"
    "export const REMAKE_ASSETS_GABRIEL_MARIN_MAX: Record<string,string> = "
    +json.dumps(assets,indent=2)+";\n\n"
    "export const REMAKE_FRAMES_GABRIEL_MARIN_MAX: Record<string,SpriteCrop[]> = "
    +json.dumps(frames,indent=2)+";\n",encoding="utf-8")
print(json.dumps({"assetKeys":len(assets),"frameKeys":len(frames),"module":str(module)}))
