import type {CombatElement,Entity,MapData,MapId,Prop} from './data';

export type ExpansionMapIdV30='jardim-lunar'|'observatorio';
export type NewEnemyFamilyV30='lunastag'|'runewarden'|'astral';
export type EnemyFamilyV30='lobo'|'sombra'|'selo'|'eco'|'ashwolf'|'moth'|'cinder'|NewEnemyFamilyV30;
export type ExpansionEntityV30=Omit<Entity,'to'|'family'>&{to?:MapId|ExpansionMapIdV30;family?:EnemyFamilyV30};
export type ExpansionMapV30=Omit<MapData,'id'|'entities'>&{id:ExpansionMapIdV30;entities:ExpansionEntityV30[]};

const grid=(w:number,h:number,base:string)=>Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>!x||!y||x===w-1||y===h-1?'#':base));
const fill=(g:string[][],x:number,y:number,w:number,h:number,t:string)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)g[j][i]=t;};
const lunar=grid(32,24,'g');
fill(lunar,14,2,4,20,'p');fill(lunar,2,11,28,3,'p');fill(lunar,3,4,6,4,'w');fill(lunar,22,16,6,3,'w');fill(lunar,4,17,5,3,'p');
const tower=grid(26,23,'d');
fill(tower,7,5,2,4,'#');fill(tower,17,14,2,4,'#');fill(tower,11,2,4,2,'#');fill(tower,3,3,4,2,'w');fill(tower,20,15,3,2,'w');
fill(tower,2,10,22,3,'p');fill(tower,11,5,4,16,'p');
const art=(index:number,x:number,y:number,w:number,h:number,solid?:Prop['solid']):Prop=>({x,y,w,h,asset:'v30_world_props',atlasSheet:'v30_world_props',atlas:index,...(solid?{solid}:{})});
export const EXPANSION_MAPS_V30:Record<ExpansionMapIdV30,ExpansionMapV30>={
 'jardim-lunar':{id:'jardim-lunar',name:'Jardim Lunar',subtitle:'As sementes que guardaram a luz do selo',safe:false,width:32,height:24,rows:lunar.map(row=>row.join('')),entities:[
  {id:'lunar-domo',label:'Voltar ao Domo de Herbologia',kind:'warp',x:15.5,y:21,to:'domo',spawn:{x:20.5,y:12}},
  {id:'lunar-observatorio',label:'Subir ao Observatório Partido',kind:'warp',x:28,y:12,to:'observatorio',spawn:{x:3.5,y:11}},
  {id:'lunar-cristal',label:'Cristal da Lua',kind:'save',x:15.5,y:14.5},
  {id:'lunar-loja',label:'Acampamento da Lua',kind:'shop',x:11,y:14},
  {id:'lunar-bau',label:'Baú das sementes prateadas',kind:'chest',x:6,y:18.5},
  {id:'lunar-placa',label:'Registro das sementes',kind:'sign',x:20,y:10,text:'Quando o selo se partiu, a geada antiga encontrou estas sementes. O observatório acima do jardim ainda guarda a primeira órbita de Stone Reach.'},
  {id:'lunastag-oeste',label:'Cervo da Geada Lunar',kind:'mob',x:6,y:12,asset:'lunastag',family:'lunastag',hp:260,damage:22,xp:62,credits:100},
  {id:'lunastag-leste',label:'Cervo Lunar · margem prateada',kind:'mob',x:24,y:12,asset:'lunastag',family:'lunastag',hp:280,damage:23,xp:66,credits:108},
  {id:'runewarden-jardim',label:'Vigia Rúnico · semente selada',kind:'mob',x:19,y:19,asset:'runewarden',family:'runewarden',hp:290,damage:25,xp:70,credits:120},
 ],props:[art(0,4,11,3.3,5,[3.7,10.7,.6,.6]),art(0,10.5,5,3.5,5,[10.2,4.7,.6,.6]),art(1,26,6,3.4,5,[25.7,5.7,.6,.6]),art(1,27,21,3.3,4.8,[26.7,20.7,.6,.6]),art(2,15.5,8,4.1,3.4),art(3,21,14.5,3,1.8),art(3,10,19.5,2.8,1.7),{x:15.5,y:14.5,asset:'crystal',atlas:4,w:1.8,h:2.4},{x:11,y:14,asset:'expedition',atlasSheet:'expedition',atlas:1,w:3.6,h:3.6},art(7,18.5,4.5,1.5,3),art(7,12,16,1.5,3)]},
 observatorio:{id:'observatorio',name:'Observatório Partido',subtitle:'A primeira órbita não esqueceu Stone Reach',safe:false,width:26,height:23,rows:tower.map(row=>row.join('')),entities:[
  {id:'observatorio-jardim',label:'Descer ao Jardim Lunar',kind:'warp',x:2,y:11,to:'jardim-lunar',spawn:{x:27,y:12}},
  {id:'observatorio-vigilia',label:'Voltar às Ruínas da Vigília',kind:'warp',x:23,y:20,to:'vigilia',spawn:{x:22,y:8}},
  {id:'observatorio-cristal',label:'Cristal da Órbita',kind:'save',x:5,y:18},
  {id:'observatorio-bau',label:'Relicário dos astrônomos',kind:'chest',x:21,y:5},
  {id:'observatorio-registro',label:'A primeira órbita',kind:'sign',x:11,y:15,text:'O astrolábio lia o céu para manter o selo estável. Seu guardião não recebeu a notícia de que a Academia foi salva. Prepare o grupo: a terceira órbita ainda responde com trovões.'},
  {id:'runewarden-norte',label:'Vigia Rúnico · mapa celeste',kind:'mob',x:19,y:11,asset:'runewarden',family:'runewarden',hp:315,damage:26,xp:76,credits:130},
  {id:'runewarden-oeste',label:'Vigia Rúnico · ala do poente',kind:'mob',x:6,y:11,asset:'runewarden',family:'runewarden',hp:290,damage:25,xp:70,credits:120},
  {id:'lunastag-orbita',label:'Cervo Lunar · órbita esquecida',kind:'mob',x:13,y:18,asset:'lunastag',family:'lunastag',hp:290,damage:24,xp:70,credits:116},
  {id:'astrolabio',label:'Guardião do Astrolábio',kind:'boss',x:13,y:7,asset:'astral',family:'astral',hp:680,damage:27,xp:260,credits:520},
 ],props:[art(4,13,4.5,6.2,6.4,[11,2.7,4,1.3]),art(5,7.5,9,2.5,4,[7.1,8.7,.8,.6]),art(5,17.5,18,2.5,4,[17.1,17.7,.8,.6]),art(6,20,8,3.5,3.4,[19.4,7.7,1.2,.6]),art(6,8.5,18.5,3.3,3),art(7,5,7,1.6,3),art(7,21,13,1.6,3),{x:5,y:18,asset:'crystal',atlas:4,w:1.8,h:2.4}]},
};
/** Optional branches unlock after the existing report to Beatriz; old gateways and campaign IDs stay intact. */
export const EXPANSION_GATEWAYS_V30:{map:MapId;entity:ExpansionEntityV30}[]=[
 {map:'domo',entity:{id:'porta-jardim-lunar',label:'Seguir ao Jardim Lunar',kind:'warp',x:21,y:12,to:'jardim-lunar',spawn:{x:15.5,y:20},minStage:5}},
 {map:'vigilia',entity:{id:'porta-observatorio',label:'Subir ao Observatório Partido',kind:'warp',x:23,y:8,to:'observatorio',spawn:{x:22,y:20},minStage:5}},
];
export const ENEMY_ULTIMATES_V30:Record<EnemyFamilyV30,{name:string;area:boolean;multiplier:number;status:'bleed'|'blind'|'freeze'|'silence';element:CombatElement}>={
 lobo:{name:'Caçada da Alvorada',area:false,multiplier:1.65,status:'bleed',element:'dark'},
 sombra:{name:'Maré da Cegueira',area:true,multiplier:1.2,status:'blind',element:'dark'},
 ashwolf:{name:'Uivo da Cinza',area:true,multiplier:1.3,status:'bleed',element:'fire'},
 moth:{name:'Eclipse Lunar',area:true,multiplier:1.15,status:'freeze',element:'ice'},
 selo:{name:'Memória Estilhaçada',area:true,multiplier:1.5,status:'silence',element:'ink'},
 eco:{name:'Véu Sem Retorno',area:true,multiplier:1.5,status:'blind',element:'dark'},
 cinder:{name:'Sol da Pira',area:true,multiplier:1.6,status:'silence',element:'fire'},
 lunastag:{name:'Coroa da Geada Lunar',area:false,multiplier:1.55,status:'freeze',element:'ice'},
 runewarden:{name:'Édito da Página Vazia',area:true,multiplier:1.3,status:'silence',element:'ink'},
 astral:{name:'Convergência das Três Órbitas',area:true,multiplier:1.65,status:'blind',element:'lightning'},
};
export const NEW_BESTIARY_V30=[
 {id:'lunastag',name:'Cervo da Geada Lunar',asset:'lunastag',hp:260,description:'Cervos de pelo prateado guardam as sementes do Domo. Sua coroa de gelo anuncia uma investida congelante.',set:'lunar' as const},
 {id:'runewarden',name:'Vigia Rúnico',asset:'runewarden',hp:290,description:'Sentinela de cerâmica marfim e tinta azul, ainda ligada às páginas do observatório. Seu édito silencia o grupo.',set:'veil' as const},
 {id:'astral',name:'Guardião do Astrolábio',asset:'astral',hp:680,description:'Guardião opcional do Observatório Partido. Três órbitas despertam novas fases; sua convergência elétrica cobre todo o grupo.'},
];
export const NEW_ANCHORS_V30=[{id:'lunar',name:'Marco da Lua',map:'jardim-lunar' as const,entityId:'lunar-cristal',position:{x:15.5,y:14.5}},{id:'orbita',name:'Marco da Órbita',map:'observatorio' as const,entityId:'observatorio-cristal',position:{x:5,y:18}}];
export const NEW_BOSS_REWARDS_V30={astral:{gear:'relic-orbit',tokens:5}};
export const NEW_GEAR_V30=[{id:'relic-orbit',name:'Coração das Três Órbitas',slot:'charm' as const,icon:13,hp:14,mp:12,atk:3,spell:6}];
export const EXPANSION_BATTLE_BACKGROUNDS_V30={'jardim-lunar':'battle_bg_lunar',observatorio:'battle_bg_observatory'} as const;
const surface=(row:number,span=4)=>({sheet:'env_floor_v30',row,span});
export const EXPANSION_ENVIRONMENT_THEMES_V30={
 'jardim-lunar':{floor:{g:surface(0,5),p:surface(1,5),d:surface(1,5),w:{sheet:'env_floor_water',row:1,span:6},b:{sheet:'env_floor_water',row:2,span:3},i:{sheet:'env_floor_water',row:3,span:3},'#':surface(0,5)},boundary:1,edge:'#bdcadc',atmosphere:['#7893d405','#182e5717'] as [string,string],particle:'#d2e3fa'},
 observatorio:{floor:{g:surface(0,5),p:surface(3,5),d:surface(2,5),w:{sheet:'env_floor_water',row:1,span:6},b:{sheet:'env_floor_water',row:2,span:3},i:{sheet:'env_floor_water',row:3,span:3},'#':surface(2,5)},boundary:0,edge:'#b7bdd5',atmosphere:['#90a6e008','#1c234719'] as [string,string],particle:'#e6dbb1'},
};
