import { ORIGINS, newHeroes, heroBases, HERO_IDS, SIGNATURE_TECHNIQUES, type BaseHeroId, type HeroId, type Hero, type Point, type MapId } from './data';
import {cosmeticRank} from './cosmetics';
import {NEW_BESTIARY_V30,NEW_BOSS_REWARDS_V30,NEW_GEAR_V30,NEW_ANCHORS_V30} from './expansionV30';
import {freshQuestProgressV31,type QuestProgressV31} from './questRuntimeV31';

export const SLOTS = ['weapon','head','body','hands','feet','charm'] as const;
export type Slot = typeof SLOTS[number];
export const SLOT_NAMES:Record<Slot,string>={weapon:'Arma',head:'Cabeça',body:'Torso',hands:'Mãos',feet:'Pés',charm:'Amuleto'};
export type SetId='wolf'|'veil'|'ember'|'lunar';
export const SETS:Record<SetId,{name:string;three:string;six:string}>={
 wolf:{name:'Vigília do Lobo',three:'Instinto: golpes físicos recuperam 3 MP.',six:'Alcateia: +25% de dano físico; imune a sangramento.'},
 ember:{name:'Guarda Cindária',three:'Brasa viva: guardar concede mais 10 de carga de ultimate.',six:'Forja eterna: recebe 20% menos dano; imune a silêncio.'},
 lunar:{name:'Asas da Lua',three:'Orvalho noturno: magias ofensivas recuperam 4 HP.',six:'Lua plena: +20% de dano mágico e cura; imune a congelamento.'},
 veil:{name:'Véu da Memória',three:'Eco: magias custam 2 MP a menos (mínimo 1).',six:'Memória intacta: +25% de dano mágico e cura; imune a cegueira.'}
};
export type Gear={id:string;set?:SetId;slot:Slot;name:string;icon:number;hp:number;atk:number;mp:number;spell?:number;minLevel?:number;hero?:HeroId};
export const GEAR=Object.fromEntries((['wolf','veil','ember','lunar'] as const).flatMap(set=>SLOTS.map((slot,i)=>{
 const id=`${set}-${slot}`;
 return [id,{id,set,slot,name:`${['Lâmina','Elmo','Manto','Luvas','Botas','Talismã'][i]} ${({wolf:'da Vigília',veil:'da Memória',ember:'da Brasa',lunar:'da Lua'}[set])}`,icon:i+8,hp:[0,6,10,3,4,5][i],atk:[4,0,0,1,1,0][i],mp:[0,2,2,1,1,4][i]}];
}))) as Record<string,Gear>;
export const BOSS_REWARDS:Record<string,{gear:string;tokens:number}>={selo:{gear:'relic-seal',tokens:2},eco:{gear:'relic-echo',tokens:3},cinder:{gear:'relic-forge',tokens:4}};
for(const item of [{id:'relic-seal',name:'Fragmento do Selo',hp:12,mp:6,atk:2,spell:3},{id:'relic-echo',name:'Memória do Último Eco',hp:10,mp:10,atk:2,spell:5},{id:'relic-forge',name:'Coração da Pira',hp:20,mp:4,atk:5,spell:3}])GEAR[item.id]={...item,slot:'charm',icon:13};
Object.assign(BOSS_REWARDS,NEW_BOSS_REWARDS_V30);
for(const gear of NEW_GEAR_V30)GEAR[gear.id]=gear;
export const gearById=(id:string|undefined)=>{if(!id)return undefined;const [base,copy,...extra]=id.split("@");if(extra.length||copy&&(!base.startsWith("shop-")||!Number.isSafeInteger(Number(copy))||Number(copy)<2))return undefined;return GEAR[base];};
export const commonKills=(p:Progression)=>Object.entries(p.kills).reduce((n,[id,count])=>n+(BOSS_REWARDS[id]?0:count),0);
export type Progression={questsV31:QuestProgressV31;masterMode:boolean;starterMailClaimed:boolean;starterSelectorPending:boolean;starterSelected:string|null;gabrielForm:'human'|'lycan';difficulty:1|2|3;fieldUntil:Record<string,number>;unseenGear:string[];unseenCosmetics:string[];protagonist?:HeroId;recruited:HeroId[];party:HeroId[];leaderId?:HeroId;reserveVitals:Partial<Record<HeroId,{hp:number;mp:number}>>;limit:Record<HeroId,number>;xp:number;points:Record<HeroId,number>;learned:string[];owned:string[];equipment:Record<HeroId,Partial<Record<Slot,string>>>;kills:Record<string,number>;bestiaryClaims:string[];questClaims:string[];achievementClaims:string[];field:string[];seen:string[];requests:string[];visited:MapId[];encounters:string[];anchors:string[];events:string[];tokens:number;dust:number;cosmetics:string[];cosmeticEquipment:Record<HeroId,string|undefined>;rolls:number;pity:number;lastDraw:string|null;lastDuplicate:boolean;crystals:number;soulFragments:number;summoned:string[];bonded:string[];constellations:Record<string,number>;characterRolls:number;fourPity:number;fivePity:number;lastSummon:string|null;lastSummonDuplicate:boolean;metrics:{purchases:number;heals:number;statuses:number;set3:boolean;set6:boolean}};
export const freshProgression=():Progression=>({questsV31:freshQuestProgressV31(),masterMode:false,starterMailClaimed:false,starterSelectorPending:false,starterSelected:null,gabrielForm:'human',difficulty:1,fieldUntil:{},unseenGear:[],unseenCosmetics:[],recruited:['seiji','ophelia'],party:['seiji','ophelia'],reserveVitals:{},limit:{seiji:0,ophelia:0,marin:0,gabriel:0,max:0,beatriz:0,orfeu:0,ava:0,carmilla:0},xp:0,points:{seiji:2,ophelia:2,marin:2,gabriel:2,max:2,beatriz:2,orfeu:2,ava:2,carmilla:2},learned:[],owned:[],equipment:{seiji:{},ophelia:{},marin:{},gabriel:{},max:{},beatriz:{},orfeu:{},ava:{},carmilla:{}},kills:{lobo:0,sombra:0,selo:0,eco:0},bestiaryClaims:[],questClaims:[],achievementClaims:[],field:[],seen:[],requests:[],visited:['patio'],encounters:[],anchors:[],events:[],tokens:3,dust:0,cosmetics:[],cosmeticEquipment:{seiji:undefined,ophelia:undefined,marin:undefined,gabriel:undefined,max:undefined,beatriz:undefined,orfeu:undefined,ava:undefined,carmilla:undefined},rolls:0,pity:0,lastDraw:null,lastDuplicate:false,crystals:1600,soulFragments:0,summoned:[],bonded:[],constellations:{},characterRolls:0,fourPity:0,fivePity:0,lastSummon:null,lastSummonDuplicate:false,metrics:{purchases:0,heals:0,statuses:0,set3:false,set6:false}});
export const level=(p:Progression)=>Math.min(10,1+Math.floor(p.xp/60));
export const setCount=(p:Progression,h:HeroId,set:SetId)=>Object.values(p.equipment[h]).filter(id=>id&&gearById(id)?.set===set).length;
export function deriveHeroes(p:Progression,current:Hero[]=newHeroes()):Hero[]{return (p.party||['seiji','ophelia']).map(id=>heroBases().find(h=>h.id===id)!).map(base=>{
 const items=Object.values(p.equipment[base.id]).map(id=>gearById(id)).filter((item):item is Gear=>!!item),old=current.find(h=>h.id===base.id)||{...base,...p.reserveVitals?.[base.id]};
 const lv=level(p)-1,maxHp=base.maxHp+lv*({seiji:9,ophelia:7,marin:8,gabriel:11,max:9,beatriz:8,orfeu:8,ava:9,carmilla:10}[base.id])+items.reduce((n,i)=>n+i.hp,0)+(p.learned.includes(`${base.id}-vital`)?15:0)+cosmeticRank(p,base.id,'hp')*3,maxMp=base.maxMp+lv*({seiji:5,ophelia:8,marin:6,gabriel:4,max:6,beatriz:8,orfeu:9,ava:8,carmilla:7}[base.id])+items.reduce((n,i)=>n+i.mp,0)+cosmeticRank(p,base.id,'mp')*2;
 return {...base,maxHp,maxMp,atk:base.atk+lv*2+items.reduce((n,i)=>n+i.atk,0)+cosmeticRank(p,base.id,'attack'),spd:base.spd+Math.ceil(cosmeticRank(p,base.id,'speed')/2),hp:Math.min(maxHp,Math.max(0,old.hp)),mp:Math.min(maxMp,Math.max(0,old.mp)),guard:old.guard};
});}
export const spellBonus=(p:Progression,id:HeroId)=>(level(p)-1)*2+Object.values(p.equipment[id]).reduce((n,key)=>n+(gearById(key)?.spell||0),0)+cosmeticRank(p,id,'magic');
export const ANCHORS=[
 ...NEW_ANCHORS_V30,
 {id:'academia',name:'Marco da Academia',map:'patio' as MapId,entityId:'cristal',position:{x:20,y:14}},
 {id:'cais',name:'Marco do Cais',map:'porto' as MapId,entityId:'porto-cristal',position:{x:24,y:12}},
 {id:'profundo',name:'Marco Profundo',map:'galeria' as MapId,entityId:'galeria-cristal',position:{x:12,y:12}}
];
export const EVENTS=[
 {id:'orvalho',name:'Flores sob a geada',map:'domo' as MapId,entityId:'evento-orvalho',description:'Acalme o Éter das flores do domo com Passo de Geada.',hero:'ophelia' as HeroId,node:'ophelia-field',cost:5,type:'ice',tokens:3,xp:30,credits:40},
 {id:'carta',name:'Uma carta à deriva',map:'porto' as MapId,entityId:'evento-carta',description:'Use Leitura de Tinta para recuperar uma mensagem nas marcas do cais.',hero:'seiji' as HeroId,node:'seiji-field',cost:4,type:'ink',tokens:2,xp:30,credits:50},
 {id:'fenda',name:'Vigia da fenda',map:'galeria' as MapId,entityId:'evento-fenda',description:'Feche uma fenda na Galeria vencendo a Sombra que a protege.',hero:'seiji' as HeroId,node:'',cost:0,type:'battle',tokens:4,xp:40,credits:55}
];
export type SkillNode={id:string;hero:HeroId;name:string;cost:number;requires?:string;icon:number;description:string};
export const TREE:SkillNode[]=[
 ...(['marin','gabriel'] as HeroId[]).flatMap(hero=>[{id:`${hero}-power`,hero,name:hero==='marin'?'Lâmina da meia-noite':'Calor da forja',cost:1,icon:hero==='marin'?6:0,description:'+8 de dano à magia principal.'},{id:`${hero}-control`,hero,name:hero==='marin'?'Véu Escuro':'Muralha de Chamas',cost:1,requires:`${hero}-power`,icon:6,description:hero==='marin'?'Libera Véu Escuro: 24 dano e cegueira; 10 MP.':'Libera Muralha: 28 dano e enfraquece o próximo golpe; 10 MP.'},{id:`${hero}-master`,hero,name:hero==='marin'?'Hora sem Estrelas':'Guarda da Brasa',cost:2,requires:`${hero}-control`,icon:15,description:'+12 de dano à ultimate.'},{id:`${hero}-vital`,hero,name:'Fôlego da expedição',cost:1,icon:10,description:'+15 HP máximos.'}]),
 {id:'seiji-ink',hero:'seiji',name:'Traço profundo',cost:1,icon:0,description:'Tinta Cortante causa +8 de dano.'},
 {id:'seiji-blind',hero:'seiji',name:'Noite de Tinta',cost:1,requires:'seiji-ink',icon:6,description:'Libera magia: 22 de dano e cegueira por 2 ações. Custo: 10 MP.'},
 {id:'seiji-bleed',hero:'seiji',name:'Rasura',cost:2,requires:'seiji-blind',icon:1,description:'Libera magia: 30 de dano e sangramento (6 de dano por 3 ações). Custo: 12 MP.'},
 {id:'seiji-vital',hero:'seiji',name:'Papel resistente',cost:1,icon:10,description:'+15 HP máximos.'},
 {id:'seiji-field',hero:'seiji',name:'Leitura de Tinta',cost:1,requires:'seiji-vital',icon:1,description:'Fora de batalha: revela marcas e tesouros por 15 segundos; 4 MP.'},
 {id:'seiji-master',hero:'seiji',name:'Escriba desperto',cost:2,requires:'seiji-bleed',icon:15,description:'Mancha Viva também silencia: reduz o próximo golpe e impede o próximo Colapso do Véu.'},
 {id:'ophelia-ice',hero:'ophelia',name:'Frio persistente',cost:1,icon:2,description:'Estilhaço Glacial causa +8 de dano.'},
 {id:'ophelia-freeze',hero:'ophelia',name:'Prisão Glacial',cost:1,requires:'ophelia-ice',icon:7,description:'Libera magia: 24 de dano e congela por 1 ação. O mesmo inimigo só pode ser congelado uma vez por batalha. Custo: 11 MP.'},
 {id:'ophelia-cleanse',hero:'ophelia',name:'Aurora',cost:2,requires:'ophelia-freeze',icon:3,description:'Libera magia: cura 25 HP e remove todos os estados do aliado. Custo: 12 MP.'},
 {id:'ophelia-vital',hero:'ophelia',name:'Abrigo de neve',cost:1,icon:10,description:'+15 HP máximos.'},
 {id:'ophelia-field',hero:'ophelia',name:'Passo de Geada',cost:1,requires:'ophelia-vital',icon:7,description:'Fora de batalha: congela a água junto ao jardim por 5 MP, criando uma passagem por 15 segundos.'},
 {id:'ophelia-master',hero:'ophelia',name:'Orvalho abundante',cost:2,requires:'ophelia-cleanse',icon:3,description:'Orvalho restaura +14 HP, também fora de batalha.'}
];
TREE.push(
 {id:'marin-rupture',hero:'marin',name:'Ferida da Noite',cost:2,requires:'marin-control',icon:1,description:'32 dano e sangramento por 3 ações. 12 MP.'},
 {id:'marin-silence',hero:'marin',name:'Selo Noturno',cost:2,requires:'marin-rupture',icon:15,description:'38 dano e silêncio por 1 ação. 14 MP.'},
 {id:'marin-field',hero:'marin',name:'Respiro Noturno',cost:1,requires:'marin-vital',icon:6,description:'Restaura 24 HP de Marin em combate ou na exploração. 8 MP.'},
 {id:'gabriel-nova',hero:'gabriel',name:'Erupção da Forja',cost:2,requires:'gabriel-control',icon:0,description:'48 dano de fogo. 13 MP.'},
 {id:'gabriel-silence',hero:'gabriel',name:'Cinzas do Véu',cost:2,requires:'gabriel-nova',icon:15,description:'30 dano e silêncio por 1 ação. 12 MP.'},
 {id:'gabriel-field',hero:'gabriel',name:'Brasa Renovada',cost:1,requires:'gabriel-vital',icon:3,description:'Cura 28 HP e remove estados de um aliado. Também na exploração. 10 MP.'},
 {id:'max-power',hero:'max',name:'Fio de Relâmpago',cost:1,icon:15,description:'Corte de Vajra causa +8 de dano elétrico.'},
 {id:'max-control',hero:'max',name:'Arco Voltaico',cost:1,requires:'max-power',icon:15,description:'Libera Arco Voltaico: 28 dano elétrico e cegueira por 2 ações. 10 MP.'},
 {id:'max-master',hero:'max',name:'Voz da Tempestade',cost:2,requires:'max-control',icon:15,description:'+12 de dano à ultimate Crucificação do Trovão.'},
 {id:'max-vital',hero:'max',name:'Costuras Resistentes',cost:1,icon:10,description:'+15 HP máximos.'},
 {id:'orfeu-vital',hero:'orfeu',name:'Corpo Forjado',cost:1,icon:10,description:'+15 HP máximos.'},
 {id:'orfeu-master',hero:'orfeu',name:'Domínio Nulo',cost:2,requires:'orfeu-vital',icon:15,description:'+12 de dano à ultimate.'},
 {id:'orfeu-field',hero:'orfeu',name:'Leitura de Fluxo',cost:1,requires:'orfeu-vital',icon:5,description:'Revela uma distorção mágica no Arquivo por 15 segundos. 5 MP.'},
 {id:'ava-vital',hero:'ava',name:'Fundação Rochosa',cost:1,icon:10,description:'+15 HP máximos.'},
 {id:'ava-master',hero:'ava',name:'Soberania da Terra',cost:2,requires:'ava-vital',icon:15,description:'+12 de dano à ultimate.'},
 {id:'ava-field',hero:'ava',name:'Chamado da Terra',cost:1,requires:'ava-vital',icon:3,description:'O Éter da terra revela um esconderijo no Domo por 15 segundos. 5 MP.'},
 {id:'carmilla-vital',hero:'carmilla',name:'Fôlego Rubro',cost:1,icon:10,description:'+15 HP máximos para suportar a transferência de feridas.'},
 {id:'beatriz-vital',hero:'beatriz',name:'Votos da margem',cost:1,icon:10,description:'+15 HP máximos.'},
 {id:'beatriz-master',hero:'beatriz',name:'Maré consagrada',cost:2,requires:'beatriz-vital',icon:3,description:'+12 de dano à ultimate.'}
);
export const EXTRA_SKILLS:Record<HeroId,{id:string;node:string;name:string;cost:number;description:string;icon:number}[]>={marin:[{id:'darkveil',node:'marin-control',name:'Véu Escuro',cost:10,description:'24 dano • cegueira 2 ações',icon:6},{id:'rupture',node:'marin-rupture',name:'Ferida da Noite',cost:12,description:'32 dano • sangramento 3 ações',icon:1},{id:'nightseal',node:'marin-silence',name:'Selo Noturno',cost:14,description:'38 dano • silêncio 1 ação',icon:15},{id:'shadowrest',node:'marin-field',name:'Respiro Noturno',cost:8,description:'Restaura 24 HP de Marin. Também na exploração.',icon:6}],gabriel:[{id:'flamewall',node:'gabriel-control',name:'Muralha de Chamas',cost:10,description:'28 dano • enfraquece o próximo golpe',icon:0},{id:'nova',node:'gabriel-nova',name:'Erupção da Forja',cost:13,description:'48 dano de fogo',icon:0},{id:'ashseal',node:'gabriel-silence',name:'Cinzas do Véu',cost:12,description:'30 dano • silêncio 1 ação',icon:15},{id:'rekindle',node:'gabriel-field',name:'Brasa Renovada',cost:10,description:'28 HP • remove estados. Também na exploração.',icon:3}],seiji:[
 {id:'blind',node:'seiji-blind',name:'Noite de Tinta',cost:10,description:'22 dano • cegueira 2 ações',icon:6},
 {id:'bleed',node:'seiji-bleed',name:'Rasura',cost:12,description:'30 dano • sangramento 3 ações',icon:1}],ophelia:[
 {id:'freeze',node:'ophelia-freeze',name:'Prisão Glacial',cost:11,description:'24 dano • congela 1 ação, uma vez',icon:7},
 {id:'cleanse',node:'ophelia-cleanse',name:'Aurora',cost:12,description:'25 HP • remove todos os estados',icon:3}],max:[{id:'arc',node:'max-control',name:'Arco Voltaico',cost:10,description:'28 dano elétrico • cegueira 2 ações',icon:15}],beatriz:[],orfeu:[],ava:[],carmilla:[]};
