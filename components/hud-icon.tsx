import type { ButtonHTMLAttributes, CSSProperties } from 'react';

// Measured from the selected transparent 1254 px source; square crops preserve
// the complete silhouettes and exclude every neighbouring atlas icon.
const HUD_CROPS = {
  journal: { x: 12, y: 24, size: 248 },
  mail: { x: 283, y: 32, size: 223 },
  menu: { x: 501, y: 8, size: 253 },
  skills: { x: 759, y: 20, size: 230 },
  gear: { x: 1014, y: 17, size: 233 },
  bag: { x: 12, y: 249, size: 249 },
  fullscreenEnter: { x: 288, y: 273, size: 191 },
  fullscreenExit: { x: 528, y: 270, size: 200 },
  audioOn: { x: 752, y: 248, size: 253 },
  audioOff: { x: 1015, y: 264, size: 220 },
  help: { x: 8, y: 489, size: 255 },
  map: { x: 270, y: 499, size: 235 },
  rewards: { x: 512, y: 493, size: 236 },
  party: { x: 759, y: 497, size: 230 },
  bestiary: { x: 1006, y: 489, size: 247 },
  shop: { x: 13, y: 728, size: 251 },
  achievements: { x: 271, y: 734, size: 241 },
  scenes: { x: 520, y: 743, size: 214 },
  events: { x: 748, y: 731, size: 247 },
  gacha: { x: 1014, y: 746, size: 226 },
  settings: { x: 19, y: 981, size: 232 },
  emblem: { x: 264, y: 975, size: 246 },
  interact: { x: 507, y: 975, size: 238 },
  guard: { x: 757, y: 977, size: 241 },
  heal: { x: 998, y: 970, size: 247 },
} as const;

export type HudIconName = keyof typeof HUD_CROPS;

export function HudIcon({ name, className = '' }: { name: HudIconName; className?: string }) {
  const crop = HUD_CROPS[name];
  const style: CSSProperties = {
    backgroundImage: 'url(/assets/v25/ui/stone-reach-hud-atlas.png)',
    backgroundSize: `${1254 / crop.size * 100}% ${1254 / crop.size * 100}%`,
    backgroundPosition: `${crop.x / (1254 - crop.size) * 100}% ${crop.y / (1254 - crop.size) * 100}%`,
  };
  return <span aria-hidden="true" className={`hud-art-icon ${className}`} style={style} />;
}

type HudButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  icon: HudIconName;
  label: string;
  caption: string;
  shortcut?: string;
  badge?: number;
  badgeLabel?: string;
  active?: boolean;
};

export function HudButton({ icon, label, caption, shortcut, badge = 0, badgeLabel, active = false, className = '', ...props }: HudButtonProps) {
  return <button type="button" className={`icon-button hud-menu-button ${className}`} aria-label={label} aria-pressed={active} title={`${label}${shortcut ? ` · ${shortcut}` : ''}`} {...props}>
    <HudIcon name={icon} />
    <span className="hud-menu-caption">{caption}</span>
    {badge > 0 && <span className="menu-reward-count" aria-label={badgeLabel || `${badge} novidades`}>{badge > 99 ? '99+' : badge}</span>}
  </button>;
}
