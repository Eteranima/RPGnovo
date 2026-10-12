# Carregamento das artes de combate — correção v38

## Caso observado

Na produção a616, o combate contra Cinder, com Seiji, Ophelia, Marin, Gabriel humano e Abel, apresentou a mensagem de arte indisponível após atualização/recarga. Uma nova tentativa recuperou o palco. O bloqueio de arte impediu o motor de iniciar ações invisíveis.

A função real `battleArtKeysV32` exigia 29 chaves em 28 URLs: **63,15 MiB transferidos e aproximadamente 168 MiB de RGBA decodificado**. O prefixo de Gabriel humano incluía indevidamente os três atlas da forma Lycan. O produtor iniciava todas as imagens simultaneamente e seu prazo de 15 segundos começava antes de uma requisição conseguir uma vaga de rede/decodificação.

O probe HTTP local em `docs/qa-v38/cinder-art-http-probe.json` registrou as URLs do escopo **antes da correção**: todas responderam 200, com MIME compatível e decodificação nativa válida. O tempo conjunto foi de 12,35 segundos, incluindo leitura e decodificação. Não foi identificado arquivo ausente ou corrompido. Essa medida não reproduz o tempo de decodificação de um celular ou a carga do cache no navegador.

## Correção

- O escopo usa as chaves exatas de ataque, conjuração, ultimate, fundo cinematográfico e VFX de cada identidade visual. Gabriel humano não baixa a forma Lycan; Gabriel Lycan continua usando suas artes próprias.
- A fila compartilhada limita a seis imagens em carregamento, inclusive entre palco e cinematic. O prazo de **15 segundos por imagem** começa ao iniciar a requisição, sem consumir o tempo de espera na fila.
- Falhas limpam o prazo, a fonte da imagem e a promessa em cache; o retry pode solicitar a mesma URL novamente.
- Escopos em andamento ficam protegidos. Ao terminar um escopo, as imagens já resolvidas de grupos anteriores são retiradas do cache; pintores ativos conservam seus próprios dicionários de imagens.
- O erro mantém texto simples para o jogador. Chaves e URLs ausentes são registradas no console e em `canvas.dataset.artFailures`, limpos na próxima tentativa.

O escopo humano corrigido contém **25 URLs**, cerca de **55,62 MiB transferidos / 150 MiB decodificados**. Não houve mudança no motor, nos prazos de ações, na velocidade, no Service Worker ou nas artes.

## Gates

- `tests/battle-art-loading-v38.test.mjs`: **59 verificações aprovadas**, executando o produtor real com relógio e imagens controladas; testa espera total maior que 15 segundos sem falso timeout, máximo de seis requisições, deduplicação palco/cinema, escopos simultâneos, retenção, cancelamento e retry.
- `tests/battle-polish-v32.test.mjs`: **509 verificações aprovadas**; todos os asserts existentes foram mantidos. A contagem de chaves de arte diminui ao excluir os atlas Lycan não selecionados.
- HTTP/MIME/bytes e decodificação nativa de todas as URLs do caso: aprovados.

## Confirmação no navegador de produção

A raiz verificou a produção **090a** com Seiji, Ophelia, Marin, Gabriel humano e Abel contra Cinder: o primeiro carregamento chegou ao estado pronto **sem retry e sem `artFailures`**. O palco desenhou os cinco aliados e liberou os comandos.

| Viewport | Altura do palco | Altura corporal de Abel | Rodapé compacto |
| --- | ---: | ---: | ---: |
| 405×452 | 167 px | 46,83 px | Preservado |
| 844×390 | 197 px | 97,60 px | 40 px |
| 1310×572 | 379 px | 151,49 px | 40 px |

Nas três resoluções não houve overflow do documento. Esta evidência confirma o carregamento inicial da produção corrigida; a recuperação por retry descrita no início pertence à produção a616 anterior. A fonte de carregamento permanece congelada. Um novo acabamento do cabeçalho em retrato será recompilado pela raiz, sem mudar este carregador.
