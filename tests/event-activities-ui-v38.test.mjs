import assert from 'node:assert/strict';
import {readFileSync,existsSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import * as React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';
import {compileGameModules} from './game-module-loader.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-event-ui-v38-')),require=createRequire(import.meta.url);
compileGameModules(out,['engine','eventActivitiesV38','sprites','heroCardArt','heroUiNameV36']);
const load=name=>import(pathToFileURL(join(out,name+'.js')).href);
const {GameEngine,SAVE_KEY,parseSave}=await load('engine'),data=await load('data'),activities=await load('eventActivitiesV38'),variants=await load('variantsV36'),variantArt=await load('variantArtV36'),sprites=await load('sprites'),cardArt=await load('heroCardArt'),heroNames=await load('heroUiNameV36');
const storage=new Map();globalThis.localStorage={getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)};
const originalTimeout=globalThis.setTimeout,originalPerformance=globalThis.performance;
globalThis.setTimeout=()=>1;let clock=1000;Object.defineProperty(globalThis,'performance',{value:{now:()=>clock},configurable:true});
let interactive=false,selection=null,effects=[];
const reactRuntime={...React,useState(initial){if(!interactive)return React.useState(initial);const value=initial===null?selection:typeof initial==='function'?initial():initial;return [value,next=>{if(initial===null)selection=typeof next==='function'?next(selection):next;}];},useEffect(effect,deps){if(!interactive)return React.useEffect(effect,deps);effects.push(effect);},useRef(initial){return interactive?{current:initial}:React.useRef(initial);}};
const style=new Proxy({},{get:(_target,key)=>String(key)}),modules={'@/lib/game/data':data,'@/lib/game/eventActivitiesV38':activities,'@/lib/game/variantsV36':variants,'@/lib/game/variantArtV36':variantArt,'@/lib/game/sprites':sprites};
function compile(path){const exports={};new Function('require','exports',ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText)(id=>{if(id==='react')return reactRuntime;if(id==='react/jsx-runtime')return require(id);if(id.endsWith('.module.css'))return {__esModule:true,default:style};if(!modules[id])throw Error('Unexpected dependency '+id);return modules[id];},exports);return exports;}
modules['@/lib/art/companionsV31']=compile('lib/art/companionsV31.ts');modules['@/lib/art/nativeSpriteViewport']=compile('lib/art/nativeSpriteViewport.ts');modules['./native-sprite-portrait']=compile('components/native-sprite-portrait.tsx');modules['./companion-portrait']=compile('components/companion-portrait.tsx');
modules['@/lib/game/heroCardArt']=cardArt;modules['@/lib/game/heroUiNameV36']=heroNames;modules['@/components/ui/progress']={Progress:props=>React.createElement('div',props)};modules['./hero-card']=compile('components/hero-card.tsx');
const ui=compile('components/event-activities-v38.tsx');
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks++;},eq=(value,expected,message)=>{assert.deepEqual(value,expected,message);checks++;};
function expand(tree){if(!tree||typeof tree!=='object')return tree;if(typeof tree.type==='function')return expand(tree.type(tree.props));return tree.props?.children===undefined?tree:{...tree,props:{...tree.props,children:[tree.props.children].flat(Infinity).map(expand)}};}
function find(tree,predicate,result=[]){if(!tree||typeof tree!=='object')return result;if(predicate(tree))result.push(tree);for(const child of [tree.props?.children].flat(Infinity))find(child,predicate,result);return result;}
const text=tree=>typeof tree==='string'||typeof tree==='number'?String(tree):tree?.props?.children===undefined?'':[tree.props.children].flat(Infinity).map(text).join('');
const e=new GameEngine();e.start(false,'seiji');e.finishCutscene();e.state.mode='world';
const props=()=>({s:e.snapshot(),engine:e}),panelProps=()=>({view:e.eventActivitiesV38(),engine:e,disabled:false});
const render=(Component,componentProps)=>{interactive=false;return renderToStaticMarkup(React.createElement(Component,componentProps));};
const tree=(Component,componentProps)=>{interactive=true;effects=[];return expand(Component(componentProps));};
const button=(tree,match)=>find(tree,node=>node.type==='button'&&match(node))[0];
const click=(Component,componentProps,match)=>{const node=button(tree(Component,componentProps),match);ok(!!node,'requested production button exists');ok(!node.props.disabled,'requested production button is enabled');node.props.onClick();return node;};

