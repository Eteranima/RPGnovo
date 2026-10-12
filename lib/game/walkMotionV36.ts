/** One complete left/right stride follows real world distance, including running. */
export const WALK_STRIDE_TILES_V36=2.25;
export function walkCycleV36(distance:number|undefined,moving:boolean){
 if(distance===undefined)return undefined;
 const phase=(Math.max(0,Number.isFinite(distance)?distance:0)%WALK_STRIDE_TILES_V36)/WALK_STRIDE_TILES_V36;
 return {phase,bob:moving?Math.sin(phase*Math.PI*4)*.6:0};
}
