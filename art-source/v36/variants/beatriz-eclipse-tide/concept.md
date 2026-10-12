# Beatriz — Rainha da Maré do Eclipse

Estado: **conceito preparado; geração ainda não iniciada**. A raiz dará início depois de fechar Gabriel humano. Não substitui artes atuais nem afirma um retrato aprovado.

## Referências inspecionadas

- `public/assets/v29/beatriz/portrait.png` e `art-source/v29/beatriz/portrait-source.png`: olhos violeta, cabelo escuro longo, domínio simultâneo da água e da sombra, lâmina na mão esquerda e gesto aberto da mão direita. A nova roupa terá cobertura integral; as aberturas da roupa antiga não são uma restrição a preservar.
- `public/assets/v27/cards/beatriz/card-frame.png`: identidade de Água / Trevas, metade azul oceano e metade preta, ouro fino e gotas. O card da família permanece próprio e legível.
- `lib/game/variantsV36.ts`, `beatriz-eclipse-tide`: A Margem dos Dois Oceanos; soberana acolhedora dos oceanos de outro céu. Técnica **Decreto das Duas Marés** e ultimate **Oceano sob a Lua Ausente**. Não há companion canônico a inventar.

## Identidade proposta

Uma soberana adulta de fantasia anime, com presença firme e calma. A silhueta muda bastante em relação à bruxa original: **coroa de ondas e lua eclipsada**, máscara assimétrica de baile preta/azul na testa, cabelo azul-negro longo com uma mecha pérola e trança lateral espessa. Olhos violeta preservam a ligação familiar. A máscara fica presa à coroa para manter o rosto expressivo.

Traje integral: gola alta, mangas longas, luvas, casaco cerimonial dividido em azul oceano e preto profundo, ombros estruturados, bordados de maré em prata/ouro. Sob o casaco, **duas pernas de calça amplas e separadas**, terminando acima de **duas botas fechadas**, com solas estáveis e dedos dos pés apontando naturalmente. Os painéis do casaco ficam atrás/laterais das pernas para não esconder uma bota ou simular uma terceira perna. Sem pele exposta no tronco, coxas ou cintura; sem tecido transparente.

Arma: uma única lâmina de maré azul e obsidiana, ligada à espada da família, segurada com mão esquerda clara. Mão direita aberta e anatômica controla uma corrente azul com fita de sombra violeta/preta. Água parece líquido; Trevas parecem corrente escura, sem fogo, gelo ou relâmpago. A arte de retrato pode ter os dois fluxos separados; os atlases corporais não carregarão efeitos amplos que invadam células.

## Enquadramento e kit previstos

- Retrato RGBA inteiro: cabeça/coroa, duas mãos, lâmina e duas botas incluídas com margem; face crop nativo medido separadamente.
- Walk: 12 poses S/W/E/N, três por direção, passos reconhecíveis e duas botas em cada célula. Figuras menores dentro de cada célula e gutters vazios alpha 0.
- Attack: seis poses, frame 0 repouso sem VFX, olhando para a direita. Uma espada e duas mãos constantes.
- Cast: seis gestos de corrente/cura e limpeza; corpo para a direita, água/sombra em VFX separado.
- Ultimate: oito poses para a direita, centro de gravidade apoiado nas botas; preparação, decreto, liberação e retorno.
- VFX: seis motivos isolados — impacto duplo, lâmina de maré, cura aquática, selo profundo, duas marés, oceano sob a lua ausente. Ícones: seis motivos próprios sem texto baked.
- Runtime previsto: `public/assets/v36/variants/beatriz-eclipse-tide/{portrait,face,walk,attack,cast,ultimate,vfx,icons}.png` e `icons/0.png` a `icons/5.png`.
- Fontes/prompts/provas: `art-source/v36/variants/beatriz-eclipse-tide/`. Registro final e uso de skills ficam com a raiz/núcleo.

## Prompt-base preparado

Use case: identity-preserve alternate-universe legendary character concept. Adult anime fantasy ocean sovereign Beatriz, linked to the reference by violet eyes, dark long hair, left-hand sword and right-hand water gesture. Bold new regal silhouette: eclipsed moon wave crown, navy/black asymmetrical masquerade mask pinned to crown, deep blue-black long hair with a pearl streak and thick side braid. Fully covered high collar, long sleeves, gloves, ceremonial sapphire-and-black split coat, TWO separated wide trouser legs, TWO complete closed boots clearly visible beneath the coat. One ocean/obsidian sword held in a natural left hand, a natural open right hand controlling liquid blue water and a separate violet-black shadow ribbon. Premium clean anime ink and cel shading, fine gold/silver tide embroidery. Full body, complete crown, blade and both boots, generous transparent margins, actual RGBA alpha 0 background. No bare thighs, torso openings, translucent cloth, extra limbs, extra weapons, pets, cropped feet, fire, ice or lightning. Effects must not conceal hands or either leg.

Esse prompt ainda será ajustado à referência final aprovada antes das folhas. Não foi enviado a nenhum gerador nesta preparação.
