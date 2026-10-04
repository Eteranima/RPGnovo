# Revisão integrada v31

A revisão usou a rota temporária descrita em `art-source/v31/review-fixture.txt`: estado isolado, sem ler ou escrever o save do jogador. A rota foi removida antes do build final.

## Resultados observados

- Seleção inicial em 1280×720: somente Seiji, Marin, Gabriel, Ophelia e Max, com seus companheiros canônicos. Artes, nomes, origem, descrição e botões visíveis.
- Diário: contagens 5/5/10/10, recompensa de 60 tiros, filtros e painel de detalhes. Aceitar Meu primeiro registro dentro do Diário conclui a leitura já visível; Rastreada · atualizar conclui a etapa de rastreamento.
- Recompensa recebida no navegador: saldo de invocação passa de 1.600 para 1.760 cristais após um tutorial, sem fazer sorteio. O botão de recebimento desaparece.
- Grupo: os cinco companheiros carregam suas imagens próprias de corpo inteiro; nenhum atlas antigo ou retrato de herói é usado. Liderar exploração fecha o menu e seleciona um slot real, preservando a ordem do Grupo.
- Cena Orfeu: preferência de movimento reduzido inicia no quadro 0, pausada. Reproduzir chega ao índice 47 (48º quadro) e aguarda Continuar. Tab de Pular cena chega a Continuar; Enter encerra a cena e libera a recompensa no Diário.
- Cena Mika em 844×390: diálogo de 372 px de altura, scrollHeight de 372 px, limites verticais entre 8 e 382 em viewport de 390 px. Título, imagem, legenda e os três controles cabem, sem rolagem. Pular cena retorna ao mundo e libera o prêmio sem alterar a decisão.
- Corrigido durante a inspeção: overlay cinematográfico preso ao containing block do cenário. Agora usa portal no body, altura limitada e layout compacto.
- Orfeu: caminhada nativa vista no Arquivo, com recorte transparente e direção oeste. Abel: patrulha nativa vista na Clareira da Pira, aproximação real e conversa com quatro falas. Sua rota final (7,11) → (9,11) → (9,10) evita a placa flutuante da saída. O teste das 32 poses confirma pelo menos 79,29 px de distância vertical.

## Provas

`origins.png`, `origins-mobile.png`, `journal.png`, `companions-group.png`, `orfeu-exploration.png`, `abel-exploration.png`, `cinema-orfeu.png` e `cinema-mobile.png`. A captura `cinema-before-layout.png` documenta o defeito encontrado antes da correção e não representa a versão final. `abel-dialogue.png` foi capturada antes do ajuste de posição da rota; as falas e a arte não mudaram.

## Gates separados

`integration-gate.txt`: 14 suítes legadas passaram. `quests-test.txt`: 2.575 verificações do motor novo. Arte/cinema possuem testes próprios em `tests/exploration-v31.test.mjs` e `tests/cutscene-v31.test.mjs`. TypeScript final sem erros. Build e revisão da cópia de produção são registrados ao finalizar a integração.

## Versão final local

- `pnpm build`: código de saída 0, cinco etapas concluídas. A lista final contém somente a rota `/`; a rota isolada de QA não entrou no build. O aviso de chunk acima de 500 kB é registrado em `build.txt` e não impede a compilação.
- Servidor local de produção iniciado em `http://127.0.0.1:5173/` com o build final.
- Continuar aventura restaurou Porto Lúmina, estágio 3, Ophelia e Carmilla, HP/MP existentes e modo Mestre. Preferência de som permaneceu desligada. Nenhum sorteio, recebimento de prêmio ou nova partida foi executado nessa cópia.
- Diário mostra as 30 novas missões, 60 tiros no total e as longas bloqueadas até o estágio 5, conforme a progressão real deste save. Captura: `production-journal.png`.
- Console do navegador sem erros após carregamento e abertura do Diário.
