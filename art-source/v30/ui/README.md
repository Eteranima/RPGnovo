# UI v30 — invocação, menus e abertura

Artes finais próprias, geradas com o imagegen nativo e integradas em `public/assets/v30/ui/`. A identidade mantém fantasia anime, prata/ouro/lápis, companheiros de Stone Reach e áreas de texto controladas pelo jogo. Os prompts, fontes selecionadas e medições permanecem nesta pasta.

## Inventário e integração

O conjunto contém **19 PNGs de runtime**: 13 fontes/folhas completas copiadas e seis placas recortadas. `lib/art/gachaV30.ts` exporta `GACHA_ART_V30` e `GACHA_FRAMES_V30`, com **61 retângulos nativos medidos**.

| Arte | Arquivos de runtime | Quadros registrados | Uso |
| --- | --- | --- | --- |
| Raridades 1–4 | `gacha-tier1.png` até `gacha-tier4.png` | 8 por raridade, grade 4×2 | Ritual distinto por raridade |
| Raridade 5 | `gacha-tier5-cinematic.png` | 16, grade 4×4 | Sequência cinematográfica lendária |
| Santuário | `gacha-sanctum.png` | 1 | Cenário da convocação de personagens e auras |
| Menus | `menu-library.png`, `menu-armory.png`, `menu-atlas.png` | 1 por imagem | Biblioteca/técnicas, equipamentos/bolsa e mapa |
| Abertura | `opening-companions.png`, `opening-ink-garden.png`, `opening-star-watch.png` | 1 por imagem | Grupo dos companheiros, Jardim da Tinta e Vigília das Estrelas |
| Placas | `gacha-plaques.png` e `plaque-0.png` até `plaque-5.png` | 6 na folha 2×3 | Botão de invocação e molduras dos resultados |

As placas e os quadros do ritual recebem rótulos, custos, raridade e resultados reais por DOM. Os cenários mantêm a composição ilustrada. A abertura reúne Umbra, Mika, Shin, Vajra e Dante; as três cenas podem ser selecionadas pelos controles da galeria.

## Fontes, pixels e recortes

- `prompts.json`: solicitações e caminhos originais das gerações selecionadas.
- `manifest.json`: dimensões nativas, hashes SHA-256 e registro da exportação.
- `crops.json`: os 61 retângulos usados no módulo de arte.
- `alpha-proof.json`: transparência e contagens de pixels de borda por célula RGBA.
- Os PNGs nesta pasta são as fontes arquivadas; as folhas completas de runtime preservam seus bytes. As seis placas são crops retangulares com RGBA igual à janela correspondente, sem resize, recoloração, pintura, máscara ou alpha sintético.
- Na folha cinematográfica 5★, cada retângulo exclui 4px dos separadores ilustrados em cada lado. As placas são medidas por alpha>210 e recebem até 4px de margem nativa dentro da célula.

O registro de alpha contabiliza **seis pixels de borda acima de 210 no agregado**: três na célula 3 e três na célula 5 de `gacha-plaques`. São vestígios pequenos do desenho gerado, preservados na exportação; este registro não afirma que todas as bordas têm zero pixels visíveis. Fontes e recortes foram revisados visualmente no jogo.

## Correção de Shin

O primeiro `opening-companions` foi rejeitado porque a roupa/pernas de Shin sugeriam uma terceira perna. Essa fonte permanece em `rejected/opening-companions-extra-leg.png`. A edição nativa selecionada mantém o grupo e corrige Shin para duas pernas e dois pés coerentes, sem alterar manualmente os pixels.

`shin-repair.json` preserva o prompt, o caminho da geração corrigida e o motivo da rejeição. `opening-companions.png` nesta pasta e no runtime é a versão corrigida; o prompt selecionado e seu hash constam também nos registros de exportação.

## Movimento e regras verificadas

Durante a QA nesta máquina, `prefers-reduced-motion: reduce` estava ativo. O ritual apresenta o último quadro da raridade com essa preferência, preservando o tempo da sequência e a revelação real do resultado. A galeria de abertura não alterna automaticamente nessa condição e mantém seus controles manuais. Sem essa preferência, as raridades 1–4 percorrem oito quadros e a raridade 5 percorre 16, com transição entre os quadros.

`gacha-v30.test.mjs` passou **1.231 verificações** de probabilidades, pity, recompensas, destaque de maior raridade, pagamentos/bloqueio entre sequências, isolamento de timers após reset/reload e fases cinematográficas. `party-hotkeys-v30.test.mjs` passou **214 verificações** dos atalhos 1–5/Tab, ordem e vitais do grupo, seleção por modo/menu/repetição e persistência do líder. A apresentação não duplica a concessão de recompensas do motor.

## Reprodução da exportação

O exportador fica em `art-source/v30/ui/crop_native.py`; usa Python com Pillow e NumPy. Ele resolve a raiz do repositório a partir de `parents[3]`, lê os jobs em `prompts.json` e prefere o caminho original da geração quando disponível. Se esse caminho não existir na máquina, usa o PNG selecionado arquivado nesta pasta. A cópia verifica se origem e destino são o mesmo arquivo, evitando `SameFileError` quando a fonte arquivada já é o input.

A execução explícita recria os 19 PNGs de runtime, os registros de dimensões/recortes/alpha e `lib/art/gachaV30.ts`. Nesta manutenção, somente o script e este README foram alterados: nenhuma fonte, exportação ou implementação React foi reexecutada.
