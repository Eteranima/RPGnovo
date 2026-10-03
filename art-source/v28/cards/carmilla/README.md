# Carmilla — reparo do fundo v28

Ferramenta: imagegen integrada, edição da moldura aprovada v27.

O pedido foi preencher a abertura transparente atrás do retrato com uma base carmim, mantendo costuras, agulhas, joias e borda dourada. A fonte selecionada é `source.png`; o pedido exato está em `prompt.txt`.

O arquivo de runtime é `public/assets/v28/cards/carmilla/card-frame.png`. A exportação extraiu o contorno em resolução nativa, sem pintar, recolorir ou reconstruir pixels. `manifest.json` registra hashes, caixa de recorte e cobertura do interior. Os pontos internos medidos têm alpha 252–253, sem abertura transparente; a transparência externa foi preservada.

O retrato continua separado e o centro foi alinhado com a base carmim medida no PNG. A revisão final é feita na batalha e no rodapé reais do componente.
