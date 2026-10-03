# Ava Terra e revisão visual v25

Atualização de 3 de outubro de 2026, realizada em `C:\Users\Diego\OneDrive\Documentos\GitHub\RPGnovo`.

## Ava 5★

O design aprovado da lutadora foi preservado: cachos ruivos, adornos florais, traje verde, calça clara e faixas nos antebraços. As novas artes foram geradas pelo imagegen nativo, com referências locais de Ava, Ophelia, Seiji e Carmilla. A inspeção incluiu mãos, punhos, cotovelos, joelhos, silhuetas completas e isolamento dos quadros.

| Arte integrada | Quadros | Arquivo |
| --- | ---: | --- |
| Caminhada e repouso nas quatro direções | 12 | `public/assets/v25/ava/ava-earth-walk.png` |
| Ataque básico | 6 | `public/assets/v25/ava/ava-earth-attack.png` |
| Habilidade e cura | 6 | `public/assets/v25/ava/ava-earth-cast.png` |
| Soberania da Terra | 8 | `public/assets/v25/ava/ava-earth-ultimate.png` |
| Retrato completo | 1 | `public/assets/v25/ava/ava-earth-portrait.png` |
| Impactos e prisão de pedra | 6 | `public/assets/v25/ava/ava-earth-vfx.png` |

Punho de Estratos, Seiva da Terra e Soberania da Terra usam arenito, estratos, fragmentos minerais e poeira. A prisão é de pedra. Os identificadores internos antigos foram preservados para manter os saves e a progressão compatíveis.

Os PNGs gerados foram mantidos inteiros. Recortes e âncoras são aplicados pelo jogo e foram medidos na imagem efetivamente exportada. As folhas de personagem aceitas não têm pixels visíveis de quadros vizinhos nos limites medidos. Prompts, fontes, dimensões e recortes estão em `art-source/v25/ava/`.

## Nove personagens auditados

| Personagem | Identidade elemental |
| --- | --- |
| Seiji | Tinta |
| Ophelia | Gelo |
| Marin | Trevas |
| Gabriel | Fogo |
| Max | Eletricidade |
| Beatriz | Água e Trevas, conforme a ação |
| Orfeu | Físico e antimagia, sem elemento |
| Ava | Terra |
| Carmilla | Sangue |

A resolução do elemento é compartilhada pelo motor, pelas batalhas, pelos duelos e pela cinemática. Técnicas de exploração também usam a cor correspondente. A auditoria completa de ações, compatibilidade e efeitos está em `docs/qa-elements-v25.md`.

A inspeção em tela encontrou uma mão da pose anterior dentro do recorte antigo do Orfeu. Sua folha de combate foi regenerada com doze poses isoladas e o mesmo design, em `public/assets/v25/orfeu/orfeu-antimagic-combat.png`. A escala e o enquadramento das personagens foram corrigidos para conservar os corpos completos nas diferentes posições da formação.

## Dez cenários

Pátio, Arquivo, Subsolo, Câmara, Porto, Domo, Galeria, Mata, Vigília e Pira receberam temas próprios. Foram integradas 64 amostras de piso em quatro folhas e 24 sprites de cenário, com variações estáveis por posição. Isso diversifica o solo, as árvores, os canteiros, as estantes, as ruínas e os pilares.

As doze placas existentes também receberam uma nova folha com espaçamento e recortes corretos. A navegação, as colisões, as missões e a ponte de gelo foram verificadas. O piso usa um cache limitado a três mapas, atualizado quando a ponte muda. Prompts, recortes e revisão estão em `art-source/v25/environment/`.

## Interface

Uma folha transparente de 25 ícones próprios atende os nove controles superiores e as quinze seções do menu. A interface recebeu estados ativos, contadores de novidades, foco visível, alvos de toque de 44 px, navegação por teclado e rolagem independente do menu e do conteúdo. MAIL, Diário, mapa, bolsa e demais seções continuam acessíveis no computador e no celular.

Os layouts foram inspecionados em 1280 × 720, 844 × 390 e 390 × 844. Evidências finais: `docs/qa-v25/ui-final.jpg`, `ui-hud-final.jpg` e `ui-ava-origin.jpg`. Os demais registros dessa pasta incluem etapas intermediárias usadas para encontrar defeitos.

## Verificação final

- `node --test tests/*.test.mjs`: 13 suítes passaram, nenhuma falha.
- `pnpm exec tsc --noEmit`: passou sem diagnóstico.
- `pnpm run build`: compilação de produção passou; somente a rota principal foi incluída.
- Os seis arquivos da Ava foram conferidos também em `dist/client/assets/v25/ava/`.
- Páginas temporárias de inspeção removidas; arquivos de cache TypeScript excluídos do controle de versão.
- As suítes legadas foram atualizadas para os dez mapas, cinco origens base, equipe de até cinco e dimensões das imagens realmente entregues no jogo.

## Continuidade nesta máquina

`pnpm run dev:local` abre a prévia local em `http://127.0.0.1:5173` com as dependências já instaladas. A compilação para Cloudflare permanece em `pnpm run build`.

As diretrizes permanentes do projeto estão no `AGENTS.md`, incluindo a ordem de usar artes finais próprias, conferir anatomia e recortes e respeitar os elementos. O envio ao GitHub e a publicação no Cloudflare são estados separados; o pacote anterior não incluiu configuração de publicação automática.
