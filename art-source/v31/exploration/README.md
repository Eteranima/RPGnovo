# Caminhadas v31 — Abel e Orfeu

Oito folhas finais RGBA, quatro por personagem. Cada folha tem oito poses de uma única direção; a ordem das direções é **Sul, Oeste, Leste, Norte**. Total: **64 poses**. As folhas são geradas individualmente; nenhuma direção foi espelhada ou montada a partir de pixels repintados.

## Fontes e identidade

- Abel: referência `public/assets/v29/abel/portrait.png`, adulto de cabelos vermelhos, óculos dourados, manto acadêmico vermelho/dourado, botas negras e cajado de cristal vermelho.
- Orfeu: referência `public/assets/characters/dlg_orfeu.webp`, adulto de cabelos brancos, braços musculosos, mãos enfaixadas, traje azul escuro, faixa azul e bordados dourados.
- Padrão: anime de fantasia com contorno limpo e sombras em cel shading, seguindo a identidade aprovada do elenco.

O **image_gen integrado** gerou todas as imagens, com `transparent_background: true`. Prompts e referências exatas ficam em `prompts-initial.json`, `prompts-directional.json` e `prompts-spacing-repair.json`; `jobs.json` e `spacing-jobs.json` registram a origem das gerações. As fontes finais `*-source.png` estão arquivadas aqui e bastam para reproduzir a exportação.

## Revisão e reparos

As primeiras folhas de 32 quadros repetiam a passada. Foram rejeitadas e arquivadas em `rejected/`; as oito novas folhas distinguem contato, apoio, passagem e elevação do joelho, alternando as duas pernas. As laterais de Abel passaram por uma edição adicional no image_gen para abrir os espaços entre mantos/cajados e seus vizinhos.

As fontes finais foram revisadas quanto a rosto, figurino, mãos, duas pernas, pés completos, direção e variações da passada. Os recortes usam os corpos medidos pelo alpha, sem cortar ou apagar pixels. A revisão reduz os riscos observados; não é uma alegação de ausência absoluta de defeitos.

## Exportação e consumidor

`export_native.py` copia os oito PNGs **byte a byte** para `public/assets/v31/exploration/`, mede recortes/âncoras e grava `manifest.json` e `lib/game/explorationArtV31.ts`. Requer Pillow e NumPy; usa o medidor de componentes de alpha existente em `art-source/v29/seiji/measure_native.py`. Não redimensiona, colore, espelha, remove fundo ou altera alpha.

- `EXPLORATION_ASSETS_V31`: oito chaves `walk_{abel|orfeu}_{south|west|east|north}`, mais os aliases existentes `abel`/`orfeu` apontando para a folha Sul.
- `EXPLORATION_FRAMES_V31`: oito recortes por folha; aliases Sul usam os mesmos recortes. As coordenadas são sempre relativas à folha da chave.
- `explorationWalkFrame(actor, facing, time, moving)`: oito poses a cada95ms, com quadro2 parado. Mantém S/W/E/N do motor e fornece folha, índice e recorte.
- `WorldRenderer.actor()` usa a folha escolhida e a âncora dos pés para a escala existente de107px. Outros personagens preservam o consumidor anterior.
- Abel continua NPC/invocação/aura. Sua chamada de NPC usa direção da patrulha e oito quadros; nenhuma regra de party, convocação ou `HeroId` foi alterada por este kit.

## Validação

Exportação: **360 verificações** em oito folhas/64 poses. Foram conferidos RGBA nativo, hashes de cópia, oito quadros distintos, âncoras dentro do próprio recorte, corpo isolado e bordas sem pixels de alpha>24. Alpha fraco do gerador é preservado; não foi apagado para simular transparência.

`tests/exploration-v31.test.mjs`: **654 verificações aprovadas**, abrangendo este kit e os cinco companheiros. Exercita a escolha real por `WorldRenderer.actor()` para todas as direções/poses, incluindo Abel NPC; compara bytes RGBA e confirma que as faces dos companheiros não entram no preload do cenário. Verificação TypeScript também concluída sem erros.
