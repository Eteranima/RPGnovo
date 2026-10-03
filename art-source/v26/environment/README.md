# Cenários anime — v26

Direção solicitada: JRPG anime, traço limpo e cel shading, inspirado na linguagem visual de Mushoku Tensei e Fate Series. Revisão concluída em 2026-10-03 no repositório `C:\Users\Diego\OneDrive\Documentos\GitHub\RPGnovo`.

## Diagnóstico e correção

Os retângulos escuros do Subterrâneo Selado vinham do desenho dos tiles de colisão `#`: `theme.wall` aplicava uma camada `#0e172be3` sobre o piso. A borda de parede acrescentava outra sombra retangular. As faixas de 2×7 e 2×11 células correspondiam à geometria de colisão existente. As sprites de cenário antigas já tinham transparência; esse defeito específico vinha da pintura da parede.

O renderer agora desenha os obstáculos com arte gerada: topo contínuo de alvenaria ou rocha, fachada somente na borda sul exposta e contornos de dois pixels. Jardins usam módulos de sebe. As máscaras opacas de parede e suas sombras retangulares foram removidas. Piso, objetos, edifício, placas e portais receberam arte anime coerente.

Água e solo orgânico têm transições graduais entre variantes. A mistura é feita uma vez na pintura em cache da cena, usando a própria arte carregada. Ela não modifica os arquivos PNG. Os pisos arquitetônicos, inscrições e tábuas mantêm seus contornos nítidos. A variação depende apenas do mapa e das coordenadas; não muda com a câmera ou o tempo.

## Artes selecionadas

As 13 imagens finais estão em `public/assets/v26/environment/`. Há 72 amostras de materiais (64 pisos e oito topos de parede) e 75 sprites independentes com recortes medidos.

| Arquivo | Conteúdo |
| --- | --- |
| `floor-academy.png` | Calcário claro, gramado, pedra portuária e mosaico botânico; quatro variantes por material |
| `floor-depths.png` | Marfim/dourado, ardósia azul, pedra lavanda/prata e mineral azul-esverdeado |
| `floor-wilds.png` | Solo de cinzas, trilha ocre, pavimento arruinado e basalto com fissuras âmbar |
| `floor-water-docks.png` | Água turquesa, água profunda, madeira e gelo |
| `scenery-academy.png` | Quatro árvores, quatro canteiros e quatro estantes |
| `scenery-ruins.png` | Quatro colunas, quatro ruínas de coluna e quatro árvores de cinzas |
| `utilities.png` | 12 objetos utilitários e de história |
| `harbor.png` | Seis construções e objetos portuários |
| `boundaries.png` | 12 módulos: alvenaria, sebe e rocha |
| `academy.png` | Edifício completo da academia |
| `signboards.png` | 12 placas, com identidades e ordem preservadas |
| `exits.png` | Oito portais, com identidades e destinos preservados |
| `wall-caps.png` | Quatro topos de alvenaria azul e quatro topos de rocha violeta |

`selected-sources.json` registra os caminhos dos originais gerados. `source-integrity.json` registra dimensões e SHA-256 e confirma que os 13 arquivos de produção são idênticos, byte por byte, às saídas originais. Alpha foi preservado.

Os prompts completos e as revisões estão em `prompts.json`, `layout-repairs.json`, `additional-repairs.json`, `signboard-layout.json`, `exits-prompt.json` e `wall-caps-prompt.json`. As correções de imagem foram feitas com geração/edição por referência: remover formas elevadas do piso, separar silhuetas de placas e criar os topos de parede. Os scripts de medição apenas leem pixels; não editam imagens.

## Integração e navegação

`lib/game/environmentArt.ts` contém os recortes e âncoras reais das 75 sprites. `sprite-bounds.json` preserva a medição de alpha. As quatro linhas de `floor-depths.png` têm alturas diferentes; seus limites reais são usados para evitar fragmentos do material vizinho. Os atlas de placas foram reparados com margens transparentes maiores após a identificação de silhuetas vizinhas invadindo um recorte.

`lib/game/environment.ts` atribui materiais e objetos aos dez mapas. `lib/game/renderer.ts` usa os recortes medidos, escala proporcional e âncoras do chão, mantendo árvores e construções completas dentro da área de desenho. O cache mantém até três mapas e é invalidado quando as linhas mudam, incluindo criação e expiração da ponte de gelo.

Esta revisão não altera coordenadas de mapas, células de colisão, posições de entidades/objetos, condições de missão ou destinos de saída. As placas e os portais preservam o significado anterior. O ajuste de parada da Ava mantém a pose central do atlas direcional definido pela raiz.

## Revisão dos dez mapas

| Mapa | Identidade e verificação |
| --- | --- |
| Pátio Central | Academia completa, pedra clara, jardim e gramado com transições suaves |
| Ala de Estudos | Piso marfim/dourado, quatro estantes e iluminação de biblioteca |
| Subterrâneo Selado | Ardósia azul, ruínas e alvenaria visível; sem máscaras escuras nos obstáculos |
| Câmara do Selo | Pedra lavanda/prata, colunas e portais de magia |
| Porto Lúmina | Pedra quente, construções portuárias, madeira e água sem quadriculado de luminosidade |
| Domo de Herbologia | Mosaico botânico, árvores/canteiros variados e gramado suave |
| Galeria Profunda | Mineral azul-esverdeado, paredes de rocha e água profunda |
| Mata Cindária | Solo de cinzas, trilhas ocres e árvores de silhuetas diferentes |
| Ruínas da Vigília | Pavimento gasto, musgo, árvores de cinzas e ruína de coluna |
| Clareira da Pira | Basalto, fissuras âmbar, braseiros e altar |

As capturas de cada mapa estão em `docs/qa-v26/world-{mapa}-overview.jpg`. Porto e Pátio foram recapturados após a suavização final e revisados. `field-anime-desktop.jpg` mostra o Subterrâneo na câmera real com o HUD final. As quatro direções e os passos da Ava foram revisados em `ava-walk-{south,west,east,north}.jpg` pela raiz.

A rota temporária `/world-review` foi removida após a revisão. Seu código final está arquivado em `visual-review-route.txt`. Ela utilizava um fixture isolado, sem leitura/gravação de saves e sem chamadas de início ou viagem do jogador.

## Validação final

- `node tests/environment.test.mjs`: **26.729 verificações aprovadas**, cobrindo os dez mapas, arte de todos os props, recortes completos e sem sobreposição, transparência, materiais corretos, ausência de preenchimento opaco/sombra retangular nas paredes, fachadas apenas nas bordas expostas, variação estável, mistura orgânica determinística e invalidação da ponte de gelo.
- `node node_modules/typescript/bin/tsc --noEmit`: aprovado, sem erros.
- `verify-sources.mjs`: 13 PNGs de produção idênticos aos originais gerados.
- Revisão visual: dez mapas, câmera real do Subterrâneo, água/gramado finais e quatro direções da Ava aprovados pela equipe.

Commit, push e publicação são tratados pela raiz da tarefa.
