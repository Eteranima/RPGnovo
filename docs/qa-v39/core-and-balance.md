# Circuito dos Despertos — regras e validação do núcleo

Revisão: 11 de outubro de 2026, horário de Brasília. Implementação em `lib/game/autoChessCatalogV39.ts`, `autoChessCombatV39.ts`, `autoChessLeagueV39.ts` e `autoChessProgressV39.ts`. Pesquisa e justificativas de desenho: [autobattler-research.md](autobattler-research.md).

## Partida implementada

O circuito é uma liga local com um jogador e sete adversários de IA. Cada adversário tem loja, ouro, experiência, unidades, banco, inventário, equipamentos, vida da liga, sequência e classificação próprios. As equipes, inclusive as partidas entre IAs, passam pelo mesmo simulador. Os nomes são personagens de IA, não pessoas conectadas.

- 23 peças: dez personagens base, oito personagens alternativos e os cinco companheiros Shin, Mika, Umbra, Dante e Vajra. Nenhuma exige propriedade ou recrutamento no RPG.
- Tabuleiro quadrado 8 × 8; as quatro linhas inferiores recebem a formação do jogador. Banco de nove unidades, capacidade de combate igual ao nível e limite de oito unidades.
- Loja de cinco ofertas, reserva finita compartilhada, atualização por dois de ouro, cadeado persistente e atualização gratuita entre rodadas quando destravada.
- Nível inicial 3, máximo 8; quatro de ouro compram quatro XP; dois XP passivos por rodada. Custos adicionais de nível: 4, 8, 12, 20 e 28 XP.
- Cinco de ouro inicial e de renda base, juros até três, vitória de mais um e sequências até dois. As rendas são concedidas uma única vez na resolução da rodada.
- As três primeiras ofertas da primeira loja são uma abertura declarada de Seiji, Gabriel e Ophelia; todos os participantes recebem a mesma regra. As outras ofertas e lojas seguintes seguem sorteio reproduzível pela semente. Probabilidade escolhe primeiro o custo, depois uma peça daquele custo ponderada pelas cópias restantes. Custos totalmente esgotados têm suas probabilidades redistribuídas entre os custos ainda possíveis.
- Três cópias da mesma peça e estrela promovem uma unidade; nove cópias produzem três estrelas. Base e versão alternativa têm identificadores distintos e não se combinam. O multiplicador 1 / 1,7 / 2,9 é aplicado uma única vez ao HP e ao dano base.
- Venda devolve o investimento completo e todas as cópias à reserva. A combinação preserva uma unidade já posicionada e devolve equipamentos excedentes ao inventário. Comprar e combinar com o banco cheio é permitido quando a operação libera espaço. Operações recusadas não gastam recursos.
- Cinco componentes, quinze receitas não ordenadas, três equipamentos por unidade, inventário de trinta itens. Armarias oferecem escolha livre de um componente na abertura e depois a cada três rodadas, independentemente de vitória. Remover equipamentos na preparação é gratuito. Atributos de itens somam; efeitos passivos iguais não acumulam.

Sinergias contam tipos distintos que estão no tabuleiro. Cópias repetidas e peças no banco não acrescentam contagem. Todos os patamares publicados são alcançáveis pelo catálogo. Beatriz mantém seus vínculos de Água e Trevas. Sangue é a característica única de Carmilla, com patamar de uma peça; não há um requisito impossível de quatro Carmillas distintas.

## Combate e classificação

A simulação usa passos fixos de 100 ms e tem trajetória, alcance em casas, alvo persistente, caminho por casas livres, ataques, mana, habilidades, escudos, cura, morte e efeitos reais. O registro contém os estados iniciais e finais e cada evento com momento, ator, alvo, posição, vida, mana, escudo e elemento. A reprodução não executa o combate novamente e não entrega recompensas.

Ataques básicos concedem dez de mana; dano recebido concede quatro mais uma parcela do dano, limitada a quinze. Equipamentos e Tinta podem aumentar a recuperação. HP, mana, escudos e estados reiniciam a cada luta; estrelas e itens permanecem na liga. Armadura reduz ataques e habilidades; Anti magia e o efeito de proteção de equipamento reduzem adicionalmente o dano de habilidade.

