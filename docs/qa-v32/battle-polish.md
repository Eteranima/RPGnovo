# Combate v32 — leitura e ritmo

## Interface

- A linha de intenção ocupa24px no desktop e22px em paisagem. Distingue **Agindo**, **A seguir** e **Próxima rodada**, usando o plano real do motor.
- Os alvos exibem rostos nativos e HP atual, incluindo Gabriel humano/lycan. O texto acessível identifica cada alvo e sua guarda.
- **Detalhes** abre um diálogo no `document.body`: nome completo da técnica/ultimate, rodada, elemento, dano se acertar, chance de erro por cegueira, estado/turnos, guarda e controle já usado. Não depende de hover.
- **Estados** explica os estados e a proteção de todos os aliados e do inimigo, com os ícones finais existentes. Durações são ações do afetado.
- **1×/2×** altera a preferência real do motor; `aria-pressed` indica a escolha. Uma ação em curso conserva a velocidade capturada quando começou.
- O diálogo mantém foco, fecha explicitamente ou por Escape, consome teclas do jogo e preserva atalhos modificados do navegador. Tab só reposiciona foco no keydown; keyup não volta ao início.

## Animação e resultado

- As introduções de700ms/900ms e a preparação de1800ms são divididas por `BattleAnimation.speed`, assim como os intervalos breves de flash/abalo da ultimate.
- O corpo e o efeito permanecem nas folhas nativas já aprovadas. Nenhuma arte, crop, âncora ou paleta foi substituída nesta etapa.
- As dez ultimates inimigas mantêm o contato no quadro5 nas velocidades1× e2×. A pintura é limitada a30FPS; o efeito visual segue o primeiro quadro após o callback real de impacto.
- Números, mensagens de guarda/estado e anúncios acessíveis usam exclusivamente `enemyOutcomeV32`, criado após o impacto. Um erro por cegueira não exibe dano previsto como dano ocorrido.
- A ultimate apresenta um resumo do resultado no rodapé de sua própria tela; os cinco cards permanecem fora do palco.

## Carga

- `battleArtKeysV32(heroes,duelHero,scope)` seleciona apenas o Grupo, o oponente real e suas fases, o fundo atual e os efeitos compartilhados efetivamente consumidos.
- Não há preload de todas as famílias inimigas. Chamadas sem scope selecionam apenas os heróis indicados e o VFX compartilhado.
- A cache deduplica URLs. Falha ou ausência de resposta por15s libera uma tentativa nova, sem marcar a imagem ausente como pronta.
- `BattleScene.onArtReady(battle)` só é chamado quando todo o lote está pronto; o Page repassa `battle.artTokenV32` ao motor. O efeito depende desse token, evitando callbacks de uma batalha anterior do mesmo inimigo.
- O registro opt-in do Page faz o motor aguardar a arte antes de iniciar atores/timers. Enquanto carrega, comandos de combate permanecem bloqueados. A falha mostra **Tentar novamente**.

## Verificação

- `tests/battle-polish-v32.test.mjs`:507 verificações aprovadas, incluindo execução do efeito de produção das20 ultimates inimigas (dez famílias × duas velocidades), timing dos nove heróis no palco/duelo/cinema, carga seletiva, cache/timeout/retry, textos da previsão, exceções reais de silêncio/cegueira, HP/retratos, foco Tab e botões dos cinco slots na exploração.
- `npx tsc --noEmit`: concluído com exit0 durante a implementação. Após remover a rota temporária de QA, a última execução apontou apenas um import obsoleto em `.next/dev/types/validator.ts` para `app/review-v32/page.js`; a raiz regenera os tipos no gate final.
- Capturas da raiz revisadas: `battle-five-landscape.png` (844×390, cinco atores/cards), `battle-intent-details.png` (1280×720, diálogo), `guard-result-landscape.png` (guarda realmente aplicada e HP após impacto).
- A raiz coordena a suíte completa e a confirmação final de compilação/publicação.

## Grupo na exploração

- `CombatParty` ganhou props opcionais `exploration`, `leaderId`, `onSelectHero(id,slot)`, `credits`, `level`, `saving`, `masterMode` e `selectDisabled`. O ramo de batalha conserva o layout anterior.
- A exploração reaproveita os cinco cards nativos, com o líder destacado, botões reais e atalhos1–5 correspondentes aos slots permanentes. Clique e teclado chamam a mesma seleção do motor, sem ordenar os heróis ou consumir recursos.
- Tab a partir desses botões navega o foco; não dispara o atalho global de alternar líder. A seleção pode ser desabilitada durante menus/carga.
- Em paisagem curta o rodapé mede82px (cards63px e faixa de recursos12px), substituindo o rodapé antigo de142px. Não usa a classe global `party-footer`, evitando suas larguras legadas de368px por personagem.
- Créditos, nível, líder e salvamento são dados reais na faixa compacta. Os cinco cards continuam exibindo15 barras acessíveis (HP/MP/ultimate).
- Capturas `world-five-landscape.png` e `world-leader-keyboard.png` revisadas em844×390: cinco slots completos, líder Ophelia destacado, Q/R correspondentes e nenhum card cortado ou exigindo rolagem horizontal.
