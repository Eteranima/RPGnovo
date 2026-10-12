# Lua de Sangue v38 — três ensaios jogáveis

Data: 11/10/2026. Repositório: `C:\Users\Diego\OneDrive\Documentos\GitHub\RPGnovo`.

## Acesso e prêmios

Aceitar o convite de **Lua de Sangue — O Baile dos Cinco Selos** libera os três ensaios, em Eventos ou Convocar. Não é necessário concluir o capítulo, possuir versões 5★, recrutar professores ou gastar recursos. Os atos I/II permanecem separados; suas etapas, garantias e recompensas não foram modificadas.

| Ensaio | Prêmio único |
| --- | ---: |
| O Enigma dos Cinco Selos | 160 cristais · 1 tiro |
| O Compasso de Vajra | 160 cristais · 1 tiro |
| A Mesa das Máscaras | 160 cristais · 1 tiro |
| Completar os três ensaios | 320 cristais · 2 tiros |

Total adicional: **800 cristais, equivalentes a cinco tiros reais**. Receber o prêmio exige o botão explícito de recebimento. Repetir, perder, fechar o painel ou recarregar não paga novamente. Cada tentativa é gratuita; não há aposta nem custo oculto. Os prêmios usam a moeda existente de convocação, sem alterar odds/pity ou garantir uma raridade.

## Enigma dos Cinco Selos

Shin e Umbra preservam uma ordem para os selos de Página, Flor, Vigília, Pena e Prego. Há cinco posições. Colocar um selo já usado troca suas posições; o tabuleiro nunca acumula duplicatas.

Cada tentativa gera uma ordem determinística e **quatro pistas irredundantes**: posição central, dois pares de vizinhança orientada e uma precedência. A vizinhança usa o enunciado explícito **imediatamente à esquerda**. O gerador confere as 120 permutações possíveis e remove uma pista se a solução continuar única sem ela. Retirar qualquer uma das quatro pistas restantes deixa mais de uma solução. A interface recebe as pistas, não a resposta; a lista anterior de 13 linhas foi reduzida sem alterar a ordem da mesma semente ou invalidar tabuleiros/provas salvos.

**Verificar** testa o tabuleiro completo e aponta pistas violadas. Um tabuleiro incompleto não conta como conclusão; um erro pode ser corrigido. **Limpar** conserva as pistas; **Nova tentativa** traz outra semente sem apagar o histórico do prêmio recebido.

## Compasso de Vajra

Cinco sinais visuais representam Shin, Mika, Umbra, Dante e Vajra. O relógio é `performance.now()` no motor, com cues em 1.200, 2.300, 3.700, 4.900 e 6.400 ms. A janela de acerto é ±250 ms; até ±90 ms é um acerto central. Quatro dos cinco sinais bastam para completar.

Cada cue aceita uma tentativa na ordem. Um input repetido para o mesmo cue é rejeitado; um toque fora da janela é consumido como erro. O rAF visual lê o mesmo relógio e informa cues perdidos; ele não concede acertos ou prêmios automaticamente. A execução funciona nos clocks testados de 30/60/120 FPS, sem depender do som.

A auditoria encontrou e corrigiu um contrato incompatível: o produtor aceitava offsets de pausas longas, enquanto o save rejeitava valores além de 100.000 ms. Agora produtor e validador compartilham um limite numérico seguro, reservado para a aritmética dos cues. Quatro acertos legítimos seguidos de um quinto sinal perdido após 110.000 ms ou sete dias continuam sendo uma conclusão válida, persistente e premiada uma vez. O sinal atrasado permanece erro; o limite não o transforma em acerto. Valores não finitos são rejeitados.

A alternativa **por etapas** exige cinco respostas explícitas na ordem, sem limite de tempo, e oferece o mesmo prêmio. Serve também para movimento reduzido. Cancelar, ocultar/desmontar a UI ou trocar a sessão invalida seus callbacks. Um save parcial não contém relógio absoluto: ao retomar, o ensaio fica interrompido e pode ser reiniciado ou feito por etapas. A atividade nunca ativa áudio ou muda a preferência de mute.

## Mesa das Máscaras

O salão empresta dez cartas: dois papéis de cada família Seiji/Ophelia/Marin/Gabriel/Max. Elas usam as faces finais das versões do Baile e as identidades dos cinco companheiros. Não é necessário possuí-las no Gacha; terminar o ensaio não recruta/equipa uma versão ou modifica o deck da campanha.

1. Faça três escolhas reais, cada uma entre três ofertas visíveis.
2. Organize frente, meio e retaguarda. Mover uma carta troca as posições.
3. Examine o plano inimigo e selecione Equilíbrio, Investida ou Guarda.
4. Use até duas trocas gratuitas por tentativa, se desejar.
5. Resolva a prova, leia os ataques/cura/controle e confirme a próxima preparação. São três provas; perder encerra a tentativa, que pode ser refeita gratuitamente.

Cada prova restaura as cartas emprestadas antes de iniciar seu confronto. A escolha de posições/postura pode mudar entre provas; as duas trocas são compartilhadas pela tentativa inteira. A resolução é determinística, com ataques por velocidade, alvos de frente/retaguarda/área, armadura, barreira, cura, interrupção e perfuração. Não existe um sorteio oculto de vitória. Após oito ciclos sem vitória, a preparação perde, evitando combate infinito.

### Escolhas e sinergias

| Dupla elemental | Efeito real |
| --- | --- |
| Duas cartas de Tinta | Mais uma magia inimiga interrompida |
| Duas de Gelo | Quatro de barreira para cada aliado ao iniciar |
| Duas de Trevas | Atacar restaura dois HP próprios |
| Duas de Fogo | +2 de ataque para o grupo |
| Duas de Eletricidade | Dois de dano encadeado ao segundo alvo |

