import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';
import {compileGameModules} from './game-module-loader.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-hero-labels-v36-')),require=createRequire(import.meta.url);
compileGameModules(out,['heroUiNameV36','heroCardArt','cosmetics','aura','battleFormation','characterAnimation','enemyArtV30','progression']);
const load=name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {heroBases,ULTIMATE_NAMES,ASSETS}=await load('data'),{VARIANTS_V36}=await load('variantsV36'),{heroUiNameV36,heroUiUltimateV36}=await load('heroUiNameV36');
const HEROES=Object.fromEntries(heroBases().map(hero=>[hero.id,hero]));
writeFileSync(join(out,'styles.mjs'),'export default new Proxy({},{get:(_,key)=>String(key)});');
writeFileSync(join(out,'progress.mjs'),`import {createElement} from '${pathToFileURL(require.resolve('react')).href}'; export function Progress({value,...props}){return createElement('div',{role:'progressbar',...props,'aria-valuenow':value});}`);
writeFileSync(join(out,'art-combatV30.mjs'),ts.transpileModule(readFileSync('lib/art/combatV30.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
function component(name,extension='tsx'){
 let source=readFileSync(`components/${name}.${extension}`,'utf8').replace(/@\/lib\/game\/([\w-]+)/g,'./$1.js').replaceAll('@/lib/art/combatV30','./art-combatV30.mjs').replaceAll('@/components/ui/progress','./progress.mjs').replaceAll('./hero-card','./hero-card.mjs').replaceAll('./character-vfx','./character-vfx.mjs').replace(/\.\/[^'"\s]+\.module\.css/g,'./styles.mjs');
 let js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 for(const runtime of ['react','react/jsx-runtime'])js=js.replaceAll(`from "${runtime}"`,`from '${pathToFileURL(require.resolve(runtime)).href}'`).replaceAll(`from '${runtime}'`,`from '${pathToFileURL(require.resolve(runtime)).href}'`);
 writeFileSync(join(out,`${name}.mjs`),js);return import(pathToFileURL(join(out,`${name}.mjs`)).href);
}
await component('character-vfx','ts');
const {HeroCard}=await component('hero-card'),{CombatParty}=await component('combat-party'),{TurnOrder}=await component('turn-order'),{drawBattleActorLabelV36}=await component('battle-scene');
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;},equal=(value,expected,message)=>{assert.deepEqual(value,expected,message);checks++;};
const render=(Component,props)=>renderToStaticMarkup(createElement(Component,props));
for(const variant of VARIANTS_V36){
 const hero={...HEROES[variant.hero],name:variant.name,variantId:variant.id,hp:123,maxHp:456,mp:67,maxMp:89};
 const label=heroUiNameV36(hero);equal(label.name,HEROES[variant.hero].name,`${variant.id}: compact family name`);equal(label.fullName,variant.name,'full identity retained');check(label.variantTitle.length>0&&!label.variantTitle.includes(' — '),'variant title excludes the repeated family');equal(heroUiUltimateV36(hero),variant.ultimate.name,'equipped ultimate title is real');
 const hud=render(CombatParty,{heroes:[hero],limits:{[hero.id]:73},exploration:true,leaderId:hero.id,onSelectHero:()=>{}});
 check(hud.includes(`<strong>${label.name}<span class="rarity"`),'visible compact heading uses family plus rarity');check(hud.includes(`title="${variant.name}"`)&&hud.includes(`aria-label="Slot 1: selecionar ${variant.name}`),'full identity retained for touch/keyboard/accessible controls');check(hud.includes(`aria-label="${variant.ultimate.name} · ${variant.name}"`),'ultimate progress identifies the equipped skill');check(hud.includes('aria-valuenow="73"')&&hud.includes('123')&&hud.includes('456'),'real charge and vitals preserved');
 const card=render(HeroCard,{h:hero});check(card.includes(`class="character-name">${label.name}</strong>`),'menu names family on its own line');check(card.includes(`class="character-variant-title">${label.variantTitle}`),'menu reserves a distinct version title row');check(card.includes('character-card-variant')&&card.includes(`aria-label="${variant.name}"`),'version layout preserves complete accessible identity');
 const order=render(TurnOrder,{heroes:[hero],battle:{queue:[hero.id,'enemy'],index:0,round:1,asset:'lobo',boss:false}});
 check(order.includes(`<strong>${label.name}</strong><small>5★ · Agora</small>`),'turn strip names the family and rarity without compressing the variant title');check(order.includes(`aria-label="${variant.name} · agora"`)&&order.includes(`title="${variant.name}"`),'turn strip preserves the full accessible identity');check(order.includes('<strong>Inimigo</strong><small>A seguir</small>'),'enemy label and next-turn state remain unchanged');
 const calls=[],ctx={save(){calls.push(['save']);},restore(){calls.push(['restore']);},measureText(text){calls.push(['measure',text]);return {width:text.length*5.5};},fillRect(...args){calls.push(['rect',...args]);},fillText(...args){calls.push(['text',...args]);}};
 drawBattleActorLabelV36(ctx,hero,{x:180,labelY:199,cellWidth:112});
 equal(calls.find(call=>call[0]==='text'),['text',label.name+' · 5★',180,199,96],'actual production ground painter uses a compact family/rarity at its own ground slot');check(!calls.some(call=>call.includes(variant.name)),'ground painter never measures or squeezes the long variant title');equal(ctx.font,'11px Arial','ground label keeps its original readable font size');equal(calls[0],['save'],'ground painter isolates drawing state');equal(calls.at(-1),['restore'],'ground painter restores drawing state');
}
for(const hero of Object.values(HEROES)){equal(heroUiNameV36(hero).name,hero.name,'original name unchanged');equal(heroUiNameV36(hero).variantTitle,null,'original does not acquire a version row');equal(heroUiUltimateV36(hero),ULTIMATE_NAMES[hero.id],'original ultimate unchanged');}
equal(heroUiNameV36({id:'abel',name:'Abel, Guardião do Primeiro Fogo'}).name,'Abel, Guardião do Primeiro Fogo','non-playable catalog identity preserved');
const mismatched={...HEROES.seiji,variantId:'beatriz-eclipse-tide'};equal(heroUiNameV36(mismatched).variantTitle,null,'another family cannot replace this label');equal(heroUiUltimateV36(mismatched),ULTIMATE_NAMES.seiji,'another family cannot replace the ultimate');
for(const hero of Object.values(HEROES)){const calls=[],ctx={save(){},restore(){},measureText:()=>({width:30}),fillRect(){},fillText:(...args)=>calls.push(args)};drawBattleActorLabelV36(ctx,hero,{x:50,labelY:180,cellWidth:100});equal(calls[0][0],hero.name,'original ground label never adds premium rarity');}
{
 const variant=VARIANTS_V36.find(item=>item.hero==='gabriel'),base=HEROES.gabriel,premium={...base,name:variant.name,variantId:variant.id};
 for(const [hero,lycan,key] of [[base,false,'face_gabriel'],[base,true,'face_gabriel_lycan'],[premium,false,'face_gabriel-solar-oath'],[premium,true,'face_gabriel-solar-oath_lycan']]){
  const props={battle:{queue:['gabriel','enemy'],index:0,round:1,asset:'lobo',boss:false},heroes:[hero],lycan};
  const order=render(TurnOrder,props);check(order.includes(`src="${ASSETS[key]}"`),`${key}: turn strip uses the exact current form portrait`);
  const card=render(HeroCard,{h:hero,lycan});check(card.includes(`src="${ASSETS[key]}"`),`${key}: menu card uses the exact current form portrait`);
  const hud=render(CombatParty,{heroes:[hero],limits:{gabriel:40},lycan});check(hud.includes(`src="${ASSETS[key]}"`),`${key}: compact HUD preserves the current form portrait`);
  check(order.includes(`aria-label="${hero.name} · agora"`),'visual form does not replace canonical hero/variant ownership identity');
 }
}
console.log(`Hero labels v36 PASS: ${checks} checks / eight equipped identities, compact HUD/ground/turn strip, dedicated menu title, full accessible names and actual ultimate labels.`);
