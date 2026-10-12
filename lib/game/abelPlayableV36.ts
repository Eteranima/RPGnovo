import type {Hero,SignatureTechnique} from './data';

/** The already summoned professor becomes a complete playable family. */
export const ABEL_BASE_V36:Hero={id:'abel',name:'Abel',element:'Fogo Primordial',role:'DPS técnico / Proteção',maxHp:84,hp:84,maxMp:58,mp:58,atk:19,spd:12,guard:false};
export type AbelSkillV36=SignatureTechnique&{hero:'abel';motif:1|2|3|4;iconIndex:0|1|2|3|4;treeCost?:1|2};
export const ABEL_SKILLS_V36:readonly AbelSkillV36[]=[
 {hero:'abel',id:'primordial-spark',name:'Centelha Primordial',cost:8,node:'',requires:'',target:'enemy',damage:36,motif:1,iconIndex:0,description:'36 de dano de Fogo Primordial, sem aplicar estados.'},
 {hero:'abel',id:'ember-mantle',name:'Manto da Brasa',cost:9,node:'',requires:'',target:'ally',guard:'ally',cleanse:'bleed',motif:2,iconIndex:1,description:'Concede guarda a um aliado vivo e remove sangramento.'},
 {hero:'abel',id:'hearth-rest',name:'Repouso da Forja',cost:13,node:'abel-hearth-rest',requires:'abel-vital',treeCost:1,target:'party',heal:24,motif:2,iconIndex:2,description:'Restaura 24 HP de cada aliado vivo. Não revive.'},
 {hero:'abel',id:'lion-fang',name:'Presa do Leão',cost:11,node:'abel-lion-fang',requires:'abel-power',treeCost:1,target:'enemy',damage:32,status:'blind',turns:1,motif:1,iconIndex:3,description:'32 de dano de Fogo Primordial; cegueira por 1 ação.'},
 {hero:'abel',id:'cinder-interdict',name:'Interdição das Cinzas',cost:12,node:'abel-cinder-interdict',requires:'abel-lion-fang',treeCost:2,target:'enemy',damage:26,status:'silence',turns:1,motif:3,iconIndex:3,description:'26 de dano de Fogo Primordial; silêncio por 1 ação.'},
 {hero:'abel',id:'crucible-break',name:'Ruptura do Cadinho',cost:14,node:'abel-crucible-break',requires:'abel-master',treeCost:2,target:'enemy',damage:42,chargeDrain:20,motif:4,iconIndex:4,description:'42 de dano de Fogo Primordial; reduz a carga inimiga em 20 pontos.'},
 {hero:'abel',id:'primordial-oath',name:'Juramento da Primeira Chama',cost:15,node:'abel-primordial-oath',requires:'abel-master',treeCost:2,target:'enemy',damage:36,guard:'party',motif:4,iconIndex:4,description:'36 de dano de Fogo Primordial e guarda para os aliados vivos.'},
];
export const ABEL_PASSIVES_V36=[
 {id:'abel-vital',hero:'abel' as const,name:'Fôlego da Forja',cost:1,icon:10,description:'+15 HP máximos.'},
 {id:'abel-power',hero:'abel' as const,name:'Cristal Incandescente',cost:1,icon:0,description:'Centelha Primordial causa 8 de dano adicionais.'},
 {id:'abel-reserve',hero:'abel' as const,name:'Calor Preservado',cost:1,requires:'abel-vital',icon:5,description:'+8 MP máximos; não restaura MP ao aprender.'},
 {id:'abel-master',hero:'abel' as const,name:'Domador da Primeira Chama',cost:2,requires:'abel-lion-fang',icon:15,description:'+12 de dano à ultimate Leão do Fogo Primordial.'},
] as const;
export const ABEL_ULTIMATE_V36={name:'Leão do Fogo Primordial',damage:96,chargeDrain:20,weaken:true,description:'Uma juba de fogo primordial rompe o campo: 96 de dano de Fogo, enfraquece o próximo golpe e reduz a carga inimiga em 20 pontos.'} as const;
export const abelSkillV36=(id:string)=>ABEL_SKILLS_V36.find(skill=>skill.id===id);
export const abelSkillIconV36=(id:string)=>id==='ultimate'||abelSkillV36(id)?`skill_icon_abel_${id}`:null;
