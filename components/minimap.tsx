import { useId } from 'react';
import { OBJECTIVES } from '@/lib/game/data';
import { ANCHORS } from '@/lib/game/progression';
import type { GameEngine, Snapshot } from '@/lib/game/engine';
import { FIELD_ART_ROOT } from '@/components/field-hud-art';
import {QUEST_WORLD_ASSETS_V31} from '@/lib/game/questArtV31';

export function MiniMap({ s, engine }: { s: Snapshot; engine: GameEngine }) {
  const m = engine.map;
  const id = useId().replace(/:/g, '');
  const pattern = (name: string) => `url(#${id}-${name})`;
  return <svg className="minimap illustrated-minimap" viewBox={`-.5 -.5 ${m.width} ${m.height}`} role="img" aria-label={`Minimapa de ${m.name}: o diamante luminoso marca você, a estrela dourada indica a missão, portais indicam saídas, o cristal azul restaura o grupo e símbolos vermelhos indicam inimigos.`}>
    <defs>
      {['ground', 'wall', 'water'].map(name => <pattern key={name} id={`${id}-${name}`} patternUnits="userSpaceOnUse" width="6" height="6">
        <image href={`${FIELD_ART_ROOT}/map-${name}.png`} width="6" height="6" preserveAspectRatio="none" />
      </pattern>)}
    </defs>
    {m.rows.flatMap((row, y) => [...row].map((t, x) => <g key={`${x}-${y}`}>
      <rect x={x-.5} y={y-.5} width="1.01" height="1.01" fill={pattern(t==='#'?'wall':t==='w'||t==='i'?'water':'ground')} />
      {t==='g'&&<rect x={x-.5} y={y-.5} width="1.01" height="1.01" fill="#265343" opacity=".58" />}
      {t==='i'&&<rect x={x-.5} y={y-.5} width="1.01" height="1.01" fill="#b4edff" opacity=".55" />}
      {t==='b'&&<rect x={x-.5} y={y-.5} width="1.01" height="1.01" fill="#654b2e" opacity=".4" />}
    </g>))}
    {m.props.filter(p => p.solid).map((p, i) => <rect key={`prop-${i}`} x={p.solid![0]-.2} y={p.solid![1]-.2} width={p.solid![2]+.4} height={p.solid![3]+.4} fill={pattern('wall')} stroke="#132b37" strokeWidth=".08" />)}
    {engine.activeEntities().map(e => {
      const anchor = ANCHORS.find(a => a.entityId===e.id);
      const objective = OBJECTIVES[s.stage].target===e.id;
      const locked = !!e.minStage&&s.stage<e.minStage;
      const sprite = objective?'marker-objective':e.kind==='warp'?locked?'marker-lock':e.to?`destination-${e.to}`:'marker-travel':e.kind==='save'?'marker-save':e.kind==='event'?'marker-event':e.kind==='boss'?'marker-boss':e.kind==='mob'?'marker-enemy':e.kind==='npc'?'marker-npc':'marker-chest';
      const questArt=e.id.startsWith('v31:')&&e.asset?QUEST_WORLD_ASSETS_V31[e.asset]:undefined;
      const size = questArt?2.1:objective?2.15:e.kind==='warp'||e.kind==='boss'?2:1.55;
      return <g key={e.id} className={`minimap-marker ${objective?'minimap-objective':''}`}>
        <title>{e.label}{objective?' · missão atual':''}{locked?' · passagem bloqueada':''}</title>
        {anchor&&s.progress.anchors.includes(anchor.id)&&<circle cx={e.x} cy={e.y} r="1.08" fill="none" stroke="#fff4dc" strokeWidth=".13" />}
        <image href={questArt||`${FIELD_ART_ROOT}/${sprite}.png`} x={e.x-size/2} y={e.y-size/2} width={size} height={size} preserveAspectRatio="xMidYMid meet" />
      </g>;
    })}
    <g className="minimap-player">
      <title>Você · {s.heroes[0].name}</title>
      <circle cx={s.position.x} cy={s.position.y} r="1.08" fill="#081721" fillOpacity=".75" stroke="#f9f0d0" strokeWidth=".12" />
      <image href={`${FIELD_ART_ROOT}/marker-player.png`} x={s.position.x-1.15} y={s.position.y-1.15} width="2.3" height="2.3" />
    </g>
  </svg>;
}
