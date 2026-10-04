# Cutscenes nativas das missões — v34

Revisão técnica em 4 de outubro de 2026. Repositório: `C:/Users/Diego/OneDrive/Documentos/GitHub/RPGnovo`.

Este documento descreve o player entregue e os cinco filmes finais. Os resultados de mídia, revisão por amostragem e funcionamento no navegador são registrados separadamente.

## Filmes e estado da entrega

Os cinco filmes finais têm **1280×720, 16:9 e 24 quadros nativos por segundo**, verificados nos arquivos reais. Cada missão usa um MP4 próprio e um JPG extraído do primeiro quadro. O player reproduz os quadros codificados pelo navegador; não interpola imagens, não monta slides e não altera a velocidade para acompanhar o combate.

| ID estável | Título | Duração / quadros do registro | Estado desta revisão |
| --- | --- | --- | --- |
| `long-tinta` | O nome que o mar apagou | 10s / 240 | Técnica, amostragem visual e reprodução desktop aprovadas |
| `long-geada` | O jardim que guardou o inverno | 10s / 240 | Técnica, amostragem visual e reprodução desktop aprovadas |
| `long-brasa` | A promessa sob as cinzas | 10s / 240 | Fonte corrigida via Gemini; técnica, amostragem e reprodução desktop aprovadas |
| `long-trovao` | O sino que não aceitava o silêncio | 8s / 192 | Técnica, amostragem visual e reprodução desktop aprovadas |
| `long-nulo` | A última página em branco | 8s / 192 | Técnica, amostragem visual e reprodução desktop aprovadas |

A antiga exportação de Brasa8s/192 quadros foi substituída pela fonte corrigida de10s/240. Seu relatório final registra240 quadros decodificados distintos e igualdade dos pixels entre fonte e runtime. Não há declaração de anatomia perfeita em todos os quadros neste documento.

## Arquitetura e carregamento

- `lib/art/questCinematicsV34.ts` contém títulos, atores, avatares nativos existentes, caminhos, duração, contagem de quadros, três legendas e limite de carregamento. IDs desconhecidos, inclusive chaves de protótipo, são rejeitados.
- `components/quest-cinematic.tsx` usa um único `<video>` nativo para a missão escolhida. O `src` aponta para `/assets/v34/quest-cinematics/<questId>.mp4` e o `poster` para o JPG correspondente.
- `components/quest-cinematic.module.css` separa título, tela, narrativa e controles em linhas limitadas à altura do viewport. A imagem mantém sua proporção; o espaço livre fica em torno da cena.
- O portal espera o navegador antes de acessar `document`. Seu host é estável: entra na árvore do elemento fullscreen e volta ao `body` sem substituir o elemento de vídeo, reiniciar o relógio ou perder o controle focado.
- A biblioteca Cenas usa apenas cinco pôsteres JPG com `loading="lazy"`. Abrir a biblioteca não carrega os MP4s nem os quinze atlases v31. O filme só é solicitado quando seu player é montado; nenhum vídeo é acrescentado ao preload do mundo.
- O registro histórico `questCinematicsV31.ts`, os atlases e seus hashes permanecem como proveniência. As verificações de 48 quadros pintados por missão em v31 não servem como evidência de vídeo a 24fps em v34.

A API pública mantém `questId`, `caption?`, `sceneAct?`, `onComplete` e `onSkip`; acrescenta `replay?:boolean`. A página usa `key=session.token` e callbacks associados ao mesmo token. Sem `sceneAct`, toca o filme inteiro. `sceneAct` 0, 1 ou 2 seleciona um terço contínuo dos quadros nativos para preview, preservando a mesma fonte e mantendo o último quadro desse intervalo.

## Controles e acessibilidade

| Controle / situação | Comportamento |
| --- | --- |
| Reproduzir / Pausar | Controla o vídeo nativo e preserva sua posição |
| Repetir cena | Após o fim, retorna ao início do filme ou ao início do terço selecionado |
| Espaço fora de um botão | Pausa ou retoma a cena em andamento |
| Enter ou Espaço sobre um botão | Ativa apenas o botão focado e habilitado |
| Enter sem botão focado | Não encerra o filme nem conclui a missão |
| Tab / Shift+Tab | Circula pelos controles habilitados; `keyup` não move o foco novamente |
| Esc / Pular cena | Retorno explícito pela primeira exibição; chama `onSkip` uma única vez |
| Replay | Mostra **Voltar a Cenas**; Esc chama o mesmo retorno. Não exibe o botão Continuar |
| Primeiro desfecho | Só habilita **Continuar** após `ended` nativo, mídia validada e ausência de falha. Exige ativação explícita |
| Movimento reduzido | Começa pausado; reprodução manual continua disponível. Ativar a preferência durante o filme também pausa |
| Aba oculta | Pausa. Voltar à aba não retoma automaticamente |
| Atalhos do navegador | Ctrl, Meta, Alt e teclas F continuam disponíveis |

