"""Crop selected generated RGBA art without resizing or changing its alpha."""
from pathlib import Path
from PIL import Image
import json

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
OUT = ROOT / 'public/assets/v26/ui'
OUT.mkdir(parents=True, exist_ok=True)
panels = Image.open(HERE / 'field-panels-selected.png').convert('RGBA')
symbols = Image.open(HERE / 'field-symbols-isolated-selected.png').convert('RGBA')
PANEL_REGIONS = {
    'hp-vessel': (0, 35, 630, 260),
    'mp-vessel': (630, 35, 1254, 260),
    'travel-plaque': (0, 270, 650, 550),
    'party-panel': (660, 270, 1254, 550),
    'minimap-frame': (0, 550, 647, 1190),
    'portrait-ring': (652, 550, 1254, 1190),
}
SYMBOL_REGIONS = {
    'destination-patio': (0, 0, 263, 285),
    'destination-arquivo': (267, 0, 496, 285),
    'destination-subsolo': (504, 0, 745, 285),
    'destination-camara': (750, 0, 1000, 285),
    'destination-porto': (1004, 0, 1254, 285),
    'destination-domo': (0, 290, 256, 550),
    'destination-galeria': (256, 290, 503, 550),
    'destination-ashwood': (504, 290, 747, 550),
    'destination-vigilia': (748, 290, 1000, 550),
    'destination-ashpyre': (1000, 290, 1254, 550),
    'marker-player': (0, 556, 250, 781),
    'marker-objective': (258, 556, 501, 781),
    'marker-save': (506, 556, 746, 781),
    'marker-enemy': (753, 556, 999, 781),
    'marker-boss': (1000, 556, 1254, 781),
    'marker-npc': (0, 784, 248, 1004),
    'marker-chest': (250, 784, 502, 1004),
    'marker-event': (507, 784, 746, 1004),
    'marker-lock': (753, 784, 999, 1004),
    'marker-travel': (1000, 784, 1254, 1004),
    'hp-fluid': (48, 1100, 234, 1124),
    'mp-fluid': (291, 1100, 478, 1124),
    'map-ground': (551, 1035, 699, 1178),
    'map-wall': (797, 1035, 951, 1178),
    'map-water': (1058, 1035, 1205, 1178),
}
metadata = {}
for source, regions, source_name in [(panels, PANEL_REGIONS, 'field-panels-selected.png'), (symbols, SYMBOL_REGIONS, 'field-symbols-isolated-selected.png')]:
    for name, region in regions.items():
        crop = source.crop(region)
        # Texture windows are deliberately measured inside the painted surface.
        if name not in {'hp-fluid', 'mp-fluid', 'map-ground', 'map-wall', 'map-water'}:
            bbox = crop.getchannel('A').point(lambda a: 255 if a > 20 else 0).getbbox()
            if not bbox:
                raise ValueError(f'No alpha silhouette for {name}')
            bbox = (max(0, bbox[0]-4), max(0, bbox[1]-4), min(crop.width, bbox[2]+4), min(crop.height, bbox[3]+4))
            region = (region[0]+bbox[0], region[1]+bbox[1], region[0]+bbox[2], region[1]+bbox[3])
            crop = source.crop(region)
        crop.save(OUT / f'{name}.png')
        metadata[name] = {'source': source_name, 'sourceBox': region, 'size': crop.size, 'alpha': crop.getchannel('A').getextrema()}
(HERE / 'field-ui-crops.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps(metadata, ensure_ascii=False))
