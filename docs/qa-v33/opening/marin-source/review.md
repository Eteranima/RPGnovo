# Marin e Umbra — fonte 04

**Resultado: rejected-anatomia.** Hash bloqueado na montagem. A raiz solicitou retake com braços e armas imóveis.

## Técnica

- Fonte: `art-source/v33/opening/clips/04-marin.mp4`.
- SHA-256: `9555bfd5fb019e9f7949ddee4ba1d30c3f5c1acdf76c97c523cbceec020cb14c`.
- 6.510.000 bytes, H.264/yuv420p, 1280×720, 24/1 fps.
- `nb_frames` e `nb_read_frames`: 192; vídeo e contêiner com 8,000 s.
- Fonte com áudio; excluído na montagem final.

## Amostras

16 PNGs completos a cada 0,5 s, de 0 a 7,5 s. Três sequências de 32 crops a cada seis quadros, de 0 a 7,75 s: Umbra inteira, região esquerda das mãos de Marin e região direita. As regiões de mãos se sobrepõem intencionalmente para acompanhar os braços cruzados; esquerda/direita designam a imagem, sem atribuir um membro anatômico incorreto. São 112 PNGs, referentes a 32 quadros distintos.

As sete contact sheets foram revisadas, além dos PNGs completos nativos de 0, 3 e 5 s. Configuração dos retângulos: `art-source/v33/opening/qa-crops/marin.json`. Os crops foram feitos pelo FFmpeg, sem pintura/resize. Somente as miniaturas foram reduzidas para revisão.

## Achado anatômico

Entre as amostras de 2,25 e 2,5 s, a pose passa a conservar uma mão na lâmina da cintura enquanto aparecem duas mãos na pose de braços cruzados. Em 3 e 5 s, são claras três mãos simultâneas:

1. Mão apoiada no braço superior à esquerda da imagem.
2. Mão levantada junto ao ombro à direita da imagem.
3. Mão adicional segurando a adaga na cintura.

O erro persiste nas amostras posteriores. Evidências: `full/frame-06.png`, `full/frame-10.png`, `marin-hands-left-contact-1.jpg` e as folhas de mãos posteriores. Não há janela de cinco segundos aprovada: o começo utilizável é curto, e as janelas posteriores conservam o membro extra. Repetir/esticar os quadros iniciais não é permitido.

## Identidade e cenário

Marin mantém cabelo escuro, figurino azul/preto com bordado dourado e efeitos de sombra roxa. Umbra mantém cabelo escuro, roupa vermelha, rosto reconhecível e duas mãos/pernas/botas nas amostras. Os corpos mantêm margem até o fim, sem o zoom que reprovou a primeira Ophélia. Não foi observado membro extra na Umbra amostrada. Esses pontos favoráveis não anulam a falha das mãos de Marin.

Main 0–5 s e extras 5–6,0833 s estão **reprovados nesta fonte**. O SHA continua bloqueado mesmo se o arquivo for renomeado. A aprovação da arte estática não foi alterada; o defeito apareceu na animação. Nenhum filme final foi montado.
