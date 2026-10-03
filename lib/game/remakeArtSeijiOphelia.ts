import type {SpriteCrop} from './sprites';

// v29 native anime assets; prompts, source boxes and alpha/foot measurements: art-source/v29/{hero}.
// Walk crops follow S/W/E/N; combat poses all face right. Gameplay is unchanged by this art map.
export const REMAKE_ASSETS_SEIJI_OPHELIA: Record<string,string> = {
  "portrait_seiji": "/assets/v29/seiji/portrait.png",
  "dlg_seiji": "/assets/v29/seiji/portrait.png",
  "face_seiji": "/assets/v29/seiji/face.png",
  "seiji": "/assets/v29/seiji/walk.png",
  "battle_seiji_attack": "/assets/v29/seiji/attack.png",
  "battle_seiji_cast": "/assets/v29/seiji/cast.png",
  "battle_seiji_ultimate": "/assets/v29/seiji/ultimate.png",
  "battle_fx_seiji": "/assets/v29/seiji/vfx.png",
  "skill_icons_seiji": "/assets/v29/seiji/icons.png",
  "skill_icon_seiji_0": "/assets/v29/seiji/icons/0.png",
  "skill_icon_seiji_1": "/assets/v29/seiji/icons/1.png",
  "skill_icon_seiji_2": "/assets/v29/seiji/icons/2.png",
  "skill_icon_seiji_3": "/assets/v29/seiji/icons/3.png",
  "skill_icon_seiji_4": "/assets/v29/seiji/icons/4.png",
  "skill_icon_seiji_5": "/assets/v29/seiji/icons/5.png",
  "portrait_ophelia": "/assets/v29/ophelia/portrait.png",
  "dlg_ophelia": "/assets/v29/ophelia/portrait.png",
  "face_ophelia": "/assets/v29/ophelia/face.png",
  "ophelia": "/assets/v29/ophelia/walk.png",
  "battle_ophelia_attack": "/assets/v29/ophelia/attack.png",
  "battle_ophelia_cast": "/assets/v29/ophelia/cast.png",
  "battle_ophelia_ultimate": "/assets/v29/ophelia/ultimate.png",
  "battle_fx_ophelia": "/assets/v29/ophelia/vfx.png",
  "skill_icons_ophelia": "/assets/v29/ophelia/icons.png",
  "skill_icon_ophelia_0": "/assets/v29/ophelia/icons/0.png",
  "skill_icon_ophelia_1": "/assets/v29/ophelia/icons/1.png",
  "skill_icon_ophelia_2": "/assets/v29/ophelia/icons/2.png",
  "skill_icon_ophelia_3": "/assets/v29/ophelia/icons/3.png",
  "skill_icon_ophelia_4": "/assets/v29/ophelia/icons/4.png",
  "skill_icon_ophelia_5": "/assets/v29/ophelia/icons/5.png"
};

