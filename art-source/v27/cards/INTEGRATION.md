# Integração dos cards exclusivos

`components/hero-card.tsx` reúne retrato, identidade, vitais e moldura. Os caminhos dos dez kits estão em `lib/game/heroCardArt.ts`. Nenhum kit é obtido por filtro ou recoloração CSS.

## Consumidores

- HUD e bolsa/grupo de `app/page.tsx`.
- Grupo, bolsa e seletor de heróis de `components/game-menu.tsx`.
- Catálogo de dez identidades em `components/echo-menu.tsx`, incluindo Abel.

O catálogo preserva nomes, elementos e raridades de `SUMMONED_HEROES`. Personagens sem arte de variante usam o retrato real existente da respectiva identidade. Os cards de catálogo não exibem HP/MP. Abel continua como convocável, sem alteração de `HeroId`, regras ou disponibilidade jogável.

## Composição

- Card com vitais: 368 × 128 px; até 350 px no celular, com rolagem horizontal do grupo. O rodapé reserva 142 px. Cards de identidade, usados no catálogo/seletor, mantêm 116 px de altura.
- Margem direita de 44 px nos sete kits de decorado estreito e de 60 px em Ava, Seiji e Ophelia, deixando os valores fora das flores, tinta e cristais maiores. Seiji e Ophelia têm conteúdo de vitais 4 px abaixo para respeitar os filetes; todas as linhas de vitais mantêm 18 px de altura, com números legíveis. No modo de identidade dessas duas placas, o deslocamento permanece em 8 px.
- Nome e elemento/companheiro em linhas independentes, sem reticências.
- Coluna numérica reservada de 72 px (68 px em portrait), suficiente para `9999 / 9999`.
- Nome completo e função no modo de identidade do catálogo.
- HP vermelho e MP azul usam preenchimentos raster próprios da família v26. Cada recipiente e moldura vem do kit v27 exclusivo.
- As aberturas do aro e dos recipientes são medidas no manifesto de cada kit. O aro mantém proporção com `object-fit: contain` em um contêiner de 100 px; a abertura é convertida para sua posição real. Onde a placa tem aro integrado, o centro do retrato é alinhado à abertura medida da placa.
- Nos nove kits com canal transparente, a moldura do recipiente fica acima do preenchimento dinâmico para preservar suas bordas. Ava usa leito navy pintado: `trackAboveFrame` limita o líquido à abertura interna medida, com recuo de 4 px e máscara arredondada, acima desse leito.
- O fundo de cada placa é gerado na cor do elemento. Seiji branco, Max amarelo elétrico e Ophelia azul glacial claro usam texto em tinta escura; as demais identidades usam texto marfim claro. As cores de texto não recolorem os sprites. O azul claro de Ophelia exigiu a troca para tinta escura após medir o contraste do texto sobre o fundo final.
- Em portrait, as seções do menu formam uma faixa horizontal rolável. O conteúdo ganha a largura necessária para os cards e mantém os mesmos controles.
- No menu portrait, cards com largura efetiva próxima de 285 px usam aro de 80 px, reserva esquerda de 94 px e margem direita de 34 px (48 px em Ava, Seiji e Ophelia). O HUD mantém o card de 350 px com aro de 100 px. A orientação de teclado e ARIA acompanha a navegação horizontal.
- Os wrappers do Grupo, catálogo e seletor têm um container nomeado. Quando sua largura é menor que 330 px, o mesmo encaixe compacto é aplicado em qualquer orientação, evitando barras quase sem largura nos dois cards por linha de telas landscape estreitas. O HUD de 350 px ou mais não participa dessa regra.
- Os detalhes da convocação são abertos somente pelo botão explícito. O estado expandido oculta a moldura de identidade, preservando descrição e ultimate completas. As regras antigas de `hero-switch span` foram limitadas ao span direto do botão, impedindo que impusessem fonte de 17 px nos campos do novo componente.

`CardHeroDisplay` aceita os dez ids e vitais opcionais. O QA pode exibir o kit de Abel sem inventar atributos ou depender de um save. Heróis da reserva usam a derivação existente apenas para leitura; os estados e regras de jogo permanecem no engine.

## Validação

- TypeScript passou após a integração dos componentes e consumidores.
- A primeira captura `docs/qa-v27/cards-progress.jpg` revelou nome sobre o filete superior e MP próximo da borda inferior. A altura foi corrigida para 116 px, com linhas compactas e conteúdo centralizado na zona navy.
- Após as molduras elementais, `docs/qa-v27/cards-colour-progress.jpg` revelou a necessidade de margem adicional à direita e nas placas de Seiji/Ophelia. A rodada seguinte (`cards-exclusive-desktop.jpg`) mostrou que 116 px ainda deixavam MP próximo ao filete inferior. Cards com vitais passaram a 128 px e o rodapé a 142 px, preservando altura de barras e números; identidades de catálogo mantiveram o enquadramento de 116 px aprovado.
- Contraste medido em amostras do painel final, com o texto secundário: Gabriel 7,16:1, Marin 14,75:1, Max 8,24:1, Carmilla 10,63–10,70:1, Beatriz 7,09–14,78:1, Abel 10,36–10,67:1, Orfeu 10,85–10,98:1, Ava 9,79–10,18:1, Seiji 9,89–9,98:1 e Ophelia 5,16–6,32:1. São medições pontuais dos fundos, complementadas pela inspeção visual; não uma garantia de contraste em cada pixel de ornamento.
- Manifestos e capturas finais de cada kit ficam nas pastas respectivas. A revisão visual da composição no jogo é registrada pela tarefa principal após a entrega dos dez kits.
