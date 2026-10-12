# Refatoração da tela e apresentação v36

Data: 11/10/2026. Repositório: `C:\Users\Diego\OneDrive\Documentos\GitHub\RPGnovo`.

## Responsabilidades

- `app/page.tsx` tem **60 linhas** nesta revisão: compõe as cenas e as condições principais. Não contém mais o ciclo de vida do navegador nem os handlers extensos de teclado. A apresentação de combate foi refinada posteriormente nos componentes próprios.
- `hooks/use-game-session.ts` mantém a instância do motor, snapshot e estado da interface. Os getters dos controles leem refs atuais; a abertura bloqueia entrada no mesmo gesto que a exibe.
- `use-game-world`, `use-game-audio` e `use-game-fullscreen` possuem seus efeitos e limpeza. O carregamento não publica estado depois de desmontagem; eventos, renderer e áudio são descartados uma vez.
- `lib/game/ui-controls.ts` exporta os controles reais de teclado e pointer capture. `ui-session.ts` exporta as transições de menu/abertura/replay. `ui-world.ts`, `ui-audio.ts` e `ui-fullscreen.ts` exportam os ciclos de vida usados pelos hooks e pelos testes.
- `components/game-shell/` separa título, HUD, exploração, diálogo, combate, avisos, painéis, diário, bolsa e Sistema. Os blocos visuais mantêm as classes existentes.

## PWA e transferência

O controle de instalação/atualização é fornecido pelo componente PWA no Sistema. A tela inicial tem um acesso ao mesmo Sistema, sem ações de salvar/recomeçar uma aventura ainda não carregada. `onUpdatePendingChange` mantém a sessão pausada durante a ativação assíncrona, bloqueia comandos e pointer, e o diálogo impede fechamento e ações de jogo. Erros liberam novamente a interface. A atualização requer um estado seguro, sem atividade do baile em curso, e confirmação do save atual no mundo; título e seleção não escrevem novo progresso para atualizar. A própria atualização pendente continua elegível para sua revalidação, sem liberar o jogo.

`ui-save-transfer.ts` permite importar somente no título/seleção, sem abertura, revelação ou carregamento pendente. O motor valida e escreve o pacote local; a UI sincroniza volume/som com o MusicDirector e volta ao título para continuar a aventura importada. Um pacote com som ligado não reativa um navegador silenciado. Nenhum upload externo é feito por esse fluxo.

O conflito de progresso entre abas usa um modal por portal, com foco contido, para impedir que uma sessão antiga sobrescreva a aventura nova. Uma alteração de save após a prévia de importação invalida a confirmação; tentar novamente produz uma nova prévia antes de substituir o progresso. F5 e os atalhos de recarga do navegador continuam disponíveis, sem disparar controles do jogo. A revisão do SW inclui hashes dos assets nativos; o preenchimento dos caches usa `cache: 'reload'`, evitando recuperar arte antiga do cache HTTP quando o endereço é mantido.

A raiz confirmou **Salvar e atualizar** para 090a pelos controles públicos: houve reload e mudança do DOM de a616 para `index.CsI69JP_`/`page.Dt0olaFn`, com duas molduras nativas no título. A atualização final para **49e9**, aceita pelo título, carregou **`index.B1p20_eK.css` / `page.Dt0olaFn.css`**. Continuar preservou cinco integrantes, líder Abel, HP/MP/cargas, som desligado e os três prêmios mais bônus. O shell anterior permanecia enquanto a atualização aguardava confirmação. Esses fluxos locais não comprovam instalação física ou reabertura offline real.

## Evento, árvore e artes

