# Revisão independente da compressão — planos 01–06

## Escopo e resultado

Revisor: `opening_identity_audit`. Revisão visual somente de leitura, posterior à exportação. **Nenhum bloqueador da compressão foi identificado nas amostras inspecionadas dos seis planos.** Isso não constitui inspeção de todos os 1.500 quadros ou aprovação da reprodução contínua no navegador.

Foram abertas as seis folhas `01-shot-01-compression.jpg` a `06-shot-06-compression.jpg`, com cinco pares por plano, totalizando **30 quadros de fonte e 30 quadros correspondentes da entrega**. Em cada par, a fonte está à esquerda e a entrega à direita. As folhas usam miniaturas para localizar diferenças; os detalhes críticos foram conferidos também em PNGs nativos de 1280×720.

Foram abertas e comparadas diretamente as doze imagens de `source-frames/` e `frames/` com índices **002, 007, 012, 017, 022 e 027**. Seus hashes foram conferidos contra `compression-comparison.json`, sem alteração de pixels, recorte adicional ou repintura nesta revisão.

| Plano | Amostra nativa | Quadro do filme | Índice da fonte | Observação visual |
| --- | ---: | ---: | ---: | --- |
| 01 — Academia | 002 | 72 | 108 | Arquitetura, lua, janelas, folha, lanternas e reflexos conservam composição e cores. Há suavização discreta de detalhes distantes, sem apagar a leitura principal. |
| 02 — Seiji e Shin | 007 | 204 | 60 | Rostos, cabelo, fitas, pincéis, mãos e bordados permanecem legíveis. Shin conserva as duas mãos e botas da fonte corrigida; a compressão não introduz outro membro ou corte. Parte das pernas de Seiji continua coberta pelo figurino, como na fonte. |
| 03 — Ophelia e Mika | 012 | 324 | 60 | Renda, pérolas, contornos do rosto e roupa violeta permanecem distintos. O gelo azul/branco, mãos de Mika, óculos e botas continuam legíveis. Não foi identificado corte adicional do adorno ou dos pés. |
| 04 — Marin e Umbra | 017 | 444 | 60 | Mantidos cabelo escuro, rosto, figurino azul/preto/dourado, duas mãos e duas adagas baixas. Umbra conserva rosto, mãos e botas; sombras violetas não se tornam um membro adicional. |
| 05 — Gabriel e Dante | 022 | 564 | 60 | Punhos, rosto, bordados, fogo e contornos das penas permanecem legíveis. As asas recolhidas, duas garras e cauda de Dante têm o enquadramento da fonte; não aparece corte novo. |
| 06 — Max e Vajra | 027 | 684 | 60 | Preservados olhos, cabelo, costuras, duas mãos, pregos, arcos amarelos/cianos, roedor no ombro e Vajra distinto. Não foi identificada fusão impeditiva entre dedos e pregos ou perda dos contornos principais. |

A suavização fina observável em vegetação, reflexos e arquitetura distantes é discreta. Nesta amostragem, não foi identificada perda que impedisse reconhecer personagens, mãos, adereços ou elementos. As folhas de cinco instantes não avaliam flicker entre quadros consecutivos, ritmo dos cortes ou comportamento do player; essas verificações permanecem com QA e a integração principal.

## Vínculo com a entrega técnica

O MP4 local inspecionado corresponde ao SHA-256 **`3f0fd3217c57b7dc1db4490179241df58c68d4c4045885ba8e24f4cb1bbe18d8`**, conferido por leitura do arquivo contra `verification.json`.

O relatório técnico registra **1.500 quadros, 24/1 fps, 62,5 s, 1280×720, 21.681.228 bytes, nenhum stream de áudio e nenhuma reutilização de quadro de fonte**. A segunda decodificação registra 1.500 hashes de pixels distintos e maior sequência idêntica de um quadro. Esses dados são evidência do pipeline, não uma prova automática de anatomia ou qualidade visual perfeita.

Esta revisão não altera `verification.json`, `compression-comparison.json`, manifesto, log de produção ou seus estados de aprovação. QA concluiu a revisão separada dos planos 07–12, registrada em `compression-review.md`. A integração principal confirmou a reprodução integral da build de produção local em `browser-review.json`: término em 62,5 s/quadro 1499, repetição, pausa, contenção de teclas e igualdade do estado do jogo antes/depois. Esses resultados complementam a entrega; não ampliam o escopo visual desta auditoria para quadros não inspecionados. Mobile não foi testado no navegador. A entrada em tela cheia foi observada, mas ela estava desligada no término por causa não observada; não se afirma persistência durante todo o filme.
