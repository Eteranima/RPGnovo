# Éter Anima v1.8

## Validação

- TypeScript sem erros. Oito suítes cobrem mapas reais, colisões, capítulo completo, compras repetidas, origens, migração, árvore, conjuntos, técnicas, troca de líder, expiração segura, invocações em lote, notificações, viagem, fases dos chefes e sons.
- Chrome desktop: Q consumiu MP; Tab trocou líder, ordem do grupo e slots. Habilidades abriu a árvore e mapa regional viajou ao Cais, preservando vitais. Gacha ×10 consumiu dez fichas e revelou dez resultados, com raridade/pity/duplicatas. Detalhe usa arte proporcional.
- Layout horizontal 844×390: HUD, direcional, atalhos e menus dentro do jogo. Recompensa de bestiário abriu Cabeça e destacou Elmo da Brasa. Ultimate de Marin lançada pela aba Habilidades; ordem central visível. Formas 2 e 3 da Chama renderizadas. Sem teste em aparelho físico.
- QA encontrou foco automático que mudava atalhos para Recompensas; corrigido concentrando o foco no diálogo. Correções adicionais: expiração sobre água, custo nulo de Concentração, timer de gacha antigo após reinício e viagem de áreas seguras.
- Fixtures de QA removidas antes da build; PNGs completos, prompts e coordenadas de origem em art-source/v18, sem pranchas fatiadas. Mapa regional é uma visão geral; exploração continua em grade navegável.

## Regras novas

Dois slots fixos por herói; Q/R ou toque. Tab/toque troca apenas o líder de uma equipe de dois fora de combate e menus. Técnicas ambientais custam MP, duram 15s e podem ser reaplicadas; descobertas para missões ficam registradas. Marin evita contato automático durante Sombras; Gabriel ilumina a área.

As três dificuldades afetam o próximo combate. HP ×1/1,3/1,65; dano ×1/1,2/1,4; XP/créditos ×1/1,5/2; drop comum 30/55/80%; chefes concedem 1/2/3 equipamentos compatíveis com nível, além das fichas. Fases dos chefes preservam dano já causado, aumentam força/velocidade e aceleram a carga da ultimate. Impactos ocorrem depois do anúncio; não há aplicação dupla ao clicar durante animações.

As invocações ×5/10 exigem todas as fichas antes de iniciar. Pity é calculado a cada resultado; duplicatas viram fragmentos. Não há compra de fichas ou pagamento real.
