# Gabriel — dedicated party-card sprites v27

Generated with built-in image_gen on 2026-10-03, with genuine RGBA transparency. Four separate final runtime pieces: card-frame.png, portrait-ring.png, hp-vessel.png, mp-vessel.png.

## Sources and prompts

- prompt.txt records the initial specification; layout-repair-prompt.txt records the focused isolation/transparency refinement.
- initial-atlas.png preserves the first generation. selected-atlas.png is the refined source used by all final crops, 1536 × 1024 pixels.
- Inputs inspected before generation: public/assets/v26/ui/party-panel.png, portrait-ring.png and hp-vessel.png, plus the existing gabriel portrait for identity/palette review. Only the three existing UI sprites were passed as tool references.
- Wolf head emblems, amber ember tongues and claw-like gold edges: Fire plus lycan.
- No names, numbers, character portraits, HP/MP liquid, grid marks or placeholder assets are baked into these four objects.

## Crops and openings

extract.py reproduces RGBA cropping only; measure-openings.py adds the internal openings measured by a connected transparent-region flood fill. Run both in that order with Python/Pillow. Neither script resizes, paints, recolors or modifies generated alpha. manifest.json records exact source rectangles, dimensions, SHA256 hashes, alpha values, pixel counts and individual opening percentages. All source pixels inside each final crop are preserved exactly.

All 4 crop edges have zero pixels with alpha above24. True alpha0 exists outside the silhouettes and in each ring/bar opening; native antialiasing and small rim intrusions are preserved. Openings are measured component bounds, not promises that their entire rectangular box is empty: their rounded corners and ornamental points belong to the surrounding frame.

The generator varied from the requested geometric slots. Final measured separation: card→ring 50px; ring→bars 45px; HP→MP 29px. The original40px gap target was not reached between the vessels. The final crop windows remain isolated with4px padding and no visible neighbouring fragments. Runtime must use measured coordinates, rather than assume the prompt rectangles or equal generic fill positions.

## Visual review

The complete source and each of the four final PNG crops were inspected. Motif subjects are recognizable, isolated and distinct. The upper frame retains a broad navy content area; the ring and vessel tracks have genuine open centers; ruby HP and sapphire MP gems stay at the left. No neighbouring piece entered the selected crop. The style uses clean illustrated anime fantasy linework and controlled highlights. Actual small card readability and portrait/fill placement are verified by the main UI integration agent using these measured openings.

Runtime directory: public/assets/v27/cards/gabriel/. No runtime code was modified by this asset task.

## Element background correction requested by the user

Only `card-frame.png` was updated with the built-in image generator. The previous navy card is archived as `card-frame-navy-archived.png`. `element-background-prompt.txt`, `element-background-source.png` and `element-background-crop.json` preserve the edit request, generated source and measured geometry. Gabriel now has a deep red panel; Marin has a black panel while keeping the integrated transparent portrait circle; Max has a clearly light yellow panel while preserving blue lightning and iron nails. A single card was generated for each hero, with no extra kit pieces.

`manifest.json` records the final card source, dimensions, exact crop, center color sample and hash. All nine separate portrait-ring/HP/MP sprites across these three heroes retain their previous hashes. The final card was cropped without resize, painting or alpha changes. The generator changed the canvas and slightly changed geometry; measurements were refreshed and the Marin portrait center was delivered to the UI agent. Complete motifs and frontal orientation were visually checked against the archived navy reference. The three final card crops have no visible alpha>24 pixels on their edges.

To reproduce the entire kit after this revision, run `extract.py`, `measure-openings.py`, then `extract-element-background.py` in that order. The last script applies only the selected elemental card crop and preserves the three companion pieces. The earlier atlas geometry/clearance notes describe the original kit source and do not override this newer card source.
