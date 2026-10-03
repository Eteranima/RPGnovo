# Moldura elemental — seiji

A moldura atual usa tinta: painel branco. A fonte gerada foi copiada sem alteração para `element-background-source.png`; o prompt correspondente está em `element-background-prompt.txt`.

O arquivo de uso é `public/assets/v27/cards/seiji/card-frame.png`, com 2114 × 653 pixels. O único processamento foi o recorte nativo RGBA no retângulo `(0, 23, 2114, 676)` (direita e base exclusivas), calculado pelo canal alpha maior que zero. Não houve redimensionamento, pintura, alteração da transparência ou composição. Os pixels exportados foram comparados com o recorte direto da fonte e são idênticos. O contorno visível não toca nenhuma borda do arquivo (zero pixels de alpha maior que 24 nas quatro bordas).

A versão azul anterior está arquivada em `card-frame-blue.png`. `selected-atlas.png`, `crops.json`, `portrait-ring.png`, `hp-vessel.png` e `mp-vessel.png` permaneceram idênticos, verificados por SHA-256. Os três sprites separados preservam suas aberturas e cores próprias.

`element-background.json` registra fontes, geometria, hashes, contagem de pixels transparentes e verificação do recorte. O `crops.json` continua documentando o atlas original; esta mudança substitui somente a fonte e a geometria da moldura de card. Não existe abertura de retrato integrada nesta nova moldura; a posição do aro separado permanece a mesma.
