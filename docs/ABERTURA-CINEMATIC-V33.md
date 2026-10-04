# Abertura cinematic v33 — Éter Anima

**Status: abertura concluída e validada na build local.** O filme tem 1.500 quadros a 24 fps, duração de 62,5 s e resolução de 1280×720. As onze fontes, a montagem, a verificação técnica, a revisão de compressão por amostragem e a reprodução na build de produção local estão registradas abaixo. A inspeção visual usa amostras; mobile não foi testado no navegador.

## Entrega

A abertura tem **1.500 quadros a 24 fps**, equivalentes a **62,5 segundos**, distribuídos em 12 planos. A numeração interna vai de 0 a 1.499. O objetivo é apresentar Stone Reach, os personagens e os vínculos com seus companheiros antes da investigação da Academia.

As fontes foram geradas como clipes reais: dez segundos para Seiji e oito segundos para as demais cenas. Os planos inicial e final têm seis e 6,5 segundos; cada apresentação intermediária usa cinco segundos. A montagem selecionou quadros originais distintos de trechos aprovados, e a exportação confirmou a contagem real de 1.500 quadros.

## Planos

| Plano | Quadros inclusivos | Total | Duração | Apresentação |
| --- | --- | ---: | ---: | --- |
| shot-01 | 0–143 | 144 | 6 s | Stone Reach desperta — beleza e inquietação. |
| shot-02 | 144–263 | 120 | 5 s | Seiji e Shin — o traço — curiosidade e memória. |
| shot-03 | 264–383 | 120 | 5 s | Ophelia e Mika — cuidado — cuidado e serenidade. |
| shot-04 | 384–503 | 120 | 5 s | Marin e Umbra — confiança — mistério e confiança. |
| shot-05 | 504–623 | 120 | 5 s | Gabriel e Dante — proteção — proteção e coragem. |
| shot-06 | 624–743 | 120 | 5 s | Max e Vajra — o pulso — energia e cumplicidade. |
| shot-07 | 744–863 | 120 | 5 s | Ava — terra que sustenta — força enraizada. |
| shot-08 | 864–983 | 120 | 5 s | Orfeu — silêncio da magia — disciplina e segurança. |
| shot-09 | 984–1103 | 120 | 5 s | Carmilla — fio de cuidado — compaixão e responsabilidade. |
| shot-10 | 1104–1223 | 120 | 5 s | Beatriz — a direção — liderança e chamado. |
| shot-11 | 1224–1343 | 120 | 5 s | Abel — legado da forja — conhecimento e legado. |
| shot-12 | 1344–1499 | 156 | 6,5 s | Stone Reach — pertencimento — pertencimento e início da jornada. |
| **Total** | **0–1499** | **1500** | **62,5 s** | |

O último plano é uma **montagem de seis trechos inéditos** de Seiji/Shin, Ophelia/Mika, Marin/Umbra, Gabriel/Dante, Max/Vajra e Ava, com 26 quadros de cada fonte, totalizando 156. Foram usados índices 120–145, distintos dos trechos principais. O título é aplicado pela interface, em DOM; os clipes não trazem texto embutido.

## Cânone e referências

Todos os caminhos de imagens abaixo são relativos a `public/assets/`. As referências absolutas e os pedidos de vídeo em inglês estão em `art-source/v33/opening/storyboard.json`.

| Personagem | Referência principal | Elemento e detalhes preservados |
| --- | --- | --- |
| Seiji | `v29/seiji/portrait.png` | Tinta; cabelo prateado e fitas vermelhas, haori marfim/vermelho, katana e pincel. |
| Ophelia | `v29/ophelia/portrait.png` | Gelo/cura azul-branca; vestido violeta, véu, rosas, monóculo dourado esquerdo. |
| Marin | `v29/marin/portrait.png` | Trevas; homem adulto andrógino aprovado, cabelo preto, casaco preto/dourado/azul e duas adagas. |
| Gabriel | `v29/gabriel/portrait.png` | Fogo; cabelo branco, casaco preto/dourado/carmesim e punhos. Forma humana neste plano. |
| Max | `v29/max/portrait.png` | Eletricidade e pregos; adulto esguio, pele costurada, cabelo preto e roupa preta/laranja. |
| Ava | `v26/ava/ava-anime-portrait.png` | Terra mineral ocre; cabelo auburn com flores, top/faixa verdes, calças marfim e mãos enfaixadas. Flores do figurino não viram ataques de plantas. |
| Orfeu | `v22/orfeu-5star.webp` + `v25/orfeu/orfeu-antimagic-combat.png` | Anti-magia física cinza/branca; pele morena, cabelo branco, colete marcial preto/dourado e faixa azul. Desconsiderar os anéis azuis/dourados do retrato antigo; seguir a direção neutra de `art-source/v30/orfeu/cast-prompt.txt`. |
| Carmilla | `v29/carmilla/portrait.png` | Sangue/costuras; loira, olhos rubros, robe preto/vinho/dourado e duas agulhas. Sem gore. |
| Beatriz | `v29/beatriz/portrait.png` | Água azul e Trevas violetas/negras separadas; cabelo preto, chapéu, casaco branco e espada. |
| Abel | `v29/abel/portrait.png` | Fogo primordial/leão; pele morena, cabelo vermelho, óculos dourados, manto rubro e cajado com cristal vermelho. Atualmente visitante NPC da forja; esta abertura não muda o recrutamento. |

