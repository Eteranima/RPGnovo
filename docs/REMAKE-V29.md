# Remake do elenco — v29

Projeto: `C:\Users\Diego\OneDrive\Documentos\GitHub\RPGnovo`.

## Escopo

Seiji, Ophelia, Marin, Gabriel humano/lycan, Max, Beatriz e Carmilla recebem novos retratos, caminhada, ataque, habilidade, ultimate, efeitos e ícones. Abel recebe artes e animações de apresentação no catálogo. Ava e Orfeu conservam seus kits aprovados.

As novas imagens são geradas com o imagegen integrado, seguindo referências locais de identidade e o padrão anime adulto da Ava/Orfeu. Fontes, prompts, transparência, recortes e âncoras ficam em `art-source/v29/`; artes do jogo em `public/assets/v29/`. A exportação preserva os pixels RGBA gerados, inclusive nos recortes de rosto e ícones individuais.

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

Ultimates jogáveis mantêm carga100 e impacto adiado na sequência de4,8s. Novos tempos de pose preservam antecipação, golpe e recuperação; as cinemáticas têm câmera específica por personagem. O catálogo mostra as folhas reais, com controle de pausa, sem consumir recursos ou alterar a partida.

## Compatibilidade e desempenho

Identificadores antigos de personagens, habilidades, árvores e convocações permanecem. Os novos nós são adicionados, sem invalidar aprendizados anteriores. MAIL, recrutamento, raridade, companheiros, equipamentos e escolha humano/lycan permanecem compatíveis.

Retratos pequenos usam recortes medidos de rosto. Placas de habilidades acomodam ícones próprios e texto real. O carregamento de batalha seleciona os heróis presentes e reutiliza imagens por caminho; exploração não carrega ícones, retratos recortados ou animações de ultimate que não usa.

## Validação

Em andamento: inspeção dos kits e suas correções de anatomia/isolamento, integração dos módulos medidos, revisão em tela e validação final de compilação. Os testes iniciais das oito técnicas, sete ultimates e identidade elemental passaram. Os resultados finais serão registrados após a revisão visual.
