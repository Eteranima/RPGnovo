import type { SpriteCrop } from '../game/sprites';

/** A viewBox clips the native raster; it never repaints or recolours the sprite. */
export function nativeSpriteViewBox(crop: SpriteCrop): string {
  return `${crop.x} ${crop.y} ${crop.w} ${crop.h}`;
}

export function applyNativeSpriteCrop(viewport: SVGSVGElement, crop: SpriteCrop): void {
  viewport.setAttribute('viewBox', nativeSpriteViewBox(crop));
  const clip = viewport.querySelector('[data-native-clip]');
  for (const [attribute, value] of Object.entries({ x: crop.x, y: crop.y, width: crop.w, height: crop.h })) {
    clip?.setAttribute(attribute, String(value));
  }
}

/** Uses the battle clock, so pause, speed and reduced motion share the actual action. */
export function companionPoseV36(age: number, duration: number, impactAt: number, reducedMotion: boolean): 0 | 1 | 2 | 3 {
  if (reducedMotion) return 2;
  const contact = Math.max(1, Math.min(duration, impactAt));
  if (age < contact * .35) return 0;
  if (age < contact) return 1;
  if (age < contact + (duration - contact) * .6) return 2;
  return 3;
}
