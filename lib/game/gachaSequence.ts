export type GachaTier=1|2|3|4|5;
export const gachaTier=(rank:number):GachaTier=>Math.max(1,Math.min(5,Math.trunc(rank))) as GachaTier;
export const GACHA_COLORS=['#ccdce6','#98e0b7','#80caff','#c2a0ff','#f5d18c'] as const;
export const GACHA_SEQUENCE_DURATIONS=[2800,3200,3800,4800,6800] as const;
export const gachaSequenceDuration=(rank:number)=>GACHA_SEQUENCE_DURATIONS[gachaTier(rank)-1];
/** First maximum wins ties, keeping cinematic, featured result and focus in agreement. */
export function highestAward<T>(results:readonly T[],rankOf:(result:T)=>number){return results.reduce<T|undefined>((best,result)=>best===undefined||rankOf(result)>rankOf(best)?result:best,undefined);}
/** Deterministic reveal timing follows the awarded rarity, never changes the draw. */
export function gachaSequencePhase(rank:number,elapsed:number){const tier=gachaTier(rank),duration=gachaSequenceDuration(tier),t=Math.max(0,Math.min(1,elapsed/duration));return {tier,duration,t,frame:Math.min(tier===5?15:7,Math.floor(t*(tier===5?16:8))),beat:t<.2?'awakening':t<.5?'opening':t<.8?'convergence':'reveal'} as const;}
