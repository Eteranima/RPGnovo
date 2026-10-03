'use client';
import {useState} from 'react';
import {TREE,EXTRA_SKILLS} from '@/lib/game/progression';
import {SKILLS,type HeroId} from '@/lib/game/data';
import type {GameEngine,Snapshot} from '@/lib/game/engine';
import {CharacterSkillIcon} from './character-skill-icon';

export function SkillTree({hero,s,engine}:{hero:HeroId;s:Snapshot;engine:GameEngine}){
 const nodes=TREE.filter(n=>n.hero===hero),[chosen,setChosen]=useState(nodes[0].id),node=nodes.find(n=>n.id===chosen)||nodes[0];
 if(!nodes.length)return <p className="empty-state">As técnicas deste herói ainda não foram registradas.</p>;
 const depth=(id:string):number=>{const parent=nodes.find(n=>n.id===id)?.requires;return parent?1+depth(parent):0;};
 const buckets:Record<number,number>={},positions=Object.fromEntries(nodes.map(n=>{const d=depth(n.id),field=/-(vital|field|explore)$/.test(n.id),row=field?n.id.endsWith('explore')?3:2:buckets[d]||0;if(!field)buckets[d]=row+1;return[n.id,{x:40+d*205,y:24+row*132}];}));
 const width=Math.max(700,...Object.values(positions).map(p=>p.x+190)),height=570,learned=s.progress.learned.includes(node.id),locked=!!node.requires&&!s.progress.learned.includes(node.requires);
 const buy=(id:string)=>{const n=nodes.find(v=>v.id===id);if(n&&!s.progress.learned.includes(id)&&(!n.requires||s.progress.learned.includes(n.requires))&&s.progress.points[hero]>=n.cost)engine.learn(id);};
 const actionFor=(id:string)=>id.endsWith('-master')?'ultimate':EXTRA_SKILLS[hero].find(skill=>skill.node===id)?.id||(/-(ink|ice|power)$/.test(id)?SKILLS[hero][0].id:'');
 return <div className="tree-workspace"><article className="tree-details tree-details-sticky"><CharacterSkillIcon hero={hero} action={actionFor(node.id)} index={node.icon}/><div><h3>{node.name}</h3><p>{node.description}</p>{node.requires&&<small>Requer: {TREE.find(n=>n.id===node.requires)?.name}</small>}<small className="tree-double">Duplo clique em uma técnica disponível para aprender.</small></div><button className="primary-button" disabled={s.mode!=='world'||learned||locked||s.progress.points[hero]<node.cost} onClick={()=>buy(node.id)}>{learned?'Aprendida':locked?'Requisito pendente':`Aprender · ${node.cost} ponto${node.cost>1?'s':''}`}</button></article><div className="tree-scroll"><div className="tree-board" style={{width,height}}><svg aria-hidden="true" width={width} height={height}>{nodes.filter(n=>n.requires).map(n=>{const a=positions[n.requires!],b=positions[n.id];return <path key={n.id} d={`M${a.x+175} ${a.y+45} C${a.x+195} ${a.y+45},${b.x-15} ${b.y+45},${b.x} ${b.y+45}`} fill="none" stroke={s.progress.learned.includes(n.id)?'#e6c785':'#626675'} strokeWidth="3"/>;})}</svg>{nodes.map(n=>{const active=s.progress.learned.includes(n.id),blocked=!!n.requires&&!s.progress.learned.includes(n.requires);return <button key={n.id} className={`tree-node ${active?'learned':''} ${blocked?'locked':''} ${node.id===n.id?'selected':''}`} style={{left:positions[n.id].x,top:positions[n.id].y}} aria-pressed={node.id===n.id} onClick={()=>setChosen(n.id)} onDoubleClick={()=>buy(n.id)}><CharacterSkillIcon hero={hero} action={actionFor(n.id)} index={n.icon}/><strong>{n.name}</strong><small>{active?'Aprendida':`${n.cost} ponto${n.cost>1?'s':''}${blocked?' · bloqueada':''}`}</small></button>;})}</div></div></div>;
}