let html=render(ui.EventActivitiesV38,props());ok(html.includes('Aceite o convite')&&!html.includes('data-activity-start'),'locked activities clearly explain their invitation gate');
ok(e.startBloodMoonEventV36(),'ordinary starter accepts the event invitation');html=render(ui.EventActivitiesV38,props());eq((html.match(/data-activity-start=/g)||[]).length,3,'exactly three event activities are discoverable');ok(html.includes('160')&&html.includes('320')&&html.includes('Complete as três atividades'),'real single and board reward amounts are explained');
for(const seal of activities.SEALS_V38){const art=ui.eventSealArtV38(seal);ok(existsSync('public'+art.src),seal+' uses a real final elemental icon');const companion=variants.variantCompanionV36(art.artId);ok(companion&&existsSync('public'+data.ASSETS[companion.key]),'canonical event companion has a native sheet');ok(sprites.SPRITE_FRAMES[companion.key]?.[0]&&variantArt.COMPANION_SIZES_V36[companion.variantId],'companion has a measured crop and dimensions');}
const salon=readFileSync('public/assets/v38/event-activities/salon.png');eq([salon.readUInt32BE(16),salon.readUInt32BE(20)],[1672,941],'final salon retains native dimensions');eq(createHash('sha256').update(salon).digest('hex'),'4d3aa3798fa425354ea8005171fb319c423a60473b423f3732a8d3184717ace7','salon is the approved native source, not a substituted placeholder');
const initial={party:[...e.state.progress.party],heroes:structuredClone(e.state.heroes),summoned:[...e.state.progress.summoned],rolls:e.state.progress.characterRolls,crystals:e.state.progress.crystals};
click(ui.EventActivitiesV38,props(),node=>node.props['data-activity-start']==='puzzle');ok(e.eventActivitiesV38().session?.kind==='puzzle','overview callback opens the real puzzle');
const seed=e.eventActivitiesV38().puzzle.seed;
const permutations=values=>values.length?values.flatMap((value,index)=>permutations(values.filter((_,i)=>i!==index)).map(rest=>[value,...rest])):[[]];
const solution=permutations(activities.SEALS_V38).find(board=>activities.sealPuzzleSolvedV38(seed,board));ok(solution,'generated puzzle has a unique legal solution');
for(let slot=0;slot<5;slot++){
 click(ui.SealPuzzlePanelV38,panelProps(),node=>node.props['aria-label']==='Escolher '+activities.SEAL_NAMES_V38[solution[slot]]);
 click(ui.SealPuzzlePanelV38,panelProps(),node=>node.props['aria-label']?.startsWith('Lugar '+(slot+1)));
}
eq(e.eventActivitiesV38().puzzle.board,solution,'five real UI placement callbacks preserve seal identity and slot order');
click(ui.SealPuzzlePanelV38,panelProps(),node=>text(node)==='Limpar os lugares');eq(e.eventActivitiesV38().puzzle.board,[null,null,null,null,null],'reset clears positions through the engine');eq(e.eventActivitiesV38().puzzle.seed,seed,'reset preserves the same clues');
const wrong=[...solution].reverse();for(let slot=0;slot<5;slot++){selection=wrong[slot];click(ui.SealPuzzlePanelV38,panelProps(),node=>node.props['aria-label']?.startsWith('Lugar '+(slot+1)));}
click(ui.SealPuzzlePanelV38,panelProps(),node=>text(node)==='Verificar os selos');html=render(ui.SealPuzzlePanelV38,panelProps());ok(html.includes('Confira esta pista')&&!html.includes('Receber 160 cristais'),'wrong arrangement produces actual clue feedback, not a reward');
for(let slot=0;slot<5;slot++){selection=solution[slot];click(ui.SealPuzzlePanelV38,panelProps(),node=>node.props['aria-label']?.startsWith('Lugar '+(slot+1)));}
click(ui.SealPuzzlePanelV38,panelProps(),node=>text(node)==='Verificar os selos');ok(e.eventActivitiesV38().progress.completed.puzzle,'correct arrangement records real proof');
html=render(ui.SealPuzzlePanelV38,panelProps());ok(html.includes('Receber 160 cristais')&&html.includes('harmonia'),'puzzle victory clearly exposes its earned claim');click(ui.SealPuzzlePanelV38,panelProps(),node=>node.props['aria-label']?.startsWith('Receber 160 cristais'));eq(e.state.progress.crystals,initial.crystals+160,'puzzle claim pays exactly once');ok(render(ui.SealPuzzlePanelV38,panelProps()).includes('Recompensa recebida'),'claimed UI replaces the payout button');
click(ui.EventActivitiesV38,props(),node=>text(node)==='Voltar às atividades');ok(!e.eventActivitiesV38().session,'return clears only the activity session');

