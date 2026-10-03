# Som persistente — v26

## Defeito e correção

A abertura e a montagem da página forçavam o som ativo; `unlock()` também ativava o diretor mesmo após uma escolha de mute. O primeiro elemento de áudio tinha `autoPlay`, permitindo que uma troca de `src` fugisse do controle do diretor. O botão “Ativar trilha de abertura” não sincronizava o indicador de som. Efeitos WAV e tons Web Audio já iniciados continuavam até terminar.

A escolha agora fica em `eter-anima-sound-enabled`; o volume usa a chave existente `eter-anima-music-volume`. Iniciar a aventura e os gestos que desbloqueiam o navegador apenas tentam reproduzir quando a escolha já está ativa. Os controles explícitos de som atualizam juntos o indicador, a preferência, a música e os efeitos. Não há `autoPlay` nos canais.

Mutar pausa e silencia ambos os canais imediatamente, cancela a transição de faixa, interrompe efeitos ativos e tons, e suspende Web Audio. Promessas de reprodução ou de retomada de contexto que terminam depois do mute não podem reativar som. Ativar novamente permite novos efeitos sem reiniciar os efeitos interrompidos. Saves, MP3s, volume dos WAVs e duração dos tons permanecem preservados.

## Verificações automatizadas

- `node tests/audio.test.mjs`: passou. Cobre preferência e volume após recarga/remontagem, abertura/seleção/mapas/batalhas/retorno à abertura, `autoPlay` nativo, cancelamento de crossfade, `play()` atrasado, descarte, bloqueio de autoplay, ativação explícita, SFX ativos/pendentes e retomada atrasada de Web Audio.
- `node tests/expansion.test.mjs`: 169 verificações passaram, incluindo faixas, crossfade, mute e ativação explícita.
- `node tests/v18.test.mjs`: 107 verificações passaram. O simulador legado de `Audio` recebeu `pause()`, `paused`, `muted` e demais propriedades usadas, mantendo as verificações existentes e acrescentando a interrupção dos efeitos já em reprodução. Nenhuma condição foi removida ou relaxada.
- `node node_modules/typescript/bin/tsc --noEmit --incremental false`: passou.

## Comparação visual do elenco

Foram lidos os retratos finais de Seiji, Ophelia, Carmilla, Marin, Gabriel, Max, Beatriz e Orfeu; as folhas de combate de Marin, Gabriel, Max, Beatriz e Orfeu; as folhas de exploração de Seiji, Ophelia, Carmilla, Beatriz e Orfeu; e retrato/exploração/ataque/habilidade da Ava v26.

O desvio mais claro era Ava v25, com rosto arredondado, modelagem volumétrica de lábios e nariz e sombreado pictórico. A Ava v26 tem olhos anime, contornos limpos e sombras delimitadas, conservando cabelo ruivo, flores, verde/creme, bandagens e pedras de Terra. Os demais personagens examinados mantêm a linguagem anime. Orfeu no combate v25 é mais pintado que seu retrato, mas não tem a mudança de linguagem observada na Ava anterior. Sua exploração usa cabeça proporcionalmente maior, característica também existente nas folhas originais de exploração.

Esta comparação não exige substituir artes adicionais nesta rodada. Não representa garantia de ausência absoluta de defeitos em todas as poses.

## Verificação na interface real

A sessão principal usou uma instância de QA da própria página Home, com um grupo fixo Ava/Seiji no Subterrâneo Selado e gravação de progresso desativada somente nessa instância. A partida aberta pelo usuário ficou preservada em sua aba.

- Com o HUD em “Sem som”, abrir o minimapa, entrar em Sistema, voltar à abertura e pressionar Start manteve a escolha desligada.
- Nos dois elementos `audio`, a leitura do DOM mostrou `muted: true`, `paused: true` e `autoplay: false`, inclusive com as fontes da abertura e do subterrâneo.
- Continuar e recarregar a instância de campo manteve o HUD desligado e ambos os canais pausados e silenciados. A captura final de campo mostra o indicador “Sem som”.
- Os testes de ativação explícita e das transições de mapas/batalhas complementam essa revisão; não foi necessário ativar o áudio da partida do usuário.

O código temporário da instância de campo foi arquivado em `art-source/v26/qa/field-review-route.txt` e removido de `app/` antes da compilação de produção.
