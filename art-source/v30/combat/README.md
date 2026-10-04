# Combate v30 — grupo compacto, turnos e vitória

Sprites gerados com imagegen nativo, seguindo a UI de prata/ouro/lápis e a linguagem anime final do jogo. Fontes e prompts são preservados ao lado deste registro.

## Assets finais

- `turn_active.png`, `turn_waiting.png`, `turn_enemy.png`: placas distintas com área de retrato e texto vazia; sem textos gravados.
- `victory_emblem.png` e `victory_continue.png`: emblema e botão final próprios.
- `victory_celebration.png`: oito quadros isolados, do cristal inicial ao brasão estabilizado.
- Mapa tipado: `lib/art/combatV30.ts`, exports `COMBAT_V30_ASSETS` e `COMBAT_V30_FRAMES`.

`manifest.json` registra fontes, caixas nativas, dimensões, hashes e alpha. Todas as cinco peças estáticas e os oito quadros têm zero pixels alpha>20 nas bordas. A exportação mantém o RGBA gerado, sem resize, repaint, máscara ou troca de alpha; as peças estáticas são crops retangulares e a animação mantém a folha nativa completa.

## Composição

`CombatParty({heroes, activeId, limits: s.progress.limit, lycan})` substitui somente o rodapé de combate. A grade fica fixa em até cinco colunas: 94px de altura desktop e 86px em largura até1000px; portrait estreito usa três colunas e duas linhas. Frames e retratos exclusivos, elementos, HP/MP atuais/máximos e carga de ultimate permanecem visíveis. Valores reservam espaço para quatro dígitos.

`TurnOrder({battle, heroes, lycan})` substitui a fila antiga: mostra rodada e até seis entradas, com placas próprias e nomes/estados DOM. Não concede ações nem altera a ordem calculada pelo motor.

`VictoryCelebration({battle, heroes, lycan, onContinue})` entra como filho direto da battle-screen, após palco/dock. Apresenta créditos/XP do Battle existente, reproduz oito poses durante ~875ms e estabiliza a última. Movimento reduzido usa apenas o último quadro e desliga as animações CSS. O botão executa onContinue uma única vez por montagem; nenhum efeito de animação concede recompensas.

Comandos mantêm alvos por retrato/HP, com nome acessível. A faixa de alvos aparece em Itens ou quando a lista de habilidades inclui técnicas com alvo aliado; Ações aproveita toda a largura da linha. Animação/estado do motor, atalhos e regras de combate permanecem nas interfaces existentes.

## Conferência responsiva

As capturas `docs/qa-v30/combat-five-1365.png` e `combat-five-844.png` mostram os cinco integrantes sem rolagem. Desktop mantém rodapé94px e cards86px. Apenas landscape com altura até440px usa rodapé68px/cards63px, linha de identidade31px e retrato31px; nomes11px e números10px são preservados. HP/MP ficam em duas linhas de11px, e ultimate em10px. Nessa altura os comandos usam título24px e linha46px, com botões44px e alvos32px. A redução recupera cerca28px para o palco; portrait mantém sua grade de três colunas.

Os loaders legados incluem os novos módulos de mapa, inimigos, Orfeu e sequência de invocação. Os fixtures de viagem verificam os dez mapas e três âncoras antigos mais a expansão. O teste de troca de líder verifica `leaderId`, técnica, ordem fixa do grupo e persistência; o teste Master mantém o bloqueio entre sequências de personagens e auras, concluindo a primeira antes de iniciar a segunda.

Conferência final: `combat-five-844.png` mostra o palco ampliado de126px para154px, cinco cards completos e comandos legíveis; `victory-five-1310.png` mostra os cinco retratos circulares, emblema, créditos/XP e botão de continuação dentro da tela. A correção de `flex-basis` dos retratos da vitória evita que o estilo global de100px os estique. Essas duas capturas finais foram revisadas após os ajustes, sem alterações opcionais posteriores.

Validação:20 suítes resolvidas. A primeira rodada teve18 aprovações e duas referências ainda pendentes de integração; após o registro final, `test-delta.txt` confirma `game`871, `environment`33.206 e `battle-layout`2.047 verificações aprovadas. A última inclui os três novos ataques de inimigos, mantendo limites de palco, margem de nomes com sway e separação das silhuetas. Relatórios preservados em `docs/qa-v30/test-run.txt` e `test-delta.txt`. TSC/build/publicação são os gates da integração principal.
