import assert from 'node:assert/strict';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {compileGameModules} from './game-module-loader.mjs';
const out=mkdtempSync(join(tmpdir(),'eter-skill-tree-v36-'));
compileGameModules(out,['data','progression','skillTreeLayoutV36']);
const load=name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {TREE}=await load('progression'),{PLAYABLE_HERO_IDS}=await load('data'),{skillTreeLayoutV36,SKILL_TREE_NODE_V36:box}=await load('skillTreeLayoutV36');
let checks=0;const check=(condition,message)=>{assert.ok(condition,message);checks++;};
for(const hero of PLAYABLE_HERO_IDS){
 const nodes=TREE.filter(node=>node.hero===hero),layout=skillTreeLayoutV36(nodes);check(nodes.length===9,`${hero} has nine real nodes`);
 for(const node of nodes){const p=layout.positions[node.id];check(p.x>=0&&p.y>=0&&p.x+box.width+6<layout.width&&p.y+box.height+6<layout.height,`${node.id} and focus outline fit the measured board`);if(node.requires)check(layout.positions[node.requires].x<p.x,`${node.id} follows its prerequisite column`);}
 for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=layout.positions[nodes[i].id],b=layout.positions[nodes[j].id];check(a.x+box.width+8<=b.x||b.x+box.width+8<=a.x||a.y+box.height+8<=b.y||b.y+box.height+8<=a.y,`${nodes[i].id}/${nodes[j].id} never overlap including focus rings`);}
 check(layout.height===Math.max(180,...Object.values(layout.positions).map(p=>p.y+box.height+24)),`${hero} height follows its last node, not a fixed crop`);
}
const ava=skillTreeLayoutV36(TREE.filter(node=>node.hero==='ava'));check(ava.height>570,'Ava wide support branch remains reachable beyond the former fixed board');
assert.throws(()=>skillTreeLayoutV36([{id:'a',requires:'b'},{id:'b',requires:'a'}]),/cycle/);checks++;
console.log(`Skill tree v36 PASS: ${checks} checks / ten families, unique dependency slots, focus bounds and measured scroll height.`);
