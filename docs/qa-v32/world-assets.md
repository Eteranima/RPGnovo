# Carregamento do mundo sob demanda — v32

## Escopo

`lib/game/worldAssetsV32.ts` resolve os consumidores reais do cenário: materiais presentes nas linhas do mapa, paredes e fachadas necessárias, props com os recortes finais v26/v30, entidades ativas, emblemas de missão e caminhadas dos integrantes do Grupo. O renderer usa esse plano em vez de baixar o registro global por exclusão de prefixos.

Abel e Orfeu mantêm as quatro folhas direcionais v31. Gabriel usa a forma selecionada. Aliases de inimigos que apontam para o mesmo URL recebem a mesma imagem decodificada. Os retratos de diálogo, ícones, companheiros do menu, poses de combate e ultimates não pertencem ao lote do mundo. As artes e os recortes aprovados permanecem intactos; não houve mudança de mapas, colisões, regras, saves ou publicação.

## Contrato de integração

- `new WorldRenderer(canvas, engine, { onLoadingChange })` informa `WorldLoadingStatusV32`, exportado por `lib/game/worldAssetsV32.ts`.
- Estado: `{ loading, map, error, progress, loaded, total, ready }`. `progress` varia de 0 a 1; os contadores consideram URLs únicos. `map` é `null` na abertura/seleção.
- `load(): Promise<boolean>` abre a animação do renderer uma vez. Em `start`/`selection`, resolve `true` sem imagens do mundo. Ao continuar, usa o mapa real do save após a transição do engine.
- `getLoadingState()` devolve uma cópia do estado; `subscribeLoading(listener)` informa o estado atual imediatamente e devolve a função de remoção.
- `retryLoading(): Promise<boolean>` refaz explicitamente o lote atual, reutilizando fontes bem-sucedidas. Não existe repetição automática após uma falha.

Somente um lote completamente carregado e decodificado substitui as imagens visíveis. Durante carga ou erro, o renderer mantém o último canvas e interrompe suas chamadas a `engine.update()`. Uma mudança durante o update também interrompe os próximos passos e impede a pintura da nova geração. O renderer nunca escreve em `engine.paused`: o controle de pausa do menu continua pertencendo à página.

## Cache e ciclo de vida

Até quatro fontes são carregadas simultaneamente. O cache reutiliza promises por URL, incluindo pedidos concorrentes de mapas diferentes. Fontes do mapa/Grupo desejado e do último lote completo permanecem disponíveis; até oito fontes inativas são retidas. Resultados obsoletos não publicam progresso nem substituem o cenário. Trabalho obsoleto ainda na fila não inicia download, e fontes já em andamento são aparadas ao terminar.

Uma falha de rede, decodificação ou timeout de 30 segundos produz uma mensagem e mantém `ready: false`. O retry pertence à interface da página. O descarte remove a assinatura do engine, cancela timers e callbacks de fontes, limpa os caches e impede novas pinturas/status. A mudança de orientação preserva uma cópia do último quadro até uma nova pintura nativa estar pronta.

O piso continua em cache para até três mapas. Sua assinatura inclui as linhas de navegação e os URLs dos materiais, preservando a invalidação de pontes de gelo e mudanças de arte. Não há carregamento global posterior em segundo plano.

## Medição

O registro anterior do mundo selecionava 79 chaves, equivalentes a **75 URLs e 113,88 MiB** de arquivos comprimidos. A abertura agora solicita **0 imagens do mundo**. Com Seiji e Ophelia e o inventário completo de cada mapa, os 12 cenários usam **9–13 URLs / 14,32–25,51 MiB** em cache frio. Pátio: **11 / 19,88 MiB**. Porto: **11 / 20,06 MiB**. São reduções de aproximadamente 78% a 87% nos bytes do lote do mundo.

As medidas são somas dos tamanhos reais em `public`, com deduplicação de URL. Não são uma medição de heap, tempo de rede, cache HTTP ou do total da página: abertura, HUD, áudio e pré-carga de combate têm consumidores separados. O inventário estático completo é conservador; NPCs já recrutados e entidades inativas podem reduzir o lote real.

`world-assets-measurements.json` registra os valores por mapa e os limites para todas as combinações válidas de 1–5 integrantes entre os nove recrutáveis: **4.572 planos medidos**. O pior lote de cinco integrantes, com Orfeu em Ashpyre, tem **19 URLs / 37,03 MiB**, aproximadamente 67,5% menos bytes que o lote anterior. Abel continua NPC/convocação, sem alterar a elegibilidade do Grupo.

## Verificação

`node tests/world-assets-v32.test.mjs`: **1.715 verificações aprovadas**. Cobertura: 12 mapas e consumidores pintados, todos os nove recrutáveis em quatro direções, slots de 1–5, NPCs Abel/Orfeu, forma lycan, missões dinâmicas, materiais nativos, ausência de fontes supersedidas, URLs duplicados, decodificação, concorrência limitada, fila obsoleta, cache, transições rápidas, falha/retry, timeout, canvas preservado, descarte e pausa do menu. `node tests/environment.test.mjs`: **33.206 verificações aprovadas**, preservando pisos, objetos, recortes e cache de pontes.

A revisão visual da página e o gate geral de build/publicação pertencem à integração principal.
