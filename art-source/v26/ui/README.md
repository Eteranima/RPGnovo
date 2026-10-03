# Field HUD art v26

Generated with the built-in image generator on 2026-10-03 for the requested premium fantasy anime UI direction: original Stone Reach designs with fine gold, lapis, ivory, ruby HP and sapphire MP. No franchise logos or character copies.

## Selected art and crops

- `field-panels-selected.png`: six real interface sprites: HP and MP vessel frames, travel plaque, party panel, minimap surround and portrait ring. Genuine RGBA alpha 0–255.
- `field-symbols-isolated-selected.png`: the selected 25-item atlas: ten destination illustrations, ten map markers, two painted fluid strips and three cartography textures. Genuine transparent exterior; texture/strip windows are measured inside the painted surfaces.
- `field-symbols-selected.png`: original generation retained for provenance. A layout refinement was requested after inspection showed small neighbouring fragments near a few crop boundaries. The isolated generation supplies all runtime symbol crops.
- Prompts are preserved in `field-panels-prompt.txt`, `field-symbols-prompt.txt` and `field-symbols-isolation-prompt.txt`.
- `extract-field-ui.py` reproducibly crops the selected art without resizing, recolouring, background removal or changes to generated alpha. `field-ui-crops.json` records all 31 exact source rectangles, dimensions and alpha extrema.
- All runtime PNGs are saved in `public/assets/v26/ui/`. No project asset depends on its generator output directory.

## Runtime use

- `components/field-hud-art.tsx` supplies real art frames and Radix HP/MP progress bars. Painted fluid images retain live fill percentages, numeric values and accessible value text.
- `app/page.tsx` integrates the portrait surround, HP/MP vessels, generated destination plaques and destination-specific icons. Travel continues to use actual `engine.approach`, story locks and existing accessible names.
- `components/minimap.tsx` retains actual map rows, positions, solid objects and points of interest. It paints those known facts with the generated cartography textures and actual icons. Nothing invents a geographic location or changes navigation.
- Each minimap instance receives unique SVG pattern IDs. Player, quest, restoration, enemy and locked-route markers remain visually distinct and retain an accessible legend.
- `app/globals.css` contains responsive styling. Larger parties scroll within the footer so health values remain readable; destination lists retain scroll and keyboard focus when the viewport is short.

## Validation

- Both generated atlases inspected in full; individual HP frame/fluid, portrait/destination crops and party panel inspected separately. Crop windows measured from alpha bounds with padding.
- TypeScript check passed after component integration. Diff whitespace check passed.
- Main browser session screenshot at 1310 × 572: `docs/qa-v26/ui-subsolo-before-environment.jpg`. It confirms the illustrated HP/MP vessels, dynamic 50/66 MP example, minimap map/markers and different Ala de Estudos / Câmara do Selo destination art.
- That first screenshot exposed numbers approaching the right ornament; card padding was increased from 14 to 26 pixels on landscape/mobile.
- Final 1310 × 572 screenshot reviewed at full resolution: `docs/qa-v26/field-anime-desktop.jpg`. Values 82/91, 58/66, 85/94 and 40/45 remain clearly inside the undecorated area. The partial HP/MP fills, portraits, two distinct destination icons and actual cartography were visually approved together with the final anime scene. No further desktop asset changes were required.
- Landscape 844 × 390 screenshot reviewed: `docs/qa-v26/field-anime-landscape.jpg`. All nine menu controls fit, map and destination plates remain clear, Q/Tab actions stay apart from the directional pad, and both visible party cards retain readable partial values.
- Portrait 390 × 844 initially had a real overlap between destinations and the leader-swap action. The portrait breakpoint now reserves the bottom right for a labelled Q/R and Tab grid, keeps the directional pad on the left, and raises the scrolling destination list by 130 pixels. Controls, progression and event handlers are unchanged.
- Final portrait screenshot reviewed in full: `docs/qa-v26/field-anime-portrait.jpg`. Q includes its skill label, the Ava / Tab leader control is completely visible in its own row, both destination labels remain clear above the actions, and the directional pad stays separate. The first party card and its partial numeric values fit within their art. Horizontal scrolling of extra header controls and party cards is intentional.
- Final desktop screenshot with the finished anime walls was rechecked: `docs/qa-v26/field-anime-desktop.jpg`. Gold/lapis HUD art, ruby/sapphire vessels, destination illustrations and actual cartography remain legible and coherent with the final scene.
- Final browser captures were produced by the main agent in an isolated Home fixture without game-save reads or writes. Root TypeScript validation passed after the final integration. Desktop 1310 × 572, landscape 844 × 390 and portrait 390 × 844 visual reviews are complete; UI and art changes are frozen after this validation.
