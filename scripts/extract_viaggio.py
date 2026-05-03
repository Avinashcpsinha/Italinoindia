"""Extract structured tour + city data from scraped viaggioindia.com pages."""
import re, html as hm, os, glob, json, sys

TOUR_DIR = os.path.expanduser(r"~\AppData\Local\Temp\viaggio")
CITY_DIR = os.path.expanduser(r"~\AppData\Local\Temp\viaggio-cities")


def clean_text(h: str) -> str:
    # Drop script & style first
    h = re.sub(r"<script[^>]*>.*?</script>", " ", h, flags=re.I | re.S)
    h = re.sub(r"<style[^>]*>.*?</style>", " ", h, flags=re.I | re.S)
    text = re.sub(r"<[^>]+>", " ", h)
    text = hm.unescape(text).replace("\xa0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n+", "\n", text)
    return text


# Junk markers — paragraphs containing these are nav/menu/keyword stuffing, skip them.
JUNK = re.compile(
    r"(var ga|UA-|google|adsense|GoogleAnalytics|cookie|HREF=|click here|"
    r"copyright|all rights reserved|sitemap|navigation|navigazione|menu)",
    re.I,
)


def good_paragraphs(text: str, min_len=120, max_len=2000):
    """Return prose-like paragraphs, skipping nav/menu/keyword blocks."""
    paras = re.split(r"\n+", text)
    out = []
    for p in paras:
        p = re.sub(r"\s+", " ", p).strip()
        if not (min_len <= len(p) <= max_len):
            continue
        if JUNK.search(p):
            continue
        # Must contain enough lowercase + sentence-like text
        if p.count(".") < 1:
            continue
        # Skip keyword stuffing (many commas, no real prose)
        if p.count(",") > len(p) // 30:
            continue
        out.append(p)
    return out


def parse_tour(path):
    with open(path, encoding="latin1") as f:
        h = f.read()
    title_m = re.search(r"<TITLE[^>]*>([^<]+)</TITLE>", h, re.I)
    desc_m = re.search(r'NAME="Description"[^>]*CONTENT="([^"]+)"', h, re.I)
    text = clean_text(h)

    dur_m = re.search(r"(\d{1,2})\s*giorni\s*/\s*(\d{1,2})\s*notti", text)

    # Day-by-day blocks
    day_iter = list(re.finditer(r"Giorno\s+(\d{1,2})\s*[:\-]\s*([^\n]{1,150})", text, re.I))
    days = []
    for i, m in enumerate(day_iter):
        day_num = int(m.group(1))
        title = m.group(2).strip().rstrip(".")
        body_start = m.end()
        body_end = day_iter[i + 1].start() if i + 1 < len(day_iter) else min(body_start + 2200, len(text))
        body = re.sub(r"\s+", " ", text[body_start:body_end]).strip()
        days.append({"day": day_num, "title": title, "body": body[:900]})

    # Destinations: derive from day titles. Each day title is often "City1 - City2".
    cities = []
    seen = set()
    for d in days:
        for piece in re.split(r"\s*-\s*|\s*–\s*", d["title"]):
            piece = piece.strip().strip(".,").strip()
            # Skip generic words and "Day N" / "Arrivo" type prefixes
            if not piece or piece.lower() in {"arrivo a", "partenza", "partenza per"}:
                continue
            piece = re.sub(r"^(Arrivo a|Partenza per|Da)\s+", "", piece, flags=re.I).strip()
            piece = re.sub(r"\s+(da|per|a)$", "", piece, flags=re.I).strip()
            if 2 < len(piece) < 30 and piece[0].isupper() and piece not in seen:
                seen.add(piece)
                cities.append(piece)

    # Headline: first non-junk paragraph that mentions Italia or India
    paras = good_paragraphs(text, min_len=80, max_len=900)
    headline = next(
        (p for p in paras if "india" in p.lower() or "rajasthan" in p.lower() or "tour" in p.lower()),
        paras[0] if paras else None,
    )

    return {
        "slug_it": os.path.splitext(os.path.basename(path))[0],
        "title_raw": (title_m.group(1).strip() if title_m else None),
        "meta_desc_it": desc_m.group(1).strip() if desc_m else None,
        "headline_it": headline,
        "days": int(dur_m.group(1)) if dur_m else None,
        "nights": int(dur_m.group(2)) if dur_m else None,
        "destinations": cities,
        "itinerary": days,
    }


def parse_city(path):
    with open(path, encoding="latin1") as f:
        h = f.read()
    title_m = re.search(r"<TITLE[^>]*>([^<]+)</TITLE>", h, re.I)
    text = clean_text(h)
    paras = good_paragraphs(text, min_len=150, max_len=1500)
    intro = paras[0] if paras else None
    return {
        "slug_it": os.path.splitext(os.path.basename(path))[0],
        "title_raw": title_m.group(1).strip() if title_m else None,
        "intro_it": intro,
    }


def main():
    out = {"tours": [], "cities": [], "about": None}
    for path in sorted(glob.glob(os.path.join(TOUR_DIR, "*.html"))):
        if os.path.getsize(path) == 0:
            continue
        t = parse_tour(path)
        if t["days"] and t["itinerary"]:
            out["tours"].append(t)
    for path in sorted(glob.glob(os.path.join(CITY_DIR, "citta-india-de-*.html"))):
        if os.path.getsize(path) == 0:
            continue
        out["cities"].append(parse_city(path))
    about_path = os.path.join(CITY_DIR, "circa-noi.html")
    if os.path.exists(about_path):
        out["about"] = parse_city(about_path)
    print(json.dumps(out, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
