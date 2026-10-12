# Marin 5★ — Oráculo do Palácio Vazio

Kit final do evento Lua de Sangue, id `marin-starless-throne`. Gerado exclusivamente pelo imagegen integrado, usando o retrato aprovado deste diretório. O cavaleiro de braços expostos e adagas foi rejeitado; seu arquivo anterior permanece em `rejected-masked-sleeveless-v1/` e não compõe este kit.

## Identidade e conteúdo

Marin adulto anime: bob teal/prateado, meia máscara de mariposa, vestes completas ivory/teal, jade/ouro e dois leques de guerra. Umbra continua humano chibi de cabelo escuro, olhos vermelhos e rosto canônico; sua forma do evento usa roupa, máscara e leque ligados a Marin. Não há outro humano nas poses de Marin.

| Arte | Tamanho nativo | Grade | Células |
| --- | --- | --- | --- |
| walk.png | 1086 × 1448 | 3 × 4 | 12 |
| attack.png | 1536 × 1024 | 3 × 2 | 6 |
| cast.png | 1536 × 1024 | 3 × 2 | 6 |
| ultimate.png | 1254 × 1254 | 4 × 2 | 8 |
| vfx.png | 1536 × 1024 | 3 × 2 | 6 |
| icons.png | 1536 × 1024 | 3 × 2 | 6 |
| companion.png | 1254 × 1254 | 2 × 2 | 4 |

Runtime: `public/assets/v36/variants/marin-starless-throne/`. Os seis ícones individuais estão em `icons/0.png` até `icons/5.png`, extraídos sem redimensionar ou alterar RGBA. Não substituí o retrato aprovado nem o registro global de artes.

## Ordem e integração

- Caminhada: linhas Sul, Oeste, Leste, Norte; cada linha tem neutral, step-left e step-right.
- Ataque: seis poses para a direita; repouso sem VFX, antecipação, avanço, contato, seguimento e retorno.
- Conjuração: seis poses para a direita; a pose de liberação mantém os dois leques após correção pontual.
- Ultimate: a fonte permanece em ordem de leitura. `playback-order.json` recomenda `[0,1,2,6,3,4,5,7]`, colocando o golpe nativo4 no contato da reprodução5. Não duplicar quadros ou alterar pixels. O grande arco do Palácio está no VFX5; os atores da ultimate usam efeitos compactos para manter recortes isolados.
- VFX: impacto, projétil, proteção, controle, assinatura, ultimate; mariposas/leques/lua/jade e Trevas, sem fogo ou eletricidade.
- Ícones: ataque mágico, técnica1, técnica2, controle, assinatura, ultimate.
- Umbra: guarda, reunião, liberação, repouso. Keys combinadas com o motor: `companion_marin-starless-throne` e `companion_event_marin-starless-throne`.

Os sete manifests contêm recortes/âncoras absolutos nativos, SHA256, dimensões, alpha e emendas. `body-metrics.json` registra as exceções da cabeça quando um leque ou mariposa fica acima dela. Todas as âncoras de chão foram conferidas nos pés, sem prender a figura por um projétil.

## Revisão e limites

Os 48 recortes finais foram vistos individualmente: identidade/figurino, braços/mãos, empunhaduras, botas, direção e ausência de figura vizinha nos recortes. A mão de apoio de Umbra na liberação foi revelada para tornar os dois braços legíveis. As candidatas com emendas invadidas, direção incorreta ou leque ausente ficaram arquivadas e foram substituídas por novas gerações.

O exportador comum passou as sete folhas. `verification.json` confirma 48 células, 19.672 linhas RGBA preservadas nos recortes e sete cópias runtime idênticas em bytes às fontes. Há espaços livres de alpha0; o limite24 é usado somente para medir bordas visíveis. Pequenos pixels de alpha baixo nas emendas geradas foram preservados e contabilizados, sem limpeza por código. O RGB invisível das fontes pode mostrar uma cor de fundo em alguns visualizadores; isso não equivale a um painel opaco.

Esta é uma revisão visual das artes nativas, não uma garantia matemática de anatomia ou uma revisão do jogo no navegador. A composição, escala e sincronização em combate serão verificadas pela raiz na integração. Nenhuma edição de motor/UI, build, publicação ou Git foi executada neste kit.

## Proveniência e reprodução

- `prompts.json`: prompts exatos, referências, todas as tentativas, motivos de rejeição e hashes.
- `*-source.png`: fontes selecionadas; `*-attempt.png`: candidatas arquivadas.
- `*-manifest.json`: dados do exportador comum `art-source/v36/export-atlases.mjs`.
- `export-input.json`: sete grades finais.
- `export-review-crops.mjs`: recortes de revisão nativos e comparação de cada linha RGBA.
- `finalize-provenance.mjs`: hashes, limites e prova de preservação nativa.

Scripts devem ser executados a partir da raiz de RPGnovo. Não há repaint, warp, resize, filtro, interpolação ou máscara por código nas artes deste kit.
