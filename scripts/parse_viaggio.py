"""Parse scraped viaggioindia.com pages into structured JSON."""
import re, html as html_mod, os, glob, json, sys

def clean(h):
    text = re.sub(r'<[^>]+>', ' ', h)
    text = html_mod.unescape(text).replace('\xa0', ' ')
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n+', '\n\n', text)
    return text.strip()

def parse_tour(path):
    with open(path, encoding='latin1') as f:
        h = f.read()
    title_m = re.search(r'<TITLE[^>]*>([^<]+)</TITLE>', h, re.I)
    desc_m  = re.search(r'NAME="Description"[^>]*CONTENT="([^"]+)"', h, re.I)
    text = clean(h)
    dur_m  = re.search(r'(\d{1,2})\s*giorni\s*/\s*(\d{1,2})\s*notti', text)
    days_blocks = re.findall(
        r'Giorno\s+(\d{1,2})\s*[:\-]?\s*([^G]{20,1500}?)(?=Giorno\s+\d{1,2}|\Z)',
        text, re.I
    )
    return {
        'file': os.path.basename(path),
        'title': (title_m.group(1).strip() if title_m else None),
        'desc':  (desc_m.group(1).strip() if desc_m else None),
        'days':  dur_m.group(1) if dur_m else None,
        'nights': dur_m.group(2) if dur_m else None,
        'day_count_in_text': len(days_blocks),
        'first_day_excerpt': (days_blocks[0][1][:300].strip() if days_blocks else None),
    }

results = []
SCRAPE_DIR = os.environ.get('SCRAPE_DIR') or os.path.expanduser(r'~\AppData\Local\Temp\viaggio')
for path in sorted(glob.glob(os.path.join(SCRAPE_DIR, '*.html'))):
    if os.path.getsize(path) == 0:
        results.append({'file': os.path.basename(path), 'empty': True})
        continue
    results.append(parse_tour(path))

print(json.dumps(results, indent=2, ensure_ascii=False))
