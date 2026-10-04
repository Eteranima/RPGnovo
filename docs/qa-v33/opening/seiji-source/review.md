# Seiji + Shin — revisão do clipe corrigido

Fonte: `art-source/v33/opening/clips/02-seiji-corrected.mp4`. Esta revisão não altera o vídeo e não monta o filme.

## Contagem real

FFprobe local 9.0.2, com `-count_frames`, confirmou vídeo H.264/yuv420p, **1280×720**, `r_frame_rate: 24/1`, `avg_frame_rate: 24/1`, **240 quadros declarados e 240 decodificados**, duração de vídeo **10,000 s**. O áudio é AAC; sua duração e a do contêiner são **10,005 s**. Arquivo: **8.538.051 bytes**. O áudio deve ser removido na montagem; a trilha pertence à página.

## Material de revisão

- `full/frame-00.png` a `frame-19.png`: 20 PNGs completos, nativos 1280×720, quadros `0,12,…,228` — tempos `0; 0,5; 1; …; 9,5 s`.
- `full-contact.jpg`: 5×4, miniaturas 320×180, ordem por linha.
- `shin/frame-00.png` a `frame-47.png`: 48 recortes nativos 500×530, quadros `0,5,…,235` — tempos de 0 até 9,791667 s.
- Recorte fixo: **x=740, y=180, w=500, h=530**. Cabelo, duas mãos, roupa e duas botas de Shin permanecem dentro dele nas amostras.
- `shin-contact-1.jpg`, `-2.jpg`, `-3.jpg`: 16 amostras por folha, 4×4, largura de miniatura 320. Apenas essas miniaturas são redimensionadas.
- `qa-manifest.json`: índices/tempos/hash de cada PNG, hash da fonte, dados técnicos e filtros exatos de extração.

As 68 imagens correspondem a **64 quadros de fonte distintos**, pois quatro tempos aparecem nas duas seleções. Além das quatro contact sheets, foram abertos em resolução nativa os quadros completos 0, 120, 180 e 228, e os recortes de Shin 0, 50, 100 e 235.

## Resultado visual

| Intervalo amostrado | Resultado |
| --- | --- |
| 0–3,125 s, quadros de Shin 0–75 | Utilizável. Dois braços distinguíveis: mão do pincel à esquerda da imagem e mão sobre a perna à direita. Duas botas presentes. Piscadas e pequenas mudanças de expressão preservam a identidade do rosto. |
| 3,333–6,458 s, quadros 80–155 | Utilizável. Pegada do pincel, punho da outra mão e joelhos permanecem coerentes. Não foi identificado um terceiro braço nas amostras. Cabelo e bordas da roupa mantêm a identidade. |
| 6,667–9,792 s, quadros 160–235 | Anatomia de Shin utilizável nas amostras. Cabeça gira ligeiramente em direção a Seiji, sem rosto ou membros extras identificados. Ambas as botas permanecem visíveis. O avanço da câmera aproxima o cabelo de Seiji da borda superior nos segundos finais. |

**Nenhum intervalo foi reprovado por anatomia nesta amostragem.** Para o plano principal de 120 quadros, a janela **0–5 s** é a recomendação: os dois personagens, mãos e botas ficam legíveis. Para o segmento final sem reutilizar os mesmos quadros, **5–6,083333 s** oferece 26 quadros adicionais de fonte com bom enquadramento. Os segundos finais têm composição mais fechada e devem ser escolhidos apenas se essa aproximação for desejada.

A conclusão cobre as imagens inspecionadas; não afirma ausência absoluta de defeitos em todos os 240 quadros. A conferência independente em movimento permanece com a integração principal, incluindo os quadros 236–239 que não fazem parte das seleções solicitadas.

## Prova de recorte nativo

`art-source/v33/opening/verify-seiji-source-qa.py` apenas lê e compara arquivos já extraídos; não gera nem modifica imagens. Verificou as dimensões/contagens dos 68 PNGs e comparou os recortes aos pixels RGB dos PNGs completos nos quadros 0, 60, 120 e 180: **1.060.000 pixels idênticos**, sem resize, repintura ou transformação anatômica. Os recortes foram feitos exclusivamente pelo FFmpeg, após a conversão do quadro completo para RGB.

Filtros usados:

```text
Completo: select='not(mod(n,12))',format=rgb24
Shin: select='not(mod(n,5))',format=rgb24,crop=500:530:740:180
```

Ambas as extrações usaram `fps_mode=passthrough`, sem preenchimento ou interpolação. O clipe anterior com três braços continua bloqueado por caminho e hash no assembler.
