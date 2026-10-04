import {PLAYABLE_HERO_IDS,type HeroId} from './data';
import {deriveHeroes,gearById,level,setCount,spellBonus,SETS,SLOTS,type Progression,type SetId} from './progression';

export type EquipmentPreviewV32={allowed:boolean;reason:string;currentId?:string;transferFrom?:HeroId;delta:{hp:number;mp:number;atk:number;spell:number};sets:{id:SetId;before:number;after:number;gained:(3|6)[];lost:(3|6)[]}[]};

/** Uses the same derivation and transfer rules as equip(), without mutating the save. */
export function equipmentPreviewV32(p:Progression,hero:HeroId,id:string):EquipmentPreviewV32{
 const item=gearById(id),empty:EquipmentPreviewV32={allowed:false,reason:'Item indisponível',delta:{hp:0,mp:0,atk:0,spell:0},sets:[]};
 if(!item||!p.owned.includes(id)||!PLAYABLE_HERO_IDS.includes(hero))return empty;
 const currentId=p.equipment[hero][item.slot];
 if(currentId===id)return {...empty,currentId,reason:'Equipado'};
 if(item.hero&&item.hero!==hero)return {...empty,currentId,reason:'Exclusivo de outro personagem'};
 if((item.minLevel||1)>level(p))return {...empty,currentId,reason:`Requer nível ${item.minLevel}`};
 const equipment=Object.fromEntries(PLAYABLE_HERO_IDS.map(h=>[h,{...p.equipment[h]}])) as Progression['equipment'];
 let transferFrom:HeroId|undefined;
 for(const h of PLAYABLE_HERO_IDS)for(const slot of SLOTS){if(equipment[h][slot]===id){if(h!==hero)transferFrom=h;delete equipment[h][slot];}}
 equipment[hero][item.slot]=id;
 const next={...p,equipment},before=deriveHeroes({...p,party:[hero]})[0],after=deriveHeroes({...next,party:[hero]})[0];
 const sets=(Object.keys(SETS) as SetId[]).map(set=>{const a=setCount(p,hero,set),b=setCount(next,hero,set),thresholds=[3,6] as const;return {id:set,before:a,after:b,gained:thresholds.filter(n=>a<n&&b>=n),lost:thresholds.filter(n=>a>=n&&b<n)};}).filter(set=>set.before!==set.after);
 return {allowed:true,reason:'',currentId,transferFrom,delta:{hp:after.maxHp-before.maxHp,mp:after.maxMp-before.maxMp,atk:after.atk-before.atk,spell:spellBonus(next,hero)-spellBonus(p,hero)},sets};
}

export function equipmentSearchV32(value:string){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();}