- Grupo: seletor da versão Original (raridade da família preservada) / versão 5★, com disponibilidade real e descrição do traje, história e técnicas. O catálogo equipa a variante convocada sem repetir Aula de Vínculo.
- Convocar: painel Lua de Sangue — O Baile dos Cinco Selos usa as etapas e recompensa do motor. Mostra 800 cristais = 5 invocações, recompensa única e ausência de garantia 5★.
- Ato II: As Três Páginas Livres explica os bloqueios de capítulo/ato I, acompanha os seis objetivos reais e apresenta a escolha garantida única entre Ava, Beatriz e Orfeu. A confirmação só fica disponível após selecionar uma opção. A escolha recebida e a conversão de uma duplicata são informadas sem modificar as regras do motor.
- Dicas: recolhidas inicialmente, expansíveis ao toque e dispensadas de forma persistente. Não interrompem movimento nem abrem automaticamente menus.
- Árvore: `skillTreeLayoutV36.ts` dá um slot único por coluna de dependência a todos os nós, inclusive passivos/exploração; a altura inclui o último nó e o foco.
- As **dez famílias**, incluindo Abel, têm sete habilidades, ultimate e árvore de nove nós/13 pontos. O professor conserva seu NPC e não recebe companheiro inventado.
- Atividades v38: três ensaios aparecem em Eventos/Convocar; a navegação sinaliza prêmios disponíveis e leva ao resgate real. O enigma usa quatro pistas irredundantes com a mesma semente/resposta/save; ritmo tem alternativa sem tempo, token/cancelamento e prêmio igual; arena apresenta escolhas, plano inimigo e HP dos movimentos gravados. Trocar o painel ou desmontá-lo encerra a sessão; recarregar interrompe um ensaio parcial e preserva os prêmios concluídos.
- Retratos, ordem de turnos, palco, cinema e preview de ultimate resolvem a identidade visual equipada por `heroArtIdV36`. As molduras elementais exclusivas da família continuam utilizadas. Os cinco companheiros resolvem arte própria da variante no Grupo e no cinema; as formas originais mantêm suas artes canônicas. Professores não recebem pets inventados.
- O HUD compacto mostra o nome da família e 5★, preservando a versão completa no tooltip e nos rótulos acessíveis. O menu reserva uma linha própria de até duas linhas para o título da versão; somente os cards equipados usam 142 px (identidade) ou 154 px (vitais). A barra ULT identifica a ultimate da versão equipada, sem anunciar a técnica original.
- Os fundos dos cards compactos são 100% opacos, com contraste medido de pelo menos 6,10:1 nas áreas de leitura. A geometria dos cinco slots permanece intacta, sem acrescentar rolagem ao Grupo do combate.
- Menus, título, diálogos e Sistema receberam `archive-canvas.png` e `arcane-frame.png`. `NativeMenuFrame` usa dez janelas CSS da fonte de 1774×887, com cantos/gemas proporcionais e trilhos pintados; é `aria-hidden` e não captura input. Fundos library/armory/atlas continuam variando por seção; o contraste fica nas áreas de texto. O centro transparente conserva os bytes originais, inclusive o alpha1 residual documentado no manifest. Nenhum PNG foi alterado pela integração.
- No combate atual, cinco slots ficam em uma faixa de **40 px no desktop/paisagem e 60 px em retrato**, mantendo HP/MP/ULT, ator e alvo aliado distintos. A raiz mediu **197 px de palco em 844×390** e **167 px em 405×452**, sem overflow horizontal. A fila admite oito posições únicas, incluindo reações inimigas repetidas; detalhes/Estados usam um host estável dentro do fullscreen padrão/WebKit. A observação anterior de rodapé de 68 px é histórica. [Geometria e interação reais](battle-minimal.md).
- Os companheiros premium usam o atlas de quatro poses com recorte nativo e clipPath, sem exibir células vizinhas nas margens. O Grupo usa a pose 0. A cinemática usa o mesmo clock da ultimate para preparar, conjurar, atingir e retornar; movimento reduzido mantém a pose 2. As dimensões naturais são lidas quando não fornecidas pelo registro.
- Ícones priorizam a key específica por ação, incluindo as novas técnicas v36, e depois o motivo do kit. Guardar mostra o MP real com os passivos. Ultimates mostram a descrição premium real.
- Técnicas de suporte reconhecem `ally`, `self` e `party`. Ultimates premium com dano e cura desenham o impacto elemental no inimigo e a cura no grupo. `healingsV36` informa o HP realmente restaurado por aliado; o palco prioriza esses números individuais, sem repetir o valor agregado ou a cura legada.

## Verificações executadas

