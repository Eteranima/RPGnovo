# Revisão da compressão final — abertura v33

Revisão em 4 de outubro de 2026, sobre o MP4 de SHA-256 **3f0fd3217c57b7dc1db4490179241df58c68d4c4045885ba8e24f4cb1bbe18d8**. A fonte fica à esquerda e a entrega à direita em cada par.

## Verificação técnica

- **1.500 quadros** contados no contêiner e realmente decodificados; **24/1 fps**, **62,5 s** no stream e contêiner, **1280×720**, H.264/yuv420p e nenhum áudio embutido.
- Os **1.500 timestamps decodificados** estão na grade `índice/24`, inclusive nos cortes. Os 1.500 hashes decodificados são distintos; nenhuma sequência de pixels idênticos excede um quadro.
- **21.681.228 bytes**: margem de **3.484.596 bytes** até o orçamento de 24 MiB e **4.533.172 bytes** até o limite de 25 MiB do Cloudflare.
- O manifesto seleciona 1.500 índices nativos distintos, sem reutilização, padding, loop ou interpolação. Fontes reprovadas ficam bloqueadas por hash.
- Onze cenas principais e os três primeiros segmentos curtos foram preservados na retomada. O cabeçalho truncado de Marin foi recuperado sem recodificação; todos os payloads H.264 permaneceram byte a byte iguais.

Evidências: `verification.json`, `ffprobe-final.json`, `decoded-frames.sha256`, `assembly-resumed-log.txt` e `codec-clock-fix.md`. O self-test e os cinco testes de orçamento/encoding passaram depois dos reparos do relógio.

## Amostragem visual

As doze folhas panorâmicas têm cinco pares por cena: **60 instantes da fonte e os mesmos 60 da entrega**. Esses PNGs são nativos, com conversão espacial estática correspondente ao encoder. As miniaturas servem para localização; detalhes foram comparados nos arquivos nativos.

O auditor independente revisou cenas **01–06**: seis folhas panorâmicas e pares nativos 002/007/012/017/022/027. Não identificou bloqueador de compressão nessas amostras: mãos/rostos, duas mãos e botas de Shin, Mika, Umbra, penas/garras de Dante e pregos/Vajra seguem legíveis. O laudo independente registra seu próprio escopo.

Esta revisão examinou cenas **07–12**: seis folhas panorâmicas e **11 pares nativos adicionais** em `native-comparisons/`, reproduzíveis com `compression-detail.mjs` e descritos em `native-comparisons/index.json`.

| Cena/trecho | Detalhes conferidos | Resultado nas amostras |
| --- | --- | --- |
| 07 — Ava | Face, flores/cabelo, mãos enfaixadas, rochas e poeira | Identidade e contornos mantidos; Terra ocre/marrom preservada |
| 08 — Orfeu | Dois punhos, bandagens, face/cabelo branco, duas botas | Contornos e anatomia da fonte preservados; efeitos cinza/brancos |
| 09 — Carmilla | Mão alta/baixa, agulhas, face, cabelo e linhas vermelhas | Linhas principais legíveis, sem perda que mude a leitura das mãos |
| 10 — Beatriz | Palma, face/chapéu, empunhadura, lâmina e ponta | Lâmina íntegra e contrastes água/sombra preservados |
| 11 — Abel | Cajado, mãos, óculos/face, botas, fogo do leão | Silhueta e cores preservadas; sem mudança de identidade pela compressão |
| 12 — montagem | Shin, Mika, Umbra, Dante, Vajra e Ava | Rostos/mãos/vestes legíveis nos seis trechos finais |

A amostra nativa adicional de Umbra usa **quadro 1409 do filme / 133 da fonte Marin**, cobrindo o terceiro segmento da montagem, ausente das cinco amostras regulares. O script apenas decodifica, recorta e coloca os dois lados juntos; não repinta nem redimensiona esses crops.

Há suavização discreta de folhagem, arquitetura distante e detalhes muito finos em movimento, compatível com a compressão. Não identifiquei perda que apague os contornos principais, modifique membros, altere enquadramento ou troque as cores dos elementos nas amostras examinadas.

**Aprovação por amostragem da compressão**, com o escopo acima. A revisão não examinou visualmente todos os 1.500 quadros. Não se declara ausência absoluta de defeitos anatômicos. O relatório técnico comprova a estrutura do vídeo; a avaliação visual descreve somente os instantes conferidos.

## Reprodução contínua — verificação da raiz

A raiz concluiu uma reprodução natural inteira na prévia do build de produção, terminando em **62,5 s / `ended=true` / quadro 1499**, 1280×720 e som mudo. Repetição, pausa em 34,318 s e saída do player preservaram seu funcionamento. A preferência real de movimento reduzido iniciou o player pausado e o botão manual iniciou a reprodução. As teclas 1–5/p e Esc não alteraram o estado de jogo; o baseline e estado final são iguais. A cópia para a distribuição conserva o mesmo SHA-256 da entrega.

Evidência: `browser-review.json`, produzida pela raiz. Essa verificação não inclui viewport móvel no navegador, conforme o próprio relatório. `compressionApproval=passed` foi registrado junto aos laudos de amostragem e reprodução contínua, sem afirmar inspeção anatômica integral de cada quadro.
