import type {SpriteCrop} from './sprites';

// Final built-in image_gen sources, measured native RGBA bounds.
// Prompts, rejected variants and pixel verification: art-source/v30.
export const ENEMY_ASSETS_V30:Record<string,string>={
  "ultimate_lobo": "/assets/v30/enemies/lobo/ultimate.png",
  "ultimate_sombra": "/assets/v30/enemies/sombra/ultimate.png",
  "ultimate_selo": "/assets/v30/enemies/selo/ultimate.png",
  "ultimate_ashwolf": "/assets/v30/enemies/ashwolf/ultimate.png",
  "ultimate_moth": "/assets/v30/enemies/moth/ultimate.png",
  "ultimate_eco": "/assets/v30/enemies/eco/ultimate.png",
  "ultimate_cinder": "/assets/v30/enemies/cinder/ultimate.png",
  "ultimate_lunastag": "/assets/v30/enemies/lunastag/ultimate.png",
  "ultimate_runewarden": "/assets/v30/enemies/runewarden/ultimate.png",
  "ultimate_astral": "/assets/v30/enemies/astral/ultimate.png",
  "battle_lunastag_attack": "/assets/v30/enemies/lunastag/attack.png",
  "battle_runewarden_attack": "/assets/v30/enemies/runewarden/attack.png",
  "battle_astral_attack": "/assets/v30/enemies/astral/attack.png",
  "lunastag": "/assets/v30/enemies/lunastag/body.png",
  "portrait_lunastag": "/assets/v30/enemies/lunastag/portrait.png",
  "runewarden": "/assets/v30/enemies/runewarden/body.png",
  "portrait_runewarden": "/assets/v30/enemies/runewarden/portrait.png",
  "battle_astral_phases": "/assets/v30/enemies/astral/phases.png",
  "battle_astral_phase_1": "/assets/v30/enemies/astral/phase-1.png",
  "battle_astral_phase_2": "/assets/v30/enemies/astral/phase-2.png",
  "battle_astral_phase_3": "/assets/v30/enemies/astral/phase-3.png",
  "astral": "/assets/v30/enemies/astral/phase-1.png",
  "portrait_astral": "/assets/v30/enemies/astral/phase-1.png",
  "env_floor_v30": "/assets/v30/world/floor/materials.png",
  "v30_world_props": "/assets/v30/world/props/atlas.png",
  "battle_bg_lunar": "/assets/v30/world/lunar/background.png",
  "battle_bg_observatory": "/assets/v30/world/observatory/background.png"
};

