# Max — Réquiem do Trovão · arte final v36

Sete folhas finais próprias, geradas pelo imagegen nativo, sem redimensionamento, máscara ou retoque por código. Referências: retrato final de Max nesta pasta e Vajra humano chibi em art-source/v31/companions/vajra-source.png.

## Seleção
- walk.png: 12 poses em 3×4, ordem sul/oeste/leste/norte, três fases por direção.
- attack.png: seis poses, 3×2, combate à direita; repouso inicial sem descarga elétrica. A pequena coroa metálica de pregos é ornamento estático.
- cast.png: seis poses, 3×2, corrigida por nova geração após duas candidatas com efeitos cruzando separadores.
- ultimate.png: oito poses, 4×2; carga de pregos e condução elétrica, anatomia adulta e roupa completa.
- vfx.png: seis motivos isolados na ordem impacto, projétil, proteção, controle, assinatura, ultimate.
- icons.png: seis motivos próprios; icons/0.png…5.png são recortes RGBA nativos.
- companion.png: quatro poses de Vajra humano chibi, cabelo loiro/preto e olhos dourados, roupa de regente coberta e meia máscara.

As seis folhas maiores que passaram nos separadores foram preservadas para manter os detalhes. A conjuração selecionada é a geração compacta que corrigiu o cruzamento. As outras versões compactas permanecem como alternativas de proveniência; não foram publicadas no runtime.

## Medição
Os sete manifests são a autoridade para dimensões, recortes, âncoras e SHA-256. Medição considera alpha>24, sem alterar o canal alpha original. Todas as células finais têm zero pixels visíveis em suas bordas medidas; todas as fontes têm espaço de fundo com alpha exatamente0. Isso verifica separação de peças, não promete ausência de qualquer resíduo de alpha baixo. Margens e ocupação real variam por pose e constam no manifesto.

Runtime recebe cópia byte a byte das fontes selecionadas. Os seis ícones individuais têm cada linha RGBA comparada à região original. Exportador comum de autoria: art-source/v36/export-atlases.mjs. atlas-entries.json aponta apenas para as sete fontes escolhidas. Fontes recusadas e prompts de refinamento são preservados e identificados.

A inspeção visual conferiu pés, dois braços/duas pernas, mãos enluvadas, posição direita e figurino coerente. Não há pet animal substituindo Vajra. A integração global de chaves/âncoras e QA no palco pertence ao root.
