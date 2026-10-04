import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import ts from 'typescript';
import {compileGameModules} from './game-module-loader.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-battle-polish-v32-'));
compileGameModules(out,['engine','sprites','enemyArtV30','characterAnimation','battleFormation','heroCardArt']);
const load=name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const data=await load('data'),{ASSETS,ENEMY_ULTIMATES,heroBases,battleBackground,combatImpact}=data;
const {ENEMY_PRESENTATION_V30,enemyBattleKey,enemyPoseFrame}=await load('enemyArtV30');
const {SPRITE_FRAMES,battleCrop}=await load('sprites');
const animation=await load('characterAnimation'),{battleTimingV32}=await load('combatPreferencesV32');
const {STATUS}=await load('progression');
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;},equal=(a,b,message)=>{assert.deepEqual(a,b,message);checks++;};

function source(path){return ts.createSourceFile(path,readFileSync(path,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);}
function declarations(file,names){return file.statements.filter(node=>ts.isFunctionDeclaration(node)&&names.includes(node.name?.text)).map(node=>node.getText(file)).join('\n');}
const battleSource=source('components/battle-scene.tsx');
let duelFrameExpression,heroPhaseExpression;function collectPoseExpression(node){if(ts.isConditionalExpression(node)&&node.getText(battleSource).startsWith('duelUltimate?Math.max'))duelFrameExpression=node;if(ts.isVariableDeclaration(node)&&node.name.getText(battleSource)==='phase'&&node.initializer?.getText(battleSource).startsWith('ultimate?Math.max'))heroPhaseExpression=node.initializer;ts.forEachChild(node,collectPoseExpression);}collectPoseExpression(battleSource);
check(duelFrameExpression&&heroPhaseExpression,'production duel and party ultimate timelines are present');
for(const id of data.PLAYABLE_HERO_IDS)for(const speed of [1,2]){const a=battleTimingV32(4800,speed,true),lead=(animation.hasCharacterBattleArt(id)?700:900)/speed,age=a.impactAt,expected=(age-lead)/(a.duration-lead);const duelProgress=new Function('duelUltimate','age','a','b','speed','hasCharacterBattleArt',`return ${ts.transpileModule(duelFrameExpression.getText(battleSource),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText}`)(true,age,a,{asset:id},speed,animation.hasCharacterBattleArt);const partyProgress=new Function('ultimate','age','a','hero','speed','hasCharacterBattleArt',`return ${ts.transpileModule(heroPhaseExpression.getText(battleSource),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText}`)(true,age,a,{id},speed,animation.hasCharacterBattleArt);equal(duelProgress,expected,'duel ultimate uses the same native lead as the cinema, including Orfeu/Ava');equal(partyProgress,expected,'party ultimate and cinema share the captured lead');}
const preloadJs=ts.transpileModule(`const artCache=new Map();${declarations(battleSource,['battleArtKeysV32','preloadBattleArt']).replace(/export /g,'')}`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const bindPreload=new Function('ASSETS','ENEMY_PRESENTATION_V30','enemyBattleKey','ENEMY_ULTIMATES','combatImpact','battleBackground','Image','setTimeout','clearTimeout',`${preloadJs};return {battleArtKeysV32,preloadBattleArt};`);
let requests=[],mode='loaded',timeouts=[];
class FakeImage{set src(value){this.value=value;requests.push(value);if(mode==='loaded')queueMicrotask(()=>this.onload?.());else if(mode==='error')queueMicrotask(()=>this.onerror?.());}}
const loader=bindPreload(ASSETS,ENEMY_PRESENTATION_V30,enemyBattleKey,ENEMY_ULTIMATES,combatImpact,battleBackground,FakeImage,(fn,ms)=>{timeouts.push({fn,ms});return timeouts.length;},()=>{});
const party=['seiji','ophelia','gabriel','ava','carmilla'];
const prewarm=loader.battleArtKeysV32(['seiji','ophelia']);
check(!prewarm.some(key=>key.startsWith('ultimate_')||key==='battle_phases'||key.startsWith('battle_bg_')),'party prewarm cannot request future enemy ultimates/phases/backgrounds');
for(const family of Object.keys(ENEMY_ULTIMATES)){
 const scope={family,asset:family==='lobo'?'wolf':family==='sombra'?'shadow':family,boss:['selo','eco','cinder','astral'].includes(family),phase:1,map:'subsolo'};
 const keys=loader.battleArtKeysV32(party,undefined,scope),presentation=ENEMY_PRESENTATION_V30[family];
 check(keys.includes(presentation.attack)&&keys.includes(presentation.ultimate),'current family loads its own native attack and ultimate');
 equal(keys.filter(key=>key.startsWith('ultimate_')),[presentation.ultimate],'no unrelated enemy ultimate is loaded');
 equal(keys.filter(key=>key.startsWith('battle_bg_')),[battleBackground(scope.map)],'only current map background is loaded');
 check(!keys.some(key=>/^battle_(marin|max|beatriz|orfeu|abel)_/.test(key)),'unselected hero body sheets are excluded');
 if(family==='astral')for(const key of presentation.phases)check(keys.includes(key),'the current boss can advance through its own phases without a missing sprite');
 for(const key of keys)check(existsSync('public'+ASSETS[key]),'selected assets exist as final native files');
}
const duel=loader.battleArtKeysV32(['ophelia'],'ava',{family:'selo',asset:'ava',boss:true,phase:1,map:'patio'});
check(duel.includes('battle_ava_attack')&&duel.includes('battle_ava_ultimate'),'duel loads actual opponent hero');
check(!duel.some(key=>key.startsWith('ultimate_')||key==='battle_boss_attack'||key==='battle_phases'),'duel does not request an unrelated monster or phase body');
requests=[];await loader.preloadBattleArt(['seiji','ophelia']);const firstRequests=requests.length;check(firstRequests>0,'real loader makes native image requests');await loader.preloadBattleArt(['seiji','ophelia']);equal(requests.length,firstRequests,'URL cache deduplicates second load');
mode='stalled';const stalled=loader.preloadBattleArt(['beatriz']);const newTimeouts=timeouts.slice(firstRequests);check(newTimeouts.some(timer=>timer.ms===15000),'network stall has a bounded retry path');newTimeouts.forEach(timer=>timer.fn());const partial=await stalled;check(!partial.battle_beatriz_attack,'stalled sprite is not falsely marked ready');
mode='loaded';const recovered=await loader.preloadBattleArt(['beatriz']);check(recovered.battle_beatriz_attack&&recovered.battle_beatriz_ultimate,'failed cache entries can be retried successfully');

// Render the production forecast/details with the real native portrait and status icon functions.
const require=createRequire(import.meta.url),jsxUrl=pathToFileURL(require.resolve('react/jsx-runtime')).href;
const portraitSource=source('components/hero-card.tsx');
const nativePortrait=ts.transpileModule(`import {jsx as _jsx,jsxs as _jsxs} from '${jsxUrl}';import {ASSETS} from './data.js';import {HERO_CARD_ART} from './heroCardArt.js';${declarations(portraitSource,['apertureStyle','HeroPortrait'])}`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
writeFileSync(join(out,'portrait.mjs'),rewriteRuntime(nativePortrait));
function rewriteRuntime(text){for(const name of ['react/jsx-runtime','react','react-dom'])text=text.replaceAll(`from '${name}'`,`from '${pathToFileURL(require.resolve(name)).href}'`).replaceAll(`from "${name}"`,`from '${pathToFileURL(require.resolve(name)).href}'`);return text;}
writeFileSync(join(out,'icon.mjs'),rewriteRuntime(ts.transpileModule(readFileSync('components/game-icon.tsx','utf8').replace("@/lib/game/sprites","./sprites.js"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText));
writeFileSync(join(out,'styles.mjs'),'export default {};');
let intentJs=ts.transpileModule(readFileSync('components/battle-intent-v32.tsx','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
intentJs=rewriteRuntime(intentJs).replaceAll('@/lib/game/data','./data.js').replaceAll('@/lib/game/progression','./progression.js').replaceAll('./hero-card','./portrait.mjs').replaceAll('./game-icon','./icon.mjs').replaceAll('./battle-intent-v32.module.css','./styles.mjs');writeFileSync(join(out,'intent.mjs'),intentJs);
const {BattleIntentV32,EnemyIntentDetailsV32,combatDetailTabTarget,combatStatusDescriptionV32}=await import(pathToFileURL(join(out,'intent.mjs')).href);
check(combatStatusDescriptionV32('silence').includes('ultimate continuam disponíveis'),'hero silence explanation preserves actual ultimate availability');
check(combatStatusDescriptionV32('silence',true).includes('Impede a ultimate e o colapso'),'enemy silence explanation follows actual forecast suppression');
check(combatStatusDescriptionV32('blind').includes('ultimate não é afetada'),'hero blindness explanation preserves the real ultimate exception');
check(!combatStatusDescriptionV32('blind',true).includes('não é afetada'),'enemy blindness does not falsely exempt its ultimate from actual RNG');
const heroes=heroBases().filter(h=>party.includes(h.id)).map((h,index)=>({...h,hp:80+index,maxHp:150,guard:index===0}));
const intent={phase:'preview',timing:'next-round',kind:'ultimate',round:3,action:'boss-ultimate',name:'Nome completo da ultimate',element:'fire',targets:heroes.map(h=>({id:h.id,name:h.name,damageOnHit:12,damageRange:[0,12],status:'bleed',statusTurns:2,guarded:h.guard,statusPrevented:h.guard,guardSavedHp:h.guard?15:0})),area:true,chargeBefore:100,chargeAfter:0,missChance:.5,blockedBy:null,controlAvailable:false,startsNextRound:true};
const html=renderToString(createElement(BattleIntentV32,{intent,heroes,lycan:true}));
check(html.includes('Próxima rodada')&&html.includes('Ultimate')&&html.includes('Fogo'),'compact row names exact timing/kind/element');
check(html.includes('aria-haspopup="dialog"')&&html.includes('Detalhes da previsão: Nome completo da ultimate'),'touch/focus opens details with full actual name');
for(const h of heroes)check(html.includes(`${h.name}: ${h.hp} de ${h.maxHp} HP`),'every target has current HP and an accessible native portrait label');
check(html.includes(ASSETS.face_gabriel_lycan),'forecast uses Gabriel current lycan identity');
equal(renderToString(createElement(BattleIntentV32,{intent:null,heroes})), '', 'finished battle has no stale forecast');
const detail=renderToString(createElement(EnemyIntentDetailsV32,{intent,heroes}));
check(detail.includes('50% de chance de errar')&&detail.includes('0–12'),'blind forecast exposes uncertainty instead of guaranteed damage');
check(detail.includes('guarda preserva 15 HP')&&detail.includes('impedido pela proteção'),'guard effect and prevented state have accessible explanation');
check(detail.includes('não pode ser imobilizado novamente'),'already-used control is not advertised as available');
const stopped=renderToString(createElement(EnemyIntentDetailsV32,{intent:{...intent,kind:'blocked',blockedBy:'bind',targets:[]},heroes}));check(stopped.includes('Nenhum aliado será atingido')&&!stopped.includes('0–12'),'blocked action does not claim a hit');
for(const type of ['keydown','keyup'])for(let count=1;count<=3;count++)for(let index=0;index<count;index++)for(const shift of [false,true])equal(combatDetailTabTarget(index,count,shift,type),type==='keyup'?null:shift?(index===0?count-1:null):(index===count-1?0:null),'Tab wraps only at keydown boundaries; keyup never steals the new focus');

// Exploration reuses the real native compact cards without changing the battle branch.
const partyJs=rewriteRuntime(ts.transpileModule(readFileSync('components/combat-party.tsx','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText).replaceAll('./hero-card','./portrait.mjs').replaceAll('@/lib/game/heroCardArt','./heroCardArt.js').replaceAll('@/lib/game/data','./data.js').replaceAll('./combat-party.module.css','./styles.mjs');writeFileSync(join(out,'party.mjs'),partyJs);
const {CombatParty}=await import(pathToFileURL(join(out,'party.mjs')).href),limits=Object.fromEntries(heroes.map((h,i)=>[h.id,i*17]));
const battlePartyHtml=renderToString(createElement(CombatParty,{heroes,limits,activeId:'seiji'}));
check(!battlePartyHtml.includes('<button')&&!battlePartyHtml.includes('data-exploration-party'),'battle cards gain no leader selector or extra footer row');
equal((battlePartyHtml.match(/role="progressbar"/g)||[]).length,15,'battle retainsHP/MP/ultimate for each of five fixed slots');
const selected=[];const worldProps={heroes,limits,exploration:true,leaderId:'gabriel',onSelectHero:(id,slot)=>selected.push([id,slot]),credits:123,level:4,saving:'Salvo',lycan:true};
const worldHtml=renderToString(createElement(CombatParty,worldProps));equal((worldHtml.match(/<button/g)||[]).length,5,'all five world slots are real accessible buttons');
check(worldHtml.includes('Grupo de exploração')&&worldHtml.includes('123 créditos')&&worldHtml.includes('Nv 4')&&worldHtml.includes('Salvo'),'world footer exposes real resource/saving data in its own small row');
equal((worldHtml.match(/aria-pressed="true"/g)||[]).length,1,'exactly the actual leader is selected');
for(let i=0;i<heroes.length;i++)check(worldHtml.includes(`Slot ${i+1}: selecionar ${heroes[i].name}`)&&worldHtml.includes(`aria-keyshortcuts="${i+1}"`),'button and number shortcut refer to the same permanent party slot');
function findButtons(element,items=[]){if(!element||typeof element!=='object')return items;if(element.type==='button')items.push(element);const children=element.props?.children;for(const child of Array.isArray(children)?children:[children]){if(Array.isArray(child))child.forEach(item=>findButtons(item,items));else findButtons(child,items);}return items;}
const buttons=findButtons(CombatParty(worldProps));for(const button of buttons)button.props.onClick();equal(selected,heroes.map((h,i)=>[h.id,i]),'production button handlers preserve hero identity and slot ordering');
let stoppedTab=false;buttons[0].props.onKeyDown({key:'Tab',stopPropagation:()=>stoppedTab=true});check(stoppedTab,'focused world card permits nativeTab instead of triggering the global leader-cycle shortcut');
equal((renderToString(createElement(CombatParty,{...worldProps,selectDisabled:true})).match(/disabled=""/g)||[]).length,5,'world loading/menu can disable all five selectors');
equal((worldHtml.match(/role="progressbar"/g)||[]).length,15,'all five world slots keep their actualHP/MP/ultimate readable');

// Execute the production ultimate effect at both speeds, not a duplicated timing model.
const cinemaSource=source('components/ultimate-cinematic.tsx');let cinemaEffect;function visit(node){if(ts.isCallExpression(node)&&node.expression.getText(cinemaSource)==='useEffect')cinemaEffect=node.arguments[0];ts.forEachChild(node,visit);}visit(cinemaSource);
const names='enabled,a,cv,battle,heroes,map,progress,matchMedia,preloadBattleArt,ASSETS,ENEMY_ULTIMATES,ELEMENT_COLORS,battleBackground,SPRITE_FRAMES,battleCrop,enemyPoseFrame,characterPoseFrame,characterCamera,hasCharacterBattleArt,characterEffectMotif,combatElement,combatImpact';
const effectJs=ts.transpileModule(`const bind=scope=>{const {${names}}=scope;return (${cinemaEffect.getText(cinemaSource)})();};`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const bindEffect=new Function(`${effectJs};return bind;`)();let clock=100000,rafId=0;const rafs=new Map(),originalNow=Date.now;Date.now=()=>clock;global.requestAnimationFrame=fn=>{rafs.set(++rafId,fn);return rafId;};global.cancelAnimationFrame=id=>rafs.delete(id);global.devicePixelRatio=1;
const ctx={setTransform(){},clearRect(){},createRadialGradient:()=>({addColorStop(){}}),fillRect(){},save(){},restore(){},translate(){},drawImage(){}};
for(const family of Object.keys(ENEMY_ULTIMATES))for(const speed of [1,2]){
 const a={actor:'enemy',action:'enemy-ultimate',element:ENEMY_ULTIMATES[family].element,started:100000,speed,...battleTimingV32(4800,speed,true)},key=ENEMY_PRESENTATION_V30[family].ultimate,battle={animation:a,family,asset:family,name:family};
 const canvas={width:0,height:0,dataset:{},getContext:()=>ctx,getBoundingClientRect:()=>({width:844,height:180})};clock=a.started;
 const cleanup=bindEffect({enabled:true,a,cv:{current:canvas},battle,heroes,map:'subsolo',progress:{gabrielForm:'human'},matchMedia:()=>({matches:true}),preloadBattleArt:()=>Promise.resolve({[key]:{width:1536,height:1024}}),...data,SPRITE_FRAMES,battleCrop,enemyPoseFrame,...animation});await Promise.resolve();
 const seen=new Set(),impactSample=a.impactAt+34,samples=[...ENEMY_PRESENTATION_V30[family].ultimateTiming.map(start=>900/speed+start*(a.duration-900/speed)+2),impactSample].sort((a,b)=>a-b);let contactFrame,contactBeat;
 for(const elapsed of samples){clock=a.started+elapsed;const pending=[...rafs.values()];rafs.clear();pending.forEach(fn=>fn());seen.add(Number(canvas.dataset.ultimateFrame));if(elapsed===impactSample){contactFrame=Number(canvas.dataset.ultimateFrame);contactBeat=canvas.dataset.cameraBeat;}}
 equal(seen.size,8,'all eight native enemy poses are reachable at 1x and 2x');
 equal(contactFrame,5,`${family}/${speed}x uses the authored contact pose on the first30FPS paint after impact`);equal(contactBeat,'impact','cinematic camera enters impact within one paint after actual callback');cleanup();rafs.clear();
}
for(const id of data.PLAYABLE_HERO_IDS)for(const speed of [1,2]){
 const a={actor:id,action:'ultimate',element:data.combatElement(id,'ultimate'),started:100000,speed,...battleTimingV32(4800,speed,true)},key=`battle_${id}_ultimate`,count=SPRITE_FRAMES[key].length,canvas={width:0,height:0,dataset:{},getContext:()=>ctx,getBoundingClientRect:()=>({width:844,height:180})};clock=a.started;
 const cleanup=bindEffect({enabled:true,a,cv:{current:canvas},battle:{animation:a},heroes,map:'subsolo',progress:{gabrielForm:'human'},matchMedia:()=>({matches:true}),preloadBattleArt:()=>Promise.resolve({[key]:{width:1536,height:1024}}),...data,SPRITE_FRAMES,battleCrop,enemyPoseFrame,...animation});await Promise.resolve();
 const lead=(animation.hasCharacterBattleArt(id)?700:900)/speed;clock=a.started+a.impactAt;const pending=[...rafs.values()];rafs.clear();pending.forEach(fn=>fn());equal(Number(canvas.dataset.ultimateFrame),animation.characterPoseFrame(id,'ultimate',(a.impactAt-lead)/(a.duration-lead),count),'hero cinema follows the captured speed rather than a later preference');cleanup();rafs.clear();
}
Date.now=originalNow;
console.log(`battle-polish-v32: ${checks} checks passed; current-family native preload/cache/retry, exact forecast/target HP/status accessibility, keyboard trap, enemy contact and hero cinema timing at 1x/2x.`);