Os companheiros usam os corpos completos aprovados de `v31/companions/{id}/fullbody.png`:

- **Shin → Seiji:** menino chibi de cabelo branco iridescente, olhos azuis, quimono branco/preto/dourado e pincel; exatamente duas pernas e duas botas.
- **Mika → Ophelia:** menino chibi loiro, óculos e traje azul/dourado de inverno com peles brancas.
- **Umbra → Marin:** menino chibi de cabelo escuro, olhos rubros e figurino nobre carmesim/preto/dourado.
- **Vajra → Max:** menino chibi de cabelo dourado/preto, traje elétrico preto/dourado. O pequeno roedor no ombro de Max é um detalhe de figurino distinto.
- **Dante → Gabriel:** fênix vermelha/laranja/dourada com arnês e rubi, asas, cauda e duas garras.

Ava, Orfeu, Beatriz, Abel e Carmilla não recebem companheiros inventados. As quinze referências principais foram inspecionadas antes da preparação dos pedidos.

## Narrativa e acabamento

A história começa com **“Um ruído sob a Academia”**. A abertura sugere vibração sob a pedra e escrita apagada, preservando o mistério da escada, do Selo e dos desfechos das missões. A progressão emocional é curiosidade, cuidado, confiança, proteção, energia e pertencimento.

O acabamento acompanha a direção anime de fantasia já registrada em `AGENTS.md`: contornos finos, cel shading controlado, rostos reconhecíveis, figurinos detalhados e proporções adultas para os heróis. Os companheiros preservam seu cânone chibi. Cada pedido usa uma ação principal plausível e efeitos que não escondem rostos/mãos, sem flashes fortes ou tremor excessivo. Após a rejeição temporal do plano 03, os próximos planos com personagens usam câmera fixa e preservam o enquadramento completo.

## Verificações de produção

O roteiro já foi conferido: **12 planos, intervalos contínuos, 1.500 quadros e 62,5 segundos**. As fontes estão geradas e baixadas, com revisões por amostragem registradas em `docs/qa-v33/opening/*-source/review.md`. A montagem teve revisão por amostragem de identidade, anatomia, elementos e enquadramento. `verification.json` confirma contagem e taxa de quadros reais; `browser-review.json` registra reprodução integral, controles, preferência de movimento reduzido e igualdade do estado exposto antes/depois.

O filme final passou pela verificação técnica, revisão visual de compressão por amostragem e reprodução integral na build local. A aprovação das artes fixas está registrada separadamente e não substitui essas verificações.

## Histórico da revisão das artes fixas

### Plano 02 — Seiji e Shin

A primeira arte `art-source/v33/opening/keyframes/02-seiji.png` foi **reprovada por erro anatômico** apontado pelo usuário e confirmado em inspeção visual independente: Shin apresenta três braços/mãos visíveis — um segurando o pincel, outro apoiando o queixo e outro sobre o joelho. Suas duas pernas e botas não compensam essa duplicação dos membros superiores.

Essa versão original não é uma referência válida nem está aprovada para gerar vídeo. O `storyboard.json` registra seu hash, a rejeição e a condição de uso. Ela permanece reprovada mesmo depois da aprovação da substituta.

### Plano 02 — substituta corrigida

`art-source/v33/opening/keyframes/02-seiji-corrected.png` foi aberta e comparada visualmente com a original. **Shin agora apresenta dois braços e duas mãos**: uma segura o pincel e a outra repousa no joelho. A mão e o antebraço antes apoiados no queixo desapareceram; pescoço, gola e peito estão livres dessa duplicação. Há dois joelhos, duas pernas e duas botas visíveis, sem uma terceira perna. Cabelo branco iridescente, olhos azuis, quimono branco/preto/dourado e proporção chibi permanecem reconhecíveis.

