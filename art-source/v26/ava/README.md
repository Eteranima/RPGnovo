# Ava anime — v26

Generated with the built-in imagegen tool and local references. `prompts.json` preserves the exact prompts; `manifest.json` records selected source images, runtime paths, alpha measurements, frame rectangles and foot anchors.

The selected six runtime PNGs in `public/assets/v26/ava/` retain their generated pixel data and true alpha. Initial portrait and attack layouts that touched margins were refined through imagegen, then reviewed again. No generated character anatomy was repaired with procedural painting.

The anime style follows the user's Mushoku Tensei / Fate Series visual references while preserving original Ava identity and clothing. Combat uses solid layered sandstone, gravel, sand and mineral accents for Earth. Approved Seiji/Ophelia assets supplied local drawing references.

Runtime QA used the actual WorldRenderer for all four walk directions and actual BattleScene/UltimateCinematic for attack, skill and ultimate. Captures are in `docs/qa-v26/ava-walk-*.jpg` and `ava-anime-earth-*.jpg`. The source atlas has S/E/W/N rows; `lib/game/sprites.ts` maps them to the engine's S/W/E/N order. Whole silhouettes and measured cell boundaries were inspected. This is a reviewed set of poses, not a guarantee about every possible rendered circumstance.

`visual-review-route.txt` is an archived temporary fixture for reproducing battle review. It is documentation, not an application route. The route was removed from `app/` before production build.
