# Big update v36 — revisão de requisitos, comportamento e apresentação

Data: 11/10/2026. Repositório: `C:\Users\Diego\OneDrive\Documentos\GitHub\RPGnovo`.

**Estado deste registro:** lógica, controles, integridade das artes e TypeScript foram aprovados. O build final **`49e9e9f991b84866a6aa`** passou com exit 0 e seu HTTP real passou **61 verificações**, incluindo quatro pistas, acabamento ilustrado, carregamento restrito e compactação de menu em retrato baixo. A raiz verificou o menu em **405×452**, com **196,80 px de conteúdo útil e sem overflow**. Combate nas três viewports, Abel, previews, save e atualização pública foram conferidos. Instalação física, reabertura offline real, escuta subjetiva e pesquisa com jogadores permanecem sem comprovação. Este registro não confirma publicação ou commit/push.

## 1. Revisão dos requisitos

| Pedido | Implementação conferida |
| --- | --- |
| Mesma quantidade de habilidades em todas as árvores | Dez famílias jogáveis: Seiji, Ophelia, Marin, Gabriel, Max, Beatriz, Orfeu, Ava, Carmilla e Abel. Cada kit completo oferece sete habilidades e uma ultimate; cada árvore tem nove nós e custa 13 pontos. Custos, identificadores e requisitos antigos foram preservados. O pedido posterior torna Abel jogável; seu NPC da oficina permanece para história e vínculo. |
| Completar os kits que tinham menos opções | 24 habilidades novas: Seiji 2, Ophelia 2, Max 3, Beatriz 3, Orfeu 5, Ava 5 e Carmilla 4. Marin e Gabriel já tinham sete. O pedido posterior acrescenta o kit próprio de sete habilidades de Abel. Há ícones próprios e efeitos com custo, alvo, estado e impacto reais. |
| Cinco versões extras 5★ no Gacha | Seiji — Códice do Horizonte; Ophelia — Equinócio Branco; Marin — Trono sem Estrelas; Gabriel — Juramento Solar; Max — Réquiem do Trovão. São obtenções independentes, com propriedade e duplicatas próprias; a versão base continua disponível. |
| Três versões míticas lendárias | Ava — Matriarca dos Estratos; Beatriz — Rainha da Maré do Eclipse; Orfeu — Arconte da Página Livre. São 5★, sem criar raridade 6★. Também pertencem ao pool real de personagens. |
| Poder e identidade próprios, além do traje | As oito versões têm bônus definidos, assinatura e ultimate premium. Seus efeitos incluem combinações reais de dano, cura, guarda, limpeza de estados, controle e redução de carga. Equipar não cura nem repõe MP; a assinatura premium substitui a familiar, mantendo a paridade do kit. |
| Companheiros das cinco versões | Shin, Mika, Umbra e Vajra mantêm a identidade humana chibi; Dante continua fênix. Cada um tem quatro poses próprias da versão e aparece no Grupo/cinema quando ela está equipada. As formas originais conservam suas artes; Ava, Beatriz e Orfeu não receberam pets inventados. |
| Elementos e direção visual | Ava usa Terra mineral/ocre; Ophelia usa Gelo; Beatriz usa Água/Trevas; Orfeu usa combate físico neutro e antimagia. Os kits finais seguem a direção anime, com figurinos cobertos e reimaginações autorizadas do Baile. As artes finais de Ava, Ophelia e do novo Orfeu estão registradas; candidatos rejeitados permanecem como histórico, não como fonte selecionada. |
| Progressão e orientação acessíveis | Dicas contextuais discretas, expansíveis e dispensáveis de forma persistente. Não exigem invocar nem interrompem o jogo com abertura automática de menus. O evento usa ações reais e objetivos sequenciais. |
| Três atividades jogáveis do Baile | Enigma de quatro pistas irredundantes, compasso visual/por etapas e arena de três escolhas/três provas. Preservam campanha, Grupo, odds/pity e prêmios dos atos I/II. Prêmios adicionais únicos: 160 cristais por atividade mais 320 pelo conjunto, total de 800. |
| Instalação e continuidade do progresso | PWA com abertura/cache offline parcial, transferência explícita por arquivo local e proteção contra sobrescrita entre abas. Não há sincronização de conta ou entre máquinas. |

