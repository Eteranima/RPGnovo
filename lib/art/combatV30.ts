import type {SpriteCrop} from '../game/sprites';

// v30 original native combat sprites; prompts and measurements: art-source/v30/combat.
export const COMBAT_V30_ASSETS:Record<string,string>={
  "turn_active": "/assets/v30/combat/turn_active.png",
  "turn_waiting": "/assets/v30/combat/turn_waiting.png",
  "turn_enemy": "/assets/v30/combat/turn_enemy.png",
  "victory_emblem": "/assets/v30/combat/victory_emblem.png",
  "victory_continue": "/assets/v30/combat/victory_continue.png",
  "victory_celebration": "/assets/v30/combat/victory_celebration.png"
};

export const COMBAT_V30_FRAMES:Record<string,SpriteCrop[]>={
  "turn_active": [
    {
      "x": 0,
      "y": 0,
      "w": 1021,
      "h": 342,
      "anchorX": 510.5,
      "anchorY": 171.0
    }
  ],
  "turn_waiting": [
    {
      "x": 0,
      "y": 0,
      "w": 1017,
      "h": 333,
      "anchorX": 508.5,
      "anchorY": 166.5
    }
  ],
  "turn_enemy": [
    {
      "x": 0,
      "y": 0,
      "w": 1021,
      "h": 339,
      "anchorX": 510.5,
      "anchorY": 169.5
    }
  ],
  "victory_emblem": [
    {
      "x": 0,
      "y": 0,
      "w": 926,
      "h": 995,
      "anchorX": 463.0,
      "anchorY": 497.5
    }
  ],
  "victory_continue": [
    {
      "x": 0,
      "y": 0,
      "w": 1000,
      "h": 300,
      "anchorX": 500.0,
      "anchorY": 150.0
    }
  ],
  "victory_celebration": [
    {
      "x": 128,
      "y": 104,
      "w": 184,
      "h": 235,
      "anchorX": 222.0,
      "anchorY": 222.0
    },
    {
      "x": 478,
      "y": 45,
      "w": 352,
      "h": 363,
      "anchorX": 665.5,
      "anchorY": 222.0
    },
    {
      "x": 944,
      "y": 61,
      "w": 327,
      "h": 337,
      "anchorX": 1108.5,
      "anchorY": 222.0
    },
    {
      "x": 1383,
      "y": 26,
      "w": 329,
      "h": 384,
      "anchorX": 1552.0,
      "anchorY": 222.0
    },
    {
      "x": 24,
      "y": 454,
      "w": 409,
      "h": 388,
      "anchorX": 222.0,
      "anchorY": 665.5
    },
    {
      "x": 487,
      "y": 463,
      "w": 355,
      "h": 372,
      "anchorX": 665.5,
      "anchorY": 665.5
    },
    {
      "x": 936,
      "y": 468,
      "w": 334,
      "h": 370,
      "anchorX": 1108.5,
      "anchorY": 665.5
    },
    {
      "x": 1383,
      "y": 468,
      "w": 330,
      "h": 370,
      "anchorX": 1552.0,
      "anchorY": 665.5
    }
  ]
};
