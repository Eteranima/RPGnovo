# Max — remake v29

- Elemento: Eletricidade. Identidade, figurino e companheiro Vajra preservados conforme referências locais.
- Ferramenta: imagegen integrado. Fontes PNG RGBA nativas, prompts e manifests individuais estão nesta pasta.
- Retrato inteiro: portrait-source.png. Runtime portrait.png é cópia nativa. face.png é apenas o retângulo faceCrop de portrait-manifest.json, sem redimensionamento nem pintura.
- Walk: 12 poses S/W/E/N, três fases por direção. Ataque e técnica: 6 poses cada. Ultimate: 8 poses. Todos os atores de combate olham para a direita; ataque0 fica em repouso sem VFX.
- VFX6 e ícones6 seguem a ordem abaixo. Cada ícone direto icons/0.png…5.png preserva os pixels da folha icons-source.png.
- Técnica de assinatura: Circuito de Pregos. Ultimate: Crucificação do Trovão. O motor mantém IDs e saves compatíveis; este pacote entrega somente arte e recortes.

## Recortes e transparência

Cada manifest registra tamanho real, SHA256, limites alpha, alpha0 real, corredores vazios, recortes e âncoras. O limiar alpha>24 identifica a parte visível e desconsidera a névoa de exportação de baixa opacidade; o canal alpha original não é alterado. Todas as bordas dos recortes medidos têm zero pixels alpha>24. Os corredores são medidos por linha; não assuma um grid uniforme.

As âncoras de combate seguem a cintura inspecionada e o último pixel visível dos pés. Caminhada usa o eixo do torso e os pés. VFX/ícones usam centro do recorte. O arquivo ../gabriel/measure-remake.py reproduz a medição e as exportações nativas, sem alterar escala/pixels.

O RGB dos pixels transparentes pode conter o gradiente do exportador; ele permanece invisível com alpha0. Os manifests de retrato incluem amostras vazias dentro da imagem, além das bordas, e contagem de pixels totalmente transparentes para verificar que não existe um quadro opaco de fundo.

## Ordem das seis peças

- VFX: impacto básico; projétil/corte; proteção/cura; controle; assinatura; ultimate.
- Ícones: ataque mágico; técnica base1; técnica base2; controle; assinatura; ultimate.

## Revisão visual

Retratos, folhas completas, direções, mãos, armas e isolamento foram inspecionados. Cast e ultimate foram refeitos para manter pregos e eletricidade em sua própria célula. Fontes anteriores permanecem em cast-before-isolation.png e ultimate-before-isolation.png.

