import assert from 'node:assert/strict';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {performance} from 'node:perf_hooks';
import {compileGameModules} from './game-module-loader.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-chess-combat40-'));
compileGameModules(out,['autoChessCombatV40','autoChessCombatV39','autoChessCatalogV39','expansionV30']);
const load=name=>import(pathToFileURL(join(out,name+'.js')).href),b=await load('autoChessCombatV40'),c=await load('autoChessCatalogV40'),old=await load('autoChessCatalogV39'),legacyCombat=await load('autoChessCombatV39'),world=await load('expansionV30');
let checks=0;const check=(value,label)=>{assert.ok(value,label);checks++;},equal=(actual,expected,label)=>{assert.deepEqual(actual,expected,label);checks++;};
const unit=(uid,pieceId,cell,star=2,items=[])=>({uid,pieceId,cell,star,items}),mana=['sigil-sigil','sigil-sigil','sigil-sigil'];
const npcIds=['runewarden','moth','ashwolf','lunastag','selo','eco','cinder','astral'];
equal(c.CHESS_PIECES_V40.length,31,'thirty-one distinct canonical pieces');
equal(new Set(c.CHESS_PIECES_V40.map(piece=>piece.id)).size,31,'IDs remain unique');
equal([1,2,3,4,5].map(cost=>c.CHESS_PIECES_V40.filter(piece=>piece.cost===cost).length),[6,7,7,7,4],'expanded cost distribution');
equal(c.CHESS_PIECES_V40.reduce((sum,piece)=>sum+c.CHESS_POOL_COUNTS_V40[piece.cost],0),515,'finite pool has exactly 515 physical copies');
equal(new Set(npcIds.map(id=>c.chessPieceByIdV40(id).ability)).size,8,'eight new tactical kits rather than repeated abilities');
for(const id of npcIds)equal(c.chessPieceByIdV40(id).element,world.ENEMY_ULTIMATES_V30[id].element,'canonical enemy element preserved');
for(const id of ['ava-worldroot-sovereign','beatriz-eclipse-tide']){const next=c.chessPieceByIdV40(id),prior=old.chessPieceByIdV39(id);equal(next.cost,4,'earth/water alternatives become accessible at tier four');check(next.hp<prior.hp&&next.attack<prior.attack&&next.armor<prior.armor&&next.power<prior.power,'tier-four variants have a reduced stat budget');equal(prior.cost,5,'v39 historical cost remains untouched');}
for(const trait of c.CHESS_TRAITS_V40)check(trait.thresholds.every(threshold=>c.CHESS_PIECES_V40.filter(piece=>piece.traits.includes(trait.id)).length>=threshold),'all synergy thresholds remain reachable');
const manaEnemy=[unit('tank','gabriel-solar-oath',35,3,['cloak-cloak'])],twoArcs=[unit('s1','seiji',35,1),unit('s2','shin',36,1)],fourArcs=[...twoArcs,unit('s3','selo',44,1),unit('s4','moth',43,1)];
const manaAfterFirstAttack=(fight,actor)=>fight.events.find(event=>event.actor===actor&&event.action==='attack-mana').mana;
equal(manaAfterFirstAttack(b.resolveChessBattleV40(twoArcs,manaEnemy,1,23),'player:s1'),16,'two arcanists add three mana beyond basic attack and Ink');
equal(manaAfterFirstAttack(b.resolveChessBattleV40(fourArcs,manaEnemy,1,23),'player:s1'),22,'four arcanists and three Ink types restore twenty-two mana per attack');
equal(manaAfterFirstAttack(legacyCombat.resolveChessBattleV39(twoArcs,manaEnemy,1,23),'player:s1'),13,'historical v39 restores its unchanged thirteen mana');

function validateFight(fight){
 check(fight.ticks<=430&&fight.finalUnits.every(unit=>unit.hp>=0&&unit.hp<=unit.maxHp&&unit.mana>=0&&unit.mana<=unit.maxMana&&unit.shield>=0),'combat and final vitals are bounded');
 const timeline=new Map(fight.initialUnits.map(unit=>[unit.uid,{...unit}]));
 for(const event of fight.events){
  check(timeline.has(event.actor)&&(!event.target||timeline.has(event.target)),'every event references a real initial actor/target');
  const actor=timeline.get(event.actor),victim=event.target?timeline.get(event.target):actor;
  if(event.kind==='skill'&&event.value===0)actor.mana=0;
  check(event.hp>=0&&event.hp<=victim.maxHp&&event.mana>=0&&event.mana<=victim.maxMana&&event.shield>=0,'each replay event has legal vitals');
  victim.hp=event.hp;victim.mana=event.mana;victim.shield=event.shield;
  if(event.kind==='move'){equal(actor.cell,event.fromCell,'movement source agrees with prior timeline cell');check(Number.isInteger(event.toCell)&&event.toCell>=0&&event.toCell<64,'move destination is a legal board cell');if(event.action==='rescue'){const enemies=[...timeline.values()].filter(unit=>unit.hp>0&&unit.side!==actor.side),clearance=cell=>Math.min(...enemies.map(unit=>Math.abs(Math.floor(cell/8)-Math.floor(unit.cell/8))+Math.abs(cell%8-unit.cell%8)));check(clearance(event.toCell)>clearance(actor.cell),'rescue strictly increases distance from the nearest living enemy');}actor.cell=event.toCell;check([...timeline.values()].filter(unit=>unit.hp>0).every((unit,index,alive)=>alive.findIndex(other=>other.cell===unit.cell)===index),'walking, charge, rescue and knockback never overlap living actors');}
 }
 for(const final of fight.finalUnits){const reconstructed=timeline.get(final.uid);equal({cell:reconstructed.cell,hp:reconstructed.hp,mana:reconstructed.mana,shield:reconstructed.shield},{cell:final.cell,hp:final.hp,mana:final.mana,shield:final.shield},'timeline reconstructs final position and vitals exactly');}
}

