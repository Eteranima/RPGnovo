export type MapId = 'patio' | 'arquivo' | 'subsolo' | 'camara' | 'porto' | 'domo' | 'galeria' | 'ashwood' | 'ashpyre' | 'vigilia';
export type Point = { x: number; y: number };
export type Entity = Point & { id: string; label: string; kind: 'npc'|'warp'|'book'|'save'|'chest'|'rune'|'mob'|'boss'|'sign'|'shop'|'event'; to?: MapId; spawn?: Point; asset?: string; minStage?: number; family?: 'lobo'|'sombra'|'selo'|'eco'|'ashwolf'|'moth'|'cinder'; hp?:number; damage?:number; xp?:number; credits?:number; text?:string; eventId?:string; fieldSkill?:string; fieldRequired?:string };
export type Prop = Point & { asset: string; w: number; h: number; solid?: [number,number,number,number]; atlas?: number; atlasSheet?: string };
export type MapData = { id: MapId; name: string; subtitle: string; safe: boolean; width: number; height: number; rows: string[]; entities: Entity[]; props: Prop[] };
const grid = (w:number,h:number,base:string) => Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x===0||y===0||x===w-1||y===h-1?'#':base));
const fill = (g:string[][],x:number,y:number,w:number,h:number,t:string) => {for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)g[j][i]=t;};
const patio=grid(28,21,'g');
fill(patio,9,8,12,9,'p'); fill(patio,13,5,3,15,'p'); fill(patio,1,16,7,2,'w'); fill(patio,5,16,2,2,'p');
fill(patio,9,1,11,6,'#'); patio[6][14]='p'; patio[7][14]='p';
const arquivo=grid(22,18,'d');
fill(arquivo,1,1,20,2,'#');fill(arquivo,5,7,3,2,'#');fill(arquivo,14,7,3,2,'#');
const subsolo=grid(24,23,'d');
fill(subsolo,7,1,2,7,'#');fill(subsolo,7,11,2,7,'#');fill(subsolo,15,5,2,11,'#');fill(subsolo,1,15,4,2,'w');fill(subsolo,17,18,6,2,'w');
const camara=grid(20,17,'d');fill(camara,4,4,2,2,'#');fill(camara,14,4,2,2,'#');fill(camara,4,10,2,2,'#');fill(camara,14,10,2,2,'#');
const porto=grid(28,22,'p');fill(porto,1,14,26,7,'w');for(const x of [4,11,20])fill(porto,x,13,2,7,'b');fill(porto,2,1,7,4,'#');fill(porto,14,1,7,4,'#');
const domo=grid(24,20,'g');fill(domo,9,1,6,18,'p');fill(domo,2,11,20,3,'p');
const galeria=grid(30,24,'d');fill(galeria,8,2,2,7,'#');fill(galeria,8,12,2,6,'#');fill(galeria,19,5,2,9,'#');fill(galeria,19,18,2,4,'#');fill(galeria,1,18,5,2,'w');fill(galeria,22,3,6,2,'w');
const ashwood=grid(34,22,'g');fill(ashwood,2,9,30,2,'p');fill(ashwood,16,2,2,18,'p');const ashpyre=grid(20,17,'d');
const vigilia=grid(27,19,'g');fill(vigilia,2,8,23,3,'p');fill(vigilia,12,2,3,15,'p');fill(vigilia,20,3,3,4,'#');fill(vigilia,4,13,4,2,'w');
const tree=(x:number,y:number,alt=0):Prop=>({x,y,asset:'tree',atlas:alt,w:3.4,h:4.6,solid:[x-.35,y-.25,.7,.5]});
const lamp=(x:number,y:number):Prop=>({x,y,asset:'lantern',atlas:3,w:1.2,h:2.6,solid:[x-.18,y-.18,.36,.36]});
const shelf=(x:number,y:number):Prop=>({x,y,asset:'shelf',atlas:5,w:2.1,h:3.2});
const column=(x:number,y:number,broken=false):Prop=>({x,y,asset:'dungeon',atlasSheet:'dungeon',atlas:broken?3:4,w:2.6,h:4.2,solid:[x-.4,y-.5,.8,.6]});
export const MAPS: Record<MapId,MapData> = {
 patio:{id:'patio',name:'Pátio Central',subtitle:'Academia Stone Reach',safe:true,width:28,height:21,rows:patio.map(r=>r.join('')),entities:[
  {id:'beatriz',label:'Beatriz Demeter',kind:'npc',x:10.8,y:11,asset:'beatriz'},
  {id:'academia',label:'Entrar na biblioteca',kind:'warp',x:14,y:7.3,to:'arquivo',spawn:{x:11,y:14.5}},
  {id:'cristal',label:'Cristal de descanso',kind:'save',x:20,y:13.5},
  {id:'loja',label:'Empório da Academia',kind:'shop',x:18,y:12},
  {id:'agua-jardim',label:'Água junto ao jardim',kind:'sign',x:2,y:15},
  {id:'jardim-bau',label:'Baú do jardim gelado',kind:'chest',x:2,y:18},
  {id:'placa',label:'Mural de Stone Reach',kind:'sign',x:18,y:10},
  {id:'porta-porto',label:'Ir a Porto Lúmina',kind:'warp',x:2,y:10,to:'porto',spawn:{x:25,y:10}},
  {id:'porta-domo',label:'Entrar no Domo de Herbologia',kind:'warp',x:24,y:18,to:'domo',spawn:{x:12,y:17}},
 ],props:[{x:14.5,y:6.6,asset:'academy',w:11.8,h:7.1},tree(4,6),tree(23.5,6,1),tree(3,12,1),tree(24,15),tree(8,19),tree(20,19,1),lamp(10,8),lamp(19,8),lamp(10,16),lamp(19,16),{x:20,y:13.5,asset:'crystal',atlas:4,w:1.6,h:2.1},{x:7.5,y:12,asset:'flowers',atlas:2,w:2.5,h:1.9},{x:23,y:10,asset:'flowers',atlas:2,w:2.2,h:1.7}]},
 arquivo:{id:'arquivo',name:'Ala de Estudos',subtitle:'O arquivo da Academia',safe:true,width:22,height:18,rows:arquivo.map(r=>r.join('')),entities:[
  {id:'retorno',label:'Voltar ao pátio',kind:'warp',x:11,y:16,to:'patio',spawn:{x:14,y:8.6}},
  {id:'livro',label:'Ler o registro antigo',kind:'book',x:11,y:6},
  {id:'escada',label:'Descer ao subterrâneo',kind:'warp',x:19,y:4,to:'subsolo',spawn:{x:3,y:3},minStage:2},
  {id:'glifo',label:'Glifo apagado',kind:'sign',x:11,y:10},
  {id:'glifo-bau',label:'Compartimento revelado',kind:'chest',x:11,y:4},
  {id:'bolsa',label:'Suprimentos esquecidos',kind:'chest',x:3,y:11},
  {id:'orfeu',label:'Professor Orfeu Bauss',kind:'npc',x:16,y:13,asset:'orfeu'},
 ],props:[...Array.from({length:7},(_,i)=>shelf(2+i*2.8,3)),shelf(6,8),shelf(15.5,8),lamp(3,14),lamp(18,14),{x:19,y:4,asset:'stairs',w:1.3,h:1.1}]},
 subsolo:{id:'subsolo',name:'Subterrâneo Selado',subtitle:'Abaixo de Stone Reach',safe:false,width:24,height:23,rows:subsolo.map(r=>r.join('')),entities:[
  {id:'sub-retorno',label:'Subir à biblioteca',kind:'warp',x:3,y:2,to:'arquivo',spawn:{x:18,y:5}},
  {id:'lobo',label:'Lobo de Éter',kind:'mob',x:11,y:8,asset:'wolf'},
  {id:'sombra',label:'Sombra Corrompida',kind:'mob',x:19,y:13,asset:'shadow'},
  {id:'fragmento',label:'Examinar a inscrição',kind:'rune',x:12,y:18},
  {id:'sub-cristal',label:'Cristal de descanso',kind:'save',x:5,y:19},
  {id:'sub-bau',label:'Abrir o baú',kind:'chest',x:20,y:6},
  {id:'porta-selo',label:'Entrar na Câmara do Selo',kind:'warp',x:21,y:21,to:'camara',spawn:{x:10,y:14},minStage:3},
  {id:'lobo-norte',label:'Lobo de Éter · rastro norte',kind:'mob',x:5,y:9,asset:'wolf',family:'lobo',hp:115},
  {id:'lobo-rastro',label:'Lobo de Éter · corredor oeste',kind:'mob',x:4,y:12,asset:'wolf',family:'lobo',hp:140,xp:25},
  {id:'sombra-escada',label:'Sombra · alcova leste',kind:'mob',x:20,y:9,asset:'shadow',family:'sombra',hp:145,xp:25},
 ],props:[lamp(4,6),lamp(12,11),lamp(20,17),column(7.5,7.3,true),column(15.5,9),column(7.5,16.6,true),{x:21,y:21,asset:'dungeon',atlasSheet:'dungeon',atlas:5,w:3.5,h:4.5},{x:5,y:19,asset:'crystal',atlas:4,w:1.7,h:2.3}]},
 camara:{id:'camara',name:'Câmara do Selo',subtitle:'O que foi selado aqui não dorme',safe:false,width:20,height:17,rows:camara.map(r=>r.join('')),entities:[
  {id:'cam-retorno',label:'Voltar ao subterrâneo',kind:'warp',x:10,y:15,to:'subsolo',spawn:{x:20,y:20}},
  {id:'selo',label:'O Selo Quebrado',kind:'boss',x:10,y:6,asset:'shadow'},
  {id:'cam-cristal',label:'Cristal de descanso',kind:'save',x:8,y:13},
  {id:'porta-galeria',label:'Descer à Galeria Profunda',kind:'warp',x:10,y:2,to:'galeria',spawn:{x:4,y:3},minStage:5},
 ],props:[column(4.5,5.5),column(14.5,5.5),column(4.5,11.5,true),column(14.5,11.5,true),lamp(5,6),lamp(15,6),lamp(5,12),lamp(15,12),{x:8,y:13,asset:'crystal',atlas:4,w:1.5,h:2}]},
 porto:{id:'porto',name:'Porto Lúmina',subtitle:'O cais de Stone Reach',safe:true,width:28,height:22,rows:porto.map(r=>r.join('')),entities:[
  {id:'porto-retorno',label:'Voltar ao Pátio Central',kind:'warp',x:26,y:10,to:'patio',spawn:{x:3,y:10}},
  {id:'max',label:'Max e seu pequeno companheiro',kind:'npc',x:15,y:10,asset:'max'},
  {id:'mercado-mare',label:'Mercado da Maré',kind:'shop',x:5,y:6},
  {id:'mesa-ambar',label:'Mesa de Âmbar',kind:'sign',x:17,y:6,text:'O cais está tranquilo. A Mesa de Âmbar recebe histórias de quem desce à Academia. Max tem um pedido para a próxima patrulha.'},
  {id:'porto-cristal',label:'Cristal do cais',kind:'save',x:24,y:12},
  {id:'semente-porto',label:'Caixa de sementes do cais',kind:'chest',x:20,y:18},
  {id:'barcos',label:'Barcos de pesca',kind:'sign',x:11,y:18,text:'Os barcos aguardam a maré. Hoje, nosso caminho continua em Stone Reach.'}
  ,{id:'evento-carta',label:'Evento · Uma carta à deriva',kind:'event',x:6,y:11,eventId:'carta'}
 ],props:[{x:5,y:4.8,asset:'harbor',atlasSheet:'harbor',atlas:0,w:4.7,h:5.8,solid:[3.1,3.7,3.8,1]},{x:17,y:4.8,asset:'harbor',atlasSheet:'harbor',atlas:1,w:4.8,h:5.9,solid:[15,3.7,4,1]},{x:7.5,y:18.5,asset:'harbor',atlasSheet:'harbor',atlas:3,w:3.2,h:3.6},{x:14,y:18,asset:'harbor',atlasSheet:'harbor',atlas:2,w:3.4,h:2.8},{x:3,y:9,asset:'harbor',atlasSheet:'harbor',atlas:5,w:1.2,h:1.6},{x:6,y:8,asset:'harbor',atlasSheet:'harbor',atlas:4,w:1.4,h:1.6},lamp(8,9),lamp(20,9),lamp(4,13),lamp(21,13),{x:24,y:12,asset:'crystal',atlas:4,w:1.7,h:2.3}]},
 domo:{id:'domo',name:'Domo de Herbologia',subtitle:'O jardim de Ava Rosa Groot',safe:true,width:24,height:20,rows:domo.map(r=>r.join('')),entities:[
  {id:'domo-retorno',label:'Voltar ao Pátio Central',kind:'warp',x:12,y:18,to:'patio',spawn:{x:23,y:18}},
  {id:'ava',label:'Professora Ava Rosa Groot',kind:'npc',x:12,y:7,asset:'ava'},
  {id:'domo-cristal',label:'Cristal do jardim',kind:'save',x:18,y:12},
  {id:'canteiro',label:'Canteiro de inverno',kind:'sign',x:6,y:8,text:'Plantas do jardim respondem ao Éter com delicadeza. Ava procura duas amostras: uma no cais e outra na Galeria Profunda.'},
  {id:'domo-bau',label:'Suprimentos do domo',kind:'chest',x:5,y:15}
  ,{id:'evento-orvalho',label:'Evento · Flores sob a geada',kind:'event',x:18,y:5,eventId:'orvalho'}
 ],props:[tree(4,4),tree(20,4,1),tree(3,17,1),tree(20,17),lamp(9,10),lamp(15,10),{x:18,y:12,asset:'crystal',atlas:4,w:1.6,h:2.2},...[[5,8],[6,6],[18,6],[19,8],[5,11],[19,11],[6,16],[17,16]].map(([x,y]):Prop=>({x,y,asset:'flowers',atlas:2,w:3,h:2.2}))]},
 galeria:{id:'galeria',name:'Galeria Profunda',subtitle:'Uma memória depois do selo',safe:false,width:30,height:24,rows:galeria.map(r=>r.join('')),entities:[
  {id:'galeria-retorno',label:'Subir à Câmara do Selo',kind:'warp',x:3,y:2,to:'camara',spawn:{x:10,y:3}},
  {id:'galeria-cristal',label:'Cristal da Galeria',kind:'save',x:12,y:12},
  {id:'galeria-lobo-1',label:'Lobo de Éter · galeria oeste',kind:'mob',x:5,y:9,asset:'wolf',family:'lobo',hp:165,damage:18,xp:30,credits:50},
  {id:'galeria-lobo-2',label:'Lobo de Éter · galeria sul',kind:'mob',x:13,y:19,asset:'wolf',family:'lobo',hp:180,damage:18,xp:30,credits:50},
  {id:'galeria-sombra-1',label:'Sombra · galeria norte',kind:'mob',x:14,y:6,asset:'shadow',family:'sombra',hp:175,damage:18,xp:30,credits:50},
  {id:'galeria-sombra-2',label:'Sombra · galeria leste',kind:'mob',x:25,y:13,asset:'shadow',family:'sombra',hp:185,damage:18,xp:30,credits:50},
  {id:'semente-galeria',label:'Amostra de semente preservada',kind:'chest',x:25,y:7},
  {id:'galeria-bau',label:'Suprimentos da expedição',kind:'chest',x:6,y:21},
  {id:'eco',label:'Eco do Selo',kind:'boss',x:25,y:20,asset:'shadow',family:'eco',hp:420,damage:22,xp:140,credits:260},
  {id:'galeria-inscricao',label:'Registro da Galeria',kind:'sign',x:14,y:15,text:'A tinta antiga ainda vibra nas paredes. O selo se desfez, mas deixou uma última memória nesta galeria.'}
  ,{id:'evento-fenda',label:'Evento · Vigia da fenda',kind:'event',x:15,y:16,eventId:'fenda'}
 ],props:[column(8.5,8,true),column(8.5,17),column(19.5,10),column(19.5,20,true),lamp(4,5),lamp(12,8),lamp(24,10),lamp(14,17),lamp(23,21),{x:12,y:12,asset:'crystal',atlas:4,w:1.8,h:2.4},{x:25,y:20,asset:'dungeon',atlasSheet:'dungeon',atlas:2,w:3,h:3}]},
 ashwood:{id:'ashwood',name:'Mata Cindária',subtitle:'Cinza no chão, calor na vigília',safe:false,width:34,height:22,rows:ashwood.map(r=>r.join('')),entities:[{id:'mata-retorno',label:'Voltar à Academia',kind:'warp',x:12,y:2,to:'patio',spawn:{x:19,y:17}},{id:'marin',label:'Marin · Hora Sem Estrelas',kind:'npc',x:7,y:9,asset:'marin'},{id:'gabriel',label:'Gabriel · Guardião da Forja',kind:'npc',x:13,y:8,asset:'gabriel'},{id:'mata-loja',label:'Loja do Acampamento',kind:'shop',x:10,y:7},{id:'mata-cristal',label:'Cristal do Acampamento',kind:'save',x:6,y:7},{id:'ashwolf-1',label:'Lobo de Cinzas',kind:'mob',x:25,y:5,asset:'ashwolf',family:'ashwolf',hp:190,damage:19,xp:40,credits:65},{id:'ashwolf-2',label:'Lobo de Cinzas · trilha sul',kind:'mob',x:24,y:16,asset:'ashwolf',family:'ashwolf',hp:210,damage:20,xp:45,credits:70},{id:'moth-1',label:'Mariposa do Véu',kind:'mob',x:9,y:16,asset:'moth',family:'moth',hp:180,damage:18,xp:40,credits:65},{id:'mata-bau',label:'Suprimentos do acampamento',kind:'chest',x:4,y:12},{id:'porta-pira',label:'Entrar na Clareira da Pira',minStage:5,kind:'warp',x:17,y:20,to:'ashpyre',spawn:{x:10,y:14}},{id:'mata-placa',label:'Tábua da Mata',kind:'sign',x:4,y:10,text:'A mata não queimou. A mata ainda está queimando. Gabriel vigia os rastros a leste; Marin aguarda no acampamento.'}],props:[{x:10,y:6,asset:'expedition',atlasSheet:'expedition',atlas:1,w:4,h:4,solid:[9,5,2,1]},...[ [4,5],[22,4],[29,10],[6,18],[28,19] ].map(([x,y]):Prop=>({x,y,asset:'expedition',atlasSheet:'expedition',atlas:0,w:4,h:5,solid:[x-.3,y-.3,.6,.6]})),{x:6,y:7,asset:'crystal',atlas:4,w:1.7,h:2.3}]},
 vigilia:{id:'vigilia',name:'Ruínas da Vigília',subtitle:'Uma torre caída guarda a saída norte da Mata',safe:false,width:27,height:19,rows:vigilia.map(r=>r.join('')),entities:[{id:'vigilia-retorno',label:'Voltar ao acampamento',kind:'warp',x:3,y:9,to:'ashwood',spawn:{x:30,y:10}},{id:'vigilia-cristal',label:'Cristal da Vigília',kind:'save',x:6,y:5},{id:'vigilia-lobo',label:'Lobo de Cinzas · vigia',kind:'mob',x:17,y:5,asset:'ashwolf',family:'ashwolf',hp:230,damage:22,xp:52,credits:85},{id:'vigilia-mariposa',label:'Mariposa de Carvão',kind:'mob',x:22,y:12,asset:'moth',family:'moth',hp:215,damage:21,xp:50,credits:82},{id:'vigilia-sombra',label:'Sentinela do Véu',kind:'mob',x:13,y:15,asset:'shadow',family:'sombra',hp:220,damage:22,xp:55,credits:90},{id:'vigilia-bau',label:'Cofre da torre caída',kind:'chest',x:23,y:4},{id:'vigilia-placa',label:'Inscrição da Vigília',kind:'sign',x:13,y:3,text:'A torre observava o mar e a mata. Quando o selo rachou, os vigias esqueceram o próprio nome.'}],props:[{x:6,y:5,asset:'crystal',atlas:4,w:1.7,h:2.3},...[ [5,3],[18,4],[23,15],[5,16] ].map(([x,y]):Prop=>({x,y,asset:'expedition',atlasSheet:'expedition',atlas:0,w:4,h:5,solid:[x-.3,y-.3,.6,.6]})),column(21,5,true),lamp(8,9),lamp(18,10)]},
 ashpyre:{id:'ashpyre',name:'Clareira da Pira',subtitle:'A Chama que Lembra',safe:false,width:20,height:17,rows:ashpyre.map(r=>r.join('')),entities:[{id:'pira-retorno',label:'Voltar ao acampamento',kind:'warp',x:10,y:15,to:'ashwood',spawn:{x:17,y:19}},{id:'cinder',label:'A Chama que Lembra',kind:'boss',x:10,y:6,asset:'cinder',family:'cinder',hp:520,damage:24,xp:180,credits:350},{id:'pira-cristal',label:'Cristal antes da Pira',kind:'save',x:5,y:13},{id:'pira-inscricao',label:'O braseiro eterno',kind:'sign',x:6,y:7,text:'Eu queimo porque me pediram. Ninguém veio me dizer que parasse.'}],props:[{x:10,y:5,asset:'expedition',atlasSheet:'expedition',atlas:3,w:4,h:3},...[ [4,5],[16,5],[4,10],[16,10] ].map(([x,y]):Prop=>({x,y,asset:'expedition',atlasSheet:'expedition',atlas:4,w:1.8,h:2.7,solid:[x-.2,y-.2,.4,.4]})),{x:5,y:13,asset:'crystal',atlas:4,w:1.6,h:2.2}]}
};
MAPS.patio.entities.push({id:'porta-mata',label:'Seguir à Mata Cindária',kind:'warp',x:19,y:18,to:'ashwood',spawn:{x:12,y:3},minStage:5});
MAPS.ashwood.entities.push({id:'porta-vigilia',label:'Subir às Ruínas da Vigília',kind:'warp',x:31,y:10,to:'vigilia',spawn:{x:3,y:9}});
export const ASSETS:Record<string,string>={
 marin:'/assets/characters/marin-walk-v14.webp',gabriel:'/assets/characters/gabriel-walk-v14.webp',dlg_marin:'/assets/characters/marin-dialogue-v14.webp',dlg_gabriel:'/assets/characters/dlg_gabriel.webp',expedition:'/assets/world/expedition-props-v14.webp',ashwolf:'/assets/monsters/enemies-v14.webp',moth:'/assets/monsters/enemies-v14.webp',cinder:'/assets/monsters/enemies-v14.webp',battle_ashwolf_attack:'/assets/monsters/enemies-v14.webp',battle_moth_attack:'/assets/monsters/enemies-v14.webp',battle_cinder_attack:'/assets/monsters/enemies-v14.webp',battle_marin_attack:'/assets/characters/marin-combat-v14.webp',battle_marin_cast:'/assets/characters/marin-combat-v14.webp',battle_gabriel_attack:'/assets/characters/gabriel-combat-v14.webp',battle_gabriel_cast:'/assets/characters/gabriel-combat-v14.webp',battle_bg_academy:'/assets/world/battle-academy-v14.webp',battle_bg_below:'/assets/world/battle-below-v14.webp',battle_bg_forest:'/assets/world/battle-forest-v14.webp',
 harbor:'/assets/world/harbor-props-v13.webp',seiji:'/assets/characters/seiji-walk-v2.webp',ophelia:'/assets/characters/ophelia-walk-v2.webp',beatriz:'/assets/v22/beatriz-walk.webp',
 dlg_seiji:'/assets/characters/dlg_seiji.webp',dlg_ophelia:'/assets/characters/dlg_ophelia.webp',dlg_beatriz:'/assets/characters/dlg_beatriz.webp',
 orfeu:'/assets/characters/orfeu_sheet.webp',ava:'/assets/characters/ava_sheet.webp',max:'/assets/characters/max-walk-v13.webp',
 dlg_orfeu:'/assets/characters/dlg_orfeu.webp',dlg_ava:'/assets/characters/dlg_ava.webp',dlg_max:'/assets/characters/dlg_max.webp',
 harbor_floor:'/assets/world/tile_cais_lumina.webp',
 academy:'/assets/world/academy-anime.png',props:'/assets/world/props-anime.png',terrain:'/assets/world/terrain-anime.png',
 dungeon:'/assets/world/dungeon-props-v2.webp',
 battle_seiji_attack:'/assets/characters/seiji-attack-v2.webp',battle_seiji_cast:'/assets/characters/seiji-cast-v2.webp',battle_ophelia_attack:'/assets/characters/ophelia-attack-v2.webp',battle_ophelia_cast:'/assets/characters/ophelia-cast-v2.webp',
 tree:'/assets/world/prop_tree_stone_reach_01.webp',lantern:'/assets/world/prop_lampiao.webp',crystal:'/assets/world/prop_cristal.webp',shelf:'/assets/world/prop_estante.webp',flowers:'/assets/world/prop_flores.webp',
 grass:'/assets/world/tile_grass.webp',paving:'/assets/world/tile_floor.webp',wall:'/assets/world/tile_wall.webp',water:'/assets/world/tile_agua_0.webp',stairs:'/assets/world/tile_stairs.webp',chest:'/assets/world/prop_bau_ferro.webp',
 battle_wolf_attack:'/assets/monsters/wolf-attack-v12.webp',battle_shadow_attack:'/assets/monsters/shadow-attack-v12.webp',battle_boss_attack:'/assets/monsters/boss-attack-v12.webp',
 wolf:'/assets/monsters/mob_wolf.webp',shadow:'/assets/monsters/mob_fantasma.png',
};
export const OBJECTIVES = [
 {title:'Um ruído sob a Academia',text:'Encontre Beatriz no pátio e descubra o que está acontecendo.',location:'Pátio Central',target:'beatriz'},
 {title:'A escada que não existe',text:'Entre na Academia e leia o registro no centro da biblioteca.',location:'Ala de Estudos',target:'livro'},
 {title:'O que espera ser lembrado',text:'Desça pela escada leste. Encontre a inscrição no subterrâneo.',location:'Subterrâneo Selado',target:'fragmento'},
 {title:'O Selo Quebrado',text:'Siga até a câmara ao sul e confronte o Selo. Descanse no cristal antes.',location:'Câmara do Selo',target:'selo'},
 {title:'Um silêncio comum',text:'Volte ao pátio e conte a Beatriz o que encontrou.',location:'Pátio Central',target:'beatriz'},
 {title:'Capítulo concluído',text:'Stone Reach está segura por esta noite. Você pode continuar explorando.',location:'Stone Reach',target:''},
];
export const HERO_IDS=['seiji','ophelia','marin','gabriel','max'] as const;
export type BaseHeroId=typeof HERO_IDS[number];
export type HeroId=BaseHeroId|'beatriz';
export const PLAYABLE_HERO_IDS:readonly HeroId[]=[...HERO_IDS,'beatriz'];
export type Hero={id:HeroId;name:string;element:string;role:string;maxHp:number;hp:number;maxMp:number;mp:number;atk:number;spd:number;guard:boolean};
export const heroBases=():Hero[]=>[
 {id:'seiji',name:'Seiji',element:'Tinta',role:'Escriba',maxHp:85,hp:85,maxMp:40,mp:40,atk:18,spd:15,guard:false},
 {id:'ophelia',name:'Ophelia',element:'Gelo',role:'Curandeira',maxHp:70,hp:70,maxMp:55,mp:55,atk:14,spd:13,guard:false},
 {id:'marin',name:'Marin',element:'Trevas',role:'Assassina',maxHp:75,hp:75,maxMp:50,mp:50,atk:20,spd:16,guard:false},
 {id:'gabriel',name:'Gabriel',element:'Fogo',role:'Guardião',maxHp:90,hp:90,maxMp:35,mp:35,atk:22,spd:11,guard:false},
 {id:'max',name:'Max',element:'Eletricidade',role:'Vanguarda',maxHp:80,hp:80,maxMp:45,mp:45,atk:19,spd:17,guard:false},
 {id:'beatriz',name:'Beatriz',element:'Água / Trevas',role:'Clériga de combate',maxHp:78,hp:78,maxMp:60,mp:60,atk:17,spd:14,guard:false},
];
export const newHeroes=()=>heroBases().slice(0,2);
export const SKILLS:Record<HeroId,{id:string;name:string;cost:number;description:string}[]>={marin:[{id:'eclipse',name:'Eclipse',cost:7,description:'34 de dano de Trevas.'},{id:'drain',name:'Sifão Sombrio',cost:11,description:'26 de dano e recupera 18 HP.'}],gabriel:[{id:'blaze',name:'Punho de Brasa',cost:7,description:'36 de dano de Fogo.'},{id:'bulwark',name:'Baluarte',cost:9,description:'Guarda todos os aliados contra o próximo golpe.'}],seiji:[{id:'cut',name:'Tinta Cortante',cost:6,description:'38 de dano de Tinta.'},{id:'stain',name:'Mancha Viva',cost:12,description:'26 de dano. Enfraquece o próximo golpe inimigo.'}],ophelia:[{id:'shard',name:'Estilhaço Glacial',cost:7,description:'32 de dano de Gelo.'},{id:'mend',name:'Orvalho',cost:9,description:'Restaura 36 HP de um aliado.'}],max:[{id:'voltcut',name:'Corte de Vajra',cost:7,description:'34 de dano elétrico.'},{id:'stormguard',name:'Guarda de Tempestade',cost:10,description:'Protege o grupo e remove cegueira.'}],beatriz:[{id:'tidecut',name:'Lâmina da Maré',cost:8,description:'36 de dano de Água.'},{id:'umbra-seal',name:'Selo Umbral',cost:12,description:'25 de dano de Trevas e cegueira por 2 ações.'},{id:'margem',name:'Margem Serena',cost:11,description:'Restaura 32 HP e remove estados de um aliado.'}]};

