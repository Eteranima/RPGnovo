# Kit de card — beatriz

Gerado em 2026-10-03 com a ferramenta built-in image_gen, em uma chamada para este kit. Direção anime de fantasia e cel shading de Éter Anima; identidade: ondas azul-mar e espirais de escuridão violeta.

## Arquivos finais

- `public/assets/v27/cards/beatriz/card-frame.png`
- `public/assets/v27/cards/beatriz/portrait-ring.png`
- `public/assets/v27/cards/beatriz/hp-vessel.png`
- `public/assets/v27/cards/beatriz/mp-vessel.png`

O original selecionado está em `atlas-selected.png`; o prompt integral está em `prompt.txt`. O atlas é RGBA de 1536×1024 pixels. `manifest.json` registra o caminho do original gerado, SHA-256, dimensões, contagem de alpha, recortes e aberturas.

## Preparação e integração

Os limites desenhados variaram em relação às posições/alturas da grade solicitada. As quatro peças foram exportadas pelo recorte nativo medido, com três pixels de margem e sem redimensionar, repintar ou recolorir. Os recortes não se sobrepõem. O script de exportação verificou cada linha RGBA de cada PNG contra o trecho correspondente do original; todos os pixels dentro dos recortes foram preservados. O atlas arquivado é idêntico, byte por byte, ao original.

Cada `opening` no manifest contém a abertura real em coordenadas relativas ao PNG. Use essas medidas para posicionar o retrato e os preenchimentos dinâmicos de HP/MP. A abertura circular pode ter o centro deslocado em relação ao retângulo total por causa das ornamentações. `textRect` identifica uma região livre para texto dentro do card.

`framePortraitOpening` registra também a zona de retrato do card principal para alinhá-la ao aro separado. Nos cards Carmilla, Beatriz e Abel, a abertura foi medida pelo alpha; ondas e emblemas ocupam parte de seu contorno. O card Orfeu tem um punho pintado nessa zona: seu aro interno foi medido visualmente e o retrato deve ficar acima do emblema. Os métodos estão explicitamente registrados no manifest.

O centro medido do anel e os centros dos dois canais estão alpha0. A medição de abertura usa alpha≤8 para incluir apenas a área vazia e sua transição de antialiasing; bordas e ornamentos mantêm o alpha original. Nenhuma barra de vida/mana preenchida foi embutida na arte.

## Revisão

As quatro peças exportadas foram inspecionadas visualmente em resolução nativa: silhuetas completas, sem letras/numerais, sem retrato de personagem embutido, áreas de texto limpas, motivos da personagem distintos e canais livres. Gemas funcionais HP vermelha/MP azul preservadas. Não foi encontrado fragmento de peça vizinha no recorte.

A revisão do layout final na aplicação é feita pela raiz e pelo agente de UI. Este kit não altera código nem dados de personagens.

## Fundo elemental final

O fundo navy do card principal foi substituído por azul à esquerda e preto à direita, com divisão vertical visualmente equilibrada (aproximadamente 47%/53% na faixa central medida, conforme interpretação aprovada pela raiz). A edição foi feita com image_gen built-in por referência ao card original; os motivos, aro integrado e composição frontal foram preservados visualmente. As peças separadas de retrato, HP e MP não foram alteradas: seus SHA-256 continuaram iguais.

O card azul anterior está arquivado em `card-frame-blue-original.png`, acompanhado de `manifest-blue-original.json`. A saída final da edição está em `element-background-source.png`, e seu prompt em `element-background-prompt.txt`. `element-background-manifest.json` registra fonte, hash, recorte, proporção e nova posição de `framePortraitOpening`. A exportação final foi apenas um recorte nativo, verificado pixel a pixel, sem repintura ou redimensionamento. A geometria final foi enviada ao agente de UI para alinhamento do retrato.

O atlas inicial em `atlas-selected.png` continua sendo a fonte das três peças separadas; o card principal final tem sua própria fonte de edição. A revisão desta etapa cobriu as quatro cores, integridade da silhueta, transparência exterior e preservação das peças separadas.