### Alcance das árvores e obtenção

Os 13 pontos são alcançáveis no jogo: dois iniciais + nove avanços até o nível máximo 10, após 540 XP, totalizam 11. As recompensas antigas **Nada fica para trás** (`supplies`: baús do Arquivo e Subsolo) e **Primeira patrulha** (`patrol`: cinco encontros de lobo/sombra) acrescentam um ponto por família cada. Recrutar uma família depois preserva os pontos. Outros caminhos pelas quests antigas também são possíveis; esse caminho não exige gasto de tiros, professor no Grupo ou origem específica.

As taxas por tier e garantias foram preservadas: 2% de 5★, mais 20% de 4★, aumento da taxa a partir da 65ª tentativa sem 5★, 5★ na tentativa 80 e 4★ ou superior a cada dez. O pool 5★ foi ampliado para 12 entradas: quatro anteriores e oito versões novas. A seleção dentro do tier permanece uniforme; a ampliação do pool muda a distribuição entre entradas, sem prometer uma versão específica em qualquer 5★. Carmilla conserva sua obtenção por conquista.

**Lua de Sangue** é permanente e tem dois atos:

- **Ato I — O Baile dos Cinco Selos:** aceitar, viajar ao Arquivo, concluir conversa com Ava, guardar em combate, vencer depois e concluir conversa com Beatriz. Recompensa única de 800 cristais, equivalentes a cinco tiros reais; não garante uma versão 5★.
- **Ato II — As Três Páginas Livres:** exige o prêmio do ato I e o capítulo concluído/relatado no stage 5. Usa conversa com Ava, cura efetiva por habilidade em combate, Abel na Clareira da Pira, vitória posterior, Beatriz e Orfeu. Permite escolher explicitamente uma das três lendárias, uma única vez, sem moeda, sorteio ou consumo de pity. Se a forma já foi obtida, aplica a duplicata 5★ normal. Não requer possuir uma 5★ antes.

### Preparação do próximo patch

`lib/game/patches/types.ts`, `registry.ts` e `README.md` são somente scaffold de autoria. `PATCH_DRAFTS` está vazio e não é importado pelo motor. Novas áreas, lojas, itens e curvas de status continuam preparadas para o próximo projeto. O pedido posterior de balancear o combate foi implementado nesta revisão pelo módulo `combatCadenceV37`, sem ativar os rascunhos do patch.

## 2. Revisão do comportamento

### Movimentação e controles

A auditoria encontrou pausa de um update a cada waypoint, oscilação ao ultrapassar pontos com Shift e passos animados contra obstáculos. A correção usa um orçamento de distância: atinge o próximo ponto e utiliza o restante no segmento seguinte, sem pausa artificial ou snap gratuito. Caminhada continua em 3,8 tiles/s e corrida em 6,15 tiles/s; colisões por eixo, NPCs, interações e travas de história continuam ativas.

`walkDistanceV36` conta somente deslocamento efetivo, fica fora do save e dirige a fase/cadência no renderer. Trocar de direção conserva a fase; pausa/replay não a avançam. `clearMovement` limpa entradas/caminho e reinicia a fase para repouso. A correção utiliza as poses nativas prontas: não criou desenhos ou quadros adicionais para resolver a cadência. O ciclo das versões continua `0,1,2,1`, com três recortes nativos distintos por direção. Orfeu original conserva oito poses por direção; Abel usa quatro folhas de oito poses, e seu NPC conserva a seleção nativa por relógio e repouso 2.

Foram corrigidos também:

- O prefixo `P, P, A` do Modo Mestre observa a sequência sem atrasar o primeiro movimento para esquerda. A ativação completa mantém a limpeza do deslocamento.
- Enter/espaço em um botão focado da abertura ou sessão suspensa preservam a ativação nativa do botão. Os comandos do jogo continuam bloqueados e o movimento é limpo.
- Soltar/cancelar o toque ou perder pointer capture interrompe a direção; blur/visibilidade limpam entradas antigas. Slots 1–5/Tab preservam a ordem do Grupo, os vitais e a fila da batalha.