O diálogo usa `role="dialog"`, `aria-modal`, título e descrições associados, progresso acessível e estado de carregamento/falha. O foco começa no diálogo, passa ao controle de reprodução após a mídia estar pronta, permanece no modal e é restaurado ao sair. A integração da biblioteca devolve o foco ao card da mesma missão.

As legendas acompanham três beats da história, com os avatares originais. As legendas finais descrevem a consequência já escolhida; não pedem uma decisão que o jogador já tomou.

## Duração, falhas e silêncio

O player valida duração com tolerância máxima de um quadro nativo, dimensões de vídeo positivas e pelo menos um quadro decodificado (`readyState >= 2`). Um seek de preview precisa terminar antes de liberar a reprodução. Metadados ausentes, outro corte, mídia sem vídeo, erro de rede ou carregamento sem progresso não concluem a missão.

O limite de carregamento é 30 segundos. Uma falha apresenta **Tentar novamente** e permite retorno explícito; eventos atrasados da tentativa antiga não liberam sua reprodução. Falhas de autoplay mantêm a opção de reprodução manual. Ao desmontar, o player pausa o vídeo, cancela o relógio/watchdog e remove listeners e controles da tentativa anterior.

O vídeo recebe `muted=true`, `volume=0` e `playbackRate=1` ao preparar e reproduzir. O preparo das mídias remove suas faixas de áudio. O player e o replay não alteram a preferência persistente de som nem o estado de MusicDirector; a trilha do jogo continua subordinada à configuração já escolhida.

## Saves, escolhas e recompensas

Os cinco IDs e o campo persistente `questsV31.records[id].cinematicSeen` continuam iguais. A sessão `{questId, replay, token}` é transitória e fica fora do save. Não há migração de versão para esta troca de player.

A primeira exibição conserva o fluxo da missão: sua conclusão ou um pulo explícito marca `cinematicSeen`, salva e libera o recebimento no Diário. Terminar a reprodução do MP4 não chama `onComplete` automaticamente. As escolhas realizadas e suas consequências permanecem registradas.

`replayQuestCinematic` exige missão cinematográfica, `cinematicSeen`, status completo ou recebido e modo world; convocação, aura em andamento e outros modos bloqueiam a abertura. No replay, `update` e `save` são suspensos; ao fechar, o motor apenas retorna ao mundo. Não muda etapas, escolhas, créditos, cristais, vitais ou recebimentos e não paga a recompensa novamente. Callbacks antigos são rejeitados pelo token da sessão.

O menu é reaberto em **Cenas** ao sair de um replay. A recompensa original continua passando por `claimQuestV31` no Diário, com seu gate de recebimento único. Para os testes e detalhes da integração, veja [replay-integration.md](replay-integration.md).

## Fonte e proveniência da mídia

Fontes e prompts ficam em `art-source/v34/quest-cinematics/`, incluindo keyframes aprovados, prompts por filme, clips e `prepare.mjs`. A correção de Brasa foi recebida da sessão Gemini `https://gemini.google.com/app/5a0b33b7cf84269c`; seu prompt está em `long-brasa-corrected-video-prompt.txt`. O preparo rejeita fonte fora de 1280×720/24fps ou fora dos budgets previstos. O processo faz remux H264 com cópia do stream, `faststart` e remoção de áudio; não redimensiona, duplica, interpola, repete ou retima quadros.

O texto exato da chamada original de Tinta foi recuperado do DOM da sessão Gemini e preservado em `long-tinta-video-prompt.txt`. O arquivo contém o prompt original; a pendência de proveniência foi resolvida.

Por filme, `docs/qa-v34/media/<questId>-verification.json` registra hash da fonte/runtime, contagem, tamanho, duração, resolução, áudio, igualdade dos pixels decodificados entre fonte e exportação, timestamps uniformes, quadros distintos e maior sequência idêntica. Contacts e amostras de primeiro/meio/último quadro ficam na mesma pasta. Essas medidas técnicas devem ser lidas em conjunto com a revisão visual da fonte e da reprodução, sem inferir anatomia perfeita a partir de hashes.

## Evidências dos cinco filmes finais

As cinco fontes foram aprovadas pela raiz por amostragem visual. Cada contato reúne12 instantes distribuídos; os quadros primeiro, meio e último também estão disponíveis em resolução nativa. Os relatórios independentes descrevem o alcance e as limitações de sua inspeção.

| Filme | Medidas da mídia final | Evidência visual |
| --- | --- | --- |
| Tinta | [240 quadros / 10s](media/long-tinta-verification.json) | [Contato de12 instantes](media/long-tinta-contact.jpg) e [resumo independente](visual-review-summary.md) |
| Geada | [240 quadros / 10s](media/long-geada-verification.json) | [Contato de12 instantes](media/long-geada-contact.jpg) e [resumo independente, com ressalva de enquadramento de Mika](visual-review-summary.md) |
| Brasa corrigida | [240 quadros / 10s](media/long-brasa-verification.json) | [Contato](media/long-brasa-contact.jpg) e [revisão independente da correção](visual-review-brasa-corrected.md) |
| Trovão | [192 quadros / 8s](media/long-trovao-verification.json) | [Contato](media/long-trovao-contact.jpg) e [revisão independente](visual-review-trovao.md) |
| Nulo | [192 quadros / 8s](media/long-nulo-verification.json) | [Contato](media/long-nulo-contact.jpg) e [revisão independente](visual-review-nulo.md) |

