# Atualização automática e reprodução do Circuito

A atualização fica ligada ao jogo inteiro, sem depender de abrir Sistema. Enquanto a página estiver visível e conectada, procura versão a cada 60 segundos. A promoção usa um único coordenador para o caminho automático e o botão existente. Pausa entrada, salva o estado durável, confirma os bytes armazenados e revalida estado e quantidade de abas antes de recarregar. Falhas liberam a partida e permitem nova tentativa, com intervalo de 30 segundos.

Combate, diálogo, cenas, convocações, conflitos de save e revisão do Circuito adiam a promoção. A preparação do Circuito é um checkpoint permitido: formação, banco, itens, histórico e prêmios já foram gravados pelos comandos do motor.

A reprodução do auto battler inicia e avança automaticamente com a arte pronta. A preferência de movimento reduzido continua aplicada à interface e à preparação; o combate solicitado reproduz poses, movimento, ataques e efeitos. Pausa, velocidades 1/2/4, busca, reinício e final funcionam sem depender dessa preferência. As poses em repouso do combate seguem o relógio do replay, então Pausar também as congela.

## Verificações

- Auto-update/provider: 147 verificações PASS, incluindo provider real sem Sistema, descoberta em 60s, salvamento recusado, conflito, múltiplas abas, estado alterado durante ativação, navegação recusada e retomada V39/V40.
- SW: 112 PASS; transferência de save: 90 PASS; UI-session: 198 PASS; core do Circuito: 367 PASS; regras: 51 PASS.
- UI do Circuito: 439 PASS; replay: 1067 PASS, incluindo timer real e frames com movimento reduzido ativo.
- TypeScript PASS. Build Vinext completou as cinco etapas. Revisão local 57aa38531a5e27fb9c8a, shell de 19 arquivos e 2245842 bytes.
- Gate HTTP local: 62 PASS, com instalação/fetch do SW publicado, MIME, hashes, resposta offline canônica e vídeo Range.

## Navegador

O teste ocorreu numa origem local separada (porta 5184), com fixture criada pelo motor real; o save do usuário em 5173 não foi usado para batalhas de QA. Uma revisão A (68a38311aa8acab6d0c5) e uma B (43cda51b9870ea0be6de) diferiam por um marcador CSS exclusivo da cópia de teste. Nenhum marcador foi aplicado ao build entregue.

Com movimento reduzido ativo, Reproduzir percorreu o combate sem Próximo momento: o relógio foi de 0,7s para 12,64s e terminou em 13,8s, com posições, HP, poses e efeitos mudando. Pausar manteve tick 5,94 e os dados de poses exatamente iguais em duas observações separadas.

A nova revisão ficou pendente enquanto o combate estava em revisão. Ao clicar Preparar próxima rodada, o jogo salvou e recarregou automaticamente para o marcador B, sem clicar Procurar atualização ou Salvar e atualizar. Continuar e Retomar trouxeram rodada 4, vida 56, ouro 6, nível 4, quatro peças em campo e seis no banco. A aventura manteve Ophelia 70/70 HP, 55/55 MP, 80 créditos, som desligado e volume 27%.

O save foi exportado pela interface depois da recarga e comparado com o resultado esperado de continuar a mesma fixture pelo motor real. Map, posição, etapa, grupo, inventário, créditos, checkpoint e progress completo foram iguais; o journal tinha 28 comandos, com paid vazio e sem receber prêmios duplicados. As preferências também foram iguais.

## Primeira chegada

Uma aba que ainda executa o JavaScript antigo precisa receber esta primeira correção pelo protocolo legado ou fechar todas as janelas depois de baixar a atualização. Depois de carregar o bundle novo, as próximas revisões seguem automaticamente. O SW nunca força uma sessão antiga a recarregar sem salvar. Essa conferência não mede FPS em aparelho físico nem comprova instalação no sistema operacional.
