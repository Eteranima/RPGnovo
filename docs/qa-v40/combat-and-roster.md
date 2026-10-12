# Circuito dos Despertos — catálogo e combate v40

Revisão: 12 de outubro de 2026, horário de Brasília. Implementação isolada em `autoChessCatalogV40.ts` e `autoChessCombatV40.ts`; a liga e o roteamento de diários ficam em `autoChessLeagueV40.ts` e `autoChessRuntime.ts`.

## Expansão com função estratégica

O catálogo tem 31 IDs, com 6 / 7 / 7 / 7 / 4 tipos nos custos 1 / 2 / 3 / 4 / 5. As funções têm seis Guardiões, nove Duelistas, nove Arcanistas e sete unidades de Amparo. A reserva tem 515 cópias: 132 / 140 / 119 / 84 / 40 por custo. Capacidade, banco, ouro, juros, forja e orçamento de 800 cristais permanecem com as regras do Circuito.

Os oito inimigos já existem em `data.ts` e `expansionV30.ts`. Seus elementos são os de `ENEMY_ULTIMATES_V30`, e as referências visuais finais ficam em `enemyArtV30.ts` e `public/assets/v30/enemies/`. Não foram inventadas identidades ou transformados inimigos em outro elemento para preencher o catálogo.

| Peça | Custo | Elemento / função | Mecânica própria |
| --- | ---: | --- | --- |
| Vigia Rúnico | 1 | Tinta / Guardião | Escudo no aliado próximo; intercepta 35% de um golpe direto por até 2 s. O vínculo operacional Anti magia corresponde à interdição da Página Vazia. |
| Mariposa do Véu | 2 | Gelo / Arcanista | Dano de área e retirada de até 15 de mana dos inimigos atingidos. |
| Lobo de Cinzas | 2 | Fogo / Duelista | Persegue o mais ferido por até dois passos livres; dano físico, execução moderada e redução de cura por 2 s. |
| Cervo da Geada Lunar | 3 | Gelo / Duelista | Dano físico, empurrão para casa livre e avanço. Resistência de 3 s a outro deslocamento. |
| O Selo Quebrado | 3 | Tinta / Arcanista | Rompe 45% do escudo, com teto de 80% do poder por alvo; depois causa dano mágico de área. |
| Eco do Selo | 5 | Trevas / Amparo | Extrai um aliado ferido para uma casa livre estritamente mais distante do inimigo mais próximo; cura e escudo continuam no lugar se não houver destino melhor. |
| A Chama que Lembra | 5 | Fogo / Arcanista | Pira em uma área fixa por 3 s. O dano periódico atinge quem permanece nela; cada conjurador mantém somente sua última pira. |
| Guardião do Astrolábio | 5 | Eletricidade / Arcanista | Ciclo de três conjurações: golpe e escudo, golpe encadeado e convergência em área. |

Existem 17 famílias de habilidade utilizadas, incluindo oito novas. Terra e Água ganham acesso mais cedo pela revisão das formas alternativas de Ava e Beatriz para custo 4. O orçamento de atributos foi reduzido: Ava tem 1.120 HP, 76 ataque, 45 armadura e 310 poder; Beatriz tem 900 HP, 67 ataque, 28 armadura e 320 poder. Não houve simples desconto de preço com atributos de custo 5.

A loja continua escolhendo primeiro o custo e depois o tipo, ponderado pelas cópias restantes. As probabilidades por nível foram mantidas nesta revisão. O catálogo maior dilui a chance de encontrar um tipo específico dentro de cada custo; a mudança de Ava e Beatriz para custo 4 torna suas formas disponíveis a partir do nível 5, em vez do nível 7. Os testes de ligas completas abaixo verificam compras e melhorias sob essa distribuição real.

## Ajustes transparentes de combate

Os primeiros confrontos de investimento igual mostraram que quatro Arcanistas sem proteção adequada perdiam todas as seis lutas contra cada uma das três formações de referência. Também havia pouca margem para lançar novas habilidades antes do colapso da frente. O v40 limita o dano periódico de Fogo a 2,5% / 3,5% do HP máximo por segundo, em vez de 3% / 5%, e concede 3 / 6 mana adicionais por ataque aos Arcanistas ativos. O poder de habilidade de 30% / 60%, a penetração de 25% / 50% e a redução de cura por queimadura foram preservados. Os mesmos cálculos valem para jogador e rivais.