export const REMAKE_FRAMES_SEIJI_OPHELIA: Record<string,SpriteCrop[]> = {
  "seiji": [
    {
      "x": 174,
      "y": 7,
      "w": 176,
      "h": 299,
      "anchorX": 269.0,
      "anchorY": 302
    },
    {
      "x": 533,
      "y": 7,
      "w": 181,
      "h": 299,
      "anchorX": 632.0,
      "anchorY": 302
    },
    {
      "x": 892,
      "y": 7,
      "w": 186,
      "h": 299,
      "anchorX": 996.0,
      "anchorY": 302
    },
    {
      "x": 176,
      "y": 317,
      "w": 210,
      "h": 299,
      "anchorX": 204.0,
      "anchorY": 612
    },
    {
      "x": 534,
      "y": 317,
      "w": 205,
      "h": 297,
      "anchorX": 566.0,
      "anchorY": 610
    },
    {
      "x": 889,
      "y": 317,
      "w": 210,
      "h": 296,
      "anchorX": 916.0,
      "anchorY": 610
    },
    {
      "x": 156,
      "y": 633,
      "w": 214,
      "h": 290,
      "anchorX": 325.0,
      "anchorY": 919
    },
    {
      "x": 517,
      "y": 633,
      "w": 204,
      "h": 295,
      "anchorX": 690.0,
      "anchorY": 924
    },
    {
      "x": 888,
      "y": 633,
      "w": 207,
      "h": 295,
      "anchorX": 1068.0,
      "anchorY": 924
    },
    {
      "x": 174,
      "y": 936,
      "w": 186,
      "h": 295,
      "anchorX": 261.0,
      "anchorY": 1227
    },
    {
      "x": 531,
      "y": 937,
      "w": 190,
      "h": 294,
      "anchorX": 621.0,
      "anchorY": 1227
    },
    {
      "x": 897,
      "y": 936,
      "w": 192,
      "h": 297,
      "anchorX": 994.0,
      "anchorY": 1229
    }
  ],
  "battle_seiji_attack": [
    {
      "x": 100,
      "y": 32,
      "w": 325,
      "h": 473,
      "anchorX": 203.0,
      "anchorY": 501
    },
    {
      "x": 561,
      "y": 78,
      "w": 384,
      "h": 426,
      "anchorX": 638.0,
      "anchorY": 500
    },
    {
      "x": 1045,
      "y": 90,
      "w": 482,
      "h": 414,
      "anchorX": 1105.0,
      "anchorY": 500
    },
    {
      "x": 84,
      "y": 562,
      "w": 504,
      "h": 422,
      "anchorX": 129.0,
      "anchorY": 980
    },
    {
      "x": 600,
      "y": 551,
      "w": 437,
      "h": 428,
      "anchorX": 638.0,
      "anchorY": 975
    },
    {
      "x": 1098,
      "y": 521,
      "w": 358,
      "h": 467,
      "anchorX": 1205.5,
      "anchorY": 984
    }
  ],
  "battle_seiji_cast": [
    {
      "x": 74,
      "y": 9,
      "w": 376,
      "h": 506,
      "anchorX": 204.0,
      "anchorY": 511
    },
    {
      "x": 540,
      "y": 5,
      "w": 455,
      "h": 510,
      "anchorX": 663.0,
      "anchorY": 511
    },
    {
      "x": 1039,
      "y": 26,
      "w": 482,
      "h": 488,
      "anchorX": 1182.0,
      "anchorY": 510
    },
    {
      "x": 31,
      "y": 518,
      "w": 402,
      "h": 494,
      "anchorX": 145.0,
      "anchorY": 1008
    },
    {
      "x": 520,
      "y": 521,
      "w": 526,
      "h": 491,
      "anchorX": 616.0,
      "anchorY": 1008
    },
    {
      "x": 1127,
      "y": 517,
      "w": 383,
      "h": 496,
      "anchorX": 1237.0,
      "anchorY": 1009
    }
  ],
  "battle_seiji_ultimate": [
    {
      "x": 49,
      "y": 17,
      "w": 313,
      "h": 429,
      "anchorX": 168.0,
      "anchorY": 441
    },
    {
      "x": 463,
      "y": 24,
      "w": 347,
      "h": 422,
      "anchorX": 598.0,
      "anchorY": 441
    },
    {
      "x": 917,
      "y": 22,
      "w": 356,
      "h": 424,
      "anchorX": 1043.0,
      "anchorY": 441
    },
    {
      "x": 1336,
      "y": 14,
      "w": 420,
      "h": 432,
      "anchorX": 1473.0,
      "anchorY": 442
    },
    {
      "x": 22,
      "y": 451,
      "w": 407,
      "h": 421,
      "anchorX": 149.0,
      "anchorY": 868
    },
    {
      "x": 467,
      "y": 458,
      "w": 523,
      "h": 414,
      "anchorX": 551.0,
      "anchorY": 869
    },
    {
      "x": 1002,
      "y": 460,
      "w": 306,
      "h": 412,
      "anchorX": 1088.0,
      "anchorY": 868
    },
    {
      "x": 1381,
      "y": 453,
      "w": 320,
      "h": 423,
      "anchorX": 1501.0,
      "anchorY": 872
    }
  ],
  "battle_fx_seiji": [
    {
      "x": 23,
      "y": 15,
      "w": 450,
      "h": 468,
      "anchorX": 248.0,
      "anchorY": 249.0
    },
    {
      "x": 514,
      "y": 118,
      "w": 521,
      "h": 287,
      "anchorX": 774.5,
      "anchorY": 261.5
    },
    {
      "x": 1063,
      "y": 10,
      "w": 452,
      "h": 472,
      "anchorX": 1289.0,
      "anchorY": 246.0
    },
    {
      "x": 15,
      "y": 503,
      "w": 472,
      "h": 514,
      "anchorX": 251.0,
      "anchorY": 760.0
    },
    {
      "x": 568,
      "y": 495,
      "w": 399,
      "h": 523,
      "anchorX": 767.5,
      "anchorY": 756.5
    },
    {
      "x": 1029,
      "y": 496,
      "w": 492,
      "h": 520,
      "anchorX": 1275.0,
      "anchorY": 756.0
    }
  ],
  "skill_icons_seiji": [
    {
      "x": 33,
      "y": 14,
      "w": 480,
      "h": 465,
      "anchorX": 273.0,
      "anchorY": 246.5
    },
    {
      "x": 535,
      "y": 17,
      "w": 471,
      "h": 457,
      "anchorX": 770.5,
      "anchorY": 245.5
    },
    {
      "x": 1022,
      "y": 15,
      "w": 470,
      "h": 461,
      "anchorX": 1257.0,
      "anchorY": 245.5
    },
    {
      "x": 28,
      "y": 493,
      "w": 488,
      "h": 506,
      "anchorX": 272.0,
      "anchorY": 746.0
    },
    {
      "x": 533,
      "y": 494,
      "w": 468,
      "h": 468,
      "anchorX": 767.0,
      "anchorY": 728.0
    },
    {
      "x": 1012,
      "y": 494,
      "w": 501,
      "h": 506,
      "anchorX": 1262.5,
      "anchorY": 747.0
    }
  ],
  "ophelia": [
    {
      "x": 106,
      "y": 4,
      "w": 238,
      "h": 347,
      "anchorX": 210.0,
      "anchorY": 347
    },
    {
      "x": 429,
      "y": 4,
      "w": 226,
      "h": 347,
      "anchorX": 540.0,
      "anchorY": 347
    },
    {
      "x": 746,
      "y": 4,
      "w": 232,
      "h": 347,
      "anchorX": 846.0,
      "anchorY": 347
    },
    {
      "x": 84,
      "y": 363,
      "w": 276,
      "h": 338,
      "anchorX": 131.0,
      "anchorY": 697
    },
    {
      "x": 444,
      "y": 363,
      "w": 239,
      "h": 339,
      "anchorX": 487.0,
      "anchorY": 697
    },
    {
      "x": 759,
      "y": 363,
      "w": 260,
      "h": 340,
      "anchorX": 805.0,
      "anchorY": 699
    },
    {
      "x": 74,
      "y": 717,
      "w": 270,
      "h": 341,
      "anchorX": 293.0,
      "anchorY": 1054
    },
    {
      "x": 407,
      "y": 716,
      "w": 247,
      "h": 343,
      "anchorX": 618.0,
      "anchorY": 1055
    },
    {
      "x": 737,
      "y": 716,
      "w": 263,
      "h": 343,
      "anchorX": 857.0,
      "anchorY": 1055
    },
    {
      "x": 89,
      "y": 1080,
      "w": 240,
      "h": 351,
      "anchorX": 208.0,
      "anchorY": 1427
    },
    {
      "x": 425,
      "y": 1081,
      "w": 236,
      "h": 350,
      "anchorX": 537.0,
      "anchorY": 1427
    },
    {
      "x": 755,
      "y": 1080,
      "w": 237,
      "h": 351,
      "anchorX": 846.0,
      "anchorY": 1427
    }
  ],
  "battle_ophelia_attack": [
    {
      "x": 79,
      "y": 7,
      "w": 341,
      "h": 503,
      "anchorX": 307.0,
      "anchorY": 506
    },
    {
      "x": 562,
      "y": 7,
      "w": 351,
      "h": 502,
      "anchorX": 791.0,
      "anchorY": 505
    },
    {
      "x": 1093,
      "y": 8,
      "w": 348,
      "h": 501,
      "anchorX": 1316.0,
      "anchorY": 505
    },
    {
      "x": 61,
      "y": 523,
      "w": 423,
      "h": 494,
      "anchorX": 340.0,
      "anchorY": 1012
    },
    {
      "x": 558,
      "y": 520,
      "w": 385,
      "h": 497,
      "anchorX": 842.0,
      "anchorY": 1013
    },
    {
      "x": 1102,
      "y": 520,
      "w": 342,
      "h": 501,
      "anchorX": 1331.0,
      "anchorY": 1017
    }
  ],
  "battle_ophelia_cast": [
    {
      "x": 113,
      "y": 3,
      "w": 359,
      "h": 506,
      "anchorX": 352.0,
      "anchorY": 505
    },
    {
      "x": 592,
      "y": 4,
      "w": 361,
      "h": 505,
      "anchorX": 831.0,
      "anchorY": 505
    },
    {
      "x": 1072,
      "y": 4,
      "w": 357,
      "h": 505,
      "anchorX": 1310.0,
      "anchorY": 505
    },
    {
      "x": 109,
      "y": 514,
      "w": 370,
      "h": 506,
      "anchorX": 364.0,
      "anchorY": 1016
    },
    {
      "x": 591,
      "y": 513,
      "w": 373,
      "h": 507,
      "anchorX": 841.0,
      "anchorY": 1016
    },
    {
      "x": 1071,
      "y": 514,
      "w": 370,
      "h": 506,
      "anchorX": 1321.0,
      "anchorY": 1016
    }
  ],
  "battle_ophelia_ultimate": [
    {
      "x": 83,
      "y": 2,
      "w": 321,
      "h": 439,
      "anchorX": 274.0,
      "anchorY": 436
    },
    {
      "x": 511,
      "y": 2,
      "w": 322,
      "h": 439,
      "anchorX": 699.0,
      "anchorY": 437
    },
    {
      "x": 949,
      "y": 2,
      "w": 312,
      "h": 439,
      "anchorX": 1132.0,
      "anchorY": 436
    },
    {
      "x": 1379,
      "y": 4,
      "w": 333,
      "h": 437,
      "anchorX": 1571.0,
      "anchorY": 436
    },
    {
      "x": 70,
      "y": 450,
      "w": 361,
      "h": 433,
      "anchorX": 275.0,
      "anchorY": 879
    },
    {
      "x": 508,
      "y": 448,
      "w": 333,
      "h": 435,
      "anchorX": 700.0,
      "anchorY": 879
    },
    {
      "x": 952,
      "y": 447,
      "w": 322,
      "h": 436,
      "anchorX": 1139.0,
      "anchorY": 879
    },
    {
      "x": 1386,
      "y": 447,
      "w": 319,
      "h": 437,
      "anchorX": 1572.0,
      "anchorY": 880
    }
  ],
  "battle_fx_ophelia": [
    {
      "x": 31,
      "y": 43,
      "w": 449,
      "h": 440,
      "anchorX": 255.5,
      "anchorY": 263.0
    },
    {
      "x": 519,
      "y": 143,
      "w": 538,
      "h": 237,
      "anchorX": 788.0,
      "anchorY": 261.5
    },
    {
      "x": 1066,
      "y": 23,
      "w": 428,
      "h": 468,
      "anchorX": 1280.0,
      "anchorY": 257.0
    },
    {
      "x": 61,
      "y": 506,
      "w": 391,
      "h": 477,
      "anchorX": 256.5,
      "anchorY": 744.5
    },
    {
      "x": 533,
      "y": 508,
      "w": 472,
      "h": 471,
      "anchorX": 769.0,
      "anchorY": 743.5
    },
    {
      "x": 1023,
      "y": 507,
      "w": 495,
      "h": 487,
      "anchorX": 1270.5,
      "anchorY": 750.5
    }
  ],
  "skill_icons_ophelia": [
    {
      "x": 12,
      "y": 0,
      "w": 487,
      "h": 486,
      "anchorX": 255.5,
      "anchorY": 243.0
    },
    {
      "x": 536,
      "y": 0,
      "w": 465,
      "h": 486,
      "anchorX": 768.5,
      "anchorY": 243.0
    },
    {
      "x": 1034,
      "y": 0,
      "w": 492,
      "h": 483,
      "anchorX": 1280.0,
      "anchorY": 241.5
    },
    {
      "x": 12,
      "y": 494,
      "w": 488,
      "h": 511,
      "anchorX": 256.0,
      "anchorY": 749.5
    },
    {
      "x": 521,
      "y": 494,
      "w": 495,
      "h": 511,
      "anchorX": 768.5,
      "anchorY": 749.5
    },
    {
      "x": 1036,
      "y": 483,
      "w": 490,
      "h": 522,
      "anchorX": 1281.0,
      "anchorY": 744.0
    }
  ]
};
