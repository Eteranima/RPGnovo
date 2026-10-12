// Diagnostic sweep on a disposable transpiled catalog. No engine or saved league accepts these overrides.
import {mkdtempSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {compileGameModules} from './game-module-loader.mjs';
const out=mkdtempSync(join(tmpdir(),'eter-chess-tuning-'));compileGameModules(out,['autoChessCombatV39']);
const c=await import(pathToFileURL(join(out,'autoChessCatalogV39.js')).href),b=await import(pathToFileURL(join(out,'autoChessCombatV39.js')).href);
const teams={
 3:{magic:['gabriel','seiji','shin'],fire:['gabriel','abel','orfeu'],earth:['ava','gabriel','orfeu'],mixed:['gabriel','beatriz','carmilla']},
 5:{magic:['gabriel','ava','shin','seiji-last-script','mika'],fire:['gabriel','dante','abel','gabriel-solar-oath','umbra'],earth:['ava','ava-worldroot-sovereign','gabriel','ophelia','max-thunder-requiem'],mixed:['gabriel','beatriz','carmilla','beatriz-eclipse-tide','umbra']},
 8:{magic:['gabriel','ava','mika','ophelia','vajra','seiji-last-script','max-thunder-requiem','seiji'],fire:['gabriel','dante','gabriel-solar-oath','abel','orfeu','marin','marin-starless-throne','beatriz'],earth:['ava','ava-worldroot-sovereign','gabriel','dante','gabriel-solar-oath','ophelia','seiji','orfeu'],mixed:['gabriel','ava','beatriz','beatriz-eclipse-tide','marin','umbra','mika','abel']},
};
let focused=false;
function formation(ids){let front=0,rear=0;return ids.map((pieceId,i)=>{const piece=c.chessPieceByIdV39(pieceId);return {uid:'u'+i,pieceId,star:2,cell:piece.range===1?(focused?[34,35,33,36,32,37,38,39]:[35,36,34,37,33,38,32,39])[front++]:(focused?[42,43,50,51,41,44,49,52]:[43,44,51,52,42,45,50,53])[rear++],items:[{guardian:'cloak-cloak',duelist:'blade-core',arcanist:'orb-sigil',support:'sigil-sigil'}[piece.role]]};});}
const baseline=structuredClone(c.CHESS_COMBAT_RULES_V39),pieceBaseline=structuredClone(c.CHESS_PIECES_V39),second=process.argv.includes('--second'),variants=second?[
 {name:'focus-placement',focused:true},
 {name:'early-power',units:{seiji:{power:190},shin:{power:265}}},
 {name:'early-survival',units:{seiji:{hp:620},shin:{hp:800}}},
 {name:'mage-60-100',arcanistPower:[0,.6,1],arcanistArmorPenetration:[0,.3,.6]},
 {name:'magic-cost-value',arcanistPower:[0,.3,.6],arcanistArmorPenetration:[0,.25,.5],units:{seiji:{hp:620,power:190},shin:{hp:800,power:265},vajra:{hp:800,power:285}}},
 {name:'magic-value-no-pen',arcanistPower:[0,.3,.6],units:{seiji:{hp:620,power:190},shin:{hp:800,power:265},vajra:{hp:800,power:285}}},
 {name:'magic-value-larger',arcanistPower:[0,.45,.9],arcanistArmorPenetration:[0,.25,.5],units:{seiji:{hp:620,power:190},shin:{hp:800,power:265},vajra:{hp:800,power:285}}},
]:[
 {name:'effective-hp-mana'},
 {name:'magic-penetration',arcanistPower:[0,.3,.6],arcanistArmorPenetration:[0,.25,.5]},
 {name:'magic-stronger',arcanistPower:[0,.45,.9],arcanistArmorPenetration:[0,.3,.6]},
 {name:'shared-shield-half',guardianAllyShield:.5},
 {name:'armor-moderate',guardianArmor:[0,8,16]},
 {name:'fire-moderate',fireBurn:[0,.02,.035]},
 {name:'magic-and-shields',arcanistPower:[0,.3,.6],arcanistArmorPenetration:[0,.25,.5],guardianAllyShield:.5},
 {name:'magic-and-armor',arcanistPower:[0,.3,.6],arcanistArmorPenetration:[0,.25,.5],guardianArmor:[0,8,16]},
];
const report=[];
for(const variant of variants){Object.assign(c.CHESS_COMBAT_RULES_V39,baseline,variant);for(const original of pieceBaseline)Object.assign(c.chessPieceByIdV39(original.id),original,variant.units?.[original.id]??{});focused=!!variant.focused;const rows=[];for(const slots of [3,5,8]){const entries=Object.entries(teams[slots]);for(let ai=0;ai<entries.length;ai++)for(let bi=ai+1;bi<entries.length;bi++){const [an,aa]=entries[ai],[bn,bb]=entries[bi],row={slots,a:an,b:bn,aWins:0,bWins:0,draws:0,overtime:0};for(const seed of [2,77])for(const reverse of [false,true]){const result=b.resolveChessBattleV39(formation(reverse?bb:aa),formation(reverse?aa:bb),10,seed),aside=reverse?'enemy':'ally';if(result.winner==='draw')row.draws++;else if(result.winner===aside)row.aWins++;else row.bWins++;if(result.overtime)row.overtime++;}rows.push(row);}}report.push({variant,rows});console.log(variant.name,JSON.stringify(rows.map(row=>`${row.slots}:${row.a}/${row.b}=${row.aWins}:${row.bWins}${row.draws?' d'+row.draws:''}`)));}
writeFileSync(`docs/qa-v39/combat-tuning-sweep${second?'-2':''}.json`,JSON.stringify({date:'2026-10-12',note:'Diagnostic parameter sweep in a disposable compiled catalog, same stars/cost/components/slots and both orientations. Only production catalog defaults are used by saved leagues.',baseline,report},null,2));
