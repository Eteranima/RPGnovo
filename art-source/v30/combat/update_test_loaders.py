from pathlib import Path
root=Path(r'C:/Users/Diego/OneDrive/Documentos/GitHub/RPGnovo')
changed=[]
for path in sorted((root/'tests').glob('*.test.mjs')):
 source=path.read_text(encoding='utf-8')
 needle="'remakeArtCarmillaBeatrizAbel'"
 if needle not in source:continue
 if "'expansionV30'" in source:continue
 source=source.replace(needle,needle+",'expansionV30','enemyArtV30','orfeuArtV30','gachaSequence'",1)
 path.write_text(source,encoding='utf-8')
 changed.append(path.name)
print('Updated loaders:',', '.join(changed))
print('enemyArtV30 exists:',(root/'lib/game/enemyArtV30.ts').exists())
