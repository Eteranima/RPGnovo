# Remake do elenco — v29

Projeto: `C:\Users\Diego\OneDrive\Documentos\GitHub\RPGnovo`.

## Escopo

Seiji, Ophelia, Marin, Gabriel humano/lycan, Max, Beatriz e Carmilla recebem novos retratos, caminhada, ataque, habilidade, ultimate, efeitos e ícones. Abel recebe artes e animações de apresentação no catálogo. Ava e Orfeu conservam seus kits aprovados.

As novas imagens são geradas com o imagegen integrado, seguindo referências locais de identidade e o padrão anime adulto da Ava/Orfeu. Fontes, prompts, transparência, recortes e âncoras ficam em `art-source/v29/`; artes do jogo em `public/assets/v29/`. A exportação preserva os pixels RGBA gerados, inclusive nos recortes de rosto e ícones individuais.

Entrega artística: 60 imagens selecionadas de personagens (9 retratos, 8 caminhadas, 9 ataques, 9 conjurações, 9 ultimates, 8 folhas de efeitos e 8 folhas de ícones). Há 9 recortes de rosto e 48 ícones individuais. Com a nova placa de comandos, são 118 PNGs runtime nativos (170.013.172 bytes). Os atlases têm 372 quadros únicos; 384 registros incluem os efeitos/ícones de Gabriel reutilizados pela forma lycan. Os 372 quadros são medidos, com bordas sem pixels visíveis de alpha maior que 24. Fontes rejeitadas e seus reparos ficam documentados; não são usadas no jogo.

Modo de ferramenta: `image_gen` integrado, geração/edição guiada por referências locais. Prompts e manifests por personagem: `art-source/v29/{seiji,ophelia,gabriel,gabriel_lycan,marin,max,carmilla,beatriz,abel}`. A placa vazia de habilidades foi editada a partir da arte aprovada v28; prompt e prova de exportação nativa em `art-source/v29/ui/`.

## Técnicas de assinatura

| Herói | Técnica | Efeito base | MP |
| --- | --- | --- | ---: |
| Seiji | Kanji: Interdição | 34 Tinta, silêncio e enfraquecimento | 12 |
| Ophelia | Santuário de Geada | 38 HP, guarda e remoção de sangramento de aliado vivo | 13 |
| Marin | Caçada de Umbra | 44 Trevas, 20 HP próprios e silêncio | 15 |
| Gabriel | Juramento da Alvorada | 30 Fogo, 18 HP próprios, guarda e remoção de sangramento do grupo | 13 |
| Max | Circuito de Pregos | 40 elétrico e −25 pontos de carga inimiga | 13 |
| Beatriz | Contramaré Abissal | 38 Água/Trevas, cegueira e enfraquecimento | 14 |
| Carmilla | Sutura Carmesim | 26 Sangue, sangramento e 22 HP para o vivo mais ferido em proporção | 11 |
| Carmilla | Ponto de Retorno | 30 HP e remoção de estados de aliado vivo | 13 |

São desbloqueadas em novos nós da árvore. Equipamentos continuam escalando os números exibidos. Silêncio, MP e turno são verificados antes da ação; o efeito real aguarda o impacto da animação. Os novos tratamentos não revivem. IN AETERNUM VIVE mantém a seleção proporcional, os empates, os alvos vivos e o custo de 15% do HP curado.

## Ultimates renovadas

| Herói | Ultimate | Identidade |
| --- | --- | --- |
| Seiji | Códice da Página Final | Tinta, silêncio e próximo golpe enfraquecido |
| Ophelia | Catedral do Inverno | Gelo, cura/guarda/limpeza do grupo e congelamento limitado |
| Marin | Lâmina da Hora Zero | Trevas, recuperação própria, cegueira e silêncio |
| Gabriel | Forja da Alvorada Lycan | Fogo e proteção do grupo; remove sangramento |
| Max | Crucificação do Trovão | Eletricidade e pregos; drena 35 pontos de carga inimiga |
| Beatriz | Tribunal das Duas Marés | Água/Trevas, cegueira e guarda |
| Carmilla | Catedral de Fios Rubros | Transferência aprovada, limpeza dos tratados e guarda |
| Abel | Leão do Fogo Primordial | Apresentação visual de Fogo/leão no catálogo |

Ultimates jogáveis mantêm carga 100 e impacto adiado na sequência de 4,8 s. Novos tempos de pose preservam antecipação, golpe e recuperação; as cinemáticas têm câmera específica por personagem. O catálogo mostra as folhas reais e o efeito próprio, com controle de pausa, sem consumir recursos ou alterar a partida. A prévia respeita movimento reduzido ao iniciar e permite reprodução explícita pelo botão. Pausar conserva o quadro atual.

## Compatibilidade e desempenho

Identificadores antigos de personagens, habilidades, árvores e convocações permanecem. Os novos nós são adicionados, sem invalidar aprendizados anteriores. MAIL, recrutamento, raridade, companheiros, equipamentos e escolha humano/lycan permanecem compatíveis.

Retratos pequenos usam recortes medidos de rosto. Placas de habilidades acomodam ícones próprios e texto real. O carregamento de batalha seleciona os heróis presentes e reutiliza imagens por caminho; exploração não carrega ícones, retratos recortados ou animações de ultimate que não usa.

## Validação

- Suíte completa: 17 arquivos de teste passaram, incluindo elementos, áudio/mute, MAIL/recrutamento, migração de saves, navegação e progressão.
- Arte v29: 1.760 verificações passaram para kits completos, dimensões nativas, transparência, limites, motivos, ícones, rostos, todos os tempos de pose e exceções Ava/Orfeu.
- Formação: 1.978 verificações, 300 posicionamentos em 1310×235 e 844×205, grupos de 1–5, nove heróis e Gabriel lycan. Menor distância do nome à silhueta no repouso: 11,74 px; menor separação do inimigo: 84,51 px. A extensão temporária de armas/magias é parte da ação.
- Mecânicas v29: oito técnicas e sete ultimates com impacto adiado, MP/desbloqueio/silêncio, aliados vivos, efeito lunar3 e save antigo. Os dois testes v29 foram repetidos após os ajustes concretos da revisão e passaram.
- Inspeção visual: formações, sprites de comandos e novas cinemáticas em 1310×572; combate com cinco integrantes em 844×390; catálogo em 390×844. Reproduzir avançou os quadros; Pausar manteve o mesmo quadro. Ophélia enfrenta o grupo no duelo e usa gelo. Sutura mostra separadamente sangue no inimigo e cura no aliado correto.
- Capturas em `docs/qa-v29/`. A revisão visual usou uma partida isolada sem ler/gravar save, inclusive quadros fixos para conferir composição. O cenário temporário foi removido das rotas do jogo; seu código está arquivado como texto em `art-source/v29/review-fixture.txt`. A funcionalidade real é verificada pelos testes do motor.
- Não apareceram erros/avisos no console da última revisão do duelo. Mãos, anatomia, identidade e direções foram inspecionadas nas artes, sem afirmar ausência absoluta de defeitos em conteúdo gerado.
