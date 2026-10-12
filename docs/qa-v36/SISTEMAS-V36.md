# Lua de Sangue — sistemas v36

## Estado e compatibilidade

Trabalho no repositório `C:\Users\Diego\OneDrive\Documentos\GitHub\RPGnovo`. Existem nove famílias jogáveis e cinco origens. Versões do Baile são obtenções 5★ independentes, identificadas em `summoned`, com suas próprias duplicatas/constelações. `HeroId`, ordem do Grupo, companheiros base, equipamentos, vitais, slots, quests e origens permanecem familiares.

`heroVariantsV36` guarda a forma equipada por família. Equipar requer obter a versão e recrutar sua família; não cura, não restaura MP, não muda SPD e não equipa automaticamente. A forma base pode ser restaurada. Saves antigos recebem estado vazio do evento/variantes, sem completar recompensas retroativamente. A validação aceita professores obtidos por versão própria possuída e vinculada, além dos vínculos base antigos.

### Auditoria e paridade

| Família | Skills anteriores | Nós anteriores | Pontos anteriores | Skills finais | Nós finais | Pontos finais |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Seiji | 5 | 7 | 10 | 7 | 9 | 13 |
| Ophelia | 5 | 7 | 10 | 7 | 9 | 13 |
| Marin | 7 | 9 | 13 | 7 | 9 | 13 |
| Gabriel | 7 | 9 | 13 | 7 | 9 | 13 |
| Max | 4 | 5 | 7 | 7 | 9 | 13 |
| Beatriz | 4 | 3 | 5 | 7 | 9 | 13 |
| Orfeu | 2 | 3 | 4 | 7 | 9 | 13 |
| Ava | 2 | 3 | 4 | 7 | 9 | 13 |
| Carmilla | 3 | 3 | 5 | 7 | 9 | 13 |

Ultimate é separada das sete skills. Custos e requisitos antigos não foram apagados. Os pontos adicionais vêm dos níveis e recompensas de quests existentes. Há 24 skills novas e oito passivas específicas; elas não concedem aumento indiscriminado dos atributos base.

## Versões 5★ reais

| ID independente | Nome | Elemento | HP / MP / ATK extra |
| --- | --- | --- | --- |
| seiji-last-script | Seiji — Códice do Horizonte | Tinta | 6 / 8 / 2 |
| ophelia-white-equinox | Ophelia — Equinócio Branco | Gelo | 8 / 8 / 1 |
| marin-starless-throne | Marin — Trono sem Estrelas | Trevas | 8 / 5 / 3 |
| gabriel-solar-oath | Gabriel — Juramento Solar | Fogo | 16 / 4 / 2 |
| max-thunder-requiem | Max — Réquiem do Trovão | Eletricidade | 8 / 6 / 3 |
| ava-worldroot-sovereign | Ava — Matriarca dos Estratos | Terra | 24 / 12 / 4 |
| beatriz-eclipse-tide | Beatriz — Rainha da Maré do Eclipse | Água / Trevas | 18 / 16 / 4 |
| orfeu-unwritten-archon | Orfeu — Arconte da Página Livre | Físico neutro | 28 / 10 / 5 |

As três últimas são míticas lendárias dentro da raridade 5★. Não existe raridade 6★. As cinco formas antigas `*-awakened` continuam 4★ e as bases continuam disponíveis.

Assinaturas premium são disponíveis imediatamente após obter/equipar a versão. No kit completo substituem a assinatura familiar; Ava substitui `stonefall`, Orfeu substitui `null-collapse`. Assim nenhum kit vira oito skills. Os efeitos definidos em `variantsV36.ts` são usados pelo motor, descrições e UI.

As assinaturas custam 16–22 MP. Todas as ultimates consomem 100 de carga. Orfeu usa dano físico neutro e bônus físicos, sem amplificação dos sets mágicos; suas skills legadas mantêm as regras anteriores. A única nova exceção a silêncio é Respiração Nula, declarada como respiração física para remover o próprio silêncio. Não há ressurreição, recuperação gratuita ao equipar, garantia de crítico ou aumento de SPD.

