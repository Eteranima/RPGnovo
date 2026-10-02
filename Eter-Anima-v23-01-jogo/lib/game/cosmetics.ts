import type {HeroId} from './data';
export const RARITIES=[{id:'common',name:'Comum',weight:55,color:'#b9cdd2'},{id:'uncommon',name:'Incomum',weight:25,color:'#a5dbb5'},{id:'rare',name:'Raro',weight:13,color:'#9bcdf4'},{id:'epic',name:'Épico',weight:6,color:'#caa1f5'},{id:'legendary',name:'Lendário',weight:1,color:'#f1d397'}] as const;
export type CosmeticEffect='hp'|'mp'|'attack'|'magic'|'defense'|'heal'|'guard'|'echo'|'speed'|'drain';
const FAMILIES:{id:string;name:string;effect:CosmeticEffect;icon:number;color:string}[]=[
 {id:'jade',name:'Jade',effect:'hp',icon:10,color:'#97e7b1'},
 {id:'azul',name:'Éter Azul',effect:'mp',icon:5,color:'#79cce5'},
 {id:'nanquim',name:'Nanquim',effect:'attack',icon:8,color:'#b6a4de'},
 {id:'geada',name:'Geada',effect:'magic',icon:2,color:'#a8ebff'},
 {id:'ambar',name:'Âmbar',effect:'defense',icon:9,color:'#e9bf80'},
 {id:'orvalho',name:'Orvalho',effect:'heal',icon:3,color:'#9ce5d4'},
 {id:'vigilia',name:'Vigília',effect:'guard',icon:13,color:'#e8d7a3'},
 {id:'memoria',name:'Memória',effect:'echo',icon:15,color:'#cbb2f5'},
 {id:'vento',name:'Vento',effect:'speed',icon:12,color:'#b3e4cc'},
 {id:'estrela',name:'Estrela',effect:'drain',icon:14,color:'#efb5cc'}
];
export type Cosmetic={id:string;name:string;rank:number;rarity:typeof RARITIES[number];effect:CosmeticEffect;icon:number;color:string;description:string;craftCost:number};
const descriptions=(effect:CosmeticEffect,rank:number)=>({hp:`+${rank*3} HP máximos.`,mp:`+${rank*2} MP máximos.`,attack:`+${rank} força.`,magic:`+${rank} dano de magia.`,defense:`Reduz o dano de cada golpe recebido em ${rank} (mínimo 1).`,heal:`Magias de cura restauram +${rank*2} HP.`,guard:`Guardar recupera ${3+rank} MP, em vez de 3.`,echo:`Recupera ${rank*2} MP ao entrar em batalha.`,speed:`+${Math.ceil(rank/2)} velocidade; altera a ordem de ação.`,drain:`Ataques físicos que acertam recuperam ${rank} HP.`}[effect]);
export const COSMETICS:Cosmetic[]=FAMILIES.flatMap(f=>RARITIES.map((rarity,i)=>({id:`${f.id}-${i+1}`,name:`${['Brisa','Halo','Coroa','Rastro','Constelação'][i]} de ${f.name}`,rank:i+1,rarity,effect:f.effect,icon:f.icon,color:f.color,description:descriptions(f.effect,i+1),craftCost:(i+1)*8})));
export const cosmeticById=(id?:string|null)=>COSMETICS.find(c=>c.id===id);
export type CosmeticProgress={cosmeticEquipment:Record<HeroId,string|undefined>};
export const cosmeticOf=(p:CosmeticProgress,id:HeroId)=>cosmeticById(p.cosmeticEquipment[id]);
export const cosmeticRank=(p:CosmeticProgress,id:HeroId,effect:CosmeticEffect)=>{const c=cosmeticOf(p,id);return c?.effect===effect?c.rank:0;};
/** Every item has a nonzero chance. The tenth draw since an epic guarantees epic or legendary. */
export function chooseCosmetic(pity:number,random= Math.random):Cosmetic{
 const roll=Math.min(.999999,Math.max(0,random()))*100;
 let tier=0,sum=0;for(let i=0;i<RARITIES.length;i++){sum+=RARITIES[i].weight;if(roll<sum){tier=i;break;}}
 if(pity>=9)tier=roll<94?3:4;
 const family=Math.min(9,Math.floor(Math.min(.999999,Math.max(0,random()))*10));
 return COSMETICS[family*5+tier];
}
