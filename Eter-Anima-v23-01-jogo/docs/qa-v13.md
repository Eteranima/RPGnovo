# Validação da v1.3 — 2026-10-01

Chrome desktop 1363×936 e viewports em iframes reais 390×844 / 320×640. Não houve teste em aparelhos físicos.

- Oito frames da abertura pintados no canvas; Press Start inicia MP3 em loop, com tempo de reprodução avançando.
- Enter abre menu dentro da área de jogo; compra e equipamento de katana alteram dano real. Volume responde ao teclado sem movimentar o grupo.
- Desktop: ativação dos marcos do Cais e Academia caminhando pelos mapas e interação com cristais; viagem pelo menu chega ao destino ativado.
- Desktop: aprendizado de Leitura de Tinta, caminho real ao evento do Cais, consumo de 4 MP, +50 créditos/+30 XP/+2 fichas e persistência do evento concluído.
- Desktop: coleção com exatamente 50 cards; invocação dá uma aura épica de MP; equipamento aumenta máximo de Seiji de 40 para 48 e partículas são renderizadas no cenário.
- Mobile 390: invocação por toque dá Coroa de Vento, contador de fichas decresce e aura é equipada no herói.
- Mobile 320: todas as 12 abas ficam ativas ao toque; diálogo do menu cabe na área de jogo (310×492 dentro de 320×502), sem rolagem horizontal do documento.
- Minimapa e objetivo mobile têm retângulos separados; uma regra herdada de right foi corrigida.
- Batalha mobile: magias, cegueira, quatro frames de ataque do Lobo, vitória e retorno à Galeria com a trilha Below foram verificados.
- Boss: Eco do Selo inicia com Boss Theme em loop; quatro frames do ataque do boss são pintados. Aura de Âmbar permanece visível em combate.
- Saves antigos v1/v2, campos novos, recebimento único de quests/eventos e bônus de combate são cobertos pelas suítes automatizadas.

As fixtures de QA foram removidas da build.