O teste chama o motor e `WorldRenderer.actor` reais com contexto de canvas controlado, dimensões/RGBA dos PNGs finais e métricas nativas. Cobre as oito versões e Lycan Solar, quatro direções, clocks de 30/60 FPS, Shift, obstáculos, NPC real, escada bloqueada, tutorial, save e freeze. Esses clocks simulados não são uma medição de FPS de aparelhos reais.

### Saves, recompensas, áudio e PWA

Os testes verificam comandos e callbacks de impacto reais. Fechar/reabrir painéis, repetir callbacks ou retomar saves não paga novamente os atos. Conversa conta ao terminar; cura só conta quando HP é efetivamente restaurado. `healingsV36` publica o valor real por aliado, limitado ao HP faltante.

Saves antigos migram sem conceder formas ou concluir recompensas automaticamente. `HeroId`, slots, equipamento, origens, família e missões permanecem estáveis; a forma visual equipada é estado separado. A troca Lycan de Gabriel resolve os assets solares próprios e conserva o mesmo ID de obtenção/kit.

O som desligado persiste entre telas, mapas, batalha e recarga. As 16 composições WAV originais têm análise técnica e testes de arquivo/impacto/mute, incluindo bloqueio de `play()` atrasado. A revisão auditiva subjetiva permanece pendente: a ferramenta do agente de áudio informou que não suportava a entrada, conforme `audio/README.md`.

A transferência PWA usa o parser/migração do motor, prévia de mapa/nível/Grupo/tempo e confirmação explícita no título/seleção. Antes da troca, guarda backup em `eter-anima-save-import-backup-v36`; falhas de escrita tentam rollback e rejeitam a importação. Importar áudio ativo não reativa um aparelho silenciado. A importação libera Continuar, sem iniciar partida ou pagar recompensas.

Entre abas, uma sessão antiga pausa ao detectar outro save e pede recarga antes de sobrescrevê-lo. Uma mudança após a prévia invalida a confirmação anterior. Atualizações PWA exigem estado seguro e respeitam outras janelas abertas.

A raiz executou duas atualizações públicas na origem local. Na primeira, **Salvar e atualizar** recarregou a janela de a616 para 090a, com `index.CsI69JP_`/`page.Dt0olaFn` e duas molduras nativas no título. Na atualização final, aceita pelo título, o DOM carregou **`index.B1p20_eK.css` / `page.Dt0olaFn.css`**, da revisão **49e9**. **Continuar** manteve os cinco integrantes, líder Abel, HP/MP/cargas, som desligado e os três resgates mais o bônus. A permanência do shell antigo até a confirmação era esperada. Essa é evidência de atualização e preservação do save naquele navegador local, sem comprovar instalação física ou navegação offline real.

A raiz confirmou a proteção do save em duas abas reais: a sessão antiga pediu recarga e retomou o progresso mais recente. Na abertura, os relógios reais áudio/vídeo foram 0,615/0,657 s ao iniciar, 11,68/11,71 s ao pausar e 33,36/33,44 s após ativar o som novamente. Com mute, o vídeo continuou e o áudio permaneceu pausado. No fim, o vídeo parou em 62,5 s e a trilha em 62,429 s, pausada e silenciada; repetir reiniciou ambos em zero. Sair restaurou a faixa do título após o fade de 450 ms. Isso verifica esses gestos no navegador utilizado, sem substituir escuta subjetiva.

**Offline é parcial:** shell e imagens já cacheadas podem ser usados dentro dos limites do cache; conteúdo não cacheado ainda exige rede/retry. Áudio, vídeo e pedidos Range não são prometidos offline. A transferência é local, não um backup/sync em nuvem.

Nas atividades v38, a gravação do prêmio reverte saldo e flag se o save falha; recarga/repetição não paga novamente. O ritmo usa relógio/token reais e é interrompido ao sair. A incompatibilidade entre offsets de pausas longas e o normalizador foi corrigida: quatro acertos seguidos de um quinto sinal perdido após 110 segundos ou sete dias continuam válidos e premiados uma vez. A arena usa cartas emprestadas, duas trocas por tentativa e resultados determinísticos; não consome HP/MP do Grupo. A atualização PWA fica bloqueada durante uma sessão de atividade. O enigma conserva a mesma semente, resposta e prova salva após reduzir a apresentação a quatro pistas irredundantes.

