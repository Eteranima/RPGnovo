import type {BaseHeroId} from './data';

export const EVENT_ACTIVITY_IDS_V38=['puzzle','rhythm','arena'] as const;
export type EventActivityIdV38=typeof EVENT_ACTIVITY_IDS_V38[number];
export const EVENT_ACTIVITY_REWARDS_V38={puzzle:160,rhythm:160,arena:160,board:320} as const;
export const EVENT_ACTIVITIES_V38={
 puzzle:{name:'O Enigma dos Cinco Selos',host:'Shin e Umbra',description:'Organize os cinco selos pelas pistas do salão. Cada ensaio traz uma ordem nova; uma solução completa existe para todas as pistas.'},
 rhythm:{name:'O Compasso de Vajra',host:'Vajra e Mika',description:'Responda a cinco sinais visuais do baile. Quatro acertos completam o compasso; a alternativa por etapas tem o mesmo prêmio, sem exigir velocidade.'},
 arena:{name:'A Mesa das Máscaras',host:'Dante e os cinco guardiões',description:'Três escolhas, três posições e três provas. As cartas são emprestadas pelo baile; ninguém precisa convocar ou gastar recursos para jogar.'}
} as const;
export const SEALS_V38=['ink','ice','dark','fire','lightning'] as const;
export type SealV38=typeof SEALS_V38[number];
export const SEAL_NAMES_V38:Record<SealV38,string>={ink:'Página de Shin',ice:'Flor de Mika',dark:'Vigília de Umbra',fire:'Pena de Dante',lightning:'Prego de Vajra'};
export type SealClueV38={kind:'at';seal:SealV38;slot:number;text:string}|{kind:'before'|'adjacent';a:SealV38;b:SealV38;text:string;ordered?:boolean};
export type SealPuzzleV38={attempt:number;seed:number;board:(SealV38|null)[];submissions:number;status:'playing'|'won';feedback:string[]};
export type PuzzleProofV38={seed:number;board:SealV38[]};
export type RhythmModeV38='timed'|'accessible';
export type RhythmHitV38={cue:number;offset:number|null;quality:'perfect'|'good'|'miss'|'step'};
export type RhythmRunV38={attempt:number;mode:RhythmModeV38;hits:RhythmHitV38[];status:'ready'|'playing'|'won'|'lost'|'interrupted';feedback:string};
export type RhythmProofV38={mode:RhythmModeV38;hits:RhythmHitV38[]};
export const RHYTHM_CUES_V38=[
 {seal:'ink' as const,label:'Shin · Página',at:1200},{seal:'ice' as const,label:'Mika · Flor',at:2300},
 {seal:'dark' as const,label:'Umbra · Vigília',at:3700},{seal:'fire' as const,label:'Dante · Pena',at:4900},
 {seal:'lightning' as const,label:'Vajra · Prego',at:6400}
] as const;
export const RHYTHM_WINDOW_V38=250;
// Reserve room for cue arithmetic while supporting long browser suspension without losing valid hits.
export const RHYTHM_MAX_ELAPSED_V38=Number.MAX_SAFE_INTEGER-10000;
export type ArenaStanceV38='balanced'|'assault'|'guard';
export type ArenaDamageV38='physical'|'magic';
export type ArenaCardV38={id:string;hero:BaseHeroId;name:string;role:string;element:SealV38;hp:number;attack:number;speed:number;damage:ArenaDamageV38;ability:'silence'|'ward'|'heal'|'barrier'|'backstab'|'siphon'|'armor'|'protect'|'pierce'|'drain';description:string;artId:string;companion:string};
export type ArenaProofV38={round:number;cards:string[];stance:ArenaStanceV38};
export type ArenaRunV38={attempt:number;seed:number;draft:string[];lineup:(string|null)[];tradesLeft:number;round:number;stance:ArenaStanceV38;phase:'draft'|'prepare'|'review'|'won'|'lost';results:ArenaProofV38[]};
export type ArenaEnemyV38={id:string;hero:BaseHeroId;name:string;element:SealV38;hp:number;attack:number;speed:number;damage:ArenaDamageV38;target:'front'|'back'|'all';armor:number;description:string;artId:string};
export type ArenaBattleEventV38={actor:string;actorSide:'ally'|'enemy';kind:'attack'|'heal'|'control';target:string;value:number;remainingHp:number;text:string};
export type ArenaRoundResultV38={round:number;victory:boolean;cycles:number;events:ArenaBattleEventV38[];allies:{id:string;hp:number;maxHp:number}[];enemies:{id:string;hp:number;maxHp:number}[];synergies:string[]};
export type EventActivitiesProgressV38={version:1;attempts:Record<EventActivityIdV38,number>;puzzle:SealPuzzleV38|null;rhythm:RhythmRunV38|null;arena:ArenaRunV38|null;completed:{puzzle:PuzzleProofV38|null;rhythm:RhythmProofV38|null;arena:ArenaProofV38[]|null};claimed:Record<EventActivityIdV38,boolean>;boardClaimed:boolean};
const isObject=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);
const integer=(value:unknown,min:number,max:number)=>typeof value==='number'&&Number.isSafeInteger(value)&&value>=min&&value<=max;
const isSeal=(value:unknown):value is SealV38=>SEALS_V38.some(seal=>seal===value);
const isActivity=(value:unknown):value is EventActivityIdV38=>EVENT_ACTIVITY_IDS_V38.some(id=>id===value);
export const freshEventActivitiesV38=():EventActivitiesProgressV38=>({version:1,attempts:{puzzle:0,rhythm:0,arena:0},puzzle:null,rhythm:null,arena:null,completed:{puzzle:null,rhythm:null,arena:null},claimed:{puzzle:false,rhythm:false,arena:false},boardClaimed:false});
export function activitySeedV38(kind:EventActivityIdV38,attempt:number){return ((attempt+1)*2654435761+EVENT_ACTIVITY_IDS_V38.indexOf(kind)*1013904223)>>>0;}
function shuffle<T>(values:readonly T[],seed:number):T[]{const result=[...values];let state=seed||1;for(let i=result.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[result[i],result[j]]=[result[j],result[i]];}return result;}
function permutations<T>(values:readonly T[]):T[][]{if(!values.length)return [[]];return values.flatMap((value,i)=>permutations(values.filter((_,j)=>j!==i)).map(rest=>[value,...rest]));}
const allSealOrders=permutations(SEALS_V38);
export function sealClueSatisfiedV38(clue:SealClueV38,board:readonly (SealV38|null)[]){if(clue.kind==='at')return board[clue.slot]===clue.seal;const a=board.indexOf(clue.a),b=board.indexOf(clue.b);return a>=0&&b>=0&&(clue.kind==='before'?a<b:clue.ordered?b===a+1:Math.abs(a-b)===1);}
export function sealPuzzleCluesV38(seed:number):SealClueV38[]{
 const order=shuffle(SEALS_V38,seed),name=(seal:SealV38)=>SEAL_NAMES_V38[seal];
 const before=(a:SealV38,b:SealV38)=>({kind:'before' as const,a,b,text:`${name(a)} fica à esquerda de ${name(b)}.`});
 const adjacent=(a:SealV38,b:SealV38)=>({kind:'adjacent' as const,a,b,ordered:true,text:`${name(a)} fica imediatamente à esquerda de ${name(b)}.`});
 const clues:SealClueV38[]=[{kind:'at',seal:order[2],slot:2,text:`${name(order[2])} ocupa o centro, o terceiro lugar.`},adjacent(order[0],order[1]),adjacent(order[3],order[4]),before(order[1],order[3])];
 for(let index=clues.length-1;index>=0;index--){const reduced=clues.filter((_,i)=>i!==index);if(allSealOrders.filter(board=>reduced.every(clue=>sealClueSatisfiedV38(clue,board))).length===1)clues.splice(index,1);}
 return clues;
}
export function sealPuzzleSolvedV38(seed:number,board:readonly (SealV38|null)[]){return board.length===5&&board.every(isSeal)&&new Set(board).size===5&&sealPuzzleCluesV38(seed).every(clue=>sealClueSatisfiedV38(clue,board));}
export function newSealPuzzleV38(attempt:number):SealPuzzleV38{return {attempt,seed:activitySeedV38('puzzle',attempt),board:[null,null,null,null,null],submissions:0,status:'playing',feedback:[]};}
export function placeSealV38(run:SealPuzzleV38,seal:SealV38,slot:number){if(run.status==='won'||!isSeal(seal)||!integer(slot,0,4))return null;const board=[...run.board],prior=board.indexOf(seal);if(prior===slot)return null;if(prior>=0)board[prior]=board[slot];board[slot]=seal;return {...run,board,feedback:[]};}
export function submitSealPuzzleV38(run:SealPuzzleV38):SealPuzzleV38|null{if(run.status==='won')return null;if(run.board.some(seal=>!seal))return {...run,feedback:['Coloque os cinco selos antes de verificar.']};const clues=sealPuzzleCluesV38(run.seed),errors=clues.filter(clue=>!sealClueSatisfiedV38(clue,run.board));return {...run,submissions:run.submissions+1,status:errors.length?'playing':'won',feedback:errors.length?errors.map(clue=>'Confira esta pista: '+clue.text):['Os cinco selos respondem juntos. Shin preserva a ordem que você escolheu.']};}
export function newRhythmRunV38(attempt:number,mode:RhythmModeV38):RhythmRunV38{return {attempt,mode,hits:[],status:'playing',feedback:mode==='accessible'?'Responda a cada sinal na ordem, sem limite de tempo.':'Aguarde o sinal visual e responda uma vez.'};}
export function rhythmHitV38(run:RhythmRunV38,cue:number,elapsed:number):RhythmRunV38|null{
 if(run.status!=='playing'||!integer(cue,0,4)||cue!==run.hits.length||!Number.isFinite(elapsed)||elapsed<0)return null;
 const offset=run.mode==='accessible'?null:Math.round(Math.min(elapsed,RHYTHM_MAX_ELAPSED_V38)-RHYTHM_CUES_V38[cue].at),quality:RhythmHitV38['quality']=offset===null?'step':Math.abs(offset)<=90?'perfect':Math.abs(offset)<=RHYTHM_WINDOW_V38?'good':'miss';
 const hits=[...run.hits,{cue,offset,quality}],done=hits.length===5,won=done&&hits.filter(hit=>hit.quality!=='miss').length>=4;
 return {...run,hits,status:done?won?'won':'lost':'playing',feedback:done?won?'O compasso acolhe os cinco guardiões.':'O compasso escapou. Ensaie novamente sem gastar recursos.':quality==='miss'?'Fora do sinal; siga para o próximo.':quality==='step'?'Sinal recebido. O próximo está pronto.':quality==='perfect'?'No centro do compasso.':'Bom compasso.'};
}
export function advanceRhythmV38(run:RhythmRunV38,elapsed:number){let current=run;if(run.mode==='accessible'||!Number.isFinite(elapsed)||elapsed<0)return current;while(current.status==='playing'&&elapsed>RHYTHM_CUES_V38[current.hits.length].at+RHYTHM_WINDOW_V38)current=rhythmHitV38(current,current.hits.length,elapsed)!;return current;}