Seiji apresenta dois braços e duas mãos, uma com o pincel e outra sobre a página. Um joelho dobrado elevado e uma bota frontal completa são claramente visíveis; a roupa sobreposta cobre parte restante das pernas. A revisão não contabiliza anatomia coberta como se estivesse totalmente exposta. Sua identidade, figurino, katana embainhada e tinta foram preservados.

**A substituta foi aprovada como referência estática.** Depois, o vídeo corrigido recebeu a revisão temporal específica descrita nos laudos. O hash da arte e a revisão estática foram registrados separadamente no roteiro; não constituem garantia de ausência absoluta de defeitos.

### Plano 01 — cenário da Academia

`art-source/v33/opening/keyframes/01-academy.png` foi inspecionada diretamente: Academia detalhada à noite, luar azul, janelas e lanternas quentes, reflexos no lago, cascatas, montanhas e uma página marfim no primeiro plano. Não há personagens, sombras quadradas de placeholder ou revelação do desfecho da história. O enquadramento comporta o movimento suave de câmera previsto para a abertura.

**O cenário foi aprovado como referência estática.** Na revisão temporal posterior, o surgimento do arco nos primeiros 1,5 s foi excluído; o trecho de índices 36–179 foi aprovado por amostragem. A iluminação noturna, água e arquitetura foram conferidas na fonte e na entrega.

### Plano 04 — Marin e Umbra

`art-source/v33/opening/keyframes/04-marin.png` foi gerada com o **imagegen integrado**, usando os retratos canônicos de Marin e Umbra e a arte corrigida do plano 02 somente como direção de cenário/acabamento. A imagem foi copiada integralmente para o projeto, com igualdade de hash; o pedido final está em `04-marin-prompt.txt`.

A inspeção visual contou **dois braços, duas mãos, duas pernas e duas botas de Marin**, além de duas adagas curvas violetas, uma em cada mão baixa. **Umbra também tem dois braços, duas mãos, duas pernas e duas botas**, com ambas as mãos enluvadas relaxadas abaixo do torso, sem gesto no queixo e sem terceiro braço. As figuras inteiras permanecem separadas; cabelo, rosto, figurino e proporção de cada personagem acompanham suas referências. As sombras violetas/negras não escondem membros nem criam duplicatas humanas.

**Arte fixa aprovada como referência para vídeo.** O movimento inicialmente proposto de erguer uma adaga foi abandonado na produção após a geração anterior criar uma terceira mão. A fonte escolhida, `04-marin-fixed.mp4`, mantém os dois braços e as duas mãos nas poses originais, cada mão com sua adaga baixa. Piscadas, respiração sutil, cabelo, tecido e sombras fornecem movimento; não se pede novo gesto de braço. A refação passou pela revisão por amostragem documentada, sem afirmar ausência absoluta de defeitos em todos os quadros.

### Plano 06 — Max e Vajra

`art-source/v33/opening/keyframes/06-max.png` foi gerada com o **imagegen integrado**, usando os retratos canônicos de Max e Vajra e o plano 02 corrigido como referência de acabamento e atmosfera da Academia. A cópia integral conserva o hash da fonte; o pedido final está em `06-max-prompt.txt`.

A revisão visual contou **dois braços, duas mãos, duas pernas e duas botas de Max**. Ele segura um prego de cabeça plana na mão elevada, enquanto a outra mão permanece baixa. Há três pregos adicionais levitando; seus eixos e cabeças são distintos. Os arcos amarelos/ciano não escondem dedos ou articulações. O roedor pequeno e já existente permanece no ombro de Max como detalhe do figurino.

**Vajra apresenta dois braços, duas mãos baixas, duas pernas e duas botas**, com cabelo dourado/preto espetado, olhos dourados e o traje canônico preto/dourado. A faixa branca é tecido e não forma uma terceira perna. Vajra continua sendo o menino chibi companheiro, separado do pequeno roedor. As figuras inteiras estão afastadas, e os bancos da oficina não cobrem membros.

**Arte fixa aprovada como referência para vídeo.** A proposta de erguer o prego foi substituída na produção por braços e mãos nas poses originais, com piscadas, respiração, cabelo/tecido, pregos flutuantes e eletricidade contida. `06-max.mp4` passou por revisão de 16 quadros completos e 64 recortes: no movimento mais tardio, a mão se abaixa sem manter outra mão na pose anterior nas amostras. Os quadros completos foram conferidos quando a mão saiu do retângulo de QA; isso não é um corte do vídeo. A aprovação por amostragem não assegura ausência absoluta de defeitos.