## 3. Revisão da apresentação

O registro final usa fontes nativas, hashes, alpha real, gutters e recortes/âncoras medidos. A verificação compara pixels RGBA dos recortes com as fontes; não mascara transparência nem redesenha/redimensiona PNGs para fazer o gate passar. As folhas e ícones específicos estão presentes nos caminhos de produção.

A revisão de movimento encontrou que o gerador consumia apenas `manualHeadTopOverrides`, deixando de aplicar `metrics` de Seiji/Ava e `bodyTops` de Beatriz. Seiji variava de 93,18 a 98,32 px entre cabeça e sole, porque o topo do crop incluía o pincel. A integração principal corrigiu o consumo das métricas, com o mesmo remap das poses. O consumer agora mantém 107 px de cabeça a sole e bob máximo de 0,6 px nos casos testados. Foi uma correção de metadados/escala, sem novas poses.

Também foram conferidos o foco da ultimate abaixo do letterbox, avanço de ataque limitado à lane e prévia estática legível com movimento reduzido. O palco usa o contato real do motor em 1×/2×. As três lendárias têm cenário cinematográfico próprio; efeitos e companheiros seguem a identidade equipada. A raiz confirmou as três previews lendárias com contato nativo no quadro 5 e uma ultimate de Max com 144 de dano no chefe. A observação de cinco cards de 68 px sem rolagem pertence ao layout v36 anterior.

O combate atual mantém cinco slots em uma faixa de **40 px em desktop/paisagem e 60 px em retrato**. A raiz mediu **197 px de palco em 844×390** e **167 px em 405×452**, com página limitada à viewport e sem overflow horizontal; em 1310×572, o palco teve 379 px. A fila mostra as oito posições possíveis, incluindo as ações repetidas do inimigo. Os detalhes usam um host estável que acompanha fullscreen padrão/WebKit. [Geometria e interações observadas](battle-minimal.md).

O acabamento v38 aplica o salão ilustrado e a moldura transparente aos menus, título, diálogo e Sistema. Dez recortes CSS nativos mantêm a proporção de cantos/gemas, são decorativos e não capturam foco/toque; os fundos semânticos antigos continuam variando por seção. Artes originais não foram repintadas ou redimensionadas. A validação de tipos e recortes passou. A raiz conferiu o menu compacto em retrato e o PC final em 1310×572, sem overflow ou imagens quebradas. [Revisão do navegador](../qa-v38/browser-review.md). Isso não é pesquisa de preferência ou facilidade de uso com jogadores.

A revisão real em 405×452 encontrou inicialmente um cabeçalho de aproximadamente 152 px e uma faixa de status de 100 px, deixando cerca de 100 px para o conteúdo. O ajuste final é só CSS para menus em retrato de até 600×600. Após o build e a atualização pública, a raiz mediu **cabeçalho de 64 px, status de 40 px, navegação de 52 px com tabs de 40 px, fechar de 44×44 px e conteúdo de 196,80 px**, sem overflow. A descrição continua no DOM/aria, apenas visualmente recortada; a linha redundante de procedência é ocultada. PostCSS/15 asserts, TSC e diff-check passaram. As medidas finais vêm do navegador, separadamente dos limites estáticos. [Captura final do menu](../qa-v38/menu-portrait-browser.jpg).

O carregamento de combate passou a limitar **seis imagens simultâneas**, com prazo de **15 segundos por requisição iniciada**, sem contar a espera da fila. Gabriel humano exclui seus três atlas Lycan. No caso Cinder com cinco integrantes, o escopo corrigido usa 25 URLs, cerca de 55,62 MiB transferidos e **aproximadamente 150 MiB decodificados**; o caso anterior exigia 28 URLs/168 MiB. São estimativas de bytes RGBA, não medidas de memória ou tempo de um aparelho físico. Escopos em uso são protegidos e imagens de grupos anteriores são retiradas após a resolução. [Investigação e limites](../qa-v38/battle-art-loading.md).

### Recrutamento e árvore de Abel no navegador

