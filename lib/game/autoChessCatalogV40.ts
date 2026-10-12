import type {HeroId,CombatElement} from './data';

export type ChessRoleV40='guardian'|'duelist'|'arcanist'|'support';
export type ChessNpcIdV40='runewarden'|'moth'|'ashwolf'|'lunastag'|'selo'|'eco'|'cinder'|'astral';
export type ChessAbilityV40='blast'|'heal'|'shield'|'leap'|'chain'|'drain'|'silence'|'root'|'wave'|'cleave'|'intercept'|'frostNova'|'hunt'|'charge'|'shatter'|'rescue'|'pyre'|'orbit';
export type ChessPieceV40={id:string;name:string;hero:HeroId|ChessNpcIdV40;artId:string;cost:1|2|3|4|5;element:CombatElement;role:ChessRoleV40;traits:string[];hp:number;attack:number;armor:number;range:number;attackTicks:number;maxMana:number;power:number;ability:ChessAbilityV40;skillName:string;description:string};
const piece=(id:string,name:string,hero:ChessPieceV40['hero'],artId:string,cost:ChessPieceV40['cost'],element:CombatElement,role:ChessRoleV40,trait:string,hp:number,attack:number,armor:number,range:number,attackTicks:number,maxMana:number,power:number,ability:ChessAbilityV40,skillName:string,description:string):ChessPieceV40=>({id,name,hero,artId,cost,element,role,traits:[trait,role],hp,attack,armor,range,attackTicks,maxMana,power,ability,skillName,description});
/** Store costs and upgrade stars belong to this league, never to Gacha rarity. */
export const CHESS_PIECES_V40:readonly ChessPieceV40[]=[
 piece('seiji','Seiji','seiji','seiji',1,'ink','arcanist','ink',500,54,18,3,12,70,145,'silence','Interdição de Shin','145 de magia no alvo mais próximo; impede habilidades por 1,2 s.'),
 piece('ophelia','Ophelia','ophelia','ophelia',1,'ice','support','ice',530,46,20,3,13,70,150,'heal','Flor de Mika','Cura 150 HP do aliado com menor porcentagem de vida em alcance de 3 casas.'),
 piece('marin','Marin','marin','marin',1,'dark','duelist','dark',510,64,15,1,10,70,165,'leap','Passo de Umbra','Salta para uma casa livre junto ao inimigo mais distante e causa 165 de magia.'),
 piece('gabriel','Gabriel','gabriel','gabriel',1,'fire','guardian','fire',760,51,32,1,13,80,180,'shield','Juramento de Dante','Recebe 180 de escudo e protege o aliado mais ferido em alcance de 2 casas.'),
 piece('max','Max','max','max',1,'lightning','duelist','lightning',500,61,16,3,11,75,145,'chain','Prego Condutor','145 de magia no alvo; um segundo inimigo em alcance de 2 recebe metade.'),
 piece('ava','Ava','ava','ava',2,'earth','guardian','earth',850,57,38,1,14,85,180,'root','Stone Reach','180 de magia no alvo e nos vizinhos; prende o alvo por 1 s.'),
 {...piece('beatriz','Beatriz','beatriz','beatriz',2,'water-dark','support','water',660,54,22,3,13,80,170,'wave','Margem das Duas Marés','170 de magia em uma linha de 3 casas e cura 85 HP do aliado mais ferido.'),traits:['water','dark','support']},
 piece('orfeu','Orfeu','orfeu','orfeu',2,'neutral','duelist','antimagic',800,76,26,1,11,75,210,'silence','Palma de Interdição','210 de dano físico no alvo; impede habilidades por 1,2 s.'),
 piece('carmilla','Carmilla','carmilla','carmilla',2,'blood','support','blood',670,59,25,2,12,75,190,'drain','Costura Rubra','190 de magia no alvo e recupera 40% do dano causado como vida.'),
 piece('abel','Abel','abel','abel',2,'fire','duelist','fire',740,80,23,1,12,80,220,'cleave','Mandíbula do Leão','220 de dano físico no alvo e metade nos inimigos adjacentes.'),
 piece('shin','Shin','seiji','companion_shin',3,'ink','arcanist','ink',620,58,24,3,11,65,205,'silence','Página sem Nome','205 de magia e silêncio de 1,2 s; a página segue o alvo mais próximo.'),
 piece('mika','Mika','ophelia','companion_mika',3,'ice','support','ice',660,50,26,3,12,65,220,'heal','Jardim de Cristal','Cura 220 HP do aliado mais ferido em alcance de 3 casas.'),
 piece('umbra','Umbra','marin','companion_umbra',3,'dark','duelist','dark',680,86,20,1,9,70,235,'leap','Última Vigília','Salta para junto do inimigo mais distante e causa 235 de magia.'),
 piece('dante','Dante','gabriel','companion_dante',3,'fire','guardian','fire',940,63,40,1,13,80,260,'shield','Círculo da Alvorada','Recebe 260 de escudo e protege o aliado mais ferido em alcance de 2 casas.'),
 piece('vajra','Vajra','max','companion_vajra',3,'lightning','arcanist','lightning',650,71,23,3,10,70,225,'chain','Compasso dos Pregos','225 de magia no alvo e metade em um segundo inimigo próximo.'),
 piece('seiji-last-script','Seiji · Último Escrito','seiji','seiji-last-script',4,'ink','arcanist','ink',820,76,28,3,11,70,295,'silence','Códice sem Fundo','295 de magia e silêncio de 1,2 s; restaura 10 de mana na escrita.'),
 piece('ophelia-white-equinox','Ophelia · Equinócio Branco','ophelia','ophelia-white-equinox',4,'ice','support','ice',850,61,30,3,12,70,320,'heal','Santuário do Equinócio','Cura 320 HP do aliado mais ferido; a sinergia de Gelo desacelera inimigos próximos.'),
 piece('marin-starless-throne','Marin · Trono sem Estrelas','marin','marin-starless-throne',4,'dark','duelist','dark',820,108,25,1,9,75,335,'leap','Coroação sem Estrelas','Salta para junto do inimigo mais distante e causa 335 de magia.'),
 piece('gabriel-solar-oath','Gabriel · Juramento Solar','gabriel','gabriel-solar-oath',4,'fire','guardian','fire',1140,76,48,1,12,85,370,'shield','Sol da Forja','Recebe 370 de escudo e protege o aliado mais ferido em alcance de 2 casas.'),
 piece('max-thunder-requiem','Max · Réquiem do Trovão','max','max-thunder-requiem',4,'lightning','arcanist','lightning',810,91,27,3,10,75,330,'chain','Réquiem de Vajra','330 de magia no alvo; um segundo inimigo próximo recebe metade.'),
 piece('ava-worldroot-sovereign','Ava · Matriarca dos Estratos','ava','ava-worldroot-sovereign',4,'earth','guardian','earth',1120,76,45,1,14,90,310,'root','Catedral dos Estratos','310 de magia no alvo e nos vizinhos; prende o alvo por 1 s.'),
 {...piece('beatriz-eclipse-tide','Beatriz · Maré do Eclipse','beatriz','beatriz-eclipse-tide',4,'water-dark','support','water',900,67,28,3,12,85,320,'wave','Oceano sob a Lua Ausente','320 de magia em uma linha de 3 casas e cura 160 HP do aliado mais ferido.'),traits:['water','dark','support']},
 piece('orfeu-unwritten-archon','Orfeu · Página Livre','orfeu','orfeu-unwritten-archon',5,'neutral','duelist','antimagic',1240,126,42,1,10,80,440,'silence','Mundo Ainda Não Escrito','440 de dano físico no alvo e silêncio de 1,2 s.'),
 // Canonical names, elements and visual references: data.ts / expansionV30.ts / enemyArtV30.ts.
 {...piece('runewarden','Vigia Rúnico','runewarden','runewarden',1,'ink','guardian','ink',730,45,30,1,14,75,155,'intercept','Édito da Página Vazia','Protege o aliado mais ferido em 2 casas com 155 de escudo; por 2 s intercepta 35% do próximo golpe direto recebido por ele.'),traits:['ink','guardian','antimagic']},
 piece('moth','Mariposa do Véu','moth','moth',2,'ice','arcanist','ice',650,48,19,3,12,75,190,'frostNova','Pó da Geada','190 de magia no alvo e 65% nos vizinhos; retira até 15 de mana dos inimigos atingidos.'),
 piece('ashwolf','Lobo de Cinzas','ashwolf','ashwolf',2,'fire','duelist','fire',700,75,21,1,10,80,195,'hunt','Caçada da Cinza','Persegue o inimigo mais ferido em 3 casas por até 2 passos livres. Causa 195 de dano físico, +15% abaixo de 50% HP, e reduz sua cura em 40% por 2 s.'),
 piece('lunastag','Cervo da Geada Lunar','lunastag','lunastag',3,'ice','duelist','ice',840,83,30,1,12,85,235,'charge','Investida da Coroa Lunar','235 de dano físico; empurra o alvo uma casa livre e avança para sua posição. Cada alvo resiste a novo deslocamento por 3 s.'),
 piece('selo','O Selo Quebrado','selo','selo',3,'ink','arcanist','ink',700,60,25,3,12,85,250,'shatter','Memória Estilhaçada','Rompe 45% do escudo do alvo e dos vizinhos, limitado a 80% do poder por inimigo; causa 250 de magia no alvo e metade nos vizinhos.'),
 piece('eco','Eco do Selo','eco','eco',5,'dark','support','dark',1080,79,34,3,12,85,390,'rescue','Véu de Retorno','Resgata o aliado mais ferido em 3 casas para uma casa livre próxima mais distante dos inimigos; se não houver, cuida no lugar. Cura 70% do poder e concede 35% do poder em escudo.'),
 piece('cinder','A Chama que Lembra','cinder','cinder',5,'fire','arcanist','fire',1030,92,32,3,12,95,360,'pyre','Sol da Pira','Causa 65% do poder de magia numa área de uma casa ao redor do alvo. A pira permanece 3 s; a cada segundo causa 18% do poder a inimigos que continuam na área.'),
 piece('astral','Guardião do Astrolábio','astral','astral',5,'lightning','arcanist','lightning',1040,95,34,3,11,100,340,'orbit','Convergência das Três Órbitas','Alterna três conjurações: I causa 55% do poder e recebe 45% em escudo; II causa 80% no alvo e 40% num vizinho; III causa o poder inteiro na área de 2 casas do alvo e reinicia o ciclo.'),
];
export const chessPieceByIdV40=(id:string)=>CHESS_PIECES_V40.find(piece=>piece.id===id);
/** Public tuning shared by both sides of the Circuito. RPG combat never reads this catalog. */
export const CHESS_COMBAT_RULES_V40={receivedManaBase:4,receivedManaPerHp:.05,receivedManaCap:15,arcanistPower:[0,.3,.6],arcanistMana:[0,3,6],arcanistArmorPenetration:[0,.25,.5],guardianArmor:[0,12,24],guardianAllyShield:1,fireBurn:[0,.025,.035]} as const;
export type ChessTraitV40={id:string;name:string;thresholds:number[];description:string;color:string};
export const CHESS_TRAITS_V40:readonly ChessTraitV40[]=[
 {id:'ink',name:'Tinta',thresholds:[2,3],description:'As unidades de Tinta recebem 3 / 6 mana adicionais por ataque.',color:'#e8e9e6'},
 {id:'ice',name:'Gelo',thresholds:[2,3],description:'As habilidades de Gelo desaceleram inimigos em 20% / 35% por 2 s.',color:'#8acfff'},
 {id:'dark',name:'Trevas',thresholds:[2,4],description:'Unidades de Trevas ganham 12% / 22% de dano de ataque e 10% / 16% de vampirismo.',color:'#c19bdf'},
 {id:'fire',name:'Fogo',thresholds:[2,4],description:'Habilidades de Fogo queimam por 3 s: 2,5% / 3,5% do HP máximo por segundo e reduzem curas em 40%.',color:'#f6a27e'},
 {id:'lightning',name:'Eletricidade',thresholds:[2,3],description:'Ataques elétricos encadeiam 20% / 35% do dano em um segundo alvo próximo.',color:'#f6df74'},
 {id:'earth',name:'Terra',thresholds:[2],description:'Unidades de Terra iniciam o combate com 22% do HP máximo em escudo.',color:'#d6b076'},
 {id:'water',name:'Água e Trevas',thresholds:[2],description:'Beatriz e sua forma alternativa ganham 20% de cura e removem queimadura de quem curam.',color:'#92cbea'},
 {id:'blood',name:'Sangue',thresholds:[1],description:'Carmilla recupera 12% do dano causado em qualquer ataque; sua costura permanece única.',color:'#e28b9c'},
 {id:'antimagic',name:'Anti magia',thresholds:[2],description:'Unidades de Anti magia recebem 25% menos dano mágico. O Vigia Rúnico participa pelo vínculo de interdição da Página Vazia.',color:'#c4c9d0'},
 {id:'guardian',name:'Guardião',thresholds:[2,4],description:'Toda a equipe ganha 12 / 24 de armadura; guardiões ganham mais 12 / 24.',color:'#cbd9e4'},
 {id:'duelist',name:'Duelista',thresholds:[2,4],description:'Duelistas atacam 15% / 30% mais rápido.',color:'#ecc694'},
 {id:'arcanist',name:'Arcanista',thresholds:[2,4],description:'Arcanistas ganham 30% / 60% de poder de habilidade e 3 / 6 mana adicionais por ataque; suas habilidades mágicas ignoram 25% / 50% da armadura.',color:'#bfaae9'},
 {id:'support',name:'Amparo',thresholds:[2,3],description:'Toda a equipe ganha 10% / 18% de cura e escudo.',color:'#96d8c2'},
];
export const CHESS_STAR_MULTIPLIERS_V40=[0,1,1.7,2.9] as const;
export const CHESS_POOL_COUNTS_V40={1:22,2:20,3:17,4:12,5:10} as const;
export const CHESS_SHOP_ODDS_V40:Record<number,readonly number[]>={3:[70,25,5,0,0],4:[55,30,15,0,0],5:[45,30,20,5,0],6:[30,35,25,10,0],7:[20,30,30,18,2],8:[15,20,30,30,5]};
export const CHESS_XP_THRESHOLDS_V40:Record<number,number>={3:4,4:8,5:12,6:20,7:28};
export type ChessComponentV40='blade'|'orb'|'cloak'|'core'|'sigil';
export const CHESS_COMPONENT_IDS_V40:readonly ChessComponentV40[]=['blade','orb','cloak','core','sigil'];
export type ChessItemV40={id:string;name:string;components:readonly ChessComponentV40[];attack:number;power:number;armor:number;hp:number;mana:number;speed:number;effect:'none'|'burn'|'sunder'|'vamp'|'regen'|'ward'|'mana'|'execute'|'cleanse';description:string};
const component=(id:ChessComponentV40,name:string,attack:number,power:number,armor:number,hp:number,mana:number,speed:number,description:string):ChessItemV40=>({id,name,components:[id],attack,power,armor,hp,mana,speed,effect:'none',description});
export const CHESS_COMPONENTS_V40:readonly ChessItemV40[]=[
 component('blade','Lâmina de Éter',12,0,0,0,0,0,'+12 de ataque.'),component('orb','Orbe Lunar',0,.15,0,0,0,0,'+15% de poder de habilidade.'),component('cloak','Manto Guardião',0,0,15,80,0,0,'+15 de armadura e 80 HP.'),component('core','Núcleo Pulsante',0,0,0,0,0,.15,'+15% de velocidade de ataque.'),component('sigil','Selo de Mana',0,0,0,0,18,0,'Inicia com 18 de mana.'),
];
const recipe=(a:ChessComponentV40,b:ChessComponentV40,name:string,effect:ChessItemV40['effect'],description:string):ChessItemV40=>{const aa=CHESS_COMPONENTS_V40.find(item=>item.id===a)!,bb=CHESS_COMPONENTS_V40.find(item=>item.id===b)!;return {id:`${a}-${b}`,name,components:[a,b],attack:aa.attack+bb.attack,power:aa.power+bb.power,armor:aa.armor+bb.armor,hp:aa.hp+bb.hp,mana:aa.mana+bb.mana,speed:aa.speed+bb.speed,effect,description};};
export const CHESS_ITEMS_V40:readonly ChessItemV40[]=[
 recipe('blade','blade','Mandíbula Solar','execute','+24 de ataque; causa 15% mais dano contra alvos abaixo de 35% HP.'),
 recipe('blade','orb','Pena da Ruptura','sunder','+12 de ataque e 15% de poder; reduz 20 de armadura do alvo por 3 s.'),
 recipe('blade','cloak','Costura Carmesim','vamp','+12 de ataque, 15 de armadura e 80 HP; recupera 15% do dano causado.'),
 recipe('blade','core','Pregos do Último Acorde','none','+12 de ataque e 30% de velocidade de ataque.'),
 recipe('blade','sigil','Códice do Duelista','mana','+12 de ataque e 18 mana inicial; ataques restauram mais 4 mana.'),
 recipe('orb','orb','Eclipse da Página','burn','+30% de poder; habilidades queimam 2% do HP máximo por segundo por 3 s e reduzem curas em 40%.'),
 recipe('orb','cloak','Catedral de Inverno','ward','+15% de poder, 15 de armadura e 80 HP; recebe 15% menos dano mágico.'),
 recipe('orb','core','Flor da Tempestade','sunder','+15% de poder e velocidade; habilidades reduzem 20 de armadura por 3 s.'),
 recipe('orb','sigil','Maré sem Estrelas','mana','+15% de poder e 18 mana inicial; ataques restauram mais 4 mana.'),
 recipe('cloak','cloak','Trono Mineral','regen','+30 de armadura e 160 HP; recupera 2% HP máximo por segundo.'),
 recipe('cloak','core','Guarda da Alvorada','ward','+15 de armadura, 80 HP e 15% de velocidade; recebe 15% menos dano mágico.'),
 recipe('cloak','sigil','Manto da Página Livre','cleanse','+15 de armadura, 80 HP e 18 mana; reduz pela metade as durações de controle.'),
 recipe('core','core','Réquiem Condutor','none','+45% de velocidade de ataque.'),
 recipe('core','sigil','Compasso de Vajra','mana','+15% de velocidade e 18 mana; ataques restauram mais 4 mana.'),
 recipe('sigil','sigil','Santuário do Retorno','regen','+36 mana inicial; recupera 2% HP máximo por segundo.'),
].map(item=>item.id==='blade-core'?{...item,speed:.3}:item.id==='core-core'?{...item,speed:.45}:item);
export const chessItemByIdV40=(id:string)=>[...CHESS_COMPONENTS_V40,...CHESS_ITEMS_V40].find(item=>item.id===id);
export function chessRecipeV40(a:string,b:string){return CHESS_ITEMS_V40.find(item=>item.components.length===2&&(item.components[0]===a&&item.components[1]===b||item.components[0]===b&&item.components[1]===a));}
export const CHESS_ROLE_LABELS_V40:Record<ChessRoleV40,string>={guardian:'Guardião',duelist:'Duelista',arcanist:'Arcanista',support:'Amparo'};