export const ENEMY_FRAMES_V30:Record<string,SpriteCrop[]>={
  "ultimate_lobo": [
    {
      "x": 73,
      "y": 135,
      "w": 313,
      "h": 269,
      "anchorX": 230.1,
      "anchorY": 395
    },
    {
      "x": 493,
      "y": 168,
      "w": 357,
      "h": 238,
      "anchorX": 609.4,
      "anchorY": 397
    },
    {
      "x": 931,
      "y": 109,
      "w": 352,
      "h": 297,
      "anchorX": 1098.9,
      "anchorY": 397
    },
    {
      "x": 1389,
      "y": 88,
      "w": 336,
      "h": 321,
      "anchorX": 1599.6,
      "anchorY": 400
    },
    {
      "x": 44,
      "y": 533,
      "w": 371,
      "h": 279,
      "anchorX": 219.2,
      "anchorY": 803
    },
    {
      "x": 482,
      "y": 495,
      "w": 379,
      "h": 321,
      "anchorX": 691.1,
      "anchorY": 807
    },
    {
      "x": 927,
      "y": 532,
      "w": 366,
      "h": 268,
      "anchorX": 1020.7,
      "anchorY": 791
    },
    {
      "x": 1392,
      "y": 530,
      "w": 337,
      "h": 264,
      "anchorX": 1554.3,
      "anchorY": 785
    }
  ],
  "ultimate_sombra": [
    {
      "x": 76,
      "y": 53,
      "w": 341,
      "h": 384,
      "anchorX": 275.2,
      "anchorY": 428
    },
    {
      "x": 492,
      "y": 52,
      "w": 368,
      "h": 385,
      "anchorX": 713.2,
      "anchorY": 428
    },
    {
      "x": 937,
      "y": 52,
      "w": 388,
      "h": 389,
      "anchorX": 1155.8,
      "anchorY": 432
    },
    {
      "x": 1384,
      "y": 11,
      "w": 369,
      "h": 432,
      "anchorX": 1604.5,
      "anchorY": 434
    },
    {
      "x": 11,
      "y": 462,
      "w": 436,
      "h": 401,
      "anchorX": 353,
      "anchorY": 854
    },
    {
      "x": 447,
      "y": 447,
      "w": 449,
      "h": 416,
      "anchorX": 796.9,
      "anchorY": 854
    },
    {
      "x": 904,
      "y": 509,
      "w": 435,
      "h": 357,
      "anchorX": 1229.4,
      "anchorY": 857
    },
    {
      "x": 1405,
      "y": 511,
      "w": 341,
      "h": 361,
      "anchorX": 1599.7,
      "anchorY": 863
    }
  ],
  "ultimate_selo": [
    {
      "x": 78,
      "y": 19,
      "w": 360,
      "h": 425,
      "anchorX": 301.7,
      "anchorY": 435
    },
    {
      "x": 488,
      "y": 19,
      "w": 381,
      "h": 427,
      "anchorX": 727.9,
      "anchorY": 437
    },
    {
      "x": 915,
      "y": 19,
      "w": 401,
      "h": 426,
      "anchorX": 1170.2,
      "anchorY": 436
    },
    {
      "x": 1348,
      "y": 40,
      "w": 409,
      "h": 407,
      "anchorX": 1581.3,
      "anchorY": 438
    },
    {
      "x": 9,
      "y": 493,
      "w": 440,
      "h": 353,
      "anchorX": 376.1,
      "anchorY": 837
    },
    {
      "x": 452,
      "y": 476,
      "w": 433,
      "h": 374,
      "anchorX": 759.8,
      "anchorY": 841
    },
    {
      "x": 885,
      "y": 493,
      "w": 453,
      "h": 354,
      "anchorX": 1225.3,
      "anchorY": 838
    },
    {
      "x": 1387,
      "y": 476,
      "w": 381,
      "h": 368,
      "anchorX": 1622.6,
      "anchorY": 835
    }
  ],
  "ultimate_ashwolf": [
    {
      "x": 37,
      "y": 117,
      "w": 404,
      "h": 294,
      "anchorX": 175.5,
      "anchorY": 402
    },
    {
      "x": 480,
      "y": 99,
      "w": 379,
      "h": 313,
      "anchorX": 658.1,
      "anchorY": 403
    },
    {
      "x": 902,
      "y": 55,
      "w": 407,
      "h": 365,
      "anchorX": 1006.6,
      "anchorY": 411
    },
    {
      "x": 1347,
      "y": 106,
      "w": 400,
      "h": 315,
      "anchorX": 1446.6,
      "anchorY": 412
    },
    {
      "x": 19,
      "y": 482,
      "w": 433,
      "h": 331,
      "anchorX": 193.5,
      "anchorY": 804
    },
    {
      "x": 452,
      "y": 493,
      "w": 441,
      "h": 336,
      "anchorX": 592.7,
      "anchorY": 820
    },
    {
      "x": 893,
      "y": 501,
      "w": 436,
      "h": 328,
      "anchorX": 971.2,
      "anchorY": 820
    },
    {
      "x": 1356,
      "y": 538,
      "w": 397,
      "h": 292,
      "anchorX": 1479.4,
      "anchorY": 821
    }
  ],
  "ultimate_moth": [
    {
      "x": 81,
      "y": 101,
      "w": 320,
      "h": 305,
      "anchorX": 228,
      "anchorY": 394
    },
    {
      "x": 510,
      "y": 91,
      "w": 324,
      "h": 319,
      "anchorX": 664,
      "anchorY": 393
    },
    {
      "x": 945,
      "y": 92,
      "w": 341,
      "h": 319,
      "anchorX": 1114,
      "anchorY": 390
    },
    {
      "x": 1377,
      "y": 84,
      "w": 347,
      "h": 337,
      "anchorX": 1554,
      "anchorY": 386
    },
    {
      "x": 39,
      "y": 508,
      "w": 384,
      "h": 299,
      "anchorX": 260,
      "anchorY": 773
    },
    {
      "x": 517,
      "y": 509,
      "w": 359,
      "h": 297,
      "anchorX": 688,
      "anchorY": 772
    },
    {
      "x": 936,
      "y": 509,
      "w": 379,
      "h": 299,
      "anchorX": 1190,
      "anchorY": 773
    },
    {
      "x": 1376,
      "y": 510,
      "w": 352,
      "h": 299,
      "anchorX": 1570,
      "anchorY": 773
    }
  ],
  "ultimate_eco": [
    {
      "x": 85,
      "y": 49,
      "w": 306,
      "h": 378,
      "anchorX": 263.6,
      "anchorY": 418
    },
    {
      "x": 478,
      "y": 50,
      "w": 384,
      "h": 390,
      "anchorX": 714,
      "anchorY": 431
    },
    {
      "x": 939,
      "y": 56,
      "w": 332,
      "h": 381,
      "anchorX": 1144.1,
      "anchorY": 428
    },
    {
      "x": 1330,
      "y": 0,
      "w": 444,
      "h": 446,
      "anchorX": 1576.7,
      "anchorY": 437
    },
    {
      "x": 11,
      "y": 478,
      "w": 458,
      "h": 365,
      "anchorX": 378.9,
      "anchorY": 834
    },
    {
      "x": 470,
      "y": 494,
      "w": 447,
      "h": 364,
      "anchorX": 803.5,
      "anchorY": 849
    },
    {
      "x": 921,
      "y": 494,
      "w": 398,
      "h": 358,
      "anchorX": 1170.5,
      "anchorY": 843
    },
    {
      "x": 1372,
      "y": 509,
      "w": 383,
      "h": 342,
      "anchorX": 1609.7,
      "anchorY": 842
    }
  ],
  "ultimate_cinder": [
    {
      "x": 59,
      "y": 185,
      "w": 327,
      "h": 262,
      "anchorX": 264,
      "anchorY": 432
    },
    {
      "x": 493,
      "y": 177,
      "w": 341,
      "h": 269,
      "anchorX": 707,
      "anchorY": 434
    },
    {
      "x": 958,
      "y": 28,
      "w": 322,
      "h": 424,
      "anchorX": 1131,
      "anchorY": 438
    },
    {
      "x": 1404,
      "y": 115,
      "w": 320,
      "h": 332,
      "anchorX": 1582,
      "anchorY": 436
    },
    {
      "x": 46,
      "y": 503,
      "w": 381,
      "h": 306,
      "anchorX": 331,
      "anchorY": 800
    },
    {
      "x": 497,
      "y": 522,
      "w": 380,
      "h": 302,
      "anchorX": 785,
      "anchorY": 803
    },
    {
      "x": 932,
      "y": 541,
      "w": 371,
      "h": 275,
      "anchorX": 1182,
      "anchorY": 806
    },
    {
      "x": 1394,
      "y": 564,
      "w": 326,
      "h": 251,
      "anchorX": 1594,
      "anchorY": 804
    }
  ],
  "ultimate_lunastag": [
    {
      "x": 90,
      "y": 42,
      "w": 278,
      "h": 410,
      "anchorX": 237.6,
      "anchorY": 443
    },
    {
      "x": 530,
      "y": 38,
      "w": 285,
      "h": 413,
      "anchorX": 680.1,
      "anchorY": 442
    },
    {
      "x": 954,
      "y": 14,
      "w": 330,
      "h": 437,
      "anchorX": 1119.7,
      "anchorY": 442
    },
    {
      "x": 1365,
      "y": 149,
      "w": 378,
      "h": 303,
      "anchorX": 1551.2,
      "anchorY": 443
    },
    {
      "x": 50,
      "y": 557,
      "w": 389,
      "h": 272,
      "anchorX": 301.3,
      "anchorY": 820
    },
    {
      "x": 444,
      "y": 525,
      "w": 434,
      "h": 329,
      "anchorX": 637.7,
      "anchorY": 845
    },
    {
      "x": 904,
      "y": 562,
      "w": 393,
      "h": 284,
      "anchorX": 1072.8,
      "anchorY": 837
    },
    {
      "x": 1420,
      "y": 466,
      "w": 297,
      "h": 406,
      "anchorX": 1557.7,
      "anchorY": 863
    }
  ],
  "ultimate_runewarden": [
    {
      "x": 141,
      "y": 3,
      "w": 265,
      "h": 430,
      "anchorX": 270.9,
      "anchorY": 424
    },
    {
      "x": 559,
      "y": 0,
      "w": 275,
      "h": 433,
      "anchorX": 697.5,
      "anchorY": 424
    },
    {
      "x": 32,
      "y": 442,
      "w": 396,
      "h": 439,
      "anchorX": 278.8,
      "anchorY": 872
    },
    {
      "x": 538,
      "y": 437,
      "w": 334,
      "h": 448,
      "anchorX": 720.6,
      "anchorY": 876
    },
    {
      "x": 21,
      "y": 888,
      "w": 427,
      "h": 430,
      "anchorX": 330.3,
      "anchorY": 1309
    },
    {
      "x": 462,
      "y": 887,
      "w": 413,
      "h": 432,
      "anchorX": 772.3,
      "anchorY": 1310
    },
    {
      "x": 19,
      "y": 1325,
      "w": 415,
      "h": 433,
      "anchorX": 293.2,
      "anchorY": 1749
    },
    {
      "x": 564,
      "y": 1329,
      "w": 273,
      "h": 432,
      "anchorX": 704.1,
      "anchorY": 1752
    }
  ],
  "ultimate_astral": [
    {
      "x": 116,
      "y": 58,
      "w": 221,
      "h": 382,
      "anchorX": 267.5,
      "anchorY": 431
    },
    {
      "x": 539,
      "y": 59,
      "w": 252,
      "h": 380,
      "anchorX": 711,
      "anchorY": 430
    },
    {
      "x": 997,
      "y": 62,
      "w": 244,
      "h": 377,
      "anchorX": 1164.2,
      "anchorY": 430
    },
    {
      "x": 1427,
      "y": 10,
      "w": 252,
      "h": 430,
      "anchorX": 1581.4,
      "anchorY": 431
    },
    {
      "x": 47,
      "y": 500,
      "w": 367,
      "h": 360,
      "anchorX": 377.9,
      "anchorY": 851
    },
    {
      "x": 491,
      "y": 503,
      "w": 361,
      "h": 357,
      "anchorX": 811.6,
      "anchorY": 851
    },
    {
      "x": 946,
      "y": 504,
      "w": 328,
      "h": 354,
      "anchorX": 1245.5,
      "anchorY": 849
    },
    {
      "x": 1445,
      "y": 504,
      "w": 243,
      "h": 357,
      "anchorX": 1593.1,
      "anchorY": 852
    }
  ],
  "battle_lunastag_attack": [
    {
      "x": 86,
      "y": 48,
      "w": 336,
      "h": 455,
      "anchorX": 248.7,
      "anchorY": 494
    },
    {
      "x": 563,
      "y": 118,
      "w": 421,
      "h": 382,
      "anchorX": 761,
      "anchorY": 491
    },
    {
      "x": 1085,
      "y": 43,
      "w": 394,
      "h": 465,
      "anchorX": 1304.8,
      "anchorY": 499
    },
    {
      "x": 44,
      "y": 617,
      "w": 477,
      "h": 329,
      "anchorX": 466.7,
      "anchorY": 937
    },
    {
      "x": 562,
      "y": 595,
      "w": 488,
      "h": 350,
      "anchorX": 880.3,
      "anchorY": 936
    },
    {
      "x": 1096,
      "y": 562,
      "w": 405,
      "h": 385,
      "anchorX": 1323.9,
      "anchorY": 938
    }
  ],
  "battle_runewarden_attack": [
    {
      "x": 136,
      "y": 7,
      "w": 332,
      "h": 499,
      "anchorX": 288.6,
      "anchorY": 497
    },
    {
      "x": 532,
      "y": 94,
      "w": 456,
      "h": 411,
      "anchorX": 880.3,
      "anchorY": 496
    },
    {
      "x": 105,
      "y": 535,
      "w": 354,
      "h": 477,
      "anchorX": 297,
      "anchorY": 1003
    },
    {
      "x": 563,
      "y": 649,
      "w": 439,
      "h": 361,
      "anchorX": 927.8,
      "anchorY": 1001
    },
    {
      "x": 13,
      "y": 1036,
      "w": 516,
      "h": 474,
      "anchorX": 382.4,
      "anchorY": 1501
    },
    {
      "x": 635,
      "y": 1016,
      "w": 340,
      "h": 495,
      "anchorX": 813.6,
      "anchorY": 1502
    }
  ],
  "battle_astral_attack": [
    {
      "x": 147,
      "y": 15,
      "w": 283,
      "h": 506,
      "anchorX": 303.6,
      "anchorY": 517
    },
    {
      "x": 577,
      "y": 35,
      "w": 377,
      "h": 486,
      "anchorX": 827.8,
      "anchorY": 517
    },
    {
      "x": 1089,
      "y": 30,
      "w": 395,
      "h": 491,
      "anchorX": 1342.5,
      "anchorY": 517
    },
    {
      "x": 3,
      "y": 549,
      "w": 545,
      "h": 451,
      "anchorX": 385.2,
      "anchorY": 991
    },
    {
      "x": 548,
      "y": 549,
      "w": 475,
      "h": 452,
      "anchorX": 848.2,
      "anchorY": 992
    },
    {
      "x": 1070,
      "y": 521,
      "w": 372,
      "h": 481,
      "anchorX": 1310.7,
      "anchorY": 993
    }
  ],
  "lunastag": [
    {
      "x": 0,
      "y": 0,
      "w": 895,
      "h": 1504,
      "anchorX": 419,
      "anchorY": 1495
    }
  ],
  "portrait_lunastag": [
    {
      "x": 93,
      "y": 1,
      "w": 895,
      "h": 1504,
      "anchorX": 512,
      "anchorY": 1496
    }
  ],
  "runewarden": [
    {
      "x": 0,
      "y": 0,
      "w": 934,
      "h": 1506,
      "anchorX": 232.3,
      "anchorY": 1497
    }
  ],
  "portrait_runewarden": [
    {
      "x": 80,
      "y": 8,
      "w": 934,
      "h": 1506,
      "anchorX": 312.3,
      "anchorY": 1505
    }
  ],
  "battle_astral_phases": [
    {
      "x": 49,
      "y": 0,
      "w": 423,
      "h": 1024,
      "anchorX": 412.5,
      "anchorY": 1015
    },
    {
      "x": 472,
      "y": 0,
      "w": 510,
      "h": 1024,
      "anchorX": 906.3,
      "anchorY": 1015
    },
    {
      "x": 982,
      "y": 0,
      "w": 539,
      "h": 1024,
      "anchorX": 1441.1,
      "anchorY": 1016
    }
  ],
  "battle_astral_phase_1": [
    {
      "x": 0,
      "y": 0,
      "w": 423,
      "h": 1024,
      "anchorX": 363.5,
      "anchorY": 1015
    }
  ],
  "battle_astral_phase_2": [
    {
      "x": 0,
      "y": 0,
      "w": 510,
      "h": 1024,
      "anchorX": 434.3,
      "anchorY": 1015
    }
  ],
  "battle_astral_phase_3": [
    {
      "x": 0,
      "y": 0,
      "w": 539,
      "h": 1024,
      "anchorX": 459.1,
      "anchorY": 1016
    }
  ],
  "astral": [
    {
      "x": 0,
      "y": 0,
      "w": 423,
      "h": 1024,
      "anchorX": 363.5,
      "anchorY": 1015
    }
  ],
  "portrait_astral": [
    {
      "x": 0,
      "y": 0,
      "w": 423,
      "h": 1024,
      "anchorX": 363.5,
      "anchorY": 1015
    }
  ],
  "env_floor_v30": [
    {
      "x": 0,
      "y": 0,
      "w": 314,
      "h": 314,
      "anchorX": 156.5,
      "anchorY": 313
    },
    {
      "x": 314,
      "y": 0,
      "w": 313,
      "h": 314,
      "anchorX": 470,
      "anchorY": 313
    },
    {
      "x": 627,
      "y": 0,
      "w": 314,
      "h": 314,
      "anchorX": 783.5,
      "anchorY": 313
    },
    {
      "x": 941,
      "y": 0,
      "w": 313,
      "h": 314,
      "anchorX": 1097,
      "anchorY": 313
    },
    {
      "x": 0,
      "y": 314,
      "w": 314,
      "h": 313,
      "anchorX": 156.5,
      "anchorY": 626
    },
    {
      "x": 314,
      "y": 314,
      "w": 313,
      "h": 313,
      "anchorX": 470,
      "anchorY": 626
    },
    {
      "x": 627,
      "y": 314,
      "w": 314,
      "h": 313,
      "anchorX": 783.5,
      "anchorY": 626
    },
    {
      "x": 941,
      "y": 314,
      "w": 313,
      "h": 313,
      "anchorX": 1097,
      "anchorY": 626
    },
    {
      "x": 0,
      "y": 627,
      "w": 314,
      "h": 314,
      "anchorX": 156.5,
      "anchorY": 940
    },
    {
      "x": 314,
      "y": 627,
      "w": 313,
      "h": 314,
      "anchorX": 470,
      "anchorY": 940
    },
    {
      "x": 627,
      "y": 627,
      "w": 314,
      "h": 314,
      "anchorX": 783.5,
      "anchorY": 940
    },
    {
      "x": 941,
      "y": 627,
      "w": 313,
      "h": 314,
      "anchorX": 1097,
      "anchorY": 940
    },
    {
      "x": 0,
      "y": 941,
      "w": 314,
      "h": 313,
      "anchorX": 156.5,
      "anchorY": 1253
    },
    {
      "x": 314,
      "y": 941,
      "w": 313,
      "h": 313,
      "anchorX": 470,
      "anchorY": 1253
    },
    {
      "x": 627,
      "y": 941,
      "w": 314,
      "h": 313,
      "anchorX": 783.5,
      "anchorY": 1253
    },
    {
      "x": 941,
      "y": 941,
      "w": 313,
      "h": 313,
      "anchorX": 1097,
      "anchorY": 1253
    }
  ],
  "v30_world_props": [
    {
      "x": 67,
      "y": 64,
      "w": 357,
      "h": 357,
      "anchorX": 248.8,
      "anchorY": 412
    },
    {
      "x": 508,
      "y": 65,
      "w": 345,
      "h": 358,
      "anchorX": 675.4,
      "anchorY": 414
    },
    {
      "x": 920,
      "y": 109,
      "w": 348,
      "h": 306,
      "anchorX": 1118.2,
      "anchorY": 406
    },
    {
      "x": 1381,
      "y": 164,
      "w": 319,
      "h": 244,
      "anchorX": 1529.7,
      "anchorY": 399
    },
    {
      "x": 91,
      "y": 479,
      "w": 302,
      "h": 345,
      "anchorX": 274.9,
      "anchorY": 815
    },
    {
      "x": 547,
      "y": 479,
      "w": 257,
      "h": 345,
      "anchorX": 676.2,
      "anchorY": 815
    },
    {
      "x": 937,
      "y": 515,
      "w": 343,
      "h": 304,
      "anchorX": 1100.7,
      "anchorY": 810
    },
    {
      "x": 1448,
      "y": 459,
      "w": 185,
      "h": 364,
      "anchorX": 1535.9,
      "anchorY": 814
    }
  ]
};

