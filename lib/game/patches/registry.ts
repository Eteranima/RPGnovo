import type {GamePatchDraft} from './types';

/** Prepared for the next update. Empty by request; no draft content is applied. */
export const PATCH_DRAFTS:readonly GamePatchDraft[]=[];
export function patchDraft(id:string){return PATCH_DRAFTS.find(p=>p.id===id);}