click(ui.EventActivitiesV38,props(),node=>node.props['data-activity-start']==='rhythm');html=render(ui.EventRhythmPanelV38,panelProps());ok(html.includes('por etapas')&&html.includes('sem tempo')&&html.includes('mesmo prêmio'),'accessible mode is explicit and has equal reward');
click(ui.EventRhythmPanelV38,panelProps(),node=>text(node).includes('Jogar por etapas'));for(let cue=0;cue<5;cue++){clock+=4000;click(ui.EventRhythmPanelV38,panelProps(),node=>node.props['aria-label']?.startsWith('Responder ao sinal '+(cue+1)));}
ok(e.eventActivitiesV38().progress.completed.rhythm?.mode==='accessible','no-reflex mode completes through the real five cue callbacks');click(ui.EventRhythmPanelV38,panelProps(),node=>node.props['aria-label']?.startsWith('Receber 160 cristais'));eq(e.state.progress.crystals,initial.crystals+320,'accessible rhythm pays the same single reward');
click(ui.EventRhythmPanelV38,panelProps(),node=>text(node).includes('Jogar no compasso'));let running=tree(ui.EventRhythmPanelV38,panelProps()),staleButton=button(running,node=>node.props['aria-label']?.startsWith('Responder ao sinal')),oldToken=e.eventActivitiesV38().session.token;
const raf=new Map(),listeners=new Map();let frameId=0;globalThis.requestAnimationFrame=callback=>{raf.set(++frameId,callback);return frameId;};globalThis.cancelAnimationFrame=id=>raf.delete(id);globalThis.document={hidden:false,addEventListener:(name,callback)=>listeners.set(name,callback),removeEventListener:(name,callback)=>{if(listeners.get(name)===callback)listeners.delete(name);}};
const tickerEffect=effects[1],cleanup=tickerEffect();ok(raf.size===1,'timed panel schedules one visual clock using the real engine session');const staleFrame=[...raf.values()][0];raf.clear();
e.cancelEventActivityV38();e.beginEventActivityV38('rhythm');e.startEventRhythmV38(false);ok(e.eventActivitiesV38().session.token!==oldToken,'new clock receives a new token');staleButton.props.onClick();eq(e.eventActivitiesV38().rhythm.hits.length,0,'stale responder cannot score in a new session');staleFrame();eq(raf.size,0,'stale rAF exits instead of touching a new clock');document.hidden=true;listeners.get('visibilitychange')?.();ok(e.eventActivitiesV38().session,'stale visibility handler cannot cancel a newer session');cleanup();document.hidden=false;
const start=clock;for(let cue=0;cue<5;cue++){clock=start+activities.RHYTHM_CUES_V38[cue].at;click(ui.EventRhythmPanelV38,panelProps(),node=>node.props['aria-label']?.startsWith('Responder ao sinal '+(cue+1)));}eq(e.eventActivitiesV38().rhythm.status,'won','timed UI callbacks hit the actual performance clock');ok(e.eventActivitiesV38().rhythm.hits.every(hit=>hit.quality==='perfect'),'native timestamps align with the signal window');ok(!e.claimEventActivityV38('rhythm'),'training cannot pay a second rhythm reward');e.cancelEventActivityV38();

