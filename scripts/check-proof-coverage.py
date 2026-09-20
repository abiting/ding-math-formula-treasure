import json
import re
from pathlib import Path

root = Path('/home/ubuntu/ding-math-formula-treasure')
formulas = json.loads((root / '.formula-export.json').read_text())
generated = (root / 'client/src/data/proofs.generated.ts').read_text()
slugs = set(re.findall(r'^  "([^"]+)": \[', generated, flags=re.MULTILINE))
expected = {item['slug'] for item in formulas}
missing = sorted(expected - slugs)
extra = sorted(slugs - expected)
print(json.dumps({'expected': len(expected), 'generated': len(slugs), 'missing': missing, 'extra': extra}, ensure_ascii=False))