### Plano 09 — Carmilla no Arquivo

A primeira geração, `art-source/v33/opening/keyframes/09-carmilla.png`, tinha dois braços e duas mãos, mas deixou uma mão junto ao rosto/ombro e outra acima da cintura. Foi **reprovada por pose incompatível com o enquadramento solicitado**, preservada por hash e editada pelo imagegen integrado. A versão escolhida para vídeo é **`09-carmilla-corrected.png`**, não a primeira geração.

A imagem corrigida foi aberta e comparada: **dois braços, duas mãos e duas agulhas**; uma mão está na altura do peito e a outra abaixo do cinto, junto ao quadril. A mão alta anterior não permaneceu como membro extra. Há duas botas completas e dois contornos separados de pernas inferiores; o manto cobre coxas e parte das canelas, que não foram declaradas totalmente expostas. O fio carmesim fino, rosto adulto, cabelo loiro, olhos rubros e roupa preta/vinho/dourada foram preservados, sem feridas ou gore.

O ambiente é um arquivo interno distinto do pátio: estantes de madeira, livros, arcos de pedra, janela sob o luar e velas quentes. Corpo inteiro, cabelo, manto, agulhas e botas permanecem dentro do quadro. O pedido inicial está em `09-carmilla-prompt.txt`, e a edição pontual em `09-carmilla-repair-prompt.txt`; cópia nativa, hashes e laudo constam do roteiro.

**Versão corrigida aprovada como referência estática para vídeo.** O pedido efetivamente usado no clipe mantém mãos, braços e agulhas nas posições da imagem: uma mão no peito e outra abaixo da cintura. O movimento vem de piscadas, respiração, cabelo, manto e fio carmesim entre as duas agulhas, afastado das articulações. A aprovação temporal é registrada separadamente no laudo da fonte; a aprovação estática não assegura ausência absoluta de defeitos.

## Consolidação das artes estáticas

**11 de 11 artes próprias necessárias foram aprovadas como referências estáticas:** um cenário inicial e dez apresentações de personagens. O plano 12 é uma montagem editorial desses materiais, sem nova geração de quinze figuras simultâneas. Existem duas candidatas rejeitadas preservadas: Shin com terceiro braço e Carmilla com mãos na altura errada. As referências selecionadas obrigatórias são `02-seiji-corrected.png` e `09-carmilla-corrected.png`; suas versões originais continuam reprovadas.

| Plano | Arte selecionada | Contagem e conferência visual |
| --- | --- | --- |
| 01 | `01-academy.png` | Cenário noturno da Academia, sem elenco ou revelação final. |
| 02 | `02-seiji-corrected.png` | Shin: 2 braços/mãos/pernas/botas; Seiji: 2 braços/mãos, com parte das pernas coberta pelas vestes. |
| 03 | `03-ophelia.png` | Ophelia e Mika: 2 braços/mãos e 2 botas cada; uma bota de Ophelia parcialmente sob a barra. Gelo azul/branco e figurinos canônicos. |
| 04 | `04-marin.png` | Marin e Umbra: 2 braços/mãos/pernas/botas cada; 2 adagas de Marin e Trevas violetas/negras. |
| 05 | `05-gabriel.png` | Gabriel: 2 braços/punhos/pernas/botas; Dante: 2 pernas/garras, asas e cauda dentro do quadro. Fogo e fênix canônica com rubi. |
| 06 | `06-max.png` | Max e Vajra: 2 braços/mãos/pernas/botas cada. Um prego na mão e três levitando; eletricidade amarela/ciano e roedor de figurino distinto de Vajra. |
| 07 | `07-ava.png` | Ava: 2 braços/punhos/pernas/pés completos; Terra ocre/mineral, flores decorativas, figurino verde/marfim. |
| 08 | `08-orfeu.png` | Orfeu: 2 braços/punhos/pernas/pés; fraturas cinza/brancas físicas. A arte usa soco de punho fechado, não palmada; o pedido de vídeo foi alinhado. |
| 09 | `09-carmilla-corrected.png` | 2 braços/mãos/agulhas/botas; uma mão no peito e outra abaixo da cintura. Partes das pernas cobertas pelo manto. |
| 10 | `10-beatriz.png` | 2 braços/mãos/pernas/botas e 1 espada; Água líquida azul e Trevas violetas/negras distinguíveis. Chapéu, roupa branca e frascos preservados. |
| 11 | `11-abel.png` | 2 braços/mãos/pernas/botas e 1 cajado; cabelo vermelho, óculos dourados, pele morena e manto rubro. Fogo primordial forma cabeça/juba leonina, sem companheiro inventado. |
| 12 | Montagem editorial | Exportada e verificada: seis trechos inéditos de 26 quadros das fontes 02–07; revisão de compressão por amostragem e reprodução integral concluídas. |