Os papéis das cartas oferecem counters distintos: Escriba interrompe a primeira magia; Arquivista reduz dano mágico recebido; Orvalho cura; Geada concede barreira à frente; Sombra alcança a retaguarda; Vigília se sustenta por dano; Brasa resiste a golpes físicos; Juramento protege o grupo quando está à frente; Prego perfura a armadura e alcança a retaguarda; Circuito reduz o ataque das cartas mágicas. Sem alvo mágico, Circuito não anuncia um debuff inventado.

Investida aumenta o ataque e o dano recebido; Guarda reduz o ataque e o dano recebido; Equilíbrio conserva os valores. As três provas mostram seus planos antes da resolução: marcha física, escrita coletiva e acorde final misto. Posicionar a mesma composição de outra forma pode transformar uma vitória em derrota. Nenhuma derrota custa cristais, itens ou HP dos personagens da campanha.

## API e integridade

`eventActivitiesV38()` retorna estado normalizado, sessão, pistas, ofertas/mercado, plano inimigo, sinergias e resultado real. `pendingRewards` conta prêmios desses ensaios disponíveis, incluindo o bônus; atos I/II mantêm contadores separados.

- Entrada/saída: `beginEventActivityV38`, `cancelEventActivityV38`, `retryEventActivityV38`.
- Enigma: `puzzlePlaceSealV38`, `resetSealPuzzleV38`, `submitSealPuzzleV38`.
- Ritmo: `startEventRhythmV38`, `hitEventRhythmV38`, `tickEventRhythmV38`. `elapsedMs` vem do relógio privado. O token de sessão rejeita handlers/rAF de tentativas antigas.
- Mesa: `draftArenaCardV38`, `positionArenaCardV38`, `tradeArenaCardV38`, `setArenaStanceV38`, `resolveEventArenaRoundV38`, `continueEventArenaV38`.
- Prêmios: `claimEventActivityV38(kind|'board')`.

O motor não escreve a pausa controlada pela Page: a própria sessão bloqueia movimento, atalhos de líder e convocações. Cancelar limpa sessão/entrada/relógio e preserva a decisão de pausa atual da UI. Batalha, Gacha, cinema, loja e conflito de save impedem iniciar/alterar os ensaios.

Estado, provas de conclusão e flags de recebimento são persistentes. Sessão e relógio ficam fora do save. A normalização verifica os tabuleiros, os hits e as três resoluções vencedoras, descartando campos novos inválidos sem rejeitar a campanha antiga ou pagar recompensas. Falha na gravação do prêmio reverte cristais e claim; o conflito entre abas impede sobrescrever progresso novo.

As cartas não alteram vitais, skills, roster, versões equipadas, quest30, pity, contagem de convocações nem os atos. Vitórias da mesa não são vitórias de encontros da campanha.

## Gates executados

| Gate | Resultado |
| --- | ---: |
| `event-activities-v38` | PASS · 1.345 |
| `game.test` | PASS · 1.064 |
| `gacha-v30` | PASS · 1.231 |
| `quests-v31` | PASS · 2.575 |
| `pwa-save-v36` | PASS · 90 |

O gate novo executa os métodos reais do motor: três tentativas completas de enigma, resposta inválida/feedback/limpeza/retry, ritmo por relógio nativo e alternativa acessível, spam/misses/cancelamento/token/recarga, draft legal/trocas/posições/posturas, vitória e derrota reais, normalização/save, prêmio único/bônus, busy/pausa/movimento e rollback/conflito. O refinamento das pistas cobre separadamente 66 sementes entre as 120 ordens: quatro pistas, solução única, ausência de redundância, três tipos de regra, enunciados distintos e determinísticos. Três provas salvas da versão com 13 pistas mantêm a mesma solução e a flag de prêmio recebido.

Duas composições diferentes vencem as três provas: a dupla de Fogo com Seiji e a dupla elétrica com Seiji. Composição ou posição ruim pode perder. As três sementes testadas têm rotas legais de vitória usando as ofertas reais; nenhuma recompensa foi concedida por uma vitória simulada fora do motor.

### Rotas de prova, para QA

- Tentativa 1: escolher Prego, Escriba, Geada; trocar o slot 2 por Circuito; posições Prego/Escriba/Circuito; Investida. Usa uma troca e vence as três provas.
- Tentativa 2: escolher Prego, Brasa, Circuito; posições Brasa/Prego/Circuito; Guarda. Não usa troca.
- Tentativa 3: escolher Brasa, Escriba, Arquivista; mesma ordem; Investida. Não usa troca.

Rotas legais que perdem a terceira prova, para conferir derrota/retry na interface:

- Tentativa 1: escolher Prego/Escriba/Geada; trocar o slot 0 por Circuito, depois por Sombra; manter Sombra/Escriba/Geada e Equilíbrio. Vence as duas primeiras e perde a terceira. Essa derrota foi executada pelos métodos reais no gate.
- Tentativa 2: escolher Prego/Brasa/Arquivista; trocar o slot 0 por Sombra, depois por Escriba; manter Escriba/Brasa/Arquivista e Equilíbrio. A resolução determinística vence as duas primeiras e perde a terceira; rota disponível para conferência semântica no navegador.

Relatório: `event-activities-test.txt`. Não foi necessário alterar os asserts legados para obter esses resultados. A UI realiza o replay dos eventos já resolvidos, sem reaplicar dano. TypeScript/build e QA final no navegador desta revisão ficam com a raiz; este registro não confirma publicação, commit ou push, nem afirma que todas as composições são equivalentes ou vencedoras.
