# Éter Anima — revisão anime, interface e som v26

Data: 2026-10-03. Projeto: `C:\Users\Diego\OneDrive\Documentos\GitHub\RPGnovo`.

## Correções dos sete comentários

1. Removidas as máscaras retangulares de sombra do cenário. Obstáculos agora recebem alvenaria, sebes ou rochas ilustradas, com topo contínuo e face somente na borda exposta. Colisões e travas permanecem alinhadas ao mapa.
2. Barras HP/MP e cartões do grupo usam molduras próprias, líquidos rubi/safira e retratos ornamentados; preenchimento e números continuam sendo valores reais.
3. e 4. Todas as saídas receberam placas ilustradas e artes específicas dos dez destinos, incluindo Ala de Estudos e Câmara do Selo.
5. O minimapa recebeu moldura, texturas cartográficas e símbolos próprios. Posição, obstáculos, objetivos e passagens continuam representando os dados reais do jogo.
6. “Sem som” persiste entre telas e recargas. Mutar interrompe música, efeitos e tons ativos; gestos e promessas atrasadas não reativam o áudio. A ativação depende de uma escolha explícita.
7. Ava e os cenários foram refeitos na linguagem anime de fantasia indicada pelo usuário, com Mushoku Tensei e Fate Series como referências visuais. Ava conserva identidade, figurino e raridade 5★; ataque, habilidade e ultimate exibem pedra, areia e minerais de Terra.

## Artes e integração

- Ava: seis PNGs RGBA — retrato, caminhada, ataque, habilidade, ultimate e efeitos. Recortes e âncoras medidos; direções leste/oeste do atlas ordenadas para o motor. Primeiros layouts com bordas tocadas foram refinados por geração de imagem.
- Cenários: novos materiais, arquitetura, objetos, paredes e portais nos dez mapas. Variações fixas em coordenadas do mundo; composição da água e solo orgânico suavizada para evitar emendas quadradas. PNGs originais preservados.
- Interface: 31 sprites próprios; valores acessíveis, teclado e controles por toque preservados. Em retrato, destinos e Q/Tab ocupam áreas separadas; grupos maiores podem rolar no rodapé.
- Diretrizes de estilo, sprites finais e som persistente registradas em `AGENTS.md` para as próximas alterações deste projeto.

## Revisão visual

As artes foram geradas pelo imagegen integrado, usando referências locais aprovadas. Prompts, fontes e recortes estão em `art-source/v26/ava/`, `art-source/v26/environment/` e `art-source/v26/ui/`.

Foram inspecionados todos os dez mapas em visão geral; Ava parada e caminhando nos quatro sentidos; ataque, habilidade e ultimate nos componentes reais de batalha; e a interface em 1310 × 572, 844 × 390 e 390 × 844. A captura vertical final confirma que Q/Tab não ficam atrás das saídas. A revisão do restante do elenco está em `qa-audio-v26.md`.

Capturas em `docs/qa-v26/`: `field-anime-desktop.jpg`, `field-anime-portrait.jpg`, `field-anime-landscape.jpg`, `world-*-overview.jpg`, `ava-walk-*.jpg` e `ava-anime-earth-*.jpg`. Instâncias de revisão usaram fixtures isoladas; não alteraram o save da partida do usuário. Rotas temporárias foram arquivadas em `art-source/` e retiradas da aplicação.

## Validação e publicação

- Suíte completa: 14 arquivos de testes passaram, nenhum falhou; inclui todos os nove personagens e 26.729 verificações de cenário.
- Verificação TypeScript final: passou.
- Compilação de produção (`pnpm run build`): passou nas cinco etapas, com somente a rota principal `/`; páginas de QA não entram na aplicação.

A prévia local recebe esta revisão. Commit e push são feitos neste repositório; esta etapa não configura nem executa uma publicação no Cloudflare.