| Suíte | Resultado | Escopo |
| --- | --- | --- |
| `ui-session-v36` | PASS, 198 checks | Controles exportados, título/abertura/menu, pointer capture, descarte/carregamento tardio, mute, fullscreen padrão/WebKit, atualização explícita/ativação pendente, bloqueio durante atividade, conflito entre abas, recarga e nova prévia de transferência |
| `variant-ui-v36` | PASS, 59 checks | Oito kits reais, raridade original, propriedade/equipamento, companheiros e bloqueios/objetivos/recompensa do ato II |
| `hero-labels-v36` | PASS, 211 checks | Nomes compactos das oito versões no HUD/palco/turnos, título separado no menu, identidade acessível completa, vitais/carga e ultimate equipada; formas humanas/lupinas de Gabriel, nomes originais e Abel preservados |
| `native-sprite-v36` | PASS, 117 checks | Recorte e clipping do raster, dimensões nativas, quatro poses no contato real e movimento reduzido |
| `party-hotkeys-v30` | PASS, 250 checks | Bindings reais 1–5/Tab, slots/vitais/cargas, guards, fila e alvo aliado |
| `quest-replay-v34` | PASS, 785 checks | Cinco filmes, seen gate, tokens, save/recompensas intactos, retorno a Cenas e foco |
| `skill-tree-v36` | PASS, 546 checks | Dez famílias, posições únicas, limites de foco e altura medida |
| `abel-visual-v36` | PASS, 8609 checks | Vinte poses corporais medidas, formação/altura adulta, recortes/ícones e ultimate real |
| `battle-polish-v32` | PASS, 509 checks | Preload por identidade equipada, sem exigir Lycan humano, cache/retry, companheiro, alvos, previsão e timing nativo em 1×/2× |
| `battle-art-loading-v38` | PASS, 59 checks | Máximo de seis requisições compartilhadas, prazo após iniciar, deduplicação/retenção/cancelamento e retry |
| `battle-minimal-v36` | PASS, 155 checks | Cinco slots compactos, seleção 1–5 sem mudar o ator, vitais e fila completa |
| `combat-cadence-v37` | PASS, 14149 checks | Janelas inimigas reais, orçamentos fixos, controles, carga, previsão e save |
| `combat-details-fullscreen-v37` | PASS, 22 checks | Host estável, fullscreen padrão/WebKit, foco, ciclo e limpeza |
| `event-activities-v38` | PASS, 1345 checks | Quatro pistas irredundantes, mesma semente/resposta/save, clocks/pausas longas, escolhas legais e prêmios únicos |
| `event-activities-ui-v38` | PASS, 275 checks | Callbacks reais, tokens/cancelamento, rostos/aros e HP gravado, pausa/manual/reduced motion, derrota, descoberta/rota e resgates |
| `pwa` | PASS, 111 checks | SW, cache/revisão dos assets, atualização explícita, redirect HTTP real e fallback canônico/SHA |
| `pwa-save-v36` | PASS, 90 checks | Pacote local, confirmação/prévia, conflito entre abas, backup/rollback e mute conservador |
| `media-range` | PASS, 291 checks | Streams reais, bytes dos seis filmes, cancelamento/HEAD/validadores e HTTP workerd em origem isolada |

Os dois testes que extraíam handlers da Page agora executam as funções exportadas usadas pela página. As assertions anteriores foram preservadas. O teste de combate mantém suas verificações e injeta o novo resolver real.

O polish histórico de 549 examinava 40 chaves Lycan não selecionadas;509 segue o escopo corrigido, mantendo regressões de comportamento. A UI de atividades232 é histórica; 275 inclui o replay ilustrado. No caso Cinder com cinco integrantes humanos, o lote atual tem25 URLs,55,62 MiB transferidos e aproximadamente 150 MiB RGBA. Até seis imagens carregam juntas; o prazo de 15 s começa na requisição, não na fila. Esses valores não medem memória/FPS de celular. [Escopo e limites](../qa-v38/battle-art-loading.md).

TSC e build final integrado passaram com exit 0. As fontes estão congeladas. A revisão **`49e9e9f991b84866a6aa`** tem **18 arquivos de shell / 2.033.462 bytes**, com menu compacto para retrato baixo. O gate HTTP61 foi reexecutado pela raiz no SW publicado: install/fetch, offline canônico e Range206/32 bytes. CacheStorage/eventos são isolados; a atualização pública e a geometria foram testadas separadamente no navegador local. Histórico: a616 tinha 2.007.007 bytes/18 arquivos; 090a tinha 2.031.831 bytes/18 arquivos e a prova de combate/update antes da compactação. [Evidência final](../qa-v38/pwa-http.txt).

O ajuste em retrato de até 600×600 não altera componentes ou regras: apenas reduz cabeçalho/status, recorta visualmente a descrição acessível e mantém tabs de 40 px/fechar de 44 px. PostCSS/15 asserts, TSC e diff-check passaram. A fricção real anterior em 405×452 era conteúdo útil de cerca de 100 px, com cabeçalho de 152 px/status de 100 px. A raiz mediu o build final: **cabeçalho 64 px, status 40 px, navegação 52 px com trigger 40 px, fechar 44×44 px e conteúdo 196,80 px**, sem overflow. [Captura final](../qa-v38/menu-portrait-browser.jpg).

O experimento Mika v35 descartado não foi restaurado. Não foram criadas rotas temporárias por esta refatoração. A raiz executou o combate nas três viewports, o menu final em 405×452, o PC em 1310×572 e os fluxos de Abel, previews e proteção do save descritos em `BIG-UPDATE-REVIEW.md`; isso não comprova instalação física em Android/iPhone ou no sistema operacional do computador. A falha histórica do SW foi identificada como redirect `.html`; o reparo canônico passou no HTTP61. As duas atualizações explícitas locais foram executadas separadamente pela interface; não se extrapola para todos os aparelhos/navegadores nem para offline real. Não houve pesquisa estruturada de usabilidade ou preferência com jogadores. Commit/push e publicação não são confirmados por este documento.
