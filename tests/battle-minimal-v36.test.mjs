import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';
import {compileGameModules} from './game-module-loader.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-battle-minimal-')),require=createRequire(import.meta.url);
compileGameModules(out,['heroUiNameV36','heroCardArt','carmilla']);
const load=name=>import(pathToFileURL(join(out,name+'.js')).href);
const data=await load('data'),labels=await load('heroUiNameV36'),variants=await load('variantsV36'),cardArt=await load('heroCardArt'),carmilla=await load('carmilla');
const styles=new Proxy({},{get:(_target,key)=>String(key)});
let chosenTab='actions';
const element=(tag,props)=>createElement(tag,props,...[props.children].flat());
const modules={
 '@/lib/game/data':data,'@/lib/game/variantsV36':variants,'@/lib/game/heroUiNameV36':labels,'@/lib/game/heroCardArt':cardArt,'@/lib/game/carmilla':carmilla,
 './hero-card':{HeroPortrait(){throw Error('Ornamental portraits must not be rendered in the compact battle branch.');}},
 './game-menu':{StatusBadges:()=>null},'./battle-intent-v32':{CombatStatusHelpV32:()=>null},
 './character-skill-icon':{characterSkillArtV36:(_hero,action)=>'/native-skill-'+action+'.png'},
 './ui/tabs':{Tabs:props=>element('div',props),TabsList:props=>element('div',{...props,role:'tablist'}),TabsTrigger:props=>element('button',{...props,role:'tab'}),TabsContent:props=>element('div',{...props,'data-tab':props.value})},
};
function component(path){
 const exports={};
 new Function('require','exports',ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText)(id=>{
  if(id==='react')return {...require('react'),useState:()=>[chosenTab,()=>{}]};
  if(id==='react/jsx-runtime')return require(id);
  if(id.endsWith('.module.css'))return {__esModule:true,default:styles};
  if(!modules[id])throw Error('Unexpected runtime dependency: '+id);
  return modules[id];
 },exports);return exports;
}
const {CombatParty}=component('components/combat-party.tsx'),{TurnOrder}=component('components/turn-order.tsx'),{BattleCommands}=component('components/battle-commands.tsx');
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks++;},eq=(value,expected,message)=>{assert.deepEqual(value,expected,message);checks++;};
function expand(tree){if(!tree||typeof tree!=='object')return tree;if(typeof tree.type==='function')return expand(tree.type(tree.props));return tree.props?.children===undefined?tree:{...tree,props:{...tree.props,children:[tree.props.children].flat(Infinity).map(expand)}};}
function find(tree,predicate,results=[]){if(!tree||typeof tree!=='object')return results;if(predicate(tree))results.push(tree);for(const child of [tree.props?.children].flat(Infinity))find(child,predicate,results);return results;}
const heroes=data.heroBases().slice(0,5).map((hero,index)=>({...hero,hp:index===4?0:1234+index,maxHp:9999,mp:2345+index,maxMp:8888})),limits=Object.fromEntries(heroes.map((hero,index)=>[hero.id,index===4?100:index*17]));
for(let count=1;count<=5;count++){
 const roster=heroes.slice(0,count),selected=[];
 const props={heroes:roster,activeId:roster[0].id,targetId:roster.at(-1).id,limits,onSelectTarget:id=>selected.push(id)},tree=expand(CombatParty(props));
 const html=renderToStaticMarkup(createElement(CombatParty,props)),cards=find(tree,node=>node.type==='section'),buttons=find(tree,node=>node.type==='button');
 eq(cards.length,count,'every permanent party slot has one compact card');eq(buttons.length,count,'every slot is an accessible ally-target button');
 eq(find(tree,node=>node.props.role==='progressbar').length,count*3,'HP, MP and ultimate retain real progress semantics');
 eq(cards.filter(node=>node.props['data-current']).length,1,'acting hero remains distinct from ally-target selection');eq(cards.filter(node=>node.props['data-ally-target']).length,1,'only the actual selected ally has the target indicator');
 ok(!html.includes('card-frame')&&!html.includes('hp-vessel')&&!html.includes('portrait-ring'),'battle draws no ornamental frame or vessel');
 for(let slot=0;slot<count;slot++){
  const hero=roster[slot],button=buttons[slot];eq(button.props['aria-keyshortcuts'],String(slot+1),'button and keyboard use the same fixed slot');
  ok(button.props['aria-label'].includes(hero.name)&&button.props['aria-label'].includes(hero.hp+'/'+hero.maxHp),'full name and four-digit HP remain accessible');
  ok(html.includes('src="'+data.ASSETS['face_'+hero.id]+'"'),'compact portrait is the native face crop');
  ok(!button.props.disabled,'candidate ally selection remains possible while an animation can be busy');button.props.onClick();
 }
 eq(selected,roster.map(hero=>hero.id),'clicks select allies without sorting the party or invoking combat actions');
 if(count===5)ok(html.includes('Pronta')&&html.includes('0<span>/9999</span>'),'ready ultimate and fallen ally are not hidden');
}
const disabled=expand(CombatParty({heroes,limits,onSelectTarget:()=>{},selectDisabled:true}));ok(find(disabled,node=>node.type==='button').every(button=>button.props.disabled),'battle result can disable candidate changes without losing the vitals');
const bossQueue=[heroes[0].id,'enemy',heroes[1].id,heroes[2].id,'enemy',heroes[3].id,heroes[4].id,'enemy'];
for(let current=0;current<8;current++){
 const tree=TurnOrder({heroes,battle:{queue:bossQueue,index:current,round:4,asset:'lobo',boss:true}}),entries=find(tree,node=>node.props.role==='listitem'),html=renderToStaticMarkup(tree);
 eq(entries.length,8,'boss queue shows all five allies and all three enemy actions');eq(entries.filter(node=>node.props['data-enemy']).length,3,'repeated enemy entries are preserved');
 eq(new Set(entries.map(node=>node.key)).size,8,'repeated enemy IDs use unique ordinal React keys');eq(entries.filter(node=>node.props['aria-current']==='step').map(node=>node.props['data-queue-position']),[current+1],'current turn is never sliced from the queue');
 eq(entries.filter(node=>node.props['data-acted']).length,current,'already-acted entries remain identifiable');ok(html.includes('Ação 8 de 8 na rodada 4'),'the final enemy action exposes its ordinal context');
}
const calls=[],h=heroes[0],skills=Array.from({length:7},(_,index)=>({id:'test-'+index,name:'Técnica de nome completo '+index,cost:index+1,description:'Descrição original '+index}));
const b={queue:[h.id,'enemy'],index:0,busy:false,boss:false,statuses:Object.fromEntries(heroes.map(hero=>[hero.id,[]]))};
let currentHero=h;
const engine={currentHero:()=>currentHero,hasStatus:()=>false,skills:()=>skills,ultimateName:()=>data.ULTIMATE_NAMES[h.id],ultimateDescriptionV36:()=>data.ULTIMATE_DESCRIPTIONS[h.id],action:(...args)=>calls.push(args),attackPower:()=>20,guardMpV36:()=>5,skillCost:(_id,cost)=>cost,setBattleSpeedV32:()=>{}};
const s={heroes,battle:b,battleSpeedV32:1,progress:{limit:{...limits,[h.id]:100},masterMode:false},potions:3,ethers:2,remedies:1};
chosenTab='skills';const commands=expand(BattleCommands({engine,s,target:heroes[1].id,setTarget(){throw Error('Duplicate target strip invoked.');}})),skillGrid=find(commands,node=>node.props.className==='commandList skillList')[0];
eq(skillGrid.props.children.length,8,'skills has seven techniques plus ultimate in a single grid');ok(!find(commands,node=>node.props.className==='targetStrip').length,'command panel does not duplicate party portraits');
const skillButtons=find(skillGrid,node=>node.type==='button');skillButtons[0].props.onClick();eq(calls.at(-1),['test-0',heroes[1].id],'actual skill callback retains the selected target');
skillButtons.at(-1).props.onClick();eq(calls.at(-1),['ultimate'],'ultimate still invokes the engine once and does not capture an invented target');
currentHero=undefined;b.busy=true;b.animation={actor:h.id,action:'cast'};const busy=expand(BattleCommands({engine,s,target:heroes[1].id,setTarget(){}}));ok(find(busy,node=>node.type==='button'&&node.props.className?.includes('commandButton')).every(button=>button.props.disabled),'busy animation cannot enable an action through the smaller UI');
ok(renderToStaticMarkup(createElement(BattleCommands,{engine,s,target:heroes[1].id,setTarget(){}})).includes(labels.heroUiNameV36(h).name+' está agindo'),'busy title identifies the current actor rather than becoming an unnamed turn');
// Evaluate the production Page expressions, so this regression does not copy its fallback logic.
const page=ts.createSourceFile('app/page.tsx',readFileSync('app/page.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let activeExpression,selectionExpression;
function visit(node){if(ts.isJsxSelfClosingElement(node)&&node.tagName.getText(page)==='CombatParty'){for(const attr of node.attributes.properties)if(ts.isJsxAttribute(attr)&&attr.initializer&&ts.isJsxExpression(attr.initializer)){if(attr.name.text==='activeId')activeExpression=attr.initializer.expression.getText(page);if(attr.name.text==='onSelectTarget')selectionExpression=attr.initializer.expression.getText(page);}}ts.forEachChild(node,visit);}visit(page);
const active=new Function('currentHero','s','return '+activeExpression);eq(active(undefined,s),h.id,'production footer keeps its actor indicator while currentHero is unavailable during animation');b.animation.actor='enemy';eq(active(undefined,s),undefined,'enemy animation does not mark a fallback ally as currently acting');delete b.animation;eq(active(undefined,s),h.id,'idle production footer uses the current queue actor');
const patches=[],select=new Function('game','return '+selectionExpression)({patch:patch=>patches.push(patch)});select(heroes[2].id);eq(patches,[{target:heroes[2].id}],'production footer callback only changes the candidate target');
console.info(`Battle minimal v36: ${checks} checks passed. Production SSR/handlers cover 1–5 slots, native faces, real vitals, eight ordinal turns, busy actor/target separation and unchanged action callbacks; viewport geometry is reviewed in the browser.`);