export const ORIGINS:Record<HeroId,{title:string;map:MapId;position:Point;lore:string;opening:string;hint:string}>= {
 seiji:{title:'A tinta que desperta',map:'patio',position:{x:14,y:12},lore:'A tinta de Seiji reage a uma memória enterrada sob a Academia. Ele precisa descobrir quem apagou a escada dos registros.',opening:'Meu pincel escreveu uma palavra que eu não conheço. A tinta aponta para baixo da Academia. Beatriz deve ter ouvido o mesmo ruído.',hint:'Fale com Seiji no Arquivo depois de ler o registro.'},
 ophelia:{title:'O inverno nas raízes',map:'domo',position:{x:12,y:12},lore:'No Domo, uma geada se forma nas raízes sem que Ophelia a tenha chamado. O frio parece responder a algo preso sob Stone Reach.',opening:'Eu não congelei estas raízes. Há uma pulsação vindo de baixo… Ava pediu que eu levasse o relato a Beatriz no Pátio.',hint:'Fale com Ophelia no Domo após aceitar a investigação de Beatriz.'},
 marin:{title:'A hora sem estrelas',map:'porto',position:{x:18,y:10},lore:'Marin chega ao Porto depois de deixar as passagens profundas. Não fala do passado, mas reconhece no ruído do selo um silêncio que tentou esquecer.',opening:'Eu deixei as passagens profundas. O ruído veio comigo até o cais. Se a Academia também o escuta, Beatriz talvez saiba onde ele começou.',hint:'Encontre Marin no acampamento da Mata Cindária.'},
 gabriel:{title:'A brasa que vigia',map:'ashwood',position:{x:12,y:10},lore:'Gabriel cresceu entre o som da forja e o calor da Mata Cindária. Uma brasa agora pulsa no ritmo do selo; para proteger o acampamento, ele precisa seguir esse eco.',opening:'A brasa está batendo como um coração. Preciso avisar Beatriz antes que esse calor alcance o acampamento. A trilha ao norte leva à Academia.',hint:'Derrote o lobo a leste da Mata Cindária e fale com Gabriel.'},
 max:{title:'O trovão que escolhe',map:'porto',position:{x:21,y:10},lore:'Max e Vajra rastreiam descargas sobre Porto Lúmina. O mesmo pulso que chama a lâmina de Max responde ao selo.',opening:'Vajra ouviu eletricidade debaixo da água. Não é tempestade. Se o selo está acordado, eu vou encontrá-lo.',hint:'Conclua a patrulha de Max ou vença o duelo elétrico no Porto.'},
 beatriz:{title:'A margem oculta',map:'patio',position:{x:10.8,y:11},lore:'A mestra da Academia guarda a memória das águas profundas de Stone Reach.',opening:'Uma margem para os nossos; a profundidade para vocês.',hint:'Exclusiva da Convocação do Éter 5★.'}
};
MAPS.arquivo.entities.push({id:'seiji',label:'Seiji · Escriba da Tinta',kind:'npc',x:8,y:12,asset:'seiji'});
MAPS.domo.entities.push({id:'ophelia',label:'Ophelia · Guardiã do Inverno',kind:'npc',x:8,y:11,asset:'ophelia'});

