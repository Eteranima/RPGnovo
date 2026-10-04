from pathlib import Path
p=Path(r'C:/Users/Diego/OneDrive/Documentos/GitHub/RPGnovo/tests/echoes.test.mjs')
s=p.read_text(encoding='utf-8')
s=s.replace("check(ANCHORS.length===3,'only three rare travel points');","check(ANCHORS.length===5&&new Set(ANCHORS.map(a=>a.id)).size===5&&['academia','cais','profundo','lunar','orbita'].every(id=>ANCHORS.some(a=>a.id===id)),'five distinct travel points preserve the three legacy anchors and add both expansion anchors');")
s=s.replace("'travel discoveries persist'","'three legacy travel discoveries persist without auto-unlocking expansion anchors'")
p.write_text(s,encoding='utf-8')
print('Echoes: anchor catalog expanded to5; save discovery expectation remains3.')