Ava aplica Terra com rocha/raízes minerais/ocre, não natureza em substituição ao elemento. `bind` e `freeze` continuam compartilhando uma única imobilização por batalha. Beatriz preserva Água/Trevas; Ophelia preserva Gelo.

### Gacha e garantias

Tier preservado: 2% de 5★, mais 20% de 4★, pity suave após 63 falhas (+4 pontos percentuais por tentativa), 5★ na tentativa 80, 4★ ou superior a cada dez. O pool 5★ tem 12 entradas: quatro antigas e oito versões novas. A seleção dentro do tier continua uniforme. Carmilla continua fora do pool como conquista.

Duplicatas 5★ mantêm +20 fragmentos de alma, +160 cristais e avanço de constelação até seis. Não há banner com chance secreta ou alteração das taxas de auras.

## Evento permanente e recompensas únicas

Ato I, **O Baile dos Cinco Selos**: aceitar → viajar ao Arquivo → concluir conversa com Ava → Guardar em combate → vencer combate posterior → concluir conversa com Beatriz → receber 800 cristais, cinco tiros reais. Não requer versão premium nem gasto de invocações.

Ato II, **As Três Páginas Livres**: abre após receber o ato I e concluir/relatar o capítulo do Selo Ressonante (stage 5), liberando o acesso real à Clareira da Pira. Aceitar → Ava no Domo → recuperar HP real por skill em combate → Abel na Clareira da Pira → vitória posterior → Beatriz no Pátio → Orfeu na Ala de Estudos → escolher explicitamente uma das três míticas. Nenhum professor precisa estar no Grupo. A recompensa não consome moedas, tentativa ou pity, não equipa a forma e só pode ser escolhida uma vez. Se a escolha já foi obtida pelo Gacha, entrega a duplicata 5★ normal.

Progresso de ambos é persistente, validado e sequencial. Conversas só contam após conclusão; abrir diálogo não conta. Cura sem recuperar HP não conta. Recompensas não são pagas por fechar/reabrir o painel.

API UI: `bloodMoonEventV36`, `startBloodMoonEventV36`, `claimBloodMoonEventV36`; `bloodMoonLegendaryV36`, `startBloodMoonLegendaryV36`, `claimBloodMoonLegendaryV36(id)`. A segunda leitura retorna `lockedReason` e `event.choiceIds`, evitando regras duplicadas na UI.

Dicas são discretas na exploração, sem modal, persistem quando dispensadas e não aparecem sobre menus/cinematics/Gacha. Usam oportunidades reais: nó acessível com pontos disponíveis, versão obtida e convite disponível.

## Arte e áudio: contrato de integração

Cada versão: `/assets/v36/variants/{id}/portrait.png`, `face.png`, `walk.png`, `attack.png`, `cast.png`, `ultimate.png`, `vfx.png`, `icons/0.png` a `5.png`. Root fornece folhas finais e `variantArtV36.ts` com recortes/âncoras medidos. `heroArtIdV36` resolve a versão de exploração, cards, batalha e cinema; as famílias não são renomeadas no save.

Chaves: `{id}`, `dlg_{id}`, `face_{id}`, `battle_{id}_{attack|cast|ultimate}`, `battle_fx_{id}`, `skill_icon_{id}_{0..5}`. Walk normalizado S/W/E/N; combate para a direita, repouso sem efeito no primeiro quadro; cast seis, ultimate oito e VFX seis motivos próprios.

`variantCompanionV36(hero,progress)` retorna chaves/pasta apenas para versões equipadas das cinco famílias: Shin/Mika/Umbra/Vajra são humanos chibi; Dante é fênix. Ambos `companion_{id}` e `companion_event_{id}` apontam à folha de quatro poses `companion.png`, com recortes medidos pela autoria. Ava/Beatriz/Orfeu não têm pet canônico; Stone Reach é a academia, não um novo companheiro.

