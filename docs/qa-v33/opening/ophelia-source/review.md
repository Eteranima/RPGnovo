# Ophélia e Mika — revisão da fonte 03

**Estado: rejected-enquadramento. Não incluir este hash na montagem.** A raiz solicitou uma nova geração com câmera fixa e corpos inteiros.

Fonte na inspeção: `art-source/v33/opening/clips/03-ophelia.mp4`. A cópia local veio exclusivamente de `C:\Users\Diego\Downloads\Woman_and_boy_sharing_frost_20261004083043.mp4`, com igualdade de SHA-256 entre origem e destino.

## Verificação técnica

- H.264 High, yuv420p, 1280×720.
- `r_frame_rate` e `avg_frame_rate`: 24/1.
- `nb_frames` e contagem realmente decodificada: 192.
- Duração de vídeo e contêiner: 8,000 segundos.
- AAC estéreo, 48 kHz. A montagem final exclui todo áudio da fonte.
- Arquivo: 8.691.969 bytes.
- SHA-256: `435829de715f08945b558f1ff274d2c334b27cf00f5a2b048b0e98267b529aa8`.

## Amostras

16 PNGs completos, na resolução nativa, cobrem os quadros 0, 12, …, 180: de 0 a 7,5 segundos, a cada 0,5 segundo. A contact sheet usa 4×4 miniaturas de 320 px.

Os 32 recortes do Mika cobrem os quadros 0, 6, …, 186: de 0 a 7,75 segundos, a cada 0,25 segundo. Retângulo nativo: **x 650, y 180, largura 430, altura 540**. A base desse retângulo coincide com a base do vídeo original; quando as botas desaparecem ali, o corte já existe na fonte. As duas contact sheets também usam 4×4 miniaturas de 320 px. Não houve pintura, upscale, interpolação ou substituição de quadros. O conjunto contém 48 PNGs, referentes a 32 quadros distintos de fonte.

A folha completa e as duas folhas do Mika foram revisadas. Também foram inspecionados PNGs nativos completos em 0, 1,5, 2, 2,5, 3, 3,5, 4,5, 5 e 7,5 segundos e recortes nativos do Mika em 4,5, 5 e 7,75 segundos.

## Resultado visual por intervalo amostrado

| Intervalo | Observação | Decisão para o trecho de 5 s |
| --- | --- | --- |
| 0–1,5 s | Ambos os corpos ainda cabem, embora o adorno superior da Ophélia tenha pouca margem. Mika mantém cabelo loiro, óculos, casaco azul, duas mangas/mãos e duas pernas/botas distinguíveis. | Trecho curto utilizável em composição, insuficiente para 120 quadros. |
| 2–3 s | A aproximação leva o adorno/cabelo da Ophélia à borda superior e começa a cortá-lo. A mão levantada do Mika permanece ligada ao braço; a outra fica ao lado do corpo. | Reprovado pelo enquadramento integral. |
| 3,5–4,5 s | A bota da Ophélia alcança a borda inferior e deixa de ter margem, enquanto o corte superior cresce. As botas do Mika chegam muito perto da base. | Reprovado. |
| 5–7,75 s | O zoom corta parte crescente da cabeça/rosto da Ophélia e as botas do Mika. A esfera de gelo brilhante também encobre parte da luva levantada do Mika. | Reprovado. |

Nas amostras do Mika não foi identificado braço ou perna extra, nem troca de identidade do rosto. Os fechamentos dos olhos são compatíveis com piscar/sorrir, e os óculos permanecem. A luz mais intensa após cerca de 5 segundos limita a leitura dos dedos da mão levantada; não se declara anatomia perfeita nos quadros escondidos pelo efeito.

Os efeitos são **azul/ciano e branco**, com floco de neve, trilha espiral e esfera cristalina. Não há fogo nos efeitos de ataque amostrados; as luzes amarelas pertencem às lanternas do cenário.

## Janela de cinco segundos

**Nenhuma janela de 5 segundos foi aprovada nesta versão.** A janela inicial 0–5 segundos já contém os cortes da Ophélia; as janelas posteriores herdam a aproximação ainda maior. Não se pode recuperar partes que desapareceram do vídeo com recorte, letterbox ou mudança de escala. Também não se deve esticar o início com repetição, padding ou quadros inventados.

O hash está bloqueado em `art-source/v33/opening/rejected-sources.json`. Para a nova fonte: câmera travada, margem acima do adorno e abaixo das duas botas da Ophélia e do Mika por todos os 8 segundos, preservando as identidades e o gelo. A análise é uma amostragem; a revisão contínua e a aprovação final permanecem com a raiz. Nenhum filme final foi montado.