const scenarios=[];
for(const id of npcIds){
 const ally=[unit('caster',id,35,3,mana),unit('front','gabriel',34,3,['cloak-cloak']),unit('healer','mika',43,3,['sigil-sigil'])],enemy=[unit('target','orfeu-unwritten-archon',36,3,['cloak-cloak']),unit('other','ava-worldroot-sovereign',37,3,['cloak-cloak']),unit('earth','ava',44,3),unit('heal','beatriz-eclipse-tide',45,3,['sigil-sigil'])];
 const fight=b.resolveChessBattleV40(ally,enemy,15,23);equal(fight,b.resolveChessBattleV40(ally,enemy,15,23),'new kit is deterministic for identical inputs');validateFight(fight);
 const own=fight.events.filter(event=>event.actor==='player:caster');check(own.some(event=>event.kind==='skill'&&event.action===c.chessPieceByIdV40(id).skillName),'canonical unit executes its real skill');
 const has=(action,kind)=>fight.events.some(event=>event.action===action&&(!kind||event.kind===kind));
 if(id==='runewarden'){check(has('intercept-ready','status')&&has('intercept','status')&&has('intercept-hit'),'interception redirects a real direct hit after arming');check(own.filter(event=>event.action==='intercept-ready').every(event=>event.value===20),'interception window is two seconds');}
 if(id==='moth')check(own.some(event=>event.action==='mana-drain'&&event.kind==='mana'&&event.value<0),'ice powder removes actual mana');
 if(id==='ashwolf')check(has('hunt-wound','status'),'hunt applies a bounded healing penalty');
 if(id==='lunastag'){check(has('knockback','move')&&has('charge','move'),'charge moves the victim and advances the caster');const pushes=fight.events.filter(event=>event.action==='knockback');for(const push of pushes)check(pushes.filter(next=>next.actor===push.actor&&next.tick>push.tick).every(next=>next.tick-push.tick>=30),'displacement cannot permanently refresh on one victim');}
 if(id==='selo')check(own.some(event=>event.action==='shield-break'&&event.value>0),'seal destroys an existing shield');
 if(id==='eco')check(own.some(event=>event.kind==='shield'),'rescue protects its selected ally');
 if(id==='cinder'){check(has('pyre-zone','status')&&own.some(event=>event.action==='pyre'&&event.kind==='status'&&event.value>0&&event.element==='fire'),'pyre is a fixed area with real periodic fire damage');const zones=own.filter(event=>event.action==='pyre-zone'),pulses=own.filter(event=>event.action==='pyre');check(pulses.every(event=>zones.some(zone=>event.tick>zone.tick&&event.tick<=zone.tick+30&&Math.abs(Math.floor(event.targetCell/8)-Math.floor(zone.toCell/8))+Math.abs(event.targetCell%8-zone.toCell%8)<=1)),'pyre stops after three seconds and only hits actors still in its area');}
 if(id==='astral'){const stages=own.filter(event=>event.action==='orbit').map(event=>event.value);check(stages.includes(1)&&stages.includes(2)&&stages.includes(3),'all three orbit stages happen');check(stages.every((stage,index)=>stage===index%3+1),'orbit stages cycle without wall-clock state');}
 scenarios.push({id,ticks:fight.ticks,winner:fight.winner,casts:own.filter(event=>event.kind==='skill'&&event.value===0).length});
}

