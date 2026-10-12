# Artes nativas do Auto Battler V41

Validação em 12/10/2026. A direção final solicitada usa molduras e ambientes com aparência de render 3D estilizado, metal dourado antigo, pedra azul petróleo, bevels, cristais facetados e sombras sobre a própria ferragem. As 31 peças continuam sendo sprites 2D de V39/V40. As animações de entrada, hover e realce pertencem à interface; estas fontes são renders estáticos.

## Fontes e registro

As quatro fontes de interface foram geradas com `image_gen` nativo usando as referências locais aprovadas. Os prompts, referências, fontes de geração e hashes SHA-256 estão em `art-source/v41/autochess/ui/selections.json`, `inspection.json` e `manifest.json`. As fontes 2D preparatórias foram preservadas em `2d-exploration/`; o registro oficial exige `renderStyle: 'stylized-3d'`.

Os PNGs de `public/assets/v41/autochess/ui/` e seus arquivos em `art-source/` são cópias byte a byte das saídas nativas. Nenhum pixel foi editado, redimensionado ou recomposto. Os cinco SVGs embutem o PNG completo original em um viewport medido, sem paths, desenhos, filtros ou alterações do bitmap. O viewport começa em `0 0`; a imagem recebe offsets negativos correspondentes ao recorte. Isso permite usar os slices nas coordenadas do próprio frame com CSS `border-image`.

`lib/art/autoChessInterfaceArtV41.ts` fornece `frameSrc`, `crop`, `slice` e `safeArea`. Os slices abaixo estão na ordem topo, direita, base, esquerda e aplicam-se a `frameSrc`. `nativeSlice`, quando disponível, refere-se ao PNG completo.

| Frame | PNG nativo | Recorte x/y/w/h | Slice do SVG | Centro |
| --- | --- | --- | --- | --- |
| panel | 1024×1536 | 22/9/981/1475 | 206/159/158/158 | Transparente |
| shop | 2172×724 | 12/66/2148/571 | 244/198/163/198 | Petróleo escuro |
| active | 1024×1536 | 49/47/926/1426 | 173/141/162/141 | Transparente |
| buttonQuiet | 1536×1024 | 29/92/1477/366 | 135/150/135/150 | Petróleo escuro |
| buttonActive | 1536×1024 | 29/550/1477/367 | 135/150/135/150 | Petróleo escuro |

Os estados de botão ocupam duas células isoladas do mesmo PNG. Todos os recortes retêm a ferragem visível completa e até oito pixels de margem; as linhas intermediárias são retas e as áreas centrais ficam livres de texto ou personagens gerados. Texto e controles reais são compostos pela interface.

## Transparência e geometria

Todas as quatro fontes são RGBA8, possuem pixels com alfa zero e cantos externos transparentes. Nenhuma borda de célula contém pixels visíveis com alfa ≥16. Os centros vazados de panel/active contêm apenas o resíduo nativo de quantização alfa 1: máximo 1, média 0,02095 e 0,00249 respectivamente. Não existe preenchimento visível nessas regiões. Esses bytes foram mantidos. Os centros da loja e dos botões têm média de alfa >253 e RGB médio abaixo de 70 por canal, preservando contraste sobre a base escura.

O cenário `academy-atmosphere.png` é um render 3D panorâmico opaco de 1672×941, com piso central livre e arquitetura nas laterais. O tabuleiro `boards/academy-3d.png` é um render 3D quadrado opaco de 1254×1254, com câmera superior ortográfica, piso livre, ferragem em volume e ornamentos nas margens. Os prompts e fontes originais de ambos estão registrados e seus hashes foram atualizados no manifesto. O alvo de composição do tabuleiro é a área central x/y 0,125 e largura/altura 0,75, conforme prompt e topologia do jogo; esses valores são uma especificação de integração, não uma alegação de medição pixel a pixel da pintura.

## Corpos compactos da loja e do banco

`lib/art/autoChessIdleArtV41.ts` contém os 31 recortes de `idle[0]`, medidos pelo bounding box de alfa ≥16. `idle-crops.json` registra a célula original, silhueta, margem de até dez pixels, SHA da fonte e recorte compacto. Todo conteúdo visível permanece dentro do viewport, incluindo asas, chifres e caudas. O recorte nunca inclui a célula vizinha; âncoras ficam contidas no novo viewport. Os PNGs originais V39/V40 permanecem iguais.

## Verificações executadas

- `node art-source/v41/autochess/ui/register-ui.mjs`: **38 gates PASS**, quatro fontes nativas, cinco frames, dois ambientes.
- `node art-source/v41/autochess/build-idle-crops.mjs`: **125 gates PASS**, 31 silhuetas completas.
- `node tests/auto-chess-art-v41.test.mjs`: **508 verificações PASS**. Cobre registro final, transparência real, centros legíveis, fontes e hashes, PNGs públicos/arquivados idênticos, offsets e origem normalizada dos SVGs, slices, fontes dos ambientes e preservação dos 31 corpos.

Inspeção visual realizada nas saídas nativas e em contatos de QA sobre fundo petróleo. Os contatos são miniaturas de inspeção; não substituem ou modificam os assets servidos. A validação de layout, animações, responsividade e navegação é feita pela etapa de interface no navegador.
