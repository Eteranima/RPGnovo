import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import ts from 'typescript';
import {compileGameModules} from './game-module-loader.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-variant-ui-v36-')),require=createRequire(import.meta.url);
compileGameModules(out,['engine','variantsV36']);
const load=name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {GameEngine}=await load('engine'),{VARIANTS_V36,heroRarityV36,variantCompanionV36}=await load('variantsV36');
writeFileSync(join(out,'styles.mjs'),'export default {};');
function component(name){
 let src=readFileSync(`components/${name}.tsx`,'utf8').replaceAll('@/lib/game/variantsV36','./variantsV36.js').replace(/\.\/[^'"\s]+\.module\.css/g,'./styles.mjs');
 let js=ts.transpileModule(src,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 for(const runtime of ['react','react/jsx-runtime'])js=js.replaceAll(`from "${runtime}"`,`from '${pathToFileURL(require.resolve(runtime)).href}'`).replaceAll(`from '${runtime}'`,`from '${pathToFileURL(require.resolve(runtime)).href}'`);
 writeFileSync(join(out,`${name}.mjs`),js);return import(pathToFileURL(join(out,`${name}.mjs`)).href);
}
const {HeroVariantSelector}=await component('hero-variant-selector'),{BloodMoonLegendaryEvent}=await component('blood-moon-legendary-event');
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;};
const storage=new Map();globalThis.localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)};globalThis.setTimeout=()=>1;
const engine=new GameEngine();engine.start(false);engine.finishCutscene();engine.state.mode='world';const s=engine.snapshot();
const render=Component=>renderToString(createElement(Component,{s,engine})).replaceAll('<!-- -->','');
for(const variant of VARIANTS_V36){
 s.progress.summoned=[];s.progress.heroVariantsV36={};
 const locked=renderToString(createElement(HeroVariantSelector,{hero:variant.hero,s,engine})).replaceAll('<!-- -->','');
 check(locked.includes(`Original · ${heroRarityV36(variant.hero)}★`),`${variant.hero} preserves its real original rarity`);
 check(locked.includes('disabled=""')&&locked.includes('Convoque esta versão'),`${variant.id} cannot equip before actual ownership`);
 s.progress.summoned=[variant.id];s.progress.recruited.push(variant.hero);s.progress.heroVariantsV36={[variant.hero]:variant.id};
 const owned=renderToString(createElement(HeroVariantSelector,{hero:variant.hero,s,engine})).replaceAll('<!-- -->','');
 check(owned.includes('aria-pressed="true"')&&owned.includes('Versão 5★ equipada.'),`${variant.id} reports the actual equipped selection`);
 check(owned.includes(variant.signature.name)&&owned.includes(variant.ultimate.name),`${variant.id} exposes its actual distinct kit`);
 const companion=variantCompanionV36(variant.hero,s.progress);
 check(!!companion===!variant.legendary,`${variant.hero} never invents a companion for teachers`);
 if(companion){check(companion.key===`companion_${variant.id}`&&companion.eventKey===`companion_event_${variant.id}`,`${variant.id} resolves only its own companion art`);s.progress.heroVariantsV36={};check(variantCompanionV36(variant.hero,s.progress)===null,'original form never uses premium companion art');}
}
s.progress.heroVariantsV36={};s.progress.summoned=[];s.progress.bloodMoonV36={accepted:false,step:0,claimed:false};
let html=render(BloodMoonLegendaryEvent);check(html.includes('Conclua o ato I')&&!html.includes('Abrir as três páginas'),'act II clearly locks before act I');
s.progress.bloodMoonV36={accepted:true,step:5,claimed:true};s.stage=4;html=render(BloodMoonLegendaryEvent);check(html.includes('Selo Ressonante')&&!html.includes('Abrir as três páginas'),'accessible Abel chapter gate is explained');
s.stage=5;html=render(BloodMoonLegendaryEvent);check(html.includes('Abrir as três páginas')&&!html.includes('Confirmar escolha única'),'available event starts without premature reward choice');
check(engine.startBloodMoonLegendaryV36(),'actual engine accepts available act II');html=render(BloodMoonLegendaryEvent);check(html.includes('Converse com Ava')&&!html.includes('Confirmar escolha única'),'active panel shows the actual first objective');
s.progress.bloodMoonLegendaryV36.step=6;html=render(BloodMoonLegendaryEvent);check((html.match(/aria-pressed="false"/g)||[]).length===3,'complete act II presents exactly its three eligible choices');check(html.includes('disabled=""')&&html.includes('Selecione uma das três versões'),'claim starts disabled until an explicit selection');
const first=engine.bloodMoonLegendaryV36().event.choiceIds[0];check(engine.claimBloodMoonLegendaryV36(first),'actual engine grants the unique chosen version');html=render(BloodMoonLegendaryEvent);check(html.includes('Escolha registrada')&&html.includes('já está no seu Arquivo')&&!html.includes('Confirmar escolha única'),'claimed UI never offers a repeated reward');
console.log(`Variant UI v36 PASS: ${checks} checks / eight kits, original rarity, ownership, companion identity and real act-II gates.`);
