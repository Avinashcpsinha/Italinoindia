"""Generate src/lib/tours.ts and supabase/seed/tours_seed.sql from scraped Italian content.

Reads /tmp/viaggio_data.json (produced by extract_viaggio.py) and emits the two files.
"""
import json, os, sys, re, textwrap

DATA = os.path.expanduser(r"~\AppData\Local\Temp\viaggio_data.json")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOURS_TS = os.path.join(ROOT, "src", "lib", "tours.ts")
SEED_SQL = os.path.join(ROOT, "supabase", "seed", "tours_seed.sql")

# Curated configuration per tour (slug, category, INR starting price, hero image, gallery, override title parts)
CONFIG = {
    "triangolo-doro-khaujarao-e-varanasi": {
        "slug": "triangolo-doro-khajuraho-varanasi",
        "category": "spiritual",
        "price_inr": 65000,
        "hero": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2000",
        "gallery": [
            "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600",
            "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600",
            "https://images.unsplash.com/photo-1551918120-9739cb430c6d?q=80&w=1600",
        ],
        "title": {"it":"Triangolo d'Oro, Khajuraho e Varanasi","en":"Golden Triangle, Khajuraho & Varanasi","de":"Goldenes Dreieck, Khajuraho & Varanasi","fr":"Triangle d'Or, Khajuraho et Varanasi"},
        "summary": {"it":"Da Delhi al Gange sacro, passando per Agra, Jaipur, Orchha, Khajuraho — il viaggio essenziale del Nord.","en":"From Delhi to the sacred Ganges via Agra, Jaipur, Orchha, Khajuraho — the essential North India journey.","de":"Von Delhi zum heiligen Ganges über Agra, Jaipur, Orchha, Khajuraho — die essenzielle Nordindien-Reise.","fr":"De Delhi au Gange sacré, via Agra, Jaipur, Orchha, Khajuraho — le voyage essentiel du Nord."},
        "highlights": [
            {"it":"Taj Mahal all'alba","en":"Taj Mahal at sunrise","de":"Taj Mahal bei Sonnenaufgang","fr":"Taj Mahal au lever du soleil"},
            {"it":"Forte di Amer in elefante","en":"Amer Fort by elephant","de":"Amer Fort auf dem Elefanten","fr":"Fort d'Amer à dos d'éléphant"},
            {"it":"Templi erotici di Khajuraho","en":"Erotic temples of Khajuraho","de":"Erotische Tempel von Khajuraho","fr":"Temples érotiques de Khajuraho"},
            {"it":"Aarti serale sul Gange","en":"Evening Ganga Aarti","de":"Abendliche Ganga-Aarti","fr":"Aarti du soir sur le Gange"},
        ],
        "featured": True, "order": 10,
    },
    "rajasthan-pushkar-e-ranthambore": {
        "slug": "rajasthan-pushkar-ranthambore",
        "category": "rajasthan",
        "price_inr": 85000,
        "hero": "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000",
        "gallery": [
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600",
            "https://images.unsplash.com/photo-1524613032530-449a5d94c285?q=80&w=1600",
            "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=2000",
        ],
        "title": {"it":"Rajasthan, Pushkar e Ranthambore","en":"Rajasthan, Pushkar & Ranthambore","de":"Rajasthan, Pushkar & Ranthambore","fr":"Rajasthan, Pushkar et Ranthambore"},
        "summary": {"it":"Tredici giorni nel cuore del Rajasthan: città reali, deserto sacro di Pushkar e safari delle tigri.","en":"Thirteen days through royal Rajasthan: palace cities, the sacred town of Pushkar, and tiger safaris.","de":"Dreizehn Tage durch das königliche Rajasthan: Palaststädte, Pushkar und Tigersafaris.","fr":"Treize jours au cœur du Rajasthan : villes royales, Pushkar et safaris des tigres."},
        "highlights": [
            {"it":"Forte di Amer e Palazzo dei Venti","en":"Amer Fort and Palace of Winds","de":"Amer Fort und Palast der Winde","fr":"Fort d'Amer et Palais des Vents"},
            {"it":"Tempio sacro del Lago di Pushkar","en":"Sacred temple at Pushkar Lake","de":"Heiliger Tempel am Pushkar-See","fr":"Temple sacré du lac de Pushkar"},
            {"it":"Palazzo del Lago di Udaipur","en":"Lake Palace of Udaipur","de":"Seepalast von Udaipur","fr":"Palais du Lac d'Udaipur"},
            {"it":"Safari in jeep nel parco di Ranthambore","en":"Jeep safari in Ranthambore National Park","de":"Jeep-Safari im Ranthambore-Park","fr":"Safari en jeep au parc de Ranthambore"},
        ],
        "featured": True, "order": 20,
    },
    "esplorate-il-rajastan": {
        "slug": "esplora-il-rajasthan",
        "category": "rajasthan",
        "price_inr": 95000,
        "hero": "https://images.unsplash.com/photo-1524613032530-449a5d94c285?q=80&w=2000",
        "gallery": [
            "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600",
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600",
        ],
        "title": {"it":"Esplora il Rajasthan","en":"Explore Rajasthan","de":"Rajasthan entdecken","fr":"Explorez le Rajasthan"},
        "summary": {"it":"Quattordici giorni nelle città-fortezza del Rajasthan, dal Triangolo d'Oro al deserto del Thar.","en":"Fourteen days through the fortress cities of Rajasthan, from the Golden Triangle to the Thar desert.","de":"Vierzehn Tage durch die Festungsstädte Rajasthans, vom Goldenen Dreieck zur Thar-Wüste.","fr":"Quatorze jours dans les villes-forteresses du Rajasthan, du Triangle d'Or au désert du Thar."},
        "highlights": [
            {"it":"Triangolo d'Oro: Delhi, Agra, Jaipur","en":"Golden Triangle: Delhi, Agra, Jaipur","de":"Goldenes Dreieck: Delhi, Agra, Jaipur","fr":"Triangle d'Or : Delhi, Agra, Jaipur"},
            {"it":"Forte di Mehrangarh a Jodhpur","en":"Mehrangarh Fort in Jodhpur","de":"Mehrangarh Fort in Jodhpur","fr":"Fort de Mehrangarh à Jodhpur"},
            {"it":"Templi Jain di Ranakpur","en":"Jain temples of Ranakpur","de":"Jain-Tempel von Ranakpur","fr":"Temples jaïns de Ranakpur"},
            {"it":"Safari delle tigri a Ranthambore","en":"Tiger safari in Ranthambore","de":"Tigersafari in Ranthambore","fr":"Safari des tigres à Ranthambore"},
        ],
        "featured": True, "order": 30,
    },
    "rajasthan-agra-e-varanasi": {
        "slug": "rajasthan-agra-varanasi",
        "category": "spiritual",
        "price_inr": 115000,
        "hero": "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2000",
        "gallery": [
            "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2000",
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600",
            "https://images.unsplash.com/photo-1551918120-9739cb430c6d?q=80&w=1600",
        ],
        "title": {"it":"Rajasthan, Agra e Varanasi","en":"Rajasthan, Agra & Varanasi","de":"Rajasthan, Agra & Varanasi","fr":"Rajasthan, Agra et Varanasi"},
        "summary": {"it":"Sedici giorni dal deserto di Jaisalmer al Taj Mahal, fino al Gange a Varanasi.","en":"Sixteen days from the Jaisalmer desert to the Taj Mahal and the Ganges at Varanasi.","de":"Sechzehn Tage von der Wüste Jaisalmers über das Taj Mahal bis zum Ganges in Varanasi.","fr":"Seize jours du désert de Jaisalmer au Taj Mahal et au Gange à Varanasi."},
        "highlights": [
            {"it":"Mandawa e gli haveli affrescati","en":"Mandawa and the painted havelis","de":"Mandawa und die bemalten Havelis","fr":"Mandawa et les havelis peints"},
            {"it":"Forte di Jaisalmer nel deserto del Thar","en":"Jaisalmer Fort in the Thar desert","de":"Jaisalmer-Fort in der Thar-Wüste","fr":"Fort de Jaisalmer dans le désert du Thar"},
            {"it":"Taj Mahal all'alba","en":"Taj Mahal at sunrise","de":"Taj Mahal bei Sonnenaufgang","fr":"Taj Mahal au lever du soleil"},
            {"it":"Aarti serale sul Gange a Varanasi","en":"Evening Aarti on the Ganges at Varanasi","de":"Abendliche Aarti am Ganges in Varanasi","fr":"Aarti du soir sur le Gange à Varanasi"},
        ],
        "featured": True, "order": 40,
    },
    "tour-india-del-nord": {
        "slug": "grand-tour-india-del-nord",
        "category": "south-india",
        "price_inr": 165000,
        "hero": "https://images.unsplash.com/photo-1587135941948-670b381f08ce?q=80&w=2000",
        "gallery": [
            "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600",
            "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600",
            "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2000",
        ],
        "title": {"it":"Grand Tour dell'India del Nord","en":"Grand Tour of North India","de":"Große Nordindien-Rundreise","fr":"Grand Tour du Nord de l'Inde"},
        "summary": {"it":"Ventun giorni per scoprire l'arco completo del nord: Triangolo d'Oro, Rajasthan, deserto, Varanasi.","en":"Twenty-one days across the full arc of the north: Golden Triangle, Rajasthan, desert, Varanasi.","de":"Einundzwanzig Tage durch den gesamten Norden: Goldenes Dreieck, Rajasthan, Wüste, Varanasi.","fr":"Vingt-et-un jours à travers tout le nord : Triangle d'Or, Rajasthan, désert, Varanasi."},
        "highlights": [
            {"it":"Le città haveli dello Shekhawati","en":"The haveli towns of Shekhawati","de":"Die Haveli-Städte von Shekhawati","fr":"Les villes haveli du Shekhawati"},
            {"it":"Notte nel deserto a Khimsar","en":"Desert night at Khimsar","de":"Wüstennacht in Khimsar","fr":"Nuit dans le désert à Khimsar"},
            {"it":"Lago di Pushkar e bazaar","en":"Pushkar Lake and bazaar","de":"Pushkar-See und Basar","fr":"Lac et bazar de Pushkar"},
            {"it":"Alba sul Gange a Varanasi","en":"Sunrise on the Ganges at Varanasi","de":"Sonnenaufgang am Ganges in Varanasi","fr":"Lever du soleil sur le Gange à Varanasi"},
        ],
        "featured": False, "order": 50,
    },
    "vacanze-indiane": {
        "slug": "vacanze-indiane-india-nepal",
        "category": "spiritual",
        "price_inr": 185000,
        "hero": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2000",
        "gallery": [
            "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=1600",
            "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2000",
            "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600",
        ],
        "title": {"it":"Vacanze Indiane: India e Nepal","en":"India & Nepal Grand Journey","de":"Indien & Nepal Große Reise","fr":"Grand Voyage Inde et Népal"},
        "summary": {"it":"Ventitré giorni tra l'India e il Nepal, dal Taj Mahal a Kathmandu, attraverso Rajasthan e Varanasi.","en":"Twenty-three days through India and Nepal, from the Taj Mahal to Kathmandu, via Rajasthan and Varanasi.","de":"Dreiundzwanzig Tage durch Indien und Nepal, vom Taj Mahal bis Kathmandu, über Rajasthan und Varanasi.","fr":"Vingt-trois jours en Inde et au Népal, du Taj Mahal à Katmandou, via Rajasthan et Varanasi."},
        "highlights": [
            {"it":"Triangolo d'Oro completo","en":"Complete Golden Triangle","de":"Komplettes Goldenes Dreieck","fr":"Triangle d'Or complet"},
            {"it":"Deserto del Thar e Jaisalmer","en":"Thar desert and Jaisalmer","de":"Thar-Wüste und Jaisalmer","fr":"Désert du Thar et Jaisalmer"},
            {"it":"Crociera notturna sul Gange","en":"Overnight on the Ganges","de":"Übernachtung am Ganges","fr":"Nuit sur le Gange"},
            {"it":"Kathmandu e le valli del Nepal","en":"Kathmandu and Nepal valleys","de":"Kathmandu und die Täler Nepals","fr":"Katmandou et les vallées du Népal"},
        ],
        "featured": False, "order": 60,
    },
}


