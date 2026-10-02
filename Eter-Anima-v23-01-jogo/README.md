# Éter Anima — O que o selo lembra

Playable web reconstruction, shared by link: a complete opening chapter based on the existing Éter Anima source and approved dialogue direction. This is an independent build and does not replace or migrate saves from the original game.

## Product direction

An anime JRPG with integrated top-down exploration, visible enemies and deliberate turn-based combat. No random encounters, action minigames, ATB, or static scene masquerading as a map. New games select Seiji (Pátio), Ophelia (Domo), Marin (Porto) or Gabriel (Mata), with a solo party and distinct opening lore. Beatriz introduces the shared investigation. Seiji joins after reading the record; Ophelia joins after accepting the investigation; Marin joins at camp; Gabriel joins after defeating the eastern ash wolf. The first recruit fills the second active slot automatically, and later recruits remain available in Grupo. Existing paired saves stay compatible.

## Chapter

Pátio Central → Ala de Estudos → Subterrâneo Selado → Câmara do Selo → return to Beatriz. The library record unlocks the stairs; the inscription opens the chamber; defeating O Selo Quebrado and reporting back completes the chapter. Crystals heal/save, chests grant finite inventory, common enemies respawn after 12 seconds, and defeat returns to a checkpoint without erasing quest progress.

## Implementation

- `lib/game/data.ts`: logical tile grids, collision data, props, entities, warps, objectives, skills and official asset references.
- `lib/game/engine.ts`: navigation, input, quest ordering, party, local save validation, inventory and speed-ordered rounds.
- `lib/game/renderer.ts`: independent terrain and prop layers, depth sorting, directional sprite animations, follower trail, camera and particles. Generated images are reusable textures/props; no full-map PNG is used.
- `app/page.tsx`: game screens, dialogue portraits, controls, diary, bag, party and optional WebMCP support.
- Saves are device-local under `eter-anima-stone-reach-v1`, versioned and validated. They do not synchronize between browsers/devices and never overwrite the original game's saves.
- Access is public by link as requested for friend testing. No tracking or external data services.

## Validation

`node tests/game.test.mjs` verifies navigable map topology, obstacles and water, safe zones, warp destinations, asset availability, quest locks, an entire playable chapter with combat, inventory non-duplication, healing, saves/resume, corrupted-save rejection, defeat recovery and 12-second respawn.

`node node_modules/typescript/bin/tsc --noEmit` checks types. `npm run build` builds the Worker-compatible site. Browser QA covers desktop and nested 390×844 / 320×640 mobile viewports using actual game pages and controls.

## Provenance

Official character/creature art is preserved from `Eteranima/Eter`, commit `b0db2bd43473b3743ef48770c771a3851cc8b09a`, read on 2026-10-01. Lore and mechanics were informed by original game docs and HANDOFF-MELHORIAS-ETER-ANIMA.md. New modular academy, prop and terrain assets were generated specifically for this build. Existing artwork is subject to the included LICENSE and NOTICE. This is a noncommercial private development version.

### QA evidence (2026-10-01)

- Desktop: title, opening, active/listening portraits, Beatriz's choice, navigation through doors, library record, subterranean creature encounter, skill costs/damage, Enter key activating combat commands.
- 390×844 viewport: new game, dialogue readability, diary-driven walking, library/stairs, encounter, skill selection, victory and return to exploration with actual HP/MP changes.
- 320×640 viewport: title, responsive header, party bars and scrolling diary. Header wrapping and clipped title-character face were corrected and visually rechecked.
- Mobile checks use actual pages in browser iframe viewports; they are not physical-device tests. The temporary QA route is removed before deployment.
- 229 automated game checks pass, including the full chapter, final boss, closing quest, save/resume and defeat recovery. Type checking passes.
- Optional WebMCP registration is feature-detected; validation is unavailable because the preview browser does not expose `document.modelContext`. Game controls work independently.

### v1.1 — Generated sprites and animation (2026-10-01)

