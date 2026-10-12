# Ophelia 5★ — Equinócio Branco

Kit gerado com a ferramenta nativa `imagegen`, a partir de `portrait-source.png`, que é a referência corrigida com duas pernas de calça e duas botas. Mika usa a identidade humana de `art-source/v31/companions/mika-source.png`: cabelo loiro, óculos, casaco de inverno e duas botas. O figurino alternativo mantém gelo, marfim, navy e os motivos do equinócio. A máscara da Ophelia fica presa ao chapéu.

## Entrega selecionada

| Atlas | Dimensões nativas | Células | Fonte selecionada | Diagnóstico de alpha |
|---|---:|---:|---|---|
| Caminhada | 1086 × 1448 | 12 | `walk-final-candidate.png` | `walk-final-alpha.json` |
| Ataque | 1536 × 1024 | 6 | `attack-body-candidate.png` | `attack-body-alpha.json` |
| Habilidade | 1536 × 1024 | 6 | `cast-body-candidate.png` | `cast-body-alpha.json` |
| Ultimate | 1536 × 1024 | 8 | `ultimate-repair-candidate.png` | `ultimate-repair-alpha.json` |
| Efeitos | 1536 × 1024 | 6 | `vfx-repair-candidate.png` | `vfx-repair-alpha.json` |
| Ícones | 1536 × 1024 | 6 | `icons-repair-candidate.png` | `icons-repair-alpha.json` |
| Mika | 1024 × 1536 | 4 | `companion-repair-candidate.png` | `companion-repair-alpha.json` |

São **48 células nativas**. Cada arquivo `*-source.png` e o respectivo PNG de execução em `public/assets/v36/variants/ophelia-white-equinox/` preservam os bytes da fonte selecionada. Os sete `*-manifest.json` registram hashes, retângulos, divisões, âncoras e limites visíveis. Os seis ícones individuais em `icons/0.png` a `icons/5.png` são recortes nativos; todas as linhas RGBA foram comparadas à fonte.

### Direções e animação

- A folha de caminhada está em **S, E, W, N**, três poses por direção. O registro de execução deve usar **S, W, E, N**, com a ordem `[0,1,2,6,7,8,3,4,5,9,10,11]` de `walking-directions.json`. Isso remapeia recortes, sem rearranjar pixels.
- Ataque, habilidade e ultimate olham para a direita. A célula 0 do ataque é repouso sem efeitos externos, adequada à formação. As demais poses mostram preparação, gesto, emissão e retorno.
- Corpos e efeitos estão separados. A sequência de efeitos é: **0 impacto glacial; 1 corte/projétil de gelo; 2 flor de cura; 3 selo de controle; 4 santuário do equinócio; 5 coroa/catedral de inverno**. Não há fogo.
- Os ícones representam ataque mágico, estilhaço, cura, controle, assinatura e ultimate. Os rótulos pertencem à interface, sem texto gravado na imagem.
- `companion.png` é sempre o atlas de **quatro poses**: repouso, gesto de conjuração, flor de gelo no impacto e retorno. Os dois keys `companion_<id>` e `companion_event_<id>` usam este mesmo PNG e seus quatro recortes. O Grupo mostra a pose 0; a cinemática acompanha o clock da ultimate. Movimento reduzido mantém a pose 2 estática.
- `companion-fullbody-preview.png` e `companion-event-preview.png` são apenas recortes individuais para revisão, com prova em `companion-crops.json`. Não substituem o atlas de execução.

## Revisão e limites

As sete fontes selecionadas foram inspecionadas visualmente. As poses mantêm duas botas, figurino com cobertura, mãos reconhecíveis e cajado completo. Caminhada e ultimate receberam nova geração para aumentar a separação; a primeira caminhada de uma bota e folhas com efeitos invadindo células foram descartadas. Os arquivos candidatos preservados documentam essas tentativas.

Todos os corredores medidos no diagnóstico final têm alpha exatamente **0**. O exportador também verifica que não há pixels com alpha maior que 24 tocando as bordas de cada célula medida. Caminhada, ataque e Mika têm bordas externas completamente transparentes. Há resíduos externos muito fracos de alpha 1: **16 pixels em habilidade, 9 em ultimate, 59 em efeitos e 2 em ícones**. Nenhum ultrapassa alpha 24. Esses valores estão registrados, sem remoção ou repintura por código. A cor RGB de uma prévia não prova um fundo opaco; o diagnóstico lê o canal alpha real.

As âncoras dos corpos usam o centro de alpha da faixa inferior e a linha da sola. Os corpos não têm efeitos junto às botas. As âncoras dos motivos isolados usam seu centro. A revisão não equivale a certificar ausência absoluta de defeitos em qualquer escala; a validação integrada do jogo continua com a raiz.

## Reprodução do export

Na raiz do repositório:

```powershell
node art-source/v36/export-atlases.mjs art-source/v36/variants/ophelia-white-equinox/entries.json
node art-source/v36/variants/ophelia-white-equinox/export-companion.mjs
node tests/native-sprite-v36.test.mjs
```

O exportador copia fontes nativas somente depois dos gates e não muda cores, alpha ou geometria. `inspect-alpha.mjs` faz leitura e mensuração, sem modificar imagens.

Prompts: `prompts.json`, `sheet-prompts.json`, `body-prompts-final.json`, `repair-prompts.json`, `final-repair-prompts.json`, `walk-revision-prompt.txt`, `walk-final-repair-prompt.txt` e `ultimate-final-repair-prompt.txt`. Cada refinamento foi feito pelo próprio `imagegen`.

O teste `native-sprite-v36` passou **117 verificações**: recorte de raster, margem de letterboxing sem vizinho, dimensões nativas, quatro poses ligadas ao contato real e movimento reduzido.
