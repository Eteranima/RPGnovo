# Auditoria elemental — 3 de outubro de 2026

O conjunto jogável contém nove personagens. Abel existe na convocação, mas ainda não está em `PLAYABLE_HERO_IDS`; não foi apresentado como personagem jogável auditado.

| Personagem | Elemento do ataque básico | Habilidades | Ultimate | Correção |
| --- | --- | --- | --- | --- |
| Seiji | Tinta | Tinta / controle | Tinta | Impacto genérico passou a respeitar Tinta também no básico. |
| Ophelia | Gelo | Gelo, cura e limpeza | Gelo / proteção e cura | Removido o fallback de Fogo das ações de suporte; básicos e duelos usam os frames glaciais. |
| Marin | Trevas | Trevas, dreno e estados | Trevas | Básico e respiro não herdam mais o impacto de Fogo. |
| Gabriel | Fogo | Fogo / guarda | Fogo / proteção | Fogo permanece reservado às suas ações e às ações ígneas da Pira. Forma licantrópica preservada. |
| Max | Eletricidade | Eletricidade / proteção | Eletricidade | Removido impacto de Fogo emprestado. Sprites elétricas existentes permanecem. |
| Beatriz | Água | Água, Trevas, cura | Água / Trevas | Água agora usa sua arte líquida própria, sem a camada genérica de Gelo. Selo Umbral permanece Trevas. |
| Orfeu | Físico, sem elemento | Antimagia / guarda | Físico / antimagia | Fallback de Fogo e cor elemental removidos; ficha de convocação alinhada a Sem Elemento. |
| Ava | Terra | Punho de Estratos / Seiva da Terra | Soberania da Terra | Terra substitui Natureza. Rocha, estratos e poeira próprios em ataques; prisão de pedra substitui congelamento. |
| Carmilla | Sangue | IN AETERNUM VIVE | Sangue / cura e guarda | Sem impacto genérico de Fogo. Arte de fios carmesins e regras da transferência preservadas. |

## Implementação e compatibilidade

`combatElement` é usado pelo motor, pelos comandos, pela batalha e pela cinemática. A animação registra a identidade elemental antes do impacto; duelos herdam a identidade do personagem adversário. Não foi acrescentado um sistema de resistências ou vantagem elemental: a fórmula numérica de dano existente foi preservada.

As IDs antigas de Ava (`vine-strike`, `garden-heal`, `vine-growth`, `ava-*`) foram mantidas. Saves anteriores derivam Terra a partir da base corrigida, mesmo que a cópia serializada do personagem ainda diga Natureza. Raridade 5★, MAIL, vínculos, constelações, missões e inventário continuam compatíveis.

As técnicas temporárias de exploração de Ava, Orfeu e Max também caíam na cor de Tinta. Agora usam Terra, neutro e Eletricidade, respectivamente. O Passo de Vajra já existia nos dados, mas uma verificação de nó vazio impedia seu uso; essa condição foi corrigida sem alterar custo ou duração da técnica. As técnicas de Tinta, Gelo, Trevas e Fogo conservaram a identidade existente.

`bind` representa a prisão de pedra de Ava. A perda de uma ação, duração e limite de uma imobilização por batalha são os mesmos da implementação anterior; `freeze` permanece específico do controle glacial. A camada visual de Gelo não é usada para `bind`.

## Earth VFX

Asset: `public/assets/v25/ava/ava-earth-vfx.png`, gerado com o tool nativo imagegen e uma revisão de extração de fundo. Prompt completo em `art-source/v25/ava-earth-vfx-prompt.txt`. PNG RGBA 1536 × 1024, grade 3 × 2, seis efeitos de arenito estratificado: preparação, ascensão, impacto, prisão, ruptura e dispersão.