- New Seiji and Ophelia walking sheets, with direction remapping and measured ground anchors.
- Four generated six-pose combat sequences: physical attack and casting for each hero. Tinta Cortante, Mancha Viva and Estilhaço Glacial use the casting sequences; Orvalho uses the gathering/mote poses with a gentle healing effect on the selected ally.
- Six modular scenery props: reading lectern, iron chest, rune slab, broken column, intact column and sealed doorway. They are placed in the real navigable maps, with depth sorting and collision.
- Full source PNGs and all prompts are retained under `art-source/v2/`; runtime WebP files are lossless conversions. Source rectangles preserve weapons, skirts, effects and architectural finials without cutting or reassembling the sheets.
- Actions reserve resources once, apply damage/healing at the visual impact, and advance only after recovery. Repeated clicks are blocked throughout the sequence. The same deliberate turn-based rules and v1 saves remain in use.
- Desktop browser: both physical attacks, both Tinta skills, Gelo, selected-ally Orvalho, enemy weakening, completed encounter and return to the map. Generated action frames were visually inspected during playback.
- Actual 390×844 and 320×640 iframe viewports: all combat art loaded, controls/party fit without horizontal overflow, attack/skill commands work and lock during animation. The 390 viewport also completed healing, victory and return to exploration. These are browser viewport tests, not physical-device tests.
- 229 game checks pass, including source frame/anchor bounds and impact/recovery timing.

### v1.2 — Menus, progressão e estados (2026-10-01)

- Menu de aventura com missões, árvore, equipamentos, bestiário, loja, conquistas, bolsa e cenas. Os comandos de batalha separam ações, habilidades e itens; mostram custos atuais e estados com duração. Recompensas disponíveis aparecem no botão do menu.
- Árvore funcional: 6 nós por herói, duas ramificações (combate e exploração), pré-requisitos, pontos individuais e passivas. Vitória comum concede 20 XP; boss concede 100 XP. Cada 60 XP sobe um nível, até o nível 10, concedendo 1 ponto por herói. O grupo começa com 2 pontos por herói, 80 créditos e 2 Antídotos de Luz.
- Noite de Tinta (cegueira), Rasura (sangramento), Prisão Glacial (perda de uma ação) e Aurora (cura e remoção de estados) são desbloqueadas na árvore. Congelamento afeta cada inimigo uma vez por batalha; cegueira causa 50% de falha ofensiva; sangramento causa 6 de dano por ação; silêncio impede magias. Os mobs e o boss também aplicam estados. Guarda evita os estados desses ataques; Antídoto remove todos os estados do aliado.
- Orvalho funciona fora de batalha. Leitura de Tinta revela um compartimento na biblioteca; Passo de Geada cria terreno caminhável na água do jardim. Ambos exigem aprendizado, proximidade, MP e alteram o mundo persistente. Dois baús extras são revelados por essas técnicas.
- Quatro missões secundárias com progresso real, créditos e pontos. Loja com Poção, Elixir e Antídoto, acessível no Pátio Central pelo Empório ou menu. Oito conquistas com créditos e recebimento único.
- Bestiário registra as três criaturas e pode conduzir o grupo até uma criatura presente no mapa. Lobo e Sombra têm metas individuais de 5, 25 e 50 vitórias, cada uma premiando 2 peças. Os dois conjuntos têm 6 posições: arma, cabeça, torso, mãos, pés e amuleto. Cada item tem um único portador; transferir ou retirar recalcula os atributos, sem acumular bônus.
- Vigília do Lobo: 3 peças recuperam 3 MP em golpes físicos; 6 peças acrescentam +25% de dano físico e imunidade a sangramento. Véu da Memória: 3 peças reduzem em 2 o custo de magias; 6 peças acrescentam +25% de dano mágico/cura e imunidade a cegueira. Os efeitos se aplicam por herói. O boss permanece um confronto único e não exige 50 derrotas.
- Três cutscenes no cenário real, com câmera, retratos, efeitos e avanço/pulo: chegada, despertar do Selo e silêncio após a vitória. Cenas vistas podem ser revistas no local, sem repetir recompensas ou o confronto.
- Quatro novas pranchas: ataques do Lobo, Sombra e boss, além de 16 ícones. As imagens originais inteiras, prompts e metadados estão em `art-source/v12/`; WebP sem perdas e recortes de runtime preservam as poses completas. Impactos continuam sincronizados ao turno.
- O formato do save passa a v2, mantendo a mesma chave e migrando automaticamente os saves v1. Progressão, compras, peças, equipamento, técnicas resolvidas e cenas vistas persistem neste navegador. Os estados de batalha acabam ao sair do confronto.
- O movimento usa passos menores de colisão em frames lentos, preservando velocidade e impedindo saltos após pausas longas.
- Validação: `node tests/game.test.mjs` (277 verificações do capítulo, mapas e artes), `node tests/progression.test.mjs` (84 verificações de progressão e efeitos), TypeScript e build de produção. Browser QA usa desktop e viewports reais de 390×844 e 320×640 em iframes, além de cenários de teste isolados para metas e boss. Não são testes em aparelhos físicos. As rotas temporárias de QA são removidas da publicação.

