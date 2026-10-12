import type {SpriteCrop} from '@/lib/game/sprites';

export type AutoChessSheetArtV39={src:string;sheetWidth:number;sheetHeight:number;frames:SpriteCrop[]};
export type AutoChessPieceArtV39={src:string;sheetWidth:number;sheetHeight:number;idle:SpriteCrop[];attack:SpriteCrop[];cast:SpriteCrop[];bodyHeight?:number};
export type AutoChessItemArtV39={src:string;sheetWidth:number;sheetHeight:number;crop:SpriteCrop};
export const AUTO_CHESS_BOARDS_V39=[
 {id:'academy',name:'Pátio dos Despertos',src:'/assets/v39/autochess/boards/academy.png',tileBounds:{x:.125,y:.125,width:.75,height:.75}},
 {id:'bloodmoon',name:'Baile da Lua de Sangue',src:'/assets/v39/autochess/boards/bloodmoon.png',tileBounds:{x:.125,y:.125,width:.75,height:.75}},
 {id:'jade',name:'Palácio de Jade',src:'/assets/v39/autochess/boards/jade.png',tileBounds:{x:.125,y:.125,width:.75,height:.75}},
] as const;
export const AUTO_CHESS_SPLASH_V39='/assets/v39/autochess/splash.png';
export const AUTO_CHESS_PIECE_ART_V39:Record<string,AutoChessPieceArtV39>={
  "seiji": {
    "src": "/assets/v39/autochess/pieces/seiji.png",
    "sheetWidth": 1225,
    "sheetHeight": 1284,
    "bodyHeight": 269,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 306,
        "h": 428,
        "anchorX": 176.5,
        "anchorY": 388
      },
      {
        "x": 306,
        "y": 0,
        "w": 307,
        "h": 428,
        "anchorX": 482,
        "anchorY": 388
      },
      {
        "x": 613,
        "y": 0,
        "w": 306,
        "h": 428,
        "anchorX": 773,
        "anchorY": 388
      },
      {
        "x": 919,
        "y": 0,
        "w": 306,
        "h": 428,
        "anchorX": 1072,
        "anchorY": 388
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 428,
        "w": 306,
        "h": 428,
        "anchorX": 178,
        "anchorY": 781
      },
      {
        "x": 306,
        "y": 428,
        "w": 307,
        "h": 428,
        "anchorX": 492.5,
        "anchorY": 781
      },
      {
        "x": 613,
        "y": 428,
        "w": 306,
        "h": 428,
        "anchorX": 801.5,
        "anchorY": 783
      },
      {
        "x": 919,
        "y": 428,
        "w": 306,
        "h": 428,
        "anchorX": 1076,
        "anchorY": 784
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 856,
        "w": 306,
        "h": 428,
        "anchorX": 180,
        "anchorY": 1176
      },
      {
        "x": 306,
        "y": 856,
        "w": 307,
        "h": 428,
        "anchorX": 478.5,
        "anchorY": 1179
      },
      {
        "x": 613,
        "y": 856,
        "w": 306,
        "h": 428,
        "anchorX": 776,
        "anchorY": 1177
      },
      {
        "x": 919,
        "y": 856,
        "w": 306,
        "h": 428,
        "anchorX": 1074.5,
        "anchorY": 1178
      }
    ]
  },
  "ophelia": {
    "src": "/assets/v39/autochess/pieces/ophelia.png",
    "sheetWidth": 1227,
    "sheetHeight": 1282,
    "bodyHeight": 315,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 307,
        "h": 431,
        "anchorX": 175,
        "anchorY": 426
      },
      {
        "x": 307,
        "y": 0,
        "w": 307,
        "h": 431,
        "anchorX": 467.5,
        "anchorY": 426
      },
      {
        "x": 614,
        "y": 0,
        "w": 306,
        "h": 431,
        "anchorX": 766.5,
        "anchorY": 427
      },
      {
        "x": 920,
        "y": 0,
        "w": 307,
        "h": 431,
        "anchorX": 1066.5,
        "anchorY": 426
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 431,
        "w": 307,
        "h": 424,
        "anchorX": 183,
        "anchorY": 820
      },
      {
        "x": 307,
        "y": 431,
        "w": 308,
        "h": 424,
        "anchorX": 495,
        "anchorY": 821
      },
      {
        "x": 615,
        "y": 431,
        "w": 317,
        "h": 424,
        "anchorX": 785,
        "anchorY": 822
      },
      {
        "x": 932,
        "y": 431,
        "w": 295,
        "h": 424,
        "anchorX": 1086.5,
        "anchorY": 823
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 855,
        "w": 307,
        "h": 427,
        "anchorX": 193.5,
        "anchorY": 1215
      },
      {
        "x": 307,
        "y": 855,
        "w": 307,
        "h": 427,
        "anchorX": 491,
        "anchorY": 1216
      },
      {
        "x": 614,
        "y": 855,
        "w": 306,
        "h": 427,
        "anchorX": 772.5,
        "anchorY": 1218
      },
      {
        "x": 920,
        "y": 855,
        "w": 307,
        "h": 427,
        "anchorX": 1086.5,
        "anchorY": 1216
      }
    ]
  },
  "max": {
    "src": "/assets/v39/autochess/pieces/max.png",
    "sheetWidth": 1536,
    "sheetHeight": 1024,
    "bodyHeight": 232.5,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 182.5,
        "anchorY": 325
      },
      {
        "x": 384,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 569.5,
        "anchorY": 326
      },
      {
        "x": 768,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 952.5,
        "anchorY": 325
      },
      {
        "x": 1152,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 1338,
        "anchorY": 326
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 189.5,
        "anchorY": 638
      },
      {
        "x": 384,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 555,
        "anchorY": 638
      },
      {
        "x": 768,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 939,
        "anchorY": 638
      },
      {
        "x": 1152,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 1339,
        "anchorY": 640
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 189,
        "anchorY": 961
      },
      {
        "x": 384,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 564.5,
        "anchorY": 961
      },
      {
        "x": 768,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 949.5,
        "anchorY": 960
      },
      {
        "x": 1152,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 1340,
        "anchorY": 961
      }
    ]
  },
  "gabriel": {
    "src": "/assets/v39/autochess/pieces/gabriel.png",
    "sheetWidth": 1226,
    "sheetHeight": 1283,
    "bodyHeight": 305.5,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 307,
        "h": 435,
        "anchorX": 174.5,
        "anchorY": 431
      },
      {
        "x": 307,
        "y": 0,
        "w": 306,
        "h": 435,
        "anchorX": 473.5,
        "anchorY": 431
      },
      {
        "x": 613,
        "y": 0,
        "w": 307,
        "h": 435,
        "anchorX": 776,
        "anchorY": 430
      },
      {
        "x": 920,
        "y": 0,
        "w": 306,
        "h": 435,
        "anchorX": 1071,
        "anchorY": 432
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 435,
        "w": 307,
        "h": 420,
        "anchorX": 160.5,
        "anchorY": 788
      },
      {
        "x": 307,
        "y": 435,
        "w": 306,
        "h": 420,
        "anchorX": 472.5,
        "anchorY": 786
      },
      {
        "x": 613,
        "y": 435,
        "w": 307,
        "h": 420,
        "anchorX": 834.5,
        "anchorY": 792
      },
      {
        "x": 920,
        "y": 435,
        "w": 306,
        "h": 420,
        "anchorX": 1086.5,
        "anchorY": 794
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 855,
        "w": 307,
        "h": 428,
        "anchorX": 169.5,
        "anchorY": 1175
      },
      {
        "x": 307,
        "y": 855,
        "w": 306,
        "h": 428,
        "anchorX": 469.5,
        "anchorY": 1175
      },
      {
        "x": 613,
        "y": 855,
        "w": 307,
        "h": 428,
        "anchorX": 687.5,
        "anchorY": 1181
      },
      {
        "x": 920,
        "y": 855,
        "w": 306,
        "h": 428,
        "anchorX": 1081.5,
        "anchorY": 1182
      }
    ]
  },
  "marin": {
    "src": "/assets/v39/autochess/pieces/marin.png",
    "sheetWidth": 1024,
    "sheetHeight": 1536,
    "bodyHeight": 282.5,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 256,
        "h": 512,
        "anchorX": 129,
        "anchorY": 455
      },
      {
        "x": 256,
        "y": 0,
        "w": 256,
        "h": 512,
        "anchorX": 387.5,
        "anchorY": 454
      },
      {
        "x": 512,
        "y": 0,
        "w": 256,
        "h": 512,
        "anchorX": 634.5,
        "anchorY": 454
      },
      {
        "x": 768,
        "y": 0,
        "w": 256,
        "h": 512,
        "anchorX": 905,
        "anchorY": 455
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 512,
        "w": 256,
        "h": 512,
        "anchorX": 65.5,
        "anchorY": 926
      },
      {
        "x": 256,
        "y": 512,
        "w": 271,
        "h": 512,
        "anchorX": 302.5,
        "anchorY": 928
      },
      {
        "x": 527,
        "y": 512,
        "w": 245,
        "h": 512,
        "anchorX": 651,
        "anchorY": 929
      },
      {
        "x": 772,
        "y": 512,
        "w": 252,
        "h": 512,
        "anchorX": 897.5,
        "anchorY": 931
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 1024,
        "w": 256,
        "h": 512,
        "anchorX": 107.5,
        "anchorY": 1413
      },
      {
        "x": 256,
        "y": 1024,
        "w": 256,
        "h": 512,
        "anchorX": 393,
        "anchorY": 1413
      },
      {
        "x": 512,
        "y": 1024,
        "w": 259,
        "h": 512,
        "anchorX": 651.5,
        "anchorY": 1416
      },
      {
        "x": 771,
        "y": 1024,
        "w": 253,
        "h": 512,
        "anchorX": 914,
        "anchorY": 1416
      }
    ]
  },
  "ava": {
    "src": "/assets/v39/autochess/pieces/ava.png",
    "sheetWidth": 1536,
    "sheetHeight": 1024,
    "bodyHeight": 259,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 197,
        "anchorY": 324
      },
      {
        "x": 384,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 591,
        "anchorY": 324
      },
      {
        "x": 768,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 970.5,
        "anchorY": 324
      },
      {
        "x": 1152,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 1359,
        "anchorY": 324
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 197.5,
        "anchorY": 646
      },
      {
        "x": 384,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 560,
        "anchorY": 645
      },
      {
        "x": 768,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 965,
        "anchorY": 646
      },
      {
        "x": 1152,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 1346.5,
        "anchorY": 646
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 196,
        "anchorY": 975
      },
      {
        "x": 384,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 569,
        "anchorY": 974
      },
      {
        "x": 768,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 942.5,
        "anchorY": 975
      },
      {
        "x": 1152,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 1366,
        "anchorY": 975
      }
    ]
  },
  "carmilla": {
    "src": "/assets/v39/autochess/pieces/carmilla.png",
    "sheetWidth": 1223,
    "sheetHeight": 1286,
    "bodyHeight": 304.5,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 306,
        "h": 429,
        "anchorX": 176,
        "anchorY": 401
      },
      {
        "x": 306,
        "y": 0,
        "w": 306,
        "h": 429,
        "anchorX": 452,
        "anchorY": 398
      },
      {
        "x": 612,
        "y": 0,
        "w": 305,
        "h": 429,
        "anchorX": 754.5,
        "anchorY": 394
      },
      {
        "x": 917,
        "y": 0,
        "w": 306,
        "h": 429,
        "anchorX": 1074,
        "anchorY": 397
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 429,
        "w": 306,
        "h": 428,
        "anchorX": 125,
        "anchorY": 805
      },
      {
        "x": 306,
        "y": 429,
        "w": 306,
        "h": 428,
        "anchorX": 468.5,
        "anchorY": 802
      },
      {
        "x": 612,
        "y": 429,
        "w": 305,
        "h": 428,
        "anchorX": 779,
        "anchorY": 792
      },
      {
        "x": 917,
        "y": 429,
        "w": 306,
        "h": 428,
        "anchorX": 1075,
        "anchorY": 801
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 857,
        "w": 306,
        "h": 429,
        "anchorX": 176.5,
        "anchorY": 1184
      },
      {
        "x": 306,
        "y": 857,
        "w": 306,
        "h": 429,
        "anchorX": 450.5,
        "anchorY": 1183
      },
      {
        "x": 612,
        "y": 857,
        "w": 305,
        "h": 429,
        "anchorX": 747,
        "anchorY": 1184
      },
      {
        "x": 917,
        "y": 857,
        "w": 306,
        "h": 429,
        "anchorX": 1056.5,
        "anchorY": 1185
      }
    ]
  },
  "beatriz": {
    "src": "/assets/v39/autochess/pieces/beatriz.png",
    "sheetWidth": 1436,
    "sheetHeight": 1096,
    "bodyHeight": 278.5,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 359,
        "h": 365,
        "anchorX": 200.5,
        "anchorY": 341
      },
      {
        "x": 359,
        "y": 0,
        "w": 359,
        "h": 365,
        "anchorX": 566.5,
        "anchorY": 342
      },
      {
        "x": 718,
        "y": 0,
        "w": 359,
        "h": 365,
        "anchorX": 893,
        "anchorY": 344
      },
      {
        "x": 1077,
        "y": 0,
        "w": 359,
        "h": 365,
        "anchorX": 1265,
        "anchorY": 342
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 365,
        "w": 359,
        "h": 366,
        "anchorX": 216,
        "anchorY": 687
      },
      {
        "x": 359,
        "y": 365,
        "w": 359,
        "h": 366,
        "anchorX": 553.5,
        "anchorY": 689
      },
      {
        "x": 718,
        "y": 365,
        "w": 359,
        "h": 366,
        "anchorX": 895.5,
        "anchorY": 688
      },
      {
        "x": 1077,
        "y": 365,
        "w": 359,
        "h": 366,
        "anchorX": 1273.5,
        "anchorY": 689
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 731,
        "w": 359,
        "h": 365,
        "anchorX": 206.5,
        "anchorY": 1033
      },
      {
        "x": 359,
        "y": 731,
        "w": 359,
        "h": 365,
        "anchorX": 546,
        "anchorY": 1029
      },
      {
        "x": 718,
        "y": 731,
        "w": 359,
        "h": 365,
        "anchorX": 892.5,
        "anchorY": 1029
      },
      {
        "x": 1077,
        "y": 731,
        "w": 359,
        "h": 365,
        "anchorX": 1270,
        "anchorY": 1030
      }
    ]
  },
  "abel": {
    "src": "/assets/v39/autochess/pieces/abel.png",
    "sheetWidth": 1245,
    "sheetHeight": 1263,
    "bodyHeight": 296.5,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 311,
        "h": 421,
        "anchorX": 162.5,
        "anchorY": 398
      },
      {
        "x": 311,
        "y": 0,
        "w": 312,
        "h": 421,
        "anchorX": 475.5,
        "anchorY": 396
      },
      {
        "x": 623,
        "y": 0,
        "w": 311,
        "h": 421,
        "anchorX": 787,
        "anchorY": 396
      },
      {
        "x": 934,
        "y": 0,
        "w": 311,
        "h": 421,
        "anchorX": 1092,
        "anchorY": 397
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 421,
        "w": 311,
        "h": 417,
        "anchorX": 166.5,
        "anchorY": 774
      },
      {
        "x": 311,
        "y": 421,
        "w": 312,
        "h": 417,
        "anchorX": 464,
        "anchorY": 773
      },
      {
        "x": 623,
        "y": 421,
        "w": 318,
        "h": 417,
        "anchorX": 786,
        "anchorY": 773
      },
      {
        "x": 941,
        "y": 421,
        "w": 304,
        "h": 417,
        "anchorX": 1092.5,
        "anchorY": 777
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 838,
        "w": 311,
        "h": 425,
        "anchorX": 168,
        "anchorY": 1168
      },
      {
        "x": 311,
        "y": 838,
        "w": 312,
        "h": 425,
        "anchorX": 457,
        "anchorY": 1172
      },
      {
        "x": 623,
        "y": 838,
        "w": 311,
        "h": 425,
        "anchorX": 767,
        "anchorY": 1174
      },
      {
        "x": 934,
        "y": 838,
        "w": 311,
        "h": 425,
        "anchorX": 1087,
        "anchorY": 1171
      }
    ]
  },
  "orfeu": {
    "src": "/assets/v39/autochess/pieces/orfeu.png",
    "sheetWidth": 1536,
    "sheetHeight": 1024,
    "bodyHeight": 231.5,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 185.5,
        "anchorY": 323
      },
      {
        "x": 384,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 571,
        "anchorY": 323
      },
      {
        "x": 768,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 955.5,
        "anchorY": 323
      },
      {
        "x": 1152,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 1345,
        "anchorY": 324
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 197,
        "anchorY": 643
      },
      {
        "x": 384,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 563,
        "anchorY": 643
      },
      {
        "x": 768,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 962,
        "anchorY": 641
      },
      {
        "x": 1152,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 1356.5,
        "anchorY": 645
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 192,
        "anchorY": 964
      },
      {
        "x": 384,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 571.5,
        "anchorY": 964
      },
      {
        "x": 768,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 954,
        "anchorY": 963
      },
      {
        "x": 1152,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 1357,
        "anchorY": 960
      }
    ]
  },
  "seiji-last-script": {
    "src": "/assets/v39/autochess/pieces/seiji-last-script.png",
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "bodyHeight": 273,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 364,
        "anchorX": 199.5,
        "anchorY": 361
      },
      {
        "x": 362,
        "y": 0,
        "w": 362,
        "h": 364,
        "anchorX": 564,
        "anchorY": 360
      },
      {
        "x": 724,
        "y": 0,
        "w": 362,
        "h": 364,
        "anchorX": 926.5,
        "anchorY": 361
      },
      {
        "x": 1086,
        "y": 0,
        "w": 362,
        "h": 364,
        "anchorX": 1294.5,
        "anchorY": 361
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 364,
        "w": 362,
        "h": 360,
        "anchorX": 196.5,
        "anchorY": 683
      },
      {
        "x": 362,
        "y": 364,
        "w": 362,
        "h": 360,
        "anchorX": 513.5,
        "anchorY": 685
      },
      {
        "x": 724,
        "y": 364,
        "w": 377,
        "h": 360,
        "anchorX": 929.5,
        "anchorY": 688
      },
      {
        "x": 1101,
        "y": 364,
        "w": 347,
        "h": 360,
        "anchorX": 1299,
        "anchorY": 688
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 188,
        "anchorY": 1023
      },
      {
        "x": 362,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 549,
        "anchorY": 1021
      },
      {
        "x": 724,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 937.5,
        "anchorY": 1023
      },
      {
        "x": 1086,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 1294,
        "anchorY": 1024
      }
    ]
  },
  "ophelia-white-equinox": {
    "src": "/assets/v39/autochess/pieces/ophelia-white-equinox.png",
    "sheetWidth": 1429,
    "sheetHeight": 1100,
    "bodyHeight": 253.5,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 357,
        "h": 367,
        "anchorX": 201,
        "anchorY": 351
      },
      {
        "x": 357,
        "y": 0,
        "w": 358,
        "h": 367,
        "anchorX": 555,
        "anchorY": 351
      },
      {
        "x": 715,
        "y": 0,
        "w": 357,
        "h": 367,
        "anchorX": 905.5,
        "anchorY": 350
      },
      {
        "x": 1072,
        "y": 0,
        "w": 357,
        "h": 367,
        "anchorX": 1254.5,
        "anchorY": 352
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 367,
        "w": 357,
        "h": 366,
        "anchorX": 202.5,
        "anchorY": 690
      },
      {
        "x": 357,
        "y": 367,
        "w": 358,
        "h": 366,
        "anchorX": 573.5,
        "anchorY": 691
      },
      {
        "x": 715,
        "y": 367,
        "w": 357,
        "h": 366,
        "anchorX": 894,
        "anchorY": 691
      },
      {
        "x": 1072,
        "y": 367,
        "w": 357,
        "h": 366,
        "anchorX": 1268,
        "anchorY": 693
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 733,
        "w": 357,
        "h": 367,
        "anchorX": 200,
        "anchorY": 1041
      },
      {
        "x": 357,
        "y": 733,
        "w": 358,
        "h": 367,
        "anchorX": 555,
        "anchorY": 1041
      },
      {
        "x": 715,
        "y": 733,
        "w": 357,
        "h": 367,
        "anchorX": 914.5,
        "anchorY": 1041
      },
      {
        "x": 1072,
        "y": 733,
        "w": 357,
        "h": 367,
        "anchorX": 1268,
        "anchorY": 1041
      }
    ]
  },
  "marin-starless-throne": {
    "src": "/assets/v39/autochess/pieces/marin-starless-throne.png",
    "sheetWidth": 1222,
    "sheetHeight": 1287,
    "bodyHeight": 306.5,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 306,
        "h": 429,
        "anchorX": 177.5,
        "anchorY": 390
      },
      {
        "x": 306,
        "y": 0,
        "w": 305,
        "h": 429,
        "anchorX": 479,
        "anchorY": 391
      },
      {
        "x": 611,
        "y": 0,
        "w": 306,
        "h": 429,
        "anchorX": 759,
        "anchorY": 390
      },
      {
        "x": 917,
        "y": 0,
        "w": 305,
        "h": 429,
        "anchorX": 1057.5,
        "anchorY": 390
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 429,
        "w": 306,
        "h": 429,
        "anchorX": 166.5,
        "anchorY": 787
      },
      {
        "x": 306,
        "y": 429,
        "w": 305,
        "h": 429,
        "anchorX": 469.5,
        "anchorY": 787
      },
      {
        "x": 611,
        "y": 429,
        "w": 306,
        "h": 429,
        "anchorX": 764.5,
        "anchorY": 780
      },
      {
        "x": 917,
        "y": 429,
        "w": 305,
        "h": 429,
        "anchorX": 1080.5,
        "anchorY": 787
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 858,
        "w": 306,
        "h": 429,
        "anchorX": 162,
        "anchorY": 1195
      },
      {
        "x": 306,
        "y": 858,
        "w": 305,
        "h": 429,
        "anchorX": 468,
        "anchorY": 1195
      },
      {
        "x": 611,
        "y": 858,
        "w": 306,
        "h": 429,
        "anchorX": 761.5,
        "anchorY": 1195
      },
      {
        "x": 917,
        "y": 858,
        "w": 305,
        "h": 429,
        "anchorX": 1079.5,
        "anchorY": 1195
      }
    ]
  },
  "gabriel-solar-oath": {
    "src": "/assets/v39/autochess/pieces/gabriel-solar-oath.png",
    "sheetWidth": 1536,
    "sheetHeight": 1024,
    "bodyHeight": 234.5,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 215,
        "anchorY": 308
      },
      {
        "x": 384,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 577.5,
        "anchorY": 308
      },
      {
        "x": 768,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 959,
        "anchorY": 308
      },
      {
        "x": 1152,
        "y": 0,
        "w": 384,
        "h": 341,
        "anchorX": 1337.5,
        "anchorY": 307
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 206.5,
        "anchorY": 610
      },
      {
        "x": 384,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 573.5,
        "anchorY": 613
      },
      {
        "x": 768,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 972,
        "anchorY": 613
      },
      {
        "x": 1152,
        "y": 341,
        "w": 384,
        "h": 342,
        "anchorX": 1351.5,
        "anchorY": 614
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 212.5,
        "anchorY": 934
      },
      {
        "x": 384,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 587,
        "anchorY": 935
      },
      {
        "x": 768,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 950.5,
        "anchorY": 935
      },
      {
        "x": 1152,
        "y": 683,
        "w": 384,
        "h": 341,
        "anchorX": 1356,
        "anchorY": 935
      }
    ]
  },
  "max-thunder-requiem": {
    "src": "/assets/v39/autochess/pieces/max-thunder-requiem.png",
    "sheetWidth": 1225,
    "sheetHeight": 1284,
    "bodyHeight": 301.5,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 306,
        "h": 428,
        "anchorX": 169.5,
        "anchorY": 382
      },
      {
        "x": 306,
        "y": 0,
        "w": 307,
        "h": 428,
        "anchorX": 460.5,
        "anchorY": 376
      },
      {
        "x": 613,
        "y": 0,
        "w": 306,
        "h": 428,
        "anchorX": 780.5,
        "anchorY": 383
      },
      {
        "x": 919,
        "y": 0,
        "w": 306,
        "h": 428,
        "anchorX": 1078,
        "anchorY": 382
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 428,
        "w": 306,
        "h": 428,
        "anchorX": 249,
        "anchorY": 775
      },
      {
        "x": 306,
        "y": 428,
        "w": 307,
        "h": 428,
        "anchorX": 472.5,
        "anchorY": 764
      },
      {
        "x": 613,
        "y": 428,
        "w": 306,
        "h": 428,
        "anchorX": 784,
        "anchorY": 778
      },
      {
        "x": 919,
        "y": 428,
        "w": 306,
        "h": 428,
        "anchorX": 1099.5,
        "anchorY": 778
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 856,
        "w": 306,
        "h": 428,
        "anchorX": 163.5,
        "anchorY": 1169
      },
      {
        "x": 306,
        "y": 856,
        "w": 307,
        "h": 428,
        "anchorX": 475.5,
        "anchorY": 1167
      },
      {
        "x": 613,
        "y": 856,
        "w": 306,
        "h": 428,
        "anchorX": 768,
        "anchorY": 1165
      },
      {
        "x": 919,
        "y": 856,
        "w": 306,
        "h": 428,
        "anchorX": 1086.5,
        "anchorY": 1171
      }
    ]
  },
  "ava-worldroot-sovereign": {
    "src": "/assets/v39/autochess/pieces/ava-worldroot-sovereign.png",
    "sheetWidth": 1447,
    "sheetHeight": 1087,
    "bodyHeight": 279.5,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 186.5,
        "anchorY": 356
      },
      {
        "x": 362,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 554.5,
        "anchorY": 356
      },
      {
        "x": 724,
        "y": 0,
        "w": 361,
        "h": 362,
        "anchorX": 898.5,
        "anchorY": 356
      },
      {
        "x": 1085,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 1269,
        "anchorY": 355
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 362,
        "w": 362,
        "h": 361,
        "anchorX": 180,
        "anchorY": 677
      },
      {
        "x": 362,
        "y": 362,
        "w": 362,
        "h": 361,
        "anchorX": 540,
        "anchorY": 677
      },
      {
        "x": 724,
        "y": 362,
        "w": 361,
        "h": 361,
        "anchorX": 911.5,
        "anchorY": 676
      },
      {
        "x": 1085,
        "y": 362,
        "w": 362,
        "h": 361,
        "anchorX": 1277,
        "anchorY": 677
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 723,
        "w": 362,
        "h": 364,
        "anchorX": 191,
        "anchorY": 1026
      },
      {
        "x": 362,
        "y": 723,
        "w": 362,
        "h": 364,
        "anchorX": 542,
        "anchorY": 1026
      },
      {
        "x": 724,
        "y": 723,
        "w": 361,
        "h": 364,
        "anchorX": 904.5,
        "anchorY": 1026
      },
      {
        "x": 1085,
        "y": 723,
        "w": 362,
        "h": 364,
        "anchorX": 1274.5,
        "anchorY": 1026
      }
    ]
  },
  "beatriz-eclipse-tide": {
    "src": "/assets/v39/autochess/pieces/beatriz-eclipse-tide.png",
    "sheetWidth": 1432,
    "sheetHeight": 1098,
    "bodyHeight": 246.5,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 358,
        "h": 366,
        "anchorX": 190,
        "anchorY": 325
      },
      {
        "x": 358,
        "y": 0,
        "w": 358,
        "h": 366,
        "anchorX": 540,
        "anchorY": 325
      },
      {
        "x": 716,
        "y": 0,
        "w": 358,
        "h": 366,
        "anchorX": 890,
        "anchorY": 325
      },
      {
        "x": 1074,
        "y": 0,
        "w": 358,
        "h": 366,
        "anchorX": 1267.5,
        "anchorY": 325
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 366,
        "w": 358,
        "h": 366,
        "anchorX": 172.5,
        "anchorY": 669
      },
      {
        "x": 358,
        "y": 366,
        "w": 358,
        "h": 366,
        "anchorX": 529.5,
        "anchorY": 669
      },
      {
        "x": 716,
        "y": 366,
        "w": 358,
        "h": 366,
        "anchorX": 870.5,
        "anchorY": 670
      },
      {
        "x": 1074,
        "y": 366,
        "w": 358,
        "h": 366,
        "anchorX": 1283,
        "anchorY": 669
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 732,
        "w": 358,
        "h": 366,
        "anchorX": 183.5,
        "anchorY": 1021
      },
      {
        "x": 358,
        "y": 732,
        "w": 358,
        "h": 366,
        "anchorX": 540,
        "anchorY": 1021
      },
      {
        "x": 716,
        "y": 732,
        "w": 358,
        "h": 366,
        "anchorX": 854,
        "anchorY": 1021
      },
      {
        "x": 1074,
        "y": 732,
        "w": 358,
        "h": 366,
        "anchorX": 1257.5,
        "anchorY": 1023
      }
    ]
  },
  "orfeu-unwritten-archon": {
    "src": "/assets/v39/autochess/pieces/orfeu-unwritten-archon.png",
    "sheetWidth": 1214,
    "sheetHeight": 1295,
    "bodyHeight": 293,
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 304,
        "h": 432,
        "anchorX": 160.5,
        "anchorY": 394
      },
      {
        "x": 304,
        "y": 0,
        "w": 303,
        "h": 432,
        "anchorX": 456,
        "anchorY": 395
      },
      {
        "x": 607,
        "y": 0,
        "w": 304,
        "h": 432,
        "anchorX": 764,
        "anchorY": 395
      },
      {
        "x": 911,
        "y": 0,
        "w": 303,
        "h": 432,
        "anchorX": 1066,
        "anchorY": 396
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 432,
        "w": 304,
        "h": 431,
        "anchorX": 166.5,
        "anchorY": 807
      },
      {
        "x": 304,
        "y": 432,
        "w": 303,
        "h": 431,
        "anchorX": 448.5,
        "anchorY": 809
      },
      {
        "x": 607,
        "y": 432,
        "w": 304,
        "h": 431,
        "anchorX": 768.5,
        "anchorY": 810
      },
      {
        "x": 911,
        "y": 432,
        "w": 303,
        "h": 431,
        "anchorX": 1067,
        "anchorY": 811
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 863,
        "w": 304,
        "h": 432,
        "anchorX": 161.5,
        "anchorY": 1204
      },
      {
        "x": 304,
        "y": 863,
        "w": 303,
        "h": 432,
        "anchorX": 464,
        "anchorY": 1207
      },
      {
        "x": 607,
        "y": 863,
        "w": 304,
        "h": 432,
        "anchorX": 744.5,
        "anchorY": 1208
      },
      {
        "x": 911,
        "y": 863,
        "w": 303,
        "h": 432,
        "anchorX": 1071,
        "anchorY": 1208
      }
    ]
  },
  "shin": {
    "src": "/assets/v39/autochess/pieces/shin.png",
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 188.5,
        "anchorY": 344
      },
      {
        "x": 362,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 554,
        "anchorY": 345
      },
      {
        "x": 724,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 912.5,
        "anchorY": 342
      },
      {
        "x": 1086,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 1272,
        "anchorY": 342
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 184.5,
        "anchorY": 677
      },
      {
        "x": 362,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 551.5,
        "anchorY": 678
      },
      {
        "x": 724,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 901,
        "anchorY": 678
      },
      {
        "x": 1086,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 1272,
        "anchorY": 677
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 187,
        "anchorY": 1021
      },
      {
        "x": 362,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 556,
        "anchorY": 1022
      },
      {
        "x": 724,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 913.5,
        "anchorY": 1023
      },
      {
        "x": 1086,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 1268,
        "anchorY": 1021
      }
    ],
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "bodyHeight": 254.5
  },
  "mika": {
    "src": "/assets/v39/autochess/pieces/mika.png",
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 183,
        "anchorY": 338
      },
      {
        "x": 362,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 541.5,
        "anchorY": 338
      },
      {
        "x": 724,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 900.5,
        "anchorY": 338
      },
      {
        "x": 1086,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 1262,
        "anchorY": 338
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 186.5,
        "anchorY": 688
      },
      {
        "x": 362,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 522.5,
        "anchorY": 688
      },
      {
        "x": 724,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 885.5,
        "anchorY": 688
      },
      {
        "x": 1086,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 1265.5,
        "anchorY": 688
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 190,
        "anchorY": 1023
      },
      {
        "x": 362,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 549,
        "anchorY": 1023
      },
      {
        "x": 724,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 917,
        "anchorY": 1023
      },
      {
        "x": 1086,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 1281,
        "anchorY": 1023
      }
    ],
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "bodyHeight": 258.5
  },
  "umbra": {
    "src": "/assets/v39/autochess/pieces/umbra.png",
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 183,
        "anchorY": 345
      },
      {
        "x": 362,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 551.5,
        "anchorY": 345
      },
      {
        "x": 724,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 911,
        "anchorY": 345
      },
      {
        "x": 1086,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 1273,
        "anchorY": 344
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 173.5,
        "anchorY": 684
      },
      {
        "x": 362,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 503.5,
        "anchorY": 684
      },
      {
        "x": 724,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 904.5,
        "anchorY": 684
      },
      {
        "x": 1086,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 1282,
        "anchorY": 685
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 192,
        "anchorY": 1026
      },
      {
        "x": 362,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 540.5,
        "anchorY": 1027
      },
      {
        "x": 724,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 904.5,
        "anchorY": 1031
      },
      {
        "x": 1086,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 1252.5,
        "anchorY": 1028
      }
    ],
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "bodyHeight": 264.5
  },
  "vajra": {
    "src": "/assets/v39/autochess/pieces/vajra.png",
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 175.5,
        "anchorY": 347
      },
      {
        "x": 362,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 551.5,
        "anchorY": 347
      },
      {
        "x": 724,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 895,
        "anchorY": 347
      },
      {
        "x": 1086,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 1260,
        "anchorY": 347
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 181.5,
        "anchorY": 703
      },
      {
        "x": 362,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 534,
        "anchorY": 702
      },
      {
        "x": 724,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 899,
        "anchorY": 702
      },
      {
        "x": 1086,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 1274.5,
        "anchorY": 703
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 177.5,
        "anchorY": 1037
      },
      {
        "x": 362,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 539.5,
        "anchorY": 1036
      },
      {
        "x": 724,
        "y": 724,
        "w": 386,
        "h": 362,
        "anchorX": 872,
        "anchorY": 1036
      },
      {
        "x": 1110,
        "y": 724,
        "w": 338,
        "h": 362,
        "anchorX": 1275.5,
        "anchorY": 1036
      }
    ],
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "bodyHeight": 249
  },
  "dante": {
    "src": "/assets/v39/autochess/pieces/dante.png",
    "idle": [
      {
        "x": 0,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 194.5,
        "anchorY": 331
      },
      {
        "x": 362,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 553.5,
        "anchorY": 330
      },
      {
        "x": 724,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 906.5,
        "anchorY": 330
      },
      {
        "x": 1086,
        "y": 0,
        "w": 362,
        "h": 362,
        "anchorX": 1277.5,
        "anchorY": 327
      }
    ],
    "attack": [
      {
        "x": 0,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 205.5,
        "anchorY": 665
      },
      {
        "x": 362,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 613,
        "anchorY": 650
      },
      {
        "x": 724,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 936,
        "anchorY": 665
      },
      {
        "x": 1086,
        "y": 362,
        "w": 362,
        "h": 362,
        "anchorX": 1287.5,
        "anchorY": 666
      }
    ],
    "cast": [
      {
        "x": 0,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 201,
        "anchorY": 982
      },
      {
        "x": 362,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 556.5,
        "anchorY": 984
      },
      {
        "x": 724,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 923.5,
        "anchorY": 985
      },
      {
        "x": 1086,
        "y": 724,
        "w": 362,
        "h": 362,
        "anchorX": 1283.5,
        "anchorY": 997
      }
    ],
    "sheetWidth": 1448,
    "sheetHeight": 1086,
    "bodyHeight": 239.5
  }
};
export const AUTO_CHESS_EFFECT_ART_V39:Record<string,AutoChessSheetArtV39>={
  "fusion": {
    "src": "/assets/v39/autochess/items-and-fx/fusion.png",
    "frames": [
      {
        "x": 0,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 128,
        "anchorY": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 384,
        "anchorY": 128
      },
      {
        "x": 512,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 640,
        "anchorY": 128
      },
      {
        "x": 768,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 896,
        "anchorY": 128
      },
      {
        "x": 1024,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 1152,
        "anchorY": 128
      },
      {
        "x": 1280,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 1408,
        "anchorY": 128
      },
      {
        "x": 0,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 128,
        "anchorY": 384
      },
      {
        "x": 256,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 384,
        "anchorY": 384
      },
      {
        "x": 512,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 640,
        "anchorY": 384
      },
      {
        "x": 768,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 896,
        "anchorY": 384
      },
      {
        "x": 1024,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 1152,
        "anchorY": 384
      },
      {
        "x": 1280,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 1408,
        "anchorY": 384
      },
      {
        "x": 0,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 128,
        "anchorY": 640
      },
      {
        "x": 256,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 384,
        "anchorY": 640
      },
      {
        "x": 512,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 640,
        "anchorY": 640
      },
      {
        "x": 768,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 896,
        "anchorY": 640
      },
      {
        "x": 1024,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 1152,
        "anchorY": 640
      },
      {
        "x": 1280,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 1408,
        "anchorY": 640
      },
      {
        "x": 0,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 128,
        "anchorY": 896
      },
      {
        "x": 256,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 384,
        "anchorY": 896
      },
      {
        "x": 512,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 640,
        "anchorY": 896
      },
      {
        "x": 768,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 896,
        "anchorY": 896
      },
      {
        "x": 1024,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 1152,
        "anchorY": 896
      },
      {
        "x": 1280,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 1408,
        "anchorY": 896
      }
    ],
    "sheetWidth": 1536,
    "sheetHeight": 1024
  },
  "craft": {
    "src": "/assets/v39/autochess/items-and-fx/craft.png",
    "frames": [
      {
        "x": 0,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 128,
        "anchorY": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 384,
        "anchorY": 128
      },
      {
        "x": 512,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 640,
        "anchorY": 128
      },
      {
        "x": 768,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 896,
        "anchorY": 128
      },
      {
        "x": 1024,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 1152,
        "anchorY": 128
      },
      {
        "x": 1280,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 1408,
        "anchorY": 128
      },
      {
        "x": 0,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 128,
        "anchorY": 384
      },
      {
        "x": 256,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 384,
        "anchorY": 384
      },
      {
        "x": 512,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 640,
        "anchorY": 384
      },
      {
        "x": 768,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 896,
        "anchorY": 384
      },
      {
        "x": 1024,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 1152,
        "anchorY": 384
      },
      {
        "x": 1280,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 1408,
        "anchorY": 384
      },
      {
        "x": 0,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 128,
        "anchorY": 640
      },
      {
        "x": 256,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 384,
        "anchorY": 640
      },
      {
        "x": 512,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 640,
        "anchorY": 640
      },
      {
        "x": 768,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 896,
        "anchorY": 640
      },
      {
        "x": 1024,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 1152,
        "anchorY": 640
      },
      {
        "x": 1280,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 1408,
        "anchorY": 640
      },
      {
        "x": 0,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 128,
        "anchorY": 896
      },
      {
        "x": 256,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 384,
        "anchorY": 896
      },
      {
        "x": 512,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 640,
        "anchorY": 896
      },
      {
        "x": 768,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 896,
        "anchorY": 896
      },
      {
        "x": 1024,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 1152,
        "anchorY": 896
      },
      {
        "x": 1280,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 1408,
        "anchorY": 896
      }
    ],
    "sheetWidth": 1536,
    "sheetHeight": 1024
  },
  "victory": {
    "src": "/assets/v39/autochess/items-and-fx/victory.png",
    "frames": [
      {
        "x": 0,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 128,
        "anchorY": 128
      },
      {
        "x": 256,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 384,
        "anchorY": 128
      },
      {
        "x": 512,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 640,
        "anchorY": 128
      },
      {
        "x": 768,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 896,
        "anchorY": 128
      },
      {
        "x": 1024,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 1152,
        "anchorY": 128
      },
      {
        "x": 1280,
        "y": 0,
        "w": 256,
        "h": 256,
        "anchorX": 1408,
        "anchorY": 128
      },
      {
        "x": 0,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 128,
        "anchorY": 384
      },
      {
        "x": 256,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 384,
        "anchorY": 384
      },
      {
        "x": 512,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 640,
        "anchorY": 384
      },
      {
        "x": 768,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 896,
        "anchorY": 384
      },
      {
        "x": 1024,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 1152,
        "anchorY": 384
      },
      {
        "x": 1280,
        "y": 256,
        "w": 256,
        "h": 256,
        "anchorX": 1408,
        "anchorY": 384
      },
      {
        "x": 0,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 128,
        "anchorY": 640
      },
      {
        "x": 256,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 384,
        "anchorY": 640
      },
      {
        "x": 512,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 640,
        "anchorY": 640
      },
      {
        "x": 768,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 896,
        "anchorY": 640
      },
      {
        "x": 1024,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 1152,
        "anchorY": 640
      },
      {
        "x": 1280,
        "y": 512,
        "w": 256,
        "h": 256,
        "anchorX": 1408,
        "anchorY": 640
      },
      {
        "x": 0,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 128,
        "anchorY": 896
      },
      {
        "x": 256,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 384,
        "anchorY": 896
      },
      {
        "x": 512,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 640,
        "anchorY": 896
      },
      {
        "x": 768,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 896,
        "anchorY": 896
      },
      {
        "x": 1024,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 1152,
        "anchorY": 896
      },
      {
        "x": 1280,
        "y": 768,
        "w": 256,
        "h": 256,
        "anchorX": 1408,
        "anchorY": 896
      }
    ],
    "sheetWidth": 1536,
    "sheetHeight": 1024
  }
};
export const AUTO_CHESS_ITEM_ART_V39:Record<string,AutoChessItemArtV39>={
  "blade": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 0,
      "y": 0,
      "w": 280,
      "h": 280,
      "anchorX": 140,
      "anchorY": 140
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "orb": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 280,
      "y": 0,
      "w": 281,
      "h": 280,
      "anchorX": 420.5,
      "anchorY": 140
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "cloak": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 561,
      "y": 0,
      "w": 280,
      "h": 280,
      "anchorX": 701,
      "anchorY": 140
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "core": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 841,
      "y": 0,
      "w": 281,
      "h": 280,
      "anchorX": 981.5,
      "anchorY": 140
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "sigil": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 0,
      "y": 280,
      "w": 280,
      "h": 265,
      "anchorX": 140,
      "anchorY": 412.5
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "blade-blade": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 280,
      "y": 280,
      "w": 281,
      "h": 265,
      "anchorX": 420.5,
      "anchorY": 412.5
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "blade-orb": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 561,
      "y": 280,
      "w": 280,
      "h": 265,
      "anchorX": 701,
      "anchorY": 412.5
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "blade-cloak": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 841,
      "y": 280,
      "w": 281,
      "h": 265,
      "anchorX": 981.5,
      "anchorY": 412.5
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "blade-core": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 0,
      "y": 545,
      "w": 280,
      "h": 265,
      "anchorX": 140,
      "anchorY": 677.5
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "blade-sigil": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 280,
      "y": 545,
      "w": 281,
      "h": 265,
      "anchorX": 420.5,
      "anchorY": 677.5
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "orb-orb": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 561,
      "y": 545,
      "w": 280,
      "h": 265,
      "anchorX": 701,
      "anchorY": 677.5
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "orb-cloak": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 841,
      "y": 545,
      "w": 281,
      "h": 265,
      "anchorX": 981.5,
      "anchorY": 677.5
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "orb-core": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 0,
      "y": 810,
      "w": 280,
      "h": 272,
      "anchorX": 140,
      "anchorY": 946
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "orb-sigil": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 280,
      "y": 810,
      "w": 281,
      "h": 272,
      "anchorX": 420.5,
      "anchorY": 946
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "cloak-cloak": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 561,
      "y": 810,
      "w": 280,
      "h": 272,
      "anchorX": 701,
      "anchorY": 946
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "cloak-core": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 841,
      "y": 810,
      "w": 281,
      "h": 272,
      "anchorX": 981.5,
      "anchorY": 946
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "cloak-sigil": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 0,
      "y": 1082,
      "w": 280,
      "h": 320,
      "anchorX": 140,
      "anchorY": 1242
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "core-core": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 280,
      "y": 1082,
      "w": 281,
      "h": 320,
      "anchorX": 420.5,
      "anchorY": 1242
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "core-sigil": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 561,
      "y": 1082,
      "w": 280,
      "h": 320,
      "anchorX": 701,
      "anchorY": 1242
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  },
  "sigil-sigil": {
    "src": "/assets/v39/autochess/items-and-fx/items.png",
    "crop": {
      "x": 841,
      "y": 1082,
      "w": 281,
      "h": 320,
      "anchorX": 981.5,
      "anchorY": 1242
    },
    "sheetWidth": 1122,
    "sheetHeight": 1402
  }
};
