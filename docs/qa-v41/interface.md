# Circuito dos Despertos · interface v41

A tela principal foi reorganizada para dar prioridade ao campo e à preparação. O HUD separa rodada/fase, rival e recursos. Vínculos ficam na lateral esquerda, classificação na direita, banco junto do campo e cinco cartas de recrutamento na base. Detalhes de peça, Forja, catálogo e Guia abrem sob demanda. A classificação usa as colocações oficiais e mantém rivais vivos acima dos eliminados quando a eliminação do jogador encerra a sessão. Título e atalhos permanecem fixos; somente a lista de participantes desliza em alturas curtas.

A organização foi estudada a partir de capturas de [TFT publicadas pela distribuidora](https://dtcl.vnggames.com/en-us/news/game-updates/augments-augmented/) e da apresentação de [Auto Chess](https://ac.dragonest.com/en/gameIntroduction). As artes, cores, personagens e regras utilizadas são as de Éter Anima.

As molduras têm renders 3D próprios e animação de entrada, inclinação discreta, pressão e brilho. Sprites permanecem 2D. O tabuleiro conserva câmera superior e topologia quadrada: não foi esticado para deformar personagens. O aumento de 15% da textura é acompanhado pela transformação correspondente dos limites do grid, x/y 0,06875 e largura/altura 0,8625. Os 31 recortes compactos permitem figuras maiores na loja e no banco sem alterar os PNGs.

Em telas estreitas, campo, banco e loja permanecem presentes. Ofertas deslizam horizontalmente e os detalhes abrem em um painel inferior. As faixas de 390 e 650 pixels foram verificadas; o CTA em 650 pixels iniciou uma rodada real. O botão mantém posição absoluta e aceita entrada nessa faixa, sem criar outra linha no grid. A pintura de hover das casas é transparente e não recebe o relevo dos cartões.

Foram corrigidos dois problemas de composição observados na revisão: a faixa de custo agora é um elemento separado do brilho da moldura, e os SVGs de borda usam origem zero para recortes consistentes dos botões. Os PNGs permanecem nativos e inalterados.

## Verificação

- UI: `node tests/auto-chess-ui-v39.test.mjs` · 405 verificações PASS, incluindo comandos reais, recursos, retomada, pagamentos únicos, versão de regras, cinco ofertas, nove espaços de banco, classificação e navegação.
- Replay: `node tests/auto-chess-replay-v40.test.mjs` · 1.067 verificações PASS; reconstrução fiel, busca em ambas as direções, números reais, poses, som e piras substituídas.
- Arte v41: `node tests/auto-chess-art-v41.test.mjs` · 508 verificações PASS; cinco frames 3D, dois ambientes e 31 corpos 2D.
- TypeScript: `node node_modules/typescript/bin/tsc --noEmit` · PASS.
- Build: `node scripts/run-framework.mjs build` · cinco etapas PASS. PWA de 18 arquivos de shell, 2.243.131 bytes e cache de mídia limitado a 64 MiB.
- `git diff --check` · PASS; avisos de conversão LF/CRLF não são erros de conteúdo.

O navegador de inspeção tem preferência de movimento reduzido ativa. As molduras ficam estáticas nessa condição, com foco e seleção visíveis. A sintaxe e os limites da animação estão registrados em `interface-motion.md`. Esta revisão não mede FPS em um celular físico e não declara qualidade absoluta de cada detalhe artístico.

Os testes de combate, balanceamento e compatibilidade são documentados em `../qa-v40/`. Nenhuma regra de combate foi alterada no redesenho v41.

## Conferência da compilação final

A revisão PWA `87875e843a4a06f39d02` foi ativada pelo fluxo real Sistema → Salvar e atualizar. A liga retomou na rodada 3, em preparação, com 59 de vida, 10 de ouro, nível 4 e as quatro peças originais do teste. Recursos da aventura permaneceram iguais: Ophelia 99/124 HP e 61/88 MP; Carmilla 92/112 HP e 59/66 MP. Nenhum prêmio foi recebido nessa conferência.

- 960 × 720: XP e abas contidos; atalhos Elenco/Guia dentro da classificação.
- 844 × 390: XP e atalhos contidos; lista de participantes rolável.
- 650 × 720: cinco abas visíveis no painel Mais; CTA absoluto com display flex e entrada habilitada.
- 390 × 844 e 1280 × 800: arte pronta, nenhuma falha de imagem registrada e nenhuma rolagem horizontal do documento.
- O navegador confirmou regras 40 e elenco 31. Com movimento reduzido ativo, header/shop ficaram com animation e transform none.

UI 405 e TypeScript passaram novamente após o wrapper da classificação. A compilação final completou as cinco etapas. As capturas JPEG foram salvas em outputs/Circuito-Desktop.jpg e outputs/Circuito-Mobile.jpg no diretório deste chat. O override temporário de viewport foi removido e a versão local ficou aberta para uso.