for(const [hero,techniques] of Object.entries(SIGNATURE_TECHNIQUES))for(const technique of techniques){
 TREE.push({id:technique.node,hero:hero as HeroId,name:technique.name,cost:2,requires:technique.requires,icon:15,description:`${technique.description} ${technique.cost} MP.`});
 EXTRA_SKILLS[hero as HeroId].push({...technique,icon:15});
}
export type StatusId='freeze'|'bind'|'blind'|'bleed'|'silence';
export type Status={id:StatusId;turns:number};
export const STATUS:Record<StatusId,{name:string;icon:number;description:string}>={
 freeze:{name:'Congelado',icon:7,description:'Perde a próxima ação.'},bind:{name:'Prisão de Pedra',icon:10,description:'A terra imobiliza: perde a próxima ação.'},blind:{name:'Cegueira',icon:6,description:'50% de chance de errar ataques e magias ofensivas.'},bleed:{name:'Sangramento',icon:1,description:'Sofre 6 de dano no início de cada ação.'},silence:{name:'Silêncio',icon:15,description:'Impede magias; o inimigo usa um golpe físico.'}
};
export const BESTIARY=[...NEW_BESTIARY_V30,{id:'ashwolf',name:'Lobo de Cinzas',asset:'ashwolf',hp:190,description:'Predador da Mata Cindária. Sua pressão alimenta a carga das ultimates.',set:'ember' as SetId},{id:'moth',name:'Mariposa do Véu',asset:'moth',hp:180,description:'Uma memória alada que cobre os olhos de quem atravessa a mata.',set:'lunar' as SetId},{id:'cinder',name:'A Chama que Lembra',asset:'cinder',hp:520,description:'O fogo tomou forma na Clareira da Pira. Prepare o grupo e as ultimates antes do confronto.'},
 {id:'lobo',name:'Lobo de Éter',asset:'wolf',hp:130,description:'Éter que tomou forma de predador. Sua mordida causa sangramento na segunda rodada.',set:'wolf' as SetId},
 {id:'sombra',name:'Sombra Corrompida',asset:'shadow',hp:155,description:'Uma memória que perdeu o dono. A cada duas rodadas, seu véu causa cegueira.',set:'veil' as SetId},
 {id:'selo',name:'O Selo Quebrado',asset:'shadow',hp:330,description:'Guardião da escada apagada. Colapso do Véu a cada duas rodadas causa dano em área e silêncio. Confronto único do capítulo.'},
 {id:'eco',name:'Eco do Selo',asset:'shadow',hp:420,description:'Uma última manifestação do Selo na Galeria Profunda. Seus golpes e Colapsos são mais fortes. Confronto opcional único após concluir o capítulo.'}
];
export type ShopItem={id:string;name:string;price:number;icon:number;description:string;minLevel:number;gear?:string};
export const SHOP:ShopItem[]=[{id:'potion',name:'Poção',price:25,icon:4,minLevel:1,description:'Restaura 45 HP.'},{id:'ether',name:'Elixir de Éter',price:35,icon:5,minLevel:1,description:'Restaura 24 MP.'},{id:'remedy',name:'Antídoto de Luz',price:30,icon:3,minLevel:1,description:'Remove todos os estados de um aliado. Também funciona em batalha.'}];
for(const [tier,minLevel] of [1,3,5,8].entries()){
 const material=['do Aprendiz','de Cobre','de Éter','Ressonante'][tier];
 for(const [i,slot] of SLOTS.entries()){
  const id=`shop-${minLevel}-${slot}`,n=tier+1;
  const item:Gear={id,slot,name:`${['Katana','Capuz','Traje','Luvas','Botas','Amuleto'][i]} ${material}`,icon:8+i,hp:[0,4,10,3,4,4][i]*n,mp:[0,2,3,1,1,5][i]*n,atk:[3,0,0,1,1,0][i]*n,spell:slot==='charm'?n:0,minLevel,hero:slot==='weapon'?'seiji':undefined};
  GEAR[id]=item;SHOP.push({id,name:item.name,price:([60,40,65,35,35,50][i])*(tier*2+1),icon:item.icon,minLevel,gear:id,description:`${slot==='weapon'?'Arma de Seiji. ':''}+${item.hp} HP · +${item.mp} MP · +${item.atk} força${item.spell?` · +${item.spell} magia`:''}.`});
 }
 const id=`shop-${minLevel}-staff`,n=tier+1,item:Gear={id,slot:'weapon',name:`Cetro ${material}`,icon:2,hp:0,mp:5*n,atk:n,spell:3*n,minLevel,hero:'ophelia'};GEAR[id]=item;SHOP.push({id,name:item.name,price:60*(tier*2+1),icon:2,minLevel,gear:id,description:`Arma de Ophelia. +${item.mp} MP · +${item.atk} força · +${item.spell} magia e cura.`});
}
export type QuestState={stage:number;opened:string[];progress:Progression};
type QuestDef={id:string;name:string;description:string;goal:number;reward:number;points:number;xp?:number;giver?:string;request?:string;value:(s:QuestState)=>number};
export const QUESTS:QuestDef[]=[
 {id:'supplies',name:'Nada fica para trás',description:'Abra os dois baús de suprimentos: biblioteca e subterrâneo.',goal:2,reward:80,points:1,value:(s:QuestState)=>['bolsa','sub-bau'].filter(id=>s.opened.includes(id)).length},
 {id:'patrol',name:'Primeira patrulha',description:'Derrote 5 criaturas nos subterrâneos.',goal:5,reward:100,points:1,value:(s:QuestState)=>(s.progress.kills.lobo||0)+(s.progress.kills.sombra||0)},
 {id:'glyph',name:'Entre as linhas',description:'Aprenda Leitura de Tinta e revele o glifo na biblioteca.',goal:1,reward:90,points:1,value:(s:QuestState)=>+s.progress.field.includes('ink-glyph')},
 {id:'garden',name:'Um caminho no inverno',description:'Aprenda Passo de Geada e congele a água no jardim do pátio.',goal:1,reward:90,points:1,value:(s:QuestState)=>+s.progress.field.includes('ice-bridge')},
 {id:'orfeu-map',name:'O mapa do que falta',description:'Fale com Orfeu na biblioteca. Visite Porto Lúmina, o Domo e o Subterrâneo; depois relate o caminho ao professor.',goal:1,reward:120,points:1,xp:30,giver:'orfeu',request:'orfeu-map',value:s=>+s.progress.field.includes('orfeu-report')},
 {id:'ava-seeds',name:'Sementes de inverno',description:'Fale com Ava no Domo. Recupere as sementes nos baús do cais e da Galeria Profunda e volte para entregá-las.',goal:1,reward:180,points:1,xp:60,giver:'ava',request:'ava-seeds',value:s=>+s.progress.field.includes('ava-report')},
 {id:'max-patrol',name:'O rastro sob o cais',description:'Fale com Max no porto. Derrote os dois lobos da ala oeste e a sombra da alcova leste do Subterrâneo; depois volte ao cais.',goal:1,reward:160,points:1,xp:80,giver:'max',request:'max-patrol',value:s=>+s.progress.field.includes('max-report')},
 {id:'echo',name:'Uma memória adiante',description:'Após concluir o capítulo, fale com Orfeu. Investigue a Galeria, vença o Eco do Selo e relate o fim da expedição.',goal:1,reward:320,points:2,xp:100,giver:'orfeu',request:'echo',value:s=>+s.progress.field.includes('echo-report')}
];
export const ACHIEVEMENTS=[
 {id:'first',name:'Primeira memória',description:'Vença seu primeiro combate.',reward:30,test:(s:QuestState)=>Object.values(s.progress.kills).some(n=>n>0)},
 {id:'chapter',name:'Um silêncio comum',description:'Conclua o capítulo de Stone Reach.',reward:150,test:(s:QuestState)=>s.stage===5},
 {id:'shopper',name:'Preparação é cuidado',description:'Compre um item na loja.',reward:20,test:(s:QuestState)=>s.progress.metrics.purchases>0},
 {id:'control',name:'Domínio do Éter',description:'Aplique um estado em um inimigo.',reward:40,test:(s:QuestState)=>s.progress.metrics.statuses>0},
 {id:'three',name:'Ressonância',description:'Use 3 peças de um mesmo conjunto em um herói.',reward:75,test:(s:QuestState)=>s.progress.metrics.set3},
 {id:'six',name:'Memória completa',description:'Use as 6 peças de um conjunto em um herói.',reward:200,test:(s:QuestState)=>s.progress.metrics.set6},
 {id:'healer',name:'Eu fico com você',description:'Use Orvalho ou Aurora 5 vezes.',reward:50,test:(s:QuestState)=>s.progress.metrics.heals>=5},
 {id:'explorer',name:'Além do caminho',description:'Resolva os dois desafios de exploração elemental.',reward:100,test:(s:QuestState)=>s.progress.field.includes('ink-glyph')&&s.progress.field.includes('ice-bridge')},
 {id:'traveler',name:'Stone Reach por inteiro',description:'Visite os sete mapas desta aventura.',reward:100,test:(s:QuestState)=>s.progress.visited.length>=7},
 {id:'echo',name:'O último eco',description:'Vença o Eco do Selo na Galeria Profunda.',reward:120,test:(s:QuestState)=>(s.progress.kills.eco||0)>0}
];
export type CutsceneBeat={speaker:string;text:string;focus:Point;portrait:'seiji'|'ophelia'|'beatriz'|'orfeu'|'ava'|'max'|'marin'|'gabriel';effect?:'ink'|'ice'|'seal'|'fire'};
export const CUTSCENES:Record<string,{title:string;map:string;beats:CutsceneBeat[]}>= {
 arrival:{title:'O ruído sob Stone Reach',map:'patio',beats:[
 {speaker:'Ophelia',text:'O pátio está tranquilo. Mas o chão… você também sentiu?',focus:{x:14,y:8},portrait:'ophelia',effect:'ice'},
 {speaker:'Seiji',text:'A tinta no meu pincel não para de se mover. Tem alguma coisa embaixo da Academia.',focus:{x:14,y:12},portrait:'seiji',effect:'ink'},
 {speaker:'Ophelia',text:'Beatriz estava investigando isso. Vamos falar com ela antes de descer.',focus:{x:11,y:11},portrait:'ophelia'}]},
 awakening:{title:'O que o selo lembra',map:'camara',beats:[
 {speaker:'Seiji',text:'Isso não é uma parede. Está se movendo.',focus:{x:10,y:7},portrait:'seiji',effect:'seal'},
 {speaker:'O Selo Quebrado',text:'Vocês vieram lembrar. Que gentileza.',focus:{x:10,y:6},portrait:'ophelia',effect:'seal'},
 {speaker:'Ophelia',text:'Quando ele reunir o Éter, guarde-se. Eu fico com você.',focus:{x:10,y:12},portrait:'ophelia',effect:'ice'}]},
 silence:{title:'Um silêncio comum',map:'camara',beats:[
 {speaker:'Ophelia',text:'Parou. Pela primeira vez… um silêncio comum.',focus:{x:10,y:6},portrait:'ophelia',effect:'ice'},
 {speaker:'Seiji',text:'Tem mais uma escada atrás dele. Beatriz precisa saber antes de continuarmos.',focus:{x:10,y:12},portrait:'seiji',effect:'ink'}]},
 harbor:{title:'A maré e o rastro',map:'porto',beats:[
 {speaker:'Ophelia',text:'A água parece levar o ruído embora. Eu precisava disso.',focus:{x:14,y:16},portrait:'ophelia',effect:'ice'},
 {speaker:'Max',text:'O cais está seguro. Lá embaixo, encontrei rastros. Se forem descer, venham conversar comigo.',focus:{x:15,y:10},portrait:'max'}]},
 roots:{title:'O que permanece vivo',map:'domo',beats:[
 {speaker:'Ava',text:'Há coisas que não crescem mais depressa porque alguém está com pressa. Aproximem-se; tenho um pedido para vocês.',focus:{x:12,y:7},portrait:'ava'},
 {speaker:'Seiji',text:'Até aqui o Éter reage ao subsolo. Vamos ouvir o que ela descobriu.',focus:{x:12,y:13},portrait:'seiji',effect:'ink'}]},
 'echo-awakening':{title:'Uma memória adiante',map:'galeria',beats:[
 {speaker:'Ophelia',text:'Aquela voz… é uma memória do selo. Ainda está presa aqui.',focus:{x:25,y:20},portrait:'ophelia',effect:'seal'},
 {speaker:'Seiji',text:'Desta vez sabemos o que esperar. Juntos, até o silêncio voltar.',focus:{x:24,y:21},portrait:'seiji',effect:'ink'}]},
 'echo-silence':{title:'O último eco',map:'galeria',beats:[
 {speaker:'Ophelia',text:'Agora não resta aquela pressão. As sementes de Ava estão a salvo.',focus:{x:25,y:20},portrait:'ophelia',effect:'ice'},
 {speaker:'Seiji',text:'Vamos contar a Orfeu. Nenhuma escada precisa desaparecer dos registros de novo.',focus:{x:14,y:15},portrait:'seiji',effect:'ink'}]}
};

