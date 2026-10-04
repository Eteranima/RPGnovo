# Ecos que Escolhem — motor e autoria

## Conteúdo

O catálogo adiciona exatamente 30 missões, separado das dez missões anteriores: cinco longas, cinco médias, dez curtas e dez tutoriais. As cinco longas têm sete etapas, investigação em mais de um cenário, ações contextualizadas, uma decisão de destino e uma entrega final. O circuito de Max exige três contatos físicos em ordem entre a Vigília e o Observatório; ligações fora de ordem explicam o próximo contato e permitem corrigir o caminho. As demais histórias usam testemunhos cruzados, cuidados ambientais, enigmas baseados nas pistas, entregas consentidas e combates específicos. Não usam contadores retroativos de inimigos como substituto da narrativa.

O prêmio é o saldo real de invocação de personagens: 160 cristais por tiro. Longas pagam cinco tiros, médias três e as demais um, totalizando 60 tiros / 9.600 cristais. A conclusão e o recebimento são separados. O marcador `claimed` e o saldo são gravados juntos no mesmo save. As chances e garantias da invocação permanecem no motor original.

Todos os colaboradores narrativos podem participar sem estar recrutados ou no Grupo. Nenhuma missão exige obter um personagem no gacha. Todos os tutoriais abrem no estágio zero; os tutoriais de catálogo e invocação são concluídos pela leitura e interação, sem sorteio obrigatório. O exercício de guarda não usa itens, magias ou ultimate e não produz XP, créditos, fichas, equipamento ou mortes para conquistas. Guardar encerra o eco; vencer antes da guarda ou recuar permite repetir. HP, MP e carga de ultimate anteriores são restaurados ao fim, inclusive ao recuar.

## Persistência e compatibilidade

`Progression.questsV31` contém versão, missão rastreada e registros por ID. Cada registro guarda etapa, contadores vinculados aos objetivos definidos, decisões por ponto de interação, cena vista e recompensa recebida. Saves antigos sem esse campo migram para um registro vazio; seus recursos e pedidos anteriores são preservados. Registros malformados, etapas futuras sem os objetivos anteriores, escolhas desconhecidas, circuitos fora de ordem e prêmios marcados antes da cena são rejeitados. Etapas de missões só avançam depois de sua aceitação.

As escolhas finais das cinco longas permanecem no diário. O último ponto no cenário se torna uma memória consultável com a consequência escolhida, mesmo depois de receber o prêmio. Consultar a memória não reabre objetivos nem entrega recursos.

## Contrato de interface

- `questJournalV31()`: retorna `QuestJournalEntryV31[]`, com categoria, situação, etapa atual, objetivos, recompensas, escolhas e consequências.
- `startQuestV31(id)`, `trackQuestV31(id|null)`, `claimQuestV31(id)`: ações explícitas do diário.
- `Dialogue.questChoices`: opções `{id,label,detail}`; `chooseQuestV31(id)` valida a opção. Enter avança as falas, mas não escolhe uma resposta.
- `reportQuestTutorialV31(event)`: aceita apenas eventos reais das telas `journal-open`, `map-open`, `party-open`, `bag-open`, `gacha-preview`, `catalog-open`, `settings-open`. Abrir Configurações não exige ativar o som. Visualizar regras não chama uma invocação.
- `questEntitiesV31(...)` e `QUEST_SITES_V31`: fornecem os pontos dinâmicos e as coordenadas para mundo, minimapa e rastreamento. Artes por categoria: `quest_tutorial`, `quest_short`, `quest_medium`, `quest_long`.
- `Snapshot.questCinematic`: `{questId,caption}|null`. Durante a cena, o modo é `cutscene` e a cena antiga é nula. O novo overlay precisa ter prioridade e bloquear controles globais.
- `resumeQuestCinematic(id)`: retoma uma conclusão pendente após recarga. `finishQuestCinematic(skip=false)`: Continuar/Pular explícito registra a cena e libera o prêmio; callbacks repetidos são rejeitados.

Cada longa usa uma reprodução completa de 48 quadros: `long-tinta`, `long-geada`, `long-brasa`, `long-trovao`, `long-nulo`. Não há prêmio antes do encerramento explícito. Pular a cena não reduz recursos nem muda o final escolhido.

## Verificação

`tests/quests-v31.test.mjs` executa as interações e callbacks do motor: todas as etapas das 30 missões, tentativas erradas dos enigmas, finais alternativos, ataques e impactos reais nos combates contextuais, cena pendente em recarga, recompensa única antes/depois de salvar, migração antiga, registros inválidos, limites de distância e pausa, treino sem gasto/farm e bloqueio de origens não permitidas. Todos os 95 pontos foram medidos contra as colisões e caminhos reais de entrada dos cenários. Seis pontos inicialmente no exterior do cais foram reposicionados para áreas alcançáveis.

O relatório executável está em `quests-test.txt`. Os testes anteriores de invocação (1.231 verificações) e teclas do Grupo (214) também passaram depois dos novos hooks. Artes das cenas e inspeção visual da interface são verificações da integração principal, distintas deste gate do motor.
