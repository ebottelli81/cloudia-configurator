"""Converte webapp/index.html nel formato usato per pubblicare l'artifact su claude.ai.

L'artifact riceve solo il contenuto della pagina: <!doctype>, <html>, <head> e <body>
li aggiunge la piattaforma. Uso:  python3 tools/export-artifact.py  ->  dist/artifact.html
"""
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "webapp" / "index.html").read_text(encoding="utf8")
start = html.index("<title>")
body = html[start:]
body = body.replace("</head>\n<body>\n", "", 1)
body = re.sub(r"\s*</body>\s*</html>\s*$", "\n", body)
out = root / "dist" / "artifact.html"
out.parent.mkdir(exist_ok=True)
out.write_text(body, encoding="utf8")
print(f"Scritto {out.relative_to(root)} ({len(body):,} caratteri)")