for(const hero of ['marin','gabriel'] as const)for(const [tier,minLevel] of [1,3,5,8].entries()){const n=tier+1,id=`shop-${minLevel}-${hero}`,item:Gear={id,slot:'weapon',hero,name:`${hero==='marin'?'Adagas do Crepúsculo':'Manoplas da Forja'} ${['I','II','III','IV'][tier]}`,icon:hero==='marin'?8:9,hp:hero==='gabriel'?5*n:0,mp:hero==='marin'?3*n:0,atk:4*n,spell:n,minLevel};GEAR[id]=item;SHOP.push({id,name:item.name,price:60*(tier*2+1),icon:item.icon,minLevel,gear:id,description:`Arma de ${hero==='marin'?'Marin':'Gabriel'}. +${item.hp} HP · +${item.mp} MP · +${item.atk} força · +${item.spell} magia.`});}
QUESTS.push({id:'expedition-party',name:'Uma vigília em companhia',description:'Recrute Marin e Gabriel no acampamento da Mata Cindária.',goal:2,reward:180,points:1,xp:60,value:s=>['marin','gabriel'].filter(id=>s.progress.recruited.includes(id as HeroId)).length},{id:'cinder-memory',name:'Dizer ao fogo que pare',description:'Derrote A Chama que Lembra na Clareira da Pira.',goal:1,reward:300,points:2,xp:100,value:s=>s.progress.kills.cinder||0});