for(const hero of HERO_IDS)ASSETS[`battle_${hero}_ultimate`]=`/assets/characters/${hero}-ultimate-v17.webp`;

// Repeatable 15-second techniques reveal real, separate chests in the tile maps.
for(const [map,skill,x,y] of [['porto','ink-glyph',9,9],['galeria','ink-glyph',7,12],['domo','ice-bridge',8,11],['subsolo','ice-bridge',16,10],['porto','shadow-step',21,8],['galeria','shadow-step',10,9],['ashwood','ember-light',17,11],['domo','ember-light',15,12]] as const){
 const m=MAPS[map];const points=m.rows.flatMap((row,yy)=>[...row].map((t,xx)=>({t,x:xx,y:yy}))).filter(p=>!['#','w'].includes(p.t)&&p.x>1&&p.y>1&&!m.entities.some(e=>Math.hypot(e.x-p.x,e.y-p.y)<1.1)&&!m.props.some(o=>o.solid&&p.x>=o.solid[0]&&p.x<=o.solid[0]+o.solid[2]&&p.y>=o.solid[1]&&p.y<=o.solid[1]+o.solid[3])).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y));
 const at=points.find(p=>points.some(q=>q.x===p.x+1&&q.y===p.y));if(!at)continue;const id=`field-${map}-${skill}`;m.entities.push({id,x:at.x,y:at.y,kind:'rune',label:({'ink-glyph':'Marcas apagadas','ice-bridge':'Flores de geada','shadow-step':'Esconderijo de sombras','ember-light':'Cinzas frias'}[skill]),fieldSkill:skill},{id:`${id}-chest`,x:at.x+1,y:at.y,kind:'chest',label:'Tesouro revelado',fieldRequired:skill});
}

