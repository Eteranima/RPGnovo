"""Read-only proof of native source-QA PNG sizes, hashes and matching crop pixels."""
import hashlib
import json
import sys
from pathlib import Path
from PIL import Image, ImageChops

repo = Path(__file__).resolve().parents[3]
for qa_argument in sys.argv[1:]:
    qa = (repo / qa_argument).resolve()
    assert qa.is_relative_to(repo), "QA path must stay in this repository"
    manifest = json.loads((qa / "qa-manifest.json").read_text(encoding="utf-8-sig"))
    source = repo / manifest["source"]
    assert source.stat().st_size == manifest["sourceBytes"]
    assert hashlib.sha256(source.read_bytes()).hexdigest() == manifest["sourceSHA256"]
    assert len(manifest["full"]) == 16
    width, height = (manifest["sourceResolution"][key] for key in ("width", "height"))
    full = {}
    for item in manifest["full"]:
        path = repo / item["path"]
        assert hashlib.sha256(path.read_bytes()).hexdigest() == item["pngSHA256"]
        image = Image.open(path)
        assert image.size == (width, height) and image.mode == "RGB"
        full[item["sourceIndex"]] = image
    pixel_count = common_frames = crop_count = 0
    groups = manifest.get("crops") or ([manifest["cropped"]] if manifest["cropped"] else [])
    for group in groups:
        matched = 0
        assert len(group["frames"]) == 32
        crop_count += len(group["frames"])
        crop = group["crop"]
        box = (crop["x"], crop["y"], crop["x"] + crop["width"], crop["y"] + crop["height"])
        for item in group["frames"]:
            path = repo / item["path"]
            assert hashlib.sha256(path.read_bytes()).hexdigest() == item["pngSHA256"]
            image = Image.open(path)
            assert image.size == (crop["width"], crop["height"]) and image.mode == "RGB"
            if item["sourceIndex"] in full:
                assert ImageChops.difference(full[item["sourceIndex"]].crop(box), image).getbbox() is None
                common_frames += 1
                matched += 1
                pixel_count += crop["width"] * crop["height"]
        assert matched == 16
    print(f"PASS {qa_argument}: source hash/bytes, 16 native full PNGs, "
          f"{crop_count} native crops, "
          f"{common_frames} matching frames/{pixel_count:,} identical crop pixels; no images written.")