CUTSCENES['astral-silence']={title:'A órbita encontra repouso',map:'observatorio',beats:[{speaker:'Seiji',text:'Os anéis se aquietaram. Finalmente o céu deste lugar pode mudar.',focus:{x:13,y:7},portrait:'seiji'},{speaker:'Orfeu',text:'O núcleo guarda uma última memória. Levaremos o Coração das Três Órbitas à Academia.',focus:{x:13,y:12},portrait:'orfeu'}]};
CUTSCENES['astral-awakening']={title:'As três órbitas',map:'observatorio',beats:[{speaker:'Orfeu',text:'O astrolábio continua vigiando o selo. As três órbitas despertam conforme o núcleo perde força.',focus:{x:13,y:7},portrait:'orfeu'},{speaker:'Seiji',text:'Ele ainda não sabe que a Academia foi salva. Preparem a guarda quando os anéis se alinharem.',focus:{x:13,y:12},portrait:'seiji',effect:'ink'}]};
CUTSCENES['ashwood-arrival']={title:'A mata ainda queima',map:'ashwood',beats:[{speaker:'Ophelia',text:'Cinza no chão. Ainda existe um acampamento aqui?',focus:{x:12,y:8},portrait:'ophelia'},{speaker:'Gabriel',text:'Enquanto houver alguém para guardar a brasa. Venham pelo caminho batido.',focus:{x:13,y:8},portrait:'gabriel'}]};
CUTSCENES['cinder-awakening']={title:'A Chama que Lembra',map:'ashpyre',beats:[{speaker:'A Chama que Lembra',text:'Eu queimo porque me pediram. Ninguém veio me dizer que parasse.',focus:{x:10,y:6},portrait:'gabriel',effect:'fire'},{speaker:'Seiji',text:'Então viemos dizer. Você pode parar.',focus:{x:10,y:12},portrait:'seiji',effect:'ink'}]};
CUTSCENES['cinder-silence']={title:'O calor que fica',map:'ashpyre',beats:[{speaker:'Gabriel',text:'Uma forja acesa tem propósito. Uma floresta queimando só precisa de alguém que fique.',focus:{x:10,y:6},portrait:'gabriel'},{speaker:'Ophelia',text:'Hoje o fogo parou. O calor pode ficar.',focus:{x:10,y:12},portrait:'ophelia',effect:'ice'}]};