Silêncio dura 1,2 segundo e raiz dura um segundo. A mesma família de controle só pode ser aplicada novamente depois de três segundos, impedindo renovação contínua. O Manto da Página Livre reduz a duração pela metade. Queimaduras reduzem cura em 40%, têm fonte de dano correta, elemento Fogo e expiram; uma queimadura mais fraca não mantém a potência de uma queimadura anterior já terminada.

A escalada começa aos 35 segundos, com dano multiplicado por 1,75 e cura reduzida pela metade para ambos os lados. O limite absoluto é 43 segundos. Se ambos ainda sobreviverem, compara-se a soma das proporções de HP das unidades vivas; igualdade é empate. Um empate não é convertido em vitória do jogador.

Nas ligas novas, o pareamento busca uma combinação completa que evite o último adversário de cada participante quando existe solução. Se não existir, minimiza os participantes que repetem confronto. Com sobreviventes em número ímpar, uma equipe espelho é identificada: somente quem enfrenta o espelho pode perder vida ou receber renda daquele confronto. O dono da formação copiada recebe somente o resultado de sua partida real.

Eliminações simultâneas ordenam HP antes da rodada, depois vitórias. Igualdade nos dois critérios compartilha a colocação; o identificador só organiza a apresentação. A liga termina ao eliminar o jogador, ao restar uma equipe ou no limite publicado de trinta rodadas. No limite, HP da liga e vitórias classificam os sobreviventes, com empate real preservado.

## Persistência e orçamento de recompensa

O progresso continua no save versão 2 do RPG, em um campo separado. Uma partida guarda semente, versão do pareamento e até 2.500 comandos canônicos. A leitura valida comandos e reconstrói lojas, reserva, renda, estrelas, equipamentos, adversários e resultados: não aceita campos de vitória, HP ou saldo fornecidos pelo arquivo. Dados inválidos do modo novo são isolados sem rejeitar um save válido da campanha.

`pairingVersion: 2` identifica as novas ligas com busca completa. Diários e comprovantes anteriores sem esse campo são normalizados para `pairingVersion: 1` e continuam usando exatamente o pareamento anterior, com seus resultados, renda e eliminações. Retomar preserva a versão; reiniciar arquiva os comprovantes anteriores e cria uma liga v2. As caches separam as duas versões. Versões desconhecidas são rejeitadas. A migração não reinterpreta pagamentos passados.

O estado validado é reutilizado por identidade e por uma pequena cache de registros já validados. Compras e movimento aplicam somente o comando novo; renderizar a interface não reconstrói a liga. A cópia feita ao continuar o RPG reutiliza uma validação já realizada, evitando uma segunda reconstrução completa durante a mesma abertura. Combates anteriores são imutáveis e não são copiados em cada compra.

O total do circuito permanece em **800 cristais**. Marcos novos: disputar uma rodada, ativar duas sinergias, terminar entre os quatro primeiros e conquistar o primeiro lugar. Os pagamentos anteriores são descontados desse mesmo orçamento, incluindo parcelas de um marco quando necessário. Pagamentos novos têm valores persistidos; não são recalculados como se já não tivessem ocorrido.

Comprovantes antigos não são apagados. Uma ação genérica recebe todos os prêmios anteriores válidos e pendentes em uma única gravação; os modos antigos saem da navegação. Prêmios novos aguardam essa concessão para não consumir o orçamento que já era devido. Recarregar, retomar, rever o combate, reabrir e iniciar outra liga não repetem pagamentos. Falha de armazenamento e conflito com outra aba recusam e revertem alterações de progresso e moeda.

Enquanto o circuito está aberto, movimento, troca de líder, Gacha, equipamento, lojas, aulas, viagens e cenas do RPG ficam bloqueados. O relógio do mundo não movimenta patrulhas ou expira técnicas durante a partida. Sair fecha somente a sessão; a liga e seus comprovantes permanecem salvos. A atualização da PWA e a exportação aguardam esse estado seguro. O áudio usa a trilha de combate existente e respeita a preferência global de som desligado.