click(ui.EventActivitiesV38,props(),node=>node.props['data-activity-start']==='arena');
for(const seal of activities.SEALS_V38){const card=activities.ARENA_CARDS_V38.find(card=>card.element===seal),nativeView=e.eventActivitiesV38();nativeView.arena.offers=[card];html=render(ui.EventArenaPanelV38,{...panelProps(),view:nativeView});ok(html.includes(`data-seal="${seal}"`),'borrowed card exposes its real seal identity');ok(html.includes(data.ASSETS['face_'+card.artId])&&html.includes(cardArt.HERO_CARD_ART[card.hero].ring),'card renders its native variant face inside its measured family ornament');}
const dead=new Set();
function searchRounds(run){
 const key=[run.round,[...run.lineup].sort().join(','),run.tradesLeft].join('|');if(dead.has(key))return null;
 for(const lineup of permutations(run.lineup))for(const stance of ['guard','balanced','assault']){
  const prepared={...run,lineup,stance},resolved=activities.resolveArenaRunV38(prepared);if(!resolved||resolved.phase==='lost')continue;
  const step={round:run.round,lineup,stance,trades:[]};if(resolved.phase==='won')return [step];
  const later=searchRounds(activities.continueArenaV38(resolved));if(later)return [step,...later];
 }
 if(run.tradesLeft>0)for(const card of activities.arenaTradeOffersV38(run))for(let slot=0;slot<3;slot++){
  const traded=activities.tradeArenaCardV38(run,slot,card.id),route=searchRounds(traded);if(route)return [{...route[0],trades:[{slot,id:card.id},...route[0].trades]},...route.slice(1)];
 }
 dead.add(key);return null;
}
function searchDraft(run){if(run.draft.length<3){for(const card of activities.arenaDraftOffersV38(run)){const route=searchDraft(activities.draftArenaCardV38(run,card.id));if(route)return route;}return null;}const rounds=searchRounds(run);return rounds?{draft:run.draft,rounds}:null;}
const route=searchDraft(e.eventActivitiesV38().progress.arena);ok(route,'current legal offers admit a real winning preparation');
for(const id of route.draft)click(ui.EventArenaPanelV38,panelProps(),node=>node.props['aria-label']==='Escolher '+activities.arenaCardV38(id).name);
for(let round=1;round<=3;round++){
 const plan=route.rounds[round-1];
 for(const trade of plan.trades){const currentTree=tree(ui.EventArenaPanelV38,panelProps()),market=find(currentTree,node=>node.type==='details'&&node.props.className==='market')[0],select=find(market,node=>node.type==='select')[0];select.props.onChange({target:{value:String(trade.slot)}});/* The native select state is injected only to drive its actual trade callback. */interactive=true;const oldState=reactRuntime.useState;reactRuntime.useState=initial=>initial===0?[trade.slot,()=>{}]:oldState(initial);try{click(ui.EventArenaPanelV38,panelProps(),node=>node.props['aria-label']==='Trocar '+['Frente','Centro','Retaguarda'][trade.slot]+' por '+activities.arenaCardV38(trade.id).name);}finally{reactRuntime.useState=oldState;}}
 for(let slot=0;slot<3;slot++){const id=plan.lineup[slot],currentTree=tree(ui.EventArenaPanelV38,panelProps()),card=find(currentTree,node=>node.props['data-arena-card']===id)[0],select=find(card,node=>node.type==='select')[0];ok(!!select,'drafted card exposes an accessible position selector');select.props.onChange({target:{value:String(slot)}});}
 click(ui.EventArenaPanelV38,panelProps(),node=>node.props['aria-pressed']!==undefined&&text(node)==={balanced:'Equilíbrio',assault:'Investida',guard:'Guarda'}[plan.stance]);eq(e.eventActivitiesV38().arena.lineup,plan.lineup,'position callbacks set the intended legal formation');
 html=render(ui.EventArenaPanelV38,panelProps());ok(html.includes(e.eventActivitiesV38().arena.encounter.plan),'adversary plan is visible before the real proof');
 click(ui.EventArenaPanelV38,panelProps(),node=>text(node)==='Iniciar prova '+round);const view=e.eventActivitiesV38(),result=view.arena.lastBattle,unchanged=JSON.stringify(e.state.progress);
 ok(result.victory&&result.events.length>0,'core resolves an actual winning encounter with HP events');
 const final=ui.arenaReplaySnapshotV38(result,result.events.length);for(const unit of [...result.allies,...result.enemies])eq(final[unit.id],unit.hp,'recorded replay reconstructs exact final HP');
 const origin=ui.arenaReplaySnapshotV38(result,0);for(const unit of [...result.allies,...result.enemies])eq(origin[unit.id],unit.maxHp,'replay starts each proof at full native card HP');
 render(ui.ArenaResolutionV38,{result,encounter:view.arena.encounter});eq(JSON.stringify(e.state.progress),unchanged,'rendering and replaying a result never apply damage or rewards again');
 if(round<3)click(ui.EventArenaPanelV38,panelProps(),node=>text(node)==='Preparar prova '+(round+1));
}
ok(render(ui.EventArenaPanelV38,panelProps()).includes('As três provas foram vencidas'),'all-three victory is reported only after the real final round');click(ui.EventArenaPanelV38,panelProps(),node=>node.props['aria-label']?.startsWith('Receber 160 cristais'));e.cancelEventActivityV38();
// Drive the production replay hooks; these callbacks only read the recorded battle.
const replayResult=activities.resolveArenaRoundV38(2,['ophelia-healer','seiji-scribe','marin-siphon'],'guard'),replayInput=JSON.stringify(replayResult),progressBeforeReplay=JSON.stringify(e.state.progress),replayEncounter=activities.ARENA_ROUNDS_V38[1];
function resolutionState(result,encounter,{cursor=0,playing=false,reduced=true}={}){
 const values=[reduced,cursor,playing],originalState=reactRuntime.useState;let index=0;
 const renderTree=()=>{index=0;reactRuntime.useState=initial=>{const slot=index++;return [values[slot],next=>{values[slot]=typeof next==='function'?next(values[slot]):next;}];};try{return tree(ui.ArenaResolutionV38,{result,encounter});}finally{reactRuntime.useState=originalState;}};
 return {values,render:renderTree};
}
const paused=resolutionState(replayResult,replayEncounter),initialReplay=paused.render();ok(text(initialReplay).includes('Resolução em andamento')&&!text(initialReplay).includes('Prova vencida'),'initial replay never reveals a final result before its first movement');
eq(find(initialReplay,node=>node.props['data-fallen']).length,0,'full-HP initial record has no defeated portraits');
const step=button(initialReplay,node=>text(node)==='Próximo movimento');ok(step,'reduced motion provides an explicit movement control');step.props.onClick();eq(paused.values[1],1,'manual step advances exactly one recorded event');eq(paused.values[2],false,'manual reduced-motion step stays paused');
for(const kind of ['attack','heal','control']){
 const index=replayResult.events.findIndex(event=>event.kind===kind);ok(index>=0,'real resolution records '+kind);const record=replayResult.events[index],frame=resolutionState(replayResult,replayEncounter,{cursor:index+1}).render(),target=find(frame,node=>node.props['data-replay-unit']===record.target)[0],actor=find(frame,node=>node.props['data-replay-unit']===record.actor)[0];
 ok(actor.props['data-acting'],'recorded actor is highlighted independently of target');ok(target.props['data-targeted']&&target.props['data-event-kind']===kind,'recorded target receives the correct action cue');eq(find(target,node=>node.props.role==='progressbar')[0].props['aria-valuenow'],record.remainingHp,'HP bar uses authoritative remaining HP from '+kind);eq(find(frame,node=>node.props['data-reduced-motion']!==undefined)[0].props['data-playing'],false,'paused reduced-motion replay never claims active animation');
}
const fallenIndex=replayResult.events.findIndex(event=>event.remainingHp===0);ok(fallenIndex>=0,'real replay contains a fallen unit');const fallenRecord=replayResult.events[fallenIndex],fallenFrame=resolutionState(replayResult,replayEncounter,{cursor:fallenIndex+1}).render();ok(find(fallenFrame,node=>node.props['data-replay-unit']===fallenRecord.target)[0].props['data-fallen'],'defeat fade follows the recorded zero HP, never a guessed timer');
const scheduled=new Map(),oldTimeout=globalThis.setTimeout,oldClear=globalThis.clearTimeout;let timerId=0;globalThis.setTimeout=callback=>{scheduled.set(++timerId,callback);return timerId;};globalThis.clearTimeout=id=>scheduled.delete(id);
try{
 paused.render();effects[2]();eq(scheduled.size,0,'paused reduced-motion replay schedules no progression');
 const noMotion=resolutionState(replayResult,replayEncounter,{playing:true,reduced:true});noMotion.render();effects[2]();eq(scheduled.size,0,'reduced motion blocks automatic progression even after an earlier play request');
 const moving=resolutionState(replayResult,replayEncounter,{playing:true,reduced:false});let current=moving.render(),cleanup=effects[2]();eq(scheduled.size,1,'automatic replay schedules exactly one recorded movement');const advance=[...scheduled.values()][0];cleanup();eq(scheduled.size,0,'pause/unmount cleanup cancels its pending movement');advance();eq(moving.values[1],1,'visual clock advances one event without a combat callback');current=moving.render();button(current,node=>text(node)==='Pausar resolução').props.onClick();eq(moving.values[2],false,'pause control stops the visual clock');
}finally{globalThis.setTimeout=oldTimeout;globalThis.clearTimeout=oldClear;}
const loss=activities.resolveArenaRoundV38(3,['seiji-scribe','gabriel-bruiser','seiji-ward'],'balanced');ok(!loss.victory&&loss.allies.every(unit=>unit.hp===0),'factual defeat example is a real resolved encounter');const lossFrame=resolutionState(loss,activities.ARENA_ROUNDS_V38[2],{cursor:loss.events.length}).render();ok(find(lossFrame,node=>node.props.className==='defeat').length===1,'finished loss has its own visual status, not the victory color');ok(text(lossFrame).includes('Sua formação caiu em '+loss.cycles+' ciclos; '+loss.enemies.filter(unit=>unit.hp>0).length+' ecos adversários continuaram de pé'),'loss explanation is derived from actual cycles and surviving enemies');
eq(JSON.stringify(replayResult),replayInput,'steps, highlights and HP presentation leave the recorded result intact');eq(JSON.stringify(e.state.progress),progressBeforeReplay,'visual playback, pause and defeat explanation cannot repeat damage, progress or rewards');
click(ui.EventActivitiesV38,props(),node=>text(node)==='Receber bônus');eq(e.state.progress.crystals,initial.crystals+800,'three single claims and board bonus yield exactly five real pulls');html=render(ui.EventActivitiesV38,props());ok(html.includes('Bônus já recebido')&&!html.includes('Receber bônus'),'board claim is replaced after persistence');
const saved=parseSave(storage.get(SAVE_KEY));ok(saved?.progress.eventActivitiesV38.boardClaimed,'real save parser accepts the completed board and claimed reward');eq(saved.progress.eventActivitiesV38.claimed,{puzzle:true,rhythm:true,arena:true},'all three single claims persist');
eq(e.state.progress.party,initial.party,'borrowed cards never change the party');eq(e.state.heroes,initial.heroes,'activities never consume real party HP or MP');eq(e.state.progress.summoned,initial.summoned,'activities never require or invent gacha ownership');eq(e.state.progress.characterRolls,initial.rolls,'activities never alter gacha rolls or pity');

