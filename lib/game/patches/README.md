# Estrutura do próximo patch

O pedido atual prepara esta estrutura; novas áreas, lojas, itens e alterações de status ficam para o próximo projeto. O registro está vazio e não é importado pelo motor.

## Como começar

1. Crie uma definição que satisfaça `GamePatchDraft`; mantenha `status: 'draft'`.
2. Use identificadores novos e estáveis. Não renomeie mapas, itens, heróis ou nós gravados nos saves antigos.
3. Declare as artes finais usadas em cada área, os destinos e pontos de entrada; confira colisões, acessibilidade móvel e navegação antes de ativar.
4. Lojas referenciam itens existentes ou os itens novos declarados no patch. Preços e limites precisam de decisões explícitas.
5. Cada mudança de balanceamento registra valores anteriores, novos valores e o motivo. Preserve HP/MP atuais ao recalcular máximos, sem cura automática.
6. Antes de integrar a definição ao motor, atualize a união de MapId, o catálogo, loaders, save parser e minimapa juntos. Revise migração de saves e travas de missão.

Nenhum conteúdo de rascunho deve aparecer para jogadores. A publicação do patch exige integração explícita e QA do conteúdo concluído. A estrutura não altera probabilidades nem garantias de convocação.