for(const id of HERO_IDS){const origin=ORIGINS[id],hero=heroBases().find(h=>h.id===id)!;CUTSCENES[`origin-${id}`]={title:origin.title,map:origin.map,beats:[{speaker:hero.name,text:origin.opening,focus:origin.position,portrait:id},{speaker:hero.name,text:'Vou partir sozinho. Encontrarei aliados pelo caminho; cada um tem sua própria razão para seguir.',focus:origin.position,portrait:id}]};}

export const FIELD_TECHNIQUES:Record<HeroId,{id:string;node:string;name:string;cost:number;icon:number;timed:boolean}[]>={
 seiji:[{id:'ink-glyph',node:'seiji-field',name:'Leitura de Tinta',cost:4,icon:1,timed:true},{id:'ink-focus',node:'seiji-field',name:'Concentração',cost:0,icon:5,timed:false}],
 ophelia:[{id:'ice-bridge',node:'ophelia-field',name:'Passo de Geada',cost:5,icon:7,timed:true},{id:'mend',node:'',name:'Orvalho',cost:9,icon:3,timed:false}],
 marin:[{id:'shadow-step',node:'marin-explore',name:'Passo entre Sombras',cost:6,icon:6,timed:true},{id:'shadowrest',node:'marin-field',name:'Respiro Noturno',cost:8,icon:6,timed:false}],
 gabriel:[{id:'ember-light',node:'gabriel-explore',name:'Luz da Forja',cost:6,icon:0,timed:true},{id:'rekindle',node:'gabriel-field',name:'Brasa Renovada',cost:10,icon:3,timed:false}],
 max:[{id:'storm-trace',node:'',name:'Passo de Vajra',cost:5,icon:15,timed:true},{id:'stormguard',node:'',name:'Guarda de Tempestade',cost:10,icon:15,timed:false}],
 beatriz:[{id:'margem',node:'',name:'Margem Serena',cost:11,icon:3,timed:false}],
 orfeu:[{id:'echo-sight',node:'orfeu-field',name:'Leitura de Fluxo',cost:5,icon:5,timed:true}],
 ava:[{id:'vine-growth',node:'ava-field',name:'Chamado da Terra',cost:5,icon:3,timed:true}],
 carmilla:[]
};
TREE.push({id:'marin-explore',hero:'marin',name:'Passo entre Sombras',cost:1,requires:'marin-vital',icon:6,description:'Por 15 s: evita contato automático com mobs e revela esconderijos. 6 MP.'},{id:'gabriel-explore',hero:'gabriel',name:'Luz da Forja',cost:1,requires:'gabriel-vital',icon:0,description:'Por 15 s: ilumina o cenário e revela tesouros entre as cinzas. 6 MP.'});
export const DIFFICULTIES=[{id:1 as const,name:'Normal',hp:1,damage:1,reward:1,drop:.3},{id:2 as const,name:'Desafiante',hp:1.3,damage:1.2,reward:1.5,drop:.55},{id:3 as const,name:'Extremo',hp:1.65,damage:1.4,reward:2,drop:.8}];
