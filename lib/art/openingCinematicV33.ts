/** Runtime contract for the finished film. No game progression or save data lives here. */
export const OPENING_CINEMATIC_V33 = {
 id: 'stone-reach-opening-v33',
 title: 'Éter Anima · O que o selo lembra',
 src: '/assets/v33/opening/eter-anima-opening-24fps.mp4',
 poster: '/assets/v33/opening/poster.png',
 frames: 1500,
 fps: 24,
 durationSeconds: 62.5,
 loadTimeoutMs: 30000,
} as const;

export type OpeningExitV33 = 'skip' | 'finished';

/** Zero-based encoded frame index, capped to the final native frame. */
export function openingFrameAtV33(seconds: number): number {
 const time = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
 return Math.min(OPENING_CINEMATIC_V33.frames - 1, Math.floor(time * OPENING_CINEMATIC_V33.fps));
}

/** Media metadata must match the delivered edit to within one encoded frame. */
export function openingDurationMatchesV33(seconds: number): boolean {
 return Number.isFinite(seconds) && Math.abs(seconds - OPENING_CINEMATIC_V33.durationSeconds) <= 1 / OPENING_CINEMATIC_V33.fps + 1e-6;
}

export function openingClockV33(seconds: number): string {
 const whole = Math.floor(Math.min(OPENING_CINEMATIC_V33.durationSeconds, Math.max(0, Number.isFinite(seconds) ? seconds : 0)));
 return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

/** Browser shortcuts remain available while all game keys are contained in the dialog. */
export function openingCapturesKeyV33(key: string, modifiers: {ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean}): boolean {
 return !(modifiers.ctrlKey || modifiers.metaKey || modifiers.altKey || /^F\d+$/i.test(key));
}

export function openingTabTargetV33(eventType: string, shift: boolean, current: number, count: number): number | null {
 if (eventType !== 'keydown' || count < 1) return null;
 if (current < 0) return shift ? count - 1 : 0;
 if (shift && current === 0) return count - 1;
 if (!shift && current === count - 1) return 0;
 return null;
}
