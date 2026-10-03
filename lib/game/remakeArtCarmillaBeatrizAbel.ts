import type {SpriteCrop} from './sprites';

// v29 final native anime art. Source prompts and measurements: art-source/v29/{hero}.
// Abel remains catalog/invocation art; this module introduces no playable data or stats.
export const REMAKE_ASSETS_CARMILLA_BEATRIZ_ABEL: Record<string,string> = {
  "portrait_carmilla": "/assets/v29/carmilla/portrait.png",
  "dlg_carmilla": "/assets/v29/carmilla/portrait.png",
  "face_carmilla": "/assets/v29/carmilla/face.png",
  "carmilla": "/assets/v29/carmilla/walk.png",
  "battle_carmilla_attack": "/assets/v29/carmilla/attack.png",
  "battle_carmilla_cast": "/assets/v29/carmilla/cast.png",
  "battle_carmilla_ultimate": "/assets/v29/carmilla/ultimate.png",
  "battle_fx_carmilla": "/assets/v29/carmilla/vfx.png",
  "skill_icons_carmilla": "/assets/v29/carmilla/icons.png",
  "skill_icon_carmilla_0": "/assets/v29/carmilla/icons/0.png",
  "skill_icon_carmilla_1": "/assets/v29/carmilla/icons/1.png",
  "skill_icon_carmilla_2": "/assets/v29/carmilla/icons/2.png",
  "skill_icon_carmilla_3": "/assets/v29/carmilla/icons/3.png",
  "skill_icon_carmilla_4": "/assets/v29/carmilla/icons/4.png",
  "skill_icon_carmilla_5": "/assets/v29/carmilla/icons/5.png",
  "portrait_beatriz": "/assets/v29/beatriz/portrait.png",
  "dlg_beatriz": "/assets/v29/beatriz/portrait.png",
  "face_beatriz": "/assets/v29/beatriz/face.png",
  "beatriz": "/assets/v29/beatriz/walk.png",
  "battle_beatriz_attack": "/assets/v29/beatriz/attack.png",
  "battle_beatriz_cast": "/assets/v29/beatriz/cast.png",
  "battle_beatriz_ultimate": "/assets/v29/beatriz/ultimate.png",
  "battle_fx_beatriz": "/assets/v29/beatriz/vfx.png",
  "skill_icons_beatriz": "/assets/v29/beatriz/icons.png",
  "skill_icon_beatriz_0": "/assets/v29/beatriz/icons/0.png",
  "skill_icon_beatriz_1": "/assets/v29/beatriz/icons/1.png",
  "skill_icon_beatriz_2": "/assets/v29/beatriz/icons/2.png",
  "skill_icon_beatriz_3": "/assets/v29/beatriz/icons/3.png",
  "skill_icon_beatriz_4": "/assets/v29/beatriz/icons/4.png",
  "skill_icon_beatriz_5": "/assets/v29/beatriz/icons/5.png",
  "portrait_abel": "/assets/v29/abel/portrait.png",
  "dlg_abel": "/assets/v29/abel/portrait.png",
  "face_abel": "/assets/v29/abel/face.png",
  "battle_abel_attack": "/assets/v29/abel/attack.png",
  "battle_abel_cast": "/assets/v29/abel/cast.png",
  "battle_abel_ultimate": "/assets/v29/abel/ultimate.png",
  "battle_fx_abel": "/assets/v29/abel/vfx.png",
  "skill_icons_abel": "/assets/v29/abel/icons.png",
  "skill_icon_abel_0": "/assets/v29/abel/icons/0.png",
  "skill_icon_abel_1": "/assets/v29/abel/icons/1.png",
  "skill_icon_abel_2": "/assets/v29/abel/icons/2.png",
  "skill_icon_abel_3": "/assets/v29/abel/icons/3.png",
  "skill_icon_abel_4": "/assets/v29/abel/icons/4.png",
  "skill_icon_abel_5": "/assets/v29/abel/icons/5.png"
};

