# Orfeu — técnicas e Domínio Nulo v30

Novas artes finais criadas com imagegen integrado. Preservam cabelo branco, pele morena, top preto e ouro sem mangas, faixas brancas, calças largas, faixa azul assimétrica e sapatos aprovados. Retrato, caminhada e ataque básico anteriores continuam sob responsabilidade da integração existente.

## Entrega

- cast.png: 6 poses para Palma de Ruptura / Guarda Nula.
- ultimate.png: 8 poses para Domínio Nulo.
- vfx.png: 6 motivos independentes de impacto físico, palma de ruptura, guarda nula, silêncio antimágico, ruptura ampla e Domínio Nulo.
- icons.png e icons/0.png…5.png: seis ícones próprios para ataque físico, as técnicas, controle, ruptura e ultimate.
- Módulo de integração: lib/game/orfeuArtV30.ts, com ORFEU_ASSETS_V30 e ORFEU_FRAMES_V30. Sem mudanças de mecânicas, nomes/IDs ou saves.

## Integração e regressão

`hasCharacterBattleArt` habilita os novos efeitos e a cadência de seis/oito poses sem classificar Orfeu como um remake completo. O ataque aprovado de quatro poses conserva sua cadência anterior. Palma de Ruptura usa o motivo 1; Guarda Nula, o motivo 2; Domínio Nulo, o motivo 5. O catálogo oferece a prévia por elegibilidade de arte, sem limitar a versão da pasta.

`node tests/orfeu.test.mjs` verifica custos e rejeições, impacto adiado, guarda sem cura/ressurreição, silêncio, limite da ultimate, IDs de saves, roteamento dos efeitos e os 26 recortes RGBA reais. O carregador acompanha os imports locais do motor e aceita os módulos da expansão v30.

## Revisão e recortes

Anatomia, mãos agrupadas em palmas naturais, dedos, punhos, pés completos, figurino e orientação à direita foram revisados nas folhas. A ultimate foi refinada após detectar sobreposição entre duas poses inferiores; a fonte anterior está preservada como ultimate-before-isolation.png.

O acabamento dos efeitos usa pressão cinza/branca e geometria fraturada de antimagia. Não há fogo, gelo, eletricidade ou aura de magia colorida. Os símbolos são arte pintada própria; não dependem de anéis CSS.

Os arquivos *-source.png preservam os originais selecionados. Runtime mantém pixels RGBA idênticos; ícones individuais são recortes retangulares nativos, sem escala, pintura ou remoção manual de fundo. Prompts e manifests estão nesta pasta.

measure.py mede os corredores reais de alpha e recortes por pose. O limiar alpha>24 evita tratar névoa de exportação como corpo; o alpha original permanece intacto. Todos os recortes têm zero pixels visíveis nas bordas. O RGB em pixels transparentes pode mostrar gradiente no visualizador, mas as contagens/amostras alpha0 verificam o fundo vazio real.

Âncoras dos atores: eixo da cintura inspecionado e último pixel opaco dos pés. Efeitos/ícones usam centro do recorte. Cada linha pode ter divisões próprias; use os recortes medidos, sem assumir células uniformes.

## Referências inspecionadas

- public/assets/v25/orfeu/orfeu-antimagic-combat.png — figurino, proporções e ataque aprovado.
- public/assets/v22/orfeu-5star.webp — identidade e detalhe de figurino; sua aura colorida não foi reutilizada.
- public/assets/v26/ava/ava-anime-portrait.png — linguagem anime e cel shading.
