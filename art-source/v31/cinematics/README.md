# Ecos que Escolhem — cinco filmes nativos

Cada missão tem 48 quadros pintados distintos, em três folhas 4×4. O registro aponta para os recortes nativos, com 1 pixel de margem interna contra a cena vizinha. Nenhum quadro foi ampliado, redesenhado ou repetido para completar a contagem. O gerador de imagens integrado produziu os PNGs; as referências, instruções completas, cópias selecionadas, dimensões, hashes e recortes ficam ao lado dos arquivos de origem. As folhas medem 1672×941; os recortes preservam os 416×233 ou 416×234 pixels nativos de cada quadro.

As histórias acompanham as identidades aprovadas do elenco. Os finais deixam as duas decisões abertas: memória pública ou protegida; testemunho de gelo ou sementes; abrigo ou oficina; cidade ou famílias; página livre ou cuidado coletivo. Não há texto pintado nos quadros. Legendas e controles são DOM em português.

## Integração

`QuestCinematic({questId,caption?,sceneAct?,onComplete,onSkip})` recebe os IDs `long-tinta`, `long-geada`, `long-brasa`, `long-trovao`, `long-nulo`. A reprodução normal usa 48 quadros, 220ms por quadro e uma timeline de 10,56s; os ciclos do navegador deixam a exibição normal próxima de 11s. Um atraso visível não pula imagens: avança até a próxima célula e descarta o tempo excedente, prolongando a sessão quando necessário. `sceneAct` é apenas uma prévia opcional de 16 quadros; a missão concluída deve apresentar o filme completo. O componente carrega apenas as três folhas da missão atual, sem adicionar o elenco a ASSETS ou ao preload de mundo.

O filme pausa quando a aba fica oculta, permite pausa manual e guarda o quadro final até o botão Continuar. Pular cena é um controle explícito. Teclas do jogo são consumidas pelo modal; o motor também bloqueia input durante `questCinematic`. Atalhos Ctrl/Meta/Alt e teclas de função continuam disponíveis. A preferência de movimento reduzido começa pausada e remove transições: o jogador escolhe quando reproduzir as 48 imagens. O foco permanece dentro dos botões do diálogo e volta ao elemento anterior ao fechar. Um ID ausente apresenta um botão explícito para retornar à missão.

O modal é montado em `document.body` por um portal depois da montagem no cliente. Assim, transformações e recortes do campo não limitam a tela nem escondem título, legendas e botões. A renderização no servidor não acessa o DOM; reprodução, ResizeObserver e foco só começam quando o portal existe.

## Verificação

`node art-source/v31/cinematics/export-native.mjs` copia fontes byte a byte, mede os recortes, exporta avatares sem alterar RGBA e constrói o registro tipado. `node tests/cutscene-v31.test.mjs` confere 48 quadros por missão, 15 folhas, 240 hashes nativos únicos, limites de células, opacidade, fontes, timeline e pausa. A distinção visual e a anatomia são revistas nas folhas completas; diferença de hash sozinha não substitui a revisão de arte.
