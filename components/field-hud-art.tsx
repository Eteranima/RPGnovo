import type { ReactNode } from 'react';
import { Progress } from '@/components/ui/progress';
import type { MapId } from '@/lib/game/data';

export const FIELD_ART_ROOT = '/assets/v26/ui';

export function FieldArt({ name, className = '' }: { name: string; className?: string }) {
  return <img className={`field-art ${className}`} src={`${FIELD_ART_ROOT}/${name}.png`} alt="" aria-hidden="true" draggable={false} />;
}

export function VitalVessel({ kind, current, maximum, owner }: { kind: 'hp' | 'mp'; current: number; maximum: number; owner: string }) {
  const percent = Math.max(0, Math.min(100, current / Math.max(1, maximum) * 100));
  return <span className={`vital-vessel vital-${kind}`}>
    <FieldArt name={`${kind}-vessel`} className="vital-frame" />
    <Progress className="vital-track" value={percent} aria-label={`${owner} · ${kind.toUpperCase()}`} aria-valuetext={`${current} de ${maximum}`} />
  </span>;
}

export function TravelDestinationArt({ destination }: { destination?: MapId }) {
  return <FieldArt name={destination ? `destination-${destination}` : 'marker-travel'} className="travel-destination-art" />;
}

export function CartographyFrame({ children }: { children: ReactNode }) {
  return <span className="cartography-frame">
    <span className="cartography-aperture">{children}</span>
    <FieldArt name="minimap-frame" className="cartography-ornament" />
  </span>;
}
