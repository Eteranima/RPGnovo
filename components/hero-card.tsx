import type { CSSProperties } from 'react';
import { Progress } from '@/components/ui/progress';
import { ASSETS, COMPANIONS } from '@/lib/game/data';
import { HERO_CARD_ART, type CardAperture, type HeroCardId } from '@/lib/game/heroCardArt';

/** Display-only input: optional vitals let summon entries retain their real data. */
export type CardHeroDisplay = {
  id: HeroCardId;
  name: string;
  element: string;
  companion?: string;
  portrait?: string;
  hp?: number;
  maxHp?: number;
  mp?: number;
  maxMp?: number;
};

function apertureStyle(aperture: CardAperture): CSSProperties {
  return { left: `${aperture.left}%`, top: `${aperture.top}%`, width: `${aperture.width}%`, height: `${aperture.height}%` };
}

export function HeroPortrait({ h, lycan = false, style }: { h: Pick<CardHeroDisplay, 'id' | 'portrait'>; lycan?: boolean; style?: CSSProperties }) {
  const portraitId = h.id === 'gabriel' && lycan ? 'gabriel_lycan' : h.id;
  const art = HERO_CARD_ART[h.id];
  const face = ASSETS[`face_${portraitId}`];
  return <span className={`character-portrait character-portrait-${portraitId}`} style={style} aria-hidden="true">
    <span className="character-portrait-window" style={apertureStyle(art.portraitAperture)}>
      <img src={face || h.portrait || ASSETS[`dlg_${portraitId}`]} style={face?{left:0,top:0,width:'100%',height:'100%',transform:'none',objectFit:'cover'}:undefined} alt="" draggable={false} />
    </span>
    <img className="character-ring" src={art.ring} alt="" draggable={false} />
  </span>;
}

function CharacterVital({ kind, current, maximum, h }: { kind: 'hp' | 'mp'; current: number; maximum: number; h: CardHeroDisplay }) {
  const art = HERO_CARD_ART[h.id];
  const percent = Math.max(0, Math.min(100, current / Math.max(1, maximum) * 100));
  return <div className={`character-stat character-stat-${kind}`}>
    <span className="character-stat-label">{kind.toUpperCase()}</span>
    <span className={`character-vessel ${art.trackAboveFrame ? 'character-track-over-frame' : ''}`}>
      <Progress className="character-vital-track" style={apertureStyle(kind === 'hp' ? art.hpAperture : art.mpAperture)} value={percent} aria-label={`${h.name} · ${kind.toUpperCase()}`} aria-valuetext={`${current} de ${maximum}`} />
      <img className="character-vessel-frame" src={art[kind]} alt="" aria-hidden="true" draggable={false} />
    </span>
    <span className="character-vital-numbers"><b>{current}</b><span> / </span><span>{maximum}</span></span>
  </div>;
}

export function HeroCard({ h, active = false, lycan = false, showVitals = true, detail, className = '' }: {
  h: CardHeroDisplay;
  active?: boolean;
  lycan?: boolean;
  showVitals?: boolean;
  detail?: string;
  className?: string;
}) {
  const hasVitals = showVitals && h.hp !== undefined && h.maxHp !== undefined && h.mp !== undefined && h.maxMp !== undefined;
  const companion = h.companion ?? (h.id === 'abel' ? undefined : COMPANIONS[h.id].name);
  const art = HERO_CARD_ART[h.id];
  const portraitStyle: CSSProperties = {
    left: art.portraitCenter ? `${art.portraitCenter.left}%` : 'var(--character-portrait-center, 62px)',
    top: art.portraitCenter ? `${art.portraitCenter.top}%` : '50%',
    transform: `translate(-${art.portraitAperture.left + art.portraitAperture.width / 2}%, -${art.portraitAperture.top + art.portraitAperture.height / 2}%)`,
  };
  return <div className={`character-card character-card-${h.id} ${active ? 'character-card-active' : ''} ${hasVitals ? 'character-card-vitals' : 'character-card-identity'} ${className}`} data-character-card={h.id} role="group" aria-label={`${h.name}${active ? ' · personagem ativo' : ''}`}>
    <img className="character-card-frame" src={HERO_CARD_ART[h.id].frame} alt="" aria-hidden="true" draggable={false} />
    <HeroPortrait h={h} lycan={lycan} style={portraitStyle} />
    <div className="character-card-content">
      <div className="character-card-heading">
        <strong className="character-name">{h.name}</strong>
        <span className="character-identity"><span>{h.element}</span>{companion && <><span aria-hidden="true"> · </span><span>{companion}</span></>}</span>
      </div>
      {hasVitals ? <div className="character-vitals">
        <CharacterVital kind="hp" current={h.hp!} maximum={h.maxHp!} h={h} />
        <CharacterVital kind="mp" current={h.mp!} maximum={h.maxMp!} h={h} />
      </div> : detail ? <span className="character-detail">{detail}</span> : null}
    </div>
  </div>;
}
