from pathlib import Path
from PIL import Image
import json,hashlib
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
OUT=ROOT/"public/assets/v27/cards"/HERE.name
OUT.mkdir(parents=True,exist_ok=True)
SOURCE=HERE/"selected-atlas.png"
im=Image.open(SOURCE).convert("RGBA")
a=im.getchannel("A")
REGIONS={'card-frame': (0, 0, 1536, 460), 'portrait-ring': (0, 460, 520, 1024), 'hp-vessel': (520, 460, 1536, 724), 'mp-vessel': (520, 724, 1536, 1024)}
manifest={"hero":HERE.name,"generator":"built-in image_gen","source":"selected-atlas.png","sourceDimensions":im.size,"sourceSHA256":hashlib.sha256(SOURCE.read_bytes()).hexdigest(),"sourceAlphaExtrema":a.getextrema(),"sourceFullyTransparentPixels":a.histogram()[0],"alphaSilhouetteThreshold":24,"pixelOperations":"RGBA crop only; no resizing, painting, recoloring, alpha modification or background removal","assets":{}}
for name,region in REGIONS.items():
 bb=a.crop(region).point(lambda v:255 if v>24 else 0).getbbox()
 box=(max(region[0],region[0]+bb[0]-4),max(region[1],region[1]+bb[1]-4),min(region[2],region[0]+bb[2]+4),min(region[3],region[1]+bb[3]+4))
 cropped=im.crop(box)
 target=OUT/(name+".png")
 cropped.save(target)
 ca=cropped.getchannel("A")
 edges=[ca.crop((0,0,cropped.width,1)),ca.crop((0,cropped.height-1,cropped.width,cropped.height)),ca.crop((0,0,1,cropped.height)),ca.crop((cropped.width-1,0,cropped.width,cropped.height))]
 edgeVisible=sum(sum(edge.histogram()[25:])for edge in edges)
 assert edgeVisible==0,(name,"visible edge cropped")
 assert cropped.tobytes()==im.crop(box).tobytes(),"source pixels must remain unchanged"
 manifest["assets"][name]={"path":"/assets/v27/cards/"+HERE.name+"/"+name+".png","sourceBox":box,"dimensions":cropped.size,"alphaExtrema":ca.getextrema(),"fullyTransparentPixels":ca.histogram()[0],"visibleEdgePixelsAbove24":edgeVisible,"sha256":hashlib.sha256(target.read_bytes()).hexdigest()}
(HERE/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(json.dumps(manifest["assets"]))