O save normal validado pelo motor foi importado por prévia e **Confirmar substituição**, seguido de **Continuar**. No Pátio, **Convocar → Abel → Aula de Vínculo** completou as três falas; Abel entrou na reserva, preservando os cinco integrantes antigos. Pelo Grupo, a raiz trocou Max por Abel e aprendeu os nove nós pelos botões reais, consumindo os 13 pontos até zero. Salvar e recarregar manteve Abel.

A preview da ultimate mostrou o impacto nativo no quadro 5 no palco desktop de 244 px. Em viewport mobile 844×390, o palco de 134 px ocupou y=142…277, inteiramente dentro da tela. As evidências estão em [árvore de Abel](abel-tree-browser.jpg) e [ultimate mobile de Abel](abel-ultimate-mobile.jpg). Esse fluxo usa propriedade normal de Abel, sem Modo Mestre nem alteração das chances de convocação.

### Resultados consolidados

Os números abaixo correspondem aos resultados concluídos nesta integração; não representam aprovação de todos os aparelhos ou ausência absoluta de defeitos visuais.

| Gate | Resultado | Evidência principal |
| --- | ---: | --- |
| `game.test` | PASS · 1.064 | Assets reais e regressões do jogo; inclui os oito ícones específicos de Abel |
| `content-v36` | PASS · 1.423 | Paridade das dez famílias, aprendizado, 24 impactos, versões reais, evento I, save e hints |
| `abel-playable-v36` | PASS · 626 | Recrutamento real, recuperação de vínculo/save, sete técnicas, básicos, ultimate, fila e oito ícones próprios |
| `abel-visual-v36` | PASS · 8.609 | Recortes nativos, vinte poses com cabeça/solas medidas, altura adulta comparada ao elenco nas três viewports, sete descritores, oito ícones próprios e contato real da ultimate em 1×/2× |
| `abel-npc-v31` | PASS · 5.432 | Patrulha, aproximação real, colisões, diálogo e 32 poses nativas do professor na oficina |
| `skill-tree-v36` | PASS · 546 | As dez árvores e seus nós/requisitos cabem na área de rolagem, sem sobreposição |
| `legendary-v36` | PASS · 227 | Três lendárias, ato II acessível, escolha/recompensa única, neutro físico e migração |
| `movement-v36` | PASS · 59.089 | Motor e renderer reais; distância/cadência, native head/foot, PC/toque, freeze e save |
| `native-art-v36` | PASS · 404.694 | 404 células nativas e 24.902 linhas RGBA de recortes; hashes, contato, enquadramento e Lycan |
| `pwa-save-v36` | PASS · 90 | Pacote/legado, prévia, backup/rollback, mute conservador e retomada |
| `pwa` | PASS · 111 | Service worker/cache/update/Range, redirect real, página offline canônica e SHA do HTML |
| `ui-session-v36` | PASS · 198 | Ciclo de vida real, modais, descarte, controles, áudio, PWA, transferência e bloqueio de update durante atividade |
| `hero-labels-v36` | PASS · 211 | Identidade/raridade, títulos longos, vitais, carga e ultimate equipada |
| `battle-layout` | PASS · 2.230 | Limites reais da formação, nomes, separação e inclusão de Abel |
| `battle-polish-v32` | PASS · 509 | Escopo da identidade realmente equipada, carregamento, alvos, previsões e tempo/poses do combate |
| `battle-art-loading-v38` | PASS · 59 | Fila real limitada a seis, prazo após iniciar, deduplicação palco/cinema, retenção, cancelamento e retry |
| `battle-minimal-v36` | PASS · 155 | Cinco slots compactos, alvos/atores, vitais, fila de oito posições e habilidades sem rolagem |
| `battle-header-v36` | PASS · 13 | HP/estados/fase em células explícitas do cabeçalho |
| `event-activities-v38` | PASS · 1.345 | Quatro pistas irredundantes entre 120 ordens, mesma semente/resposta/save, compasso acessível/pausas longas, arena legal, prêmios únicos/rollback/migração |
| `event-activities-ui-v38` | PASS · 275 | Callbacks reais, ritmo/token/cancelamento, rostos/aros, HP gravado, pausa/manual/reduced motion, derrota e resgate |
| `combat-cadence-v37` | PASS · 14.149 | Orçamento inimigo fixo nos três modos com 1/2/5 aliados, iniciativa, reação entre ultimates, controles, carga, previsão e save |
| `combat-details-fullscreen-v37` | PASS · 22 | Portal real de detalhes/Estados: fullscreen padrão/WebKit, foco, nó estável, prevenção de ciclo e limpeza |
| `party-hotkeys-v30` | PASS · 250 | 1–5/Tab, slots/vitais, guards, fila/alvos e líder persistido |
| `variant-audio-v36` | PASS · 247 | 16 WAVs, oito identidades, sinal, caminho, duração e impacto |
| `opening-audio` | PASS · 72 | MusicDirector/hook reais: relógio, mute, gesto, pausa, replay, fim e descarte |
| `opening-cinematic-v33` | PASS · 1.643 | Player real: relógio, buffering, seek/fim, controles e movimento reduzido |
| `media-range` | PASS · 291 | Contrato de mídia e respostas Range |
| TypeScript | PASS · exit 0 | Verificação integrada `tsc --noEmit`, informada pela raiz |
| Build final integrado | PASS · exit 0 | `pnpm build`; revisão `49e9e9f991b84866a6aa`, 18 arquivos de shell e 2.033.462 bytes; inclui o menu compacto em retrato baixo |
| HTTP do build final | PASS · 61 | Handler SW publicado com respostas HTTP nativas: install/fetch, fallback direto sem redirect, SHA esperado, abertura isolada sem rede e Range206/32 bytes |
| Combate e menu compacto no navegador | PASS | Combate nas três viewports; menu 405×452 com 196,80 px de conteúdo, fechar 44×44 e sem overflow; PC final 1310×572 sem overflow ou imagens quebradas |

