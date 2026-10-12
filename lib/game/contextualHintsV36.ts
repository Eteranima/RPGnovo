export type ContextualHintV36={id:string;title:string;text:string;action:'skills'|'gacha'|'party'|'combat'|null};
export const CONTEXTUAL_HINT_IDS_V36=['build-paths','variant-equipped','event-invitation','guard-counterplay'] as const;
export function normalizeContextualHintsV36(value:unknown){return Array.isArray(value)?CONTEXTUAL_HINT_IDS_V36.filter(id=>value.includes(id)):[];}
