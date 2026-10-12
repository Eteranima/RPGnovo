# Combate com mais espaço para o palco

A pedido do usuário, apenas a interface de batalha foi simplificada. O Grupo da exploração e os cards dos menus continuam com as artes exclusivas e o enquadramento anterior.

## Comportamentos

- Os cinco integrantes ficam em uma faixa única, com rosto nativo, nome curto da família e valores reais de HP, MP e ultimate. O nome completo da versão e a ultimate equipada permanecem nos títulos e textos acessíveis.
- A borda superior dourada indica quem está agindo; a borda inferior azul indica o candidato a alvo aliado. As duas marcações podem coexistir. O ator continua indicado durante a animação, quando `currentHero()` está indisponível.
- Cada integrante é o mesmo alvo selecionado pelas teclas 1–5. A seleção durante uma animação muda apenas o candidato para a próxima ação; não reordena integrantes ou turnos e não permite agir durante `busy`.
- A fila mostra todas as oito posições possíveis, inclusive três ações repetidas do inimigo. A posição atual, as já executadas, a rodada e a identidade completa continuam acessíveis. As chaves de renderização usam posição e rodada, evitando IDs repetidos.
- O seletor duplicado de retratos foi removido dos comandos. Os ícones aprovados de ações/itens e os ícones próprios das técnicas permanecem. Habilidades e ultimate ficam em uma grade de oito opções: uma linha no horizontal, duas linhas de quatro no retrato.
- As abas não mudam a altura do dock durante a animação. Os controles principais têm pelo menos 32 px; HP/MP usam números tabulares de 11 px. Os estados, a previsão e as descrições completas continuam disponíveis pelos detalhes.

## Geometria medida no navegador de produção local

| Área | Horizontal / desktop | Retrato estreito |
|---|---:|---:|
| Cabeçalho do jogo | 34 px | 34 px |
| Nome/HP do inimigo, fila e previsão | 54 px | 90 px |
| Comandos | 65 px | 101 px |
| Grupo | 40 px | 60 px |

A raiz mediu `getBoundingClientRect()` no jogo de produção: **197 px de palco em 844×390**, **379 px em 1310×572** e **167 px em 405×452**. Nas três dimensões, a página teve exatamente a largura e a altura da viewport, sem overflow horizontal. O layout anterior tinha 132 px no horizontal e zero de palco no retrato de 405×452. Em 1310×572, todas as oito posições da fila ficaram dentro da faixa, entre x=532…1296. As sete habilidades de Abel e a ultimate ocuparam oito botões de 100×32 px no horizontal, com conteúdo dentro de seus limites.

No encontro real com Cinder, Marin e Seiji guardaram; o boss respondeu antes de Ophelia, Abel e Gabriel. A guarda reduziu o golpe de 24 para 11. As outras duas ações atacaram Ophelia e Marin e a carga terminou a rodada em 34%, sem multiplicar o incremento antigo por três. A tecla 5 selecionou Abel sem trocar o ator ou a ordem de turnos.

A correção do cabeçalho anterior foi preservada: HP e estados têm células explícitas; não há seletor genérico de último `span` nem uma célula vazia de estados. O aviso existente sobre orientação do aparelho não foi alterado.

## Verificação

- `battle-minimal-v36`: **155 verificações**; SSR e callbacks reais de 1–5 integrantes, quinze vitais em cinco slots, faces nativas, HP de quatro dígitos, alvo/ator distintos, fila completa com posições únicas, bloqueio das ações durante animação e expressão de composição da Page.
- `battle-header-v36`: **13 verificações**; HP, estados, fase e identidade completa do inimigo.
- `hero-labels-v36`: **211 verificações**; oito versões, nomes completos acessíveis e retratos humano/lycan de Gabriel.
- `battle-polish-v32`: **509 verificações**; escopo da forma realmente equipada, carregamento por luta, recuperação, acessibilidade de previsão/alvos e impacto. As 549 são históricas e incluíam 40 checagens de chaves Lycan não selecionadas; as regressões de comportamento continuam.
- `battle-art-loading-v38`: **59 verificações**; fila compartilhada de seis, timeout15 s após iniciar, deduplicação, retenção e retry. O caso humano corrigido usa25 URLs/55,62 MiB transferidos e aproximadamente 150 MiB RGBA; isso não é medição de memória de um celular. [Investigação](../qa-v38/battle-art-loading.md).

As verificações de estrutura não substituem a revisão visual de produção. Formação, escala dos corpos, regras, recompensas, áudio e preferências de movimento não foram modificados por esta simplificação.