// Exercise the actual discovery markup and route, not a duplicated badge formula.
modules['../hud-icon']=compile('components/hud-icon.tsx');modules['@/lib/game/progression']={QUESTS:[],ACHIEVEMENTS:[],BESTIARY:[]};
const {GameHeader}=compile('components/game-shell/game-header.tsx'),routes=[];
const headerProps={game:{engine:e,s:e.snapshot(),ui:{panel:'menu',activeMenuTab:'events'},audio:{sound:false,toggle(){}},fullscreen:{active:false,toggle(){}},actions:{openMenu:tab=>routes.push(tab)},patch(){}}};
const actualProgress=e.state.progress.eventActivitiesV38,unclaimed=structuredClone(actualProgress);unclaimed.claimed={puzzle:false,rhythm:false,arena:false};unclaimed.boardClaimed=false;e.state.progress.eventActivitiesV38=unclaimed;headerProps.game.s=e.snapshot();
eq(activities.pendingActivityRewardsV38(unclaimed),4,'three wins plus board expose four pending claims');
html=render(GameHeader,headerProps);ok(html.includes('4 recompensas disponíveis'),'native adventure badge includes the event claims');click(GameHeader,headerProps,node=>node.props['aria-label']==='Abrir menu de aventura');eq(routes,['rewards'],'badge uses the existing reward destination');
const menuSource=ts.createSourceFile('components/game-menu.tsx',readFileSync('components/game-menu.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let navSource,rewardSource;
function visit(node){if(ts.isJsxElement(node)&&node.openingElement.tagName.getText(menuSource)==='TabsTrigger'&&node.getText(menuSource).includes('activityRewards'))navSource=node.getText(menuSource);if(ts.isJsxElement(node)&&node.openingElement.tagName.getText(menuSource)==='article'&&node.getText(menuSource).includes('<h4>Jogos da Lua de Sangue</h4>'))rewardSource=node.getText(menuSource);ts.forEachChild(node,visit);}visit(menuSource);
function bindJsx(source,names){const exports={};new Function('require','exports',ts.transpileModule(`export function render(${names}){return (${source});}`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText)(id=>require(id),exports);return exports.render;}
const HudIcon=modules['../hud-icon'].HudIcon,nav=bindJsx(navSource,'id,name,icon,activityRewards,HudIcon,TabsTrigger'),eventNav=nav('events','Eventos','events',4,HudIcon,props=>React.createElement('button',props,...[props.children].flat()));
ok(renderToStaticMarkup(eventNav).includes('4 recompensas disponíveis'),'Events navigation has its own accessible reward count');ok(renderToStaticMarkup(nav('events','Eventos','events',0,HudIcon,props=>React.createElement('button',props,...[props.children].flat()))).includes('aria-label="Eventos"'),'claimed activities remove the numeric badge instead of leaving stale rewards');
const tabs=[],changed=[],reward=bindJsx(rewardSource,'activityRewards,HudIcon,setTab,onTabChange')(4,HudIcon,tab=>tabs.push(tab),tab=>changed.push(tab));const link=button(reward,node=>text(node)==='Ver atividades do Baile');ok(!!link,'Rewards panel provides a concrete route to the event claims');link.props.onClick();eq(tabs,['events'],'reward card selects Events');eq(changed,['events'],'reward card synchronizes the session menu tab');
e.state.progress.eventActivitiesV38=actualProgress;
// The production unmount effect cancels a live session; it never owns the Page pause flag.
e.beginEventActivityV38('rhythm');e.startEventRhythmV38(false);tree(ui.EventActivitiesV38,props());const unmount=effects[0]();e.paused=false;unmount();ok(!e.eventActivitiesV38().session,'leaving the activity panel ends its clock');eq(e.paused,false,'cleanup cannot restore an obsolete menu pause');
globalThis.setTimeout=originalTimeout;Object.defineProperty(globalThis,'performance',{value:originalPerformance,configurable:true});
console.info(`Event activities UI v38: ${checks} checks passed. Real UI callbacks, five seals, timed/no-reflex cues, token races, legal three-proof draft, native crops, recorded HP replay, unique 800-crystal rewards and save isolation.`);