Composições originais: `/assets/v36/audio/{id}/cast.wav` e `ultimate.wav`. `variantSoundCueV36` só dispara a composição da assinatura/ultimate no impacto real. Mutar interrompe todos os canais nativos e bloqueia resultados atrasados de `play()`. Sons base continuam preservados. A autoria do áudio e os arquivos finais pertencem ao root; o contrato de lógica não prova que os arquivos já foram produzidos.

`animation.healingsV36` informa por aliado o HP efetivamente restaurado no impacto, limitado ao HP faltante. Não apresenta uma cura coletiva inteira sobre o ator. Os eventos legados `healing` continuam existentes para o alvo mais ferido.

### Ícones das 24 skills novas

Pasta `/assets/v36/skills/{hero}/{action-id}.png`; chave `skill_icon_{hero}_{action-id}`. São arquivos finais individuais, não substituições CSS. Root/agente de arte fornece os arquivos. Motivo 1 ofensivo, 2 suporte, 3 controle; a animação de corpo usa o cast próprio do elemento.

| Família | IDs novos | Motivos na mesma ordem |
| --- | --- | --- |
| Seiji | ink-refuge, ink-counterseal | 2, 3 |
| Ophelia | ice-mirror, glacier-pulse | 3, 2 |
| Max | nail-silencer, nail-anchor, ground-wire | 3, 3, 2 |
| Beatriz | water-veil, undertow, twin-current | 2, 3, 1 |
| Orfeu | null-collapse, quiet-step, vacuum-anchor, null-reversal, mute-contact | 1, 2, 3, 2, 3 |
| Ava | bedrock-ward, fault-line, stonefall, mineral-purge, strata-pressure | 2, 3, 1, 2, 3 |
| Carmilla | sanguine-lance, red-veil, blood-tax, hematic-focus | 1, 2, 3, 2 |

## Transferência local de save para PWA

`exportSavePwa`, `previewSavePwa`, `importSavePwa`: pacote validado pelo mesmo parser de save; JSON legado também aceito. Substituição apenas no título/seleção, após confirmação UI. Exportação só em estado seguro. Não há rede.

Backup anterior em `eter-anima-save-import-backup-v36`, contendo os valores originais do save, mute, volume e velocidade. Todos os writes são revertidos em erro e o estado em memória permanece anterior. Uma importação com áudio ativo não reativa aparelho silenciado; áudio desativado importado sempre mantém silêncio. Volume/velocidade restauram separadamente. O jogo continua no título até escolha explícita de Continuar.

## Limites de validação

### Alcance real das nove árvores

Cada família começa com dois pontos. O nível máximo é 10: os nove avanços de nível, obtidos após 540 XP, somam nove pontos a todas as famílias, inclusive as ainda não recrutadas. Assim, níveis sozinhos entregam 11 dos 13 pontos necessários. Um caminho garantido é completar também **Nada fica para trás** (`supplies`: baús `bolsa` no Arquivo e `sub-bau` no Subsolo) e **Primeira patrulha** (`patrol`: cinco encontros de lobo/sombra). Cada uma acrescenta um ponto por família, totalizando 13. Não exige gastar tiros, possuir um professor ou escolher origem específica; recrutar depois preserva os pontos. As missões antigas oferecem 12 pontos adicionais por família no conjunto, permitindo completar antes com outras combinações.

### Autoria final deste agente

Os 24 ícones individuais estão presentes nas pastas contratadas e passaram separação de células, fundo alpha0 e comparação RGBA dos recortes nativos. O kit Max/Vajra tem sete folhas finalizadas com manifests em `art-source/v36/variants/max-thunder-requiem`; cast foi regenerado para corrigir cruzamento real de efeito. Não se alteraram pixels por máscara/resize. A integração global e QA no palco permanecem a cargo do root.

Relatórios ao lado registram testes de callbacks reais, odds/garantias, save, escolhas, áudio e controles. A lista de assets deve passar pelo gate de existência e QA visual após concluir a autoria. Não retirar a validação de `game.test` enquanto os novos arquivos estiverem em produção. Sem commit/push por este agente.