## Resultados executados

| Verificação | Resultado |
| --- | --- |
| `tests/auto-chess-v39.test.mjs` | 367 verificações: catálogo, receitas, reserva, combinação com banco cheio, itens, movimento, mana, habilidades, estados, migração e versões de pareamento, prêmio único, concessão anterior, falha de armazenamento, conflito entre abas, espelho e limite de rodadas. |
| `tests/event-activities-v38.test.mjs` | 1.345 verificações de compatibilidade do núcleo e dos comprovantes históricos. Esses jogos não voltam à navegação. |
| `tests/auto-chess-balance-v39.test.mjs` | 1.831 verificações em 24 ligas completas, quatro políticas e seis sementes por política. |
| `tests/auto-chess-performance-v39.test.mjs` | 12.508 verificações de resolução, formação densa, limite do diário e reutilização da validação. |

As simulações de política terminaram entre as rodadas 9 e 19, com máximo de 167 comandos. Um registro completo com comprovantes ocupou cerca de 10 KiB, abaixo do limite de 2 MiB da transferência. A fronteira de trinta rodadas foi exercitada separadamente como situação interna de teste; não é apresentada como uma liga natural observada.

| Política | Entre quatro primeiros | Campeã |
| --- | --- | --- |
| Peças baratas melhoradas, Fogo e Duelista | 6 / 6 | 2 / 6 |
| Crescimento, Terra e Guardião | 6 / 6 | 2 / 6 |
| Magia com linha de frente protegendo os conjuradores | 2 / 6 | 0 / 6 |
| Equipe mista de Trevas, Amparo, guardas e duelistas | 3 / 6 | 0 / 6 |

Esses resultados mostram caminhos jogáveis e diferenças que merecem acompanhamento. A amostra é pequena e as políticas são programas de compra e posicionamento, não jogadores humanos. Não medem diversão, aceitação do público ou uma distribuição equilibrada de vitória entre todas as composições. Na primeira revisão, equipes sem proteção de frente e com compra tardia de níveis perderam de forma recorrente; as políticas foram corrigidas para representar decisões estratégicas reais, sem aumentar atributos do jogador.

Os tempos de CPU constam em [core-performance.json](core-performance.json). No computador desta revisão, quatro combates comuns levaram aproximadamente 89–440 ms, uma formação de teste com quatro combates 8 × 8 levou cerca de 318 ms, e uma validação inédita de 2.499 comandos levou aproximadamente 3,15 s. Dez mil consultas do registro já validado levaram cerca de 7,35 ms. Uma reconstrução inédita de liga completa levou cerca de 2,9 s na execução registrada. Houve outras verificações em paralelo; estes números não são FPS do navegador nem medições em celular físico.

Detalhes reproduzíveis: [balance-simulation.json](balance-simulation.json) e [core-performance.json](core-performance.json). A inspeção das artes, dos recortes, da interface e da reprodução no navegador tem relatórios próprios; os testes deste documento não substituem essa verificação visual.

Para futuros balanceamentos, preserve as regras v39 que validam estes diários ou faça migração explícita para uma nova versão. Alterar retroativamente o simulador que comprova pagamentos antigos pode mudar um resultado passado e não deve invalidar cristais já recebidos.

## Revisão final da estratégia de equipamentos — 12 de outubro

A revisão independente encontrou uma limitação não capturada pelos primeiros testes: os rivais equipavam cada componente imediatamente e quase nunca tinham dois componentes no inventário ao mesmo tempo. A forja existia, mas não participava de sua estratégia.

A preparação da IA agora pode retirar um componente já equipado, combiná-lo com o próximo componente de armaria e reequipar a receita. Usa as mesmas operações de retirada, combinação e equipamento do jogador. Não recebe componente, ouro, espaço ou atributo adicional. `tests/auto-chess-ai-forge-v39.test.mjs` passou **238 verificações**: na rodada 1 há sete componentes e nenhuma receita; na rodada 4, os sete rivais têm sete receitas e nenhum componente sobrando; na rodada 7 preservam essas sete receitas e têm sete novos componentes. Cada receita representa exatamente duas armarias recebidas, com reserva, equipamentos e diário preservados. Detalhes: [ai-forge.json](ai-forge.json).

