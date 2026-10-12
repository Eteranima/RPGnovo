# Artes do elenco expandido do Circuito · v40

Validação em 12/10/2026. O elenco do auto battler possui 31 peças: 23 artes nativas existentes da v39 e oito novas folhas independentes na v40. As fontes e o registro da v39 foram preservados.

## Conteúdo integrado

`lib/art/autoChessArtV40.ts` contém oito peças e oito recortes de retrato medidos na primeira pose de repouso. Cada PNG possui 12 poses completas em quatro colunas e três linhas: quatro de repouso, quatro de ataque e quatro de habilidade, totalizando 96 quadros novos. Os retratos utilizam essas mesmas folhas finais; não há outro conjunto de imagens com identidade divergente.

| Peça | Elemento canônico | Direção na fonte | Arte da habilidade |
| --- | --- | --- | --- |
| Vigia Rúnico | Tinta | Esquerda | Livro, talismãs e selo de proteção/interceptação |
| Mariposa do Véu | Gelo | Direita | Cristais e pó de gelo |
| Lobo de Cinzas | Fogo | Esquerda | Caçada com salto curto e arco de brasa |
| Cervo da Geada Lunar | Gelo | Esquerda | Investida, coroa e estilhaços de gelo |
| O Selo Quebrado | Tinta | Esquerda | Roda dourada que se quebra em fragmentos de tinta |
| Eco do Selo | Trevas | Esquerda | Véu e portal violeta de resgate |
| A Chama que Lembra | Fogo | Esquerda | Pira e impacto da espada de basalto |
| Guardião do Astrolábio | Eletricidade | Esquerda | Três órbitas/pulsos elétricos |

O campo `facing` permite ao renderizador espelhar a direção de aliados e inimigos sem editar os pixels. Todas as poses de cada folha usam a mesma direção. Lobo e cervo preservam anatomia quadrúpede; a mariposa mantém antenas e patas de inseto; os espectros preservam o corpo flutuante em mantos, sem ganhar pernas humanas artificiais.

## Geração e proveniência

A skill `imagegen` foi aplicada com a ferramenta nativa `image_gen`, utilizando as identidades canônicas locais da v30 e a linguagem de desenho aprovada da v39. Referências de corpo único reduziram a influência de poses de ultimate antigas sobre as novas animações. Correções de arte necessárias foram feitas pela própria ferramenta de imagem: separação dos dardos do Selo e direção uniforme dos três ataques do Vigia Rúnico.

O registro não reconstrói quadros, não pinta pixels nem modifica alpha. As oito saídas finais foram copiadas por seus bytes originais para:

- `art-source/v40/autochess/pieces/{id}.png`;
- `public/assets/v40/autochess/pieces/{id}.png`.

Prompts finais, prompts anteriores, fontes, referências, recortes, dimensões e hashes estão em `art-source/v40/autochess/selections.json` e `manifest.json`. Sete referências preparatórias usadas na geração foram arquivadas em `references/`, com prompts e hashes em `references.json`; elas não são servidas como arte do jogador.

## Inspeção e âncoras

O registro final passou 167 verificações e está marcado como `complete: true`. A inspeção de todas as folhas retornou `failures: []`: 12 quadros não vazios e distintos por peça, PNGs RGBA8 com pixels realmente transparentes e nenhuma arte com alpha ≥ 16 nas bordas dos recortes medidos. Há alpha residual de até 15 em algumas margens; não se afirma que todo pixel de margem seja exatamente zero.

Foram examinadas as fontes, folhas finais, montagens compostas sobre fundo sólido e todos os retratos. As montagens confirmaram corpos completos, poses separadas, direção consistente e efeitos compatíveis com os elementos. Não foi observado defeito concreto nessas montagens. A inspeção em escala de jogo não comprova perfeição anatômica de todos os detalhes em resolução nativa; a verificação de combate em navegador é feita separadamente.

As âncoras de lobo e cervo foram verificadas sobre as 12 poses com marcadores de chão. O detector inicial do lobo escolhia patas dianteiras em uma pose e traseiras em outra, deslocando o corpo horizontalmente. As âncoras finais seguem o centro entre as patas; nos saltos, seguem a projeção do corpo, evitando ancorar a peça no casco ou pata traseira estendida. `manual-anchor-measurements.json` vincula essas medidas ao hash exato de cada fonte. Nenhum PNG foi alterado nessa correção.

## Verificação reproduzível

```text
node art-source/v40/autochess/register-assets.mjs --inspect-only
node tests/auto-chess-art-v40.test.mjs
```

O teste passou com 551 verificações: oito novas peças, 96 quadros, oito retratos medidos e cobertura de todas as 31 peças jogáveis. Ele verifica que o registro esteja completo, catálogo/elementos, hashes e bytes arquivados/servidos, dimensões, RGBA e transparência inspecionada, recortes e âncoras, direções declaradas, quadros distintos e referências disponíveis. O registro completo pode ser reproduzido com `node art-source/v40/autochess/register-assets.mjs`.
