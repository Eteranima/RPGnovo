# Revisão integrada na interface — v38

11/10/2026, origem local de produção `http://127.0.0.1:5175/`. As ações abaixo usaram os controles públicos do jogo e caminhada real do mapa. Não houve edição de armazenamento oculto para completar atividades.

## Mecânicas e prêmios

- O convite do ato I libera os três jogos em Eventos e Convocar antes de concluir o capítulo. O menu Recompensas exibiu o atalho para o prêmio concluído.
- Enigma: uma ordem incorreta indicou relações violadas sem perda de recursos. Limpar conservou as pistas; a solução pelas pistas concluiu o jogo. Recarregar antes do resgate preservou conclusão e prêmio pendente. Receber removeu o botão de resgate.
- Compasso: iniciar e não responder perdeu os cinco sinais, com mensagem de retry sem custo. Por etapas aceitou cinco respostas explícitas na ordem e liberou o mesmo prêmio. Som permaneceu desligado.
- Arena, tentativa 1: Prego/Escriba/Geada, troca da retaguarda por Circuito, Investida. A dupla elétrica foi anunciada; cada prova começou com HP completo. Vitórias reais nas três provas, com registros de 12, 24 e 31 movimentos. Na prova final, Prego terminou com 0 HP, Escriba com 8 e Circuito com 4; os três ecos com 0.
- Arena, tentativa 2: Prego/Brasa/Arquivista, duas trocas na frente (Sombra, depois Escriba), Equilíbrio. Venceu as duas primeiras e perdeu a terceira em oito ciclos. Os aliados terminaram com 0 HP; Juramento com 12/42 e Última Hora com 24/24. A conclusão anterior e seus prêmios recebidos permaneceram registrados; a derrota não cobrou recursos.
- Os três resgates de 160 cristais e o bônus de 320 foram confirmados pelos botões públicos. O Arquivo exibiu 2.240 cristais após esses resgates. Não foi realizada invocação nesta prova. As primeiras vitórias concedem 800 cristais adicionais no total; as flags de resgate único são verificadas pelo gate do motor.
- HP, MP, carga, líder e grupo da campanha ficaram iguais durante os jogos emprestados: Seiji 166/166 e85/85, Ophelia133/133 e127/127, Marin147/147 e104/104, Gabriel189/189 e71/71, Abel165/180 e121/129; todas as ultimates100.

## Combate e escala

Na produção intermediária `a616bb9e8040b4d8fe89`, palco de197px em844×390, documento844×390 sem overflow. O corpo de Abel, excluindo cajado/capa, mediu97,60px; Seiji/Ophelia/Marin tiveram crops de93/97/97px. Os pés e o corpo ficaram dentro da faixa. A evidência substituiu a captura anterior com Abel excessivamente grande: `../qa-v36/abel-battle-mobile.jpg`.

O primeiro carregamento frio de arte de combate falhou; o botão Tentar novamente recuperou a cena e os comandos. Esse caso motivou a investigação de carregamento concorrente. O relatório final deve distinguir a recuperação observada das melhorias verificadas depois.

## Escopo da prova

Esta rodada funcional ocorreu antes do último acabamento visual e da redução das pistas a quatro. A resposta por semente foi mantida; provas antigas continuam válidas. A revisão visual do último build, dimensões portrait e recarga final serão registradas abaixo. Os gates de relógio/replay não comprovam FPS ou instalação em aparelhos físicos. A percepção de diversão será avaliada em partidas com jogadores; não foi inferida apenas de vitórias.

## Interface e atualização observadas — revisão 090a

