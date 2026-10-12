# Seiji — Códice do Horizonte · Lua de Sangue v36

Revisão de fontes finais em 11/10/2026. O kit usa desenho anime adulto, cabelo prateado com trança, meia máscara de raposa branca, armadura angular de papel marfim, vestes pretas/carmesim, estola vermelha, faixas nas canelas, sandálias e pincel-lança. Tinta preta, papel marfim e selos dourados acompanham o elemento Tinta. Shin continua sendo um companheiro **humano chibi**, com cabelos iridescentes, olhos azuis, pequeno traje do evento, pincel e códice.

## Fontes e recortes

| Folha | Células nativas | Dimensão nativa | Ordem |
| --- | ---: | --- | --- |
| `walk-source.png` | 12 | 1024 × 1536 | Sul, oeste, leste, norte; neutro, passo esquerdo, passo direito |
| `attack-source.png` | 6 | 1536 × 1024 | Repouso, preparação, avanço, impacto, continuidade, retorno |
| `cast-source.png` | 6 | 1536 × 1024 | Preparação, livro/pincel, selo, concentração, liberação, retorno |
| `ultimate-source.png` | 8 | 1585 × 992 | Ordem nativa 0…7; contato no quadro 5 |
| `vfx-source.png` | 6 | 1536 × 1024 | Impacto, projétil, proteção, controle, assinatura, ultimate |
| `icons-source.png` | 6 | 1536 × 1024 | Motivos próprios correspondentes às seis funções |
| `companion-source.png` | 4 | 1254 × 1254 | Shin preparado, livro aberto, conjuração, retorno |

Todos os **48 recortes foram inspecionados individualmente**, além das folhas inteiras para conferir continuidade de vestes, direções e isolamento. Não foram observadas silhuetas amputadas nem fragmentos de células vizinhas nos recortes selecionados. Cada figura conserva as duas pernas e os dois pés; livro e pincel usam mãos distintas nas poses de conjuração. Não se trata de uma garantia absoluta de anatomia em toda escala: a leitura no combate e a reprodução final ainda dependem da integração revisada pela raiz.

Os sete PNGs runtime são cópias byte a byte das fontes selecionadas. **A revisão não alterou pixels, dimensões, retângulos de recorte, ícones runtime, retrato ou rosto.** Os PNGs de `review/` são extrações nativas sem redimensionamento, filtros, pintura, mudança de alpha ou limpeza por limiar. A verificação compara todas as linhas RGBA diretamente à fonte.

`prompts.json` conserva os sete prompts exatos selecionados, os paths originais da ferramenta nativa e seus hashes. `prompts-final-three.json`, fornecido pela raiz, preserva os prompts exatos das últimas reparações. Tentativas anteriores conhecidas ficam identificadas separadamente; o manifesto de cada folha determina a fonte aprovada utilizada.

## Âncoras e altura do corpo

`anchor-review.json` registra os valores anteriores e finais. Vinte âncoras de combate passaram do centro ponderado da faixa inferior para o **centro entre as duas sandálias**, preservando a linha de sola original. Nas poses abertas, a faixa automática favorecia apenas o pé mais baixo; os desvios mais claros estavam em ataque 3/5 e ultimate 5/6. O pincel e partículas não definem a posição de apoio do corpo.

`body-metrics.json` distingue o topo do cabelo/máscara do topo do pincel. A caminhada conserva suas âncoras de sola já válidas; sua medida de altura também exclui o pincel carregado. Medidas manuais são aproximações de até três pixels sobre a fonte nativa.

`atlas-entries.json` fornece as mesmas divisões reais de linhas/colunas e todas as âncoras finais para a integração. Fontes não foram encaixadas à força em células uniformes: os manifests registram a geometria nativa efetivamente produzida. Se o exportador comum for executado novamente, `finalize-review.mjs` reaplica a revisão de âncoras e cabeça sem escrever PNGs. O script nunca deve ser usado para substituir uma fonte nova sem uma nova revisão.

## Transparência e validação

O alpha original foi preservado integralmente. O limiar **24** é usado somente para medir bordas e partes visíveis; não remove nem modifica pixels. Todas as 48 células têm zero pixels com alpha acima de 24 tocando suas divisões ou ficando fora do recorte. Os espaços livres incluem alpha realmente zero. Pixels muito suaves com alpha 1…24 podem existir nos limites e estão contados em `verification.json`, sem fingir que todos os gutters são matematicamente alpha zero.

A prévia da ferramenta pode mostrar RGB residual em regiões transparentes; a validação usa o canal alpha, não apenas essa aparência. A verificação também exige igualdade de SHA-256 entre a fonte original, a cópia selecionada e cada PNG runtime, e confirma que o retrato permaneceu intacto.

- `export-review-crops.mjs`: extrai apenas cópias locais de revisão e compara RGBA à fonte.
- `finalize-review.mjs`: registra prompts, ordem e medidas corporais; somente JSON.
- `verify-native.mjs`: confere 48 recortes, limites, alpha, hashes e os seis ícones individuais; grava `verification.json`.

Registro global, retrato/rosto, motor, saves, gameplay, integração no navegador e compilação pertencem à raiz. Nenhum desses arquivos foi alterado nesta revisão.
