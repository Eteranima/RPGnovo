# Beatriz — Rainha da Maré do Eclipse · kit lendário v36

Repositório: `C:\Users\Diego\OneDrive\Documentos\GitHub\RPGnovo`. Produção em 11/10/2026 pelo **imagegen nativo**. A referência final da raiz é `portrait-source.png`: cabelo preto com mecha pérola, olhos violeta, coroa de eclipse e máscara marfim, vestes integrais marfim/navy, duas pernas e duas botas. Não foi inventado um companion.

## Entrega e contrato

| Arte | Runtime | Dimensão nativa | Células |
| --- | --- | --- | --- |
| Caminhada | `walk.png` | 1086 × 1448 | 12, três poses por direção S/W/E/N |
| Ataque | `attack.png` | 1536 × 1024 | 6, direita; 0 em repouso |
| Conjuração | `cast.png` | 1536 × 1024 | 6, direita |
| Ultimate | `ultimate.png` | 1536 × 1024 | 8, direita; contato na pose 5 |
| Efeitos | `vfx.png` | 1536 × 1024 | 6 motivos independentes |
| Ícones | `icons.png` e `icons/0.png` a `icons/5.png` | 1536 × 1024 + recortes | 6 |
| Fundo cinematográfico | `cinematic-background.png` | 1664 × 936, 16:9 | opaco |

Runtime: `public/assets/v36/variants/beatriz-eclipse-tide/`. Retrato/rosto e registro global são responsabilidade da raiz. Estas seis folhas oferecem **44 células medidas**, sem redimensionamento ou repintura por código. A caminhada já está na ordem normal S/W/E/N, sem permutação adicional. Todos os quadros de combate olham para a direita.

## Motivos e anatomia

Água é líquido azul, com gotas arredondadas e espuma; Trevas são correntes pretas/violeta. A lâmina de maré é uma arma, sem transformar o elemento em Gelo. O primeiro ícone foi reparado porque a primeira tentativa tinha pontas semelhantes a gelo. A ultimate corporal mantém a espada baixa e aponta a mão no contato: os efeitos grandes são separados, para não invadir a célula vizinha.

VFX 0 impacto Água/Trevas; 1 corte de maré; 2 proteção/cura com pérola aquática; 3 selo profundo; 4 Decreto das Duas Marés; 5 oceano eclipsado. Ícones 0 ataque, 1 corte, 2 cura/proteção, 3 controle, 4 assinatura, 5 ultimate. Não há texto embutido. Fundo: oceano azul/negro sob eclipse, arquitetura de pérolas nas laterais e plataforma central livre, sem personagens.

Foram inspecionadas as seis folhas e recortes nativos de mãos, botas e contato. As botas frontais e as duas poses de costas 9/11 foram refeitas para evitar uma bota escondida atrás da outra. O corpo mantém duas pernas de calça; mangas, painéis do casaco e cabelo não devem ser tratados como membros. Isso registra a revisão realizada, sem afirmar ausência absoluta de defeitos anatômicos.

## Fontes selecionadas e reparos

- `walk-border-candidate.png`: versão final após reparar coroas/margens, separar as botas frontais e as botas de costas e ampliar a margem exterior.
- `attack-repair-candidate.png`: reparo de arma/figura menores; a primeira tentativa falhou isolamento entre células.
- `cast-repair-candidate.png`: conjuração com água líquida e sombra; reparo do fundo transparente.
- `ultimate-body-candidate.png`: versão final. As tentativas com espada levantada/efeitos extensos falharam nas margens/colunas; esta versão concentra a animação no corpo/gesto e usa VFX independente.
- `vfx-repair-candidate.png`: seis motivos de água/sombra isolados.
- `icons-water-candidate.png`: impacto corrigido para água fluida, sem estilhaços de gelo.
- `cinematic-background-source.png`: fonte opaca 1672 × 941; recorte central nativo `{left:4,top:2,width:1664,height:936}`, sem alterar nenhum pixel selecionado.

As tentativas anteriores permanecem como fontes de revisão; não são referenciadas pelo runtime. Os prompts completos de cada geração e reparo estão em `prompts/`. O manifesto de cada folha conserva SHA-256 de candidato/fonte selecionada/runtime. Os três arquivos das folhas selecionadas são byte a byte idênticos. Os recortes de ícones e do fundo têm prova de igualdade de cada linha RGBA com a fonte.

## Âncoras, cabeça e alpha

`body-metrics.json` e os manifests fornecem as âncoras e os topos de cabeça/coroa. Ataques 3–5 centralizam manualmente as duas botas; o centro da faixa inferior automática favorecia somente a bota mais baixa. Ataque 2 usa topo corporal 148, excluindo a espada erguida. A raiz pode consumir `headOrHatTop`/`bodyTops` para escala corporal, sem usar a ponta da arma como cabeça.

O gate comum usa **alpha > 24 apenas para medir** o limite visível. Nenhum desses pixels toca os limites das células; há áreas livres alpha 0 reais em todas as folhas. O canal original foi preservado, sem máscara, remoção de alpha, filtro, pintura ou correção de fundo por código.

Uma sonda adicional registra resíduos mais fracos: caminhada máximo 2 nos limites internos e máximo 4 em 34 pixels de borda externa; conjuração máximo 3; ataque/ultimate/VFX/ícones até 1 nas bordas medidas. O reparo exterior da caminhada reduziu seu máximo de 9 para 4. A sonda extra que exigia máximo 3 recusou esses 34 pixels; o gate final reproduz o limiar 24 do exportador fornecido, **sem esconder os valores reais**. Não se afirma que todos os gutters são absolutamente alpha 0. `*-alpha-proof.json` contém as contagens completas; a revisão no navegador pertence à raiz.

## Reprodução dos exports e provas

Executar a partir da raiz do repositório:

```powershell
node art-source/v36/export-atlases.mjs art-source/v36/variants/beatriz-eclipse-tide/entries.json
node art-source/v36/variants/beatriz-eclipse-tide/export-native-proofs.mjs
node art-source/v36/variants/beatriz-eclipse-tide/inspect-alpha.mjs
node art-source/v36/variants/beatriz-eclipse-tide/verify-native.mjs
```

`verification.json` registra contagens, dimensões, hashes, alpha real e limitações. `proofs/` contém recortes nativos das 44 células. O fundo tem 1.557.504 pixels opacos, todos provenientes do recorte nativo da imagem gerada. Não foram alteradas regras, saves, registro global, motor ou cenários nesta entrega. Não houve commit/push por este agente.
