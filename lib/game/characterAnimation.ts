import type {HeroId} from './data';
export const REMADE_HERO_IDS:readonly HeroId[]=['seiji','ophelia','marin','gabriel','max','beatriz','carmilla'];
export const isRemadeHero=(id:string):id is HeroId=>REMADE_HERO_IDS.includes(id as HeroId);

/** Measured generated poses hold the anticipation and strike instead of equal time slices. */
export function characterPoseFrame(hero:string,action:string,time:number,count:number){
 const t=Math.max(0,Math.min(1,time));
 if(!isRemadeHero(hero))return Math.min(count-1,Math.floor(t*count));
 const timing=action==='ultimate'?[0,.08,.19,.34,.48,.62,.80,.94]:action==='attack'?[0,.14,.27,.43,.68,.88]:[0,.16,.32,.52,.72,.91];
 if(count!==timing.length)return Math.min(count-1,Math.floor(t*count));
 return timing.reduce((frame,start,index)=>t>=start?index:frame,0);
}
export function skillMotifIndex(action:string){
 if(action==='ultimate')return 5;
 if(action==='attack')return 0;
 if(action==='crimson-suture')return 1;
 if(action==='return-stitch')return 2;
 if(['kanji-interdict','frost-sanctuary','umbra-hunt','lycan-oath','nail-conduction','abyss-countertide','in-aeternum-vive'].includes(action))return 4;
 if(['stain','mend','drain','bulwark','stormguard','margem','cleanse','rekindle','shadowrest'].includes(action))return 2;
 if(['blind','bleed','freeze','arc','darkveil','flamewall','nightseal','ashseal','umbra-seal'].includes(action))return 3;
 return 1;
}
export function characterEffectMotif(action:string){return skillMotifIndex(action);}
export function characterCamera(hero:string,beat:string,t:number,reduced:boolean){
 if(reduced)return {x:.5,zoom:1,alpha:1};
 if(!isRemadeHero(hero))return {x:beat==='release'?.42+t*.25:.5,zoom:1,alpha:1};
 const release=Math.max(0,Math.min(1,(t-.36)/.32));
 if(hero==='marin')return {x:.47+release*.10,zoom:1,alpha:beat==='charge'?.82:1};
 if(hero==='seiji')return {x:.48+release*.07,zoom:1+Math.sin(release*Math.PI)*.035,alpha:1};
 if(hero==='max')return {x:.5,zoom:beat==='release'?1.035:1,alpha:1};
 if(hero==='gabriel')return {x:.46+release*.08,zoom:1+release*.04,alpha:1};
 return {x:.5,zoom:1+Math.sin(release*Math.PI)*.025,alpha:1};
}
