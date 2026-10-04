# Revisão visual — experimento Mika V35

## Parecer

**Aceito para apresentação como experimento de animação desenhada; não aprovado como qualidade final de produção.** Os 48 desenhos preservam Mika e suas duas mãos nos recortes examinados. Há uma piscada, pequenas mudanças de cabeça/ombros e variação de luz e partículas de gelo. Existem oscilações do desenho do cenário, sobretudo na passagem 35 → 36. Arquivos distintos não demonstram, por si só, movimento fluido.

## Escopo e referências

Foram vistos os quatro atlases finais `art-source/v35/frame-test/{a,b,c,d}.png` completos e os 48 quadros finais em contatos de recortes de rosto e de mãos, ampliados por vizinho mais próximo para inspeção. Também foram comparados planos completos nativos em 11/12, 23/24, 35/36 e 47/0. `c-rejected.png` foi excluído.

Contatos: `.agents/v35-audit-final/faces-{a,b,c,d}.png`, `hands-{a,b,c,d}.png` e `seams.png`. A ampliação serve apenas à inspeção. Referências canônicas: `public/assets/v31/companions/mika/fullbody.png`, `public/assets/v31/cinematics/long-geada/avatar-mika.png` e `art-source/v34/quest-cinematics/keyframes/long-geada.png`.

Os recortes cobrem cada desenho, mas não equivalem a examinar todos os pixels de cada quadro nem a assistir à reprodução contínua. Os contatos de inspeção conservam a numeração original; a entrega final permuta apenas 13/14, mantendo os mesmos desenhos. A raiz confirmou separadamente no navegador reprodução de 2 s, dimensões 480 × 270, cadência 24 fps e funcionamento de pausa, término, retorno e foco. Esses testes funcionais não eliminam as limitações artísticas deste laudo.

## Identidade, anatomia e elemento

Mika mantém a identidade de menino chibi loiro, olhos azuis, óculos redondos escuros, casaco azul/dourado com gola e punhos de pelo branco, calças azuis, botas e luvas escuras. A expressão gentil e os efeitos azul/branco de gelo e cura são coerentes. Não aparece fogo ou elemento incompatível.

Nos 48 recortes de mãos, há duas mãos enluvadas ligadas às duas mangas: a mão à esquerda da imagem segura a tigela prateada; a mão à direita repousa junto à raiz. Não foi observado terceiro braço, terceira mão, troca de objeto ou antebraço desconectado. As silhuetas de luva e tigela variam um pouco. Em 480 × 270, dedos ocupam poucos pixels: este laudo não certifica cinco dedos em cada mão de cada quadro.

A pose ajoelhada é mantida; a bota visível não é cortada e o segundo pé fica oculto pela pose. Não é possível afirmar que ambos os pés estejam inteiramente visíveis. A flor de gelo permanece preservada, sem transformação que imponha uma escolha narrativa.

## Movimento desenhado

| Quadros | Observação |
| --- | --- |
| 0–11 / A | Pequenas mudanças reais de inclinação de rosto, óculos e ombros, além de textura. Olhos abertos. A progressão não é contínua: 2 → 3 ergue o rosto e 3 → 4 o abaixa; 7 → 8 repete um retorno. |
| 12–23 / B | Piscada real. Na entrega final: aberto em 12, meio aberto em 13, fechado em 14–18 e aberto a partir de 19, com expressão mais aberta em 23. A raiz confirmou o fechamento/reabertura e autorizou inverter somente os desenhos originais 13/14; a exportação foi concluída. A ordem original fechado → meio aberto → fechado foi corrigida sem fabricar desenhos. |
| 24–35 / C | Olhos abertos; pequenas mudanças de sorriso, rosto, cabelo, gola e gelo. Parte relevante da diferença é redesenho de detalhes/iluminação, sem arco de pose claramente espaçado. |
| 36–47 / D | Pose aproximadamente estável, com brilhos/partículas variando. Mudanças sutis de rosto e roupa; o fundo não se torna rigorosamente estático. |

Piscada e efeitos sustentam a proposta de teste curto. A inspeção não comprova 48 poses intencionais uniformemente espaçadas para movimento fluido.

## Continuidade e cenário

- **11 → 12:** mudança moderada de rosto/cabelo, registro de detalhes e estágio do brilho da raiz.
- **23 → 24:** pequena redefinição de pose/contorno, livro, flores e arquitetura.
- **35 → 36:** maior quebra de registro. Livro de estudos, formas do fundo e partes da figura mudam em posição, proporção ou acabamento; o brilho também muda. Continua o mesmo plano, mas a alteração não se explica apenas por deslocamento uniforme de câmera. Não é um corte narrativo deliberado para outra cena.
- **47 → 0:** reinício perceptível de pose, textura, registro e intensidade do gelo. A sequência não contém loop automático; essa passagem só ocorre mediante repetição solicitada.

Arquitetura, livro, flores, cabelo e pelo apresentam variações sem movimento correspondente, que podem produzir tremor em reprodução. A medição técnica de 35 → 36 (MAE RGB 39,085 contra mediana interna aproximada de 19,105; 2,046×) reforça a atenção à passagem; não é uma medida de qualidade artística nem prova isolada de anatomia.

## Cadência recomendada

Manter **48 desenhos em 2 segundos a 24 fps**, como uma única experiência solicitada, apresenta honestamente o resultado. A ordem da piscada foi corrigida; a cadência não corrige o registro. A prévia está em Cenas e não substitui os cinco filmes de missão aprovados.

Não foram produzidas variantes de 12/24 desenhos nem prometida correção do fundo por redução de fps. Para produção, a principal melhoria seria manter cenário e modelo com registro consistente e desenhar intermediários com espaçamento planejado.

## Dados técnicos consultados

Segundo `art-source/v35/frame-test/verification.json`: `public/assets/v35/frame-test/mika.mp4`, 48 quadros decodificados distintos, 24/1 fps, 2,000 s, 480 × 270, H.264, 1.067.014 bytes, sem áudio, timestamps uniformes. Recortes PNG exatos em relação às fontes; sem redimensionamento, interpolação, padding, quadros duplicados ou pausas acrescentadas. O H.264 não é codificação sem perdas. SHA-256 final consultado: `9f95143ac77c92441c40b1e117c72661d8c75549084f6a5cce9c957aff4c0e1a`.

`export-manifest.json` confirma saída 13 = fonte 14 (`b.png`, célula 2), saída 14 = fonte 13 (`b.png`, célula 1); os outros 46 PNGs e todos os atlases permanecem idênticos. A alteração afeta somente a ordem temporal da piscada, não as oscilações entre atlases.

Este laudo não alterou fontes, quadros, exportação, manifesto ou runtime. A aceitação limita-se à apresentação experimental, com identidade e anatomia verificadas no escopo descrito e com as oscilações visuais expostas.