Os planos 03, 05, 07, 08, 10 e 11 tiveram inspeção visual independente e hashes registrados no roteiro. Nas mãos fechadas, a revisão confirma a mão e a articulação observáveis, sem declarar que todos os dedos estão expostos. No plano 10, a ponta da espada está próxima à borda inferior; as amostras temporais e da compressão confirmaram a lâmina inteira dentro do quadro. No plano 11, a juba leonina é um efeito de Fogo, não um novo companheiro animal.

**Esta seção registra a aprovação das imagens fixas.** As fontes animadas receberam revisão temporal por amostragem; a exportação, a compressão e a reprodução integrada foram verificadas separadamente. Os resultados finais estão nas seções de entrega e navegador.

## Histórico das refações temporais

O clipe do plano 03 produzido em Flow Quality foi **reprovado por enquadramento**, conforme inspeção do responsável pela produção: o zoom cortou os corpos antes de completar cinco segundos. A aprovação de `03-ophelia.png` como arte estática permanece válida; esse resultado animado não foi aprovado. A substituição `03-ophelia-fixed.mp4`, gerada com câmera fixa em Fast, já está baixada e aprovada por amostragem para 0–5 s e para 26 quadros inéditos a partir de 5 s.

Após a rejeição do plano 03, foi adotada **câmera inteiramente fixa** nos pedidos de personagens e refações, com margem para cabeça, mãos, pés, acessórios e adereços. Os pedidos dos planos 03–11 foram atualizados para essa direção, e os enquadramentos foram conferidos nas amostras temporais. Na produção selecionada, Marin e Max mantêm os braços e mãos nas posições originais; piscadas, tecido e efeitos fornecem o movimento. Gabriel e Dante preservam as asas recolhidas. Os pedidos finais efetivamente usados estão nos arquivos `art-source/v33/opening/clips/*-video-prompt.txt`; os pedidos do storyboard conservam o planejamento anterior e não substituem esse registro de produção.

## Acesso ao filme e proteção dos controles

O player v33 foi conectado em `app/page.tsx` ao botão **Assistir abertura** da tela inicial. Ele é montado somente após esse gesto; entrar ou sair do filme não inicia a aventura, não redefine o grupo e não escreve progresso salvo. A referência síncrona `openingRef` bloqueia as teclas do jogo antes mesmo de o diálogo montar seus listeners, limpa movimento/caminho/interação pendente e pausa o motor. Cliques no cenário e o direcional de toque também têm esse bloqueio. Ao fechar, a pausa volta a acompanhar os demais painéis.

`MusicDirector` e a preferência persistente de som não foram alterados. O contrato existente do player mantém o vídeo silencioso, contempla movimento reduzido, pausa, repetição, pulo, contenção de foco e tela cheia.

A verificação `tests/party-hotkeys-v30.test.mjs` passou **250 verificações**, executando o handler real de teclado, com novos casos para bloqueio durante a abertura, isolamento da fila/alvo da batalha e retomada dos atalhos ao fechar. Isso valida a proteção dos controles; **não valida isoladamente o MP4, o pôster ou a reprodução final no navegador**; a entrega recebeu as verificações específicas registradas nas seções finais. O build e a inspeção de reprodução da entrega foram concluídos pela integração principal e registrados abaixo.

A conferência de tipos com TypeScript também terminou sem erros. Isso não substitui a inspeção visual do filme integrado; o build da entrega e a revisão no navegador foram concluídos e registrados nas seções finais.

## Fontes animadas recebidas e revisão temporal

As **onze fontes selecionadas** estão em `art-source/v33/opening/clips/`. A tabela consolida os laudos existentes em `docs/qa-v33/opening/*-source/review.md`, o registro de produção e hashes calculados dos MP4 locais. A aceitação é **por amostragem**, não inspeção de todos os quadros nem aprovação automática do filme final. As fontes têm 1280×720 reais e 24 fps; Seiji tem 240 quadros/10 s e as demais fontes têm 192 quadros/8 s, conforme os laudos já concluídos. O áudio dos geradores é removido na montagem; a música permanece com a página.

