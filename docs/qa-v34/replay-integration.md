# Replay das cinco missões longas — integração v34

## Comportamento

O menu **Cenas → Memórias das missões** apresenta `long-tinta`, `long-geada`, `long-brasa`, `long-trovao` e `long-nulo`, com os títulos existentes e pôster JPG do registro v34. Somente os cinco pôsteres podem ser carregados ao abrir a biblioteca; ela não carrega vídeos nem os quinze atlases históricos. As imagens usam carregamento lazy.

Antes de `cinematicSeen=true`, o botão fica desabilitado e explica que a história e sua primeira exibição devem ser concluídas. Uma missão aguardando o desfecho aponta para o Diário. Após a primeira exibição, a memória pode ser revista de qualquer mapa, com ou sem recompensa já recebida. Revelações de convocação/aura em andamento e modos de combate/diálogo continuam bloqueando o replay.

Ao reproduzir, o diálogo Cenas é fechado e o mundo permanece pausado. Ao sair ou concluir, a página reabre **Cenas** e devolve o foco ao botão da mesma missão. O player recebe `replay=true`; seus controles e preferências de movimento reduzido pertencem ao player v34. Som e trilha continuam sob a preferência persistente/MusicDirector da página; o replay não altera essa preferência ou a trilha do mapa.

## Persistência e recompensas

`replayQuestCinematic(id)` valida a missão, `cinematicSeen`, status completo/recebido e modo world. Sua sessão contém `replay` e um `token` monotônico, fora do save. `finishQuestCinematic(skip, expectedToken)` rejeita callbacks de sessões antigas. A ramificação replay só fecha a sessão e retorna ao mundo: não grava save, não muda etapas/escolhas/flags, não distribui cristais e não toca no recebimento da missão.

Durante replay, `update` retorna antes de avançar o relógio ou expirar técnicas de campo, e `save` é bloqueado. Isso preserva o snapshot persistente durante a reprodução. Ao voltar ao jogo, a atualização normal volta a valer; o replay não amplia a duração real de técnicas temporárias. A primeira exibição mantém o fluxo existente: conclusão/pular explícito marca `cinematicSeen`, e a recompensa continua exigindo uma única ação no Diário.

Não há mudança na versão do save ou no formato de `questsV31`. Saves antigos continuam usando o mesmo flag para liberar a memória.

## Validação em 4 de outubro de 2026

| Gate | Resultado | Escopo |
| --- | --- | --- |
| `node tests/quest-replay-v34.test.mjs` | **PASS — 785 checks** | Cinco missões; completo/recebido; som ligado/desligado; todos os campos persistentes/save intactos; um único recebimento original; tokens; handlers reais da página; contenção de teclas; retorno/foco; SSR da biblioteca/pôsteres/bloqueios |
| `node tests/quests-v31.test.mjs` | **PASS — 2.575 checks** | 30 missões, interações reais, escolhas, saves, desfechos e 60 tiros recebidos uma única vez |
| `node tests/party-hotkeys-v30.test.mjs` | **PASS — 250 checks** | Teclas 1–5/Tab, ordem/vitais/ultimate, guards de modo/menu e saves |
| `node node_modules/typescript/bin/tsc --noEmit --pretty false` | **PASS — exit 0** | Tipos da integração com o contrato replay do player v34 |
| `git diff --check` nos arquivos desta integração | **PASS** | Sem problemas de whitespace no patch |

O teste novo executa os handlers/effect de produção da página/biblioteca, em vez de copiar suas decisões de navegação e foco. O SSR usa o registro e o HudIcon reais. Os fixtures de conclusão preenchem objetivos/escolhas válidos e passam pelo parser de save antes de verificar replay.

Os gates separados de mídia/player e a reprodução desktop dos cinco MP4s foram concluídos pela raiz. O teste com mídia real passou1.710 verificações; os cinco filmes chegaram ao fim nativo e voltaram a Cenas com foco no respectivo card. O primeiro desfecho confirmou Continue manual e memória liberada antes do recebimento; o saldo4.800→5.600 Cristais permaneceu5.600 depois do replay. Veja [native-cutscenes.md](native-cutscenes.md), [browser-validation.md](browser-validation.md) e [visual-review-summary.md](visual-review-summary.md) para evidências e limites de cobertura. A inspeção de anatomia permanece por amostragem; não há declaração de QA manual mobile/fullscreen.

## Arquivos da integração

- `app/page.tsx`: inicia replay, associa callbacks ao token, preserva pausa e retorna a Cenas.
- `components/game-menu.tsx`: inclui a biblioteca e preserva as cenas antigas do capítulo com sua restrição de local.
- `components/quest-scene-library.tsx` / `.module.css`: cinco cards, pôsteres, estados bloqueados/liberados e restauração de foco.
- `lib/game/engine.ts`: sessão transitória, gate de replay, fechamento seguro e freeze do update/save durante replay.
- `tests/quest-replay-v34.test.mjs`: verificação de comportamento e persistência.

O build final Vinext/Vite passou as cinco etapas com exit0, e os5MP4/5JPG incorporados têm SHA-256 idêntico ao runtime final. Esta integração não alterou os assets nem publicou o jogo; commit/push e publicação ficam com a raiz.