const cardArt:Record<BaseHeroId,string>={seiji:'seiji-last-script',ophelia:'ophelia-white-equinox',marin:'marin-starless-throne',gabriel:'gabriel-solar-oath',max:'max-thunder-requiem'};
const companions:Record<BaseHeroId,string>={seiji:'Shin',ophelia:'Mika',marin:'Umbra',gabriel:'Dante',max:'Vajra'};
const card=(id:string,hero:BaseHeroId,name:string,role:string,element:SealV38,hp:number,attack:number,speed:number,damage:ArenaDamageV38,ability:ArenaCardV38['ability'],description:string):ArenaCardV38=>({id,hero,name,role,element,hp,attack,speed,damage,ability,description,artId:cardArt[hero],companion:companions[hero]});
export const ARENA_CARDS_V38:ArenaCardV38[]=[
 card('seiji-scribe','seiji','Seiji · Escriba','Interdição','ink',22,6,6,'magic','silence','Cancela o primeiro ataque mágico inimigo da prova.'),
 card('seiji-ward','seiji','Seiji · Arquivista','Proteção mágica','ink',28,4,5,'magic','ward','Recebe 3 de dano mágico a menos. Na frente, resiste aos escribas.'),
 card('ophelia-healer','ophelia','Ophelia · Orvalho','Cura','ice',22,4,5,'magic','heal','Antes de atacar, restaura 4 HP do aliado mais ferido.'),
 card('ophelia-warden','ophelia','Ophelia · Geada','Barreira','ice',30,4,4,'physical','barrier','Na primeira ação, concede 6 de barreira ao aliado da frente.'),
 card('marin-assassin','marin','Marin · Sombra','Ataque à retaguarda','dark',22,7,7,'physical','backstab','Ataca o último inimigo vivo; pode alcançar conjuradores protegidos.'),
 card('marin-siphon','marin','Marin · Vigília','Sustentação','dark',26,5,5,'magic','siphon','Ao causar dano, recupera até 3 HP próprios.'),
 card('gabriel-bruiser','gabriel','Gabriel · Brasa','Dano físico','fire',34,6,4,'physical','armor','Recebe 2 de dano físico a menos.'),
 card('gabriel-guard','gabriel','Gabriel · Juramento','Proteção da frente','fire',38,4,3,'physical','protect','Na frente, reduz em 1 o dano recebido por qualquer aliado.'),
 card('max-lancer','max','Max · Prego','Perfuração','lightning',24,7,8,'magic','pierce','Ataca a retaguarda e ignora a armadura inimiga.'),
 card('max-architect','max','Max · Circuito','Interrupção','lightning',28,5,6,'magic','drain','Na primeira ação, reduz em 2 o ataque dos inimigos mágicos.'),
];
export const arenaCardV38=(id:string)=>ARENA_CARDS_V38.find(card=>card.id===id);
const enemy=(id:string,hero:BaseHeroId,name:string,element:SealV38,hp:number,attack:number,speed:number,damage:ArenaDamageV38,target:ArenaEnemyV38['target'],armor=0):ArenaEnemyV38=>({id,hero,name,element,hp,attack,speed,damage,target,armor,artId:cardArt[hero],description:`${damage==='magic'?'Magia':'Golpe físico'} · ${target==='all'?'todos os aliados':target==='back'?'retaguarda':'frente'} · ${attack} de dano base${armor?` · armadura ${armor}`:''}`});
export const ARENA_ROUNDS_V38=[
 {round:1,name:'A marcha das máscaras',plan:'Dois ecos físicos cercam frente e retaguarda.',counter:'Barreiras de Mika, proteção de Gabriel ou dano rápido ajudam a atravessar a marcha.',enemies:[enemy('r1-gabriel','gabriel','Eco da Brasa','fire',28,7,4,'physical','front',1),enemy('r1-marin','marin','Eco da Vigília','dark',22,5,6,'physical','back')]},
 {round:2,name:'A escrita que atravessa',plan:'A escrita atinge todos; a sombra alcança quem está atrás.',counter:'Shin interrompe a primeira magia; o Arquivista resiste a ela. Posicione uma carta resistente atrás.',enemies:[enemy('r2-seiji','seiji','Eco da Página','ink',26,5,6,'magic','all'),enemy('r2-marin','marin','Eco sem Estrelas','dark',22,6,5,'physical','back'),enemy('r2-ophelia','ophelia','Eco da Flor','ice',24,5,4,'magic','front')]},
 {round:3,name:'O último acorde do salão',plan:'Trovão coletivo, guarda da frente e corte na retaguarda.',counter:'Interrupção e guarda contêm o trovão; perfuração alcança a retaguarda. Reveja sua dupla elemental e as trocas restantes.',enemies:[enemy('r3-max','max','Eco do Último Acorde','lightning',30,7,7,'magic','all'),enemy('r3-gabriel','gabriel','Eco do Juramento','fire',42,7,3,'physical','front',2),enemy('r3-marin','marin','Eco da Última Hora','dark',24,8,6,'physical','back')]}
] as const;
export function arenaSynergiesV38(ids:readonly string[]){const result:SealV38[]=[];for(const seal of SEALS_V38)if(ids.filter(id=>arenaCardV38(id)?.element===seal).length>=2)result.push(seal);return result;}
export const ARENA_SYNERGY_NAMES_V38:Record<SealV38,string>={ink:'Duas páginas: mais uma magia inimiga interrompida',ice:'Duas flores: 4 de barreira para cada aliado',dark:'Duas vigílias: ataques restauram 2 HP próprios',fire:'Duas brasas: +2 de ataque para todo o grupo',lightning:'Dois pregos: +2 de dano encadeado ao segundo alvo'};
export function newArenaRunV38(attempt:number):ArenaRunV38{return {attempt,seed:activitySeedV38('arena',attempt),draft:[],lineup:[null,null,null],tradesLeft:2,round:1,stance:'balanced',phase:'draft',results:[]};}
export function arenaDraftOffersV38(run:ArenaRunV38){return shuffle(ARENA_CARDS_V38.filter(card=>!run.draft.includes(card.id)),(run.seed+run.draft.length*977)>>>0).slice(0,3);}
export function arenaTradeOffersV38(run:ArenaRunV38){return shuffle(ARENA_CARDS_V38.filter(card=>!run.lineup.includes(card.id)),(run.seed+run.round*151+run.tradesLeft*37)>>>0).slice(0,3);}
export function draftArenaCardV38(run:ArenaRunV38,id:string):ArenaRunV38|null{if(run.phase!=='draft'||run.draft.length>=3||!arenaDraftOffersV38(run).some(card=>card.id===id))return null;const draft=[...run.draft,id];return {...run,draft,lineup:[...draft,...Array(3-draft.length).fill(null)],phase:draft.length===3?'prepare':'draft'};}
export function positionArenaCardV38(run:ArenaRunV38,id:string,slot:number):ArenaRunV38|null{if(run.phase!=='prepare'||!integer(slot,0,2)||!run.lineup.includes(id))return null;const lineup=[...run.lineup],previous=lineup.indexOf(id);if(previous===slot)return null;[lineup[previous],lineup[slot]]=[lineup[slot],lineup[previous]];return {...run,lineup};}
export function tradeArenaCardV38(run:ArenaRunV38,slot:number,id:string):ArenaRunV38|null{if(run.phase!=='prepare'||run.tradesLeft<=0||!integer(slot,0,2)||!arenaTradeOffersV38(run).some(card=>card.id===id))return null;const lineup=[...run.lineup];lineup[slot]=id;return {...run,lineup,draft:lineup.filter((id):id is string=>!!id),tradesLeft:run.tradesLeft-1};}
type ArenaUnit={id:string;side:'ally'|'enemy';slot:number;hp:number;maxHp:number;attack:number;speed:number;damage:ArenaDamageV38;shield:number;card?:ArenaCardV38;enemy?:ArenaEnemyV38};
/** A visible deterministic rehearsal: no critical-hit, rarity, owned-deck or hidden win roll. */
export function resolveArenaRoundV38(round:number,ids:readonly string[],stance:ArenaStanceV38):ArenaRoundResultV38|null{
 const encounter=ARENA_ROUNDS_V38[round-1];if(!encounter||ids.length!==3||new Set(ids).size!==3||ids.some(id=>!arenaCardV38(id))||!['balanced','assault','guard'].includes(stance))return null;
 const synergy=arenaSynergiesV38(ids),events:ArenaBattleEventV38[]=[],allies:ArenaUnit[]=ids.map((id,slot)=>{const card=arenaCardV38(id)!;return {id,side:'ally',slot,hp:card.hp,maxHp:card.hp,attack:card.attack+(synergy.includes('fire')?2:0)+(stance==='assault'?2:stance==='guard'?-1:0),speed:card.speed,damage:card.damage,shield:synergy.includes('ice')?4:0,card};});
 const enemies:ArenaUnit[]=encounter.enemies.map((enemy,slot)=>({id:enemy.id,side:'enemy',slot,hp:enemy.hp,maxHp:enemy.hp,attack:enemy.attack,speed:enemy.speed,damage:enemy.damage,shield:0,enemy}));
 let silence=allies.filter(unit=>unit.card?.ability==='silence').length+(synergy.includes('ink')?1:0),cycles=0;
 const living=(side:'ally'|'enemy')=>(side==='ally'?allies:enemies).filter(unit=>unit.hp>0);
 const name=(unit:ArenaUnit)=>unit.card?.name||unit.enemy!.name;
 const heal=(actor:ArenaUnit,target:ArenaUnit,value:number)=>{const restored=Math.min(value,target.maxHp-target.hp);if(restored<=0||target.hp<=0)return;target.hp+=restored;events.push({actor:actor.id,actorSide:actor.side,kind:'heal',target:target.id,value:restored,remainingHp:target.hp,text:`${name(actor)} restaura ${restored} HP de ${name(target)}.`});};
 const hit=(actor:ArenaUnit,target:ArenaUnit,raw:number,pierce=false)=>{
  let reduction=target.enemy&&!pierce?target.enemy.armor:0;
  if(target.side==='ally'){if(stance==='guard')reduction+=2;if(target.card?.ability==='armor'&&actor.damage==='physical')reduction+=2;if(target.card?.ability==='ward'&&actor.damage==='magic')reduction+=3;if(living('ally').some(unit=>unit.slot===0&&unit.card?.ability==='protect'))reduction++;}
  const incoming=Math.max(1,raw+(target.side==='ally'&&stance==='assault'?1:0)-reduction),absorbed=Math.min(incoming,target.shield);target.shield-=absorbed;const damage=Math.min(target.hp,incoming-absorbed);target.hp-=damage;
  events.push({actor:actor.id,actorSide:actor.side,kind:'attack',target:target.id,value:damage,remainingHp:target.hp,text:`${name(actor)} atinge ${name(target)}: ${damage} HP${absorbed?` · barreira absorve ${absorbed}`:''}.`});return damage;
 };
 while(living('ally').length&&living('enemy').length&&cycles<8){cycles++;
  const initiative=[...allies,...enemies].filter(unit=>unit.hp>0).sort((a,b)=>b.speed-a.speed||(a.side===b.side?a.slot-b.slot:a.side==='enemy'?-1:1));
  for(const actor of initiative){if(actor.hp<=0||!living('ally').length||!living('enemy').length)continue;
   if(actor.side==='enemy'){
    if(actor.damage==='magic'&&silence>0){silence--;events.push({actor:actor.id,actorSide:'enemy',kind:'control',target:actor.id,value:0,remainingHp:actor.hp,text:`As páginas de Shin interrompem a magia de ${name(actor)}.`});continue;}
    const targets=living('ally'),chosen=actor.enemy!.target==='all'?targets:[actor.enemy!.target==='back'?targets.at(-1)!:targets[0]];for(const target of chosen)hit(actor,target,actor.attack);continue;
   }
   const ability=actor.card!.ability;
   if(ability==='heal'){const weakest=[...living('ally')].sort((a,b)=>(b.maxHp-b.hp)-(a.maxHp-a.hp)||a.slot-b.slot)[0];heal(actor,weakest,4);}
   if(cycles===1&&ability==='barrier'){const front=living('ally')[0];front.shield+=6;events.push({actor:actor.id,actorSide:'ally',kind:'control',target:front.id,value:6,remainingHp:front.hp,text:`${name(actor)} concede 6 de barreira à frente.`});}
   if(cycles===1&&ability==='drain'){const casters=living('enemy').filter(unit=>unit.damage==='magic');for(const unit of casters)unit.attack=Math.max(1,unit.attack-2);if(casters.length)events.push({actor:actor.id,actorSide:'ally',kind:'control',target:casters[0].id,value:2,remainingHp:casters[0].hp,text:'Vajra reduz em 2 o ataque das cartas mágicas inimigas.'});}
   const targets=living('enemy'),target=ability==='backstab'||ability==='pierce'?targets.at(-1)!:targets[0],damage=hit(actor,target,actor.attack,ability==='pierce');
   if(damage>0){if(ability==='siphon')heal(actor,actor,3);if(synergy.includes('dark'))heal(actor,actor,2);if(synergy.includes('lightning')){const chain=living('enemy').find(unit=>unit.id!==target.id);if(chain)hit(actor,chain,2,true);}}
  }
 }
 return {round,victory:living('enemy').length===0&&living('ally').length>0,cycles,events,allies:allies.map(unit=>({id:unit.id,hp:unit.hp,maxHp:unit.maxHp})),enemies:enemies.map(unit=>({id:unit.id,hp:unit.hp,maxHp:unit.maxHp})),synergies:synergy.map(seal=>ARENA_SYNERGY_NAMES_V38[seal])};
}
export function resolveArenaRunV38(run:ArenaRunV38):ArenaRunV38|null{if(run.phase!=='prepare'||run.lineup.some(id=>!id))return null;const proof={round:run.round,cards:run.lineup as string[],stance:run.stance},result=resolveArenaRoundV38(proof.round,proof.cards,proof.stance);if(!result)return null;return {...run,results:[...run.results,proof],phase:result.victory?run.round===3?'won':'review':'lost'};}
export function continueArenaV38(run:ArenaRunV38):ArenaRunV38|null{return run.phase==='review'&&run.round<3?{...run,round:run.round+1,phase:'prepare'}:null;}

