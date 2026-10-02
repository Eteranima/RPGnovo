type Vital = {id:string;hp:number;maxHp:number};

/**
 * IN AETERNUM VIVE: identify living allies with the lowest current HP ratio.
 * A tied group is healed together; Carmilla pays 15% of their combined missing HP.
 * This only plans the transfer so the battle engine can apply both sides at impact.
 */
export function planInAeternumVive(party:readonly Vital[]){
 const candidates=party.filter(h=>h.id!=='carmilla'&&h.hp>0&&h.hp<h.maxHp&&h.maxHp>0);
 if(!candidates.length)return {targets:[] as {id:string;heal:number}[],selfDamage:0};
 const lowest=candidates.reduce((a,b)=>b.hp*a.maxHp<a.hp*b.maxHp?b:a);
 const targets=candidates.filter(h=>h.hp*lowest.maxHp===lowest.hp*h.maxHp).map(h=>({id:h.id,heal:h.maxHp-h.hp}));
 return {targets,selfDamage:Math.ceil(targets.reduce((sum,h)=>sum+h.heal,0)*.15)};
}