Regressões adicionais preservadas estão em `logic-gates.txt`; sistemas/contratos em `SISTEMAS-V36.md`; UI em `ui-refactor.md`; PWA em `docs/pwa-installation.md`. O polish histórico549 incluía40 checagens Lycan não selecionadas;509 mantém as regressões de comportamento com o escopo correto. A UI passou de232 para275 após o replay ilustrado. Histórico:6c73 tinha1.935.682bytes/18arquivos e HTTP30; a616 tinha2.007.007bytes/18arquivos e HTTP61;090a tinha2.031.831bytes/18arquivos e HTTP61, com prova de atualização/combate, antes do ajuste do cabeçalho. A tabela usa49e9. [HTTP final](../qa-v38/pwa-http.txt).

### Gates finais e limites de validação

- TypeScript, gates atuais de lógica/UI, build final 49e9 e HTTP61 passaram. A raiz verificou combate/Abel nas três viewports, o menu compacto e a preservação de Grupo, vitais, som desligado e recompensas após as duas atualizações públicas. Essas leituras do navegador são separadas do gate HTTP.
- A instalação física da PWA, a abertura offline e a atualização em Android/iPhone não foram verificadas. A falha anterior de instalação foi identificada: `/pwa-offline.html` retornava redirect, corretamente rejeitado pelo SW. O reparo usa `/pwa-offline`, valida MIME e SHA do HTML e mantém a rejeição global de redirects. O handler passou no HTTP final de61 verificações com CacheStorage/eventos isolados; separadamente, **Salvar e atualizar** foi aceito na interface local e carregou o CSS/DOM final. O HTTP antigo de30 checks não executava a instalação. Esse caso local não aprova todos os aparelhos ou navegadores.
- Fim, repetição e saída da abertura foram conferidos no navegador. A escuta subjetiva das composições originais está pendente, além da análise técnica já aprovada.
- Commit/push e publicação ficam sob controle da raiz; este registro não promete nem confirma entrega remota.
- A revisão técnica/visual da raiz não substitui pesquisa com jogadores nem comprova diversão, preferência estética ou facilidade de uso em todos os aparelhos.

A estrutura futura continua somente rascunho. Os gates técnicos e os fluxos observados têm evidência de execução; os limites acima permanecem explícitos, sem afirmar perfeição visual ou aprovação de todos os aparelhos.
