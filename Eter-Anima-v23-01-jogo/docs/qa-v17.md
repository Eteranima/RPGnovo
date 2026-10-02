# Éter Anima v1.7 — bestiário, habilidades e ultimates

## Conteúdo
- Lobo de Cinzas: conjunto Guarda Cindária, duas peças por meta de 5/25/50 vitórias. Três peças concedem +10 de carga ao guardar; seis reduzem dano recebido em 20% e protegem contra silêncio.
- Mariposa do Véu: conjunto Asas da Lua, duas peças nas mesmas metas. Três peças curam 4 HP ao usar magia ofensiva; seis aumentam dano mágico/cura em 20% e protegem contra congelamento.
- Selo, Eco e Chama que Lembra: um amuleto específico e 2/3/4 Fichas de Eco pela primeira vitória. Confrontos únicos mantidos; recompensa manual e única, retroativa para vitórias registradas.
- Marin: Ferida da Noite, Selo Noturno, Respiro Noturno. Gabriel: Erupção da Forja, Cinzas do Véu, Brasa Renovada. Árvore com requisitos e custos; seis habilidades de combate por personagem. Respiro e Brasa funcionam também na exploração.
- Ultimates: quatro folhas originais geradas, oito frames distintos por herói, transparência preservada e recortes em tempo de execução. Fontes e prompts em art-source/v17. Partículas e efeitos continuam desenhados a 30 FPS.
- Anúncio reduzido, 700 ms; animação total 3200 ms, impacto em 1984 ms. Frames próprios começam após o anúncio, sem ocupar o campo com a faixa. Carga consumida uma única vez; comando bloqueado durante execução.
- Interface horizontal v1.6, mapa real, música, seleção de origens e formato de saves preservados.

## Validação
- TypeScript sem erros; sete suítes de motor/progressão, total de 1198 verificações (incluindo 86 novas).
- Preview gerenciado, desktop 1363×936 e horizontal 844×390. Recebimento de recompensa do Lobo e da Chama pelo menu; estado Recebido após clique. Recuperação de Marin fora de batalha: 30→54 HP, custo 8 MP.
- Seiji, Ophelia, Marin e Gabriel: uso real da ultimate pela interface; anúncio compacto, personagens visíveis, assets carregados. Seiji e Gabriel reduzem o inimigo de 2000→1920 HP; Marin aplica cegueira e recupera HP. Gabriel usa Brasa Renovada: +28 HP, −10 MP; inimigo segue a ordem de turnos.
- Recorte da linha superior de Ophelia corrigido para excluir efeitos da linha inferior. Fontes PNG mantidas inteiras; runtime WebP lossless.
- Nenhum erro da aplicação observado. Ruído de extensão do navegador não pertence ao jogo. Não houve teste em aparelho físico.
- Rotas e dados temporários de QA removidos antes da build. Sem controles de desenvolvimento em produção.
