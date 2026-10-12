# Autobatalha de Éter Anima

O novo modo deve sustentar uma partida completa: comprar peças, administrar ouro, desenvolver a equipe, posicionar unidades e acompanhar combates automáticos com efeitos próprios. A proposta abaixo substitui o enigma, o compasso e a arena curta do baile por um circuito independente de autobatalha. Os números de balanceamento são valores iniciais propostos para Éter Anima, sujeitos à simulação e à validação no jogo.

Pesquisa consultada em 11 de outubro de 2026. O modo usa o universo e as artes de Éter Anima. As referências servem para entender sistemas; nomes, personagens, interfaces e assets de outros jogos não integram o produto.

## O que as referências estabelecem

| Referência primária | Evidência útil | Aplicação proposta |
| --- | --- | --- |
| [Riot What is Teamfight Tactics](https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/what-is-teamfight-tactics/), maio de 2021 | O ciclo combina seleção de unidades de uma reserva, administração de ouro, itens, formação da equipe e combate automático. | Tratar economia e posicionamento como sistemas principais, com opções de construir e adaptar uma composição. |
| [Dragonest Game Introduction](https://ac.dragonest.com/en/gameIntroduction) | Auto Chess explica a combinação de três cópias para melhorar estrelas e sinergias de diferentes peças que compartilham classe ou origem. | Combinar cópias, contar tipos distintos nas sinergias e apresentar o próximo patamar na interface. |
| [Riot patch 13.23](https://teamfighttactics.leagueoflegends.com/en-gb/news/game-updates/teamfight-tactics-patch-13-23-notes/), novembro de 2023 | A reserva compartilhada acrescenta decisões sobre disputa de peças, observação de adversários e momento de atualizar a loja; as probabilidades por nível favorecem estratégias diferentes. | Mostrar chances e disponibilidade real. Tornar a troca de estratégia viável quando uma peça está escassa. |
| [Riot patch 16.1](https://teamfighttactics.leagueoflegends.com/en-gb/news/game-updates/teamfight-tactics-patch-16-1/), dezembro de 2025 | Ofertas de loja reservam cópias temporariamente; unidades vendidas voltam à reserva. Desbloqueios adicionais introduzem regras próprias. | Preservar a contabilidade das cópias e começar com todo o catálogo acessível, sem desbloqueios ocultos durante a partida. |
| [Valve Jull tide changelog](https://store.steampowered.com/news/posts/?appids=1046930&enddate=1578596239&feed=steam_community_announcements), dezembro de 2019 | Valve adotou começo no nível 3, limite de três de juros e qualidade dos itens independente de vencer ou perder aquela rodada. | Acelerar a abertura e oferecer armarias em intervalos previsíveis, sem agravar uma derrota negando equipamentos. |
| [Riot Galaxies Learnings](https://teamfighttactics.leagueoflegends.com/en-us/news/dev/dev-teamfight-tactics-galaxies-learnings/), agosto de 2020 | Componentes de itens permitem mais escolha que itens prontos aleatórios, que podem prender o jogador em uma composição. | Disponibilizar componentes e prévia das combinações antes de equipar. |
| [Dragonest Item mechanism](https://ac.dragonest.com/en/news/detail/ea294a4af9a), dezembro de 2020 | Dragonest reduziu a variação na quantidade de itens e descreveu como posicionamento e tipo de dano influenciam encontros com monstros. | Garantir oportunidades de equipamento e fazer rodadas especiais terem contrajogo visível. |
| [Riot Rise of the Elements Learnings](https://teamfighttactics.leagueoflegends.com/en-us/news/dev/dev-tft-rise-of-the-elements-learnings/), fevereiro de 2020 | Alvos aleatórios em controle de alvo único fizeram combates parecerem uma rolagem de dados. A equipe procurou alvos mais previsíveis e contramedidas graduais. | Fixar prioridades de alvo, tornar alcance e área visíveis e evitar imunidades que anulem uma composição inteira. |
| [Riot Reckoning Learnings](https://teamfighttactics.leagueoflegends.com/en-us/news/dev/dev-teamfight-tactics-reckoning-learnings/), outubro de 2021 | Hyper Roll reduziu a duração média para cerca de vinte minutos, mas não simplificou necessariamente o aprendizado: decisões sucessivas sem pausa tornaram o modo agitado. | Preparação sem cronômetro, início manual do combate e ajuda contextual curta. Duração reduzida não substitui clareza. |
| [Riot Magic n Mayhem Learnings](https://teamfighttactics.leagueoflegends.com/en-us/news/dev/dev-tft-magic-n-mayhem-learnings/), novembro de 2024 | Riot informou treze milhões de horas em Tocker's Trials nos primeiros vinte dias e valorizou o PvE sem cronômetro como ambiente de aprendizado. | Priorizar um circuito solo com tempo para ler e experimentar. Horas totais indicam uso expressivo daquele modo; não são uma taxa de aprovação nem uma previsão para Éter Anima. |
| [Riot Cyber City Learnings](https://teamfighttactics.leagueoflegends.com/en-gb/news/dev/dev-tft-cyber-city-learnings/), julho de 2025 | Escolhas com autonomia receberam avaliações positivas nas pesquisas internas; inflação sem uma decisão interessante funcionou pior. A variação excessiva de itens também atrapalhou planos. | Dar escolhas de equipamentos com quantidade garantida e conter a soma de bônus de ouro, loot e poder. |
| [Riot K O Coliseum Learnings](https://teamfighttactics.leagueoflegends.com/en-us/news/dev/dev-tft-ko-coliseum-learnings/), outubro de 2025 | Papéis claros ajudaram jogadores menos experientes a entender unidades e equipamentos. A cerimônia de classificação entre os quatro melhores recebeu avaliações positivas. Regras invisíveis e combinações excessivas também elevaram o custo de entendimento e de testes. | Destacar função e itens compatíveis, celebrar uma boa colocação e manter regras inspecionáveis. Reservar tempo para testar interações. |
| [Valve Dota Underlords na Steam](https://store.steampowered.com/app/1046930/Dota_Underlords/) | A página oficial apresenta modos solo, IA com quatro dificuldades e pausa e retomada. Na consulta, 84% de 33.525 avaliações em inglês e 71% de 78 avaliações recentes foram positivas. | Pausar e retomar uma partida solo é parte do produto. As avaliações são daquele jogo e da amostra mostrada, não de uma mecânica isolada nem do nosso público. |

As fontes dão suporte a um ciclo de estratégia com preparação, adaptação e aprendizado. Elas não demonstram que qualquer combinação nova será divertida por si só. A diversão em Éter Anima depende da qualidade das opções, dos resultados que o jogador consegue interpretar e da execução visual.

## Escopo de produção proposto

O primeiro lançamento deve entregar uma liga offline com um jogador e sete rivais de IA, HP de liga, eliminações e colocação final. A equipe começa pequena e chega a oito peças. Cada rodada inclui preparação completa, combate automático e um resultado que explica o dano, a cura e os efeitos determinantes. O jogador pode sair e retomar entre rodadas sem consumir recursos do RPG. Uma prática guiada curta apresenta os comandos antes da liga, e permanece opcional para jogadores experientes.

Um catálogo de vinte e três peças permite usar os dez personagens base, as oito formas do evento e os cinco companheiros. Cada peça tem ataque básico, uma habilidade automática própria, custo, dois vínculos de sinergia, alcance e papel claros. Formas alternativas são entradas distintas: não se combinam com a forma base. Custo na loja e estrela de melhoria pertencem à partida; não são a raridade do Gacha.

O conteúdo inicial inclui elementos e quatro funções com patamares alcançáveis pelo catálogo, cinco componentes de equipamentos e quinze receitas, incluindo pares do mesmo componente. Armarias previsíveis permitem escolher componentes. O catálogo deve sustentar pelo menos quatro planos de equipe: investir em peças baratas melhoradas, crescer para peças caras, proteger uma unidade de dano principal e misturar sinergias menores.

Os sete rivais usam as mesmas regras de loja, ouro, XP, reserva, combinação, equipamento e combate. Cada IA pode ter uma preferência de composição e diferentes critérios de compra; nenhuma recebe cópias, níveis ou bônus de atributos fora dessas operações. O adversário não muda escondido para derrotar a composição do jogador. A inspeção mostra equipe, banco, ouro, nível, itens e vínculos reais de todos os rivais.

A liga exige simular lojas, banco, venda, experiência, pareamento e eliminação de todos os rivais. As compras de IA usam uma ordem rotativa por rodada para não privilegiar sempre o primeiro participante na reserva. Trinta rodadas são um limite de duração proposto: a escalada final e a regra de classificação devem aparecer nas regras e no HUD. Não apresentar IA local como pessoas conectadas. As partidas entre rivais usam o mesmo simulador que a partida visível.

O pareamento evita repetir o último adversário quando há alternativa. Com número ímpar de sobreviventes, uma equipe espelho permite jogar a rodada: seu resultado só afeta quem enfrenta o espelho e não concede renda ou dano duplicado ao dono da equipe copiada. A origem do espelho é visível. Eliminações na mesma rodada têm desempate publicado por HP antes da rodada, depois vitórias e, persistindo igualdade, colocação empatada. Não usar uma prioridade oculta para favorecer o humano. Antes de persistir uma rodada, resolver todos os combates e aplicar rendas e eliminações uma única vez.

## Loja e economia propostas

| Sistema | Valor inicial | Informação visível |
| --- | --- | --- |
| Ouro inicial | 5 | Saldo e preço em cada oferta |
| Loja | 5 ofertas | Nome, custo, estrela atual, vínculos e cópias possuídas |
| Atualização manual | 2 de ouro | Custo antes de confirmar |
| Atualização por rodada | Gratuita, se a loja não estiver travada | Estado do cadeado persistido |
| Renda base | 5 por rodada concluída | Demonstrativo da próxima renda |
| Juros | 1 a cada 10 guardados, limite de 3 | Patamares de 10, 20 e 30 |
| Vitória | 1 adicional | Demonstrativo separado |
| Série de vitórias ou derrotas | 1 a partir de 3, 2 a partir de 5 | Sequência atual e próximo patamar |
| Experiência comprada | 4 de ouro por 4 XP | XP até o próximo nível e capacidade resultante |
| XP passiva | 2 por rodada concluída | Demonstrativo da progressão |
| Nível inicial e máximo | 3 até 8 | Capacidade de peças igual ao nível |
| Banco | 9 espaços | Espaços ocupados e combinação disponível |

Experiência adicional para passar dos níveis 3 a 8: 4, 8, 12, 20 e 28 XP. Essa curva precisa ser verificada com a duração da liga; comprar níveis deve competir de verdade com atualizar a loja e melhorar peças.

Probabilidades propostas por oferta, com os custos 1 a 5 em cada linha:

| Nível | Custo 1 | Custo 2 | Custo 3 | Custo 4 | Custo 5 |
| --- | --- | --- | --- | --- | --- |
| 3 | 70% | 25% | 5% | 0% | 0% |
| 4 | 55% | 30% | 15% | 0% | 0% |
| 5 | 45% | 30% | 20% | 5% | 0% |
| 6 | 30% | 35% | 25% | 10% | 0% |
| 7 | 20% | 30% | 30% | 18% | 2% |
| 8 | 15% | 20% | 30% | 30% | 5% |

Na liga, a reserva é compartilhada de verdade entre os oito participantes. Quantidades iniciais por peça podem ser 22, 20, 17, 12 e 10, conforme o custo. Uma oferta reserva uma cópia; atualizar devolve ofertas não compradas; comprar transfere a cópia para seu participante; vender devolve todas as cópias contidas numa peça melhorada. Eliminar um participante devolve suas peças e libera sua loja. Em cada momento, cópias disponíveis, reservadas em lojas e possuídas devem somar o total inicial.

Três cópias de uma mesma peça e estrela se combinam automaticamente. A melhoria preserva a posição da peça que já estiver no tabuleiro e devolve equipamentos excedentes ao inventário. Uma compra que libera espaço pela combinação deve funcionar mesmo com o banco cheio. Toda operação deve ser atômica: uma recusa por espaço ou saldo não altera ouro, reserva, equipamentos ou peças.

Para favorecer adaptação no circuito solo, a venda pode devolver o investimento completo em ouro. Essa regra deve ser explícita e não gerar renda extra ao combinar e vender. Não usar bônus aleatórios invisíveis para compensar lojas ruins. A primeira loja pode ser uma abertura ensinável com três peças de custo 1 e papéis complementares, claramente parte do começo da partida.

## Tabuleiro e combate propostos

Um tabuleiro de oito por oito casas permite quatro linhas de preparação de cada lado e espaço para movimento. A preparação aceita arrastar e também selecionar uma peça e tocar uma casa. O teclado move a seleção por setas, Enter confirma e Escape cancela. Banco, loja e inventário devem continuar disponíveis em celular sem exigir um gesto preciso.

O combate usa passos fixos de simulação, independentes da taxa de desenho. Em cada passo, unidades prontas procuram alvo, movem, atacam ou lançam a habilidade. O resultado não muda quando o jogador acelera a reprodução, oculta a aba ou prefere menos movimento.

Regras de alvo propostas:

- Ataque básico procura a unidade inimiga alcançável mais próxima. Empates usam uma ordem estável das casas e identificadores, sem favorecer sempre o mesmo lado.
- A unidade conserva um alvo vivo enquanto consegue persegui-lo; não troca a cada quadro.
- Curadores procuram o aliado com menor percentual de HP dentro do alcance.
- Saltos contra a retaguarda escolhem um alvo pela regra indicada na descrição. A casa de chegada aparece antes do início.
- Ataques em linha, cone e área mostram sua geometria. Alcance é medido em casas e não em pixels.
- Controle e redução da mesma família não acumulam até imobilização permanente. O efeito mais forte permanece pela duração restante; chefes podem reduzir a duração de controle, sem ignorar completamente toda a composição.

HP, mana, escudos e efeitos temporários voltam ao estado inicial em cada combate. Evolução de estrelas e equipamentos permanecem na partida. Como início de balanceamento, melhorias podem usar multiplicadores de HP e dano de 1, 1,7 e 2,9; habilidades têm escalas próprias declaradas. Não aplicar multiplicadores de estrela simultaneamente em vários locais.

Após um limite de duração, uma escalada visível reduz cura e aumenta dano de ambos os lados. Se ambos ainda sobreviverem ao limite absoluto, o empate compara a soma das proporções de HP vivo por equipe; igualdade real é empate. O resultado e o limite devem estar descritos nas regras. Um empate não pode virar vitória pelo lado do jogador nem por uma ordem acidental de processamento.

O personagem do RPG, sua experiência, HP, MP, itens e ouro permanecem fora da simulação. Peças são representações do elenco oferecidas a todos dentro do modo, sem exigir recrutamento no Gacha. Prêmios do circuito usam comprovante de conclusão persistido e uma concessão única; recarregar ou reproduzir uma batalha não concede novamente.

## Sinergias e equipamentos propostos

Contar apenas tipos de peça distintos no tabuleiro. Duas cópias de uma mesma entrada podem lutar juntas, mas não dão dois pontos de vínculo. O banco não ativa bônus. Mostrar contagem atual, próximos patamares e efeito numérico. Elementos preservam a identidade do elenco; funções podem ser Guardião, Duelista, Arcanista e Amparo. Cada elemento precisa de quantidade suficiente de peças para seus patamares reais. Não anunciar um patamar que o catálogo não consegue formar.

Cada bônus deve modificar uma regra perceptível: Terra oferece escudo na abertura; Gelo desacelera após uma habilidade; Fogo aplica queimadura; Escuridão facilita acesso à retaguarda; Tinta recupera mana; Eletricidade encadeia dano com limite de saltos. Água, Sangue e Anti magia precisam de regras próprias correspondentes ao elenco. Funções influenciam proteção, cadência de ataque, poder de habilidade e recuperação. Usar patamares de 2, 3 ou 4 conforme a quantidade real de peças, com valores moderados, mantendo equipes mistas e equipes focadas competitivas.

Equipamentos podem usar lâmina, orbe, manto, núcleo e selo como componentes, todos com artes próprias. Cinco componentes geram quinze receitas não ordenadas quando pares iguais também são permitidos. Cada peça aceita até três equipamentos. Exemplos: lâmina e núcleo favorecem ataques básicos; orbe e selo favorecem habilidade; manto e núcleo sustentam a linha de frente. Anti cura e redução de resistência funcionam como contramedidas graduais.

Antes de combinar, a interface mostra receita, efeito e portador. O equipamento pode ser removido na preparação solo sem custo; durante o combate as decisões ficam travadas. Vender ou combinar uma peça não pode apagar um item. Equipamentos não dependem de um resultado aleatório de vitória para existir: armarias oferecem escolhas nas mesmas rodadas em todas as partidas.

## Apresentação e aprendizado

O palco deve ocupar a maior área. Na preparação, ouro, nível, capacidade e adversário ficam em uma linha; loja e banco ocupam faixas compactas. Sinergias podem ser recolhidas e o inventário aberto em um painel curto. No combate, recolher a loja e priorizar peças, barras pequenas, projéteis e áreas de efeito. Nenhuma ultimate deve interromper o tabuleiro com uma sequência longa para cada unidade.

Cada peça precisa de silhueta anime coerente, base ou sombra discreta, retrato de loja e ataque e habilidade identificáveis. Todas as formas, inclusive companheiros, mantêm seus visuais aprovados. Efeitos devem corresponder ao elemento. Aprimorar estrelas usa brilho e transição curtos, com a opção de movimento reduzido. Cores de equipe, foco, mana e efeitos recebem símbolos ou texto além da cor.

O primeiro circuito introduz uma ação útil por vez: comprar, colocar, combinar, ler uma sinergia, equipar e administrar juros. A ajuda aparece perto da ação correspondente, pode ser recolhida e não interrompe uma escolha já feita. Prévia do inimigo destaca sua ameaça e uma resposta possível, sem garantir que a compra sugerida vencerá. Um glossário compacto e receitas permanecem disponíveis durante a preparação sem cronômetro.

Permitir reprodução normal, acelerada, pausa e consulta ao resultado. O resumo mostra dano, cura, escudos, sobreviventes e gatilhos de sinergia. O jogador deve conseguir entender por que perdeu e modificar posição, peças ou itens. O som respeita a preferência global já salva e nunca volta por iniciar outra rodada.

## Validação necessária para lançar

| Risco concreto | Verificação necessária |
| --- | --- |
| Ouro ou cópias duplicados | Conservação da reserva, preços, juros, combinação, venda, loja travada e operações recusadas |
| Dificuldade sem contrajogo | IA usa o mesmo ouro, XP, reserva e combate; pelo menos quatro planos de equipe viáveis e inspeção antes do combate |
| Pareamento ou classificação incorreta | Quantidades pares e ímpares de sobreviventes, equipe espelho, eliminação simultânea e desempate publicado |
| Resultados diferentes por dispositivo | Mesma semente e ações produzem mesmo resultado em reprodução normal, rápida, aba oculta e retomada |
| Movimento travado | Casas ocupadas, caminhos bloqueados, alcance, troca de alvo e final de combate sem unidades presas |
| Controle infinito ou cura interminável | Limites de efeitos, escalada de tempo e empate reproduzível |
| Prêmios repetidos | Concluir, recarregar, reabrir, reproduzir e retomar sem concessão dupla |
| Saves antigos prejudicados | Migração dos comprovantes antigos, preservação dos prêmios já recebidos e exclusão dos jogos antigos somente da interface |
| Arte ilegível ou pesada | Inspeção de todas as peças e efeitos, carregamento por rodada e validação no tamanho de celular |
| Interface ocupa o tabuleiro | Conferir PC, celular vertical e horizontal; nenhuma rolagem lateral da página ou sobreposição de peças, loja e banco |
| Aprendizado cansativo | Uma primeira partida observada com jogadores novos, medindo onde procuram ajuda e se conseguem explicar suas escolhas |

Os jogos antigos podem sair da navegação, mas comprovantes e recompensas existentes precisam continuar válidos. A substituição não deve tirar cristais já ganhos nem transformar um save antigo em erro. O lançamento só deve anunciar mecanismos, artes e persistência efetivamente integrados e verificados.