| Plano | Fonte selecionada | Estado temporal e trecho principal |
| --- | --- | --- |
| 01 | `01-academy.mp4` | Aprovado por amostragem para índices **36–179**, início **1,5 s**, 144 quadros. O surgimento do arco no começo foi excluído; somente índices 180–191 ficam disponíveis como sobra inédita, caso usados. |
| 02 | `02-seiji-corrected.mp4` | Aprovado por amostragem para **0–119**; 20 PNGs completos e 48 crops de Shin. A fonte com três braços permanece bloqueada. |
| 03 | `03-ophelia-fixed.mp4` | Refação Fast aprovada para **0–119**, com câmera fixa e corpos inteiros. A fonte Quality com zoom permanece bloqueada. |
| 04 | `04-marin-fixed.mp4` | Refação Fast aprovada para **0–119**; 16 PNGs completos e 96 crops. Duas mãos mantêm as duas adagas baixas; piscadas, tecido e sombras fornecem movimento. Fonte anterior com terceira mão bloqueada. |
| 05 | `05-gabriel-fixed.mp4` | Refação Fast aprovada para **0–119**; 16 PNGs completos e 128 crops. Dante mantém asas recolhidas, duas garras e margem. Fonte anterior com asa cortada bloqueada. |
| 06 | `06-max.mp4` | Aprovado para **0–119**; 16 PNGs completos e 64 crops. Braços sem novo gesto solicitado; as amostras tardias da mão foram conferidas no quadro inteiro. Eletricidade amarela/ciana e Vajra preservados. |
| 07 | `07-ava.mp4` | Aprovado para **0–119**; 16 PNGs completos e 64 crops. Terra ocre e dois pés dentro do quadro; poeira oculta parcialmente os pés em algumas amostras, sem corte do vídeo. |
| 08 | `08-orfeu.mp4` | Aprovado para **0–119**; 16 PNGs completos e 64 crops. Dois punhos/pés, fraturas cinza/brancas físicas. A retração tardia não mantém outro braço nas amostras; não foi escolhida para o encerramento. |
| 09 | `09-carmilla.mp4` | Aprovado por QA para **0–119**; 16 PNGs completos e 64 crops. Duas mãos/agulhas, botas inteiras e fios carmim. A raiz confirmou a revisão da contact sheet completa; os recortes temporais também passaram. |
| 10 | `10-beatriz.mp4` | Aprovado por QA para **0–119**; 16 PNGs completos e 96 crops. Lâmina inteira, duas mãos, Água e Trevas distintas. A raiz confirmou a revisão da contact sheet completa; os recortes temporais também passaram. |
| 11 | `11-abel.mp4` | Aprovado para **0–119**; 16 PNGs completos e 96 crops. Duas mãos, um cajado, botas inteiras; cabeça/juba de fogo, sem animal completo. A raiz confirmou a contact sheet completa e QA concluiu os recortes. |
| 12 | Montagem de trechos inéditos | Seis segmentos de 26 quadros das fontes 02–07, índices 120–145, selecionados no manifesto real e confirmados na exportação. Não foi gerada uma nova fonte com quinze personagens simultâneos. |

Os laudos dos planos 02–07 aprovaram **26 quadros inéditos a partir de 5 s, índices 120–145**. O manifesto final usou exatamente esses seis segmentos na montagem 12, respeitando os intervalos aprovados. A exportação confirmou nenhuma reutilização de quadro de fonte.

### SHA-256 das fontes selecionadas

| Plano | SHA-256 do MP4 recebido |
| --- | --- |
| 01 | `1dfd057105d9ee6fe1d232dc89ebdefc148d2a8ebb3b7001d34a23819eb5714e` |
| 02 | `532324c6e66ff71263dbacf70f291465543496239bcb070a12fefacc838a8a0c` |
| 03 | `1b07d387adba2ff62c8f9ef69861abd520ce42c85c54437bae9ff1bd3c7c4bfd` |
| 04 | `186d4962c7f96910bd53b806dae6853ef5e05952f557afa59a5ccf7b4143a89c` |
| 05 | `57c925e10cee9f6a6b87c0d1d8ab96d01a1310dab23335e3d497339582d8f507` |
| 06 | `81b3e1ccad42a1554976982d7c8502cadf4809bd372cf32b686874d68c5d2866` |
| 07 | `76eac49519be831386b3e4efdb12e55e0070625c830cc81471d35d659d90f0c6` |
| 08 | `ff6974d1bd6285c81d9adc2582a3c0d161c63d873ba2c18b402731ac016645a8` |
| 09 | `d936240d1a87a9ae0ab991334c50ff530d4c29bb4d4f1b40b2473cec26081e9b` |
| 10 | `88359931c5b1da5d88c3f3d81142dccef36a2d24e3cf5067a00965d86e8b1366` |
| 11 | `d1e7f708ecae1c0a9cabf3e86d7a39ea2d1b914243df354c59364f5b4a630554` |

