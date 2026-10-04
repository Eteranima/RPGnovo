export type QuestArtKindV31='tutorial'|'short'|'medium'|'long';
export const QUEST_ART_V31:Record<QuestArtKindV31,string>={
 tutorial:'/assets/v31/journal/quest-tutorial.png',
 short:'/assets/v31/journal/quest-short.png',
 medium:'/assets/v31/journal/quest-medium.png',
 long:'/assets/v31/journal/quest-long.png',
};
export const QUEST_WORLD_ASSETS_V31=Object.fromEntries(Object.entries(QUEST_ART_V31).map(([kind,path])=>[`quest_${kind}`,path]));
