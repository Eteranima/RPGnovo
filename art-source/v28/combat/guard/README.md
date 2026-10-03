# Sprite de combate — Guardar: escudo

Arte individual final criada com o gerador integrado `imagegen`. A fonte original permanece no diretório do gerador e uma cópia integral está em `selected-source.png`. `prompt.txt` registra a geração; as referências locais foram visualmente inspecionadas antes da chamada.

O arquivo de uso é `public/assets/v28/combat/guard.png`, 2016 × 590 pixels, RGBA. O recorte `(47, 55, 2063, 645)` usa o bbox do alpha maior que 24 com 8 pixels de margem para excluir a névoa de alpha baixa fora do contorno. Apenas recorte nativo: não houve pintura, redimensionamento, normalização de alpha ou composição. Os pixels exportados correspondem integralmente ao recorte da fonte.

Foram verificados alpha real de 0 a 255, exterior transparente, zero pixels visíveis nas quatro bordas da fonte e da exportação e interior pintado marinho. A área central/direita fica livre para rótulo DOM; a fonte não contém texto. O ícone ocupa o lado esquerdo. A placa gerada ficou mais alongada que a proporção aproximada 3:1 solicitada; a proporção nativa está registrada no manifest, sem distorção aplicada ao arquivo.

`manifest.json` registra dimensões, bboxes, hashes SHA-256, transparência, área sugerida para rótulo e prova de correspondência de pixels. Nenhum código de interface, regra de jogo, teste ou arquivo de outro sprite foi modificado.
