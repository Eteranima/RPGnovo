import {heroBases,ULTIMATE_NAMES} from './data';
import {variantByIdV36,type VariantIdV36} from './variantsV36';

type HeroLabelInputV36={id:string;name:string;variantId?:VariantIdV36};

/** Compact labels do not replace the full name used by accessible controls. */
export function heroUiNameV36(hero:HeroLabelInputV36){
 const variant=variantByIdV36(hero.variantId);
 if(!variant||variant.hero!==hero.id)return {name:hero.name,variantTitle:null,fullName:hero.name};
 const family=heroBases().find(base=>base.id===variant.hero)!.name;
 const prefix=family+' — ';
 return {name:family,variantTitle:variant.name.startsWith(prefix)?variant.name.slice(prefix.length):variant.name,fullName:variant.name};
}

export function heroUiUltimateV36(hero:HeroLabelInputV36){
 const variant=variantByIdV36(hero.variantId);
 return variant?.hero===hero.id?variant.ultimate.name:ULTIMATE_NAMES[hero.id as keyof typeof ULTIMATE_NAMES];
}
