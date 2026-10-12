# Combate v37 — cadência fixa por encontro

Data: 11/10/2026. Repositório: `C:\Users\Diego\OneDrive\Documentos\GitHub\RPGnovo`.

## O problema corrigido

A fila anterior colocava todos os aliados e uma única ação inimiga em ordem de velocidade. Um grupo de cinco personagens rápidos podia usar cinco técnicas/ultimates antes da primeira resposta. A nova fila distribui as ações inimigas ao longo da rodada, mantendo uma ação por aliado vivo.

HP, dano, velocidade, kit, recompensas e quantidade de ações do inimigo são definidos pelo encontro e pela dificuldade. **Entrar sozinho, em dupla ou com cinco não enfraquece nem fortalece esse encontro.** Com menos aliados, o inimigo também executa as ações restantes, inclusive consecutivas.

## Regras para o jogador

| Encontro | Ações inimigas por rodada | Limite de aliados seguidos |
| --- | ---: | ---: |
| Mobs e duelos de recrutamento | 2 | 3 |
| Selo Quebrado, chefe introdutório | 2 | 3 |
| Último Eco, Chama que Lembra e Observador Astral | 3 | 2 |
| Exercício gratuito de guarda | 1 | Exercício termina ao executar a guarda |

Esses orçamentos valem nos três modos. Normal, Desafiante e Extremo conservam seus multiplicadores anteriores de HP/dano/recompensa; a cadência não acrescenta outro multiplicador à dificuldade.

- A velocidade preserva a ordem dos aliados e a iniciativa do inimigo, limitada para interromper sequências longas. Aliados mortos não recebem turnos, mas sua ausência não reduz as ações inimigas.
- Somente a primeira ação inimiga da rodada pode usar o padrão normal de técnica/ataque em área. As reações restantes são golpes comuns. Uma ultimate já carregada continua podendo substituir uma dessas ações.
- Os alvos de golpes individuais rotacionam pelas ações inimigas entre os aliados vivos. O inimigo não repete automaticamente o mesmo alvo só porque ainda está na mesma rodada.
- Guarda dura até o próximo turno próprio do personagem. Ela também protege contra reações adicionais dentro desse intervalo; usar uma poção ou outra técnica continua gastando a ação do herói.
- Congelamento/prisão consomem uma ação inimiga e continuam limitados a uma imobilização por batalha. A ação seguinte permanece na fila. Silêncio, cegueira e sangramento contam ações reais, não rodadas inteiras: controlar uma janela não apaga as demais.
- A previsão continua indicando dano condicionado a acerto, alvo, guarda, elemento e controle. Cegueira mantém 50% de chance de erro; a previsão não sorteia nem promete um acerto. Durante uma animação, mostra a intenção capturada daquela ação até sua recuperação terminar.

Uma criatura inicial com 130–155 HP pode continuar morrendo para uma ou duas ultimates de um grupo muito mais avançado. Isso é progressão natural. A correção não aumenta HP automaticamente para obrigar uma criatura derrotada a agir.

## Carga e fases

A carga antiga de `34 + 8 × (fase − 1)` por rodada é repartida pelas ações inimigas. Em fase 1, duas ações recebem 17/17; três recebem 12/11/11. Não há três incrementos completos de 34 nem três Colapsos na mesma rodada.

Uma ação impedida por controle não ganha sua parcela de carga. Ultimate consome a carga normalmente. A transição de fase mantém o bônus separado de 25, uma única vez. O contrato legado da fase é preservado: a avaliação acontece no início do ator, antes de seu sangramento; se o tick cruzar um limite, a fase muda no ator seguinte. Previsão e execução usam a mesma regra, com regressões dos dois limiares.

## Tuning centralizado e consumidores

