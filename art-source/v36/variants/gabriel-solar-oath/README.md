# Gabriel — Juramento Solar · arte final v36

## Kit humano e Dante
Retrato aprovado reenquadrado com imagegen nativo, preservando rei-lobo humano, cabelo copper/ivory, máscara/armadura bronze-obsidiana e capa crimson. Fonte anterior portrait-rejected-clipped.png guardada. Retrato novo1024×1536: contorno visível começa em(52,98), termina em(984,1435), com zero pixel alpha>24 nas bordas; fonte/runtime byte idênticos,794649pixels de alpha0.

Sete folhas próprias em public/assets/v36/variants/gabriel-solar-oath:
- walk:12poses,3×4,1024×1536, S/W/E/N conferidos; segunda linha foi regenerada para corrigir direção.
- attack:6poses,3×2,1536×1024, socos à direita, repouso sem fogo.
- cast:6poses,3×2,1536×1024, contato solar e proteção; regenerada após capeamento tocar borda.
- ultimate:8poses,4×2,1536×1024, contato no quadro5; regenerada após efeito invadir separador.
- vfx:6motivos próprios,3×2,1536×1024, impacto/projétil/proteção/controle/assinatura/ultimate.
- icons:6ícones próprios,3×2,1536×1024; icons/0…5.png recortes nativos.
- companion:4poses,2×2,1254×1254; Dante FÊNIX branca/dourada com fogo orange/crimson, broche solar bronze. Exatamente duas asas/duas patas por pose; primeira candidata com patas dianteiras extras foi rejeitada, anatomia e separação corrigidas por geração.

Todas as folhas humanas finais e Dante passaram os gates do exportador comum: células separadas por linhas/colunas sem alpha visível, zero pixel alpha>24 nas bordas dos recortes medidos, fundo com alpha0 real, cópias source/runtime byte a byte. O RGB escondido do fundo pode parecer marrom no visualizador; não é um matte opaco. Medição usa alpha>24 sem reescrever transparência; não promete ausência de qualquer resíduo de alpha baixo. Cada manifest registra recortes, âncoras, margens/limites, hashes e fonte escolhida. Candidatas recusadas e prompts de reparo permanecem nesta pasta.

## Lycan Solar
Quatro folhas novas adicionais mantêm lobo antropomórfico branco adulto canônico, duas mãos/dois pés e uma cauda, com roupa solar bronze/obsidiana e capa crimson. Campos runtime lycan-walk,lycan-attack,lycan-cast,lycan-ultimate; manifests e entradas próprias medem cada pose. Os kits de regras/companheiro/ícones continuam pertencendo à versão Gabriel — Juramento Solar.

A ultimate Lycan final tem maior contato no quadro nativo4. A reprodução usa a ordem [0,1,2,3,5,4,6,7], colocando o contato no frame de execução5; `lycan-ultimate-playback.json` registra a ordem e os recortes sem mudar os pixels. Cast/ultimate Lycan foram regenerados após efeito tocar separador; a caminhada e ataque passaram na primeira fonte. As quatro folhas passaram os mesmos gates alpha/bordas e cópia nativa.

## Integração
Nenhum pixel foi mascarado/pintado/redimensionado por código. Somente cópias de fontes e recortes RGBA nativos permitidos. Registry global, faces e resolver de forma são da raiz. Antes da integração, heroArtIdV36 ignorava gabrielForm quando havia versão equipada; as novas folhas existem para permitir que a seleção Lycan continue mudando o corpo. Resolver visual não deve perder a ligação com a definição premium ao usar outra chave de arte, pois assinatura/ultimate/companheiro precisam manter o kit Solar.
