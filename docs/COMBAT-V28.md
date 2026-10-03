# v28 — composição e comandos de combate

## Alterações

- O campo de batalha passa a ocupar toda a largura. Ordem dos turnos, personagens/inimigo e comandos têm áreas separadas.
- A formação acomoda de um a cinco aliados, com tamanhos calculados a partir dos recortes dos sprites. Cada personagem tem um ponto de apoio e uma área para o nome.
- Seis sprites próprios substituem as representações simples de Ações, Habilidades, Itens, Recuar, Atacar e Guardar.
- Alvos de cura/itens mostram somente retrato e vida. O nome continua disponível para leitores de tela.
- O card de Carmilla recebe uma base carmim pintada atrás do retrato, sem a abertura que mostrava o azul da interface.

## Artes

As seis placas estão em `public/assets/v28/combat/`; a moldura reparada está em `public/assets/v28/cards/carmilla/`. As fontes, prompts exatos e provas dos recortes nativos ficam em `art-source/v28/`. Todas foram criadas ou editadas com a ferramenta imagegen integrada, preservando o RGBA original.

## Revisão

As capturas finais serão salvas em `docs/qa-v28/`. A revisão usa uma rota temporária com progressão própria e gravação de save desativada. Essa rota será arquivada como texto e removida antes da compilação final.
