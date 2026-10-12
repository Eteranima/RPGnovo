# Interface de combate e exploração — v38

## Alterações

- Moldura raster final `public/assets/v38/interface/arcane-frame.png`, 1774×887 RGBA, SHA-256 `5c97900617f63fb712cc84a1457eeb9d4dbc4130151d79cab7b84cb1e2e4b3a6`.
- Painéis opcionais de intenção/estados e dica contextual usam nove fatias de 210 px nativos. O centro não é preenchido; a decoração fica em pseudo-elementos sem capturar cliques.
- HUD panorâmico recebe apenas cantos da fonte, com fundo marinho e contraste dos nomes, HP e comandos. Não se estica a gema central ao longo do cabeçalho.
- Abas selecionadas, ultimate disponível, comandos indisponíveis e foco por teclado têm estados distintos. Botões de fechar os painéis e recuperar carregamento têm mínimo de 40 px; os comandos de combate mantêm 32 px.
- Exploração conserva as artes finais v26 do minimapa e das saídas. Melhora contraste do destino, área segura/hostil, atalhos, interação e direção por toque, mantendo a posição e o tamanho existentes.

## Limites preservados

Não foram alterados motor, regras, áudio, teclas, pointer handlers, fila, habilidades, formação, CSS global ou rodapé compacto. As classes adicionadas à exploração não introduzem um wrapper ou um contexto novo de posicionamento.

O combate mantém cabeçalho de 34 px, status de 54/90 px, dock de 65/101 px e rodapé mínimo de 40/60 px. As linhas de comandos continuam em 32+32 px ou 32+68 px. A confirmação dos palcos de 197 px em 844 e 167 px em 405 permanece uma verificação visual do navegador de produção, a cargo da integração final.

## Verificação local

- `tests/battle-minimal-v36.test.mjs`: **155 verificações aprovadas**, incluindo 1–5 slots, HP/MP reais, oito entradas ordinais e callbacks de ações/alvos.
- `tests/battle-header-v36.test.mjs`: **13 verificações aprovadas**, incluindo nome longo, HP e estados em campos separados.
- `git diff --check`: aprovado.
- Revisão da fonte nativa e das artes existentes do minimapa/placa de viagem: concluída.

Compilação final e inspeção de desktop/mobile ainda cabem ao gate integrado. Este relatório não afirma publicação ou aprovação visual final.

## Arquivos locais

`components/battle-interface.module.css`, `components/battle-intent-v32.module.css`, `components/contextual-game-hint.module.css`, `components/game-shell/game-exploration.tsx` e `components/game-shell/exploration-interface-v38.module.css`.