Uma rodada menor de balanceamento após essa mudança executou doze ligas, três sementes por política, com **937 verificações**. As políticas de magia e suporte foram aproximadas da linha de frente para não depender de escudos fora do alcance, sem alterar atributos ou regras.

| Política | Colocações nas três sementes | Entre os quatro primeiros |
| --- | --- | --- |
| Fogo / Duelista | 2, 1, 2 | 3 / 3 |
| Terra / Guardião | 1, 1, 2 | 3 / 3 |
| Magia com guardas | 7, 6, 5 | 0 / 3 |
| Equipe mista | 6, 6, 6 | 0 / 3 |

Esses números registram a avaliação anterior à correção de pareamento e de seleção de cópias descrita abaixo. O diário máximo dessas ligas teve 149 comandos e ocupou cerca de 8,7 KiB com comprovantes. Não há evidência suficiente para anunciar quatro composições igualmente competitivas. Parte das derrotas pode depender das heurísticas de compra, níveis, itens e composição dos programas de teste. A habilidade de forjar dos rivais foi corrigida sem esconder essa diferença por meio de bônus ao jogador.

## Revisão de pareamento e seleção de peças — 2026-10-12

A escolha gulosa de pares podia deixar os dois últimos participantes repetindo adversário apesar de existir uma combinação completa sem repetições. O pareamento v2 busca as combinações dos até oito participantes, considerando ambos os históricos e a escolha de quem enfrenta um espelho. A busca não consome sorteios adicionais e mantém uma partida real por sobrevivente, com apenas um espelho quando necessário. O v1 fica preservado para diários já existentes.

O programa de balanceamento ordenava as cópias da melhor para a pior, mas sua deduplicação por tipo substituía a primeira pela última. Agora preserva a melhor cópia: uma peça de duas estrelas não perde sua vaga para outra de uma estrela do mesmo tipo. Uma regressão específica valida esse caso. As novas simulações usam explicitamente o pareamento v2; os resultados anteriores não constituem uma comparação limpa de composições.

Armadura reduz ataques e habilidades; Anti magia e o efeito de proteção de equipamento reduzem adicionalmente o dano mágico, incluindo habilidades mágicas, queimadura e encadeamento elétrico. As habilidades físicas de Abel e Orfeu seguem somente a armadura. `tests/auto-chess-defense-v39.test.mjs` passou 57 verificações dessas distinções e da coerência dos textos.

`node tests/auto-chess-v39.test.mjs` passou **367 verificações**, incluindo a reprodução do pareamento legado, migração de diários sem versão, continuidade e arquivamento de comprovantes e preservação do pagamento anterior. `node tests/auto-chess-balance-v39.test.mjs --short` passou **983 verificações** em doze ligas completas, com as sementes 2, 23 e 77 para cada política.

| Política | Colocações nas sementes 2 / 23 / 77 | Entre os quatro primeiros | Campeões |
| --- | --- | --- | --- |
| Fogo / Duelista | 1, 4, 1 | 3 / 3 | 2 / 3 |
| Terra / Guardião | 2, 2, 3 | 3 / 3 | 0 / 3 |
| Magia com guardas | 5, 3, 4 | 2 / 3 | 0 / 3 |
| Equipe mista | 5, 4, 3 | 2 / 3 | 0 / 3 |

Os resultados atuais estão em [balance-simulation.json](balance-simulation.json). As ligas terminaram entre as rodadas 13 e 20; o diário máximo teve 142 comandos e o pacote com comprovantes ocupou 8.263 bytes. Corrigir a seleção das melhores cópias permite às políticas de magia e equipe mista alcançar o grupo dos quatro primeiros nesta amostra. As doze ligas não demonstram equilíbrio entre as composições nem substituem a validação com jogadores; a diferença anterior também continha um erro no programa de teste.