### v1.3 — Abertura, expansão e ecos (2026-10-01)

- Abertura anime com cenário gerado e oito frames de Seiji/Ophelia interpolados em canvas. Press Start funciona com Enter ou toque; a trilha começa após esse gesto e toca em loop. Movimento reduzido mantém uma pose estática.
- Cinco MP3s fornecidos pelo autor, preservados integralmente: Press Start na abertura; Hidden Academy nas áreas seguras; Academy Below nos subterrâneos; Ink and Ice Clash nos encontros comuns; Boss Theme nos chefes. Duas faixas com transição de 450 ms, loop, mute e volume. Manifesto de nomes, duração e SHA-256 em `docs/music-manifest.json`.
- Menu completo dentro da área de jogo: Enter no PC, ícones no mobile; diálogos mantêm Enter para avançar. Doze abas, incluindo Sistema, Arredores, Eventos e Relicário. Foco do teclado, slider de volume, scroll e toque permanecem no jogo.
- Sete mapas reais: os quatro do capítulo, Porto Lúmina, Domo de Herbologia e Galeria Profunda. Porto e Domo são seguros; Galeria abre após o relato final a Beatriz. Novas conexões, colisões, baús, sementes e pontos de interesse. Nenhum mapa é uma imagem única. Porto recebe seis objetos anime novos; fachadas têm colisão.
- Orfeu, Ava Rosa Groot e Max (com seu companheiro no ombro), retratos e diálogos. Quatro pedidos adicionais com objetivos no cenário e retorno ao NPC, totalizando oito missões secundárias. Onze encontros permanentes nos mapas (nove comuns, dois chefes), mais o confronto do evento da Fenda. Eco do Selo é uma memória opcional; vencê-lo preserva o capítulo. Sete cenas e dez conquistas.
- Loja com 28 equipamentos em quatro faixas (níveis 1/3/5/8) e três suprimentos; todos com ícones. Katana para Seiji, bastão para Ophelia e peças transferíveis. Nível altera HP/MP/força e potência de magias; equipamentos têm atributos reais. Conjuntos do bestiário e seus bônus de 3/6 peças continuam independentes.
- Minimapa em cada cenário, atualizado pela grade real, colisões, passagem congelada, posição do grupo, objetivo, NPCs, cristais, eventos e inimigos ativos. Um toque abre o mapa e viagens.
- Três marcos raros: Academia, Cais e Galeria Profunda. Ative cada um usando seu cristal. Viajar exige proximidade de um marco ativado e um destino já descoberto; não atravessa o bloqueio do capítulo, não funciona em combate e não cura automaticamente.
- Três eventos únicos: flores no Domo (Geada/5 MP), carta no Cais (Tinta/4 MP) e Sombra da Fenda na Galeria (confronto de 200 HP). Custos, aprendizado, proximidade, derrota/recuo e recebimento único são verificados pelo motor; os eventos concluídos somem do mapa e persistem no save.
- Relicário com 50 auras: 10 famílias × 5 raridades. Cada peça tem partículas no mundo/combate e um efeito entre HP, MP, ataque, magia, defesa, cura, guarda, recuperação inicial de MP, velocidade ou cura ao acertar ataque físico. Uma aura por herói e uma cópia por coleção; transferência recalcula os atributos.
- Invocação custa uma Ficha de Eco: 3 iniciais; +1 por missão, +3 por chefe, +1 a cada 3 vitórias comuns, +2/+3/+4 nos eventos. Chances comuns/incomuns/raras/épicas/lendárias: 55/25/13/6/1%; famílias equiprováveis. A décima sem uma épica garante épica ou lendária (94/6%). Duplicatas viram 1–5 fragmentos; qualquer aura ausente pode ser criada por 8–40 fragmentos. Não há compras com dinheiro real.
- Saves v1/v2 permanecem compatíveis: coleções, descobertas, eventos e invocações persistem neste navegador. Bônus cosméticos aparecem nas descrições das ações e se aplicam nas regras de batalha.
- Fontes PNG inteiras em `art-source/v13/`, conversões WebP sem perdas e retângulos de runtime preservando silhuetas. A nova arte é aplicada somente como personagens, objetos e abertura; terreno e entidades continuam independentes.
- Validação: quatro suítes automatizadas (`game`, `progression`, `expansion`, `echoes`), TypeScript e build para hospedagem privada. QA no Chrome desktop e viewports 390×844 / 320×640 usa os controles reais; não inclui aparelhos físicos. Fixtures temporárias são removidas antes da publicação.