ASSETS.battle_vfx='/assets/v18/combat-vfx.webp';ASSETS.battle_phases='/assets/v18/boss-phases.webp';

export const COMPANIONS:Record<HeroId,{name:string;column:number;line:string}>={seiji:{name:'Shin',column:2,line:'A tinta de Seiji ainda guarda caminhos.'},ophelia:{name:'Mika',column:1,line:'O frio mostra aquilo que o medo tenta esconder.'},marin:{name:'Umbra',column:0,line:'A noite é mais educada quando se aprende a ouvi-la.'},gabriel:{name:'Dante',column:3,line:'A chama não se curva. Ela conduz.'},max:{name:'Vajra',column:4,line:'Vajra: eu vi o próximo relâmpago!'},beatriz:{name:'Stone Reach',column:0,line:'Toda margem existe porque a água escolhe um caminho.'}};
export const ENEMY_ULTIMATES:Record<string,{name:string;area:boolean;multiplier:number;status:'bleed'|'blind'|'freeze'|'silence'}>={
 lobo:{name:'Caçada da Alvorada',area:false,multiplier:1.65,status:'bleed'},sombra:{name:'Maré da Cegueira',area:true,multiplier:1.2,status:'blind'},ashwolf:{name:'Uivo da Cinza',area:true,multiplier:1.3,status:'bleed'},moth:{name:'Eclipse Lunar',area:true,multiplier:1.15,status:'freeze'},selo:{name:'Memória Estilhaçada',area:true,multiplier:1.5,status:'silence'},eco:{name:'Véu Sem Retorno',area:true,multiplier:1.5,status:'blind'},cinder:{name:'Sol da Pira',area:true,multiplier:1.6,status:'silence'}};
