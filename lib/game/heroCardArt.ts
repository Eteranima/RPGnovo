import type { HeroId } from './data';

/** Abel has artwork and a summon entry, but is not a playable HeroId. */
export type HeroCardId = HeroId | 'abel';
export type CardAperture = { left: number; top: number; width: number; height: number };
export type HeroCardArtwork = {
  frame: string;
  ring: string;
  hp: string;
  mp: string;
  portraitAperture: CardAperture;
  hpAperture: CardAperture;
  mpAperture: CardAperture;
  portraitCenter?: { left: number; top: number };
  trackAboveFrame?: boolean;
};

const kit = (id: HeroCardId): HeroCardArtwork => {
  const root = `/assets/v27/cards/${id}`;
  return {
    frame: `${root}/card-frame.png`,
    ring: `${root}/portrait-ring.png`,
    hp: `${root}/hp-vessel.png`,
    mp: `${root}/mp-vessel.png`,
    portraitAperture: { left: 17, top: 17, width: 66, height: 66 },
    hpAperture: { left: 20, top: 41, width: 71, height: 20 },
    mpAperture: { left: 20, top: 41, width: 71, height: 20 },
  };
};

export const HERO_CARD_ART: Record<HeroCardId, HeroCardArtwork> = {
  ava: {
    ...kit('ava'),
    trackAboveFrame: true,
    portraitAperture: { left: 19.522, top: 15.936, width: 63.944, height: 62.948 },
    hpAperture: { left: 20.642, top: 40.323, width: 68.578, height: 26.882 },
    mpAperture: { left: 20.914, top: 41.327, width: 68.343, height: 27.041 },
  },
  seiji: {
    ...kit('seiji'),
    portraitAperture: { left: 19.007, top: 17.790, width: 60.861, height: 55.993 },
    hpAperture: { left: 19.916, top: 40.265, width: 69.020, height: 25.221 },
    mpAperture: { left: 19.916, top: 40.517, width: 68.809, height: 24.138 },
  },
  ophelia: {
    ...kit('ophelia'),
    portraitAperture: { left: 20.126, top: 20.578, width: 60.650, height: 59.386 },
    hpAperture: { left: 17.508, top: 38.158, width: 66.838, height: 29.386 },
    mpAperture: { left: 17.508, top: 36.726, width: 66.838, height: 29.646 },
  },
  gabriel: {
    ...kit('gabriel'),
    portraitAperture: { left: 18.632, top: 23.158, width: 62.737, height: 57.263 },
    hpAperture: { left: 19.813, top: 37.306, width: 70.436, height: 24.352 },
    mpAperture: { left: 19.793, top: 37.755, width: 70.466, height: 23.469 },
  },
  marin: {
    ...kit('marin'),
    portraitAperture: { left: 18.040, top: 16.927, width: 64.143, height: 60.134 },
    hpAperture: { left: 18.071, top: 40.984, width: 72.690, height: 25.683 },
    mpAperture: { left: 18.256, top: 41.579, width: 72.515, height: 25.263 },
    portraitCenter: { left: 15.939, top: 52.641 },
  },
  max: {
    ...kit('max'),
    portraitAperture: { left: 21.256, top: 21.014, width: 57.488, height: 56.522 },
    hpAperture: { left: 17.857, top: 37.705, width: 72.835, height: 28.415 },
    mpAperture: { left: 18.035, top: 36.957, width: 72.678, height: 27.717 },
  },
  carmilla: {
    ...kit('carmilla'),
    portraitCenter: { left: 14.058, top: 46.732 },
    portraitAperture: { left: 19.700, top: 14.200, width: 60.400, height: 58.200 },
    hpAperture: { left: 14.792, top: 30.481, width: 74.167, height: 27.273 },
    mpAperture: { left: 14.792, top: 31.183, width: 74.271, height: 27.957 },
  },
  beatriz: {
    ...kit('beatriz'),
    portraitCenter: { left: 16.690, top: 48.301 },
    portraitAperture: { left: 20.301, top: 15.038, width: 59.774, height: 57.895 },
    hpAperture: { left: 15.569, top: 27.869, width: 74.295, height: 43.169 },
    mpAperture: { left: 15.481, top: 28.415, width: 74.477, height: 42.623 },
  },
  abel: {
    ...kit('abel'),
    portraitCenter: { left: 15.268, top: 50.722 },
    portraitAperture: { left: 20.833, top: 25.969, width: 58.527, height: 54.264 },
    hpAperture: { left: 16.547, top: 41.489, width: 74.157, height: 34.574 },
    mpAperture: { left: 16.547, top: 41.711, width: 74.259, height: 34.759 },
  },
  orfeu: {
    ...kit('orfeu'),
    portraitCenter: { left: 13.828, top: 50.607 },
    portraitAperture: { left: 21.857, top: 24.758, width: 56.093, height: 52.998 },
    hpAperture: { left: 19.400, top: 32.743, width: 66.200, height: 27.876 },
    mpAperture: { left: 19.400, top: 32.444, width: 66.100, height: 28.444 },
  },
};

export function isHeroCardId(id: string): id is HeroCardId {
  return Object.prototype.hasOwnProperty.call(HERO_CARD_ART, id);
}
