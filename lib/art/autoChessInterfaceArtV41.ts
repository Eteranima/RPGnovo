import type {SpriteCrop} from '@/lib/game/sprites';

export type AutoChessInterfaceArtV41={src:string;frameSrc:string;sheetWidth:number;sheetHeight:number;crop:SpriteCrop;slice:[number,number,number,number];nativeSlice?:[number,number,number,number];center:'transparent'|'dark';renderStyle:'stylized-3d';safeArea:{x:number;y:number;w:number;h:number}};
// frameSrc wraps native PNG bytes in a measured SVG viewport. slice applies to frameSrc; nativeSlice applies to full PNG src.
export const AUTO_CHESS_INTERFACE_ART_V41:Record<string,AutoChessInterfaceArtV41>={
  "panel": {
    "src": "/assets/v41/autochess/ui/panel-frame.png",
    "frameSrc": "/assets/v41/autochess/ui/panel-frame.svg",
    "sheetWidth": 1024,
    "sheetHeight": 1536,
    "crop": {
      "x": 22,
      "y": 9,
      "w": 981,
      "h": 1475,
      "anchorX": 512.5,
      "anchorY": 746.5
    },
    "slice": [
      206,
      159,
      158,
      158
    ],
    "nativeSlice": [
      215,
      180,
      210,
      180
    ],
    "center": "transparent",
    "renderStyle": "stylized-3d",
    "safeArea": {
      "x": 158,
      "y": 206,
      "w": 664,
      "h": 1111
    }
  },
  "shop": {
    "src": "/assets/v41/autochess/ui/shop-frame.png",
    "frameSrc": "/assets/v41/autochess/ui/shop-frame.svg",
    "sheetWidth": 2172,
    "sheetHeight": 724,
    "crop": {
      "x": 12,
      "y": 66,
      "w": 2148,
      "h": 571,
      "anchorX": 1086,
      "anchorY": 351.5
    },
    "slice": [
      244,
      198,
      163,
      198
    ],
    "nativeSlice": [
      310,
      210,
      250,
      210
    ],
    "center": "dark",
    "renderStyle": "stylized-3d",
    "safeArea": {
      "x": 198,
      "y": 244,
      "w": 1752,
      "h": 164
    }
  },
  "active": {
    "src": "/assets/v41/autochess/ui/active-frame.png",
    "frameSrc": "/assets/v41/autochess/ui/active-frame.svg",
    "sheetWidth": 1024,
    "sheetHeight": 1536,
    "crop": {
      "x": 49,
      "y": 47,
      "w": 926,
      "h": 1426,
      "anchorX": 512,
      "anchorY": 760
    },
    "slice": [
      173,
      141,
      162,
      141
    ],
    "nativeSlice": [
      220,
      190,
      225,
      190
    ],
    "center": "transparent",
    "renderStyle": "stylized-3d",
    "safeArea": {
      "x": 141,
      "y": 173,
      "w": 644,
      "h": 1091
    }
  },
  "buttonQuiet": {
    "src": "/assets/v41/autochess/ui/buttons.png",
    "frameSrc": "/assets/v41/autochess/ui/button-quiet.svg",
    "sheetWidth": 1536,
    "sheetHeight": 1024,
    "crop": {
      "x": 29,
      "y": 92,
      "w": 1477,
      "h": 366,
      "anchorX": 767.5,
      "anchorY": 275
    },
    "slice": [
      135,
      150,
      135,
      150
    ],
    "center": "dark",
    "renderStyle": "stylized-3d",
    "safeArea": {
      "x": 150,
      "y": 135,
      "w": 1177,
      "h": 96
    }
  },
  "buttonActive": {
    "src": "/assets/v41/autochess/ui/buttons.png",
    "frameSrc": "/assets/v41/autochess/ui/button-active.svg",
    "sheetWidth": 1536,
    "sheetHeight": 1024,
    "crop": {
      "x": 29,
      "y": 550,
      "w": 1477,
      "h": 367,
      "anchorX": 767.5,
      "anchorY": 733.5
    },
    "slice": [
      135,
      150,
      135,
      150
    ],
    "center": "dark",
    "renderStyle": "stylized-3d",
    "safeArea": {
      "x": 150,
      "y": 135,
      "w": 1177,
      "h": 97
    }
  }
};
export const AUTO_CHESS_ATMOSPHERE_V41='/assets/v41/autochess/ui/academy-atmosphere.png';