const denseAlly=npcIds.map((id,index)=>unit('a'+index,id,[35,36,34,37,43,44,42,45][index])),denseEnemy=['gabriel','ava','ophelia','beatriz','orfeu','seiji','marin','max'].map((id,index)=>unit('b'+index,id,[35,36,34,37,43,44,42,45][index]));
const safeRescue=b.resolveChessBattleV40([unit('eco','eco',44,1,mana),unit('front','gabriel',35,1),unit('mika','mika',51,1)],[unit('e','gabriel',36,1)],1,1);validateFight(safeRescue);check(safeRescue.events.some(event=>event.tick===0&&event.kind==='move'&&event.action==='rescue'&&event.actor==='player:front'),'Eco can extract the wounded front line to a safer free cell');check(safeRescue.events.some(event=>event.tick===0&&event.kind==='heal'&&event.actor==='player:eco'&&event.value>0),'rescue really heals the wounded ally');
const unsafeRescue=b.resolveChessBattleV40([unit('eco','eco',35,1,mana),unit('mika','mika',51,1)],[unit('enemy','gabriel',35,1)],1,3);validateFight(unsafeRescue);check(!unsafeRescue.events.some(event=>event.tick===0&&event.kind==='move'&&event.action==='rescue'&&event.actor==='player:mika'),'Eco never pulls the safely positioned Mika toward the enemy');check(unsafeRescue.events.some(event=>event.tick===0&&event.kind==='shield'&&event.target==='player:mika'),'blocked rescue still grants its ally protection in place');
const start=performance.now(),dense=b.resolveChessBattleV40(denseAlly,denseEnemy,15,77),denseMs=performance.now()-start;validateFight(dense);check(denseMs<10000,'dense fight stays within a broad ten-second CPU regression budget');

// Equal cost and stars, with four real components per five-piece fixture.
const compositions={magic:['runewarden','ava','moth','seiji','seiji-last-script'],fire:['gabriel','ashwolf','abel','dante','moth'],earth:['ava','ava-worldroot-sovereign','gabriel','ophelia','orfeu'],mixed:['runewarden','gabriel','beatriz','carmilla','beatriz-eclipse-tide']},recipe={guardian:'cloak-cloak',duelist:'blade-core',arcanist:'orb-sigil',support:'sigil-sigil'};
function formation(ids){let front=0,rear=0;return ids.map((id,index)=>{const piece=c.chessPieceByIdV40(id);return unit('u'+index,id,piece.range===1?[35,36,34,37,33,38,32,39][front++]:[43,44,51,52,42,45,50,53][rear++],2,index<2?[recipe[piece.role]]:[]);});}
const entries=Object.entries(compositions),matchups=[];for(const [,ids]of entries)equal(ids.reduce((sum,id)=>sum+c.chessPieceByIdV40(id).cost,0),10,'policy-independent fixture spends ten shop gold');
for(let a=0;a<entries.length;a++)for(let e=a+1;e<entries.length;e++){const row={a:entries[a][0],b:entries[e][0],aWins:0,bWins:0,draws:0};for(const seed of [2,23,77])for(const reverse of [false,true]){const fight=b.resolveChessBattleV40(formation(entries[reverse?e:a][1]),formation(entries[reverse?a:e][1]),10,seed);check(fight.ticks<=430,'equal-investment composition matchup ends within the published cap');if(fight.winner==='draw')row.draws++;else if(fight.winner===(reverse?'enemy':'ally'))row.aWins++;else row.bWins++;}matchups.push(row);}
for(const name of Object.keys(compositions)){const wins=matchups.reduce((sum,row)=>sum+(row.a===name?row.aWins:row.b===name?row.bWins:0),0),losses=matchups.reduce((sum,row)=>sum+(row.a===name?row.bWins:row.b===name?row.aWins:0),0);check(wins>0&&losses>0,'each tested early composition has a viable win and a counter at equal investment');}
const additions={magic:['astral','dante','mika'],fire:['cinder','shin','mika'],earth:['orfeu-unwritten-archon','dante','shin'],mixed:['eco','umbra','vajra']},late=Object.entries(compositions).map(([name,ids])=>[name,[...ids,...additions[name]]]),lateMatchups=[];
for(const [,ids]of late)equal(ids.reduce((sum,id)=>sum+c.chessPieceByIdV40(id).cost,0),21,'late eight-piece fixtures spend equal shop gold');
for(let a=0;a<late.length;a++)for(let e=a+1;e<late.length;e++){const row={a:late[a][0],b:late[e][0],aWins:0,bWins:0,draws:0};for(const seed of [2,23,77])for(const reverse of [false,true]){const fight=b.resolveChessBattleV40(formation(late[reverse?e:a][1]),formation(late[reverse?a:e][1]),20,seed);check(fight.ticks<=430&&fight.finalUnits.every(unit=>unit.hp>=0&&unit.hp<=unit.maxHp),'late equal-investment results are bounded');if(fight.winner==='draw')row.draws++;else if(fight.winner===(reverse?'enemy':'ally'))row.aWins++;else row.bWins++;}lateMatchups.push(row);}
for(const name of Object.keys(compositions)){const wins=lateMatchups.reduce((sum,row)=>sum+(row.a===name?row.aWins:row.b===name?row.bWins:0),0),losses=lateMatchups.reduce((sum,row)=>sum+(row.a===name?row.bWins:row.b===name?row.aWins:0),0);check(wins>0&&losses>0,'each tested late composition retains a viable win and a counter');}
console.log(`PASS ${checks} combat v40 checks`,JSON.stringify({scenarios,denseMs,matchups,lateMatchups,note:'Controlled equal-investment fixtures, not natural league saves or a fairness claim.'}));