### Fontes rejeitadas e bloqueadas

| Fonte | SHA-256 bloqueado | Motivo |
| --- | --- | --- |
| `rejected/02-seiji-three-arms.mp4` | `462324a92afa3fc00422691cf43319df50a714caa3b8520c4b5443b0de154e75` | Shin já tinha três braços na referência original. |
| `clips/03-ophelia.mp4` | `435829de715f08945b558f1ff274d2c334b27cf00f5a2b048b0e98267b529aa8` | Zoom corta cabeça/adorno e botas; nenhuma janela integral de cinco segundos aprovada. |
| `clips/04-marin.mp4` | `9555bfd5fb019e9f7949ddee4ba1d30c3f5c1acdf76c97c523cbceec020cb14c` | Terceira mão de Marin aparece ao cruzar os braços e persiste nas amostras posteriores. |
| `clips/05-gabriel.mp4` | `81184b2b6d92194054c315b3ab4c6d02590e7a5eadf23b78d67db97c74f2de26` | Pontas das asas de Dante saem da imagem nos quadros 60 e 156. |

A lista vinculante de exclusão está em `art-source/v33/opening/rejected-sources.json`; renomear o arquivo não remove a rejeição por hash. As versões aprovadas não reabilitam as versões anteriores.

O estado atual de `production-log.json` é **`approved-local-delivery`**. `verification.json` confirma a exportação e registra a revisão contínua como **`passed`**; a compressão está **`approved-by-sampling`**. Os laudos individuais preservam o alcance da amostragem.

### Fechamento da revisão das fontes

Os **onze trechos principais** passaram por revisão por amostragem, incluindo os recortes finais de Abel. A integração principal confirmou também as contact sheets completas de Carmilla, Beatriz e Abel e autorizou a montagem após os recortes de Abel. Depois da seleção das fontes, a entrega passou pela verificação técnica, aprovação da compressão por amostragem e reprodução contínua no navegador, registradas nos relatórios finais.

## Validação da integração — concluída

A integração principal informou conclusão de **`pnpm build` em cinco etapas, saída 0**, usando o pipeline Vinext. A primeira tentativa encontrou a pasta `dist` ocupada pelo servidor Wrangler local deste trabalho; somente esse processo foi encerrado antes da repetição bem-sucedida. Esse bloqueio operacional não foi apresentado como defeito do filme.

Os testes de produção do player e dos atalhos passaram: **1.634 verificações do player + 250 verificações de teclado**, ambas com saída 0. A conferência anterior de tipos terminou sem erros; a nova execução final de TypeScript também terminou com saída 0, conforme confirmação da integração principal. O build e os testes não substituem a reprodução real do filme no navegador. A integração principal concluiu essa reprodução em sessão isolada, preservando a sessão de jogo existente.

O log registra **980 créditos de geração autorizados** e **70 créditos restantes observados no painel do Google Flow**, além da estimativa anterior de mesmo valor. Não foram autorizadas compras. Isso registra a produção desta abertura e não altera recursos ou chances do gacha no jogo.

A revisão comparativa da compressão foi feita nos pares de fonte e entrega, com **fonte à esquerda e entrega à direita**. A revisão independente cobriu os planos 01–06, QA cobriu os planos 07–12 e a integração principal revisou o conjunto. Rostos, mãos, cabelo, bordados, contornos, adereços e efeitos foram conferidos, com PNGs nativos nos pontos críticos. Os relatórios técnicos e estados vinculantes permanecem sob propriedade do pipeline; esta etapa não os altera.

O relatório `verification.json` agora está disponível e confirma a exportação técnica. A revisão independente da compressão dos planos 01–06 e a revisão de QA dos planos 07–12 estão concluídas por amostragem; a integração principal também confirmou a reprodução na build local.

## Exportação técnica e revisão independente da compressão