Inspeção de alpha real do PNG aceito: 1.041.300 pixels totalmente transparentes, 531.564 parcialmente transparentes e alpha máximo 254. A exportação possui 97 pixels de alpha 1–8 nas bordas das células completas. Nenhum pixel de alpha maior que 8 ocupa essas bordas. Os sprites visíveis têm ao menos 48 pixels de margem horizontal. O asset foi preservado sem reconstrução de alpha ou edição de pixels.

Os seis recortes de runtime medidos excluem 32 pixels de cada lado da célula de 512 × 512: `(32,32,448,448)`, `(544,32,448,448)`, `(1056,32,448,448)`, `(32,544,448,448)`, `(544,544,448,448)`, `(1056,544,448,448)`. As bordas dos recortes não contêm rocha ou poeira visível de células vizinhas. O básico pula o frame da prisão; cura usa a preparação baixa e a dispersão; o estado de prisão usa o quarto frame.

## Verificação

- `tests/elements.test.mjs`: nove personagens, básicos, habilidades base e árvore, ultimates, técnicas temporárias de exploração, identidade de animação, Terra sem congelamento, Gelo preservado, compatibilidade de saves e alpha/recortes do novo VFX.
- `tests/recruit-mail-carmilla.test.mjs`: MAIL, seletor 5★, duelos e Carmilla.
- `tests/carmilla.test.mjs`: alvos, empates, transferência de 15%, sem ressuscitar.
- `tests/progression.test.mjs`: árvore, estados, conjuntos e migração.
- Checagem TypeScript sem erros.

A leitura das artes existentes confirmou Gelo nas folhas de cast/VFX de Ophelia, Água/Trevas no VFX de Beatriz, antimagia física em Orfeu, eletricidade no combate de Max e fios de Sangue em Carmilla. A revisão das novas folhas de personagem de Ava e a verificação final em tela integram o relatório de artes do lote v25.

## Revisão final em tela

Os componentes reais `BattleScene` e `UltimateCinematic` foram inspecionados no navegador local, com estado de combate controlado e relógio fixo em uma rota temporária. Foram vistos os básicos dos nove personagens, todas as habilidades base e de árvore, as nove ultimates, a prisão mineral e as oito poses da ultimate de Ava. A execução mecânica e os números reais são cobertos pelos testes do motor; os valores mostrados nas imagens são apenas dados da revisão visual.

- Ava: corpo, mãos, pernas e pés completos nas oito poses; ancoragem dos pés estável; pedras e arenito visíveis no básico, habilidade, cura e ultimate. Os polígonos procedurais dourados que encobriam a textura das rochas foram removidos. O VFX aceito mantém os recortes e a transparência documentados acima.
- Orfeu: a folha antiga deixava entrar parte da mão da pose anterior. A folha nova `public/assets/v25/orfeu/orfeu-antimagic-combat.png` foi integrada às três ações, com doze recortes medidos pelo responsável das artes. Ataque, cast e ultimate exibem membros completos e antimagia neutra.
- Carmilla: tamanho do corpo e enquadramento ajustados à posição de retaguarda; a escala é calculada para a sequência inteira, evitando cabeça cortada e oscilação de tamanho entre quadros. Arte aprovada e transferência de Sangue preservadas.
- Cinemáticas: todos os atores usam um frame individual, com legenda compacta e cor do elemento real. A legenda de diálogos deixava um painel branco grande sobre o corpo; a regra agora é específica da cinemática de combate. Os impactos e pés ficam dentro da área visível após a aproximação inicial da câmera.

Evidência final: `docs/qa-v25/ava-earth-showcase.jpg` mostra somente a cena; `element-ava-final.jpg`, `element-ava-cinematic.jpg`, `element-orfeu-attack.jpg`, `element-orfeu-cinematic.jpg` e `element-carmilla-attack.jpg` documentam as correções. As outras imagens `element-<herói>-<ação>.jpg` registram a varredura elemental; `element-visual-observations.json` guarda os elementos e frames observados. A rota `app/qa-elements/page.tsx` foi removida ao encerrar a revisão; não há controles ou relógio de teste na aplicação final.
