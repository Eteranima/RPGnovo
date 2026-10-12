# Interface e controles do Circuito dos Despertos

O Circuito ocupa a tela do jogo e mantém a aventura pausada. Loja, banco, equipamentos e rivais usam recursos da liga; comprar peças e reproduzir combates não altera HP, MP, grupo, ouro ou itens do RPG. A revisão dos controles e dos fluxos foi realizada em 12 de outubro de 2026.

## Como acessar

Abra **Aventura → Autobatalha**. O Circuito também está disponível em **Eventos** e **Convocar**. Aceite o convite caso ele ainda não tenha sido aceito. **Ver como jogar** apresenta os seis passos na própria abertura, sem iniciar ou substituir uma liga.

**Jogar Circuito** abre a primeira partida. **Retomar Circuito** continua uma liga em preparação ou revisão. Quando a liga já terminou, **Ver último Circuito** abre seu resultado; começar outra liga exige a confirmação dentro do modo. **Salvar e sair** preserva formação, compras, equipamentos, resultados e prêmios já registrados.

## Controles de mouse toque e teclado

| Ação | Controle |
| --- | --- |
| Comprar | Escolher uma das cinco ofertas da loja, com custo informado |
| Posicionar | Selecionar uma peça do banco ou tabuleiro e escolher uma casa nas quatro linhas inferiores |
| Trocar duas posições | Com uma peça selecionada, escolher uma casa ocupada por outra peça sua |
| Navegar no tabuleiro | Setas, a partir da casa em foco; os limites não fazem a seleção saltar para outra linha |
| Confirmar uma casa | Enter ou Espaço no botão da casa |
| Cancelar a seleção | Escape limpa a peça e os componentes selecionados na Forja |
| Consultar a peça | Selecionar a peça e abrir Peça; tocar um rival no tabuleiro abre seus atributos |
| Equipar | Selecionar uma peça sua, escolher um item na Forja e usar Equipar |
| Combinar equipamentos | Selecionar duas entradas de componentes e conferir a receita antes de Forjar |
| Retirar equipamento | Escolher o item equipado durante a preparação; ele volta ao inventário |
| Rever o combate | Pausar, usar 1×, 2× ou 4×, buscar um momento, escolher Ver resultado ou Rever combate |

O banco tem nove espaços. A loja tem cinco ofertas. Não é necessário arrastar uma peça nem realizar um gesto preciso. A ordem do Grupo e os atalhos do RPG permanecem protegidos durante a liga.

## Uso em celular e com movimento reduzido

No celular, **Tabuleiro**, **Loja**, **Forja**, **Rivais** e **Mais** mostram um painel de cada vez. Em Mais, Peça, Vínculos, Guia e Resultado dão acesso às informações complementares. Som e tela cheia também estão no Guia. O estado de som desligado acompanha a troca de telas e rodadas.

A preferência de movimento reduzido evita a reprodução automática e os movimentos decorativos. O resultado continua sendo o mesmo combate registrado. **Próximo momento**, busca e **Ver resultado** permitem acompanhar a resolução sem depender de rapidez ou de som. A preparação não tem cronômetro.

Na última rodada, **Ver resultado** permanece disponível sobre o tabuleiro, inclusive com movimento reduzido. A cerimônia aparece depois de chegar ao fim da resolução. Não é preciso abrir Mais para alcançar o resultado final. A cerimônia permite salvar, rever o último combate e confirmar uma nova liga.

Nomes longos de formas alternativas quebram linha nos comandos. O cabeçalho preserva ouro, HP, nível e saída em telas estreitas. O quadro final tem altura limitada e pode rolar verticalmente para manter recompensas e saída acessíveis.

## Regras visíveis para orientar as escolhas

O Guia informa os seis passos, renda, juros, série, probabilidades por custo, redistribuição quando um custo se esgota, regras de alvo, escalada, empate e classificação. Os atributos de equipamentos se somam; passivos iguais ativam uma única vez. O catálogo, as quinze receitas e a inspeção dos sete rivais permanecem disponíveis.

O passo de fusão consulta uma peça que realmente alcançou duas ou três estrelas. A recompensa **Combate com dois vínculos** acompanha a conquista de duas sinergias em combate; ela não é apresentada como prova de fusão de estrelas.

O resultado identifica o rival do combate registrado, independentemente do adversário que estiver sendo inspecionado. O dano considera a perda real de HP dos inimigos em ataques, habilidades e efeitos periódicos. Durações de silêncio, prisão ou aplicação de queimadura não são somadas como dano.

## Evidências da revisão

`node tests/auto-chess-ui-v39.test.mjs`: **326 verificações aprovadas**. A revisão inicial tinha 224. Outras 34 percorrem uma liga real até o resultado terminal e exercitam o acesso direto em celular com movimento reduzido. As 68 verificações de geometria conferem cantos, primeira e última linha em quatro tamanhos de tabuleiro.

O teste usa os componentes e os callbacks de produção. Entre as verificações estão convite, guia sem iniciar partida, abertura, retomada, cancelamento de abertura adiada, compras, posicionamento, troca de peças, armaria, equipamento, retirada, loja travada, rodada completa com oito participantes, reprodução sem nova simulação, concessão única de cristais, saída e Escape. Uma luta real com Fogo confirma que o dano apresentado equivale à perda de HP dos inimigos mais suas curas, incluindo queimadura e excluindo durações de controle.

O carregador de imagens inicia até seis operações simultâneas. A espera na fila não consome o prazo de quinze segundos de uma imagem. Falhas podem ser tentadas novamente. Artes indisponíveis impedem iniciar a reprodução; os caminhos ficam nos diagnósticos do canvas e no console, com mensagem e botão de nova tentativa para o jogador.

As 23 imagens de retrato e os 13 ícones de vínculos têm arquivos nativos existentes. A escala das peças novas usa altura corporal medida e permanece constante entre poses; armas e efeitos não provocam um redimensionamento a cada quadro. Peças derrotadas desaparecem após uma transição curta, imediatamente com movimento reduzido.

O canvas de pintura estende quatro por cento da largura lógica para cada lado e registra sua origem no diagnóstico `data-paint-origin`. A tradução da pintura mantém as 64 casas exatamente sobre o piso nativo. O teste geométrico confirma que cabeça, barras acima da cabeça e estrelas sob os pés permanecem dentro da área de pintura nas linhas extremas, sem encolher o tabuleiro ou mover os alvos de toque.

Em conflito de save, a interface da liga é desmontada. A janela de recuperação assume o foco e a reprodução deixa de executar. As ações do modo continuam sujeitas à proteção e à persistência do engine.

## Validação visual do build

A conferência no navegador do build final deve registrar PC, celular vertical e horizontal, carregamento das artes finais, tamanho das peças, legibilidade, posição das barras, troca de temas, preparação, combate, cerimônia e retomada. Os testes de callbacks e de fonte descritos acima não medem FPS em um dispositivo físico nem substituem essa inspeção visual.
