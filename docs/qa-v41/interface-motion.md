# Molduras e movimento da interface v41

O módulo `components/auto-chess-motion-v41.module.css` exporta `stage`. A classe pertence somente à raiz do Circuito, com importação posterior ao módulo de layout. Os alvos são os contêineres de moldura identificados por `data-ui-frame`: `header`, `panel`, `rail`, `shop`, `card` e `bench`.

A entrada usa opacidade e deslocamentos de 4–7 px. As durações ficam entre 180 e 280 ms; com os pequenos atrasos, a sequência termina em até 335 ms. Um cartão disponível, sob mouse, sobe 3 px e inclina no máximo 1,25° / 0,8° com perspectiva de 900 px. O toque produz pressão de 1 px e escala de 0,995, sem inclinação. O brilho atravessa a moldura uma única vez em 380 ms. Cartões selecionados ou ativos podem ter uma pulsação discreta de opacidade no contorno, com ciclo de 4,2 s.

As sombras de profundidade são estáticas. As transições animam transformação ou opacidade; não há animação de tamanho, layout, sombra, filtro, desfoque ou imagem. Não são usados `will-change` global, acompanhamento de ponteiro, eventos de rolagem, JavaScript de paralaxe ou novos elementos DOM. O único movimento contínuo é o contorno dos cartões explicitamente ativos.

Não há regra dirigida a sprites, imagens ou canvases. O tabuleiro e a arena não recebem perspectiva ou transformação. Os personagens continuam ilustrações 2D; somente os planos das molduras recebem o relevo da interação.

`prefers-reduced-motion: reduce` elimina animações, transições, transformações e perspectiva das molduras e seus brilhos, inclusive sob hover e toque. Contornos de seleção e foco permanecem estáticos. O foco de teclado usa uma linha de 2 px; nos cartões ela fica dentro da borda, mantendo-se visível em uma loja com rolagem e recorte.

Validação realizada: o parser PostCSS instalado com o framework aceitou o módulo, com 30 regras e três animações. Essa checagem confirma a sintaxe; medição de FPS e inspeção de foco, toque, recortes e movimento reduzido dependem da integração no navegador. Não foram feitas alterações nas regras, catálogo, combate ou layout nesta etapa.
