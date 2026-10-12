import {variantByIdV36,type VariantIdV36} from './variantsV36';
/** Original compositions are supplied by the art/audio owner at these fixed paths. */
export const variantAudioPathV36=(id:VariantIdV36,beat:'cast'|'ultimate')=>`/assets/v36/audio/${id}/${beat}.wav`;
export function variantSoundCueV36(id:string|undefined,action:string){const variant=variantByIdV36(id);if(!variant)return null;return action==='ultimate'?variantAudioPathV36(variant.id,'ultimate'):action===variant.signature.id?variantAudioPathV36(variant.id,'cast'):null;}
