# Validação do jogo — cutscenes v34

Data: 4 de outubro de 2026. Validação no build final de produção, em `http://127.0.0.1:5175`, separado da origem principal `5173`.

## Isolamento

Três fixtures foram produzidos com `parseSave`/hydrate reais: cinco memórias bloqueadas, cinco vistas/recebidas e Tinta com desfecho pendente. O seletor temporário só aplica o estado após um clique, e recusa qualquer origem fora da porta local 5175 antes de acessar armazenamento. Ficou em `.agents` e foi copiado somente para `dist/client` durante QA; não integra o produto. O save principal não foi acessado nem substituído.

## Resultados já observados

- Cenas mostra as cinco missões longas. Antes da primeira exibição, os cinco botões ficam desabilitados e a razão está visível. Com `cinematicSeen`, os cinco botões ficam disponíveis.
- Tinta: vídeo selecionado com 1280×720 e 10s; começa pausado com movimento reduzido. Reproduz até o fim nativo, retém o desfecho, apresenta Repetir cena e não conclui automaticamente uma missão. Repetição e pausa foram exercitadas; Escape devolve Cenas e foco ao botão `long-tinta`.
- Brasa corrigida: vídeo final de10s/1280×720 reproduzido até100%; retorno explícito restaura Cenas e foco no botão `long-brasa`.
- Geada: vídeo final de10s/1280×720 reproduzido até100%; retorno explícito restaura Cenas e foco no botão `long-geada`.
- Trovão: vídeo final de8s/1280×720 reproduzido até100%; retorno explícito restaura Cenas e foco no botão `long-trovao`.
- A cada abertura há somente um elemento de vídeo; ao fechar, ele é desmontado. Os vídeos examinados estão silenciados, e o HUD conserva Ativar som. Teclas2 eP no modal não trocaram líder nem ativaram som.
- Créditos80, XP0 e vitais Seiji85/85 e40/40, Ophelia70/70 e55/55 permanecem iguais no menu após esses replays. A suíte do motor verifica adicionalmente que replay não salva, não altera escolhas/progresso nem paga recompensas.
- O controle do jogo confirmou entrada em tela cheia e o player ficou visível. A inspeção DOM do navegador integrado reportou `fullscreenElement` ausente; não se usa essa observação para certificar permanência em fullscreen. A continuidade do mesmo portal/vídeo e foco na mudança de fullscreen é coberta pelo teste de lifecycle, não por uma alegação de QA manual em todos os navegadores.

## Conferências finais

- Nulo: vídeo de 8s/1280×720 reproduzido até o fim nativo; Cenas retorna com foco no botão `long-nulo`. O estado público do jogo antes e depois dos replays confirmou Pátio, capítulo 5, posição (14,12), grupo e vitais idênticos.
- Primeiro desfecho de Tinta: Cenas permanece bloqueada mesmo com os objetivos completos, até assistir ao desfecho no Diário. Continuar começa desabilitado; fica disponível após o fim, mantendo o motor em `cutscene` até o clique explícito. Depois, a memória está liberada e a recompensa continua pendente no Diário.
- Recebimento real na sessão de QA: saldo 4.800 Cristais antes de receber os 5 tiros; 5.600 depois do recebimento único. O Diário passa a mostrar Recompensa recebida. Abrir e fechar um novo replay mantém 5.600 e restaura foco em Cenas.
- A tentativa de viewport 390×844 pela capacidade do navegador integrado não foi aplicada: o viewport efetivo continuou 1280×720. O override foi removido, e as capturas dessa tentativa foram renomeadas como desktop. Não se declara um teste manual de celular a partir delas. As regras responsivas foram revisadas no código, mas uma reprodução real em celular permanece fora da cobertura desta sessão.
- Nenhuma falha de mídia ocorreu nos cinco filmes finais. Falha/retry/watchdog e eventos atrasados foram exercitados na suíte do player; não se induziu uma falha artificial na sessão principal.

Capturas: biblioteca bloqueada e liberada, cinco replays/desfechos, e primeiro desfecho com Continuar bloqueado/habilitado. Os arquivos ficam junto deste relatório.

## Gates técnicos

| Verificação | Resultado |
| --- | --- |
| MP4 reais + lifecycle do player | PASS — 1.710 verificações |
| Replay/motor/página | PASS — 785 verificações |
| Trinta missões e recebimento único | PASS — 2.575 verificações |
| Proveniência histórica v31 | PASS — 2.574 verificações |
| Atalhos 1–5/Tab | PASS — 250 verificações |
| TypeScript | PASS — exit 0 |
| Build Vinext/Vite | PASS — cinco etapas, exit 0 |
| Mídia incorporada ao build | 5 MP4 e 5 JPG com SHA-256 idêntico à fonte final |

Os relatórios por filme demonstram24fps nativos,1.104quadros distintos,46s no conjunto, ausência de áudio e pixels preservados por remux. A revisão de anatomia foi feita por amostragem distribuída e está documentada em [visual-review-summary.md](visual-review-summary.md); não é uma certificação individual de cada quadro.
