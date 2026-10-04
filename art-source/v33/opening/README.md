# Abertura v33 — montagem de vídeos originais

## Estado

As onze fontes selecionadas foram geradas, recebidas localmente e aprovadas por amostragem para seus trechos principais; os laudos temporais estão em `docs/qa-v33/opening/*-source/review.md`. A entrega reúne doze cenas: onze apresentações/estabelecimento e uma montagem editorial de trechos inéditos dessas fontes. O manifesto de exemplo documenta o contrato; seus caminhos não são assets do jogo.

A entrega final está em `public/assets/v33/opening/eter-anima-opening-24fps.mp4`: **1.500 quadros decodificados, 24/1 fps, 62,5 s, 1280×720, sem áudio e 21.681.228 bytes** (cerca de 20,68 MiB). SHA-256: `3f0fd3217c57b7dc1db4490179241df58c68d4c4045885ba8e24f4cb1bbe18d8`. `verification.json` confirma todos os timestamps em `índice/24`, 1.500 hashes de pixels distintos e nenhuma reutilização de índices das fontes. A compressão foi aprovada por amostragem independente das cenas 01–06 e revisão das cenas 07–12; `compression-review.md` delimita o escopo. A raiz concluiu a reprodução contínua no build de produção até `ended` / quadro 1499, com replay, pausa, preferência de movimento reduzido e estado de jogo preservado (`browser-review.json`). Os relatórios marcam `compressionApproval=passed`, preservando o limite da inspeção visual por amostragem.

## Orçamento de entrega

