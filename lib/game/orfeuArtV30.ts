import type { SpriteCrop } from './sprites';

// v30 Orfeu: neutral physical/anti-magic artwork, native measured RGBA crops.
// Portrait, walk and basic attack remain the approved prior artwork.
export const ORFEU_ASSETS_V30: Record<string,string> = {
  "battle_orfeu_cast": "/assets/v30/orfeu/cast.png",
  "battle_orfeu_ultimate": "/assets/v30/orfeu/ultimate.png",
  "battle_fx_orfeu": "/assets/v30/orfeu/vfx.png",
  "skill_icon_orfeu_0": "/assets/v30/orfeu/icons/0.png",
  "skill_icon_orfeu_1": "/assets/v30/orfeu/icons/1.png",
  "skill_icon_orfeu_2": "/assets/v30/orfeu/icons/2.png",
  "skill_icon_orfeu_3": "/assets/v30/orfeu/icons/3.png",
  "skill_icon_orfeu_4": "/assets/v30/orfeu/icons/4.png",
  "skill_icon_orfeu_5": "/assets/v30/orfeu/icons/5.png",
  "skill_icons_orfeu": "/assets/v30/orfeu/icons.png"
};

export const ORFEU_FRAMES_V30: Record<string,SpriteCrop[]> = {
  "battle_orfeu_cast": [
    {
      "x": 56,
      "y": 90,
      "w": 394,
      "h": 397,
      "anchorX": 230,
      "anchorY": 484
    },
    {
      "x": 549,
      "y": 112,
      "w": 406,
      "h": 370,
      "anchorX": 750,
      "anchorY": 479
    },
    {
      "x": 1037,
      "y": 103,
      "w": 486,
      "h": 385,
      "anchorX": 1250,
      "anchorY": 485
    },
    {
      "x": 61,
      "y": 579,
      "w": 405,
      "h": 372,
      "anchorX": 235,
      "anchorY": 948
    },
    {
      "x": 546,
      "y": 544,
      "w": 467,
      "h": 406,
      "anchorX": 740,
      "anchorY": 947
    },
    {
      "x": 1084,
      "y": 565,
      "w": 418,
      "h": 386,
      "anchorX": 1250,
      "anchorY": 948
    }
  ],
  "battle_orfeu_ultimate": [
    {
      "x": 47,
      "y": 75,
      "w": 304,
      "h": 415,
      "anchorX": 200,
      "anchorY": 487
    },
    {
      "x": 418,
      "y": 120,
      "w": 347,
      "h": 369,
      "anchorX": 565,
      "anchorY": 486
    },
    {
      "x": 805,
      "y": 189,
      "w": 337,
      "h": 301,
      "anchorX": 955,
      "anchorY": 487
    },
    {
      "x": 1186,
      "y": 97,
      "w": 329,
      "h": 393,
      "anchorX": 1355,
      "anchorY": 487
    },
    {
      "x": 28,
      "y": 544,
      "w": 370,
      "h": 421,
      "anchorX": 200,
      "anchorY": 962
    },
    {
      "x": 404,
      "y": 574,
      "w": 379,
      "h": 390,
      "anchorX": 550,
      "anchorY": 961
    },
    {
      "x": 833,
      "y": 589,
      "w": 332,
      "h": 376,
      "anchorX": 985,
      "anchorY": 962
    },
    {
      "x": 1201,
      "y": 558,
      "w": 303,
      "h": 407,
      "anchorX": 1355,
      "anchorY": 962
    }
  ],
  "battle_fx_orfeu": [
    {
      "x": 23,
      "y": 28,
      "w": 470,
      "h": 455,
      "anchorX": 258.0,
      "anchorY": 255.5
    },
    {
      "x": 550,
      "y": 74,
      "w": 459,
      "h": 384,
      "anchorX": 779.5,
      "anchorY": 266.0
    },
    {
      "x": 1071,
      "y": 45,
      "w": 429,
      "h": 433,
      "anchorX": 1285.5,
      "anchorY": 261.5
    },
    {
      "x": 40,
      "y": 549,
      "w": 424,
      "h": 398,
      "anchorX": 252.0,
      "anchorY": 748.0
    },
    {
      "x": 532,
      "y": 539,
      "w": 481,
      "h": 430,
      "anchorX": 772.5,
      "anchorY": 754.0
    },
    {
      "x": 1064,
      "y": 524,
      "w": 434,
      "h": 457,
      "anchorX": 1281.0,
      "anchorY": 752.5
    }
  ],
  "skill_icons_orfeu": [
    {
      "x": 23,
      "y": 15,
      "w": 485,
      "h": 483,
      "anchorX": 265.5,
      "anchorY": 256.5
    },
    {
      "x": 525,
      "y": 15,
      "w": 485,
      "h": 482,
      "anchorX": 767.5,
      "anchorY": 256.0
    },
    {
      "x": 1028,
      "y": 15,
      "w": 484,
      "h": 482,
      "anchorX": 1270.0,
      "anchorY": 256.0
    },
    {
      "x": 23,
      "y": 514,
      "w": 485,
      "h": 481,
      "anchorX": 265.5,
      "anchorY": 754.5
    },
    {
      "x": 525,
      "y": 513,
      "w": 486,
      "h": 482,
      "anchorX": 768.0,
      "anchorY": 754.0
    },
    {
      "x": 1028,
      "y": 514,
      "w": 484,
      "h": 481,
      "anchorX": 1270.0,
      "anchorY": 754.5
    }
  ]
};