function puzzleProof(value:unknown):PuzzleProofV38|null{if(!isObject(value)||!integer(value.seed,0,0xffffffff)||!Array.isArray(value.board)||!sealPuzzleSolvedV38(Number(value.seed),value.board))return null;return {seed:Number(value.seed),board:[...value.board] as SealV38[]};}
function rhythmHits(value:unknown,mode:RhythmModeV38):RhythmHitV38[]|null{
 if(!Array.isArray(value)||value.length>5)return null;const hits:RhythmHitV38[]=[];let prior=-1;
 for(let index=0;index<value.length;index++){const hit=value[index];if(!isObject(hit)||hit.cue!==index)return null;
  if(mode==='accessible'){if(hit.offset!==null||hit.quality!=='step')return null;hits.push({cue:index,offset:null,quality:'step'});continue;}
  if(!integer(hit.offset,-RHYTHM_CUES_V38[index].at,RHYTHM_MAX_ELAPSED_V38-RHYTHM_CUES_V38[index].at))return null;const offset=Number(hit.offset),elapsed=RHYTHM_CUES_V38[index].at+offset,quality=Math.abs(offset)<=90?'perfect':Math.abs(offset)<=RHYTHM_WINDOW_V38?'good':'miss';if(elapsed<prior||elapsed<0||hit.quality!==quality)return null;prior=elapsed;hits.push({cue:index,offset,quality});
 }return hits;
}
function rhythmProof(value:unknown):RhythmProofV38|null{if(!isObject(value)||!['timed','accessible'].includes(String(value.mode)))return null;const mode=value.mode as RhythmModeV38,hits=rhythmHits(value.hits,mode);return hits?.length===5&&hits.filter(hit=>hit.quality!=='miss').length>=4?{mode,hits}:null;}
function arenaProofs(value:unknown):ArenaProofV38[]|null{
 if(!Array.isArray(value)||value.length>3)return null;const result:ArenaProofV38[]=[];
 for(let index=0;index<value.length;index++){const proof=value[index];if(!isObject(proof)||proof.round!==index+1||!Array.isArray(proof.cards)||!['balanced','assault','guard'].includes(String(proof.stance)))return null;const battle=resolveArenaRoundV38(index+1,proof.cards,proof.stance as ArenaStanceV38);if(!battle)return null;result.push({round:index+1,cards:[...proof.cards],stance:proof.stance as ArenaStanceV38});}
 return result;
}
function wonArenaProof(value:unknown){const result=arenaProofs(value);return result?.length===3&&result.every(proof=>resolveArenaRoundV38(proof.round,proof.cards,proof.stance)!.victory)?result:null;}
/** Invalid new activity fields reset locally; existing campaign progress is never rejected or rewarded. */
export function normalizeEventActivitiesV38(value:unknown):EventActivitiesProgressV38{
 const result=freshEventActivitiesV38();if(!isObject(value)||value.version!==1)return result;
 for(const kind of EVENT_ACTIVITY_IDS_V38)if(isObject(value.attempts)&&integer(value.attempts[kind],0,1000000))result.attempts[kind]=Number(value.attempts[kind]);
 if(isObject(value.completed)){result.completed.puzzle=puzzleProof(value.completed.puzzle);result.completed.rhythm=rhythmProof(value.completed.rhythm);result.completed.arena=wonArenaProof(value.completed.arena);}
 for(const kind of EVENT_ACTIVITY_IDS_V38)result.claimed[kind]=!!result.completed[kind]&&isObject(value.claimed)&&value.claimed[kind]===true;
 result.boardClaimed=EVENT_ACTIVITY_IDS_V38.every(kind=>!!result.completed[kind])&&value.boardClaimed===true;
 const p=value.puzzle;
 if(isObject(p)&&p.attempt===result.attempts.puzzle&&p.seed===activitySeedV38('puzzle',Number(p.attempt))&&Array.isArray(p.board)&&p.board.length===5&&p.board.every(seal=>seal===null||isSeal(seal))&&new Set(p.board.filter(Boolean)).size===p.board.filter(Boolean).length&&integer(p.submissions,0,1000000)){
  const base=newSealPuzzleV38(Number(p.attempt));base.board=[...p.board];base.submissions=Number(p.submissions);base.status=base.submissions>0&&sealPuzzleSolvedV38(base.seed,base.board)?'won':'playing';base.feedback=base.status==='won'?['Os cinco selos respondem juntos.']:[];result.puzzle=base;
 }
 const r=value.rhythm;
 if(isObject(r)&&r.attempt===result.attempts.rhythm&&['timed','accessible'].includes(String(r.mode))){const mode=r.mode as RhythmModeV38,hits=rhythmHits(r.hits,mode);if(hits){const proof=rhythmProof({mode,hits});result.rhythm={attempt:Number(r.attempt),mode,hits,status:proof?'won':hits.length===5?'lost':'interrupted',feedback:proof?'Compasso concluído.':hits.length===5?'Ensaie novamente sem gastar recursos.':'O ensaio foi interrompido. Reinicie o relógio ou use a alternativa por etapas.'};}}
 const a=value.arena;
 if(isObject(a)&&a.attempt===result.attempts.arena&&a.seed===activitySeedV38('arena',Number(a.attempt))&&Array.isArray(a.draft)&&a.draft.length<=3&&a.draft.every(id=>typeof id==='string'&&arenaCardV38(id))&&new Set(a.draft).size===a.draft.length&&Array.isArray(a.lineup)&&a.lineup.length===3&&a.lineup.every(id=>id===null||typeof id==='string'&&arenaCardV38(id))&&new Set(a.lineup.filter(Boolean)).size===a.lineup.filter(Boolean).length&&integer(a.tradesLeft,0,2)&&integer(a.round,1,3)&&['balanced','assault','guard'].includes(String(a.stance))){
  const results=arenaProofs(a.results),round=Number(a.round),draft=[...a.draft] as string[],lineup=[...a.lineup] as (string|null)[];
  if(results&&results.slice(0,-1).every(proof=>resolveArenaRoundV38(proof.round,proof.cards,proof.stance)!.victory)){
   const last=results.at(-1),lastWon=last&&resolveArenaRoundV38(last.round,last.cards,last.stance)!.victory;
   const phase:ArenaRunV38['phase']=draft.length<3?'draft':last&&last.round===round?lastWon?round===3?'won':'review':'lost':'prepare';
   if(draft.length<3&&round===1&&results.length===0&&lineup.filter(Boolean).join()===draft.join()||draft.length===3&&lineup.every(Boolean)&&new Set([...draft,...lineup]).size===3&&(results.length===round-1&&(!last||lastWon)||results.length===round))result.arena={attempt:Number(a.attempt),seed:Number(a.seed),draft,lineup,tradesLeft:Number(a.tradesLeft),round,stance:a.stance as ArenaStanceV38,phase,results};
  }
 }
 return result;
}
export function activityCompletedV38(progress:EventActivitiesProgressV38,kind:EventActivityIdV38){return !!progress.completed[kind];}
export function pendingActivityRewardsV38(progress:EventActivitiesProgressV38){return EVENT_ACTIVITY_IDS_V38.filter(kind=>activityCompletedV38(progress,kind)&&!progress.claimed[kind]).length+(EVENT_ACTIVITY_IDS_V38.every(kind=>activityCompletedV38(progress,kind))&&!progress.boardClaimed?1:0);}
export function completeActivityV38(progress:EventActivitiesProgressV38,kind:EventActivityIdV38):EventActivitiesProgressV38{
 const next=structuredClone(progress);if(next.completed[kind])return next;
 if(kind==='puzzle'&&next.puzzle?.status==='won')next.completed.puzzle=puzzleProof(next.puzzle);
 if(kind==='rhythm'&&next.rhythm?.status==='won')next.completed.rhythm=rhythmProof(next.rhythm);
 if(kind==='arena'&&next.arena?.phase==='won')next.completed.arena=wonArenaProof(next.arena.results);
 return next;
}
export function claimActivityRewardV38(progress:EventActivitiesProgressV38,kind:EventActivityIdV38|'board'){
 if(kind==='board'){if(progress.boardClaimed||!EVENT_ACTIVITY_IDS_V38.every(id=>activityCompletedV38(progress,id)))return null;return {progress:{...progress,boardClaimed:true},crystals:EVENT_ACTIVITY_REWARDS_V38.board};}
 if(!isActivity(kind)||progress.claimed[kind]||!activityCompletedV38(progress,kind))return null;return {progress:{...progress,claimed:{...progress.claimed,[kind]:true}},crystals:EVENT_ACTIVITY_REWARDS_V38[kind]};
}
export type EventActivitySessionV38={kind:EventActivityIdV38;token:number};
export type EventActivitiesViewV38={
 unlocked:boolean;lockedReason:string|null;rewards:typeof EVENT_ACTIVITY_REWARDS_V38;pendingRewards:number;progress:EventActivitiesProgressV38;session:EventActivitySessionV38|null;
 puzzle:(SealPuzzleV38&{clues:SealClueV38[]})|null;
 rhythm:(RhythmRunV38&{elapsedMs:number;cueIndex:number;running:boolean;cues:typeof RHYTHM_CUES_V38;windowMs:number})|null;
 arena:(ArenaRunV38&{offers:ArenaCardV38[];market:ArenaCardV38[];encounter:typeof ARENA_ROUNDS_V38[number];synergies:string[];lastBattle:ArenaRoundResultV38|null})|null;
};