Os cinco relatórios técnicos registram1104 quadros no total, todos distintos dentro de seus respectivos filmes, timestamps uniformes de1/24s, ausência de áudio e igualdade dos pixels de fonte/exportação. Isso mede a mídia codificada e sua conservação; a avaliação visual cobre as amostras registradas.

O [manifesto final](../../art-source/v34/quest-cinematics/manifest.json) reúne fontes, prompts e hashes. Os cinco MP4s somam39.289.376bytes, aproximadamente37,47MiB ou39,29MB decimais; esse total não inclui os pôsteres. Apenas o filme escolhido é solicitado pelo player.

## Validação e limites desta revisão

| Gate | Resultado registrado | Cobertura |
| --- | --- | --- |
| `node tests/quest-video-v34.test.mjs` | PASS — **1.520 checks** | Contratos dos cinco IDs, frames/timeline/legendas, duração, lifecycle real do player, metadata/decoded/seek, pausa/repetição, fim explícito, falhas/watchdog, silêncio, foco/teclas, fullscreen estável e SSR |
| `node tests/cutscene-v31.test.mjs` | PASS — **2.574 checks** | Proveniência histórica dos 15 atlases/240 quadros; somente o loader SSR foi adaptado ao player atual |
| Replay/motor/página | PASS — **785 checks** | Sessões e tokens, campos persistentes, recebimento único, retorno/foco e biblioteca |
| Trinta missões | PASS — **2.575 checks** | Missões, escolhas, saves e recompensas únicas |
| Atalhos 1–5/Tab | PASS — **250 checks** | Guards de modo/menu e controles do Grupo |
| Tipos `tsc --noEmit` | PASS — exit 0 | Contrato de props e integração, conforme conferência final da raiz |
| `ETER_VERIFY_QUEST_MEDIA=1 node tests/quest-video-v34.test.mjs` | PASS — **1.710 checks**, executado pela raiz | Inclui o player e os cinco MP4s reais: atoms MP4, samples `stts`/`stsz`, fps de cada segmento, contagem, duração, **1280×720** e existência dos pôsteres |
| Preparo/probe de mídia | PASS — cinco relatórios finais disponíveis | Hashes, decoded pixels, timestamps e contatos, produzidos pela raiz |
| Revisão visual das fontes | Aprovada por amostragem — cinco filmes | Contatos e relatórios acima; Brasa usa somente a versão corrigida |
| QA no navegador desktop | PASS — cinco filmes finais | Reprodução até `ended` nativo e retorno a Cenas com foco na missão correspondente; primeiro desfecho manual e recebimento único. Detalhes em [browser-validation.md](browser-validation.md) |
| Build Vinext/Vite | PASS — cinco etapas, exit 0 | Compilação final executada pela raiz |
| Mídia incorporada ao build | PASS — dez arquivos com hashes iguais | 5MP4 +5JPG de `dist/client` com SHA-256 idêntico ao runtime final |

Para repetir o gate completo, use `ETER_VERIFY_QUEST_MEDIA=1` ao executar `tests/quest-video-v34.test.mjs`. O modo padrão verifica o contrato e os eventos do player; seu resultado não deve ser apresentado como inspeção dos cinco MP4s reais.

A validação final no build de produção e na origem isolada `127.0.0.1:5175` está em [browser-validation.md](browser-validation.md). Os cinco filmes alcançaram o fim nativo e retornaram a Cenas com foco no card do próprio ID. Houve somente um vídeo por sessão, desmontado ao fechar; o save principal da origem5173 não foi acessado. O helper temporário de QA foi removido de `dist/client` após a inspeção.

O primeiro desfecho de Tinta confirmou: [Continuar inicialmente bloqueado](first-tinta-playing.png), [fim nativo com Continuar disponível](first-tinta-ended.png) e motor em `cutscene` até o clique manual. `cinematicSeen` liberou a memória antes de receber a recompensa. O recebimento real passou de4.800 para5.600 Cristais uma única vez; um replay posterior manteve5.600. [Cenas bloqueadas](cenas-locked-desktop.png) e [liberadas](cenas-unlocked-desktop.png) documentam esses estados.

As capturas são desktop1280×720. O override solicitado de390×844 não foi aplicado pelo navegador integrado, foi removido e seus arquivos foram renomeados como desktop. Não há QA manual de celular nesta sessão. A UI confirmou entrada em fullscreen, mas a inspeção DOM do proxy não expôs `fullscreenElement`; isso também não certifica fullscreen manual. A mudança do portal sem remontar o vídeo continua coberta pela suíte de lifecycle.

O build final e os hashes incorporados estão confirmados acima. Publicação e commit/push permanecem fora do escopo deste relatório. A revisão visual conserva o alcance de amostragem registrado, sem certificação individual de todos os quadros.
