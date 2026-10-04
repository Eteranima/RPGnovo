/** Five native 48-shot films. Atlas loading is exclusively local to QuestCinematic. Generated registry: art-source/v31/cinematics/export-native.mjs. */
export type QuestCinematicId = 'long-tinta'|'long-geada'|'long-brasa'|'long-trovao'|'long-nulo';
export type SceneAct = 0|1|2;
export type QuestCinemaFrame = {atlas:number;x:number;y:number;w:number;h:number;startMs:number;durationMs:number;description:string};
export type QuestCinemaScene = {id:QuestCinematicId;title:string;actors:string[];avatars:{name:string;src:string}[];atlases:{src:string;width:number;height:number;sha256:string}[];frames:QuestCinemaFrame[];durationMs:number;captions:{startFrame:number;text:string}[];thumbnail:QuestCinemaFrame&{src:string}};
export const QUEST_CINEMATICS_V31:Record<QuestCinematicId,QuestCinemaScene> = {
  "long-tinta": {
    "id": "long-tinta",
    "title": "O nome que o mar apagou",
    "actors": [
      "Shin",
      "Umbra"
    ],
    "avatars": [
      {
        "name": "Shin",
        "src": "/assets/v31/cinematics/long-tinta/avatar-shin.png"
      },
      {
        "name": "Umbra",
        "src": "/assets/v31/cinematics/long-tinta/avatar-umbra.png"
      }
    ],
    "atlases": [
      {
        "src": "/assets/v31/cinematics/long-tinta/act-1.png",
        "width": 1672,
        "height": 941,
        "sha256": "0468efbb11b2ebd0cbddb11d4c0c978c73cb333a20af95960d3289cd9666cbb1"
      },
      {
        "src": "/assets/v31/cinematics/long-tinta/act-2.png",
        "width": 1672,
        "height": 941,
        "sha256": "923fa3ea7c26631e566aff318ba592538f8fa6f53a7dc1e5e51baecdbf1df53d"
      },
      {
        "src": "/assets/v31/cinematics/long-tinta/act-3.png",
        "width": 1672,
        "height": 941,
        "sha256": "df1b57e805652fe366ee3de330b6229914c36a196c31ba2ea81009e05faa36d0"
      }
    ],
    "frames": [
      {
        "atlas": 0,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 0,
        "durationMs": 220,
        "description": "Wide moonlit Porto Lumina, moored silent boats"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 220,
        "durationMs": 220,
        "description": "Close saltwater washing a broken ferry rope"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 440,
        "durationMs": 220,
        "description": "Blue-black ink drop disperses across water"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 660,
        "durationMs": 220,
        "description": "Umbra steps onto wet dock with cool blue lantern"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 880,
        "durationMs": 220,
        "description": "Umbra carefully lifts soaked closed notebook"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1100,
        "durationMs": 220,
        "description": "Close torn blank name-space and delicate boat emblem"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1320,
        "durationMs": 220,
        "description": "Shin kneels beside Umbra, brush held securely"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1540,
        "durationMs": 220,
        "description": "One ink bead forms at Shin's brush tip"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 1760,
        "durationMs": 220,
        "description": "Tiny ink spirals respond to the notebook"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 1980,
        "durationMs": 220,
        "description": "Water reflects a fleeting empty ferry silhouette"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 2200,
        "durationMs": 220,
        "description": "Umbra's red eyes widen with recognition"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 2420,
        "durationMs": 220,
        "description": "Shin opens the warped notebook on a dock crate"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 2640,
        "durationMs": 220,
        "description": "Fragmented abstract ink strokes rise from torn fibers"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 2860,
        "durationMs": 220,
        "description": "Lantern reflection reveals an old stone ferry marker"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 3080,
        "durationMs": 220,
        "description": "Blue ink ribbon leads toward the academy archive"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 3300,
        "durationMs": 220,
        "description": "Two companions leave dock together carrying notebook"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3520,
        "durationMs": 220,
        "description": "Wide warm archive aisle, companions enter"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3740,
        "durationMs": 220,
        "description": "Shin and Umbra approach a shelf of ferry records"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3960,
        "durationMs": 220,
        "description": "Close dusty book with an empty name-shaped space"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 4180,
        "durationMs": 220,
        "description": "Umbra brushes dust away with gloved hand"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4400,
        "durationMs": 220,
        "description": "Shin carefully draws one abstract ink curve"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4620,
        "durationMs": 220,
        "description": "Paper fibers form a tiny compass-like boat seal"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4840,
        "durationMs": 220,
        "description": "Memory of rope and ferry overlays a page"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 5060,
        "durationMs": 220,
        "description": "Both companions compare two matching boat seals"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5280,
        "durationMs": 220,
        "description": "A dark ink smear tries to erase the restored curve"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5500,
        "durationMs": 220,
        "description": "Umbra shelters notebook with raised blue lantern"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5720,
        "durationMs": 220,
        "description": "Close Shin steady blue eyes, brush poised"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5940,
        "durationMs": 220,
        "description": "A tiny black ink bird lands on page edge"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6160,
        "durationMs": 220,
        "description": "Corrupt ink splinters dissolve into clean droplets"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6380,
        "durationMs": 220,
        "description": "Two fragments join into one graceful abstract mark"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6600,
        "durationMs": 220,
        "description": "A detailed miniature boat drawing reforms on paper"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6820,
        "durationMs": 220,
        "description": "Companions exchange relieved looks beneath archive lamp"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7040,
        "durationMs": 220,
        "description": "Close repaired paper seam joining two torn edges"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7260,
        "durationMs": 220,
        "description": "Complete ferry emblem emerges from settling ink"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7480,
        "durationMs": 220,
        "description": "A soft boat reflection returns inside ink ripple"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7700,
        "durationMs": 220,
        "description": "Old dock rope memory reconnects in blue lines"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 7920,
        "durationMs": 220,
        "description": "Umbra smiles, lantern held close at chest"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8140,
        "durationMs": 220,
        "description": "Shin finishes a small boat drawing with brush"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8360,
        "durationMs": 220,
        "description": "Warm light illuminates records without revealing text"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8580,
        "durationMs": 220,
        "description": "Black ink gently settles into notebook fibers"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 8800,
        "durationMs": 220,
        "description": "Lantern glows across ceiling in a boat-shaped reflection"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9020,
        "durationMs": 220,
        "description": "Archive window opens onto pale dawn harbor"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9240,
        "durationMs": 220,
        "description": "New rope coils beside ferry, hopeful quiet detail"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9460,
        "durationMs": 220,
        "description": "Notebook closes with restored unlettered boat emblem"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 9680,
        "durationMs": 220,
        "description": "Umbra offers lantern to Shin in a caring gesture"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 9900,
        "durationMs": 220,
        "description": "Shin holds notebook between open record and protective cover"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 10120,
        "durationMs": 220,
        "description": "Wide archive and city window imply two possible choices"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 10340,
        "durationMs": 220,
        "description": "Wide dawn dock, companions stand with recovered notebook awaiting decision"
      }
    ],
    "durationMs": 10560,
    "captions": [
      {
        "startFrame": 0,
        "text": "O porto perdeu um nome. A tinta ainda se lembra do caminho."
      },
      {
        "startFrame": 16,
        "text": "Entre registros apagados, Shin e Umbra reconstituem a memória de Iria."
      },
      {
        "startFrame": 32,
        "text": "A lembrança voltou. Torná-la pública ou protegê-la cabe a você."
      }
    ],
    "thumbnail": {
      "src": "/assets/v31/cinematics/long-tinta/act-1.png",
      "atlas": 0,
      "x": 1,
      "y": 1,
      "w": 416,
      "h": 233,
      "startMs": 0,
      "durationMs": 220,
      "description": "Wide moonlit Porto Lumina, moored silent boats"
    }
  },
  "long-geada": {
    "id": "long-geada",
    "title": "O jardim que guardou o inverno",
    "actors": [
      "Mika"
    ],
    "avatars": [
      {
        "name": "Mika",
        "src": "/assets/v31/cinematics/long-geada/avatar-mika.png"
      }
    ],
    "atlases": [
      {
        "src": "/assets/v31/cinematics/long-geada/act-1.png",
        "width": 1672,
        "height": 941,
        "sha256": "7454ab73346ee156da89af1f677073b302fe63242b125abae1a9cf6506894a1c"
      },
      {
        "src": "/assets/v31/cinematics/long-geada/act-2.png",
        "width": 1672,
        "height": 941,
        "sha256": "f618ea0a12f9dbb2146d4beea564c3ba50eda83ec42bbe83b220ef9f0eca81e5"
      },
      {
        "src": "/assets/v31/cinematics/long-geada/act-3.png",
        "width": 1672,
        "height": 941,
        "sha256": "c75702bec872ce21bf35395de391556531f022dea1bb80990d7a428af84aa0aa"
      }
    ],
    "frames": [
      {
        "atlas": 0,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 0,
        "durationMs": 220,
        "description": "Wide glass herbology dome wrapped in quiet frost"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 220,
        "durationMs": 220,
        "description": "Close delicate ice fern patterns on glass pane"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 440,
        "durationMs": 220,
        "description": "Mika enters dome carrying a small empty bowl"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 660,
        "durationMs": 220,
        "description": "Close round glasses reflecting a frozen blue flower"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 880,
        "durationMs": 220,
        "description": "Ice-enclosed blossom with silver-white petals"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1100,
        "durationMs": 220,
        "description": "Mika kneels, gently lifts one frosted leaf"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1320,
        "durationMs": 220,
        "description": "Close old root cracked under clear blue ice"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1540,
        "durationMs": 220,
        "description": "Small tree-shaped memory glimmers inside ice petal"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 1760,
        "durationMs": 220,
        "description": "Mika opens gloved palm beside the flower"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 1980,
        "durationMs": 220,
        "description": "A tiny blue crystal vein answers his careful touch"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 2200,
        "durationMs": 220,
        "description": "Root appears trapped in a ring of dense frost"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 2420,
        "durationMs": 220,
        "description": "Ice fractal opens into a delicate leaf pattern"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 2640,
        "durationMs": 220,
        "description": "Close Mika concerned face, glasses and blonde hair clear"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 2860,
        "durationMs": 220,
        "description": "Frozen blossom shows an unlettered moon emblem"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 3080,
        "durationMs": 220,
        "description": "Silver moon path leads outside toward Lunar Garden"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 3300,
        "durationMs": 220,
        "description": "Mika carries frost flower carefully toward garden"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3520,
        "durationMs": 220,
        "description": "Wide moon garden with pond and silver trees"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3740,
        "durationMs": 220,
        "description": "Mika kneels beside root at the pond edge"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3960,
        "durationMs": 220,
        "description": "He unfolds a blank plant sketch with leaf diagrams"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 4180,
        "durationMs": 220,
        "description": "Close glasses, eyes studying blue ice seam"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4400,
        "durationMs": 220,
        "description": "Open gloved palm channels soft cool healing light"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4620,
        "durationMs": 220,
        "description": "Separate ice petals rotate in a compact gentle orbit"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4840,
        "durationMs": 220,
        "description": "Frozen blossom opens slightly, retaining its ice shell"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 5060,
        "durationMs": 220,
        "description": "Cracked root visibly mends with pale blue bands"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5280,
        "durationMs": 220,
        "description": "Mika stands considering the flower and empty bowl"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5500,
        "durationMs": 220,
        "description": "Close preserved frost blossom resting beside a small vial"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5720,
        "durationMs": 220,
        "description": "Pearl-like seed pods appear beside old frozen flower"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5940,
        "durationMs": 220,
        "description": "Soft healing line follows root into dark soil"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6160,
        "durationMs": 220,
        "description": "A repaired branch extends with one blue bud"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6380,
        "durationMs": 220,
        "description": "Mika exhales, relief visible in his face"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6600,
        "durationMs": 220,
        "description": "Transparent ice capsule protects the old memory"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6820,
        "durationMs": 220,
        "description": "Dew from ice petal touches soil beside new seed"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7040,
        "durationMs": 220,
        "description": "Mika faces restored plant beneath silver moon"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7260,
        "durationMs": 220,
        "description": "Close old flower remains encased in clear blue frost"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7480,
        "durationMs": 220,
        "description": "Close pearl seeds resting in his gloved palm"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7700,
        "durationMs": 220,
        "description": "Within ice, a delicate tree memory remains intact"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 7920,
        "durationMs": 220,
        "description": "Three tiny blue-green leaves emerge near seeds"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8140,
        "durationMs": 220,
        "description": "Bowl contains preserved flower and separate seed pouch"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8360,
        "durationMs": 220,
        "description": "Mika's thoughtful profile in gentle moonlight"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8580,
        "durationMs": 220,
        "description": "Frost mist resolves without forcing a complete thaw"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 8800,
        "durationMs": 220,
        "description": "Herbology dome glows beyond the quiet garden"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9020,
        "durationMs": 220,
        "description": "Wide garden balances frosted flowers and new green buds"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9240,
        "durationMs": 220,
        "description": "Mika holds flower in one hand, seeds in the other"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9460,
        "durationMs": 220,
        "description": "Quiet pond reflects both icy bloom and new shoot"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 9680,
        "durationMs": 220,
        "description": "Soft blue healing threads fade from repaired root"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 9900,
        "durationMs": 220,
        "description": "Mika sets bowl on table, neither choice forced"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 10120,
        "durationMs": 220,
        "description": "Close Mika gentle smile as dawn touches glasses"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 10340,
        "durationMs": 220,
        "description": "Wide garden with ice witness and living seeds awaiting choice"
      }
    ],
    "durationMs": 10560,
    "captions": [
      {
        "startFrame": 0,
        "text": "Uma flor conserva o inverno que o jardim não conseguiu esquecer."
      },
      {
        "startFrame": 16,
        "text": "Mika cuida das raízes sem apagar o testemunho do gelo."
      },
      {
        "startFrame": 32,
        "text": "A memória pode permanecer na flor ou acompanhar as novas sementes."
      }
    ],
    "thumbnail": {
      "src": "/assets/v31/cinematics/long-geada/act-1.png",
      "atlas": 0,
      "x": 1,
      "y": 1,
      "w": 416,
      "h": 233,
      "startMs": 0,
      "durationMs": 220,
      "description": "Wide glass herbology dome wrapped in quiet frost"
    }
  },
  "long-brasa": {
    "id": "long-brasa",
    "title": "A promessa sob as cinzas",
    "actors": [
      "Gabriel",
      "Dante"
    ],
    "avatars": [
      {
        "name": "Gabriel",
        "src": "/assets/v29/gabriel/face.png"
      },
      {
        "name": "Dante",
        "src": "/assets/v31/cinematics/long-brasa/avatar-dante.png"
      }
    ],
    "atlases": [
      {
        "src": "/assets/v31/cinematics/long-brasa/act-1.png",
        "width": 1672,
        "height": 941,
        "sha256": "59d3e5f0b38840f3afd7ecd65cb7491a808f7f7039db233237d7b379f0c2565b"
      },
      {
        "src": "/assets/v31/cinematics/long-brasa/act-2.png",
        "width": 1672,
        "height": 941,
        "sha256": "656785f81cdfd49dbf9f6558b1c9007feabf8d2b805c505a63686d2da746afb3"
      },
      {
        "src": "/assets/v31/cinematics/long-brasa/act-3.png",
        "width": 1672,
        "height": 941,
        "sha256": "6fdb2bf6d671d8ff12f3a6eb6ceaa015a1fd42a08f794fccb902acab85987494"
      }
    ],
    "frames": [
      {
        "atlas": 0,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 0,
        "durationMs": 220,
        "description": "Wide ashwood forest with old embers and gray ash"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 220,
        "durationMs": 220,
        "description": "Close a broken ruby promise token in soot"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 440,
        "durationMs": 220,
        "description": "Gabriel walks through ash, coat moving naturally"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 660,
        "durationMs": 220,
        "description": "Dante glides low with folded red-gold wings"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 880,
        "durationMs": 220,
        "description": "Gabriel's gloved palm lifts a small mound of ash"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1100,
        "durationMs": 220,
        "description": "Close a living seed hidden under gray soot"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1320,
        "durationMs": 220,
        "description": "Gabriel amber eyes notice the surviving seed"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1540,
        "durationMs": 220,
        "description": "Close Dante attentive golden eye and feathered head"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 1760,
        "durationMs": 220,
        "description": "Old chain loop emerges beside the tiny seed"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 1980,
        "durationMs": 220,
        "description": "Gabriel kneels, shielding seed from a gust"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 2200,
        "durationMs": 220,
        "description": "Compact warm ember curls around gloved fingers"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 2420,
        "durationMs": 220,
        "description": "Gray ash parts to reveal a green root tip"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 2640,
        "durationMs": 220,
        "description": "Dante banks gently above the protected ground"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 2860,
        "durationMs": 220,
        "description": "One red-gold feather falls beside the seed"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 3080,
        "durationMs": 220,
        "description": "Feather warms seed with a small controlled ember"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 3300,
        "durationMs": 220,
        "description": "Wide heroes look toward distant quiet pyre clearing"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3520,
        "durationMs": 220,
        "description": "Gabriel enters the old pyre clearing at dusk"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3740,
        "durationMs": 220,
        "description": "Small flames form a safe controlled warming circle"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3960,
        "durationMs": 220,
        "description": "Dante spreads wings like a protective canopy"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 4180,
        "durationMs": 220,
        "description": "Close seed sheltered inside old charred stump"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4400,
        "durationMs": 220,
        "description": "Gabriel holds a warm palm beneath seed without burning"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4620,
        "durationMs": 220,
        "description": "Ash slowly separates from surviving root"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4840,
        "durationMs": 220,
        "description": "Ruby token at Gabriel's collar catches ember light"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 5060,
        "durationMs": 220,
        "description": "Charcoal shell cracks around a pale living bud"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5280,
        "durationMs": 220,
        "description": "A fine root emerges into soft soil"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5500,
        "durationMs": 220,
        "description": "Fire contracts into gentle amber heat, no destruction"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5720,
        "durationMs": 220,
        "description": "A raindrop touches soot, producing a tiny steam curl"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5940,
        "durationMs": 220,
        "description": "Close Gabriel warm relieved smile"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6160,
        "durationMs": 220,
        "description": "Dante lowers head calmly beside the newborn bud"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6380,
        "durationMs": 220,
        "description": "One green shoot lengthens inside protective ember circle"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6600,
        "durationMs": 220,
        "description": "Old forge stones appear beyond the restored stump"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6820,
        "durationMs": 220,
        "description": "Gabriel looks from ruins to living seed with new purpose"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7040,
        "durationMs": 220,
        "description": "Close green leaf unfolds from soot-covered seed"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7260,
        "durationMs": 220,
        "description": "Gray ash drifts upward through soft dawn light"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7480,
        "durationMs": 220,
        "description": "Dante carefully folds one wing around the clearing"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7700,
        "durationMs": 220,
        "description": "Gabriel closes fist and lets excess fire fade"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 7920,
        "durationMs": 220,
        "description": "His boots step around the new root with care"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8140,
        "durationMs": 220,
        "description": "Gloved hand places phoenix feather on stone"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8360,
        "durationMs": 220,
        "description": "Charred stump reveals a delicate green ring"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8580,
        "durationMs": 220,
        "description": "Empty roof beam and unused anvil suggest two futures"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 8800,
        "durationMs": 220,
        "description": "Embers remain safely inside a small old brazier"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9020,
        "durationMs": 220,
        "description": "Wide ruined clearing becomes quiet and welcoming"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9240,
        "durationMs": 220,
        "description": "Dante rises in a gentle wing arc above safe trees"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9460,
        "durationMs": 220,
        "description": "Gabriel kneels beside flourishing new branch"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 9680,
        "durationMs": 220,
        "description": "Close adult Gabriel's calm amber gaze and smile"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 9900,
        "durationMs": 220,
        "description": "Dante perches protectively beside the restored stump"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 10120,
        "durationMs": 220,
        "description": "Seed rests between old promise token and forge tool"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 10340,
        "durationMs": 220,
        "description": "Wide pyre clearing with new life awaiting shelter/workshop choice"
      }
    ],
    "durationMs": 10560,
    "captions": [
      {
        "startFrame": 0,
        "text": "Sob as cinzas, Gabriel encontra uma promessa que ainda respira."
      },
      {
        "startFrame": 16,
        "text": "Dante abriga a pequena vida. A chama aquece, e a raiz desperta."
      },
      {
        "startFrame": 32,
        "text": "A antiga pira pode acolher um abrigo ou uma oficina livre."
      }
    ],
    "thumbnail": {
      "src": "/assets/v31/cinematics/long-brasa/act-1.png",
      "atlas": 0,
      "x": 1,
      "y": 1,
      "w": 416,
      "h": 233,
      "startMs": 0,
      "durationMs": 220,
      "description": "Wide ashwood forest with old embers and gray ash"
    }
  },
  "long-trovao": {
    "id": "long-trovao",
    "title": "O sino que não aceitava o silêncio",
    "actors": [
      "Max",
      "Vajra"
    ],
    "avatars": [
      {
        "name": "Max",
        "src": "/assets/v29/max/face.png"
      },
      {
        "name": "Vajra",
        "src": "/assets/v31/cinematics/long-trovao/avatar-vajra.png"
      }
    ],
    "atlases": [
      {
        "src": "/assets/v31/cinematics/long-trovao/act-1.png",
        "width": 1672,
        "height": 941,
        "sha256": "ede7366800ffcfd75b6de751139b099fe76584f552950b9bd2ce9306cc876d1c"
      },
      {
        "src": "/assets/v31/cinematics/long-trovao/act-2.png",
        "width": 1672,
        "height": 941,
        "sha256": "cc0c197ce32f8fb88bf5fa040341b426f4b521fd5728fb7ffa8b638262e26619"
      },
      {
        "src": "/assets/v31/cinematics/long-trovao/act-3.png",
        "width": 1672,
        "height": 941,
        "sha256": "ea72340b13abec848fd9134cec39e1a8131dc4782e7b29a4fb79ed68985a7949"
      }
    ],
    "frames": [
      {
        "atlas": 0,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 0,
        "durationMs": 220,
        "description": "Wide ruined watchtower beneath cold stars"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 220,
        "durationMs": 220,
        "description": "Close motionless bronze bell and missing clapper"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 440,
        "durationMs": 220,
        "description": "Max enters ruins, iron nails held securely"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 660,
        "durationMs": 220,
        "description": "Vajra hurries beside him, compact chibi silhouette"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 880,
        "durationMs": 220,
        "description": "Max inspects damaged bronze bell support"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1100,
        "durationMs": 220,
        "description": "A single iron nail catches a tiny electric arc"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1320,
        "durationMs": 220,
        "description": "Close vine-bound bronze conduit under bell"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1540,
        "durationMs": 220,
        "description": "Vajra listens with hand beside ear near stone wall"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 1760,
        "durationMs": 220,
        "description": "An unlettered blue signal pattern flickers in glass"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 1980,
        "durationMs": 220,
        "description": "Close Max amber eyes and mature stitched cheek"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 2200,
        "durationMs": 220,
        "description": "Rusty wire ends lie separated on cracked stone"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 2420,
        "durationMs": 220,
        "description": "Vajra cups a small gold electric spark"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 2640,
        "durationMs": 220,
        "description": "Thin electric thread pulses along buried conduit"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 2860,
        "durationMs": 220,
        "description": "Small bronze star plates mark a path upward"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 3080,
        "durationMs": 220,
        "description": "Broken astrolabe shines faintly above observatory steps"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 3300,
        "durationMs": 220,
        "description": "Max and Vajra carry bell fragment toward observatory"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3520,
        "durationMs": 220,
        "description": "Wide broken dome, both arrive under starry sky"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3740,
        "durationMs": 220,
        "description": "Max places three iron nails into brass ring sockets"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3960,
        "durationMs": 220,
        "description": "Vajra catches a tiny current between gloved palms"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 4180,
        "durationMs": 220,
        "description": "Loose bronze wire joins a missing conduit segment"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4400,
        "durationMs": 220,
        "description": "Controlled blue-gold arcs follow restored metal"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4620,
        "durationMs": 220,
        "description": "Small bronze bell hangs near astrolabe"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4840,
        "durationMs": 220,
        "description": "First brass orbital gear begins to align"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 5060,
        "durationMs": 220,
        "description": "Vajra pushes a stuck lever with natural hands"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5280,
        "durationMs": 220,
        "description": "Max locks conductor pin into its socket"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5500,
        "durationMs": 220,
        "description": "Telescope lens opens to a bright reflected star"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5720,
        "durationMs": 220,
        "description": "Bell clapper returns to center with no text"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5940,
        "durationMs": 220,
        "description": "Soft rings of light ripple through tower stone"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6160,
        "durationMs": 220,
        "description": "Distant rooftop lanterns answer with blinking blue dots"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6380,
        "durationMs": 220,
        "description": "A glass signal vial lights up with abstract star pattern"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6600,
        "durationMs": 220,
        "description": "Close Max face relaxes after successful repair"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6820,
        "durationMs": 220,
        "description": "Wide observatory, first warm line appears on horizon"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7040,
        "durationMs": 220,
        "description": "Bronze bell moves, concentric light rings signify sound"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7260,
        "durationMs": 220,
        "description": "Close glass signal lanterns blink blue and gold"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7480,
        "durationMs": 220,
        "description": "Old chain lock around message conduit cracks"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7700,
        "durationMs": 220,
        "description": "Max releases wire from broken restraining chain"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 7920,
        "durationMs": 220,
        "description": "Vajra guides tiny gold sparks toward the sky"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8140,
        "durationMs": 220,
        "description": "Sunrise spreads across broken observatory dome"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8360,
        "durationMs": 220,
        "description": "Two conductors branch toward city and private houses"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8580,
        "durationMs": 220,
        "description": "A protected blank envelope rests beside signal vial"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 8800,
        "durationMs": 220,
        "description": "Open brass lens waits to transmit recovered message"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9020,
        "durationMs": 220,
        "description": "Max and Vajra share a calm relieved glance"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9240,
        "durationMs": 220,
        "description": "Vajra traces a nameless friendly constellation"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9460,
        "durationMs": 220,
        "description": "Max lets iron nail settle, harsh sparks fade"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 9680,
        "durationMs": 220,
        "description": "Bell stands restored against bright dawn sky"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 9900,
        "durationMs": 220,
        "description": "Far city windows reflect the new morning"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 10120,
        "durationMs": 220,
        "description": "Two glass vials remain ready, neither branch selected"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 10340,
        "durationMs": 220,
        "description": "Wide dawn observatory, actors face city awaiting choice"
      }
    ],
    "durationMs": 10560,
    "captions": [
      {
        "startFrame": 0,
        "text": "O sino calado guarda a mensagem dos antigos sinalizadores."
      },
      {
        "startFrame": 16,
        "text": "Max e Vajra religam o astrolábio e libertam o sinal."
      },
      {
        "startFrame": 32,
        "text": "Ao amanhecer, a mensagem pode alcançar a cidade ou voltar às famílias."
      }
    ],
    "thumbnail": {
      "src": "/assets/v31/cinematics/long-trovao/act-1.png",
      "atlas": 0,
      "x": 1,
      "y": 1,
      "w": 416,
      "h": 233,
      "startMs": 0,
      "durationMs": 220,
      "description": "Wide ruined watchtower beneath cold stars"
    }
  },
  "long-nulo": {
    "id": "long-nulo",
    "title": "A última página em branco",
    "actors": [
      "Orfeu"
    ],
    "avatars": [
      {
        "name": "Orfeu",
        "src": "/assets/v31/cinematics/long-nulo/avatar-orfeu.png"
      }
    ],
    "atlases": [
      {
        "src": "/assets/v31/cinematics/long-nulo/act-1.png",
        "width": 1672,
        "height": 941,
        "sha256": "d99aa44ea3015cf33f0729a7f47fd268cd9216fa71353f33b0d88a97c0899dd8"
      },
      {
        "src": "/assets/v31/cinematics/long-nulo/act-2.png",
        "width": 1672,
        "height": 941,
        "sha256": "1e5c271b9668d58b0614a6fdcf4720d3e8bb7209e83a718bd276025b9a5e382c"
      },
      {
        "src": "/assets/v31/cinematics/long-nulo/act-3.png",
        "width": 1672,
        "height": 941,
        "sha256": "f43c0a49e2aec45756e7cea662af9751e779d3819c731dc993e1dcfdb4404759"
      }
    ],
    "frames": [
      {
        "atlas": 0,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 0,
        "durationMs": 220,
        "description": "Wide quiet academy archive lit by warm lamps"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 220,
        "durationMs": 220,
        "description": "Close heavy bound book with rigid chain-like ornament"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 440,
        "durationMs": 220,
        "description": "Orfeu steps through archive doorway, adult silhouette"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 660,
        "durationMs": 220,
        "description": "Close white hair and calm focused profile"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 880,
        "durationMs": 220,
        "description": "Bandaged hand lifts heavy closed book"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1100,
        "durationMs": 220,
        "description": "Page reveals rigid abstract path diagram, no letters"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1320,
        "durationMs": 220,
        "description": "Paper fold resembles a narrow cage around the path"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 1540,
        "durationMs": 220,
        "description": "Close Orfeu's eyes refusing the prescribed path"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 1760,
        "durationMs": 220,
        "description": "A drawing tool stops at a chained margin line"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 1980,
        "durationMs": 220,
        "description": "Bandaged fist tightens with controlled resolve"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 2200,
        "durationMs": 220,
        "description": "Book hinge opens, pages strain without flying wildly"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 2420,
        "durationMs": 220,
        "description": "Thin mineral-white cancellation line crosses dark rune"
      },
      {
        "atlas": 0,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 2640,
        "durationMs": 220,
        "description": "One rigid margin clears into blank paper"
      },
      {
        "atlas": 0,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 2860,
        "durationMs": 220,
        "description": "Faded ink path casts a trapped shadow on floor"
      },
      {
        "atlas": 0,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 3080,
        "durationMs": 220,
        "description": "Orfeu walks down archive stair toward sealed vault"
      },
      {
        "atlas": 0,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 3300,
        "durationMs": 220,
        "description": "Wide lower doorway, book held firmly at his side"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3520,
        "durationMs": 220,
        "description": "Wide blue-gray underground vault, Orfeu enters"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3740,
        "durationMs": 220,
        "description": "Book chains attach to an old stone lectern"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 3960,
        "durationMs": 220,
        "description": "Bandaged hands gently turn the constrained page"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 4180,
        "durationMs": 220,
        "description": "Thin canceled gray runes fracture along page border"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4400,
        "durationMs": 220,
        "description": "Neutral palm pressure breaks one chain link"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4620,
        "durationMs": 220,
        "description": "Page edge releases from the rigid stone seal"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 4840,
        "durationMs": 220,
        "description": "Quiet violet cave crystals reflect, no fire"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 5060,
        "durationMs": 220,
        "description": "Orfeu sets steady physical stance beside lectern"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5280,
        "durationMs": 220,
        "description": "Dead prescription diagram breaks into small ink fragments"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5500,
        "durationMs": 220,
        "description": "A folded paper path unfolds over the stone"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5720,
        "durationMs": 220,
        "description": "Exactly two bandaged hands grip opposite page edges"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 5940,
        "durationMs": 220,
        "description": "A careful tear begins at the top of the prescription"
      },
      {
        "atlas": 1,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6160,
        "durationMs": 220,
        "description": "Central tear divides the ink path into two pieces"
      },
      {
        "atlas": 1,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6380,
        "durationMs": 220,
        "description": "Ink-bearing paper parts drift apart into harmless dust"
      },
      {
        "atlas": 1,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6600,
        "durationMs": 220,
        "description": "Orfeu exhales, resolve becomes relief"
      },
      {
        "atlas": 1,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 6820,
        "durationMs": 220,
        "description": "A single completely blank page remains on lectern"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7040,
        "durationMs": 220,
        "description": "Close blank ivory page angled in reflected vault light"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7260,
        "durationMs": 220,
        "description": "Bandaged palms protect the blank page without magic glow"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7480,
        "durationMs": 220,
        "description": "Orfeu carefully tightens a loose wrist bandage"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 1,
        "w": 416,
        "h": 233,
        "startMs": 7700,
        "durationMs": 220,
        "description": "Broken rigid rune orbit rests quietly on stone"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 7920,
        "durationMs": 220,
        "description": "Last thin gray cancellation seam fades away"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8140,
        "durationMs": 220,
        "description": "Discarded broken chain lies beside the clean leaf"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8360,
        "durationMs": 220,
        "description": "Opened book shows a genuinely unwritten spread"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 236,
        "w": 416,
        "h": 234,
        "startMs": 8580,
        "durationMs": 220,
        "description": "Orfeu lifts one blank page in a natural hand grip"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 8800,
        "durationMs": 220,
        "description": "He walks toward a light-filled gallery arch"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9020,
        "durationMs": 220,
        "description": "White page moves gently in a normal breeze"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9240,
        "durationMs": 220,
        "description": "Blue/gold sash follows his steady adult stride"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 472,
        "w": 416,
        "h": 233,
        "startMs": 9460,
        "durationMs": 220,
        "description": "Open gallery windows reveal an unforced bright future"
      },
      {
        "atlas": 2,
        "x": 1,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 9680,
        "durationMs": 220,
        "description": "Blank paper beside a small two-ring care emblem, no text"
      },
      {
        "atlas": 2,
        "x": 419,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 9900,
        "durationMs": 220,
        "description": "Orfeu stands ready, calm posture without an attack"
      },
      {
        "atlas": 2,
        "x": 837,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 10120,
        "durationMs": 220,
        "description": "Close thoughtful half-smile and grounded dark eyes"
      },
      {
        "atlas": 2,
        "x": 1255,
        "y": 707,
        "w": 416,
        "h": 233,
        "startMs": 10340,
        "durationMs": 220,
        "description": "Wide archive/gallery threshold, blank page awaits player choice"
      }
    ],
    "durationMs": 10560,
    "captions": [
      {
        "startFrame": 0,
        "text": "Uma página tenta prescrever os caminhos de quem ainda vive."
      },
      {
        "startFrame": 16,
        "text": "Orfeu rompe as amarras. A antimagia devolve silêncio ao papel."
      },
      {
        "startFrame": 32,
        "text": "A página está em branco: um destino livre ou um pacto de cuidado."
      }
    ],
    "thumbnail": {
      "src": "/assets/v31/cinematics/long-nulo/act-1.png",
      "atlas": 0,
      "x": 1,
      "y": 1,
      "w": 416,
      "h": 233,
      "startMs": 0,
      "durationMs": 220,
      "description": "Wide quiet academy archive lit by warm lamps"
    }
  }
};
export function getQuestCinematic(id:string):QuestCinemaScene|undefined{return Object.prototype.hasOwnProperty.call(QUEST_CINEMATICS_V31,id)?QUEST_CINEMATICS_V31[id as QuestCinematicId]:undefined;}
export function cinematicRange(scene:QuestCinemaScene,act?:SceneAct){const start=act===undefined?0:act*16,end=act===undefined?scene.frames.length:start+16;return{start,end,durationMs:scene.frames.slice(start,end).reduce((sum,f)=>sum+f.durationMs,0)};}
export function cinematicFrameAt(scene:QuestCinemaScene,elapsedMs:number,act?:SceneAct){const range=cinematicRange(scene,act),elapsed=Math.max(0,Number.isFinite(elapsedMs)?elapsedMs:0);let consumed=0;for(let i=range.start;i<range.end;i++){consumed+=scene.frames[i].durationMs;if(elapsed<consumed)return i;}return range.end-1;}
export function cinematicPlaybackStep(elapsedMs:number,deltaMs:number,durationMs:number,paused:boolean,hidden:boolean){const elapsed=Math.max(0,elapsedMs),delta=paused||hidden?0:Math.max(0,Number.isFinite(deltaMs)?deltaMs:0),nextBoundary=(Math.floor(elapsed/220)+1)*220,next=Math.min(durationMs,elapsed+delta,nextBoundary);return{elapsedMs:next,finished:next>=durationMs};}
export function cinematicTabTarget(eventType:string,shift:boolean,current:number,count:number):number|null{if(eventType!=='keydown'||count<1)return null;if(current<0)return shift?count-1:0;if(shift&&current===0)return count-1;if(!shift&&current===count-1)return 0;return null;}
