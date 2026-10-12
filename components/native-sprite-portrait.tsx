'use client';

import { forwardRef, useEffect, useId, useState, type CSSProperties } from 'react';
import type { SpriteCrop } from '@/lib/game/sprites';
import { nativeSpriteViewBox } from '@/lib/art/nativeSpriteViewport';

type NativeSpritePortraitProps = {
  src: string;
  crop?: SpriteCrop;
  sheetSize?: { width: number; height: number };
  name: string;
  decorative?: boolean;
  style?: CSSProperties;
};

/** Displays one measured atlas cell, preserving the native PNG and its aspect ratio. */
export const NativeSpritePortrait = forwardRef<SVGSVGElement, NativeSpritePortraitProps>(function NativeSpritePortrait({ src, crop, sheetSize, name, decorative, style }, ref) {
  const clipId = useId();
  const [loaded, setLoaded] = useState<{ src: string; width: number; height: number } | null>(null);
  useEffect(() => {
    if (sheetSize) return;
    let disposed = false;
    const image = new Image();
    image.onload = () => {
      if (!disposed) setLoaded({ src, width: image.naturalWidth, height: image.naturalHeight });
    };
    image.src = src;
    return () => { disposed = true; image.onload = null; };
  }, [src, sheetSize]);
  const dimensions = sheetSize ?? (loaded?.src === src ? loaded : undefined);
  return <svg ref={ref} viewBox={crop ? nativeSpriteViewBox(crop) : undefined} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" overflow="hidden" style={style} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : name} aria-hidden={decorative || undefined} data-native-sprite={src}>
    {crop && <defs><clipPath id={clipId} clipPathUnits="userSpaceOnUse"><rect data-native-clip x={crop.x} y={crop.y} width={crop.w} height={crop.h} /></clipPath></defs>}
    {crop && dimensions && <g clipPath={`url(#${clipId})`}><image href={src} width={dimensions.width} height={dimensions.height} /></g>}
  </svg>;
});
