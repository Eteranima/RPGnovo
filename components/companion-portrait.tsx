import type { CSSProperties } from 'react';
import type { HeroId } from '@/lib/game/data';
import { COMPANION_ART_V31, HERO_COMPANION_V31, type CompanionId } from '@/lib/art/companionsV31';
import styles from './companion-portrait.module.css';

export type CompanionPortraitProps = {
  heroId?: HeroId;
  companionId?: CompanionId;
  size?: number | string;
  variant?: 'face' | 'fullbody';
  decorative?: boolean;
  className?: string;
};

/** No world atlas or hero portrait fallback: each companion owns a native cutout. */
export function CompanionPortrait({ heroId, companionId, size = 64, variant = 'face', decorative = false, className = '' }: CompanionPortraitProps) {
  const id = companionId ?? (heroId ? HERO_COMPANION_V31[heroId] : undefined);
  if (!id) return null;
  const art = COMPANION_ART_V31[id];
  const style = { '--companion-size': typeof size === 'number' ? `${size}px` : size } as CSSProperties;
  return <span className={`${styles.portrait} ${variant === 'fullbody' ? styles.fullbody : styles.face} ${className}`} style={style} data-companion={id} aria-hidden={decorative || undefined}>
    {/* A plain image preserves the generated RGBA pixels and the native face crop. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={art[variant]} alt={decorative ? '' : art.name} decoding="async" loading="lazy" draggable={false} />
  </span>;
}
