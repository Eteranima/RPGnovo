# Companheiros canônicos v31

Cinco ilustrações finais, cada uma com corpo inteiro RGBA e uma face recortada dos mesmos pixels. O **image_gen integrado** foi usado com transparência solicitada; nenhum personagem foi desenhado ou repintado por scripts/CSS.

| Companheiro | Herói | Identidade preservada |
| --- | --- | --- |
| Shin | Seiji | Cabelos brancos iridescentes, olhos azuis, quimono branco/preto/dourado e pincel de tinta |
| Mika | Ophelia | Cabelos loiros, óculos e casaco azul com forro de inverno |
| Umbra | Marin | Cabelos escuros, olhos vermelhos e traje nobre vermelho/dourado |
| Vajra | Max | Cabelos loiros/negros, traje preto/dourado e motivos elétricos |
| Dante | Gabriel | Fênix vermelha/dourada, asas, cauda e duas garras |

## Referências e fontes

O cânone visual veio de `public/assets/v30/ui/opening-companions.png`, `opening-ink-garden.png` e `opening-star-watch.png`, inspecionados antes da geração. Os nomes/vínculos foram conferidos em `COMPANIONS` do jogo. Professores de Stone Reach não receberam companheiros inventados.

`prompts.json` contém os cinco pedidos finais; `shin-repair.json` registra a edição de enquadramento. Fontes aprovadas: `{id}-source.png`. A primeira imagem de Shin cortava a ponta do pincel/cabelo na borda, foi rejeitada (`rejected/shin-clipped-source.png`) e refeita pelo image_gen preservando identidade, pose e figurino.

## Exportação e uso

`export_native.py` copia o corpo inteiro sem mudar bytes e faz somente um recorte retangular nativo para a face. O arquivo `manifest.json` guarda tamanho, faceCrop, alpha, hashes, referências e provas de igualdade RGBA. Nenhuma remoção manual de fundo, resize, recoloração ou desenho foi aplicado.

Runtime: `public/assets/v31/companions/{mika,shin,umbra,vajra,dante}/{fullbody,face}.png`.

`lib/art/companionsV31.ts` fornece `COMPANION_ART_V31`, `HERO_COMPANION_V31` e `companionForHero`. `CompanionPortrait` aceita `heroId` ou `companionId`, `size`, `variant` (`face` ou `fullbody`), `decorative` e `className`. A imagem mantém o aspecto e o alpha; nomes acessíveis podem ser fornecidos pela própria imagem ou pelo texto da integração. Os assets ficam nos consumidores de menu/origem, sem preload pelo `WorldRenderer`.

## Verificação

Os cinco corpos/rostos foram revisados visualmente e as mãos/pés das quatro figuras humanas e as asas/garras de Dante foram conferidos. Exportação: **30 verificações aprovadas**, com ampla transparência real, bordas sem pixels visíveis de alpha>24, cópia integral por hash e face RGBA exatamente igual ao recorte da fonte. Não há garantia absoluta de ausência de defeitos; alpha suave nativo e RGB oculto sob alpha0 permanecem intactos.

O teste `tests/exploration-v31.test.mjs` passou **654 verificações** para caminhadas/companheiros, incluindo os cinco vínculos do cânone e a ausência de vínculo inventado para professores. TypeScript foi verificado sem erros.
