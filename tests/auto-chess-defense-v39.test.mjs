import assert from 'node:assert/strict';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {compileGameModules} from './game-module-loader.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-chess-defense-v39-'));
compileGameModules(out,['autoChessCombatV39']);
const combat=await import(pathToFileURL(join(out,'autoChessCombatV39.js')).href);
let checks=0;
const check=(value,label)=>{assert.ok(value,label);checks++;};
const equal=(actual,expected,label)=>{assert.deepEqual(actual,expected,label);checks++;};
const unit=(uid,pieceId,cell,items=[])=>({uid,pieceId,star:1,cell,items});
const openingMana=['sigil-sigil','sigil-sigil','sigil-sigil'];
const defenders=(items=[],antimagic=false)=>[
 unit('guard','orfeu',36,items),
 ...(antimagic?[unit('guard2','orfeu-unwritten-archon',56)]:[]),
];

function firstHit(attacker,items=[],antimagic=false,basic=false){
 const fight=combat.resolveChessBattleV39([unit('caster',attacker,35,basic?[]:openingMana)],defenders(items,antimagic),1,1);
 const event=fight.events.find(event=>event.actor==='player:caster'&&event.target==='rival:guard'&&event.kind===(basic?'attack':'skill')&&event.value>0);
 check(event&&event.tick===0,'adjacent opening hit isolates defense before later skills and effects');
 return {event,fight};
}

// Orfeu and Abel explicitly use physical skills; Seiji provides the magic control.
const samples=[];
for(const attacker of ['orfeu','abel','seiji']){
 const base=firstHit(attacker),anti=firstHit(attacker,[],true),cloak=firstHit(attacker,['cloak']),ward=firstHit(attacker,['orb-cloak']),combined=firstHit(attacker,['orb-cloak'],true);
 equal(ward.fight.initialUnits.find(unit=>unit.uid==='rival:guard').maxHp,cloak.fight.initialUnits.find(unit=>unit.uid==='rival:guard').maxHp,'cloak and ward control have the same starting HP');
 if(attacker==='seiji'){
  check(anti.event.value<base.event.value,'active Anti magia reduces a magical skill');
  check(ward.event.value<cloak.event.value,'ward reduces magic beyond the same armor component');
  check(combined.event.value<ward.event.value&&combined.event.value<anti.event.value,'trait and equipment protection both contribute against magic');
 }else{
  equal(anti.event.value,base.event.value,'Anti magia does not reduce a physical skill');
  equal(ward.event.value,cloak.event.value,'ward does not reduce a physical skill beyond armor');
  equal(combined.event.value,ward.event.value,'combined magic defense preserves physical skill damage');
 }
 const repeated=firstHit(attacker,['orb-cloak','orb-cloak']),split=firstHit(attacker,['orb-cloak','orb','cloak']);
 equal(repeated.event.value,split.event.value,'repeating ward preserves the same stats without stacking its passive');
 equal(repeated.fight.initialUnits.find(unit=>unit.uid==='rival:guard').maxHp,split.fight.initialUnits.find(unit=>unit.uid==='rival:guard').maxHp,'repeated and split equipment have the same starting HP');
 samples.push({attacker,base:base.event.value,antimagic:anti.event.value,cloak:cloak.event.value,ward:ward.event.value,combined:combined.event.value});
}

const basic=firstHit('orfeu',[],false,true),antiBasic=firstHit('orfeu',[],true,true),cloakBasic=firstHit('orfeu',['cloak'],false,true),wardBasic=firstHit('orfeu',['orb-cloak'],false,true);
equal(antiBasic.event.value,basic.event.value,'physical basic attack is unchanged by Anti magia');
equal(wardBasic.event.value,cloakBasic.event.value,'physical basic attack is unchanged by ward beyond armor');

function burnDamage(items=[],antimagic=false){
 const fight=combat.resolveChessBattleV39([unit('caster','gabriel',35,openingMana),unit('fire2','dante',56)],defenders(items,antimagic),1,1);
 const event=fight.events.find(event=>event.actor==='player:caster'&&event.target==='rival:guard'&&event.action==='burn'&&event.kind==='status'&&event.tick===10&&event.value>0);
 check(event,'first periodic burn exists at one second');
 return event.value;
}
const burns={base:burnDamage(),antimagic:burnDamage([],true),cloak:burnDamage(['cloak']),ward:burnDamage(['orb-cloak'])};
check(burns.antimagic<burns.base,'Anti magia also reduces magical burn damage');
check(burns.ward<burns.cloak,'ward also reduces magical burn damage beyond armor');

function chainDamage(items=[],antimagic=false){
 const enemy=[unit('front','gabriel',36),unit('guard','orfeu',37,items),...(antimagic?[unit('guard2','orfeu-unwritten-archon',56)]:[])];
 const fight=combat.resolveChessBattleV39([unit('caster','max',35),unit('electric2','vajra',56)],enemy,1,1);
 const event=fight.events.find(event=>event.actor==='player:caster'&&event.target==='rival:guard'&&event.action==='lightning-chain'&&event.kind==='attack'&&event.tick===0&&event.value>0);
 check(event,'electric basic attack produces a separate opening chain hit');
 return event.value;
}
const chains={base:chainDamage(),antimagic:chainDamage([],true),cloak:chainDamage(['cloak']),ward:chainDamage(['orb-cloak'])};
check(chains.antimagic<chains.base,'Anti magia reduces the magical chain from a basic attack');
check(chains.ward<chains.cloak,'ward reduces the magical chain beyond armor');

console.log(`PASS ${checks} defense checks`,JSON.stringify({skills:samples,burns,chains}));