- O navegador inicialmente continuou no shell a616. Sistema mostrou **Salvar e atualizar**; o botão salvou e recarregou a página normalmente. A nova página carregou `index.CsI69JP_.css` / `page.Dt0olaFn.css`, com duas molduras nativas no título. Não foi removido cache nem Service Worker por ferramentas externas.
- Continuar retomou Clareira da Pira, os cinco integrantes, Abel como líder e os mesmos HP/MP/cargas. Eventos conservou as três recompensas e o bônus recebidos, sem novos botões de resgate. Som continuou desligado.
- O enigma concluído antigo foi aceito e mostrou as quatro pistas finais: centro, dois pares imediatamente adjacentes e precedência. A resposta pela semente foi preservada.
- Arena retomou a derrota real registrada. **Ver resultado** exibiu os HP finais corretos, oito ciclos e dois ecos sobreviventes. **Rever resolução** voltou ao HP inicial; Próximo movimento mostrou o controle de Shin registrado. Rostos nativos carregaram sem falhas. A captura `event-arena-browser.jpg` foi substituída pelo novo acabamento, com salão visível e moldura nativa.
- O menu ficou dentro do documento em 1310×572, 844×390 e 405×452, sem overflow horizontal da página. Na tela vertical curta, seu cabeçalho consumia espaço excessivo e motivou um ajuste específico; a verificação desse ajuste será registrada na próxima seção.
- A caminhada real até Cinder e **Pular cena** abriram o primeiro combate da revisão nova. As artes terminaram de carregar sem erro e sem Tentar novamente. Os comandos ficaram habilitados; o dataset de falhas estava vazio.
- Combate: em 405×452, palco de167px e corpo de Abel46,83px; em844×390, palco197px, corpo97,60px e rodapé40px; em1310×572, palco379px, corpo151,49px e rodapé40px. Largura do documento igual à viewport nos três casos. Cinco integrantes e oito posições de turno ficaram dentro da tela. A captura `../qa-v36/abel-battle-mobile.jpg` foi substituída pela revisão nova.
- Marin e Seiji guardaram; o primeiro golpe inimigo aconteceu antes de Ophelia, causou11 em Seiji protegido, preservou13HP e elevou a carga do chefe a12%. A ordem mostrada correspondeu à execução.

São provas locais no navegador integrado, não instalação física de PWA nem medida de FPS/memória em Android ou iPhone.

## Acabamento final — revisão 49e9

A última revisão, `49e9e9f991b84866a6aa`, mudou somente a compactação visual dos menus verticais curtos. Build terminou com exit0; o HTTP do SW compilado passou nas61 verificações. **Procurar atualização → Salvar e atualizar**, no Sistema da tela inicial, recarregou normalmente para `index.B1p20_eK.css` / `page.Dt0olaFn.css`. Continuar preservou o grupo, o líder, vitais, cargas, som desligado, 2.240 cristais, cinco fichas e os resgates do baile.

Em405×452, o cabeçalho passou a64px, recursos40px, navegação52px (botões40px), fechar44×44px e conteúdo196,80px, praticamente o dobro da área anterior. A descrição do grupo permanece disponível para leitores de tela. O documento continuou com405px de largura. [Captura vertical](menu-portrait-browser.jpg).

Grupo e Convocar conservaram suas identidades, versões e recursos; nenhum giro foi realizado. A Mesa permitiu abrir um novo ensaio livre com Ophelia/Max/Gabriel, retratos finais, aros próprios, cores elementais e regras visíveis, sem imagens quebradas nem overflow em1310×572. [Ofertas finais](event-draft-browser.jpg). Voltar às atividades cancelou a sessão parcial e conservou os prêmios já recebidos. A viewport temporária foi removida e o jogo ficou no salão, sem relógio ou batalha ativos.

Antes da compactação exclusiva dos menus, a revisão090a também mostrou as oito habilidades de Abel em grade4×2 em405×452: cada botão95,25×32px, todos dentro de x6..399 e y324..392, acima do rodapé60px. A tecla5 selecionou Abel como alvo aliado e manteve seu turno. Recarregar retornou ao save de exploração anterior à batalha; isso não foi descrito como persistência de combate em andamento.