`docs/qa-v33/opening/verification.json` foi lido após a montagem. O relatório registra **1.500 quadros reais, `r_frame_rate` e `avg_frame_rate` de 24/1, duração de vídeo/contêiner de 62,5 s, resolução de 1280×720 e zero streams de áudio**. O MP4 mede **21.681.228 bytes** e fica dentro do orçamento de entrega registrado de 24 MiB. Não houve reutilização de índices de fonte; a segunda decodificação registra **1.500 hashes de pixels distintos**, com maior sequência de quadros idênticos igual a um.

O SHA-256 do MP4 em `public/assets/v33/opening/eter-anima-opening-24fps.mp4` foi conferido diretamente contra o relatório: **`3f0fd3217c57b7dc1db4490179241df58c68d4c4045885ba8e24f4cb1bbe18d8`**. A cópia servida pela build tem o mesmo hash, conferido também por leitura direta nesta auditoria. A reprodução no navegador e a execução final de TypeScript foram confirmadas pela integração principal.

A revisão independente dos planos **01–06** abriu seis folhas com **30 pares de quadros** e comparou **12 PNGs nativos**, seis da fonte e seis da entrega. Os PNGs selecionados e o filme correspondem aos hashes registrados. **Nenhum bloqueador da compressão foi identificado nas amostras:** rostos, mãos, cabelo, bordados, elementos e adereços permanecem legíveis; Shin conserva as duas mãos/botas corrigidas, e as garras/penas de Dante e pregos de Max mantêm contornos. Há suavização discreta de detalhes distantes sem perda impeditiva da leitura principal.

O laudo próprio está em `docs/qa-v33/opening/compression-review-independent-01-06.md`, com índices e observações por plano. A conclusão cobre apenas as imagens abertas; não declara perfeição anatômica nos 1.500 quadros nem avalia flicker, transições ou ritmo pela reprodução contínua. QA concluiu a revisão dos planos 07–12; a integração principal revisou o conjunto e confirmou a reprodução no player. Os estados do pipeline e seus relatórios vinculantes não foram modificados por esta revisão independente.

## Reprodução na build de produção local — concluída

O relatório `docs/qa-v33/opening/browser-review.json` registra a build compilada Vinext/Wrangler local em **`http://127.0.0.1:5175`**. A entrega servida em `dist/client/assets/v33/opening/eter-anima-opening-24fps.mp4` tem SHA-256 idêntico ao MP4 verificado de `public`: **`3f0fd3217c57b7dc1db4490179241df58c68d4c4045885ba8e24f4cb1bbe18d8`**.

- Metadados no navegador: **62,5 s, 1280×720 e vídeo muted**.
- Movimento reduzido observado: a abertura iniciou **pausada**; reprodução manual funcionou.
- Reprodução natural chegou a **`ended=true`, `currentTime=62.5` e quadro nativo 1499**.
- Repetição reiniciou o filme; a pausa funcionou em **34,318378 s**, com quadro 823 e vídeo ainda muted.
- Teclas **1–5 e P** ficaram contidas no player. **Esc** voltou à tela inicial e devolveu o foco a **Assistir abertura**.
- O estado exposto pelo WebMCP antes/depois foi **JSON idêntico**, incluindo mapa, estágio, modo, posição, grupo e HP/MP; o relatório registra `stateUnchanged=true`.
- O teste controlado de fonte ainda ausente, documentado em `browser-recovery-test.json`, apresentou **Tentar novamente** e **Pular**, conteve as teclas, manteve a preferência de som e permitiu voltar com Esc.
- A entrada em tela cheia pelo controle do jogo foi observada. **No término, a tela cheia já estava desligada; a causa da saída não foi observada.** O player continuou funcional, e não se afirma permanência em tela cheia durante todo o filme.

A evidência visual está em `player-proof.png`. A build passou em cinco etapas, TypeScript terminou com saída 0 e os testes passaram **1.634 verificações do player + 250 dos atalhos**. Os relatórios vinculantes de exportação/compressão foram mantidos sob propriedade do pipeline; o laudo independente não modificou seus estados.

### Limites da validação

A revisão anatômica e da compressão utiliza quadros completos e recortes nativos amostrados; **não declara ausência absoluta de defeitos nos 1.500 quadros**. A reprodução contínua comprova o funcionamento observado nessa sessão de desktop, com movimento reduzido e reprodução manual. **O viewport mobile não foi testado no navegador**. A observação de saída de tela cheia tem causa desconhecida e não foi transformada em uma garantia de persistência. Este registro confirma a entrega e a validação local, sem declarar publicação remota.
