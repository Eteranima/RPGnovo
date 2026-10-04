import type { HeroId } from '../game/data';

export type CompanionId = 'mika' | 'shin' | 'umbra' | 'vajra' | 'dante';
export type CompanionArt = { name: string; face: string; fullbody: string; description: string };

/** Canonical companions from the approved v30 opening illustrations. */
export const COMPANION_ART_V31: Record<CompanionId, CompanionArt> = {
  mika: { name: 'Mika', face: '/assets/v31/companions/mika/face.png', fullbody: '/assets/v31/companions/mika/fullbody.png', description: 'Cabelos loiros, óculos e casaco azul de inverno.' },
  shin: { name: 'Shin', face: '/assets/v31/companions/shin/face.png', fullbody: '/assets/v31/companions/shin/fullbody.png', description: 'Cabelos brancos iridescentes, quimono de tinta e pincel.' },
  umbra: { name: 'Umbra', face: '/assets/v31/companions/umbra/face.png', fullbody: '/assets/v31/companions/umbra/fullbody.png', description: 'Cabelos escuros e traje vermelho e dourado.' },
  vajra: { name: 'Vajra', face: '/assets/v31/companions/vajra/face.png', fullbody: '/assets/v31/companions/vajra/fullbody.png', description: 'Cabelos loiros e negros e traje elétrico preto e dourado.' },
  dante: { name: 'Dante', face: '/assets/v31/companions/dante/face.png', fullbody: '/assets/v31/companions/dante/fullbody.png', description: 'Fênix de penas vermelhas e douradas.' },
};

export const HERO_COMPANION_V31: Partial<Record<HeroId, CompanionId>> = {
  seiji: 'shin', ophelia: 'mika', marin: 'umbra', gabriel: 'dante', max: 'vajra',
};

export function companionForHero(heroId: HeroId): CompanionArt | undefined {
  const id = HERO_COMPANION_V31[heroId];
  return id ? COMPANION_ART_V31[id] : undefined;
}