## v1.4 — Expedição e identidade visual

- Interface de exploração, diálogos, batalhas, cenas e menus com preto, vermelho e papel claro, recortes diagonais e retratos; inspiração Persona/Metaphor preservando personagens e combate por turnos.
- Abertura corrigida: castelo Stone Reach, floresta e Lua; arte horizontal e vertical, vento sutil e cometa distante ocasional; respeita movimento reduzido. Não há personagens alternando poses na abertura. Música tenta autoplay ao carregar e retoma no primeiro gesto caso o navegador bloqueie som.
- Marin e Gabriel recrutáveis na Mata Cindária, escolha de dois ativos no menu Grupo. Reserva preserva HP/MP, equipamentos, aura e carga; saves v1/v2 compatíveis. Gabriel exige resolver o rastro do lobo a leste.
- Mata Cindária e Clareira da Pira são dois mapas navegáveis com grade, colisão, objetos, NPCs, lojas, cristais e inimigos independentes. Três espécies novas: Lobo de Cinzas, Mariposa do Véu e A Chama que Lembra; três cenas e duas missões novas.
- Novas pranchas de caminhada, ataque e magia de Marin/Gabriel, ataques dos inimigos, seis objetos de cenário e fundos de batalha; PNGs completos, prompts exatos e metadados em art-source/v14, runtime WebP sem perdas e recortes via coordenadas. Retrato de Marin refeito para diálogos em alta resolução.
- Loja com compras repetidas: cada equipamento comprado ganha instância independente. 36 equipamentos em quatro faixas e três suprimentos; novas armas para Marin/Gabriel. Autoequipar itens seleciona atributos/classificação compatíveis sem retirar peças dos outros heróis; autoequipar aura seleciona maior raridade disponível.
- Ultimate por personagem: 0–100, +20 por ataque, +15 por magia, +10 por guarda/item e carga por dano recebido. Consome 100 uma única vez, sem MP, com retrato e sequência de magia: Seiji causa dano/silêncio; Ophelia cura, limpa estados e guarda o grupo; Marin causa dano, drena HP e cega; Gabriel causa dano e guarda o grupo.
- QA Chrome desktop, 390×844 e 320×640; testes de regras, migração, compras duplicadas, recrutamento, trocas e quatro ultimates. Não inclui aparelhos físicos. Fixtures temporárias removidas antes da publicação.
- Acesso por link aberto a pedido do proprietário para testes com amigos; cada jogador salva no próprio navegador.

## Mobile display

Play horizontally. The fullscreen icon requests native browser fullscreen and, when supported, landscape orientation. Quests, skills and bag have header shortcuts; the full adventure menu remains inside the game. Compact landscape HUD, independently scrolling menus, side battle commands and visible dialogue portraits adapt to short viewports. Some embedded browsers reject fullscreen; open the link in a supported browser in that case.

