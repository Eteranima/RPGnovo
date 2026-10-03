import type { SpriteCrop } from './sprites';

// v29: native imagegen RGBA sheets; per-pose crops measured against visible alpha.
// Walk row order S/W/E/N. Combat faces right; attack frame0 contains no VFX.
export const REMAKE_ASSETS_GABRIEL_MARIN_MAX: Record<string,string> = {
  "dlg_gabriel": "/assets/v29/gabriel/portrait.png",
  "face_gabriel": "/assets/v29/gabriel/face.png",
  "gabriel": "/assets/v29/gabriel/walk.png",
  "battle_gabriel_attack": "/assets/v29/gabriel/attack.png",
  "battle_gabriel_cast": "/assets/v29/gabriel/cast.png",
  "battle_gabriel_ultimate": "/assets/v29/gabriel/ultimate.png",
  "battle_fx_gabriel": "/assets/v29/gabriel/vfx.png",
  "skill_icon_gabriel_0": "/assets/v29/gabriel/icons/0.png",
  "skill_icon_gabriel_1": "/assets/v29/gabriel/icons/1.png",
  "skill_icon_gabriel_2": "/assets/v29/gabriel/icons/2.png",
  "skill_icon_gabriel_3": "/assets/v29/gabriel/icons/3.png",
  "skill_icon_gabriel_4": "/assets/v29/gabriel/icons/4.png",
  "skill_icon_gabriel_5": "/assets/v29/gabriel/icons/5.png",
  "skill_icons_gabriel": "/assets/v29/gabriel/icons.png",
  "dlg_gabriel_lycan": "/assets/v29/gabriel_lycan/portrait.png",
  "face_gabriel_lycan": "/assets/v29/gabriel_lycan/face.png",
  "gabriel_lycan": "/assets/v29/gabriel_lycan/walk.png",
  "battle_gabriel_lycan_attack": "/assets/v29/gabriel_lycan/attack.png",
  "battle_gabriel_lycan_cast": "/assets/v29/gabriel_lycan/cast.png",
  "battle_gabriel_lycan_ultimate": "/assets/v29/gabriel_lycan/ultimate.png",
  "dlg_marin": "/assets/v29/marin/portrait.png",
  "face_marin": "/assets/v29/marin/face.png",
  "marin": "/assets/v29/marin/walk.png",
  "battle_marin_attack": "/assets/v29/marin/attack.png",
  "battle_marin_cast": "/assets/v29/marin/cast.png",
  "battle_marin_ultimate": "/assets/v29/marin/ultimate.png",
  "battle_fx_marin": "/assets/v29/marin/vfx.png",
  "skill_icon_marin_0": "/assets/v29/marin/icons/0.png",
  "skill_icon_marin_1": "/assets/v29/marin/icons/1.png",
  "skill_icon_marin_2": "/assets/v29/marin/icons/2.png",
  "skill_icon_marin_3": "/assets/v29/marin/icons/3.png",
  "skill_icon_marin_4": "/assets/v29/marin/icons/4.png",
  "skill_icon_marin_5": "/assets/v29/marin/icons/5.png",
  "skill_icons_marin": "/assets/v29/marin/icons.png",
  "dlg_max": "/assets/v29/max/portrait.png",
  "face_max": "/assets/v29/max/face.png",
  "max": "/assets/v29/max/walk.png",
  "battle_max_attack": "/assets/v29/max/attack.png",
  "battle_max_cast": "/assets/v29/max/cast.png",
  "battle_max_ultimate": "/assets/v29/max/ultimate.png",
  "battle_fx_max": "/assets/v29/max/vfx.png",
  "skill_icon_max_0": "/assets/v29/max/icons/0.png",
  "skill_icon_max_1": "/assets/v29/max/icons/1.png",
  "skill_icon_max_2": "/assets/v29/max/icons/2.png",
  "skill_icon_max_3": "/assets/v29/max/icons/3.png",
  "skill_icon_max_4": "/assets/v29/max/icons/4.png",
  "skill_icon_max_5": "/assets/v29/max/icons/5.png",
  "skill_icons_max": "/assets/v29/max/icons.png",
  "battle_fx_gabriel_lycan": "/assets/v29/gabriel/vfx.png",
  "skill_icons_gabriel_lycan": "/assets/v29/gabriel/icons.png",
  "skill_icon_gabriel_lycan_0": "/assets/v29/gabriel/icons/0.png",
  "skill_icon_gabriel_lycan_1": "/assets/v29/gabriel/icons/1.png",
  "skill_icon_gabriel_lycan_2": "/assets/v29/gabriel/icons/2.png",
  "skill_icon_gabriel_lycan_3": "/assets/v29/gabriel/icons/3.png",
  "skill_icon_gabriel_lycan_4": "/assets/v29/gabriel/icons/4.png",
  "skill_icon_gabriel_lycan_5": "/assets/v29/gabriel/icons/5.png"
};

