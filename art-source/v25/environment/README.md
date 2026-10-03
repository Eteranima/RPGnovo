# Cenários v25 — auditoria e integração

## Fontes selecionadas

As sete imagens finais foram geradas com a ferramenta integrada `image_gen`. Os PNGs selecionados foram copiados sem edição de pixels ou alteração do canal alfa para `public/assets/v25/environment`. Os prompts e as revisões de layout estão em `prompts.json` e `signboard-prompt.json`.

| Asset | Dimensão real | Conteúdo |
| --- | --- | --- |
| `floor-academy.png` | 1254 × 1254 | Pedra do pátio, relva, cais de arenito, ladrilhos botânicos; quatro variações por material |
| `floor-depths.png` | 1254 × 1254 | Mármore do arquivo, ardósia selada, basalto do selo, rocha da galeria; quatro variações por material |
| `floor-wilds.png` | 1254 × 1254 | Solo da mata, trilha de cinza, ruína calcária, basalto da pira; quatro variações por material |
| `floor-water-docks.png` | 1254 × 1254 | Água costeira, água subterrânea, tábuas do cais, gelo; quatro variações por material |
| `scenery-academy.png` | 1448 × 1086, RGBA | Quatro árvores, quatro canteiros, quatro estantes diferentes |
| `scenery-ruins.png` | 1448 × 1086, RGBA | Quatro colunas, quatro ruínas de colunas, quatro árvores de cinza diferentes |
| `signboards.png` | 1448 × 1086, RGBA | Doze placas existentes com layout reparado, silhuetas completas e espaço transparente entre sprites |

Total: 64 amostras de piso/água, 24 sprites de cenário e 12 placas com layout reparado. As duas folhas novas de objetos têm, respectivamente, 796.944 e 933.310 pixels completamente transparentes.

## Varredura dos dez cenários

| Cenário | Problema encontrado | Integração final |
| --- | --- | --- |
| Pátio Central | Relva e pedras globais; somente duas árvores e um canteiro repetidos | Pedra clara com musgo, relva com trevo, quatro silhuetas de árvores, canteiros distintos e atmosfera mais legível |
| Ala de Estudos | Mesmo piso escuro dos subterrâneos e nove cópias da mesma estante | Mármore antigo com detalhes de latão, quatro modelos de arquivo com livros, globo, pergaminhos e vitrine |
| Subterrâneo Selado | Piso, água e pilares compartilhados com todas as masmorras | Ardósia azul, água profunda, pilares e fragmentos medidos, bordas claras de paredes |
| Câmara do Selo | Piso global e colunas repetidas | Basalto violeta com vestígios de anéis, colunas distintas, luz fria violeta |
| Porto Lúmina | Mesmo calçamento do pátio e pequena textura de madeira repetida | Arenito marítimo, madeira com quatro variações, água costeira e bordas estruturais do cais |
| Domo de Herbologia | Relva e canteiro idênticos ao pátio | Ladrilhos de sálvia com detalhes botânicos, quatro canteiros e árvores de silhuetas diferentes |
| Galeria Profunda | Mesmo piso do subterrâneo | Rocha mineral com veios discretos, água profunda, colunas e fragmentos próprios da folha nova, luz turquesa |
| Mata Cindária | Relva verde da Academia e cinco cópias da mesma árvore | Solo com folhas carbonizadas, trilha de terra/cinza e quatro formas de árvores cindárias |
| Ruínas da Vigília | Relva e calçamento comuns | Pedra fraturada com musgo na trilha, solo de mata, ruínas e árvores diferentes, água escura |
| Clareira da Pira | Piso escuro comum das masmorras | Basalto carbonizado com fissuras quentes discretas e cinza, atmosfera em âmbar |

A arquitetura principal, barcos, forja, cristais, portais, objetos de missão e luminárias aprovados foram preservados. A inspeção do jogo também encontrou um defeito anterior: os recortes das placas pressupunham uma folha 1536 × 1024, mas a fonte real era 1448 × 1086 com espaçamento irregular, mostrando partes de placas vizinhas. A reparação de layout conserva as doze identidades e sua ordem; `signboard-final-bounds.json` registra cada recorte nativo. Repetições de mobiliário estrutural coerentes com cada lugar continuam possíveis; a variedade agora acompanha o bioma e os objetos mais repetidos têm formas diferentes.

## Recortes, navegação e estabilidade

O gerador produziu espaços de linhas diferentes do grid solicitado. Por isso `sprite-bounds.json` contém recortes individuais medidos no alfa, usados por `lib/game/environment.ts`; nenhum recorte pressupõe células uniformes nas folhas de objetos. `inspect-alpha.mjs` apenas lê os pixels para produzir metadados e não reescreve imagens. Os desenhos conservam a proporção original, a silhueta completa e a âncora na base.

A escolha de variações usa coordenadas do mundo e identificador do mapa: deslocar a câmera ou avançar o tempo não muda as texturas. Os pisos são pintados uma vez em cache limitado a três mapas. Mudanças da ponte de gelo invalidam o cache pela assinatura das linhas do mapa. Todas as coordenadas de entidades, trajetos, obstáculos, colisões, saídas e travas de missões permanecem nas definições existentes.

## Verificação

- Inspeção visual das sete imagens selecionadas, inclusive transparência e silhuetas após a revisão de layout das folhas de objetos e placas.
- Checagem de tipos com `tsc --noEmit`: passou durante a integração.
- `node tests/environment.test.mjs`: 17.024 verificações passaram nos dez mapas, cobertura de todos os tipos de terreno, fonte de cada célula, recortes de materiais sem vazamento, variações estáveis, 24 recortes alfa medidos, 12 placas reparadas, limite de cache e atualização na ativação/expiração da ponte de gelo.
- Inspeção visível da composição completa dos dez mapas na prévia local, usando os mesmos métodos de chão, cenário e entidades de `WorldRenderer`: pisos, leituras de bioma e recortes de objetos aprovados. A checagem encontrou e encaminhou a correção das placas antigas.
- Ava parada e os quatro passos do ciclo, ao sul, oeste, leste e norte, conferidos com o método real `WorldRenderer.actor`: corpo estável no eixo, silhuetas completas, direções cardinais corretas, sem fragmentos das células vizinhas nas vistas examinadas.
- Após a integração da folha reparada e dos doze recortes nativos, Porto Lúmina, Mata Cindária e Domo de Herbologia foram revistos: placas completas, símbolos corretos e sem fragmentos vizinhos.
- A página temporária de revisão foi removida após a inspeção; sua fonte foi arquivada em `visual-review-route.txt` para registrar o método da checagem.