- `lib/game/combatCadenceV37.ts`: perfis por tipo/dificuldade, exceções explícitas por encontro/família, construção da fila, ordinal de ação e divisão da carga. A consulta do perfil não recebe quantidade de aliados ou HP do grupo. Perfis normais precisam comportar cinco aliados dentro do limite de sequência; o gate executa as filas completas para conferir isso.
- `lib/game/engine.ts`: captura o perfil no início da batalha, executa a fila e conserva o gate de artes, impacto/recuperação e velocidade 1×/2×. A fila tem no máximo oito entradas; uma ação concluída continua sendo gasta uma única vez.
- `lib/game/combatPlanningV32.ts`: usa a mesma fila para prever a próxima rodada. `actionInRound`, `actionsPerRound`, `reaction` e `maxAlliedBurst` descrevem a janela real, inclusive no chefe introdutório com duas ações.
- Saves e preferências mantêm seus formatos. Perfil, fila e ordinal são estado de batalha; não são adicionados ao progresso salvo. Gacha, cinematics, odds, árvores e arts não foram alterados por este ajuste.

Também foi corrigido o log de sangramento: usa o nome real/equipado do herói, em vez de chamar Max, Abel e outros integrantes de Ophelia.

## Evidência executada

| Gate | Resultado | Cobertura |
| --- | ---: | --- |
| `combat-cadence-v37` | PASS · 14.149 | Dez famílias × três dificuldades × grupos 1/2/5, três rodadas reais, stats/orçamentos iguais, iniciativa, morte de aliados, guarda, controles, cegueira, carga/fases, previsão/impacto/round wrap e save |
| `game.test` | PASS · 1.064 | Capítulo completo com a dupla original nível 1, sem convocação/XP forçado e sem alterar o teste ou sua estratégia |
| `combat-planning-v32` | PASS · 9.270 | Resolver real, dano/controle, RNG, fase/sangramento legado, readiness e timers 1×/2× |
| `enemy-v30` | PASS · 4.494 | Elementos, ataques/ultimates reais, contato, fases, geometria e recompensas |
| `abel-playable-v36` | PASS · 626 | Sete habilidades, ultimate, carga/fila, recrutamento, save e ícones |
| `origins` | PASS · 202 | Cinco origens solo, navegação, recrutamento, grupo e save |
| `quests-v31` | PASS · 2.575 | Trinta missões, exercício de guarda, continuidade e recompensa única |
| `party-hotkeys-v30` | PASS · 250 | Slots, vitais, ordem e isolamento dos alvos da batalha |

O caso de cinco ultimates com nível 10 contra Cinder real mostrou a primeira resposta depois de **duas ultimates aliadas**, nos três modos: 520/676/858 HP e 24/29/34 de dano base. Esses valores são iguais com um, dois ou cinco personagens. Traços dos encontros estão em `combat-cadence-test.txt`.

O Selo foi inicialmente testado com três ações e a dupla básica perdeu antes de concluir o capítulo. A exceção fixa de duas ações resolveu esse onboarding e o replay original voltou a passar, sem redução de HP/dano, sem fortalecer os heróis e sem consulta ao tamanho do grupo.

### Ajustes legítimos de fixtures

`origins.test.mjs` passou a exigir exatamente um turno aliado e dois inimigos no mob solo, em vez da antiga fila de duas entradas. `quests-v31.test.mjs` continua a partida na instância real retomada, em vez de copiar seu estado para um motor antigo com baseline de save desatualizada. A proteção entre abas rejeitava a escrita desse handoff artificial; a assert de recompensa única foi preservada. Os demais gates listados passaram sem alteração de expectativas.

Os testes usam comandos e timers do motor, sem remover derrota, guarda, custos ou recompensa única para obter aprovação. As três rodadas comparativas usam os atributos canônicos de nível 10 e guarda para medir o orçamento completo; não são uma medição de dificuldade percebida, mediana de derrotas ou garantia de vencer toda área sozinho. Build/TypeScript e QA final de interface desta revisão ficam com a raiz; este relatório não confirma publicação, commit ou push.

### Execução observada no navegador

A raiz executou Cinder normal com cinco integrantes: a fila mostrou oito posições, com três janelas inimigas intercaladas. Na rodada de guarda, as três respostas atingiram Seiji, Ophelia e Marin, com11 de dano protegido e carga12→23→34%. Na revisão090a, o primeiro carregamento terminou sem retry; Marin e Seiji guardaram e o inimigo agiu antes de Ophelia, exatamente como a previsão. A interface preservou palco197px/rodapé40px em844×390, palco379px/rodapé40px em1310×572 e palco167px em405×452, sem overflow horizontal. Isso confirma o fluxo observado; o alcance nos três níveis de dificuldade e nos grupos1/2/5 está no gate do motor.
