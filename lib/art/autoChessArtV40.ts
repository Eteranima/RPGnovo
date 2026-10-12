import type {AutoChessItemArtV39,AutoChessPieceArtV39} from './autoChessArtV39';

export type AutoChessPieceArtV40=AutoChessPieceArtV39&{facing?:'left'|'right'};
// Eight canonical characters and creatures; measured native RGBA source cells.
export const AUTO_CHESS_PIECE_ART_V40:Record<string,AutoChessPieceArtV40>={
  "runewarden": {
    "src": "/assets/v40/autochess/pieces/runewarden.png",
    "sheetWidth": 1446,
    "sheetHeight": 1087,
    "bodyHeight": 267,
    "facing": "left",
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 191,
        "anchorY": 355
      },
      {
        "x": 362,
        "y": 0,
        "w": 361,
        "h": 362,
        "anchorX": 546,
        "anchorY": 355
      },
      {
        "x": 723,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 906,
        "anchorY": 355
      },
      {
        "x": 1085,
        "y": 0,
        "w": 361,
        "h": 362,
        "anchorX": 1263.5,
        "anchorY": 357
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 362,
        "w": 360,
        "h": 363,
        "anchorX": 170,
        "anchorY": 691
      },
      {
        "x": 360,
        "y": 362,
        "w": 363,
        "h": 363,
        "anchorX": 561.5,
        "anchorY": 688
      },
      {
        "x": 723,
        "y": 362,
        "w": 362,
        "h": 363,
        "anchorX": 944,
        "anchorY": 689
      },
      {
        "x": 1085,
        "y": 362,
        "w": 361,
        "h": 363,
        "anchorX": 1283,
        "anchorY": 692
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 725,
        "w": 362,
        "h": 362,
        "anchorX": 190.5,
        "anchorY": 1021
      },
      {
        "x": 362,
        "y": 725,
        "w": 361,
        "h": 362,
        "anchorX": 549,
        "anchorY": 1021
      },
      {
        "x": 723,
        "y": 725,
        "w": 362,
        "h": 362,
        "anchorX": 943,
        "anchorY": 1021
      },
      {
        "x": 1085,
        "y": 725,
        "w": 361,
        "h": 362,
        "anchorX": 1279,
        "anchorY": 1022
      }
    ]
  },
  "moth": {
    "src": "/assets/v40/autochess/pieces/moth.png",
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "bodyHeight": 243.5,
    "facing": "right",
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 381,
        "anchorX": 161.5,
        "anchorY": 375
      },
      {
        "x": 362,
        "y": 0,
        "w": 362,
        "h": 381,
        "anchorX": 502.5,
        "anchorY": 370
      },
      {
        "x": 724,
        "y": 0,
        "w": 362,
        "h": 381,
        "anchorX": 886,
        "anchorY": 378
      },
      {
        "x": 1086,
        "y": 0,
        "w": 362,
        "h": 381,
        "anchorX": 1243,
        "anchorY": 368
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 381,
        "w": 362,
        "h": 343,
        "anchorX": 174.5,
        "anchorY": 685
      },
      {
        "x": 362,
        "y": 381,
        "w": 365,
        "h": 343,
        "anchorX": 472.5,
        "anchorY": 681
      },
      {
        "x": 727,
        "y": 381,
        "w": 411,
        "h": 343,
        "anchorX": 858,
        "anchorY": 686
      },
      {
        "x": 1138,
        "y": 381,
        "w": 310,
        "h": 343,
        "anchorX": 1230,
        "anchorY": 686
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 173.5,
        "anchorY": 1014
      },
      {
        "x": 362,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 487.5,
        "anchorY": 998
      },
      {
        "x": 724,
        "y": 724,
        "w": 392,
        "h": 362,
        "anchorX": 829,
        "anchorY": 992
      },
      {
        "x": 1116,
        "y": 724,
        "w": 332,
        "h": 362,
        "anchorX": 1260.5,
        "anchorY": 999
      }
    ]
  },
  "ashwolf": {
    "src": "/assets/v40/autochess/pieces/ashwolf.png",
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "bodyHeight": 243.5,
    "facing": "left",
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 175,
        "anchorY": 345
      },
      {
        "x": 362,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 532,
        "anchorY": 346
      },
      {
        "x": 724,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 891.5,
        "anchorY": 346
      },
      {
        "x": 1086,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 1274.5,
        "anchorY": 342
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 166,
        "anchorY": 696
      },
      {
        "x": 362,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 542.5,
        "anchorY": 685
      },
      {
        "x": 724,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 903.5,
        "anchorY": 684
      },
      {
        "x": 1086,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 1252.5,
        "anchorY": 696
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 724,
        "w": 352,
        "h": 362,
        "anchorX": 165.5,
        "anchorY": 1023
      },
      {
        "x": 352,
        "y": 724,
        "w": 372,
        "h": 362,
        "anchorX": 533,
        "anchorY": 1004
      },
      {
        "x": 724,
        "y": 724,
        "w": 364,
        "h": 362,
        "anchorX": 917,
        "anchorY": 1006
      },
      {
        "x": 1088,
        "y": 724,
        "w": 360,
        "h": 362,
        "anchorX": 1257,
        "anchorY": 1027
      }
    ]
  },
  "lunastag": {
    "src": "/assets/v40/autochess/pieces/lunastag.png",
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "bodyHeight": 338,
    "facing": "left",
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 377,
        "anchorX": 206.5,
        "anchorY": 372
      },
      {
        "x": 362,
        "y": 0,
        "w": 362,
        "h": 377,
        "anchorX": 571.5,
        "anchorY": 372
      },
      {
        "x": 724,
        "y": 0,
        "w": 362,
        "h": 377,
        "anchorX": 924,
        "anchorY": 373
      },
      {
        "x": 1086,
        "y": 0,
        "w": 362,
        "h": 377,
        "anchorX": 1298,
        "anchorY": 373
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 377,
        "w": 362,
        "h": 347,
        "anchorX": 203,
        "anchorY": 712
      },
      {
        "x": 362,
        "y": 377,
        "w": 362,
        "h": 347,
        "anchorX": 577.5,
        "anchorY": 701
      },
      {
        "x": 724,
        "y": 377,
        "w": 362,
        "h": 347,
        "anchorX": 925.5,
        "anchorY": 710
      },
      {
        "x": 1086,
        "y": 377,
        "w": 362,
        "h": 347,
        "anchorX": 1289.5,
        "anchorY": 719
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 222,
        "anchorY": 1057
      },
      {
        "x": 362,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 567,
        "anchorY": 1001
      },
      {
        "x": 724,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 925.5,
        "anchorY": 1040
      },
      {
        "x": 1086,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 1300.5,
        "anchorY": 1058
      }
    ]
  },
  "selo": {
    "src": "/assets/v40/autochess/pieces/selo.png",
    "sheetWidth": 1225,
    "sheetHeight": 1284,
    "bodyHeight": 245,
    "facing": "left",
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 306,
        "h": 428,
        "anchorX": 206.5,
        "anchorY": 388
      },
      {
        "x": 306,
        "y": 0,
        "w": 307,
        "h": 428,
        "anchorX": 494,
        "anchorY": 390
      },
      {
        "x": 613,
        "y": 0,
        "w": 306,
        "h": 428,
        "anchorX": 803,
        "anchorY": 390
      },
      {
        "x": 919,
        "y": 0,
        "w": 306,
        "h": 428,
        "anchorX": 1116.5,
        "anchorY": 388
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 428,
        "w": 306,
        "h": 428,
        "anchorX": 180,
        "anchorY": 786
      },
      {
        "x": 306,
        "y": 428,
        "w": 307,
        "h": 428,
        "anchorX": 509,
        "anchorY": 782
      },
      {
        "x": 613,
        "y": 428,
        "w": 306,
        "h": 428,
        "anchorX": 837,
        "anchorY": 785
      },
      {
        "x": 919,
        "y": 428,
        "w": 306,
        "h": 428,
        "anchorX": 1106,
        "anchorY": 786
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 856,
        "w": 306,
        "h": 428,
        "anchorX": 195,
        "anchorY": 1175
      },
      {
        "x": 306,
        "y": 856,
        "w": 307,
        "h": 428,
        "anchorX": 481,
        "anchorY": 1172
      },
      {
        "x": 613,
        "y": 856,
        "w": 306,
        "h": 428,
        "anchorX": 816,
        "anchorY": 1172
      },
      {
        "x": 919,
        "y": 856,
        "w": 306,
        "h": 428,
        "anchorX": 1120,
        "anchorY": 1172
      }
    ]
  },
  "eco": {
    "src": "/assets/v40/autochess/pieces/eco.png",
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "bodyHeight": 306,
    "facing": "left",
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 375,
        "anchorX": 201,
        "anchorY": 359
      },
      {
        "x": 362,
        "y": 0,
        "w": 362,
        "h": 375,
        "anchorX": 573,
        "anchorY": 371
      },
      {
        "x": 724,
        "y": 0,
        "w": 362,
        "h": 375,
        "anchorX": 943.5,
        "anchorY": 365
      },
      {
        "x": 1086,
        "y": 0,
        "w": 362,
        "h": 375,
        "anchorX": 1301,
        "anchorY": 368
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 375,
        "w": 361,
        "h": 349,
        "anchorX": 233,
        "anchorY": 715
      },
      {
        "x": 361,
        "y": 375,
        "w": 363,
        "h": 349,
        "anchorX": 608.5,
        "anchorY": 708
      },
      {
        "x": 724,
        "y": 375,
        "w": 363,
        "h": 349,
        "anchorX": 983,
        "anchorY": 714
      },
      {
        "x": 1087,
        "y": 375,
        "w": 361,
        "h": 349,
        "anchorX": 1326,
        "anchorY": 711
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 240.5,
        "anchorY": 1037
      },
      {
        "x": 362,
        "y": 724,
        "w": 363,
        "h": 362,
        "anchorX": 611,
        "anchorY": 1045
      },
      {
        "x": 725,
        "y": 724,
        "w": 361,
        "h": 362,
        "anchorX": 985,
        "anchorY": 1038
      },
      {
        "x": 1086,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 1336.5,
        "anchorY": 1044
      }
    ]
  },
  "cinder": {
    "src": "/assets/v40/autochess/pieces/cinder.png",
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "bodyHeight": 330,
    "facing": "left",
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 210.5,
        "anchorY": 353
      },
      {
        "x": 362,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 558,
        "anchorY": 353
      },
      {
        "x": 724,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 919.5,
        "anchorY": 354
      },
      {
        "x": 1086,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 1294.5,
        "anchorY": 353
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 189.5,
        "anchorY": 715
      },
      {
        "x": 362,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 556.5,
        "anchorY": 711
      },
      {
        "x": 724,
        "y": 362,
        "w": 377,
        "h": 362,
        "anchorX": 938,
        "anchorY": 710
      },
      {
        "x": 1101,
        "y": 362,
        "w": 347,
        "h": 362,
        "anchorX": 1296.5,
        "anchorY": 716
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 205,
        "anchorY": 1059
      },
      {
        "x": 362,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 560,
        "anchorY": 1059
      },
      {
        "x": 724,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 990,
        "anchorY": 1061
      },
      {
        "x": 1086,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 1285,
        "anchorY": 1063
      }
    ]
  },
  "astral": {
    "src": "/assets/v40/autochess/pieces/astral.png",
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "bodyHeight": 351.5,
    "facing": "left",
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 364,
        "anchorX": 178,
        "anchorY": 361
      },
      {
        "x": 362,
        "y": 0,
        "w": 362,
        "h": 364,
        "anchorX": 540.5,
        "anchorY": 361
      },
      {
        "x": 724,
        "y": 0,
        "w": 362,
        "h": 364,
        "anchorX": 906.5,
        "anchorY": 361
      },
      {
        "x": 1086,
        "y": 0,
        "w": 362,
        "h": 364,
        "anchorX": 1269.5,
        "anchorY": 361
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 364,
        "w": 362,
        "h": 362,
        "anchorX": 267,
        "anchorY": 721
      },
      {
        "x": 362,
        "y": 364,
        "w": 362,
        "h": 362,
        "anchorX": 653,
        "anchorY": 721
      },
      {
        "x": 724,
        "y": 364,
        "w": 362,
        "h": 362,
        "anchorX": 948,
        "anchorY": 723
      },
      {
        "x": 1086,
        "y": 364,
        "w": 362,
        "h": 362,
        "anchorX": 1272.5,
        "anchorY": 721
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 726,
        "w": 362,
        "h": 360,
        "anchorX": 280,
        "anchorY": 1071
      },
      {
        "x": 362,
        "y": 726,
        "w": 341,
        "h": 360,
        "anchorX": 642,
        "anchorY": 1071
      },
      {
        "x": 703,
        "y": 726,
        "w": 383,
        "h": 360,
        "anchorX": 933.5,
        "anchorY": 1071
      },
      {
        "x": 1086,
        "y": 726,
        "w": 362,
        "h": 360,
        "anchorX": 1268,
        "anchorY": 1072
      }
    ]
  }
};
export const AUTO_CHESS_PORTRAIT_ART_V40:Record<string,AutoChessItemArtV39>={
  "runewarden": {
    "src": "/assets/v40/autochess/pieces/runewarden.png",
    "sheetWidth": 1446,
    "sheetHeight": 1087,
    "crop": {
      "x": 141,
      "y": 92,
      "w": 123,
      "h": 141,
      "anchorX": 202.5,
      "anchorY": 162.5
    }
  },
  "moth": {
    "src": "/assets/v40/autochess/pieces/moth.png",
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "crop": {
      "x": 220,
      "y": 209,
      "w": 134,
      "h": 163,
      "anchorX": 287,
      "anchorY": 290.5
    }
  },
  "ashwolf": {
    "src": "/assets/v40/autochess/pieces/ashwolf.png",
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "crop": {
      "x": 26,
      "y": 97,
      "w": 167,
      "h": 169,
      "anchorX": 109.5,
      "anchorY": 181.5
    }
  },
  "lunastag": {
    "src": "/assets/v40/autochess/pieces/lunastag.png",
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "crop": {
      "x": 61,
      "y": 98,
      "w": 148,
      "h": 163,
      "anchorX": 135,
      "anchorY": 179.5
    }
  },
  "selo": {
    "src": "/assets/v40/autochess/pieces/selo.png",
    "sheetWidth": 1225,
    "sheetHeight": 1284,
    "crop": {
      "x": 102,
      "y": 133,
      "w": 145,
      "h": 146,
      "anchorX": 174.5,
      "anchorY": 206
    }
  },
  "eco": {
    "src": "/assets/v40/autochess/pieces/eco.png",
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "crop": {
      "x": 102,
      "y": 50,
      "w": 164,
      "h": 167,
      "anchorX": 184,
      "anchorY": 133.5
    }
  },
  "cinder": {
    "src": "/assets/v40/autochess/pieces/cinder.png",
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "crop": {
      "x": 143,
      "y": 17,
      "w": 140,
      "h": 141,
      "anchorX": 213,
      "anchorY": 87.5
    }
  },
  "astral": {
    "src": "/assets/v40/autochess/pieces/astral.png",
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "crop": {
      "x": 126,
      "y": 42,
      "w": 153,
      "h": 173,
      "anchorX": 202.5,
      "anchorY": 128.5
    }
  }
};