O limite oficial de um asset estático individual do Cloudflare Workers é **25 MiB**, tanto no plano Free quanto no Paid. A entrega deste projeto usa **24 MiB = 25.165.824 bytes**, reservando pelo menos 1 MiB até esse limite. Conferido em 4 de outubro de 2026 na [documentação oficial do Cloudflare](https://developers.cloudflare.com/workers/platform/limits/#static-assets).

A compressão padrão é **H.264 em duas passagens, 2.800.000 bits/s, preset slow**, com `maxrate` de 2.800.000 e buffer de 5.600.000 bits. Cada passagem lê diretamente o vídeo original, os mesmos índices reais e o mesmo enquadramento estático. As cenas são concatenadas sem nova compressão intermediária. O CRF 18 sem limite de tamanho foi substituído por esse orçamento; um bitrate maior não garante melhor resultado percebido para essa entrega. As duas passagens são descritas na [documentação oficial do FFmpeg](https://ffmpeg.org/ffmpeg.html#Video-Options).

Para 62,5 segundos, o alvo estima **21.875.000 bytes de vídeo**, mais uma reserva de 1.048.576 bytes para o contêiner: cerca de **21,86 MiB** ao todo. Isso é uma previsão; a aprovação depende do tamanho real. Após a concatenação, o assembler mede o MP4 e rejeita qualquer arquivo acima de 24 MiB **antes de copiá-lo para `public`**. `--verify-only` aplica a mesma verificação. Não se usa `-fs` para truncar o arquivo, nem se reduz a contagem de quadros, fps, duração ou resolução para fazê-lo caber.

Se a medição exceder o orçamento, o processo termina com erro e conserva os intermediários na pasta ignorada. Ajuste a compressão somente após revisar as amostras; não substitua a entrega por um vídeo cortado. A resolução continua sendo a aprovada no manifesto, 1280×720 ou 1920×1080, sem alteração automática. Rostos, mãos, contornos e efeitos foram avaliados nos PNGs correspondentes da fonte e da entrega; a revisão por amostragem está em `compression-review.md`. A entrega real ficou **3.484.596 bytes** abaixo de 24 MiB e **4.533.172 bytes** abaixo do limite oficial.

## Ferramentas locais

Não foi encontrado FFmpeg no PATH nem no runtime de dependências do workspace. Foi preparada uma cópia portátil do fornecedor Windows [Gyan](https://www.gyan.dev/ffmpeg/builds/), indicado pelo [download oficial do FFmpeg](https://ffmpeg.org/download.html). Os executáveis e o arquivo de procedência ficam em `.agents/v33-ffmpeg`, pasta já ignorada pelo Git. Não há instalação, modificação do PATH ou mudança de configuração do sistema.

Para reproduzir a preparação:

```powershell
& ./art-source/v33/opening/prepare-ffmpeg.ps1
node art-source/v33/opening/assemble.mjs --doctor
```

O preparador baixa a versão fixada 9.0.2, confere o SHA-256 publicado pelo fornecedor antes de extrair/executar e valida todos os caminhos de extração. O assembler confere novamente os hashes dos executáveis registrados. `--ffmpeg FILE --ffprobe FILE` permite usar outro par local autorizado; ambos os argumentos são necessários. Os processos usam argumentos estruturados, `shell: false` e janela oculta.

## Contrato das fontes

Crie `source-clips.json` com a estrutura de `source-clips.example.json`:

```json
{
  "fps": 24,
  "width": 1280,
  "height": 720,
  "shots": [
    { "id": "shot-01", "path": "raw/shot-01.mp4", "startSeconds": 0, "frames": 144 }
  ]
}
```

Esse trecho mostra uma entrada; o manifesto final exige **12 cenas**, em ordem. Contagens: **144, dez vezes 120, 156**. Soma: **1.500 quadros / 24 fps = 62,5 segundos**. A primeira cena ocupa 6 segundos, as dez intermediárias 5 segundos cada e a última 6,5 segundos.

- `id`: identificador simples e único, sem texto gravado na imagem.
- `path`: arquivo de vídeo local, relativo ao manifesto ou absoluto. URLs remotos não são aceitos.
- `startSeconds`: início do trecho relativo ao primeiro quadro do vídeo original.
- `frames`: contagem fixa do trecho, conforme sua posição na sequência.
- `sourceSHA256`: hash opcional da fonte aprovada. No manifesto final ele fixa todas as onze fontes e os segmentos da montagem; se o conteúdo do vídeo mudar, o assembler rejeita a exportação antes de codificar.
- `width`/`height`: 1280×720 ou 1920×1080. Fontes menores que a entrega são rejeitadas; não há upscale.

Uma cena pode usar `segments` em vez de `path`/`startSeconds`. Cada segmento tem `{ path, startSeconds, frames }`; a soma precisa corresponder aos `frames` da cena. Assim, a cena 12 pode reunir seis trechos reais de 26 quadros, somando 156, sem loop. O exemplo usa janelas posteriores aos trechos das cenas anteriores para preservar índices de fonte distintos. Escolha esses inícios pelos movimentos realmente aprovados; o manifesto não decide o conteúdo editorial.

As fontes precisam ter pelo menos 24 fps, timestamps estritamente crescentes e duração suficiente para o trecho. A inspeção decodifica os quadros e seleciona índices distintos próximos da grade temporal real de 24 fps. Um mesmo quadro de fonte, identificado pelo hash do arquivo e índice nativo, não pode ser reutilizado em outra cena. Clips curtos ou incapazes de fornecer quadros distintos são rejeitados e precisam de nova geração. Arquivos sob uma pasta `rejected` e os hashes registrados em `rejected-sources.json` são bloqueados mesmo quando seus metadados técnicos são válidos; renomear um clipe reprovado não o aprova.

## Execução

```powershell
node art-source/v33/opening/assemble.mjs --manifest art-source/v33/opening/source-clips.json --plan-only

node art-source/v33/opening/assemble.mjs --manifest art-source/v33/opening/source-clips.json --output public/assets/v33/opening/eter-anima-opening-24fps.mp4 --qa docs/qa-v33/opening

node art-source/v33/opening/assemble.mjs --verify-only public/assets/v33/opening/eter-anima-opening-24fps.mp4
```

`--plan-only` inspeciona as fontes sem renderizar. `--overwrite` autoriza substituir uma entrega/relatório existente após revisão; uma cópia do vídeo anterior fica no diretório temporário. Intermediários e logs de encoding ficam em `.agents/v33-opening-renders`, também ignorado pelo Git. O script não faz uploads, não altera a página nem configura publicação.

`--resume-dir .agents/v33-opening-renders/PASTA-DA-EXECUCAO` retoma intermediários dentro desse diretório ignorado. As fontes são verificadas novamente pelos hashes aprovados; os argumentos dos logs precisam corresponder aos mesmos índices, crop e parâmetros de encoding. Cada MP4 existente é decodificado para verificar contagem e timestamps antes de ser reutilizado. Um cabeçalho de relógio truncado só admite remux sem compressão se cada packet tiver PTS/duração corretos e o hash de cada payload H.264 permanecer igual; a versão anterior é preservada na pasta temporária. Não se reutilizam arquivos codificados com outras fontes ou parâmetros.

Cada cena usa `select` dos índices reais, reinício do relógio para 24 fps e ajuste espacial estático ao quadro 16:9. O centro da câmera é preservado. Não há `fps/cfr` criando quadros, câmera artificial, zoom animado, interpolação, blend, loop ou `tpad`. A exportação usa H.264/yuv420p, `fps_mode=passthrough` e concatenação das cenas já normalizadas. A semântica de passagem sem duplicação está na [documentação oficial](https://ffmpeg.org/ffmpeg.html#Advanced-options).

Todo áudio dos clipes é excluído. A trilha e a preferência de som continuam sob responsabilidade do MusicDirector da página.

### Compatibilidade do relógio com FFmpeg 9

A primeira tentativa terminou antes de gerar vídeo porque `-r 24` conflita com `-fps_mode passthrough`. O argumento `-r` foi removido. Os índices reais continuam em `select`, com `settb=1/24,setpts=N` e `-enc_time_base 1:24`: cada quadro ocupa exatamente um passo do relógio. `passthrough` conserva os timestamps, sem converter a sequência por duplicação para CFR, conforme a [documentação oficial do FFmpeg](https://ffmpeg.org/ffmpeg.html#Advanced-options). A taxa, duração e contagem reais continuam sendo medidas em cada trecho e no MP4 final. O teste de encoding também exige ausência de `-r` e presença do relógio exato.

A segunda tentativa também terminou antes de produzir MP4: o parser rejeitou a soma linear longa de 144 condições `eq`. A seleção agora compacta índices contíguos em `between` e mantém condições individuais para índices isolados; lacunas continuam excluídas. Expressões esparsas são agrupadas de forma balanceada. Isso altera a representação da seleção, preservando cada índice original.

Antes de repetir a montagem completa, `smoke-encode.mjs` codificou apenas a cena 01 em duas passagens: **índices 36–179, 144 quadros decodificados, 24/1 fps, 6 s, 1280×720, sem áudio**. O resultado fica somente na pasta temporária ignorada. `first-scene-smoke.json` registra a evidência; self-test e os 5 testes de orçamento/encoding passaram após ambos os reparos.

Na cena 12, o terceiro segmento tinha 26 packets com timestamps exatos, mas o cabeçalho de edição truncou a duração para 1,083 s. O formato MP4 usa `movie_timescale=1000` por padrão, independente do relógio do stream; ambos passam a **24000**, segundo a [documentação oficial de MOV/MP4](https://ffmpeg.org/ffmpeg-formats.html#Options-5). A recuperação sem recodificação preserva payloads H.264, enquanto o gate continua estrito para duração inteira do stream e PTS uniformes. O diagnóstico e a retomada estão em `codec-clock-fix.md`.

## Verificação e revisão visual

O arquivo de entrega só é substituído depois das verificações:

- `nb_frames` e `nb_read_frames` reais: **1.500**.
- `r_frame_rate` e `avg_frame_rate`: **24/1**.
- Duração do stream e do contêiner: **62,5 segundos**.
- Todos os 1.500 timestamps decodificados correspondem a `índice/24`, sem lacunas nos cortes.
- Resolução aprovada, yuv420p e nenhum stream de áudio.
- Tamanho real do MP4 **≤ 25.165.824 bytes**; margem até o limite de 25 MiB do Cloudflare registrada.
- Hash do filme, do manifesto, dos executáveis e de cada fonte.
- Índice/timestamp de fonte para cada quadro exportado; nenhuma reutilização de quadro original.
- Segunda passagem de decodificação com SHA-256 dos 1.500 quadros.

Em `docs/qa-v33/opening`, o processo salva `verification.json`, `ffprobe-final.json`, `decoded-frames.sha256`, 60 PNGs da entrega em `frames/`, contact sheet 5×12 e uma linha de cinco amostras para cada cena. `contact-sheet-index.json` relaciona cada amostra ao número da cena, quadro e tempo do filme. Miniaturas são redimensionadas apenas para revisão; os PNGs individuais preservam a resolução final.

Outros **60 PNGs correspondentes da fonte** ficam em `source-frames/`. São decodificados dos índices originais, com a mesma conversão espacial estática e formato de entrada usados pelo encoder, sem uma nova compressão H.264. O vínculo continua correto quando uma amostra cai em outro segmento da cena 12. `compression-comparison.jpg` e os arquivos `*-compression.jpg` mostram cada par com **fonte à esquerda / entrega à direita**. `compression-comparison.json` registra índices originais, hashes dos PNGs, dimensão e começa com o estado visual `pending`; após a revisão das amostras, este export foi marcado `approved-by-sampling`, com referências aos dois laudos. A reprodução contínua separada passou e está vinculada em `browser-review.json`. Compare os PNGs nativos para rostos, mãos, contornos, partículas e gradientes; a miniatura serve para localizar a cena. O relatório técnico inclui bitrate, previsão, tamanho medido e orçamento, mas não aprova automaticamente a qualidade visual.

`compression-detail.mjs` produz 11 pares de crops nativos sem resize/repintura. Inclui o quadro 1409 do filme, correspondente ao 133 da fonte Marin, para cobrir Umbra no terceiro segmento da montagem, ausente das cinco amostras regulares. `native-comparisons/index.json` registra cada região; a aprovação por amostragem aponta para os laudos e para a reprodução contínua separada, concluída pela raiz.

O relatório também registra quantos hashes decodificados são distintos e a maior sequência de pixels idênticos. Pausas de animação já existentes no vídeo podem repetir pixels; esse dado orienta a revisão de movimento, mãos, anatomia, identidade, transições e enquadramento. Uma contagem de contêiner correta não substitui essa revisão visual e não prova perfeição anatômica.

`node art-source/v33/opening/assemble.mjs --self-test` verifica contrato, soma, seleção distinta, rejeição de fontes curtas/lentas, caminhos locais, limites do checkout e validação de quadros/áudio/duração, sem gerar filme.

`node --test art-source/v33/opening/assemble-budget.test.mjs` verifica o limite de 24 MiB exato e sua ultrapassagem por um byte, a margem de previsão, argumentos das duas passagens sem truncamento, geometria e quadros preservados, pares de comparação através dos cortes e rejeição de um arquivo local realmente acima do orçamento. Esse teste não renderiza filme nem coloca conteúdo em `public`.

## QA das fontes recebidas

`source-qa.mjs` inspeciona uma fonte local de 24 fps, conta os quadros decodificados e extrai 16 PNGs completos a cada 0,5 segundo, de 0 a 7,5 s. A contact sheet é 4×4, com miniaturas de 320 px. `--crops FILE.json` aceita regiões nomeadas do personagem realmente presente: cada item tem `{ id, character, crop: { x, y, width, height } }`. Cada região produz 32 crops nativos a cada seis quadros, de 0 a 7,75 s, e duas contact sheets 4×4. Assim Umbra, Vajra, Dante e mãos/pés dos heróis recebem seus próprios rótulos. As regiões são retângulos estáticos de revisão; se um movimento sair do crop, confira o PNG completo antes de classificá-lo como corte do vídeo.

O argumento antigo `--crop x,y,w,h` continua disponível para os recortes do Mika nas fontes de Ophelia. As pastas e URLs desses registros foram preservadas. A fonte precisa fornecer todos os quadros; não há padding. Os comandos, hashes, índices e metadados ficam no manifesto de QA. A quantidade de PNGs de diferentes regiões não aumenta a quantidade de instantes distintos examinados.

```powershell
node art-source/v33/opening/source-qa.mjs --source art-source/v33/opening/clips/01-academy.mp4 --qa docs/qa-v33/opening/academy-source

node art-source/v33/opening/source-qa.mjs --source art-source/v33/opening/clips/03-ophelia.mp4 --qa docs/qa-v33/opening/ophelia-source --crop 650,180,430,540

node art-source/v33/opening/source-qa.mjs --source art-source/v33/opening/clips/04-marin-fixed.mp4 --qa docs/qa-v33/opening/marin-fixed-source --crops art-source/v33/opening/qa-crops/marin.json
```

`verify-source-qa.py` é uma verificação somente de leitura: confere hashes/dimensões e compara os pixels dos recortes com os mesmos retângulos nos PNGs completos. Na fonte 03, 16 quadros compartilhados somaram 3.715.200 pixels de recorte idênticos. Isso comprova integridade do crop, sem afirmar perfeição visual.

As avaliações estão nos arquivos `review.md` de cada pasta. A fonte 03 de hash `435829de715f08945b558f1ff274d2c334b27cf00f5a2b048b0e98267b529aa8` foi reprovada por aproximação da câmera que corta cabeça/adorno e botas; está bloqueada em `rejected-sources.json`. O remake da arte não foi reprovado. Uma nova geração de vídeo exige outra pasta de QA e aprovação do novo hash. A raiz aprovou a cena 01 em **1,5–7,5 s, índices 36–179**, evitando o arco semitransparente no início. O manifesto final usa na cena 12 seis janelas inéditas das fontes 02–07, 26 quadros cada a partir de 5 s; não reutiliza Academia nem seus quadros excluídos. A reprodução contínua do filme foi concluída pela raiz conforme `browser-review.json`.

## Preservação das fontes e evidências

Os MP4 originais recebidos, incluindo as versões rejeitadas, são preservados e **todos os MP4 brutos são versionados**, conforme a decisão da raiz. Os PNGs completos/crops de QA são preservados localmente e não foram repintados; podem ser reproduzidos a partir dos clipes e dos índices/filtros registrados nos manifestos. A regra atual de Git ignora `docs/qa-v33/**/*.png`, **exceto `*-proof.png`**; relatórios, hashes, manifestos e contact sheets permanecem disponíveis para versionamento. O filme final e o pôster destinados ao jogo são entregas separadas das fontes de produção.

Os logs brutos do encoder (`docs/qa-v33/**/*.log`) também são preservados localmente e ignorados no Git. Os relatórios estruturados, comandos, hashes, laudos e imagens de comprovação continuam versionados.