def normalize_destinations(raw):
    """Dedup + clean. Drop fragments like 'Ranthambore National' if 'Ranthambore' present, etc."""
    seen = []
    for d in raw:
        d = d.strip().rstrip(".,")
        if not d:
            continue
        # Skip if it's a substring of an already-added name (e.g. 'Ranthambore National' vs 'Ranthambore')
        if any(d in existing for existing in seen):
            continue
        # Drop if a longer version is later — handle first by collecting all, then second pass
        seen.append(d)
    # Second pass: drop fragments that are extended by a later one
    final = []
    for d in seen:
        # If a longer version exists in `seen`, prefer that
        longer = [x for x in seen if x != d and d in x and len(x) > len(d)]
        if longer:
            continue
        final.append(d)
    # Limit to first 12 to keep cards readable
    return final[:12]


def normalize_dest_for_jsonb(name):
    """Return the i18n object for a destination name. Most Indian city names are the same in EN/IT/DE/FR."""
    return {"slug": re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-"),
            "name": {"en": name, "it": name, "de": name, "fr": name}}


def js_string(s):
    """Escape a string for embedding in TypeScript double-quoted literal."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")


def render_tours_ts(tours):
    """Generate src/lib/tours.ts content."""
    items = []
    for t in tours:
        cfg = CONFIG[t["slug_it"]]
        dests = normalize_destinations(t["destinations"])
        gallery_lines = ",\n      ".join(f'"{g}"' for g in cfg["gallery"])
        dest_str = ", ".join(f'"{d}"' for d in dests)
        # Highlights as i18n keys: encode each as `text` from Italian
        highlight_objs = ",\n      ".join(
            f'{{ text: "{js_string(h["it"])}" }}' for h in cfg["highlights"]
        )
        items.append(f"""  {{
    slug: "{cfg['slug']}",
    category: "{cfg['category']}",
    durationDays: {t['days']},
    priceFromINR: {cfg['price_inr']},
    heroImage: "{cfg['hero']}",
    gallery: [
      {gallery_lines},
    ],
    destinations: [{dest_str}],
    highlights: [
      {highlight_objs},
    ],
    rating: 4.9,
    reviewCount: {100 + cfg['order']},
    title: "{js_string(cfg['title']['it'])}",
    summary: "{js_string(cfg['summary']['it'])}",
  }}""")
    body = ",\n".join(items)
    return body


def render_seed_sql(tours):
    """Generate the INSERT INTO public.tours seed SQL."""
    rows = []
    for t in tours:
        cfg = CONFIG[t["slug_it"]]
        dests = normalize_destinations(t["destinations"])
        title_json = json.dumps(cfg["title"], ensure_ascii=False).replace("'", "''")
        summary_json = json.dumps(cfg["summary"], ensure_ascii=False).replace("'", "''")
        highlights_json = json.dumps(cfg["highlights"], ensure_ascii=False).replace("'", "''")
        # Destinations as jsonb array
        dest_objs = [normalize_dest_for_jsonb(d) for d in dests]
        dest_json = json.dumps(dest_objs, ensure_ascii=False).replace("'", "''")
        # Itinerary: pack from Italian only (other locales blank — falls back to it via pick())
        it_arr = []
        for d in t["itinerary"]:
            it_arr.append({
                "day": d["day"],
                "title": {"it": d["title"]},
                "body": {"it": d["body"]},
            })
        itin_json = json.dumps(it_arr, ensure_ascii=False).replace("'", "''")
        gallery_array = "array[" + ",".join(f"'{g}'" for g in cfg["gallery"]) + "]"
        rows.append(f"""(
  '{cfg['slug']}', '{cfg['category']}',
  '{title_json}'::jsonb,
  '{summary_json}'::jsonb,
  {t['days']}, {cfg['price_inr']},
  '{cfg['hero']}',
  {gallery_array},
  '{dest_json}'::jsonb,
  '{highlights_json}'::jsonb,
  '{itin_json}'::jsonb,
  4.9, {100 + cfg['order']}, {'true' if cfg['featured'] else 'false'}, {cfg['order']}
)""")
    return ",\n".join(rows)


def main():
    with open(DATA, encoding="utf-8") as f:
        data = json.load(f)
    # Filter to only configured tours
    tours = [t for t in data["tours"] if t["slug_it"] in CONFIG]
    tours.sort(key=lambda t: CONFIG[t["slug_it"]]["order"])

    # Output to files relative to script location
    print("=" * 60)
    print("MOCK TOURS (paste into src/lib/tours.ts MOCK_TOURS array):")
    print("=" * 60)
    print(render_tours_ts(tours))
    print()
    print("=" * 60)
    print("SEED SQL ROWS (replace VALUES (...) section in tours_seed.sql):")
    print("=" * 60)
    print(render_seed_sql(tours))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
