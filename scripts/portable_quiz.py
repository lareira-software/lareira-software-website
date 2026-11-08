#!/usr/bin/env python3
"""Build a portable, offline review artifact; no publication or upload."""
import base64,pathlib
root=pathlib.Path(__file__).resolve().parents[1];example=root/'brief'
html=(example/'index.html').read_text();css=(example/'style.css').read_text();font=base64.b64encode((example/'fonts/archivo-var.woff2').read_bytes()).decode()
css=css.replace('url("fonts/archivo-var.woff2")','url("data:font/woff2;base64,'+font+'")')
html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+css+'</style>')
for name in ['model.js','app.js']:
 script=(example/name).read_text()
 if '</script' in script.lower():raise ValueError('Embedded script terminator must be escaped')
 if name=='app.js':
  html=html.replace('<script src="'+name+'" defer></script>','<script>globalThis.LAREIRA_REVIEW=true;</script><script defer>'+script+'</script>')
 else:
  html=html.replace('<script src="'+name+'" defer></script>','<script defer>'+script+'</script>')
# Inline classic scripts must wait until the body exists (defer applies only to external scripts).
start=html.index('<script defer>');end=html.rindex('</script>')+len('</script>');scripts=html[start:end];html=html[:start]+html[end:];html=html.replace('</body>',scripts+'</body>')
notice=(example/'fonts/OFL-archivo.txt').read_text()
html=html.replace('</head>','<!-- Archivo font: see embedded SIL Open Font License notice below. -->\n</head>')
html+='\n<!-- Font license (SIL OFL):\n'+notice.replace('--','—')+'\n-->\n'
note_start=html.index('<p class="review-note">')+len('<p class="review-note">')
note_end=html.index('</p>',note_start)
html=html[:note_start]+'Modo revisión: envío desactivado. Usa datos inventados.'+html[note_end:]

out=root/'.git/quiz-review/revision-portatil.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(html);print(out);print('BYTES',out.stat().st_size)
