// Read-only topology audit of v30 definitions, using the engine's exact walkability rule.
import ts from '../../node_modules/typescript/lib/typescript.js';
import vm from 'node:vm';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const expansionJs=ts.transpileModule(readFileSync('lib/game/expansionV30.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const expansionContext={exports:{}};vm.runInNewContext(expansionJs,expansionContext);
const e=expansionContext.exports;
const data=ts.createSourceFile('data.ts',readFileSync('lib/game/data.ts','utf8'),ts.ScriptTarget.Latest,true);
const printer=ts.createPrinter();
const statements=[];
for(const s of data.statements){
 if(ts.isImportDeclaration(s)||ts.isTypeAliasDeclaration(s)||ts.isInterfaceDeclaration(s))continue;
 statements.push(printer.printNode(ts.EmitHint.Unspecified,s,data));
 if(ts.isVariableStatement(s)&&s.declarationList.declarations.some(d=>d.name.getText(data)==='MAPS'))break;
}
const legacyContext={exports:{},EXPANSION_MAPS_V30:e.EXPANSION_MAPS_V30};
vm.runInNewContext(ts.transpileModule(statements.join('\n'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,legacyContext);
const maps=legacyContext.exports.MAPS;
const walk=(m,x,y)=>{const tile=m.rows[Math.floor(y+.5)]?.[Math.floor(x+.5)];return !!tile&&tile!=='#'&&tile!=='w'&&!m.props.some(p=>p.solid&&x>=p.solid[0]-.2&&y>=p.solid[1]-.2&&x<=p.solid[0]+p.solid[2]+.2&&y<=p.solid[1]+p.solid[3]+.2);};
let checks=0;const check=(ok,message)=>{checks++;assert.ok(ok,message);};
const report=[];
for(const m of Object.values(e.EXPANSION_MAPS_V30)){
 check(m.rows.length===m.height,m.id+' height');check(m.rows.every(r=>r.length===m.width),m.id+' width');
 const spawn=m.id==='jardim-lunar'?{x:15.5,y:20}:{x:3.5,y:11};
 check(walk(m,spawn.x,spawn.y),m.id+' spawn');
 const q=[{x:Math.round(spawn.x),y:Math.round(spawn.y)}],seen=new Set([q[0].x+','+q[0].y]);
 for(let n=0;n<q.length;n++)for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const p={x:q[n].x+dx,y:q[n].y+dy},k=p.x+','+p.y;if(!seen.has(k)&&walk(m,p.x,p.y)){seen.add(k);q.push(p);}}
 for(const ent of m.entities){
  check(walk(m,ent.x,ent.y),m.id+' entity '+ent.id+' exact ground position');
  check(q.some(p=>Math.hypot(p.x-ent.x,p.y-ent.y)<.76),m.id+' entity '+ent.id+' reachable');
  if(ent.kind==='warp'){check(!!maps[ent.to],ent.id+' destination exists');check(walk(maps[ent.to],ent.spawn.x,ent.spawn.y),ent.id+' destination spawn clear');}
  if(['mob','boss'].includes(ent.kind))for(const key of ['hp','damage','xp','credits'])check(ent[key]>0,ent.id+' '+key+' real');
 }
 report.push({map:m.id,width:m.width,height:m.height,reachableGroundCells:seen.size,entities:m.entities.length,allEntitiesReachable:true});
}
for(const g of e.EXPANSION_GATEWAYS_V30){const ent=g.entity;check(walk(maps[g.map],ent.x,ent.y),'gateway '+ent.id+' legacy ground');check(walk(maps[ent.to],ent.spawn.x,ent.spawn.y),'gateway '+ent.id+' expansion spawn');check(ent.minStage===5,'gateway '+ent.id+' postchapter optional');}
const ids=Object.values(e.EXPANSION_MAPS_V30).flatMap(m=>m.entities.map(x=>x.id));check(new Set(ids).size===ids.length,'No duplicate entity IDs');check(!!e.NEW_BOSS_REWARDS_V30.astral,'Boss reward family astral');
const out={checks,passed:true,maps:report,walkability:'Exact engine tile rounding and solid rectangle expansion0.2; cardinal grid connectivity plus exact entity/spawn positions.'};
writeFileSync('art-source/v30/map-validation.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));