## v1.7 — Novas recompensas, técnicas e ultimates

Bestiário completo para as sete espécies: Guarda Cindária e Asas da Lua com metas de 5/25/50, bônus reais de 3/6 peças, e três amuletos de chefes únicos. Vitórias anteriores valem sem reiniciar o save. Marin e Gabriel recebem três técnicas cada, incluindo recuperação em exploração. As quatro ultimates têm folhas próprias de oito frames gerados, fontes e prompts preservados em `art-source/v17`, anúncio compacto de 700 ms e impacto posterior. Veja `docs/qa-v17.md` para conteúdo e validação.

## v1.8 — Exploração e fluxo de aventura

Q e R usam os dois slots do líder; Tab alterna os integrantes ativos e troca as técnicas. Os efeitos de Tinta, Geada, Sombras e Forja expiram em 15 segundos, com contador e oito novos pontos de descoberta reais. Recuperações continuam instantâneas. A ponte expirada devolve o jogador à margem com segurança.

Árvore gráfica com requisitos, equipamentos filtrados por slot e coleção completa somente na Bolsa → Equipamentos. Bônus de conjunto aparecem a partir de duas peças (ativação mantida em 3/6). Menus não repetem os atalhos do HUD; avisos abrem o item e o slot recebidos. Mapa regional dos nove cenários, com três cristais raros: em áreas seguras a viagem pode partir de qualquer posição; em áreas hostis exige um marco próximo. Destinos precisam estar ativados.

Gacha ×1/5/10, animação original de oito frames, 50 ícones e detalhe de relíquia sem distorção. Efeitos gerados de contato e estados, Ophelia voltada ao inimigo, ordem de turnos no topo central e ultimate também na aba Habilidades. Chefes mudam nas faixas de 2/3 e 1/3 HP e têm ultimate carregada por ações; guarda e silêncio continuam úteis. Normal/Desafiante/Extremo têm drop comum 30/55/80%, recompensas ×1/1,5/2 e 1/2/3 equipamentos por chefe. Onze efeitos sonoros originais sintetizados, incluindo uma ultimate distinta para cada herói. Saves anteriores e músicas preservados. Validação em `docs/qa-v18.md`.

### v1.9 — Expedição, companheiros e cinemáticas (2026-10-02)

- Saídas com oito artes de portal, placa de destino sobre o cenário, marca ampliada no minimapa e atalhos para caminhar até a passagem. Portais respeitam as travas da história e usam colisão/caminho reais.
- Exploração e menu redesenhados como um códice azul profundo e dourado: janela central compacta, navegação lateral e conteúdo com rolagem própria. Cards elementais para os quatro heróis.
- Companheiros vinculados: Shin (Seiji), Mika (Ophelia), Umbra (Marin), Dante (Gabriel). Arte própria no card e acompanhamento do líder no cenário; não ocupam vaga de equipe.
- Gabriel humano recebe sprites novos, com recortes de origem ajustados para conter a cabeça ao andar ao norte. Forma lycan albina selecionável no card após recrutamento, persistida no save e representada na exploração, diálogo, ataque, magia e ultimate. A transformação preserva os atributos e custos consolidados.
- Vinte sequências de efeitos gerados, uma por magia dos quatro heróis, com trajetórias distintas. Toda ultimate de herói, mob e boss abre uma cinemática de 4,8 segundos, com foco, preparação, lançamento e impacto após 3,26 segundos; anúncio pequeno no canto inferior. Movimento reduzido mantém a sequência com cortes estáticos.
- Sete famílias inimigas possuem ultimate com carga, nome, alvo e estado próprios. Guarda e silêncio continuam relevantes. Viagem rápida acontece em um clique no cristal ativado do mapa regional, sem botão adicional de confirmação.
- Verificação: TypeScript, nove suites do motor incluindo cobertura de todas as ultimates inimigas, migração da forma lycan, bloqueio durante cinemáticas, mapas, skills e recortes de origem. Nesta sessão não havia controle de navegador disponível para uma nova validação visual desktop/mobile; o layout horizontal existente foi preservado e adaptado por regras responsivas.
