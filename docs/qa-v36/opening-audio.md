# Música na abertura v33

Data: 11/10/2026. A abertura usa a faixa já existente **Hidden Academy Theme** (`/assets/music/hidden-academy.mp3`). Os 1.500 quadros / 24 fps / 62,5 s e os bytes do MP4 permanecem intactos. A trilha é reproduzida junto do player pelo MusicDirector; o arquivo MP4 isolado continua sem faixa de áudio embutida.

## Comportamento

- Os mesmos dois canais de música atendem título, mundo e abertura. Durante o filme, a trilha normal fica suspensa; nenhuma terceira fonte concorrente é criada.
- O gesto **Assistir abertura** prepara o canal com mute nativo e volume zero. A música audível começa pelo evento nativo `playing`, acompanhando o tempo real do vídeo em velocidade 1×. Ela só inicia quando o som global já está ligado.
- Pausa, buffering, aba oculta, ativação de movimento reduzido, falha de carregamento e final do vídeo suspendem a trilha. O quadro final continua na tela sem música avançando sozinha.
- Reproduzir/repetir e **Ativar som** oferecem um novo gesto explícito ao navegador. Um bloqueio de áudio não causa tentativas a cada quadro. O botão de som usa a preferência persistente do jogo; nenhum evento do filme reativa o som desligado.
- A retomada alinha a faixa ao tempo atual; repetir reinicia seu relógio em zero. O relógio corrige desvios maiores que 0,2 s durante a reprodução e alinha imediatamente ao retomar. Se a faixa for mais curta, seu loop acompanha o tempo do filme.
- O volume global é preservado. Sair restaura a faixa normal e seu ponto anterior com fade de 450 ms. Reset/desmontagem e callbacks tardios não deixam música ou timers ativos nem reabrem uma sessão encerrada.
- A preferência de movimento reduzido continua iniciando o filme pausado; a preparação silenciosa não a contorna. Teclas, foco e fullscreen mantêm o comportamento do player.

## Evidências

- `tests/opening-audio.test.mjs`: **72 checks PASS** no MusicDirector e hook reais, incluindo mute, volume, gesto/autoplay bloqueado, relógio, pausa/retomada/replay, fim/fade, loop, fonte existente, descarte e callback tardio.
- `tests/opening-cinematic-v33.test.mjs`: **1.643 checks PASS**, incluindo relógio enviado à música, buffering/seek/fim, controles, movimento reduzido e portal de fullscreen.
- `tests/audio.test.mjs`: PASS das regressões de áudio, preferências, fontes nativas, transições e interrupção de SFX/Web Audio.
- `tests/ui-session-v36.test.mjs`: **193 checks PASS** dos fluxos/controles existentes.
- TypeScript completo: PASS (`--noEmit --incremental false`, exit 0). `git diff --check`: PASS.

## Navegador de produção

A raiz verificou o player na origem local de produção `http://127.0.0.1:5175/`, build `6c73a359ddba5e10ae1e`. São leituras dos elementos de mídia nativos, sem afirmar escuta subjetiva.

| Ação | Leitura do áudio / vídeo | Resultado |
| --- | --- | --- |
| Reproduzir | 0,615 s / 0,657 s | Ambos reproduzindo, diferença de 0,042 s |
| Pausar | 11,68 s / 11,71 s | Ambos pausados |
| Som desligado e retomar vídeo | Áudio pausado em 11,68 s; vídeo em 12,37 s | Mute preservado durante a reprodução do filme |
| Ativar som durante o filme, após `playing` nativo | 33,363 s / 33,438 s | Ambos reproduzindo, diferença de 0,075 s |
| Fim | Vídeo em 62,5 s, `ended` e pausado; áudio em 62,429 s, pausado e muted | Quadro final mantido; canal do título também pausado |
| Repetir | Relógios reiniciados em zero; leitura seguinte 0,22 s / 0,31 s | Ambos reproduzindo novamente |
| Sair | Música do título restaurada após a transição de 450 ms | Canal da abertura encerrado pela transição |

A leitura instantânea de zero durante a reativação do som não se manteve: a leitura após o evento nativo `playing` confirmou alinhamento dentro de 0,2 s. Não foi necessário alterar o código para esse estado transitório.

Os testes de código usam canais controlados; a revisão acima acrescenta evidência real do navegador de produção. Não constitui escuta subjetiva, medição em dispositivo físico nem comprovação de autoplay em todos os navegadores. Nenhuma nova faixa, serviço pago ou reencodificação foi utilizado.
