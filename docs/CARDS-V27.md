# v27 — Cards exclusivos e fundos elementais

## Pedido atendido

Dez kits de arte próprios foram gerados e integrados, com quatro sprites por identidade: moldura frontal, aro do retrato, recipiente HP e recipiente MP. São 40 PNGs em `public/assets/v27/cards/`. As molduras não usam recoloração por CSS.

| Personagem | Motivos | Fundo |
| --- | --- | --- |
| Ava | Flores, raízes e pedra | Marrom terra |
| Seiji | Tinta e kanjis | Branco |
| Ophelia | Gelo e cura | Azul gelo |
| Gabriel | Fogo e lycan | Vermelho |
| Marin | Escuridão e sombras | Preto |
| Max | Eletricidade e pregos | Amarelo elétrico |
| Carmilla | Sangue, agulhas e costuras | Carmim |
| Beatriz | Água e escuridão | Metade azul / metade preto |
| Abel | Fogo e leão | Vermelho |
| Orfeu | Anti-magia e combate físico | Cinza mineral |

A divisão da Beatriz é visualmente central, aproximadamente 47% azul / 53% preto na faixa útil. Seiji, Ophelia e Max usam texto escuro para contraste; os demais usam marfim. A leitura de Ophelia foi medida entre 5,16:1 e 6,32:1 nos pontos de texto revisados.

## Integração

O componente `components/hero-card.tsx` é compartilhado pelo rodapé, grupo, bolsa, seletores de habilidades/equipamentos e catálogo de convocação. Nomes, elementos, companheiros e números ficam em áreas reservadas. Barras continuam refletindo os valores reais do jogo e o retrato lycan de Gabriel foi preservado.

Abel recebe seu kit e aparece no catálogo, sem inventar atributos ou alterar sua disponibilidade jogável. Personagens de convocação com variantes usam a arte existente da sua identidade; elementos e raridades do catálogo permanecem os dados originais.

## Fontes e geração

Modo: ferramenta imagegen integrada. Prompts iniciais, refinamentos de layout, edições de cor, fontes selecionadas, molduras azuis anteriores, recortes e medições estão em `art-source/v27/cards/`, por personagem. O conjunto dos prompts é composto pelos arquivos `prompt.txt`, `layout-prompt.txt` ou `layout-repair-prompt.txt`, e `element-background-prompt.txt`, quando aplicáveis.

Os PNGs de runtime foram extraídos em resolução nativa, preservando os pixels RGBA. Os aros e recipientes têm aberturas medidas. Ava usa seu leito pintado com o preenchimento dinâmico restrito à abertura interna; os outros nove kits deixam o canal transparente.

## Revisão

As capturas de composição ficam em `docs/qa-v27/`. A revisão usa fixtures temporárias sem gravar o progresso do jogador; seus fontes são arquivados nesta pasta de arte e as rotas de revisão são removidas antes da compilação final.

A primeira revisão revelou nomes sobre o filete superior e valores próximos a ornamentos. O layout recebeu ajustes específicos de margem e contraste. Os dez kits, nomes longos, quatro dígitos e forma lycan foram conferidos no navegador. As telas de campo foram revisadas em 1310×572, 390×844 e 844×390. O grupo e o catálogo de convocação também foram revisados em 390×844, incluindo os nomes completos de Max e Abel. Não houve imagens ausentes ou transbordamento horizontal da página nas telas medidas.

## Validação final

- As 14 suítes existentes passaram: áudio, Carmilla, ecos, elementos, ambientes, expansão, jogo base, origens, progressão, recrutamento/MAIL, v14, v17, v18 e v19.
- `pnpm exec tsc --noEmit` passou após remover os tipos gerados das duas rotas temporárias de revisão.
- `pnpm run build` passou e incluiu apenas a rota real `/`.
- `git diff --check` passou.
- A partida real foi retomada em Porto Lúmina, com Ava 91/106 HP e 50/66 MP, Seiji 94/94 HP e 39/45 MP, Ophelia 77/77 HP e 63/63 MP. A preferência de som permaneceu desativada.

Captura dos dez kits: [cards-exclusive-desktop.jpg](qa-v27/cards-exclusive-desktop.jpg). Revisões em celular: [grupo](qa-v27/cards-group-portrait.jpg), [Max](qa-v27/cards-catalog-max-portrait.jpg), [Abel](qa-v27/cards-catalog-abel-portrait.jpg) e [campo horizontal](qa-v27/cards-field-landscape.jpg). O hash do commit é informado na entrega.
