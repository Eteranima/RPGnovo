from pathlib import Path
from PIL import Image
import json,hashlib
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
config=json.loads((HERE/"element-background-crop.json").read_text(encoding="utf-8"))
manifest=json.loads((HERE/"manifest.json").read_text(encoding="utf-8"))
asset=config["cardFrame"]
source=HERE/"element-background-source.png"
assert hashlib.sha256(source.read_bytes()).hexdigest()==config["elementBackgroundEdit"]["sourceSHA256"]
im=Image.open(source).convert("RGBA")
cropped=im.crop(asset["sourceBox"])
assert list(cropped.size)==asset["dimensions"]
output=ROOT/("public"+asset["path"])
cropped.save(output)
assert hashlib.sha256(output.read_bytes()).hexdigest()==asset["sha256"]
manifest["assets"]["card-frame"]=asset
manifest["elementBackgroundEdit"]=config["elementBackgroundEdit"]
manifest["archivedNavyCard"]=config["archivedNavyCard"]
for name in ["portrait-ring","hp-vessel","mp-vessel"]:
 assert hashlib.sha256((ROOT/("public"+manifest["assets"][name]["path"])).read_bytes()).hexdigest()==manifest["assets"][name]["sha256"]
(HERE/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