// Walk order S/W/E/N, three poses each; neutral idle is the center pose (index 1).
// Attack frame0 is quiet ready, VFX order impact/cut/protection/control/signature/ultimate.
export const REMAKE_FRAMES_CARMILLA_BEATRIZ_ABEL: Record<string,SpriteCrop[]> = {
  "carmilla": [
    {
      "x": 100,
      "y": 2,
      "w": 227,
      "h": 358,
      "anchorX": 224.9,
      "anchorY": 356
    },
    {
      "x": 434,
      "y": 2,
      "w": 219,
      "h": 358,
      "anchorX": 542.3,
      "anchorY": 354
    },
    {
      "x": 760,
      "y": 2,
      "w": 227,
      "h": 358,
      "anchorX": 857.8,
      "anchorY": 355
    },
    {
      "x": 101,
      "y": 360,
      "w": 266,
      "h": 353,
      "anchorX": 193.5,
      "anchorY": 706
    },
    {
      "x": 466,
      "y": 360,
      "w": 204,
      "h": 353,
      "anchorX": 535.3,
      "anchorY": 707
    },
    {
      "x": 752,
      "y": 360,
      "w": 262,
      "h": 353,
      "anchorX": 831.2,
      "anchorY": 706
    },
    {
      "x": 63,
      "y": 713,
      "w": 266,
      "h": 354,
      "anchorX": 232,
      "anchorY": 1061
    },
    {
      "x": 420,
      "y": 713,
      "w": 203,
      "h": 354,
      "anchorX": 550.4,
      "anchorY": 1061
    },
    {
      "x": 719,
      "y": 713,
      "w": 273,
      "h": 354,
      "anchorX": 882.9,
      "anchorY": 1061
    },
    {
      "x": 85,
      "y": 1067,
      "w": 245,
      "h": 363,
      "anchorX": 216.8,
      "anchorY": 1421
    },
    {
      "x": 437,
      "y": 1067,
      "w": 211,
      "h": 360,
      "anchorX": 542.8,
      "anchorY": 1418
    },
    {
      "x": 755,
      "y": 1067,
      "w": 245,
      "h": 363,
      "anchorX": 867.6,
      "anchorY": 1421
    }
  ],
  "battle_carmilla_attack": [
    {
      "x": 40,
      "y": 5,
      "w": 371,
      "h": 495,
      "anchorX": 266,
      "anchorY": 491
    },
    {
      "x": 581,
      "y": 5,
      "w": 390,
      "h": 490,
      "anchorX": 787.7,
      "anchorY": 486
    },
    {
      "x": 1042,
      "y": 16,
      "w": 483,
      "h": 481,
      "anchorX": 1240.8,
      "anchorY": 488
    },
    {
      "x": 23,
      "y": 515,
      "w": 507,
      "h": 472,
      "anchorX": 213.9,
      "anchorY": 978
    },
    {
      "x": 530,
      "y": 521,
      "w": 505,
      "h": 466,
      "anchorX": 769.1,
      "anchorY": 978
    },
    {
      "x": 1083,
      "y": 510,
      "w": 382,
      "h": 492,
      "anchorX": 1323.1,
      "anchorY": 993
    }
  ],
  "battle_carmilla_cast": [
    {
      "x": 39,
      "y": 5,
      "w": 377,
      "h": 508,
      "anchorX": 265.1,
      "anchorY": 505
    },
    {
      "x": 511,
      "y": 5,
      "w": 426,
      "h": 508,
      "anchorX": 751.6,
      "anchorY": 505
    },
    {
      "x": 974,
      "y": 11,
      "w": 556,
      "h": 502,
      "anchorX": 1234.1,
      "anchorY": 505
    },
    {
      "x": 29,
      "y": 513,
      "w": 469,
      "h": 507,
      "anchorX": 286.4,
      "anchorY": 1011
    },
    {
      "x": 547,
      "y": 513,
      "w": 379,
      "h": 507,
      "anchorX": 786.1,
      "anchorY": 1011
    },
    {
      "x": 1051,
      "y": 513,
      "w": 379,
      "h": 507,
      "anchorX": 1284,
      "anchorY": 1011
    }
  ],
  "battle_carmilla_ultimate": [
    {
      "x": 82,
      "y": 69,
      "w": 272,
      "h": 373,
      "anchorX": 241.5,
      "anchorY": 433
    },
    {
      "x": 539,
      "y": 60,
      "w": 278,
      "h": 382,
      "anchorX": 697.3,
      "anchorY": 433
    },
    {
      "x": 956,
      "y": 69,
      "w": 286,
      "h": 373,
      "anchorX": 1123.7,
      "anchorY": 433
    },
    {
      "x": 1402,
      "y": 44,
      "w": 324,
      "h": 398,
      "anchorX": 1571.8,
      "anchorY": 433
    },
    {
      "x": 58,
      "y": 502,
      "w": 460,
      "h": 360,
      "anchorX": 246.2,
      "anchorY": 853
    },
    {
      "x": 520,
      "y": 477,
      "w": 306,
      "h": 385,
      "anchorX": 689.3,
      "anchorY": 853
    },
    {
      "x": 953,
      "y": 504,
      "w": 356,
      "h": 358,
      "anchorX": 1118.3,
      "anchorY": 853
    },
    {
      "x": 1414,
      "y": 505,
      "w": 276,
      "h": 357,
      "anchorX": 1570.4,
      "anchorY": 853
    }
  ],
  "battle_fx_carmilla": [
    {
      "x": 36,
      "y": 0,
      "w": 452,
      "h": 503,
      "anchorX": 262,
      "anchorY": 252.5
    },
    {
      "x": 488,
      "y": 44,
      "w": 507,
      "h": 448,
      "anchorX": 741,
      "anchorY": 267.5
    },
    {
      "x": 1037,
      "y": 1,
      "w": 477,
      "h": 500,
      "anchorX": 1275,
      "anchorY": 250.5
    },
    {
      "x": 58,
      "y": 537,
      "w": 442,
      "h": 443,
      "anchorX": 278.5,
      "anchorY": 758
    },
    {
      "x": 569,
      "y": 511,
      "w": 408,
      "h": 497,
      "anchorX": 772.5,
      "anchorY": 759
    },
    {
      "x": 1025,
      "y": 503,
      "w": 499,
      "h": 503,
      "anchorX": 1274,
      "anchorY": 751
    }
  ],
  "skill_icons_carmilla": [
    {
      "x": 23,
      "y": 3,
      "w": 478,
      "h": 477,
      "anchorX": 261.5,
      "anchorY": 241.5
    },
    {
      "x": 528,
      "y": 3,
      "w": 477,
      "h": 470,
      "anchorX": 766,
      "anchorY": 237.5
    },
    {
      "x": 1032,
      "y": 4,
      "w": 482,
      "h": 476,
      "anchorX": 1272.5,
      "anchorY": 241.5
    },
    {
      "x": 8,
      "y": 481,
      "w": 504,
      "h": 501,
      "anchorX": 259.5,
      "anchorY": 731
    },
    {
      "x": 520,
      "y": 482,
      "w": 494,
      "h": 500,
      "anchorX": 766.5,
      "anchorY": 731.5
    },
    {
      "x": 1026,
      "y": 480,
      "w": 498,
      "h": 515,
      "anchorX": 1274.5,
      "anchorY": 736.5
    }
  ],
  "beatriz": [
    {
      "x": 103,
      "y": 47,
      "w": 215,
      "h": 320,
      "anchorX": 204.4,
      "anchorY": 358
    },
    {
      "x": 448,
      "y": 47,
      "w": 211,
      "h": 317,
      "anchorX": 554.4,
      "anchorY": 355
    },
    {
      "x": 788,
      "y": 47,
      "w": 211,
      "h": 320,
      "anchorX": 889.4,
      "anchorY": 358
    },
    {
      "x": 101,
      "y": 385,
      "w": 230,
      "h": 320,
      "anchorX": 175.5,
      "anchorY": 696
    },
    {
      "x": 459,
      "y": 387,
      "w": 210,
      "h": 318,
      "anchorX": 539.1,
      "anchorY": 696
    },
    {
      "x": 794,
      "y": 386,
      "w": 231,
      "h": 318,
      "anchorX": 869.7,
      "anchorY": 695
    },
    {
      "x": 83,
      "y": 737,
      "w": 229,
      "h": 318,
      "anchorX": 230.1,
      "anchorY": 1046
    },
    {
      "x": 432,
      "y": 739,
      "w": 218,
      "h": 318,
      "anchorX": 573.9,
      "anchorY": 1048
    },
    {
      "x": 774,
      "y": 739,
      "w": 234,
      "h": 318,
      "anchorX": 923,
      "anchorY": 1048
    },
    {
      "x": 102,
      "y": 1070,
      "w": 224,
      "h": 331,
      "anchorX": 205.6,
      "anchorY": 1392
    },
    {
      "x": 440,
      "y": 1071,
      "w": 229,
      "h": 328,
      "anchorX": 547.2,
      "anchorY": 1390
    },
    {
      "x": 785,
      "y": 1070,
      "w": 220,
      "h": 332,
      "anchorX": 902.1,
      "anchorY": 1393
    }
  ],
  "battle_beatriz_attack": [
    {
      "x": 70,
      "y": 40,
      "w": 368,
      "h": 455,
      "anchorX": 278.3,
      "anchorY": 486
    },
    {
      "x": 565,
      "y": 30,
      "w": 393,
      "h": 465,
      "anchorX": 798.5,
      "anchorY": 486
    },
    {
      "x": 1019,
      "y": 88,
      "w": 505,
      "h": 407,
      "anchorX": 1239.4,
      "anchorY": 486
    },
    {
      "x": 34,
      "y": 560,
      "w": 546,
      "h": 412,
      "anchorX": 259.9,
      "anchorY": 963
    },
    {
      "x": 588,
      "y": 563,
      "w": 463,
      "h": 412,
      "anchorX": 794.5,
      "anchorY": 966
    },
    {
      "x": 1099,
      "y": 529,
      "w": 374,
      "h": 455,
      "anchorX": 1312.3,
      "anchorY": 975
    }
  ],
  "battle_beatriz_cast": [
    {
      "x": 87,
      "y": 44,
      "w": 308,
      "h": 429,
      "anchorX": 282.2,
      "anchorY": 464
    },
    {
      "x": 590,
      "y": 59,
      "w": 381,
      "h": 413,
      "anchorX": 791.2,
      "anchorY": 463
    },
    {
      "x": 1083,
      "y": 61,
      "w": 384,
      "h": 413,
      "anchorX": 1289.4,
      "anchorY": 465
    },
    {
      "x": 61,
      "y": 564,
      "w": 471,
      "h": 413,
      "anchorX": 266.4,
      "anchorY": 968
    },
    {
      "x": 628,
      "y": 560,
      "w": 335,
      "h": 419,
      "anchorX": 825.6,
      "anchorY": 970
    },
    {
      "x": 1145,
      "y": 553,
      "w": 306,
      "h": 428,
      "anchorX": 1341.2,
      "anchorY": 972
    }
  ],
  "battle_beatriz_ultimate": [
    {
      "x": 113,
      "y": 89,
      "w": 230,
      "h": 351,
      "anchorX": 236.3,
      "anchorY": 431
    },
    {
      "x": 526,
      "y": 72,
      "w": 295,
      "h": 368,
      "anchorX": 655.3,
      "anchorY": 431
    },
    {
      "x": 960,
      "y": 95,
      "w": 349,
      "h": 346,
      "anchorX": 1130.5,
      "anchorY": 432
    },
    {
      "x": 1439,
      "y": 52,
      "w": 247,
      "h": 386,
      "anchorX": 1550.4,
      "anchorY": 429
    },
    {
      "x": 44,
      "y": 535,
      "w": 402,
      "h": 297,
      "anchorX": 252.6,
      "anchorY": 823
    },
    {
      "x": 542,
      "y": 503,
      "w": 310,
      "h": 330,
      "anchorX": 684.2,
      "anchorY": 824
    },
    {
      "x": 967,
      "y": 512,
      "w": 348,
      "h": 322,
      "anchorX": 1116.4,
      "anchorY": 825
    },
    {
      "x": 1447,
      "y": 496,
      "w": 238,
      "h": 351,
      "anchorX": 1584.7,
      "anchorY": 838
    }
  ],
  "battle_fx_beatriz": [
    {
      "x": 23,
      "y": 16,
      "w": 487,
      "h": 471,
      "anchorX": 266,
      "anchorY": 251
    },
    {
      "x": 546,
      "y": 35,
      "w": 468,
      "h": 456,
      "anchorX": 779.5,
      "anchorY": 262.5
    },
    {
      "x": 1045,
      "y": 58,
      "w": 473,
      "h": 425,
      "anchorX": 1281,
      "anchorY": 270
    },
    {
      "x": 24,
      "y": 517,
      "w": 462,
      "h": 486,
      "anchorX": 254.5,
      "anchorY": 759.5
    },
    {
      "x": 528,
      "y": 530,
      "w": 489,
      "h": 453,
      "anchorX": 772,
      "anchorY": 756
    },
    {
      "x": 1048,
      "y": 522,
      "w": 468,
      "h": 471,
      "anchorX": 1281.5,
      "anchorY": 757
    }
  ],
  "skill_icons_beatriz": [
    {
      "x": 43,
      "y": 20,
      "w": 443,
      "h": 489,
      "anchorX": 264,
      "anchorY": 264
    },
    {
      "x": 545,
      "y": 31,
      "w": 449,
      "h": 448,
      "anchorX": 769,
      "anchorY": 254.5
    },
    {
      "x": 1045,
      "y": 35,
      "w": 448,
      "h": 477,
      "anchorX": 1268.5,
      "anchorY": 276.5
    },
    {
      "x": 39,
      "y": 512,
      "w": 455,
      "h": 453,
      "anchorX": 266,
      "anchorY": 735.5
    },
    {
      "x": 545,
      "y": 512,
      "w": 449,
      "h": 453,
      "anchorX": 769,
      "anchorY": 735
    },
    {
      "x": 1035,
      "y": 512,
      "w": 473,
      "h": 458,
      "anchorX": 1271,
      "anchorY": 737.5
    }
  ],
  "battle_abel_attack": [
    {
      "x": 89,
      "y": 28,
      "w": 338,
      "h": 490,
      "anchorX": 263,
      "anchorY": 509
    },
    {
      "x": 517,
      "y": 17,
      "w": 425,
      "h": 497,
      "anchorX": 747.6,
      "anchorY": 505
    },
    {
      "x": 953,
      "y": 83,
      "w": 571,
      "h": 430,
      "anchorX": 1183.1,
      "anchorY": 504
    },
    {
      "x": 24,
      "y": 538,
      "w": 628,
      "h": 459,
      "anchorX": 273,
      "anchorY": 988
    },
    {
      "x": 654,
      "y": 559,
      "w": 426,
      "h": 440,
      "anchorX": 878.6,
      "anchorY": 990
    },
    {
      "x": 1119,
      "y": 523,
      "w": 352,
      "h": 486,
      "anchorX": 1299.1,
      "anchorY": 1000
    }
  ],
  "battle_abel_cast": [
    {
      "x": 101,
      "y": 69,
      "w": 310,
      "h": 417,
      "anchorX": 277.8,
      "anchorY": 477
    },
    {
      "x": 599,
      "y": 64,
      "w": 343,
      "h": 423,
      "anchorX": 775.6,
      "anchorY": 478
    },
    {
      "x": 1092,
      "y": 73,
      "w": 358,
      "h": 414,
      "anchorX": 1257,
      "anchorY": 478
    },
    {
      "x": 44,
      "y": 585,
      "w": 544,
      "h": 355,
      "anchorX": 270.3,
      "anchorY": 931
    },
    {
      "x": 644,
      "y": 556,
      "w": 365,
      "h": 407,
      "anchorX": 823.2,
      "anchorY": 954
    },
    {
      "x": 1123,
      "y": 551,
      "w": 309,
      "h": 414,
      "anchorX": 1300.4,
      "anchorY": 956
    }
  ],
  "battle_abel_ultimate": [
    {
      "x": 23,
      "y": 5,
      "w": 321,
      "h": 440,
      "anchorX": 210.9,
      "anchorY": 436
    },
    {
      "x": 470,
      "y": 0,
      "w": 379,
      "h": 444,
      "anchorX": 685.5,
      "anchorY": 435
    },
    {
      "x": 935,
      "y": 33,
      "w": 368,
      "h": 411,
      "anchorX": 1134.5,
      "anchorY": 435
    },
    {
      "x": 1415,
      "y": 33,
      "w": 343,
      "h": 411,
      "anchorX": 1596.7,
      "anchorY": 435
    },
    {
      "x": 1,
      "y": 481,
      "w": 472,
      "h": 372,
      "anchorX": 234.9,
      "anchorY": 844
    },
    {
      "x": 498,
      "y": 449,
      "w": 373,
      "h": 430,
      "anchorX": 678.5,
      "anchorY": 870
    },
    {
      "x": 940,
      "y": 475,
      "w": 385,
      "h": 405,
      "anchorX": 1142.1,
      "anchorY": 871
    },
    {
      "x": 1369,
      "y": 445,
      "w": 334,
      "h": 439,
      "anchorX": 1565.2,
      "anchorY": 875
    }
  ],
  "battle_fx_abel": [
    {
      "x": 26,
      "y": 9,
      "w": 470,
      "h": 487,
      "anchorX": 260.5,
      "anchorY": 252
    },
    {
      "x": 532,
      "y": 44,
      "w": 477,
      "h": 428,
      "anchorX": 770,
      "anchorY": 257.5
    },
    {
      "x": 1042,
      "y": 42,
      "w": 477,
      "h": 444,
      "anchorX": 1280,
      "anchorY": 263.5
    },
    {
      "x": 22,
      "y": 586,
      "w": 476,
      "h": 347,
      "anchorX": 259.5,
      "anchorY": 759
    },
    {
      "x": 531,
      "y": 520,
      "w": 454,
      "h": 494,
      "anchorX": 757.5,
      "anchorY": 766.5
    },
    {
      "x": 1035,
      "y": 515,
      "w": 475,
      "h": 479,
      "anchorX": 1272,
      "anchorY": 754
    }
  ],
  "skill_icons_abel": [
    {
      "x": 15,
      "y": 0,
      "w": 482,
      "h": 489,
      "anchorX": 255.5,
      "anchorY": 244
    },
    {
      "x": 528,
      "y": 0,
      "w": 482,
      "h": 490,
      "anchorX": 768.5,
      "anchorY": 244.5
    },
    {
      "x": 1040,
      "y": 0,
      "w": 482,
      "h": 489,
      "anchorX": 1280.5,
      "anchorY": 244
    },
    {
      "x": 15,
      "y": 504,
      "w": 482,
      "h": 497,
      "anchorX": 255.5,
      "anchorY": 752
    },
    {
      "x": 527,
      "y": 512,
      "w": 482,
      "h": 489,
      "anchorX": 767.5,
      "anchorY": 756
    },
    {
      "x": 1040,
      "y": 512,
      "w": 483,
      "h": 489,
      "anchorX": 1281,
      "anchorY": 756
    }
  ]
};
