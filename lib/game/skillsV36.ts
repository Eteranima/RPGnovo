import type {HeroId,SignatureTechnique} from './data';
import {abelSkillIconV36} from './abelPlayableV36';

export type SkillCategoryV36='damage'|'control'|'support';
export type SkillV36=SignatureTechnique & {hero:HeroId;treeCost:1|2;category:SkillCategoryV36;motif:1|2|3};
const skill=(hero:HeroId,id:string,name:string,cost:number,treeCost:1|2,requires:string,target:SignatureTechnique['target'],description:string,effect:Partial<SignatureTechnique>,category:SkillCategoryV36,motif:1|2|3):SkillV36=>({hero,id,name,cost,treeCost,node:`${hero}-${id}`,requires,target,description,...effect,category,motif});

/** Additive unlocks: existing action IDs, learned nodes and damage formulas stay valid. */
export const SKILLS_V36:readonly SkillV36[]=[
 skill('seiji','ink-refuge','Abrigo de Papel',10,1,'seiji-vital','ally','Restaura 18 HP de um aliado vivo e concede guarda.',{heal:18,guard:'ally'},'support',2),
 skill('seiji','ink-counterseal','Contrasselo',11,2,'seiji-bleed','enemy','28 de dano de Tinta; reduz a carga inimiga em 15 pontos.',{damage:28,chargeDrain:15},'control',3),
 skill('ophelia','ice-mirror','Espelho Glacial',10,1,'ophelia-vital','enemy','24 de dano de Gelo; enfraquece o próximo golpe. Não consome a imobilização.',{damage:24,weaken:true},'control',3),
 skill('ophelia','glacier-pulse','Pulso do Degelo',14,2,'ophelia-cleanse','party','Restaura 18 HP dos aliados vivos e remove cegueira.',{heal:18,cleanse:'blind'},'support',2),
 skill('max','nail-silencer','Prego Mudo',12,1,'max-control','enemy','32 de dano elétrico; silêncio por 1 ação.',{damage:32,status:'silence',turns:1},'control',3),
 skill('max','nail-anchor','Âncora Voltaica',11,2,'max-control','enemy','28 de dano elétrico; enfraquece o próximo golpe.',{damage:28,weaken:true},'control',3),
 skill('max','ground-wire','Fio Terra',9,2,'max-vital','ally','Concede guarda a um aliado vivo e remove cegueira. O fio conduz Eletricidade.',{guard:'ally',cleanse:'blind'},'support',2),
 skill('beatriz','water-veil','Véu da Margem',10,1,'beatriz-vital','ally','Restaura 18 HP de um aliado vivo e concede guarda.',{heal:18,guard:'ally'},'support',2),
 skill('beatriz','undertow','Contracorrente',11,2,'beatriz-master','enemy','30 de dano de Água / Trevas; reduz a carga inimiga em 15 pontos.',{damage:30,chargeDrain:15},'control',3),
 skill('beatriz','twin-current','Correntes Gêmeas',12,2,'beatriz-master','enemy','40 de dano de Água / Trevas, sem aplicar estados.',{damage:40},'damage',1),
 skill('orfeu','null-collapse','Colapso Físico',12,1,'orfeu-vital','enemy','44 de dano físico. Não usa magia elemental.',{damage:44,physical:true},'damage',1),
 skill('orfeu','quiet-step','Respiração Nula',8,1,'orfeu-vital','self','Restaura 22 HP de Orfeu e remove silêncio. Pode ser usada sob silêncio: é respiração física.',{heal:22,cleanse:'silence',canUseSilenced:true},'support',2),
 skill('orfeu','vacuum-anchor','Âncora do Vazio',12,2,'orfeu-master','enemy','22 de dano físico; reduz a carga inimiga em 25 pontos.',{damage:22,chargeDrain:25,physical:true},'control',3),
 skill('orfeu','null-reversal','Reversão Nula',13,2,'orfeu-master','ally','Concede guarda a um aliado vivo e remove todos os estados.',{guard:'ally',cleanse:'all'},'support',2),
 skill('orfeu','mute-contact','Contato Cego',11,2,'orfeu-vital','enemy','24 de dano físico; cegueira por 1 ação.',{damage:24,status:'blind',turns:1,physical:true},'control',3),
 skill('ava','bedrock-ward','Guarda de Basalto',10,1,'ava-vital','ally','Restaura 16 HP de um aliado vivo e concede guarda.',{heal:16,guard:'ally'},'support',2),
 skill('ava','fault-line','Linha de Falha',11,1,'ava-vital','enemy','36 de dano de Terra; enfraquece o próximo golpe.',{damage:36,weaken:true},'control',3),
 skill('ava','stonefall','Queda de Estratos',13,2,'ava-master','enemy','48 de dano de Terra, sem aplicar estados.',{damage:48},'damage',1),
 skill('ava','mineral-purge','Purga Mineral',12,2,'ava-master','ally','Restaura 24 HP de um aliado vivo e remove todos os estados.',{heal:24,cleanse:'all'},'support',2),
 skill('ava','strata-pressure','Pressão dos Estratos',12,2,'ava-vital','enemy','30 de dano de Terra; reduz a carga inimiga em 20 pontos.',{damage:30,chargeDrain:20},'control',3),
 skill('carmilla','sanguine-lance','Lança Rubra',10,1,'carmilla-vital','enemy','38 de dano de Sangue, sem transferir feridas.',{damage:38},'damage',1),
 skill('carmilla','red-veil','Véu Rubro',10,1,'carmilla-vital','ally','Concede guarda a um aliado vivo e remove sangramento.',{guard:'ally',cleanse:'bleed'},'support',2),
 skill('carmilla','blood-tax','Tributo Escarlate',12,2,'carmilla-suture','enemy','30 de dano de Sangue; enfraquece o próximo golpe.',{damage:30,weaken:true},'control',3),
 skill('carmilla','hematic-focus','Pulso Vital',9,2,'carmilla-return','self','Restaura 24 HP de Carmilla. Não transfere dano aos aliados.',{heal:24},'support',2),
];
export const skillV36=(id:string)=>SKILLS_V36.find(skill=>skill.id===id);
export const skillIconKeyV36=(hero:HeroId,action:string)=>hero==='abel'?abelSkillIconV36(action):skillV36(action)?.hero===hero?`skill_icon_${hero}_${action}`:null;

