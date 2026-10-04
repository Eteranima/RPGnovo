# Mega update — parte 2 de 5 · v32

## Decisão de design

O pedido desta parte foi melhorar o estado atual do jogo com julgamento de game design. A prioridade escolhida foi tornar as decisões compreensíveis, reduzir espera e facilitar a exploração das mecânicas existentes.

A inspeção encontrou problemas concretos: a abertura aguardava um lote global de artes, o jogador não tinha uma previsão fiel do ataque inimigo, a troca de equipamento exigia cálculo manual e as missões em outro mapa exigiam procurar cada saída. Na exploração, o rodapé de cinco heróis também escondia integrantes atrás de rolagem horizontal.

## Pesquisa e aplicação

- **Escolhas táticas legíveis.** A descrição oficial de *Into the Breach* apresenta ataques anunciados como uma maneira de planejar respostas. Aplicação neste jogo: expor o próximo ataque, seus alvos e a proteção existente, preservando as regras de combate. [Subset Games](https://subsetgames.com/itb.html).
- **Motivações diferentes.** A pesquisa da Quantic Foundry distingue interesses em desafio, progressão, história, exploração e conclusão de tarefas. Os próprios autores alertam que segmentos gerais não descrevem toda a nuance de um jogo. Aplicação: melhorar combate, equipamento e orientação de missão sem afirmar que uma mecânica agrada a todos. [Player Segments Based on Gaming Motivations](https://quanticfoundry.com/2020/08/17/player-segments/).
- **Resposta e fluidez.** A revisão de Pichlmair e Johansen organiza práticas de game feel, incluindo feedback e redução de atrito. Aplicação: velocidade opcional e preparação das artes antes do relógio do combate. Essa aplicação é uma inferência de design; a pesquisa não mediu Éter Anima. [Designing Game Feel: A Survey](https://arxiv.org/abs/2011.09201).

## O que mudou

### Combate

A faixa de intenção informa quando o inimigo age, elemento, ataque individual ou de área, retratos e HP dos alvos. **Detalhes** mostra dano condicionado ao acerto, estados, guarda, carga e disponibilidade de imobilização. Cegueira é exibida como chance, sem consumir o sorteio antes do impacto. **Estados** explica os efeitos reais do grupo e do inimigo.

A previsão e a execução compartilham o mesmo planejamento. O resultado real aparece somente depois do impacto. A guarda informa o HP realmente preservado e o estado impedido.

**1× / 2×** ajusta o ritmo das próximas ações. O fator é capturado no início da animação: trocar durante um golpe não desloca seu impacto. A preferência fica fora do save da campanha. Recrutamento, gacha e filmes de missões mantêm suas regras e ritmos.

O combate solicita somente as artes do grupo e do inimigo presentes, incluindo as fases necessárias desse boss. Nenhuma ação começa antes da carga completa. Falhas apresentam um botão de nova tentativa; callbacks antigos não liberam outra batalha.

### Equipamentos

Busca aceita nomes, conjuntos, slots e acentos. Ordenação e filtro de itens usáveis facilitam encontrar peças. Cada troca válida mostra mudanças em HP máximo, MP máximo, força e bônus de magia, além dos limiares de três e seis peças ganhos ou perdidos. A transferência informa de qual personagem a peça sairá, inclusive integrantes da reserva.

### Missões

O diário e o rastreador mostram a próxima saída de um trajeto real entre mapas. O botão inicia caminhada até essa saída. Portas fechadas pela história continuam fechadas; pistas já registradas saem da orientação. Circuitos ordenados mantêm a sequência escrita.

### Grupo na exploração

Os cinco cards usam o formato compacto com retratos, molduras e barras finais exclusivos de cada herói. Cada card é um botão de seleção de líder; os slots seguem a ordem fixa do Grupo. A faixa de recursos conserva créditos, nível e estado de salvamento. Tab navega normalmente quando o foco está nos botões do rodapé.

### Carregamento do mundo

As artes são escolhidas pelos consumidores do mapa, grupo e entidades ativas. URLs compartilhados usam uma única imagem. Transições só substituem o quadro quando o novo lote terminou; erro mantém o quadro anterior e permite nova tentativa.

| Lote de artes do mundo | Antes | v32 |
| --- | --- | --- |
| Abertura / seleção | 75 URLs · 113,88 MiB | 0 imagens do mundo |
| Pátio, Seiji + Ophelia | lote global | 11 URLs · 19,88 MiB |
| Porto, Seiji + Ophelia | lote global | 11 URLs · 20,06 MiB |
| Pior grupo de cinco entre os planos medidos | lote global | 19 URLs · 37,03 MiB |

Esses números são tamanhos dos arquivos comprimidos, deduplicados por URL. Não representam o total da página, memória real do navegador ou tempo de rede. A abertura, o HUD, menus e áudio têm consumidores próprios. Inventário completo: [medições](qa-v32/world-assets-measurements.json).

## Validação

A revisão utiliza uma rota temporária com progresso isolado, sem ler ou escrever o save do jogador. A rota é retirada do produto antes do build final; sua fonte fica no registro de QA.

- Previsão de ultimate conferida pela interface: 46 de dano normal; 21 com guarda e 25 HP preservados. Os valores previstos corresponderam ao impacto real.
- Cinco atores, comandos e cards conferidos em desktop e 844×390; a área de combate não apresentou rolagem horizontal.
- Busca por “lúa” encontrou a peça correta; a interface avisou a transferência de Ava e perda do bônus de seis peças do Lobo. A troca real confirmou cinco peças restantes.
- Orientação Pátio → Porto conferida pelo diário, caminhada real e chegada ao mapa. O rastreador passou a oferecer a pista local.
- Testes novos cobrem planejamento/execução, velocidade capturada, gate de arte, cache/falha/retry, comparação contra equipar real e caminhos com travas de capítulo. Regressões incluem missões, gacha, MAIL, recrutamento, controles e posicionamento.
- Compilação final de produção e verificação TypeScript aprovadas. A rota de revisão foi excluída do produto.
- O save real foi reaberto na versão final: mapa, estágio, posição, objetivo e grupo retornaram exatamente os mesmos dados; o som permaneceu desativado e o console não registrou erros.

Relatórios e capturas ficam em [qa-v32](qa-v32/).

## Próxima avaliação com jogadores

Após esta parte, a evidência mais útil é observar amigos jogando sem instruções externas: entenderam a ameaça antes de perder HP, perceberam quando guardar, encontraram a missão rastreada, compreenderam os conjuntos e quiseram continuar após a primeira sequência de combates? Isso deve orientar ajustes de dificuldade, variedade e recompensas. Os testes técnicos comprovam funcionamento; diversão e retenção ainda precisam dessa observação.
