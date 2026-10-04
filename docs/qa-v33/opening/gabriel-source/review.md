# Gabriel e Dante — fonte 05

**Resultado: rejected-enquadramento.** SHA bloqueado na montagem. A raiz planejou retake mantendo as asas dobradas.

## Técnica

- Fonte: `art-source/v33/opening/clips/05-gabriel.mp4`.
- SHA-256: `81184b2b6d92194054c315b3ab4c6d02590e7a5eadf23b78d67db97c74f2de26`.
- 8.091.307 bytes, H.264/yuv420p, 1280×720, 24/1 fps.
- 192 quadros no contêiner e na decodificação real, 8,000 s.
- Fonte com áudio; a montagem final o exclui.

## Enquadramento

A ponta da asa direita de Dante ultrapassa a borda superior/direita no **quadro 60, 2,5 s**, e ultrapassa a borda direita no **quadro 156, 6,5 s**. O corte é visível em resolução nativa, sem depender da miniatura: `full/frame-05.png` e `full/frame-13.png`.

Nenhuma janela integral de cinco segundos foi aprovada. Em uma fonte de oito segundos, o início dessa janela está entre 0 e 3 s. As janelas iniciais incluem 2,5 s; as que começam depois desse ponto incluem 6,5 s. Portanto, toda janela possível contém ao menos uma das poses com asa cortada. Esse corte pertence ao vídeo original e não pode ser recuperado com escala/letterbox.

## Amostragem e anatomia

16 PNGs completos a cada 0,5 s, de 0 a 7,5 s. Quatro sequências de 32 crops a cada seis quadros documentam asas/corpo de Dante, garras/perch, mão de Gabriel à esquerda da imagem e mão levantada à direita. Os retângulos estão em `art-source/v33/opening/qa-crops/gabriel.json`. A borda direita do crop de asas coincide com a borda original, para tornar o corte evidente.

As amostras completas mostram Gabriel com rosto/cabelo branco e figurino preservados, duas mãos e duas pernas/botas. Dante mantém cabeça, duas asas e duas patas reconhecíveis; a reprovação é a abertura excessiva das asas no enquadramento. Os efeitos são fogo vermelho/laranja/dourado, coerente com a família Gabriel/Dante.

Main 0–5 s e extras 5–6,0833 s estão reprovados para uso com o corpo/asa integral. A arte estática permanece válida. O retake deverá manter as asas dobradas e limitar a animação a piscadas, respiração, movimento leve de penas e fogo. Nenhum filme final foi montado.
