# Éter Anima — expansão e inimigos v30

## Conteúdo final

- Jardim Lunar (32×24), ramificação opcional do Domo após o capítulo; acesso ao Observatório.
- Observatório Partido (26×23), retorno ao Jardim e às Ruínas da Vigília.
- Cervo da Geada Lunar (Gelo), Vigia Rúnico (Tinta), Guardião do Astrolábio (Eletricidade, três fases).
- Ultimates próprios das dez famílias: sete existentes e três novas.
- Duas paisagens de combate, dezesseis superfícies de piso e oito objetos próprios em linguagem anime de fantasia.
- Os mapas mantêm o capítulo antigo e seus IDs; os novos caminhos usam stage5. O chefe é opcional e paga a relíquia Coração das Três Órbitas e cinco tokens.

## Integração

Dados: `lib/game/expansionV30.ts`.
Registro final de PNGs, recortes e apresentação: `lib/game/enemyArtV30.ts`.
As alterações compartilhadas de motor/dados/UI são integradas pela raiz.

Exportações do registro: ENEMY_ASSETS_V30, ENEMY_FRAMES_V30, EXPANSION_FLOOR_ROWS_V30, ENEMY_PRESENTATION_V30, ENEMY_ULTIMATE_EFFECTS_V30.
Cada ultimate tem oito poses cronológicas: repouso, antecipação, concentração, preparo, disparo, contato, continuidade, recuperação.
Os quadros de ataque em repouso são livres de partículas; cristais, olhos e jóias próprios continuam parte do corpo.

## Fontes e preservação

Geração exclusivamente pelo built-in image_gen. As referências locais foram visualizadas antes da geração. Identidade anime com contorno limpo e cel shading; criaturas existentes preservam silhuetas, armaduras e motivos.
`selected.json` guarda fonte absoluta, prompt exato, tipo e grade selecionada.
`enemies/<família>/<tipo>-source.png` e `world/<grupo>/<tipo>-source.png` guardam fontes escolhidas byte a byte. Cada fonte possui prompt e manifesto com SHA256, tamanho, bounds, alpha, células e âncoras.
Variantes rejeitadas e seus prompts ficam em subpastas `rejected`, indexadas por `rejected-variants.json`.
A fonte nativa única usada para corrigir o lado do Vigia fica em `enemies/runewarden/reference-left-idle.png`.

Nenhuma imagem foi redimensionada, recolorida, mascarada, redesenhada ou teve o alpha substituído na exportação. Folhas/runtime são cópias nativas; corpos/estados individuais são apenas recortes PNG RGBA, com comparação de todas as linhas de pixels contra a fonte.
Alpha>24 serve somente para medir silhueta e encontrar gutters. Não é aplicado aos arquivos. As margens do recorte continuam com o alpha original, inclusive bordas semitransparentes.

## Verificação

- `validate-maps.mjs`: 86 verificações, todas aprovadas. Regra exata do motor para tiles/obstáculos. Jardim614 e Observatório455 células alcançáveis; todas18 entidades e todos destinos/spawns alcançáveis.
- `export-native.mjs`: exige silhuetas existentes, alpha real em espaços livres, gutters medidos sem contato visível, limites inteiros, células completas; grava manifestos.
- `build-registry.mjs`: confere fonte selecionada atual, SHA256, recortes, âncoras, arquivos existentes e preservação RGBA nos corpos derivados; gera o módulo tipado e `registry-manifest.json`.
- Revisão visual independente de UI: sete ultimates existentes e quatro conjuntos de cenário, silhuetas completas/motivos coerentes. Ajustamos âncoras moth/cinder para acompanhar o corpo, não a explosão.
- O runtime final também precisa da revisão da raiz no combate e nos dois mapas; os dados deste pacote registram geometria/arte, não fazem uma afirmação de QA de navegador.

Pisos: PNG1254×1254; limites verticais nativos `[0,314,627,941,1254]`.
Objetos: árvore prateada0, árvore lavanda1, relógio lunar2, flores prateadas3, telescópio4, coluna partida5, mesa celeste6, lanterna7.
Fases do Guardião: corpo1/2/3 próprios, limites de vida0.66 e0.33; sua disponibilidade, dano e recompensas ficam nos dados/motor.