export type PassiveNodeV36={id:string;hero:HeroId;name:string;cost:1;requires:string;icon:number;description:string;bonus:'guard-mp'|'reserve-mp'|'tide-power'|'margin-heal'|'suture-heal'};
export const PASSIVES_V36:readonly PassiveNodeV36[]=[
 {id:'max-precision',hero:'max',name:'Circuito de Retorno',cost:1,requires:'max-vital',icon:15,description:'Guardar recupera 2 MP adicionais.',bonus:'guard-mp'},
 {id:'beatriz-power',hero:'beatriz',name:'Fio da Maré',cost:1,requires:'beatriz-vital',icon:2,description:'Lâmina da Maré causa 8 de dano adicionais.',bonus:'tide-power'},
 {id:'beatriz-reserve',hero:'beatriz',name:'Reservatório Sereno',cost:1,requires:'beatriz-vital',icon:5,description:'+8 MP máximos; não restaura MP ao aprender.',bonus:'reserve-mp'},
 {id:'beatriz-care',hero:'beatriz',name:'Cuidado da Margem',cost:1,requires:'beatriz-master',icon:3,description:'Margem Serena restaura 6 HP adicionais.',bonus:'margin-heal'},
 {id:'orfeu-stance',hero:'orfeu',name:'Respiração de Combate',cost:1,requires:'orfeu-vital',icon:10,description:'Guardar recupera 2 MP adicionais.',bonus:'guard-mp'},
 {id:'ava-reserve',hero:'ava',name:'Veio Profundo',cost:1,requires:'ava-vital',icon:5,description:'+8 MP máximos; não restaura MP ao aprender.',bonus:'reserve-mp'},
 {id:'carmilla-reserve',hero:'carmilla',name:'Reserva Rubra',cost:1,requires:'carmilla-vital',icon:5,description:'+8 MP máximos; não restaura MP ao aprender.',bonus:'reserve-mp'},
 {id:'carmilla-care',hero:'carmilla',name:'Ponto Preciso',cost:1,requires:'carmilla-return',icon:3,description:'Ponto de Retorno restaura 6 HP adicionais.',bonus:'suture-heal'},
];
export function passiveBonusV36(hero:HeroId,learned:readonly string[],bonus:PassiveNodeV36['bonus']){return PASSIVES_V36.some(node=>node.hero===hero&&node.bonus===bonus&&learned.includes(node.id));}
