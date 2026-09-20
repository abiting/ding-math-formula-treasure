from pathlib import Path

path = Path('/home/ubuntu/ding-math-formula-treasure/client/src/data/proofs.generated.ts')
text = path.read_text()
needle = '  "arithmetic-mean": ['
replacement = '  "arithmetic-mean-statistics": ['
if text.count(needle) != 2:
    raise SystemExit(f'expected exactly two duplicate keys, found {text.count(needle)}')
first = text.find(needle)
second = text.find(needle, first + len(needle))
text = text[:second] + text[second:].replace(needle, replacement, 1)
path.write_text(text)
print('Renamed the second arithmetic-mean proof key.')
