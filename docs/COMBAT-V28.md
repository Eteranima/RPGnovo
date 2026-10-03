# v28 — composição e comandos de combate

## Alterações

- O campo de batalha passa a ocupar toda a largura. Ordem dos turnos, personagens/inimigo e comandos têm áreas separadas.
- A formação acomoda de um a cinco aliados, com tamanhos calculados a partir do corpo no quadro de repouso e das âncoras dos sprites. A extensão da arma/efeito nos ataques não reduz a escala do corpo em repouso. Cada personagem tem um ponto de apoio e uma área para o nome, incluindo margem para o balanço de ±1,5 px.
- Seis sprites próprios substituem as representações simples de Ações, Habilidades, Itens, Recuar, Atacar e Guardar.
- Alvos de cura/itens mostram somente retrato e vida. O nome continua disponível para leitores de tela. HP/MP do personagem em turno ficam na faixa de comandos.
- Os cards exclusivos continuam visíveis no computador. Em celular horizontal com altura até 450 px, o rodapé recolhe para dar espaço ao palco; os retratos de alvo e os valores do personagem em turno continuam disponíveis.
- O card de Carmilla recebe uma base carmim pintada atrás do retrato, sem a abertura que mostrava o azul da interface.

## Artes

As seis placas estão em `public/assets/v28/combat/`; a moldura reparada está em `public/assets/v28/cards/carmilla/`. As fontes, prompts exatos e provas dos recortes nativos ficam em `art-source/v28/`. Todas foram criadas ou editadas com a ferramenta imagegen integrada, preservando o RGBA original.

## Revisão

As capturas finais estão em `docs/qa-v28/`. A revisão usou uma rota temporária com progressão própria e gravação de save desativada. Essa rota foi arquivada em `art-source/v28/battle-review-route.txt` e removida antes da compilação final.

| Tela | Palco | Comandos | Revisão |
| --- | --- | --- | --- |
| 1310 × 572, quatro aliados | 1310 × 235 | 97 px de altura | Corpos adultos, nomes e cards separados |
| 844 × 390, cinco aliados | 844 × 205 | 95 px de altura | Todos os alvos visíveis; técnicas adicionais por rolagem horizontal |
| 1310 × 572, um aliado | 1310 × 235 | 97 px de altura | Carmilla e ultimate disponível |

Não houve imagens ausentes nem largura da página excedida nos tamanhos medidos. A poção foi executada sobre o retrato selecionado de Carmilla: 97/117 → 117/117 HP, estoque 3 → 2. A guarda foi executada e recuperou os 3 MP previstos.

## Testes

- Jogo base: 669 verificações aprovadas.
- Elementos: nove personagens, ataques, habilidades, ultimates e compatibilidade dos saves aprovados.
- Carmilla: cura proporcional, empates, custo de 15% e regra de não ressuscitar aprovados.
- Formação: 1978 verificações aprovadas, usando o contorno alpha real de nove personagens e Gabriel lycan, em 300 posições de repouso distribuídas em grupos de um a cinco. Inclui o balanço de ±1,5 px; a menor folga entre corpo e placa do nome foi 2,79 px, e o menor espaço para os inimigos foi 83,91 px.
- Verificação de TypeScript e compilação de produção aprovadas após a remoção da rota temporária. A compilação incluiu apenas a rota real `/`.

Capturas: [batalha final](qa-v28/battle-desktop.jpg), [itens e retratos](qa-v28/battle-items-desktop.jpg), [cinco aliados no celular](qa-v28/battle-five-landscape.jpg) e [Carmilla sozinha](qa-v28/battle-single.jpg).