O Eco inicialmente curava apenas 234 HP base, pouco acima dos 220 de Mika de custo 3, enquanto exigia 95 de mana. A revisão focal usa 390 de poder e 85 de mana: 273 de cura e aproximadamente 137 de escudo antes dos multiplicadores. O deslocamento continua condicionado a um destino melhor, e não revive nem evita dano de forma absoluta. Nas formações tardias de referência, a equipe mista passou de uma para seis vitórias em dezoito confrontos, com derrotas e contrajogo preservados.

Os módulos v39 de catálogo e combate permanecem separados. O roteamento conserva esses cálculos para diários antigos; adicionar peças ao v40 não reconstrói lojas ou pagamentos antigos com o catálogo novo.

## Eventos e reprodução

Posições, HP, mana e escudos continuam no formato de eventos do Circuito. `move.actor` sempre identifica quem realmente se move: vítima em `knockback`, aliado em `rescue` e atacante em `charge` ou caminhada. Interceptação produz dano real no Guardião e mana recebida por esse dano.

`intercept-ready`, `hunt-wound`, `displace-resist` e `pyre-zone` são durações em passos de 100 ms. `intercept` indica porcentagem; `shield-break` indica HP de escudo removido; `orbit` indica estágio 1 / 2 / 3. `mana-drain` registra valor negativo de mana. O dano periódico da pira usa `pyre`, separado do marcador `pyre-zone`, com fonte e elemento Fogo corretos.

## Validação executada

`node tests/auto-chess-combat-v40.test.mjs` passou **7.641 verificações**: catálogo e elementos canônicos, redução do orçamento das alternativas, kits reais, determinismo, reconstrução dos estados finais pelo registro, células livres, deslocamento resistente, resgate seguro, mana de Arcanistas e preservação da mana v39, pira com área e prazo, três órbitas, formação densa 8 × 8 e 72 confrontos de investimento igual. A formação densa levou aproximadamente 38 ms de CPU nesta execução; isso não mede FPS do navegador nem celular físico.

As formações de cinco peças gastam dez de ouro na loja; as de oito peças gastam 21. Todas usam duas estrelas e quatro componentes representados por duas receitas. Três sementes são testadas em ambas as orientações. São casos controlados de combate, não diários naturais de liga.

| Confronto | Cinco peças: vitórias A / B | Oito peças: vitórias A / B |
| --- | ---: | ---: |
| Magia × Fogo | 3 / 3 | 4 / 2 |
| Magia × Terra | 1 / 5 | 3 / 3 |
| Magia × Mista | 6 / 0 | 5 / 1 |
| Fogo × Terra | 3 / 3 | 0 / 6 |
| Fogo × Mista | 4 / 2 | 4 / 2 |
| Terra × Mista | 4 / 2 | 3 / 3 |

Cada composição tem vitórias e derrotas nas duas capacidades. Isso demonstra contrajogo nos casos exercitados; não estabelece uma distribuição de vitórias de 50% nem prova equilíbrio entre todas as composições.

`node tests/auto-chess-balance-v40.test.mjs --short` passou **2.236 verificações** em doze ligas completas. As políticas realizam compras, XP, posicionamento, retirada de componentes, forja e equipamento por comandos reais. A política de magia busca quatro Arcanistas quando tem nível e unidades para proteger a frente. Equipamentos vão para funções compatíveis com seus atributos, evitando entregar automaticamente um orbe ao primeiro Guardião com vínculo de Tinta. As verificações conservam a reserva e exatamente os componentes recebidos em armarias por jogador e rivais.

| Política | Colocações nas sementes 2 / 23 / 77 | Entre os quatro primeiros | Campeã |
| --- | --- | ---: | ---: |
| Fogo / Duelista | 2 / 1 / 4 | 3 / 3 | 1 / 3 |
| Terra / Guardião | 3 / 2 / 2 | 3 / 3 | 0 / 3 |
| Magia protegida | 4 / 1 / 6 | 2 / 3 | 1 / 3 |
| Trevas / Amparo e equipe mista | 5 / 4 / 5 | 1 / 3 | 0 / 3 |

As ligas terminaram entre as rodadas 13 e 20. O diário máximo teve 158 comandos; o pacote com comprovantes teve 8.749 bytes. O relatório reproduzível é [balance-simulation.json](balance-simulation.json). A política mista ainda foi a mais fraca nesta pequena amostra; merece acompanhamento com jogadores, sem apresentar as quatro políticas como igualmente competitivas.

Esta validação de núcleo não substitui inspeção visual das oito artes novas, recortes, direções, efeitos e interface no navegador.