export const EXPANSION_FLOOR_ROWS_V30:Record<string,number[]>={"env_floor_v30":[0,314,627,941,1254]};

export type EnemyPresentationV30={body:string;attack:string;ultimate:string;facing:'left';ultimateTiming:number[];impactFrame:number;attackTiming?:number[];phases?:string[];phaseThresholds?:number[]};
export const ENEMY_PRESENTATION_V30:Record<string,EnemyPresentationV30>={
  "lobo": {
    "body": "wolf",
    "attack": "battle_wolf_attack",
    "ultimate": "ultimate_lobo",
    "facing": "left",
    "ultimateTiming": [
      0,
      0.11,
      0.24,
      0.36,
      0.5,
      0.60,
      0.79,
      0.92
    ],
    "impactFrame": 5
  },
  "sombra": {
    "body": "shadow",
    "attack": "battle_shadow_attack",
    "ultimate": "ultimate_sombra",
    "facing": "left",
    "ultimateTiming": [
      0,
      0.11,
      0.24,
      0.36,
      0.5,
      0.60,
      0.79,
      0.92
    ],
    "impactFrame": 5
  },
  "selo": {
    "body": "boss",
    "attack": "battle_boss_attack",
    "ultimate": "ultimate_selo",
    "facing": "left",
    "ultimateTiming": [
      0,
      0.11,
      0.24,
      0.36,
      0.5,
      0.60,
      0.79,
      0.92
    ],
    "impactFrame": 5
  },
  "eco": {
    "body": "boss",
    "attack": "battle_boss_attack",
    "ultimate": "ultimate_eco",
    "facing": "left",
    "ultimateTiming": [
      0,
      0.11,
      0.24,
      0.36,
      0.5,
      0.60,
      0.79,
      0.92
    ],
    "impactFrame": 5
  },
  "ashwolf": {
    "body": "ashwolf",
    "attack": "battle_ashwolf_attack",
    "ultimate": "ultimate_ashwolf",
    "facing": "left",
    "ultimateTiming": [
      0,
      0.11,
      0.24,
      0.36,
      0.5,
      0.60,
      0.79,
      0.92
    ],
    "impactFrame": 5
  },
  "moth": {
    "body": "moth",
    "attack": "battle_moth_attack",
    "ultimate": "ultimate_moth",
    "facing": "left",
    "ultimateTiming": [
      0,
      0.11,
      0.24,
      0.36,
      0.5,
      0.60,
      0.79,
      0.92
    ],
    "impactFrame": 5
  },
  "cinder": {
    "body": "cinder",
    "attack": "battle_cinder_attack",
    "ultimate": "ultimate_cinder",
    "facing": "left",
    "ultimateTiming": [
      0,
      0.11,
      0.24,
      0.36,
      0.5,
      0.60,
      0.79,
      0.92
    ],
    "impactFrame": 5
  },
  "lunastag": {
    "body": "lunastag",
    "attack": "battle_lunastag_attack",
    "ultimate": "ultimate_lunastag",
    "facing": "left",
    "ultimateTiming": [
      0,
      0.11,
      0.24,
      0.36,
      0.5,
      0.60,
      0.79,
      0.92
    ],
    "impactFrame": 5,
    "attackTiming": [
      0,
      0.15,
      0.3,
      0.48,
      0.64,
      0.83
    ]
  },
  "runewarden": {
    "body": "runewarden",
    "attack": "battle_runewarden_attack",
    "ultimate": "ultimate_runewarden",
    "facing": "left",
    "ultimateTiming": [
      0,
      0.11,
      0.24,
      0.36,
      0.5,
      0.60,
      0.79,
      0.92
    ],
    "impactFrame": 5,
    "attackTiming": [
      0,
      0.15,
      0.3,
      0.48,
      0.64,
      0.83
    ]
  },
  "astral": {
    "body": "astral",
    "attack": "battle_astral_attack",
    "ultimate": "ultimate_astral",
    "facing": "left",
    "ultimateTiming": [
      0,
      0.11,
      0.24,
      0.36,
      0.5,
      0.60,
      0.79,
      0.92
    ],
    "impactFrame": 5,
    "attackTiming": [
      0,
      0.15,
      0.3,
      0.48,
      0.64,
      0.83
    ],
    "phases": [
      "battle_astral_phase_1",
      "battle_astral_phase_2",
      "battle_astral_phase_3"
    ],
    "phaseThresholds": [
      0.66,
      0.33
    ]
  }
};

