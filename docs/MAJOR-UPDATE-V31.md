# Éter Anima v31 — Ecos que Escolhem

## Pesquisa e direção narrativa

A pesquisa da [Quantic Foundry sobre motivações de jogadores](https://quanticfoundry.com/2020/08/17/player-segments/) mostra interesses diferentes: desafio, conclusão tranquila de tarefas, exploração, crescimento e histórias. A própria análise alerta que seus segmentos gerais não descrevem todas as nuances de um jogo específico. Portanto, ela não estabelece uma missão favorita universal.

A apresentação da CD Projekt RED na GDC, [FPP, Storytelling, and Player-as-an-Actor](https://gdcvault.com/play/1027889/FPP-Storytelling-and-Player-as), descreve cenas interativas que combinam narrativa e participação do jogador. A descrição oficial de [The Living World of The Witcher](https://gdcvault.com/play/1023867/The-Living-World-of-The) relaciona narrativa, progressão e experiências fora da missão principal. As fontes consultadas são os resumos oficiais das apresentações, não uma transcrição de seus vídeos.

**Aplicação autoral, inferida dessas fontes:** oferecer diferentes ritmos; dar propósito aos deslocamentos e combates; usar pistas que possam ser compreendidas; permitir escolhas com consequências registradas; ensinar controles sem cobrar sorteios; entregar recompensas claras depois da conclusão. Isso orienta o catálogo abaixo e não é uma alegação de preferência medida entre os futuros jogadores de Éter Anima.

## Conteúdo e recompensas

| Categoria | Novas missões | Tiros por missão | Total |
|---|---:|---:|---:|
| Longa | 5 | 5 | 25 |
| Média | 5 | 3 | 15 |
| Curta | 10 | 1 | 10 |
| Tutorial | 10 | 1 | 10 |
| **Total** | **30** | | **60** |

Os tiros são pagos em 9.600 Cristais de Éter no total, usando o custo real de 160 cristais por invocação de personagem. Recebimento único por missão, inclusive após recarregar. Nenhuma missão exige ganhar um personagem na roleta ou gastar recursos em um sorteio. As probabilidades e garantias continuam no sistema existente.

### Cinco histórias longas

- **O nome que o mar apagou:** Seiji, Shin e Umbra recompõem os gestos de uma barqueira apagada dos registros. A memória pode pertencer ao cais ou virar documento público.
- **O jardim que guardou o inverno:** Ophelia e Mika investigam um congelamento que conserva o cuidado de uma jardineira. Regeneração e preservação têm sentidos diferentes.
- **A promessa sob as cinzas:** Gabriel e Dante procuram libertar uma promessa de proteção sem abandonar quem ainda precisa de abrigo.
- **O sino que não aceitava o silêncio:** Max e Vajra conduzem uma mensagem proibida. O circuito atravessa cenários e exige contatos na ordem deduzida pelas pistas.
- **A última página em branco:** Orfeu investiga um índice que antecipa escolhas. Seu conflito é devolver o próximo gesto a quem deveria poder escolhê-lo.

As decisões permanecem no diário e podem ser consultadas ao revisitar o último ponto da história. Cada longa recebe um filme próprio de 48 quadros nativos, em três atos. O filme pausa em aba oculta, oferece pausa e salto explícitos e aguarda Continuar ao terminar. Encerrar a cena libera o recebimento da recompensa; repetir callbacks não paga novamente.

### Missões médias

A régua das marés; As lanternas que olham para baixo; Cartas sem destinatário; O peso da primeira ferramenta; A órbita fora do mapa. Elas combinam leituras de vestígios, enigmas, recuperação de uma rota, correspondência consentida e calibração de um aparelho.

### Missões curtas

Uma cadeira para quem chega; O rótulo que faltava; A muda que cresce de lado; O valor de um intervalo; Pegadas sem caçador; O lacre que não protege; A sombra de uma árvore ausente; A ponte depois da geada; Uma gota para cada raiz; Uma seta para quem volta.

### Tutoriais

Meu primeiro registro; Ler antes de partir; O caminho sob os pés; Quem conduz a próxima rua; Um lugar para retornar; Preparar sem desperdiçar; O preço de uma esperança; Conhecer sem possuir; Um turno para proteger; O jogo no seu ritmo.

O treino de guarda é gratuito, restaura as condições anteriores do grupo e não gera XP ou saque. Tutoriais de regras e catálogo não exigem convocação. Som desligado permanece desligado.

## Arte e acesso

- Seleção inicial: somente Seiji, Marin, Gabriel, Ophelia e Max. Aliados e professores de saves existentes continuam disponíveis conforme suas regras de recrutamento.
- Abel e Orfeu: quatro direções de exploração, com oito poses nativas por direção. Abel agora caminha por uma rota na Clareira da Pira, com diálogo próprio como professor da Forja Antiga. Permanece um NPC, sem ocupar um novo slot jogável.
- Grupo e seleção: Mika, Shin, Umbra, Vajra e Dante usam artes próprias baseadas nos visuais aprovados da tela de loading.
- Diário, mundo e minimapa: quatro emblemas finais, um por categoria. Novos objetivos são pontos reais de interação e navegação.

## Verificações

O motor possui cobertura de todas as etapas, enigmas com tentativas erradas, finais alternativos, combate contextual, persistência, migração de saves e recebimento único. Os 95 pontos foram conferidos contra colisões e caminhos de entrada. Relatórios específicos e a inspeção de interface ficam em `docs/qa-v31`; fontes, prompts, recortes e medições ficam em `art-source/v31`.

Esta atualização é preparada e verificada no repositório local. Commit e push não equivalem, por si só, à publicação no Cloudflare.
