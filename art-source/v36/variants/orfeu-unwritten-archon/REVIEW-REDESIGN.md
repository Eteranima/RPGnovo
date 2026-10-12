# Orfeu — Arconte da Página Livre: nova direção

Referência final: `portrait-source.png`, escolhida pela raiz, cabelo branco curto e pele morena dourada, traje marcial inteiramente coberto em preto/indigo/dourado, dois punhos enfaixados e duas botas. O retrato e o recorte de rosto não foram alterados pelo agente desta animação.

## Entregas

- `walk.png`: 1024×1536,12 poses; ordem real S/W/E/N, três fases por direção.
- `attack.png`:1536×1024,6 poses à direita; idle0 sem efeitos, contato físico3.
- `cast.png`:1536×1024,6 poses à direita; rompimento de selo mecânico, contato3.
- `ultimate.png`:1536×1024,8 poses à direita; contato físico5.
- VFX6/ícones6 produzidos pela raiz e inspecionados aqui no conjunto novo.
- Salão neutro de pedra reutilizado após revisão expressa: `cinematic-background.png`,1664×936 opaco, recorte nativo central16:9 da fonte1672×941.

Prompts corporais: `redesign-body-prompts.json`. Fontes selecionadas, hashes, recortes e âncoras constam nos manifests. Entradas finais reproduzíveis: `redesign-body-entries.json`; medidas corporais: `body-metrics.json`.

## Revisão e correções reais

As32poses e12motivos foram vistos individualmente nos recortes nativos. A anatomia marcial, cabelo, cobertura do figurino, direção, dedos e dois pés completos foram conferidos. Algumas vistas de perfil têm oclusão natural da mão distante; nenhuma perda de membro ou dedo extra foi identificada. Esta revisão não declara perfeição absoluta nem substitui aprovação visual do usuário.

O divisor automático de conjuração havia separado a palma3 de parte dos seus fragmentos. O corredor vazio correto, emx575, preserva todos os fragmentos no quadro3 e mantém4 sem desenho vizinho. A fonte não mudou; são apenas limites de leitura nativos, com corredores de largura não uniforme registrados.

Sete poses de passada/estocada colocavam a âncora automática no pé mais baixo. Âncoras manuais calculadas pelo centro alfa de cada uma das duas botas colocam o eixo entre os dois pés, sem mudar a soleira real. Todas32poses têm topo de cabeça/ornamento e soleira registrados; o topo do cabelo na ultimate5 é603, separado dos fragmentos em570.

Todos44recortes têm bordas sem pixels visíveis alpha>24. As folhas conservam alpha0 real; fontes selecionadas e runtime são cópias byte a byte. Recortes mantêm todos os RGBA nativos, sem redimensionamento, pintura, máscara ou correção de alpha. O limiar24 serve somente à medição; resíduos de alfa baixo permanecem intactos.

Prova completa: `docs/qa-v36/orfeu-art.json`. Fontes anteriores rejeitadas continuam em `rejected-candidate-2026-10-11/` e não representam este novo kit.