export const ENEMY_ULTIMATE_EFFECTS_V30={
  "lobo": {
    "element": "dark",
    "motif": "Lua fragmentada e três marcas de garras",
    "impactFrame": 5,
    "sequence": [
      "rest",
      "anticipation",
      "gather",
      "windup",
      "release",
      "contact",
      "follow-through",
      "recovery"
    ],
    "containsBodyAndLocalEffect": true
  },
  "sombra": {
    "element": "dark",
    "motif": "Espiral de correntes e maré de sombras",
    "impactFrame": 5,
    "sequence": [
      "rest",
      "anticipation",
      "gather",
      "windup",
      "release",
      "contact",
      "follow-through",
      "recovery"
    ],
    "containsBodyAndLocalEffect": true
  },
  "selo": {
    "element": "ink",
    "motif": "Selo estilhaçado e fragmentos de página",
    "impactFrame": 5,
    "sequence": [
      "rest",
      "anticipation",
      "gather",
      "windup",
      "release",
      "contact",
      "follow-through",
      "recovery"
    ],
    "containsBodyAndLocalEffect": true
  },
  "eco": {
    "element": "dark",
    "motif": "Espelhos partidos e véu violeta",
    "impactFrame": 5,
    "sequence": [
      "rest",
      "anticipation",
      "gather",
      "windup",
      "release",
      "contact",
      "follow-through",
      "recovery"
    ],
    "containsBodyAndLocalEffect": true
  },
  "ashwolf": {
    "element": "fire",
    "motif": "Brasas carmesim e uivo flamejante",
    "impactFrame": 5,
    "sequence": [
      "rest",
      "anticipation",
      "gather",
      "windup",
      "release",
      "contact",
      "follow-through",
      "recovery"
    ],
    "containsBodyAndLocalEffect": true
  },
  "moth": {
    "element": "ice",
    "motif": "Eclipse lunar e cristais violetas de geada",
    "impactFrame": 5,
    "sequence": [
      "rest",
      "anticipation",
      "gather",
      "windup",
      "release",
      "contact",
      "follow-through",
      "recovery"
    ],
    "containsBodyAndLocalEffect": true
  },
  "cinder": {
    "element": "fire",
    "motif": "Espada solar e brasas da pira",
    "impactFrame": 5,
    "sequence": [
      "rest",
      "anticipation",
      "gather",
      "windup",
      "release",
      "contact",
      "follow-through",
      "recovery"
    ],
    "containsBodyAndLocalEffect": true
  },
  "lunastag": {
    "element": "ice",
    "motif": "Coroa de gelo e investida lunar",
    "impactFrame": 5,
    "sequence": [
      "rest",
      "anticipation",
      "gather",
      "windup",
      "release",
      "contact",
      "follow-through",
      "recovery"
    ],
    "containsBodyAndLocalEffect": true
  },
  "runewarden": {
    "element": "ink",
    "motif": "Édito rúnico e arco de tinta azul",
    "impactFrame": 5,
    "sequence": [
      "rest",
      "anticipation",
      "gather",
      "windup",
      "release",
      "contact",
      "follow-through",
      "recovery"
    ],
    "containsBodyAndLocalEffect": true
  },
  "astral": {
    "element": "lightning",
    "motif": "Três órbitas douradas e estrela elétrica",
    "impactFrame": 5,
    "sequence": [
      "rest",
      "anticipation",
      "gather",
      "windup",
      "release",
      "contact",
      "follow-through",
      "recovery"
    ],
    "containsBodyAndLocalEffect": true
  }
} as const;

/** Frame holds share the authored contact pose, independent of atlas grid dimensions. */
export function enemyPoseFrame(family:string,action:string,time:number,count:number){
 const t=Math.max(0,Math.min(1,time)),presentation=ENEMY_PRESENTATION_V30[family];
 const timing=action==='ultimate'?presentation?.ultimateTiming:presentation?.attackTiming;
 return timing?.length===count?timing.reduce((frame,start,index)=>t>=start?index:frame,0):Math.min(count-1,Math.floor(t*count));
}
export function enemyBattleKey(family:string,asset:string,boss:boolean,phase:number,action?:string){
 const presentation=ENEMY_PRESENTATION_V30[family];
 if(action?.includes('ultimate'))return presentation?.ultimate||`ultimate_${family}`;
 if(!action&&presentation?.phases)return presentation.phases[Math.max(0,Math.min(presentation.phases.length-1,phase-1))];
 return presentation?.attack||`battle_${boss?'boss':asset}_attack`;
}
