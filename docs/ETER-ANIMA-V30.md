# Éter Anima v30 — combate, invocação e expansão

## Entregue

- Vitória com oito quadros próprios, emblema, créditos/XP, grupo e continuação. Comandos saem do palco ao terminar o confronto; a continuação não duplica o pagamento.
- Cinco cards de combate juntos, sem rolagem horizontal; os fundos exclusivos, retratos, HP, MP e ultimate permanecem. Ordem de turnos com placas próprias. Em 844×390: palco de 154 px, rodapé de 68 px; página de 844×390 sem overflow. Em 1310×572, vitória e cinco cards ficam dentro da tela.
- Gacha de personagens e auras com salão próprio, cinco paletas/sequências por raridade e placas finais. Raridades 1–4 têm oito quadros; raridade 5 tem dezesseis cenas. Os lotes destacam a maior raridade realmente sorteada, inclusive quando o último prêmio é inferior. Chances, pity, custos e duplicatas preservados. Pagamento ocorre uma vez, com proteção contra invocações concorrentes e callbacks de saves antigos.
- Duas áreas opcionais após o capítulo: Jardim Lunar e Observatório Partido. Cervo da Geada Lunar, Vigia Rúnico e Guardião do Astrolábio. Chefe com três fases, entrada/epílogo próprios e relíquia nas recompensas.
- Ultimates novas nas dez famílias de inimigos: 80 quadros, além de 18 ataques novos e três fases. Elementos e pose de contato acompanham o dano real em 3264 ms.
- Orfeu: seis poses de técnica, oito de ultimate, seis efeitos próprios e ícones. Combate físico/anti-magia, preservando o retrato, caminhada e ataque básico aprovados.
- Teclas 1–5 trocam o líder na exploração e selecionam aliados como alvos na batalha. Os slots e a ordem dos turnos ficam estáveis; líder salvo de forma compatível.
- Fundos próprios para biblioteca, arsenal, atlas e invocação. Três novas artes de abertura/carregamento com Umbra, Mika, Shin, Vajra e Dante; a academia anterior também permanece na galeria.
- Shin corrigido na arte do grupo: duas pernas/dois pés, com as dobras do quimono separadas. Fonte rejeitada arquivada e imagem corrigida aplicada na abertura/carregamento.

## Verificação

21 suítes aprovadas:20 existentes/novas na rodada e delta registrados em `qa-v30/test-run.txt` e `test-delta.txt`; mais `enemy-test.txt` com 4.494 verificações. Entre os gates: ambiente 33.206, combate 2.047, gacha 1.231, slots 214, Orfeu 201. Artes de combate 63, registro inimigos/cenários 3.422 e navegação 86 verificações. TypeScript aprovado após a integração.

Capturas em `qa-v30`: combate 1365 e 844, vitória 1310, gacha3/4/5★ 1310, Jardim/Observatório, terceira fase do chefe e ultimate do Orfeu. As revisões usam uma página temporária isolada que não lê nem grava o save do jogador. Sua fonte fica em `art-source/v30/review-fixture.txt`; a rota é removida da versão entregue.

Esta máquina pede movimento reduzido no navegador. A invocação mostra seu quadro final nesse modo, conservando a duração, o prêmio e a identificação da raridade. As sequências normais têm timing/recortes próprios verificados; a opção de movimento reduzido é respeitada.

Prompts, fontes, hashes, variantes rejeitadas, recortes e exportadores estão em `art-source/v30`. Os PNGs preservam pixels/alpha nativos; corpos e placas individuais usam apenas recortes. A prova de UI registra seis pixels de brilho acima de alpha 210 em bordas de células, sem aplicar limpeza ou prometer ausência absoluta de defeitos.

## Gates finais

Build de produção aprovado (cinco etapas, única rota entregue `/`) e TypeScript aprovado após remover a referência gerada obsoleta da página temporária. Relatório em `qa-v30/build.txt`. As 21 suítes e revisão visual foram concluídas. A versão compilada foi conferida na porta 5173: abertura corrigida, continuação do save em Porto Lúmina, Ophelia/Carmilla com os mesmos valores de HP/MP e som desligado. Capturas: qa-v30/production-opening-shin-fixed.png e production-local-save.png. Commit/push seguem a conferência final do remoto; não houve alteração de workflow ou publicação no Cloudflare nesta etapa.
