import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {performance} from 'node:perf_hooks';
import {compileGameModules} from './game-module-loader.mjs';
const out=mkdtempSync(join(tmpdir(),'eter-matchups-v39-'));compileGameModules(out,['autoChessCombatV39']);const load=name=>import(pathToFileURL(join(out,name+'.js')).href),c=await load('autoChessCatalogV39'),b=await load('autoChessCombatV39');
const teams={
 3:{magic:['gabriel','seiji','shin'],fire:['gabriel','abel','orfeu'],earth:['ava','gabriel','orfeu'],mixed:['gabriel','beatriz','carmilla']},
 5:{magic:['gabriel','ava','shin','seiji-last-script','mika'],fire:['gabriel','dante','abel','gabriel-solar-oath','umbra'],earth:['ava','ava-worldroot-sovereign','gabriel','ophelia','max-thunder-requiem'],mixed:['gabriel','beatriz','carmilla','beatriz-eclipse-tide','umbra']},
 8:{magic:['gabriel','ava','mika','ophelia','vajra','seiji-last-script','max-thunder-requiem','seiji'],fire:['gabriel','dante','gabriel-solar-oath','abel','orfeu','marin','marin-starless-throne','beatriz'],earth:['ava','ava-worldroot-sovereign','gabriel','dante','gabriel-solar-oath','ophelia','seiji','orfeu'],mixed:['gabriel','ava','beatriz','beatriz-eclipse-tide','marin','umbra','mika','abel']},
};
const roleItem={guardian:'cloak-cloak',duelist:'blade-core',arcanist:'orb-sigil',support:'sigil-sigil'};
function formation(ids,star,equipment){let front=0,rear=0;const frontline=[35,36,34,37,33,38,32,39],backline=[43,44,51,52,42,45,50,53];return ids.map((pieceId,index)=>{const piece=c.chessPieceByIdV39(pieceId),cell=piece.range===1?frontline[front++]:backline[rear++];return {uid:'u'+index,pieceId,star,cell,items:equipment==='none'?[]:[roleItem[piece.role]]};});}
let checks=0;const check=(v,label)=>{assert.ok(v,label);checks++;};const results=[],started=performance.now();
for(const slots of [3,5,8]){const entries=Object.entries(teams[slots]),budgets=entries.map(([,ids])=>ids.reduce((sum,id)=>sum+c.chessPieceByIdV39(id).cost,0));check(new Set(budgets).size===1,'equal shop investment per size');for(const [,ids] of entries)check(ids.length===slots&&new Set(ids).size===slots,'unique tactical types at equal fielded capacity');
 for(const star of [1,2])for(const equipment of ['none','role'])for(let a=0;a<entries.length;a++)for(let bb=a+1;bb<entries.length;bb++){
  const [aName,aIds]=entries[a],[bName,bIds]=entries[bb],tally={a:aName,b:bName,slots,star,equipment,cost:budgets[0],aWins:0,bWins:0,draws:0,aCasts:0,bCasts:0,overtime:0,firstCastA:[],firstCastB:[],samples:0};
  for(const seed of [2,23,77])for(const reverse of [false,true]){const aa=formation(reverse?bIds:aIds,star,equipment),eb=formation(reverse?aIds:bIds,star,equipment),fight=b.resolveChessBattleV39(aa,eb,10,seed),aSide=reverse?'enemy':'ally';check(fight.ticks<=430,'equal investment combat bounded');check(fight.finalUnits.every(unit=>unit.hp>=0&&unit.hp<=unit.maxHp),'equal investment final HP bounded');const mapped=fight.winner==='draw'?'draw':fight.winner===aSide?'a':'b';if(mapped==='a')tally.aWins++;else if(mapped==='b')tally.bWins++;else tally.draws++;tally.samples++;if(fight.overtime)tally.overtime++;
   for(const side of ['ally','enemy']){const actorIds=new Set(fight.initialUnits.filter(unit=>unit.side===side).map(unit=>unit.uid)),casts=[...new Map(fight.events.filter(event=>event.kind==='skill'&&actorIds.has(event.actor)).map(event=>[event.actor+':'+event.tick,event])).values()],isA=side===aSide;tally[isA?'aCasts':'bCasts']+=casts.length;if(casts.length)tally[isA?'firstCastA':'firstCastB'].push(casts[0].tick/10);}
  }results.push(tally);
 }
}
mkdirSync('docs/qa-v39',{recursive:true});const report={date:'2026-10-12',checks,note:'Equal shop cost, slots, stars and component count; all six matches per row include both field orientations. Legal positional fixtures isolate combat from shop policy and are not claimed natural league saves.',results,totalMs:performance.now()-started};writeFileSync('docs/qa-v39/equal-investment-matchups.json',JSON.stringify(report,null,2));console.log(`PASS ${checks} equal-investment checks`,JSON.stringify({slots:[3,5,8],rows:results.length,results:results.filter(row=>row.star===2&&row.equipment==='role').map(row=>({slots:row.slots,a:row.a,b:row.b,wins:row.aWins+':'+row.bWins,draws:row.draws,overtime:row.overtime,aCasts:row.aCasts,bCasts:row.bCasts})),totalMs:report.totalMs}));
