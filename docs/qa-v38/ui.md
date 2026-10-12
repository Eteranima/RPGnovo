# Jogos da Lua de Sangue — interface

## Entrada e recompensas

As atividades aparecem no bloco Lua de Sangue de **Eventos** e de **Convocar**. O núcleo exige aceitar o convite do ato I; antes disso, a interface mostra o motivo do bloqueio. Não exige uma versão 5★, recrutamento, compra ou gasto de recursos.

Cada atividade concluída concede **160 cristais**, uma única vez. Concluir as três libera **320 cristais** adicionais: **800 cristais, equivalentes a cinco tiros**. São recompensas das novas atividades; os atos I e II mantêm suas regras próprias.

Pendências usam o helper do núcleo, com no máximo quatro resgates. Elas entram no badge de Aventura, no contador de Recompensas e no badge da seção Eventos. O card de Recompensas leva à seção Eventos. O resgate sempre chama o núcleo, que confirma a prova, grava o save e impede repetição; a UI não incrementa cristais.

## As três atividades

### O Enigma dos Cinco Selos

Escolha um selo e um dos cinco lugares. Selos já usados trocam de posição. As pistas ficam visíveis e o núcleo devolve quais relações ainda precisam ser revistas. **Limpar os lugares** conserva as pistas; **Novas pistas** inicia outro ensaio. Vitória e recompensa recebida têm estados distintos.

### O Compasso de Vajra

O compasso apresenta cinco sinais visuais, sem depender de ouvir áudio. **Por etapas** não possui limite de tempo e oferece a mesma recompensa. Quatro acertos concluem a prova no modo com tempo.

O relógio vem de `performance.now()` no núcleo. Um único rAF visual consulta esse relógio e registra sinais expirados pela API; não cria uma segunda simulação. Start/hit/tick recebem o token da sessão. Um callback antigo não pontua nem cancela uma nova tentativa. Tecla mantida não dispara uma sequência de respostas.

Ocultar a aba ou desmontar o painel interrompe o ensaio. Voltar às atividades preserva as provas e os prêmios já registrados. A UI não escreve `engine.paused`, não ativa som e não altera preferências de áudio.

### A Mesa das Máscaras

Três escolhas entre ofertas reais montam um trio de cartas emprestadas. O jogador pode ajustar **Frente, Centro e Retaguarda**, escolher postura e usar até duas trocas gratuitas por tentativa. Duplas elementais e o plano adversário ficam visíveis. Cada prova começa com HP completo.

O núcleo resolve três encontros determinísticos. A UI apresenta os movimentos já gravados, com retratos, barras e valores de HP registrados. Quem age e quem recebe a ação têm destaques distintos. Deslocamentos discretos acompanham ataques; os retratos caídos se apagam quando o HP gravado chega a zero, mantendo nomes e números legíveis. **Rever resolução**, **Próximo movimento** e **Ver resultado** não aplicam dano novamente. O resultado da reprodução aparece ao chegar ao fim; ela pode ser pausada ou avançada. Movimento reduzido desativa deslocamentos, transições e reprodução automática, preservando os controles por etapas.

Derrota usa uma indicação própria e informa os ciclos e quantos ecos adversários continuaram de pé, a partir do resultado real. A dica de preparação da prova permanece disponível. Oferece uma nova mesa gratuitamente; ela não consome HP, MP ou integrantes do Grupo. Vitória de treino não concede outra recompensa.

## Artes, leitura e navegação

- Ícones próprios dos cinco selos e rostos das cinco versões do evento são assets finais existentes. As cartas usam os aros exclusivos das famílias, com aberturas medidas: rosto visível de aproximadamente **64–72 px no PC** e **46–51 px no celular**. O texto ocupa uma área independente do aro.
- Cartas de Tinta usam fundo claro; Gelo, azul; Trevas, negro; Fogo, carmim; Eletricidade, âmbar. Fundos claros têm tinta escura, e os escuros mantêm texto claro. Esses temas não recolorem os sprites.
- Companheiros usam suas folhas nativas com a célula 0 e dimensões medidas; a UI não desenha a folha inteira como retrato.
- O salão final aparece no cabeçalho, no compasso e no palco de resolução. O cabeçalho concentra a proteção de contraste atrás do título; a resolução protege nomes, HP e legenda em placas próprias, deixando a arquitetura nativa visível. O destaque do sinal mantém essa imagem.
- Salão nativo: **1672×941**, SHA-256 `4d3aa3798fa425354ea8005171fb319c423a60473b423f3732a8d3184717ace7`, igual ao registro aprovado.
- Grades têm colunas limitadas à largura disponível; ofertas da arena passam a uma coluna no celular. A interface permite leitura vertical e não requer rolagem horizontal.
- Controles usam botões/selects nativos, rótulos completos, feedback anunciado e foco ao entrar/voltar. O jogador não depende de arrastar peças ou cartas.
- A atualização PWA fica desabilitada durante uma atividade. Voltar ao salão libera sua elegibilidade; a preparação de update não interrompe uma sessão silenciosamente.

## Gates e limites

**Source freeze da UI:** componentes/estilos, entrada Eventos/Convocar, descoberta de prêmios e guard PWA concluídos.

- `event-activities-ui-v38`: **275 verificações aprovadas**. SSR, callbacks reais, cinco selos, pistas/reset, compasso com/sem tempo, rAF e token antigos, formação legal com trocas e três vitórias, reprodução do HP gravado, native crops, hash/dimensões do salão, badges/rota e resgates únicos pelo save real. O delta cobre rostos/aros finais nas cinco identidades, ator/alvo e barras de HP de ataques, curas e controle registrados, pausa/avanço manual/movimento reduzido, queda em HP zero, resumo de derrota real e ausência de alteração no resultado ou no save durante o replay.
- `ui-session-v36`: **198 verificações aprovadas**, incluindo bloqueio de update por sessão ativa e retomada após saída explícita.
- O gate histórico da UI tinha 232 verificações; 275 é a versão atual com resolução ilustrada. O carregamento de combate usa o escopo correto de 509 verificações, além de 59 do produtor/fila; 549 é histórico e incluía 40 chaves Lycan não selecionadas. No caso humano de Cinder, 25URLs representam 55,62MiB transferidos e aproximadamente 150MiB RGBA, com seis imagens simultâneas e prazo de 15s após iniciar cada requisição. Isso não mede memória/FPS de aparelho físico. [Escopo e limites](battle-art-loading.md).
- TypeScript: **exit 0** após a integração final.
- Diff-check dos arquivos desta integração: sem erros.

Os testes de interface injetam o estado de hooks somente para acionar os handlers reais, mantendo o engine, as regras, o parser e a resolução de arena de produção. Isso não substitui a inspeção visual, os limites reais das telas nem a interação no navegador. O build final **49e9e9f991b84866a6aa** e seu HTTP61 passaram. A raiz verificou os três fluxos reais das atividades, sua persistência após as duas atualizações públicas, o combate nas três viewports e o menu compacto em 405×452: conteúdo de 196,80 px, fechar de 44×44 e sem overflow. O PC final em 1310×572 não apresentou overflow ou imagens quebradas. [Revisão do navegador](browser-review.md), [menu em retrato](menu-portrait-browser.jpg). Não houve pesquisa estruturada de usabilidade, diversão ou preferência com jogadores; a revisão técnica não comprova essas respostas nem desempenho de aparelhos físicos.

Não foram alterados por esta UI combate normal, formação, escalas dos atores, PWA service worker, campanhas, probabilidades de Gacha ou artes de personagens.
