# Artes nativas do Circuito dos Despertos · v39

Validação de 12/10/2026, retomando a finalização do modo auto battler.

## Integração concluída

O registro `lib/art/autoChessArtV39.ts` continha mapas vazios de peças, itens e efeitos. As fontes finais já estavam selecionadas e disponíveis. `art-source/v39/autochess/register-assets.mjs` foi executado primeiro com `--inspect-only` e depois para registro, após inspeção visual. O registro final passou 345 verificações e contém:

- 23 peças: dez personagens base, oito alternativos e cinco companheiros; quatro quadros de idle, ataque e habilidade por peça, totalizando 276 quadros.
- 20 ícones: cinco componentes e quinze equipamentos fabricados.
- Três efeitos: fusão, fabricação e vitória; 24 quadros cada, totalizando 72 quadros.
- Três tabuleiros de 1254 × 1254 pixels e a ilustração de abertura final de 1672 × 941 pixels.

As 18 fontes humanas foram copiadas para `art-source/v39/autochess/pieces/` e `public/assets/v39/autochess/pieces/`. O processo preserva os bytes originais dos PNGs; não houve edição de pixels, reconstrução de quadros, remoção artificial de fundo ou regeneração. O registro inclui recortes medidos, âncoras e altura corporal para manter a escala das peças. Os prompts e fontes estão nos arquivos de seleção e no manifesto final.

## Evidências e limites

As 18 fontes listadas em `18-ready-human.json` existem. A inspeção retornou `failures: []`: todos os quadros contêm arte, têm pixels distintos e não possuem pixels de alpha ≥ 16 nas bordas dos recortes medidos. Todas as peças, ícones e efeitos têm transparência RGBA real, com pixels de alpha zero. Nas fontes humanas, o maior alpha residual observado em bordas foi 15; portanto, a validação não afirma que cada pixel de margem possui alpha exatamente zero.

Foram examinadas visualmente montagens das dez peças base, oito alternativos, cinco companheiros, 20 itens, três efeitos e três tabuleiros. As montagens mostraram silhuetas completas, efeitos isolados, variação entre poses e pisos livres. Ava usa terra/folhas, Ophelia gelo e Orfeu efeitos físicos. Não foi observado defeito concreto nessas montagens. Essa inspeção em escala reduzida não substitui uma auditoria de cada detalhe anatômico em resolução nativa nem a verificação do combate em navegador.

Os três tabuleiros compartilham área lógica quadrada central (`x/y = 0.125`, `width/height = 0.75`), compatível com a grade interativa de oito por oito. As margens de pintura do canvas permitem poses e indicadores próximos às casas de borda sem alterar a posição lógica das casas.

Relatórios reproduzíveis:

- `art-source/v39/autochess/registration-inspection.json`: cortes, pixels visíveis, hashes e medidas de corpo/âncoras das 18 fontes humanas.
- `art-source/v39/autochess/manifest.json`: fontes, prompts, dimensões, hashes e integração final.
- `art-source/v39/autochess/companions/manifest.json` e `items-and-fx/manifest.json`: inspeção das folhas compartilhadas.
- `tests/auto-chess-art-v39.test.mjs`: impede registros vazios ou incompletos, exige cobertura de catálogo, hashes/bytes source-public, dimensões, transparência validada, recortes/âncoras válidos e sequências completas.

## Reprodução

```text
node art-source/v39/autochess/register-assets.mjs --inspect-only
node tests/auto-chess-art-v39.test.mjs
```

O teste de arte passou com 1527 verificações: 23 peças, 20 itens, três efeitos e 31 PNGs. Os hashes atuais correspondem aos relatórios e os arquivos arquivados são idênticos aos servidos pelo jogo.

A verificação em navegador do modo completo é registrada separadamente da validação das fontes.
