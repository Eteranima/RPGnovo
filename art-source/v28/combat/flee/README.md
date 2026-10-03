# Combate v28 — Recuar: botas em movimento, seta curta de retorno e traços de deslocamento

Sprite final individual gerada em 2026-10-03 com image_gen built-in, uma chamada para esta peça. Arte anime de fantasia de Éter Anima, contorno limpo e cel shading. Padrão de prata dominante, filete champagne/ouro discreto e interior marinho compartilhado com as sprites Actions/Attack/Guard do agente element_audit.

## Arquivos

- Runtime: `public/assets/v28/combat/flee.png`
- Original gerado copiado byte a byte: `source.png`
- Prompt integral: `prompt.txt`
- Fonte, SHA-256, alpha, recorte, dimensões e área segura de texto: `manifest.json`

Referências locais inspecionadas antes da geração: `public/assets/v26/ui/travel-plaque.png`, `party-panel.png` e `public/assets/v25/ui/stone-reach-hud-atlas.png`. O resultado foi conferido com a família de combate, incluindo `public/assets/v28/combat/actions.png`.

## Recorte e leitura

A exportação usa apenas o bbox de alpha>24 com margem de oito pixels. Nenhum pixel foi repintado, recolorido ou redimensionado. Cada linha RGBA do recorte final foi comparada ao trecho correspondente do original e permaneceu idêntica. O original arquivado tem o mesmo SHA-256 da saída gerada.

O prompt solicitou proporção3:1; a forma nativa gerada ficou mais alongada. A proporção real está registrada no manifest e foi informada à raiz/UI. Preserve a proporção frontal ao exibir e mantenha o alvo de interação com48–56px de altura; use a área livre x32–88%, y25–75% para o texto DOM. Não há palavra, numeral ou rótulo embutido no bitmap.

Revisão visual da fonte e do recorte: uma única placa completa, ícone contido à esquerda, centro/direita livres, materiais coerentes e brilho controlado dentro da peça. Não há contorno visível cortado nas bordas da fonte. Os quatro cantos do PNG final têm alpha0; o interior pintado medido tem alpha252–253.

Integração, estados dos controles e revisão final da aplicação ficam com a raiz/agente de UI. Nenhum código da aplicação, CSS, teste ou Git foi alterado nesta subtask; não foi usado navegador.

