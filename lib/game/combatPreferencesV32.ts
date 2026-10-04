export type BattleSpeedV32=1|2;
export const COMBAT_PREFERENCES_KEY_V32='eter-anima-combat-preferences-v32';
export function parseBattleSpeedV32(raw:string|null):BattleSpeedV32{
 try{return JSON.parse(raw||'null')?.battleSpeed===2?2:1;}catch{return 1;}
}
export function battleTimingV32(baseDuration:number,speed:BattleSpeedV32,ultimate:boolean){
 const base=Number.isFinite(baseDuration)?baseDuration:1200,factor=speed===2?2:1;
 const duration=Math.max(1,Math.round(base/factor));
 return {duration,impactAt:Math.max(0,Math.min(duration,Math.round(duration*(ultimate?.68:.55))))};
}
