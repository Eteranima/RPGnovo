import {OBJECTIVES} from '@/lib/game/data';
import {ANCHORS} from '@/lib/game/progression';
import type {GameEngine,Snapshot} from '@/lib/game/engine';
export function MiniMap({s,engine}:{s:Snapshot;engine:GameEngine}){const m=engine.map;return <svg className="minimap" viewBox={`-.5 -.5 ${m.width} ${m.height}`} role="img" aria-label={`Minimapa de ${m.name}: branco é você, dourado são saídas e objetivo, azul é cristal, lilás é evento e vermelho é inimigo`}>
 {m.rows.flatMap((row,y)=>[...row].map((t,x)=><rect key={`${x}-${y}`} x={x-.5} y={y-.5} width="1" height="1" fill={t==='#'?'#172a38':t==='w'?'#245a70':t==='g'?'#3a5748':t==='i'?'#9cdbeb':t==='b'?'#746150':'#65727a'}/>))}
 {m.props.filter(p=>p.solid).map((p,i)=><rect key={`prop-${i}`} x={p.solid![0]-.2} y={p.solid![1]-.2} width={p.solid![2]+.4} height={p.solid![3]+.4} fill="#253d48"/>)}
 {engine.activeEntities().map(e=>{const anchor=ANCHORS.find(a=>a.entityId===e.id),objective=OBJECTIVES[s.stage].target===e.id;return <circle key={e.id} cx={e.x} cy={e.y} r={objective?.68:e.kind==='boss'?.65:e.kind==='warp'?.7:.43} fill={objective?'#ffe29c':e.kind==='warp'?'#ffe09a':e.kind==='save'?'#8be1f2':e.kind==='event'?'#d7a5ff':['mob','boss'].includes(e.kind)?'#f193a1':e.kind==='npc'?'#ebd4a9':'#c6d3d3'} stroke={anchor&&s.progress.anchors.includes(anchor.id)?'#fff':'#142832'} strokeWidth={anchor?.18:.08}/>;})}
 <circle cx={s.position.x} cy={s.position.y} r=".75" fill="#fff" stroke="#102331" strokeWidth=".22"/>
 </svg>;}
