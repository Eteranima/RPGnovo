# Ava — Matriarca dos Estratos · kit final v36

Revisão nativa em 11/10/2026. **A referência selecionada é a Ava de pele clara pêssego, cabelos longos cobre/vermelho, orelhas élficas e olhos verdes.** As seis folhas foram geradas novamente a partir de `portrait-source.png` de SHA-256 `44ffffc05265055eb3a513849af37f896aa1231fa4756aff73724ff4777f8f3a`. O retrato e o rosto, exportados pela raiz, não foram alterados.

O traje integral combina túnica marcial esmeralda de gola alta, mangas/calças marfim, metal dourado, manoplas e duas botas esmeralda com quartzo âmbar. Coroa e pequenos ornamentos minerais mantêm a identidade escolhida. Os poderes são **Terra, rocha estratificada e quartzo ocre**; verde é um material do traje/arquitetura, sem trocar o elemento por natureza, fogo ou gelo. Não há companheiro/pet inventado.

## Entregas selecionadas

| Asset | Células nativas | Dimensão nativa | Ordem |
| --- | ---: | --- | --- |
| `walk.png` | 12 | 1086 × 1448 | Sul, oeste, leste, norte; neutro e dois passos |
| `attack.png` | 6 | 1536 × 1024 | Repouso, preparação, avanço, impacto, continuidade, retorno |
| `cast.png` | 6 | 1536 × 1024 | Preparação, reunir minerais, moldar placa, pressão, liberação, retorno |
| `ultimate.png` | 8 | 1774 × 887 | Ordem nativa 0…7; golpe decisivo no quadro 5 |
| `vfx.png` | 6 | 1536 × 1024 | Impacto, projétil, proteção/cura, controle, Trono Mineral, Catedral dos Estratos |
| `icons.png` + `icons/0.png`…`5.png` | 6 | 1536 × 1024 | Seis motivos próprios nas mesmas funções |
| `cinematic-background.png` | Cenário | 1672 × 941 | Catedral de estratos/quartzo, sem personagens/texto |

Paths runtime: `public/assets/v36/variants/ava-worldroot-sovereign/`. As fontes selecionadas correspondentes ficam nesta pasta em `*-source.png`; o registro de cada folha identifica o output original da ferramenta.

As **44 células foram vistas individualmente**, além das folhas completas para conferir continuidade, direção, roupas e isolamento. A leitura encontrou mãos e botas completas nos movimentos; os punhos de ataque mantêm a mão de guarda visível, e o quadro 5 da ultimate mostra a palma de impacto acompanhada da outra mão. Não foram observadas silhuetas amputadas, membros extras evidentes ou fragmentos de vizinhos nos recortes selecionados. Esta é uma revisão visual finita, sem alegar ausência absoluta de qualquer defeito em toda escala. A coreografia dentro do jogo e sua QA no navegador pertencem à raiz.

## Geometria, apoio e transparência

Os seis atlases runtime são cópias byte a byte dos outputs originais selecionados. Não houve resize, warp, pintura, interpolação, filtro ou limpeza de alpha. Os recortes locais em `review/` e os ícones individuais preservam cada linha RGBA da fonte, inclusive pixels transparentes e muito suaves.

`atlas-entries.json` registra a divisão efetiva de cada folha, com cortes de linha/coluna e todas as âncoras. Os sprites não foram forçados por código para uma grade que alterasse seus pixels. `anchor-review.json` e `body-metrics.json` registram **32 âncoras corporais revisadas manualmente**: apoio no centro entre as duas botas, mantendo a linha nativa da sola mais baixa. Cristais, capa e cabelo não determinam esse apoio. O topo corporal usa coroa/cabelo e foi confirmado individualmente, separado de partículas destacadas.

O limiar alpha **24** serve apenas à medição. Todas as células têm zero pixels acima desse limiar tocando suas divisões ou ficando fora do recorte. Há espaços livres com alpha realmente zero; pixels suaves de alpha 1…24 junto a certos limites permanecem preservados e contados em `verification.json`. A prévia da ferramenta pode exibir RGB residual onde o alpha é zero; a conferência usa o canal alpha efetivo.

## Proveniência e reprodução

- `generation-v2-records.json` e `prompts.json`: seis prompts exatos, fonte original, referência final e SHA-256 de cada seleção.
- `portrait-manifest.json`: fonte/retrato/rosto pertencentes à raiz, conferidos sem sobrescrever.
- `playback-order.json`: quatro direções, ordem das poses e contato da ultimate no índice 5, sem duplicar ou permutar pixels.
- `verification.json`: hashes, contagem de células, comparação de linhas RGBA, limites, alpha e ícones individuais.
- `export-review-crops.mjs`: somente extração nativa local para revisão.
- `finalize-native-v2.mjs`: valida fontes/runtime e grava apenas medidas/JSON; não altera PNGs.

A catedral foi reutilizada com autorização expressa da raiz: o pedido de correção atingiu a personagem. O cenário permanece RGB opaco e byte a byte intacto, com proporção 16:9 arredondada nativamente em meio pixel na altura (1672 × 941); nenhum ajuste artificial de tamanho foi aplicado. O manifesto registra esse arredondamento e o hash da fonte.

O conceito anterior de pele cobre/trança cinza está **rejeitado** e preservado exclusivamente como histórico em `rejected-copper-concept-2026-10-11/`. Seus PNGs/personagens não integram este kit final; os arquivos de tentativas antigas que permanecerem na pasta externa não são fontes selecionadas. A seleção atual é determinada pelos seis manifests e por `prompts.json`.

Nenhum código, registro global, motor, save, gameplay ou preferência de áudio foi editado por esta tarefa. Integração, testes do jogo e compilação pertencem à raiz.
