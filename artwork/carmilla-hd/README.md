# Carmilla — arte HD e regra de combate

Carmilla é uma professora vampira de Sangue, suporte 5★. A referência visual do projeto é a personagem loira de orelhas pontudas, manto acadêmico preto/vinho, acabamento dourado discreto e agulhas compridas de metal escuro com runas — nunca espada ou rapieira.

As três folhas `*-armfix.png` corrigem a pose inferior esquerda das folhas de ataque, habilidade ofensiva e ultimate, sem substituir os originais. `carmilla-in-aeternum-vive-concept.png` mostra uma sequência adicional de cura sacrificial, não de ataque. O runtime usa recortes fixos da folha; fios e cabelos que ultrapassam bordas ainda podem pedir refinamento visual no futuro. A sprite de exploração aprovada é `carmilla-walk-slender-v2.png`, não a versão chibi `carmilla-walk-3x4.png`.

## IN AETERNUM VIVE

- Entre aliados vivos e feridos, excluindo Carmilla, escolhe os que têm a menor **porcentagem** de HP atual. Empates são atendidos juntos.
- Cura cada escolhido exatamente pelo HP que lhe falta no momento da resolução.
- Carmilla sofre `ceil(15% × soma do HP que faltava aos escolhidos)` como dano próprio. O custo pode levá-la a 0 HP; a habilidade não ressuscita aliados.
- Visual: fios carmesins pulsantes entre as agulhas e os aliados; as feridas dos aliados se fecham como filamentos, enquanto um eco da lesão surge em Carmilla. Sua postura permanece protetora e composta.

A seleção e o cálculo puro estão em `lib/game/carmilla.ts`, com teste em `tests/carmilla.test.mjs`. O turno, UI, salvamento e desbloqueio jogável estão conectados em `lib/game/engine.ts`. A habilidade ativa não consome MP nem inventa um cooldown; a ultimate defensiva `Vigília Rubra` permanece um nome/efeito provisório até a definição final do autor.
