import {LEGENDARY_VARIANTS_V36,type LegendaryVariantIdV36} from './variantsV36';
export const BLOOD_MOON_EVENT_V36={id:'blood-moon-five-seals',name:'Lua de Sangue — O Baile dos Cinco Selos',rewardCrystals:800,rewardPulls:5,permanent:true,steps:[
 {name:'O convite de Shin',description:'Visite o Arquivo Central para reconhecer a escrita do primeiro selo.',kind:'travel',target:'arquivo',lore:'Seiji abre uma página vazia. A máscara de origami preserva os nomes que ninguém deveria esquecer.'},
 {name:'Flores sob a lua rubra',description:'Converse com Ava no Domo. Mika manteve o jardim frio, mesmo sob a luz rubra.',kind:'npc',target:'ava',lore:'Ophelia recolhe a flor de geada. Seu elemento continua Gelo: proteger a vida também é uma forma de resistir.'},
 {name:'Uma vigília sem estrelas',description:'Use Guardar em um combate. Nenhuma versão 5★ é necessária.',kind:'action',target:'guard',lore:'Umbra atravessa as sombras do salão. Marin não toma o trono de quem abandona os seus: aprende a permanecer.'},
 {name:'O juramento da fera',description:'Vença um combate depois de guardar. Vale um encontro comum.',kind:'victory',target:'any',lore:'Dante acompanha Gabriel. A máscara solar não esconde sua humanidade; revela a promessa de abrir caminho ao grupo.'},
 {name:'O último acorde',description:'Volte ao Pátio e fale com Beatriz para registrar os cinco selos.',kind:'npc',target:'beatriz',lore:'Vajra encontra o ritmo de Max. Os cinco selos se unem: páginas, flores, sombras, brasas e pregos têm lugar no mesmo baile.'},
] as const};
export type BloodMoonProgressV36={accepted:boolean;step:number;claimed:boolean};
export const freshBloodMoonV36=():BloodMoonProgressV36=>({accepted:false,step:0,claimed:false});
export function normalizeBloodMoonV36(value:unknown):BloodMoonProgressV36{
 if(!value||typeof value!=='object')return freshBloodMoonV36();const v=value as Record<string,unknown>;
 const accepted=v.accepted===true,step=accepted&&Number.isInteger(v.step)?Math.max(0,Math.min(5,Number(v.step))):0;
 return {accepted,step,claimed:accepted&&step===5&&v.claimed===true};
}
export function advanceBloodMoonV36(progress:BloodMoonProgressV36,kind:string,target:string){const step=BLOOD_MOON_EVENT_V36.steps[progress.step];if(!progress.accepted||progress.claimed||!step||step.kind!==kind||step.target!=='any'&&step.target!==target)return false;progress.step++;return true;}
export const MYTHIC_VARIANT_IDS_V36=LEGENDARY_VARIANTS_V36.map(variant=>variant.id);
export const BLOOD_MOON_LEGENDARY_EVENT_V36={id:'blood-moon-legendary-pages',name:'Lua de Sangue — As Três Páginas Livres',permanent:true,choiceIds:MYTHIC_VARIANT_IDS_V36,rewardDescription:'Escolha garantida de uma versão mítica lendária 5★, uma única vez. Sem gasto, sorteio ou exigência de possuir 5★.',steps:[
 {name:'A raiz que acolhe',description:'Converse com Ava no Domo para ouvir sobre a raiz mineral sob o salão.',kind:'npc',target:'ava',lore:'No outro mundo, Ava ergue abrigo em vez de fronteiras. A rocha guarda espaço para qualquer pessoa criar raízes.'},
 {name:'Uma margem para os nossos',description:'Restaure HP de um aliado vivo com uma habilidade em combate. As curas comuns servem.',kind:'heal',target:'any',lore:'Beatriz não pergunta quem merece alcançar a margem. Sua corrente vem ao encontro de quem precisa.'},
 {name:'O fogo não escreve destinos',description:'Converse com Abel na Clareira da Pira sobre uma forja que mantém as páginas livres.',kind:'npc',target:'abel-forja',lore:'Abel observa os estilhaços: uma forma pode ser refeita sem perder a memória de quem a escolheu.'},
 {name:'Abrigo em movimento',description:'Vença um combate comum após ouvir Abel. Nenhuma versão mítica é necessária.',kind:'victory',target:'any',lore:'O grupo protege a página em branco. A coragem não depende da máscara nem da raridade de quem a veste.'},
 {name:'A coroa e a margem',description:'Volte ao Pátio e conclua uma conversa com Beatriz.',kind:'npc',target:'beatriz',lore:'A rainha das duas marés se recusa a governar destinos. Ela abre a margem; cada pessoa escolhe seu caminho.'},
 {name:'O nome de quem escolhe',description:'Converse com Orfeu na Ala de Estudos para registrar sua escolha livre.',kind:'npc',target:'orfeu',lore:'Orfeu rompe o selo com a palma. Sem elemento, sem profecia: nenhuma página terá o direito de decidir por você.'},
] as const};
export type BloodMoonLegendaryProgressV36={accepted:boolean;step:number;claimed:boolean;chosen:LegendaryVariantIdV36|null};
export const freshBloodMoonLegendaryV36=():BloodMoonLegendaryProgressV36=>({accepted:false,step:0,claimed:false,chosen:null});
export function normalizeBloodMoonLegendaryV36(value:unknown,actOne:BloodMoonProgressV36,summoned:readonly string[]):BloodMoonLegendaryProgressV36{
 if(!actOne.claimed||!value||typeof value!=='object')return freshBloodMoonLegendaryV36();const v=value as Record<string,unknown>,accepted=v.accepted===true,step=accepted&&Number.isInteger(v.step)?Math.max(0,Math.min(6,Number(v.step))):0;
 const chosen=MYTHIC_VARIANT_IDS_V36.find(id=>id===v.chosen&&summoned.includes(id))||null,claimed=accepted&&step===6&&v.claimed===true&&chosen!==null;
 return {accepted,step,claimed,chosen:claimed?chosen:null};
}
export function advanceBloodMoonLegendaryV36(progress:BloodMoonLegendaryProgressV36,kind:string,target:string){const step=BLOOD_MOON_LEGENDARY_EVENT_V36.steps[progress.step];if(!progress.accepted||progress.claimed||!step||step.kind!==kind||step.target!=='any'&&step.target!==target)return false;progress.step++;return true;}
