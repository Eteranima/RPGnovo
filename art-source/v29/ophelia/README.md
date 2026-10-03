# Ophélia — remake v29

Kit final criado com o imagegen nativo, seguindo dlg_ophelia original e a linguagem anime de Ava v26/Orfeu v25. Mantém cabelo preto/violeta, olhos violetas, monóculo dourado, véu de renda/rosas, pérolas, vestido em camadas e botas. O elemento é Gelo, incluindo cura cristalina azul/branca; não usa fogo.

## Entrega

- Runtime: public/assets/v29/ophelia/{portrait,face,walk,attack,cast,ultimate,vfx,icons}.png e icons/0.png até 5.png.
- Integração: lib/game/remakeArtSeijiOphelia.ts, exports REMAKE_ASSETS_SEIJI_OPHELIA e REMAKE_FRAMES_SEIJI_OPHELIA.
- 12 quadros S/W/E/N, 6 ataques, 6 casts, 8 ultimates, 6 efeitos isolados e 6 ícones próprios. Todas as poses de combate olham para a direita; attack[0] é repouso sem VFX.
- Seleção final: walk r2, attack r2, cast r2, ultimate r2, vfx r1, icons r1. Retrato aprovado é portrait-source.png.
- Face quadrada medida: x354, y15, w336, h336 do retrato nativo 1024×1536. face.png é recorte literal dessa região.

## Validação

manifest.json registra dimensões, caixas nativas, âncoras de pés, SHA-256, alpha e recortes. As 44 células têm zero pixels alpha>20 nas bordas. Walk r2 corrigiu a direção das linhas laterais e o contato entre personagens. Cast/ultimate r2 separaram melhor as duas linhas e reservam os efeitos grandes para vfx.png; poses usam somente cristais pequenos próximos das mãos. Cortes em review/ e ícones individuais foram inspecionados para conferir rosto/mãos/pés completos e ausência de figuras vizinhas.

Fontes e prompts completos são preservados. Nenhum pixel gerado foi pintado, redimensionado, mascarado ou substituído. As versões anteriores não são referenciadas no runtime. A transparência interna foi amostrada no retrato: os pontos livres (140,140), (200,250), (720,1450), (940,130), (110,800) têm alpha0; (900,550) tem alpha4 no contorno do brilho. A visualização do arquivo pode mostrar cores RGB ocultas sob alpha baixo; o canal alpha nativo é preservado.

## Conceitos para integração pela raiz

Santuário de Geada usa a técnica assinatura (VFX/ícone4): cura, guarda aliado e remove sangramento. Catedral do Inverno usa as torres/coroa cristalina (VFX/ícone5). Os motivos0–5 seguem impacto, projétil, cura/proteção, controle, assinatura e ultimate. Esses nomes/mecânicas são proposta visual; este módulo não altera regras ou saves.

