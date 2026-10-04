# Mika — teste único de animação quadro a quadro

## Resultado

Uma prévia de **2 segundos, 48 desenhos distintos, 24 fps**, em resolução nativa **480 × 270**. Está em **Aventura → Cenas → Teste quadro a quadro · Mika → Assistir ao teste**. Recarregue o jogo local para receber a versão atual.

As ilustrações foram geradas com a ferramenta integrada `image_gen`, em quatro folhas de doze desenhos. Não são desenhos feitos por uma pessoa com lápis/tablet. A montagem usa esses desenhos em sequência; não utiliza geração de vídeo, interpolação ou quadros duplicados para atingir a cadência.

## Limites do experimento

Os 24 fps são a cadência verificada do arquivo. Isso não equivale a garantir fluidez final de anime: detalhes do fundo, ornamentos e contornos ainda oscilam entre desenhos, especialmente na passagem 35 → 36. A piscada teve a ordem dos desenhos 13/14 ajustada para evitar fechar–reabrir–fechar. A prévia serve para avaliar o estilo, com câmera de um único plano e movimento discreto. A inspeção dos 48 desenhos e seus limites estão em [visual-review.md](visual-review.md).

## Arquivos e prompts

- Vídeo: [mika.mp4](../../public/assets/v35/frame-test/mika.mp4).
- Pôster nativo: [mika-poster.png](../../public/assets/v35/frame-test/mika-poster.png).
- Desenhos originais e quadros extraídos: [art-source/v35/frame-test](../../art-source/v35/frame-test).
- Prompts finais: [A](../../art-source/v35/frame-test/a-prompt.txt), [B](../../art-source/v35/frame-test/b-prompt.txt), [C](../../art-source/v35/frame-test/c-prompt.txt), [D](../../art-source/v35/frame-test/d-prompt.txt).
- Origem, referências e seleção: [selection.json](../../art-source/v35/frame-test/selection.json).
- Recortes e ordem: [crop-config.json](../../art-source/v35/frame-test/crop-config.json).
- Pixels, hashes e montagem: [export-manifest.json](../../art-source/v35/frame-test/export-manifest.json).
- Contagem, quadros distintos e tempos decodificados: [verification.json](../../art-source/v35/frame-test/verification.json).

Os recortes de 480 × 270 são nativos e têm pixels conferidos contra as folhas geradas. Há corte de poucos pixels na borda de cada célula para padronizar a geometria; não houve ampliação, deformação ou preenchimento. O MP4 usa H.264 com compressão CRF16; os PNGs preservam os pixels originais.

## Integração e verificação

O teste tem registro e botão próprios e reutiliza o player. Pode ser visto com as cinco memórias de missão ainda bloqueadas. Ele não altera recompensas, `cinematicSeen`, quests ou formato de save. O desenho do mundo fica congelado durante a prévia; ao sair, retorna a Cenas e ao foco do botão. As cinco cutscenes v34 permanecem nos seus registros e caminhos anteriores.

Verificado: testes de isolamento, controles, retorno/foco, teclas 1–5, falha de mídia, movimento reduzido e regressões de replay; TypeScript e build aprovados. No navegador, reprodução de 2 s até o fim, repetição e saída foram conferidas em partida de teste na porta 5175. O som permanecia desligado e as cinco memórias permaneciam bloqueadas. O helper temporário foi removido antes de reiniciar a porta 5173; o progresso do navegador principal não foi substituído.

Não houve publicação no Cloudflare nesta tarefa.