export const REMAKE_FRAMES_GABRIEL_MARIN_MAX: Record<string,SpriteCrop[]> = {
  "gabriel": [
    {
      "x": 121,
      "y": 5,
      "w": 229,
      "h": 357,
      "anchorX": 230.0,
      "anchorY": 359
    },
    {
      "x": 434,
      "y": 6,
      "w": 223,
      "h": 356,
      "anchorX": 540.5,
      "anchorY": 359
    },
    {
      "x": 743,
      "y": 5,
      "w": 226,
      "h": 357,
      "anchorX": 854.0,
      "anchorY": 359
    },
    {
      "x": 93,
      "y": 364,
      "w": 260,
      "h": 346,
      "anchorX": 203.0,
      "anchorY": 707
    },
    {
      "x": 433,
      "y": 363,
      "w": 249,
      "h": 347,
      "anchorX": 515.0,
      "anchorY": 707
    },
    {
      "x": 729,
      "y": 364,
      "w": 274,
      "h": 346,
      "anchorX": 843.0,
      "anchorY": 707
    },
    {
      "x": 76,
      "y": 711,
      "w": 274,
      "h": 341,
      "anchorX": 213.0,
      "anchorY": 1049
    },
    {
      "x": 407,
      "y": 711,
      "w": 250,
      "h": 339,
      "anchorX": 547.0,
      "anchorY": 1047
    },
    {
      "x": 727,
      "y": 710,
      "w": 273,
      "h": 340,
      "anchorX": 863.5,
      "anchorY": 1047
    },
    {
      "x": 95,
      "y": 1053,
      "w": 248,
      "h": 368,
      "anchorX": 215.5,
      "anchorY": 1418
    },
    {
      "x": 428,
      "y": 1053,
      "w": 222,
      "h": 364,
      "anchorX": 545.0,
      "anchorY": 1414
    },
    {
      "x": 741,
      "y": 1053,
      "w": 253,
      "h": 368,
      "anchorX": 867.5,
      "anchorY": 1418
    }
  ],
  "battle_gabriel_attack": [
    {
      "x": 35,
      "y": 14,
      "w": 435,
      "h": 481,
      "anchorX": 280,
      "anchorY": 492
    },
    {
      "x": 530,
      "y": 24,
      "w": 479,
      "h": 471,
      "anchorX": 805,
      "anchorY": 492
    },
    {
      "x": 1031,
      "y": 27,
      "w": 486,
      "h": 468,
      "anchorX": 1285,
      "anchorY": 492
    },
    {
      "x": 41,
      "y": 529,
      "w": 524,
      "h": 455,
      "anchorX": 285,
      "anchorY": 981
    },
    {
      "x": 572,
      "y": 518,
      "w": 429,
      "h": 468,
      "anchorX": 790,
      "anchorY": 983
    },
    {
      "x": 1053,
      "y": 518,
      "w": 412,
      "h": 468,
      "anchorX": 1280,
      "anchorY": 983
    }
  ],
  "battle_gabriel_cast": [
    {
      "x": 46,
      "y": 12,
      "w": 421,
      "h": 493,
      "anchorX": 270,
      "anchorY": 502
    },
    {
      "x": 541,
      "y": 12,
      "w": 462,
      "h": 494,
      "anchorX": 775,
      "anchorY": 503
    },
    {
      "x": 1071,
      "y": 12,
      "w": 405,
      "h": 493,
      "anchorX": 1290,
      "anchorY": 502
    },
    {
      "x": 30,
      "y": 521,
      "w": 437,
      "h": 484,
      "anchorX": 260,
      "anchorY": 1002
    },
    {
      "x": 513,
      "y": 522,
      "w": 518,
      "h": 481,
      "anchorX": 740,
      "anchorY": 1000
    },
    {
      "x": 1085,
      "y": 521,
      "w": 370,
      "h": 484,
      "anchorX": 1285,
      "anchorY": 1002
    }
  ],
  "battle_gabriel_ultimate": [
    {
      "x": 39,
      "y": 12,
      "w": 297,
      "h": 485,
      "anchorX": 200,
      "anchorY": 494
    },
    {
      "x": 400,
      "y": 12,
      "w": 310,
      "h": 485,
      "anchorX": 580,
      "anchorY": 494
    },
    {
      "x": 797,
      "y": 62,
      "w": 351,
      "h": 435,
      "anchorX": 990,
      "anchorY": 494
    },
    {
      "x": 1209,
      "y": 9,
      "w": 291,
      "h": 486,
      "anchorX": 1380,
      "anchorY": 492
    },
    {
      "x": 19,
      "y": 514,
      "w": 313,
      "h": 481,
      "anchorX": 185,
      "anchorY": 992
    },
    {
      "x": 360,
      "y": 546,
      "w": 424,
      "h": 447,
      "anchorX": 555,
      "anchorY": 990
    },
    {
      "x": 799,
      "y": 533,
      "w": 317,
      "h": 460,
      "anchorX": 980,
      "anchorY": 990
    },
    {
      "x": 1185,
      "y": 521,
      "w": 315,
      "h": 474,
      "anchorX": 1340,
      "anchorY": 992
    }
  ],
  "battle_fx_gabriel": [
    {
      "x": 47,
      "y": 44,
      "w": 434,
      "h": 437,
      "anchorX": 264.0,
      "anchorY": 262.5
    },
    {
      "x": 550,
      "y": 57,
      "w": 449,
      "h": 412,
      "anchorX": 774.5,
      "anchorY": 263.0
    },
    {
      "x": 1034,
      "y": 24,
      "w": 470,
      "h": 464,
      "anchorX": 1269.0,
      "anchorY": 256.0
    },
    {
      "x": 33,
      "y": 519,
      "w": 448,
      "h": 474,
      "anchorX": 257.0,
      "anchorY": 756.0
    },
    {
      "x": 546,
      "y": 520,
      "w": 438,
      "h": 458,
      "anchorX": 765.0,
      "anchorY": 749.0
    },
    {
      "x": 1039,
      "y": 530,
      "w": 469,
      "h": 450,
      "anchorX": 1273.5,
      "anchorY": 755.0
    }
  ],
  "skill_icons_gabriel": [
    {
      "x": 15,
      "y": 11,
      "w": 487,
      "h": 473,
      "anchorX": 258.5,
      "anchorY": 247.5
    },
    {
      "x": 523,
      "y": 11,
      "w": 490,
      "h": 474,
      "anchorX": 768.0,
      "anchorY": 248.0
    },
    {
      "x": 1033,
      "y": 11,
      "w": 488,
      "h": 474,
      "anchorX": 1277.0,
      "anchorY": 248.0
    },
    {
      "x": 14,
      "y": 496,
      "w": 487,
      "h": 476,
      "anchorX": 257.5,
      "anchorY": 734.0
    },
    {
      "x": 523,
      "y": 496,
      "w": 490,
      "h": 477,
      "anchorX": 768.0,
      "anchorY": 734.5
    },
    {
      "x": 1033,
      "y": 497,
      "w": 488,
      "h": 475,
      "anchorX": 1277.0,
      "anchorY": 734.5
    }
  ],
  "gabriel_lycan": [
    {
      "x": 139,
      "y": 63,
      "w": 185,
      "h": 290,
      "anchorX": 221.5,
      "anchorY": 350
    },
    {
      "x": 461,
      "y": 63,
      "w": 177,
      "h": 292,
      "anchorX": 544.5,
      "anchorY": 352
    },
    {
      "x": 793,
      "y": 63,
      "w": 195,
      "h": 292,
      "anchorX": 880.5,
      "anchorY": 352
    },
    {
      "x": 101,
      "y": 405,
      "w": 244,
      "h": 269,
      "anchorX": 203.5,
      "anchorY": 671
    },
    {
      "x": 442,
      "y": 404,
      "w": 237,
      "h": 267,
      "anchorX": 534.0,
      "anchorY": 668
    },
    {
      "x": 767,
      "y": 407,
      "w": 256,
      "h": 265,
      "anchorX": 869.5,
      "anchorY": 669
    },
    {
      "x": 83,
      "y": 731,
      "w": 234,
      "h": 272,
      "anchorX": 219.0,
      "anchorY": 1000
    },
    {
      "x": 432,
      "y": 732,
      "w": 232,
      "h": 271,
      "anchorX": 565.0,
      "anchorY": 1000
    },
    {
      "x": 776,
      "y": 732,
      "w": 240,
      "h": 272,
      "anchorX": 904.5,
      "anchorY": 1001
    },
    {
      "x": 106,
      "y": 1072,
      "w": 216,
      "h": 289,
      "anchorX": 212.0,
      "anchorY": 1358
    },
    {
      "x": 453,
      "y": 1072,
      "w": 199,
      "h": 291,
      "anchorX": 547.5,
      "anchorY": 1360
    },
    {
      "x": 790,
      "y": 1072,
      "w": 214,
      "h": 300,
      "anchorX": 891.0,
      "anchorY": 1369
    }
  ],
  "battle_gabriel_lycan_attack": [
    {
      "x": 19,
      "y": 10,
      "w": 441,
      "h": 484,
      "anchorX": 255,
      "anchorY": 491
    },
    {
      "x": 531,
      "y": 37,
      "w": 448,
      "h": 458,
      "anchorX": 810,
      "anchorY": 492
    },
    {
      "x": 1018,
      "y": 29,
      "w": 507,
      "h": 467,
      "anchorX": 1285,
      "anchorY": 493
    },
    {
      "x": 39,
      "y": 514,
      "w": 521,
      "h": 474,
      "anchorX": 285,
      "anchorY": 985
    },
    {
      "x": 565,
      "y": 514,
      "w": 430,
      "h": 475,
      "anchorX": 790,
      "anchorY": 986
    },
    {
      "x": 1041,
      "y": 514,
      "w": 437,
      "h": 476,
      "anchorX": 1285,
      "anchorY": 987
    }
  ],
  "battle_gabriel_lycan_cast": [
    {
      "x": 47,
      "y": 17,
      "w": 405,
      "h": 483,
      "anchorX": 265,
      "anchorY": 497
    },
    {
      "x": 559,
      "y": 13,
      "w": 436,
      "h": 486,
      "anchorX": 790,
      "anchorY": 496
    },
    {
      "x": 1100,
      "y": 6,
      "w": 405,
      "h": 493,
      "anchorX": 1320,
      "anchorY": 496
    },
    {
      "x": 37,
      "y": 527,
      "w": 463,
      "h": 476,
      "anchorX": 230,
      "anchorY": 1000
    },
    {
      "x": 530,
      "y": 527,
      "w": 594,
      "h": 476,
      "anchorX": 770,
      "anchorY": 1000
    },
    {
      "x": 1135,
      "y": 527,
      "w": 374,
      "h": 477,
      "anchorX": 1320,
      "anchorY": 1001
    }
  ],
  "battle_gabriel_lycan_ultimate": [
    {
      "x": 56,
      "y": 14,
      "w": 302,
      "h": 485,
      "anchorX": 225,
      "anchorY": 496
    },
    {
      "x": 419,
      "y": 20,
      "w": 322,
      "h": 479,
      "anchorX": 610,
      "anchorY": 496
    },
    {
      "x": 788,
      "y": 70,
      "w": 322,
      "h": 425,
      "anchorX": 965,
      "anchorY": 492
    },
    {
      "x": 1165,
      "y": 8,
      "w": 328,
      "h": 490,
      "anchorX": 1355,
      "anchorY": 495
    },
    {
      "x": 41,
      "y": 509,
      "w": 308,
      "h": 489,
      "anchorX": 185,
      "anchorY": 995
    },
    {
      "x": 398,
      "y": 569,
      "w": 401,
      "h": 428,
      "anchorX": 555,
      "anchorY": 994
    },
    {
      "x": 802,
      "y": 548,
      "w": 315,
      "h": 450,
      "anchorX": 965,
      "anchorY": 995
    },
    {
      "x": 1181,
      "y": 520,
      "w": 302,
      "h": 478,
      "anchorX": 1340,
      "anchorY": 995
    }
  ],
  "marin": [
    {
      "x": 96,
      "y": 7,
      "w": 236,
      "h": 354,
      "anchorX": 207.0,
      "anchorY": 358
    },
    {
      "x": 433,
      "y": 8,
      "w": 224,
      "h": 352,
      "anchorX": 545.5,
      "anchorY": 357
    },
    {
      "x": 756,
      "y": 8,
      "w": 227,
      "h": 353,
      "anchorX": 864.5,
      "anchorY": 358
    },
    {
      "x": 68,
      "y": 365,
      "w": 296,
      "h": 339,
      "anchorX": 207.5,
      "anchorY": 701
    },
    {
      "x": 442,
      "y": 363,
      "w": 238,
      "h": 340,
      "anchorX": 539.0,
      "anchorY": 700
    },
    {
      "x": 730,
      "y": 365,
      "w": 290,
      "h": 341,
      "anchorX": 873.0,
      "anchorY": 703
    },
    {
      "x": 60,
      "y": 717,
      "w": 282,
      "h": 335,
      "anchorX": 212.5,
      "anchorY": 1049
    },
    {
      "x": 409,
      "y": 717,
      "w": 243,
      "h": 337,
      "anchorX": 546.0,
      "anchorY": 1051
    },
    {
      "x": 725,
      "y": 717,
      "w": 293,
      "h": 337,
      "anchorX": 880.5,
      "anchorY": 1051
    },
    {
      "x": 82,
      "y": 1060,
      "w": 259,
      "h": 359,
      "anchorX": 206.0,
      "anchorY": 1416
    },
    {
      "x": 415,
      "y": 1060,
      "w": 254,
      "h": 360,
      "anchorX": 547.0,
      "anchorY": 1417
    },
    {
      "x": 762,
      "y": 1061,
      "w": 253,
      "h": 357,
      "anchorX": 883.0,
      "anchorY": 1415
    }
  ],
  "battle_marin_attack": [
    {
      "x": 22,
      "y": 10,
      "w": 400,
      "h": 494,
      "anchorX": 245,
      "anchorY": 501
    },
    {
      "x": 503,
      "y": 55,
      "w": 459,
      "h": 447,
      "anchorX": 780,
      "anchorY": 499
    },
    {
      "x": 967,
      "y": 105,
      "w": 569,
      "h": 397,
      "anchorX": 1265,
      "anchorY": 499
    },
    {
      "x": 12,
      "y": 545,
      "w": 557,
      "h": 441,
      "anchorX": 290,
      "anchorY": 983
    },
    {
      "x": 569,
      "y": 551,
      "w": 457,
      "h": 436,
      "anchorX": 815,
      "anchorY": 984
    },
    {
      "x": 1034,
      "y": 519,
      "w": 428,
      "h": 486,
      "anchorX": 1275,
      "anchorY": 1002
    }
  ],
  "battle_marin_cast": [
    {
      "x": 79,
      "y": 107,
      "w": 322,
      "h": 362,
      "anchorX": 260,
      "anchorY": 466
    },
    {
      "x": 594,
      "y": 97,
      "w": 335,
      "h": 372,
      "anchorX": 775,
      "anchorY": 466
    },
    {
      "x": 1122,
      "y": 77,
      "w": 354,
      "h": 392,
      "anchorX": 1305,
      "anchorY": 466
    },
    {
      "x": 63,
      "y": 631,
      "w": 463,
      "h": 299,
      "anchorX": 295,
      "anchorY": 927
    },
    {
      "x": 638,
      "y": 574,
      "w": 319,
      "h": 376,
      "anchorX": 815,
      "anchorY": 947
    },
    {
      "x": 1137,
      "y": 569,
      "w": 334,
      "h": 374,
      "anchorX": 1305,
      "anchorY": 940
    }
  ],
  "battle_marin_ultimate": [
    {
      "x": 27,
      "y": 29,
      "w": 344,
      "h": 473,
      "anchorX": 210,
      "anchorY": 499
    },
    {
      "x": 424,
      "y": 37,
      "w": 324,
      "h": 465,
      "anchorX": 610,
      "anchorY": 499
    },
    {
      "x": 787,
      "y": 38,
      "w": 341,
      "h": 464,
      "anchorX": 990,
      "anchorY": 499
    },
    {
      "x": 1172,
      "y": 12,
      "w": 341,
      "h": 490,
      "anchorX": 1360,
      "anchorY": 499
    },
    {
      "x": 20,
      "y": 528,
      "w": 352,
      "h": 459,
      "anchorX": 235,
      "anchorY": 984
    },
    {
      "x": 402,
      "y": 561,
      "w": 414,
      "h": 420,
      "anchorX": 615,
      "anchorY": 978
    },
    {
      "x": 816,
      "y": 535,
      "w": 327,
      "h": 457,
      "anchorX": 985,
      "anchorY": 989
    },
    {
      "x": 1174,
      "y": 530,
      "w": 342,
      "h": 465,
      "anchorX": 1360,
      "anchorY": 992
    }
  ],
  "battle_fx_marin": [
    {
      "x": 33,
      "y": 18,
      "w": 466,
      "h": 483,
      "anchorX": 266.0,
      "anchorY": 259.5
    },
    {
      "x": 534,
      "y": 21,
      "w": 473,
      "h": 464,
      "anchorX": 770.5,
      "anchorY": 253.0
    },
    {
      "x": 1039,
      "y": 22,
      "w": 474,
      "h": 470,
      "anchorX": 1276.0,
      "anchorY": 257.0
    },
    {
      "x": 31,
      "y": 539,
      "w": 448,
      "h": 435,
      "anchorX": 255.0,
      "anchorY": 756.5
    },
    {
      "x": 530,
      "y": 520,
      "w": 476,
      "h": 475,
      "anchorX": 768.0,
      "anchorY": 757.5
    },
    {
      "x": 1054,
      "y": 523,
      "w": 445,
      "h": 467,
      "anchorX": 1276.5,
      "anchorY": 756.5
    }
  ],
  "skill_icons_marin": [
    {
      "x": 38,
      "y": 11,
      "w": 462,
      "h": 464,
      "anchorX": 269.0,
      "anchorY": 243.0
    },
    {
      "x": 536,
      "y": 10,
      "w": 463,
      "h": 465,
      "anchorX": 767.5,
      "anchorY": 242.5
    },
    {
      "x": 1034,
      "y": 11,
      "w": 463,
      "h": 465,
      "anchorX": 1265.5,
      "anchorY": 243.5
    },
    {
      "x": 38,
      "y": 504,
      "w": 462,
      "h": 465,
      "anchorX": 269.0,
      "anchorY": 736.5
    },
    {
      "x": 536,
      "y": 504,
      "w": 463,
      "h": 465,
      "anchorX": 767.5,
      "anchorY": 736.5
    },
    {
      "x": 1034,
      "y": 504,
      "w": 463,
      "h": 465,
      "anchorX": 1265.5,
      "anchorY": 736.5
    }
  ],
  "max": [
    {
      "x": 58,
      "y": 2,
      "w": 256,
      "h": 357,
      "anchorX": 181.0,
      "anchorY": 356
    },
    {
      "x": 415,
      "y": 1,
      "w": 262,
      "h": 358,
      "anchorX": 539.5,
      "anchorY": 356
    },
    {
      "x": 774,
      "y": 1,
      "w": 255,
      "h": 359,
      "anchorX": 901.5,
      "anchorY": 357
    },
    {
      "x": 41,
      "y": 361,
      "w": 295,
      "h": 338,
      "anchorX": 187.5,
      "anchorY": 696
    },
    {
      "x": 429,
      "y": 361,
      "w": 251,
      "h": 341,
      "anchorX": 546.0,
      "anchorY": 699
    },
    {
      "x": 748,
      "y": 361,
      "w": 296,
      "h": 337,
      "anchorX": 885.0,
      "anchorY": 695
    },
    {
      "x": 30,
      "y": 708,
      "w": 282,
      "h": 343,
      "anchorX": 162.5,
      "anchorY": 1048
    },
    {
      "x": 394,
      "y": 709,
      "w": 257,
      "h": 345,
      "anchorX": 520.0,
      "anchorY": 1051
    },
    {
      "x": 741,
      "y": 707,
      "w": 319,
      "h": 344,
      "anchorX": 904.5,
      "anchorY": 1048
    },
    {
      "x": 46,
      "y": 1055,
      "w": 263,
      "h": 365,
      "anchorX": 179.0,
      "anchorY": 1417
    },
    {
      "x": 420,
      "y": 1055,
      "w": 247,
      "h": 365,
      "anchorX": 540.0,
      "anchorY": 1417
    },
    {
      "x": 769,
      "y": 1054,
      "w": 277,
      "h": 367,
      "anchorX": 898.5,
      "anchorY": 1418
    }
  ],
  "battle_max_attack": [
    {
      "x": 41,
      "y": 19,
      "w": 366,
      "h": 484,
      "anchorX": 235,
      "anchorY": 500
    },
    {
      "x": 551,
      "y": 17,
      "w": 427,
      "h": 486,
      "anchorX": 790,
      "anchorY": 500
    },
    {
      "x": 1014,
      "y": 72,
      "w": 498,
      "h": 408,
      "anchorX": 1240,
      "anchorY": 477
    },
    {
      "x": 46,
      "y": 572,
      "w": 516,
      "h": 413,
      "anchorX": 285,
      "anchorY": 982
    },
    {
      "x": 570,
      "y": 571,
      "w": 440,
      "h": 413,
      "anchorX": 775,
      "anchorY": 981
    },
    {
      "x": 1066,
      "y": 529,
      "w": 389,
      "h": 473,
      "anchorX": 1260,
      "anchorY": 999
    }
  ],
  "battle_max_cast": [
    {
      "x": 74,
      "y": 39,
      "w": 321,
      "h": 438,
      "anchorX": 248,
      "anchorY": 474
    },
    {
      "x": 586,
      "y": 51,
      "w": 327,
      "h": 424,
      "anchorX": 780,
      "anchorY": 472
    },
    {
      "x": 1101,
      "y": 69,
      "w": 389,
      "h": 405,
      "anchorX": 1260,
      "anchorY": 471
    },
    {
      "x": 47,
      "y": 566,
      "w": 479,
      "h": 400,
      "anchorX": 270,
      "anchorY": 963
    },
    {
      "x": 596,
      "y": 567,
      "w": 366,
      "h": 397,
      "anchorX": 745,
      "anchorY": 961
    },
    {
      "x": 1123,
      "y": 550,
      "w": 301,
      "h": 416,
      "anchorX": 1270,
      "anchorY": 963
    }
  ],
  "battle_max_ultimate": [
    {
      "x": 50,
      "y": 49,
      "w": 277,
      "h": 411,
      "anchorX": 190,
      "anchorY": 457
    },
    {
      "x": 431,
      "y": 49,
      "w": 281,
      "h": 412,
      "anchorX": 560,
      "anchorY": 458
    },
    {
      "x": 823,
      "y": 38,
      "w": 279,
      "h": 423,
      "anchorX": 965,
      "anchorY": 458
    },
    {
      "x": 1206,
      "y": 49,
      "w": 299,
      "h": 411,
      "anchorX": 1340,
      "anchorY": 457
    },
    {
      "x": 45,
      "y": 554,
      "w": 308,
      "h": 405,
      "anchorX": 190,
      "anchorY": 956
    },
    {
      "x": 428,
      "y": 559,
      "w": 372,
      "h": 395,
      "anchorX": 570,
      "anchorY": 951
    },
    {
      "x": 833,
      "y": 558,
      "w": 283,
      "h": 399,
      "anchorX": 980,
      "anchorY": 954
    },
    {
      "x": 1212,
      "y": 559,
      "w": 282,
      "h": 398,
      "anchorX": 1350,
      "anchorY": 954
    }
  ],
  "battle_fx_max": [
    {
      "x": 52,
      "y": 64,
      "w": 409,
      "h": 405,
      "anchorX": 256.5,
      "anchorY": 266.5
    },
    {
      "x": 530,
      "y": 124,
      "w": 474,
      "h": 297,
      "anchorX": 767.0,
      "anchorY": 272.5
    },
    {
      "x": 1082,
      "y": 50,
      "w": 426,
      "h": 421,
      "anchorX": 1295.0,
      "anchorY": 260.5
    },
    {
      "x": 52,
      "y": 559,
      "w": 414,
      "h": 375,
      "anchorX": 259.0,
      "anchorY": 746.5
    },
    {
      "x": 554,
      "y": 543,
      "w": 426,
      "h": 428,
      "anchorX": 767.0,
      "anchorY": 757.0
    },
    {
      "x": 1056,
      "y": 552,
      "w": 455,
      "h": 400,
      "anchorX": 1283.5,
      "anchorY": 752.0
    }
  ],
  "skill_icons_max": [
    {
      "x": 46,
      "y": 16,
      "w": 473,
      "h": 472,
      "anchorX": 282.5,
      "anchorY": 252.0
    },
    {
      "x": 531,
      "y": 16,
      "w": 473,
      "h": 472,
      "anchorX": 767.5,
      "anchorY": 252.0
    },
    {
      "x": 1015,
      "y": 16,
      "w": 474,
      "h": 472,
      "anchorX": 1252.0,
      "anchorY": 252.0
    },
    {
      "x": 46,
      "y": 507,
      "w": 473,
      "h": 471,
      "anchorX": 282.5,
      "anchorY": 742.5
    },
    {
      "x": 530,
      "y": 507,
      "w": 474,
      "h": 471,
      "anchorX": 767.0,
      "anchorY": 742.5
    },
    {
      "x": 1015,
      "y": 507,
      "w": 473,
      "h": 471,
      "anchorX": 1251.5,
      "anchorY": 742.5
    }
  ],
  "battle_fx_gabriel_lycan": [
    {
      "x": 47,
      "y": 44,
      "w": 434,
      "h": 437,
      "anchorX": 264.0,
      "anchorY": 262.5
    },
    {
      "x": 550,
      "y": 57,
      "w": 449,
      "h": 412,
      "anchorX": 774.5,
      "anchorY": 263.0
    },
    {
      "x": 1034,
      "y": 24,
      "w": 470,
      "h": 464,
      "anchorX": 1269.0,
      "anchorY": 256.0
    },
    {
      "x": 33,
      "y": 519,
      "w": 448,
      "h": 474,
      "anchorX": 257.0,
      "anchorY": 756.0
    },
    {
      "x": 546,
      "y": 520,
      "w": 438,
      "h": 458,
      "anchorX": 765.0,
      "anchorY": 749.0
    },
    {
      "x": 1039,
      "y": 530,
      "w": 469,
      "h": 450,
      "anchorX": 1273.5,
      "anchorY": 755.0
    }
  ],
  "skill_icons_gabriel_lycan": [
    {
      "x": 15,
      "y": 11,
      "w": 487,
      "h": 473,
      "anchorX": 258.5,
      "anchorY": 247.5
    },
    {
      "x": 523,
      "y": 11,
      "w": 490,
      "h": 474,
      "anchorX": 768.0,
      "anchorY": 248.0
    },
    {
      "x": 1033,
      "y": 11,
      "w": 488,
      "h": 474,
      "anchorX": 1277.0,
      "anchorY": 248.0
    },
    {
      "x": 14,
      "y": 496,
      "w": 487,
      "h": 476,
      "anchorX": 257.5,
      "anchorY": 734.0
    },
    {
      "x": 523,
      "y": 496,
      "w": 490,
      "h": 477,
      "anchorX": 768.0,
      "anchorY": 734.5
    },
    {
      "x": 1033,
      "y": 497,
      "w": 488,
      "h": 475,
      "anchorX": 1277.0,
      "anchorY": 734.5
    }
  ]
};
