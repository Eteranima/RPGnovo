# Relógio de encoding — correção local

Em 4 de outubro de 2026, a primeira tentativa de encoding parou na primeira passagem da cena 01, antes de produzir um MP4. FFmpeg 9.0.2 rejeitou a combinação de taxa de saída `-r 24` com `-fps_mode passthrough` como contraditória. O erro não indicava corrupção das fontes; a inspeção das doze cenas/janelas já havia concluído.

Foi removido somente `-r 24`. O filtro continua escolhendo cada índice original, ajustando `settb=1/24,setpts=N`, com relógio do encoder `1:24` e passagem dos timestamps. Nenhum filtro de duplicação, interpolação, loop ou padding foi introduzido. As fontes selecionadas são 24 fps e os gates continuam medindo contagem decodificada, taxas 24/1 e duração de cada trecho e do filme final.

Após a correção, `assemble.mjs --self-test` passou e `assemble-budget.test.mjs` passou seus **5 testes**. O teste de argumentos agora rejeita `-r` e exige o relógio exato, preservando as verificações de orçamento, quadros, geometria, áudio excluído e pares fonte/entrega. Uma nova tentativa de exportação foi iniciada; seu resultado final é registrado em `verification.json`, quando existir.

Não houve alteração de configuração do sistema, compra, upload ou publicação.

## Seleção compacta e prova real

A segunda tentativa parou no parser da expressão linear longa com 144 condições `eq`. O seletor passou a compactar índices contíguos em `between`, deixando os isolados em `eq`, e a balancear expressões esparsas. Os mesmos índices nativos são escolhidos; lacunas entre runs permanecem excluídas.

O smoke real de uma cena executou as duas passagens antes da nova montagem completa. Seu FFprobe comprovou **144 quadros realmente decodificados, 24/1 fps, 6 s, 1280×720 e nenhum áudio**, usando índices **36–179** da Academia. Evidência em `first-scene-smoke.json`; o MP4 desse smoke fica apenas no diretório temporário ignorado. Após o reparo, self-test e os **5 testes** passaram novamente, incluindo lacunas da seleção e relógio sem `-r`.

## Cabeçalho dos segmentos de 26 quadros e retomada

A terceira execução concluiu e verificou as onze cenas principais. O gate interrompeu a cena 12 no terceiro segmento (Marin): os **26 packets H.264 tinham PTS de 0 a 25000, em passos de 1000**, cada um com duração 1000 no relógio 1/24000; a contagem decodificada e as taxas eram corretas. Porém, a lista de edição do contêiner truncou `duration_ts` para **25992**, reportando **1,083 s** em vez de 26/24 s.

O `movie_timescale` de MOV/MP4 tem padrão 1000, independente do `video_track_timescale`, conforme a [documentação oficial de formatos do FFmpeg](https://ffmpeg.org/ffmpeg-formats.html#Options-5). Ambas as escalas agora usam **24000**. Um remux com cópia do H.264 recuperou `duration_ts=26000` e duração 1,083333 s; não foi necessário recodificar os pixels ou acrescentar quadros.

`--resume-dir` conserva as onze cenas codificadas: verifica novamente as fontes pelos hashes aprovados, compara os argumentos do encoding anterior com os índices/parâmetros atuais e confere contagem, geometria e todos os timestamps decodificados. Somente um cabeçalho irregular com packets ainda exatamente no relógio pode ser recuperado; os SHA-256 de cada payload H.264 precisam permanecer iguais após o remux. A concatenação usa as mesmas escalas de cabeçalho e stream. O gate final continua exigindo **1500 quadros com PTS uniformes de 1/24 s e 62,5 s**, sem aumento da tolerância.

A retomada terminou com exit 0: **1.500 quadros decodificados e hashes distintos, 24/1 fps, 62,5 s, 1280×720, áudio zero e 21.681.228 bytes**. Todos os timestamps passaram na grade `índice/24`. Evidência final em `verification.json` e `assembly-resumed-log.txt`. Self-test e os cinco testes passaram novamente com verificações de `movie_timescale`, duração inteira truncada rejeitada e timestamps irregulares rejeitados. As cenas principais não foram recodificadas.
