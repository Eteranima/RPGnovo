# Áudio original das variantes v36

Entrega: **16 WAVs estéreo, 48 kHz, PCM16**, nos caminhos fixos já resolvidos por `lib/game/variantAudioV36.ts`. Total: **8.698.304 bytes**. O motor e sua regra de mute não foram alterados.

## Composição

`scripts/compor-variant-audio-v36.mjs` compõe materiais, ressonadores, percussão, motivos musicais de cinco notas e reflexões estéreo. Usa síntese local determinística, sem samples externos, serviços pagos ou gravações de terceiros. O seed é próprio de cada identidade/ação. Os 16 hashes são distintos.

| Personagem | Material e motivo | Cast | Ultimate | Camadas da ultimate |
|---|---|---:|---:|---:|
| Seiji | Papel, madeira, tinta líquida e cordas; MIDI 62, 69, 65, 72, 74 | 1,95 s | 3,45 s | 29 |
| Ophelia | Cristal inarmônico, sinos, fissuras de gelo e geada; 76, 83, 80, 87, 88 | 2,15 s | 3,70 s | 22 |
| Marin | Leque, tecido, ar sem voz e harmonia escura; 50, 57, 53, 60, 61 | 1,90 s | 3,40 s | 21 |
| Gabriel | Malho, bigorna, brasa e acorde solar; 57, 64, 69, 73, 76 | 2,05 s | 3,65 s | 23 |
| Max | Corrente aterrada, pregos e arcos elétricos; 66, 73, 70, 78, 82 | 1,75 s | 3,30 s | 35 |
| Ava | Estratos graves, rocha, cascalho, seiva e cristais; 43, 50, 55, 59, 62 | 2,30 s | 3,95 s | 37 |
| Beatriz | Água sob pressão, gotas, lâmina e maré escura; 58, 65, 61, 68, 70 | 2,25 s | 3,90 s | 39 |
| Orfeu | Punho seco, couro, tambor físico e retração de ar; 38, 45, 50, 52, 57 | 1,80 s | 3,80 s | 29 |

As três ultimates míticas incluem respostas próprias ao motivo e clímax mais densos. Orfeu continua físico: sua peça não usa pad etéreo nem brilho mágico. As camadas ruidosas são texturas filtradas e curtas, não ruído branco contínuo. O ataque começa no início do arquivo; não há uma preparação longa que atrasaria o impacto disparado pelo motor.

`score.json` registra cada evento, início, duração, ganho, panorâmica, frequências, parciais e material. As descrições indicam o processo de síntese; não representam gravações reais de foley ou instrumentos acústicos.

## QA executado

- Os **247 checks** de `tests/variant-audio-v36.test.mjs` passaram: 16 arquivos, oito identidades, caminhos reais, resolução de cast/ultimate, PCM, duração, hash, níveis, espectro e impacto imediato. Formas originais e ataques comuns mantêm seus cues existentes.
- Todos os WAVs foram decodificados pelo FFmpeg 9.0.2 local já verificado no trabalho v33. A análise EBU R128 e true peak está registrada por arquivo.
- Pico de amostra: **−1,62 dBFS no cast**, **−1,16 dBFS na ultimate**. True peak independente: **−1,6 a −0,8 dBTP**. Não houve clipping.
- Offset DC absoluto abaixo de **0,001** em ambos os canais; cauda dos últimos 128 samples abaixo de **−38 dBFS**. Fade final de 95 ms.
- O início acima de −30 dBFS ocorre em **0,42 a 1,23 ms**. RMS inicial de 100 ms passou o gate de impacto, sem depender do final musical.
- Correlação estéreo positiva entre **0,87 e 0,96**, preservando coerência em mono. Análise de 24 janelas FFT de 4096 samples por arquivo; energia acima de 8 kHz entre **0,18% e 4,69%**.
- Loudness integrado: **−20,4 a −13,4 LUFS**. As peças físicas secas têm menos energia sustentada que as peças cristalinas; essa diferença está preservada e registrada, sem afirmar equalização perceptual perfeita.

### Limitação auditiva

A ferramenta exibiu quatro arquivos de Seiji/Ophelia, mas retornou explicitamente **entrada de áudio não suportada** para este agente. Portanto **não foi realizada escuta subjetiva**, e nenhuma aprovação auditiva está declarada. A entrega possui análise real do sinal e controles de reprodução em `preview.html` para uma revisão auditiva posterior. Esse documento de QA não altera o som do jogo nem inicia reprodução automática.

## Reprodução e integridade

Na raiz do repositório:

```powershell
node scripts/compor-variant-audio-v36.mjs
node scripts/compor-variant-audio-v36.mjs --analyze
node scripts/compor-variant-audio-v36.mjs --verify
node tests/variant-audio-v36.test.mjs
```

A composição usa apenas Node. `--analyze` usa o FFmpeg local registrado em `.agents/v33-ffmpeg/runtime.json`; a proveniência desse runtime consta em `art-source/v33/opening/ffmpeg-provenance.json`. `--verify` compara hashes e frames sem gerar ou modificar áudio. `measurements.json` contém os valores decodificados, perfis espectrais e SHA-256 de todos os arquivos.
