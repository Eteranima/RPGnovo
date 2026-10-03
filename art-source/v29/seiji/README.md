# Seiji — remake v29

Kit final criado com o imagegen nativo, seguindo dlg_seiji original e a linguagem anime de Ava v26/Orfeu v25. Mantém cabelo prateado, olhos vermelhos, haori marfim/vermelho, roupa preta, laços, katana/pincel e elemento Tinta.

## Entrega

- Runtime: public/assets/v29/seiji/{portrait,face,walk,attack,cast,ultimate,vfx,icons}.png e icons/0.png até 5.png.
- Integração: lib/game/remakeArtSeijiOphelia.ts, exports REMAKE_ASSETS_SEIJI_OPHELIA e REMAKE_FRAMES_SEIJI_OPHELIA.
- 12 quadros S/W/E/N, 6 ataques, 6 casts, 8 ultimates, 6 efeitos isolados e 6 ícones próprios. Todas as poses de combate olham para a direita; attack[0] é repouso sem VFX.
- Seleção final: walk r3, attack r2, cast r1, ultimate r1, vfx r1, icons r1. Retrato aprovado é portrait-source.png.
- Face quadrada medida: x445, y18, w290, h290 do retrato nativo 1024×1536. face.png é recorte literal dessa região.

## Validação

manifest.json registra dimensões, caixas nativas, âncoras de pés, SHA-256, alpha e recortes. As 44 células têm zero pixels alpha>20 nas bordas. O walk r3 substituiu a versão com pouca distância entre cabelo e botas. A página solta no cast[4] está incluída na caixa medida. Cortes selecionados em review/ foram inspecionados para conferir silhueta completa, mãos, pés e ausência de figuras vizinhas.

Fontes e prompts completos são preservados. Nenhum pixel gerado foi pintado, redimensionado, mascarado ou substituído. As versões anteriores não são referenciadas no runtime. A transparência interna foi amostrada no retrato: os pontos livres (300,70), (70,1120), (590,1400), (830,1400), (820,60), (50,1480) têm alpha0; (130,340) tem alpha1. A visualização do arquivo pode mostrar cores RGB ocultas sob alpha baixo; o canal alpha nativo é preservado.

## Conceitos para integração pela raiz

Kanji: Interdição usa a técnica assinatura (VFX/ícone4), com corte de tinta, silêncio e enfraquecimento. Códice da Página Final usa o motivo de livro/folhas (VFX/ícone5). Esses nomes/mecânicas são proposta visual; este módulo não altera regras ou saves.

