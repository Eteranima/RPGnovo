import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import ts from 'typescript';

const out=mkdtempSync(join(tmpdir(),'eter-carmilla-'));
writeFileSync(join(out,'carmilla.mjs'),ts.transpileModule(readFileSync('lib/game/carmilla.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
const {planInAeternumVive}=await import(pathToFileURL(join(out,'carmilla.mjs')).href);
const party=[{id:'carmilla',hp:40,maxHp:100},{id:'seiji',hp:20,maxHp:100},{id:'ophelia',hp:40,maxHp:200},{id:'marin',hp:15,maxHp:50}];
assert.deepEqual(planInAeternumVive(party),{targets:[{id:'seiji',heal:80},{id:'ophelia',heal:160}],selfDamage:36});
assert.deepEqual(planInAeternumVive([{id:'carmilla',hp:1,maxHp:100},{id:'seiji',hp:100,maxHp:100}]),{targets:[],selfDamage:0});
assert.deepEqual(planInAeternumVive([{id:'carmilla',hp:90,maxHp:100},{id:'seiji',hp:0,maxHp:100},{id:'ava',hp:1,maxHp:100}]),{targets:[{id:'ava',heal:99}],selfDamage:15});
console.log('Carmilla transfer: lowest HP ratio, ties, 15% self-damage, no resurrection.');