export const SKILL_VISUALS:Record<string,{hero:HeroId;row:number;rows:number;motion:string}>={};
for(const [hero,skills] of Object.entries({seiji:['cut','stain','blind','bleed'],ophelia:['shard','mend','freeze','cleanse'],marin:['eclipse','drain','darkveil','rupture','nightseal','shadowrest'],gabriel:['blaze','bulwark','flamewall','nova','ashseal','rekindle']}))skills.forEach((id,row)=>SKILL_VISUALS[id]={hero:hero as HeroId,row,rows:skills.length,motion:['projectile','bloom','veil','slash','seal','restore'][row]});
ASSETS.gabriel='/assets/v19/gabriel-walk.webp';
ASSETS.dlg_abel='/assets/v22/abel-5star.webp';
for(const id of ['seiji','ophelia','marin','gabriel'] as const)ASSETS[`battle_fx_${id}`]=`/assets/v19/${id}-vfx.webp`;

ASSETS.exits='/assets/v19/map-exits.webp';ASSETS.companions='/assets/v19/companions.webp';ASSETS.gabriel_lycan='/assets/v19/gabriel-lycan-walk.webp';ASSETS.dlg_gabriel_lycan='/assets/v19/gabriel-lycan-portrait.webp';
ASSETS.dlg_beatriz='/assets/v22/beatriz-5star.webp';
ASSETS.battle_beatriz_attack='/assets/v22/beatriz-combat.webp';
ASSETS.battle_beatriz_cast='/assets/v22/beatriz-combat.webp';
ASSETS.battle_beatriz_ultimate='/assets/v22/beatriz-combat.webp';
ASSETS.battle_fx_beatriz='/assets/v22/beatriz-vfx.webp';
for(const action of ['attack','cast','ultimate'])ASSETS[`battle_gabriel_lycan_${action}`]='/assets/v19/gabriel-lycan-combat.webp';
ASSETS.companions='/assets/v20/companions.webp';ASSETS.companions_combat='/assets/v20/companions-combat.webp';ASSETS.signboards='/assets/v20/signboards.webp';ASSETS.max='/assets/v21/max-walk-slender.png';ASSETS.dlg_max='/assets/v20/max-dialogue-black.webp';ASSETS.battle_max_attack='/assets/v21/max-combat-electric.png';ASSETS.battle_max_cast='/assets/v21/max-combat-electric.png';ASSETS.battle_max_ultimate='/assets/v21/max-combat-electric.png';
for(const family of Object.keys(ENEMY_ULTIMATES))ASSETS[`ultimate_${family}`]=`/assets/v20/ultimate-${family}.webp`;
