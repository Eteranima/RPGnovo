import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import ts from 'typescript';

const out=mkdtempSync(join(tmpdir(),'eter-native-companion-v36-')),require=createRequire(import.meta.url);
function compile(path,destination,replacements=[]){
 let source=readFileSync(path,'utf8');for(const [from,to] of replacements)source=source.replaceAll(from,to);
 let js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 for(const runtime of ['react','react/jsx-runtime'])js=js.replaceAll(`from "${runtime}"`,`from '${pathToFileURL(require.resolve(runtime)).href}'`).replaceAll(`from '${runtime}'`,`from '${pathToFileURL(require.resolve(runtime)).href}'`);
 writeFileSync(join(out,destination),js);return import(pathToFileURL(join(out,destination)).href);
}
const {nativeSpriteViewBox,applyNativeSpriteCrop,companionPoseV36}=await compile('lib/art/nativeSpriteViewport.ts','nativeSpriteViewport.js');
const {NativeSpritePortrait}=await compile('components/native-sprite-portrait.tsx','portrait.mjs',[['@/lib/art/nativeSpriteViewport','./nativeSpriteViewport.js']]);
const manifest=JSON.parse(readFileSync('art-source/v36/variants/ophelia-white-equinox/companion-manifest.json','utf8'));
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;};
const source='/assets/v36/variants/ophelia-white-equinox/companion.png';
for(const crop of manifest.frames){
 const html=renderToString(createElement(NativeSpritePortrait,{src:source,crop,sheetSize:{width:manifest.width,height:manifest.height},name:'Mika'}));
 check(html.includes(`viewBox="${nativeSpriteViewBox(crop)}"`),'only the measured native crop defines the viewport');
 check(html.includes('preserveAspectRatio="xMidYMid meet"')&&html.includes('overflow="hidden"'),'portrait letterboxes without stretching or exposing an adjacent cell');
 check(html.includes('clipPathUnits="userSpaceOnUse"')&&html.includes(`x="${crop.x}" y="${crop.y}" width="${crop.w}" height="${crop.h}"`),'letterboxed margins still clip the other atlas cells');
 check(html.includes(`href="${source}" width="${manifest.width}" height="${manifest.height}"`),'whole source dimensions remain native, without guessed grid or recolour');
 check(html.includes('aria-label="Mika"'),'nondecorative companion keeps its accessible identity');
 const attrs={},clip={setAttribute:(key,value)=>{attrs[key]=value;}},viewport={setAttribute:(key,value)=>{attrs[key]=value;},querySelector:()=>clip};
 applyNativeSpriteCrop(viewport,crop);
 check(attrs.viewBox===nativeSpriteViewBox(crop)&&attrs.x===String(crop.x)&&attrs.y===String(crop.y)&&attrs.width===String(crop.w)&&attrs.height===String(crop.h),'clock animation updates both viewport and clipping rectangle');
}
const unknown=renderToString(createElement(NativeSpritePortrait,{src:source,name:'Mika'}));
check(!unknown.includes('<image'),'unregistered crop never displays four characters as one portrait');
const waiting=renderToString(createElement(NativeSpritePortrait,{src:source,crop:manifest.frames[0],name:'Mika'}));
check(!waiting.includes('<image'),'unknown natural dimensions wait for the native image instead of guessing atlas size');
for(const [age,expected] of [[0,0],[600,0],[601,1],[1714,1],[1715,2],[2228,2],[2229,3],[2571,3]])check(companionPoseV36(age,2571,1715,false)===expected,'companion follows the real action and contact clock');
for(let age=0;age<=3000;age+=37)check(companionPoseV36(age,2571,1715,true)===2,'reduced motion keeps one stable generated pose');
check(companionPoseV36(1100,1500,1000,false)===2&&companionPoseV36(1400,1500,1000,false)===3,'different battle speed/duration changes the companion timing without an independent timer');
console.log(`Native companion v36 PASS: ${checks} checks / raster clipping, native geometry, four action poses and reduced motion.`);
