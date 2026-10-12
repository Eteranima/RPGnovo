# Circuito dos Despertos — defesa física e mágica

Revisão: 12 de outubro de 2026, horário de Brasília.

A auditoria encontrou descrições mais amplas que o comportamento publicado do simulador: Anti magia e as proteções Catedral de Inverno e Guarda da Alvorada diziam reduzir dano de habilidade, embora habilidades físicas de Abel e Orfeu fossem reduzidas somente pela armadura. O catálogo e o Guia agora declaram redução de **dano mágico**. Isso inclui habilidades mágicas, queimadura e o encadeamento elétrico de ataques básicos.

A regra de combate permanece a mesma: armadura reduz dano físico e mágico; Anti magia concede 25% de proteção mágica a Orfeu e sua forma alternativa quando o vínculo está ativo; os equipamentos de proteção concedem 15%. Os dois tipos de proteção se somam. Repetir equipamentos soma seus atributos, mas não duplica o passivo de proteção.

Não foram alterados o simulador, atributos, probabilidades, comandos ou recompensas. As correções são de texto e os novos testes registram o comportamento existente. Diários v39 mantêm seus resultados e não precisam de migração para esta correção.

`node tests/auto-chess-defense-v39.test.mjs` passou **57 verificações**. As formações isolam golpes de abertura, com alvos adjacentes e mana inicial suficiente para lançar a habilidade no instante zero. Manto Guardião e Catedral de Inverno têm os mesmos atributos de HP e armadura, permitindo medir a proteção mágica adicional do equipamento. Essas formações são casos controlados de combate e não são apresentadas como ligas naturais.

| Habilidade de abertura | Sem proteção | Anti magia ativo | Manto Guardião | Catedral de Inverno | Catedral + Anti magia |
| --- | ---: | ---: | ---: | ---: | ---: |
| Orfeu · Palma de Interdição, física | 167 | 167 | 149 | 149 | 149 |
| Abel · Mandíbula do Leão, física | 175 | 175 | 156 | 156 | 156 |
| Seiji · Interdição de Shin, mágica | 115 | 86 | 103 | 87 | 62 |

As verificações também cobrem ataques físicos básicos, a ausência de acúmulo do passivo e os efeitos mágicos fora das habilidades diretas:

| Efeito | Sem proteção | Anti magia ativo | Manto Guardião | Catedral de Inverno |
| --- | ---: | ---: | ---: | ---: |
| Primeiro dano periódico de queimadura | 19 | 14 | 19 | 16 |
| Primeiro encadeamento elétrico de ataque básico | 7 | 5 | 7 | 6 |

Os valores de dano consideram a armadura do alvo e o arredondamento do simulador. O equipamento usado no controle de queimadura também aumenta HP máximo; por isso a comparação da proteção do equipamento deve usar a coluna Manto Guardião, que tem o mesmo HP e a mesma armadura.
