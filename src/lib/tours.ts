import {
  dbFetchAllTourSlugs,
  dbFetchAllTours,
  dbFetchFeaturedTours,
  dbFetchTourBySlug,
} from "@/supabase/content";
import type { Locale } from "@/i18n/routing";

export type TourCategory =
  | "golden-triangle"
  | "rajasthan"
  | "kerala"
  | "himalaya"
  | "south-india"
  | "spiritual"
  | "wildlife";

export type TourDestinationRef = { slug: string; name: string };
export type TourDay = { day: number; title: string; body: string };

/** Public Tour shape — what pages render. Strings already resolved to the active locale. */
export type Tour = {
  slug: string;
  category: TourCategory;
  durationDays: number;
  /** Starting price per person in Indian Rupees (₹). */
  priceFromINR: number;
  heroImage: string;
  gallery: string[];
  destinations: (string | TourDestinationRef)[];
  highlights: (string | { text: string })[];
  itinerary?: TourDay[];
  rating: number;
  reviewCount: number;
  /** Pre-translated title/summary, already resolved to the requested locale. */
  title?: string;
  summary?: string;
};

// =============================================================================
// Mock data (used when Supabase is not configured)
// =============================================================================

type LocaleString = Partial<Record<Locale, string>>;

type MockTour = {
  slug: string;
  category: TourCategory;
  durationDays: number;
  priceFromINR: number;
  heroImage: string;
  gallery: string[];
  destinations: string[];
  rating: number;
  reviewCount: number;
  title: LocaleString;
  summary: LocaleString;
  highlights: LocaleString[];
};

function pick(value: LocaleString | undefined, locale: Locale): string {
  if (!value) return "";
  return value[locale] ?? value.en ?? value.it ?? Object.values(value).find((v) => v) ?? "";
}

function resolveMock(t: MockTour, locale: Locale): Tour {
  return {
    slug: t.slug,
    category: t.category,
    durationDays: t.durationDays,
    priceFromINR: t.priceFromINR,
    heroImage: t.heroImage,
    gallery: t.gallery,
    destinations: t.destinations,
    highlights: t.highlights.map((h) => ({ text: pick(h, locale) })),
    rating: t.rating,
    reviewCount: t.reviewCount,
    title: pick(t.title, locale),
    summary: pick(t.summary, locale),
  };
}

const MOCK_TOURS: MockTour[] = [
  {
    slug: "triangolo-doro-khajuraho-varanasi",
    category: "spiritual",
    durationDays: 10,
    priceFromINR: 65000,
    heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2000",
    gallery: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600",
      "https://images.unsplash.com/photo-1551918120-9739cb430c6d?q=80&w=1600",
    ],
    destinations: ["Delhi", "Jaipur", "Agra", "Orchha", "Khajuraho", "Varanasi"],
    rating: 4.9,
    reviewCount: 110,
    title: {
      en: "Golden Triangle, Khajuraho & Varanasi",
      it: "Triangolo d'Oro, Khajuraho e Varanasi",
      de: "Goldenes Dreieck, Khajuraho & Varanasi",
      fr: "Triangle d'Or, Khajuraho et Varanasi",
    },
    summary: {
      en: "From Delhi to the sacred Ganges via Agra, Jaipur, Orchha, Khajuraho — the essential North India journey.",
      it: "Da Delhi al Gange sacro, passando per Agra, Jaipur, Orchha, Khajuraho — il viaggio essenziale del Nord.",
      de: "Von Delhi zum heiligen Ganges über Agra, Jaipur, Orchha, Khajuraho — die essenzielle Nordindien-Reise.",
      fr: "De Delhi au Gange sacré, via Agra, Jaipur, Orchha, Khajuraho — le voyage essentiel du Nord.",
    },
    highlights: [
      { en: "Taj Mahal at sunrise", it: "Taj Mahal all'alba", de: "Taj Mahal bei Sonnenaufgang", fr: "Taj Mahal au lever du soleil" },
      { en: "Amer Fort by elephant", it: "Forte di Amer in elefante", de: "Amer Fort auf dem Elefanten", fr: "Fort d'Amer à dos d'éléphant" },
      { en: "Erotic temples of Khajuraho", it: "Templi erotici di Khajuraho", de: "Erotische Tempel von Khajuraho", fr: "Temples érotiques de Khajuraho" },
      { en: "Evening Ganga Aarti", it: "Aarti serale sul Gange", de: "Abendliche Ganga-Aarti", fr: "Aarti du soir sur le Gange" },
    ],
  },
  {
    slug: "rajasthan-pushkar-ranthambore",
    category: "rajasthan",
    durationDays: 13,
    priceFromINR: 85000,
    heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000",
    gallery: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600",
      "https://images.unsplash.com/photo-1524613032530-449a5d94c285?q=80&w=1600",
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=2000",
    ],
    destinations: [
      "Delhi", "Jaipur", "Pushkar", "Deogarh", "Udaipur", "Chittorgarh",
      "Bundi", "Kota", "Ranthambore", "Bharatpur", "Fatehpur Sikri", "Agra",
    ],
    rating: 4.9,
    reviewCount: 120,
    title: {
      en: "Rajasthan, Pushkar & Ranthambore",
      it: "Rajasthan, Pushkar e Ranthambore",
      de: "Rajasthan, Pushkar & Ranthambore",
      fr: "Rajasthan, Pushkar et Ranthambore",
    },
    summary: {
      en: "Thirteen days through royal Rajasthan: palace cities, the sacred town of Pushkar, and tiger safaris.",
      it: "Tredici giorni nel cuore del Rajasthan: città reali, deserto sacro di Pushkar e safari delle tigri.",
      de: "Dreizehn Tage durch das königliche Rajasthan: Palaststädte, Pushkar und Tigersafaris.",
      fr: "Treize jours au cœur du Rajasthan : villes royales, Pushkar et safaris des tigres.",
    },
    highlights: [
      { en: "Amer Fort and Palace of Winds", it: "Forte di Amer e Palazzo dei Venti", de: "Amer Fort und Palast der Winde", fr: "Fort d'Amer et Palais des Vents" },
      { en: "Sacred temple at Pushkar Lake", it: "Tempio sacro del Lago di Pushkar", de: "Heiliger Tempel am Pushkar-See", fr: "Temple sacré du lac de Pushkar" },
      { en: "Lake Palace of Udaipur", it: "Palazzo del Lago di Udaipur", de: "Seepalast von Udaipur", fr: "Palais du Lac d'Udaipur" },
      { en: "Jeep safari in Ranthambore National Park", it: "Safari in jeep nel parco di Ranthambore", de: "Jeep-Safari im Ranthambore-Park", fr: "Safari en jeep au parc de Ranthambore" },
    ],
  },
  {
    slug: "esplora-il-rajasthan",
    category: "rajasthan",
    durationDays: 14,
    priceFromINR: 95000,
    heroImage: "https://images.unsplash.com/photo-1524613032530-449a5d94c285?q=80&w=2000",
    gallery: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600",
    ],
    destinations: [
      "Delhi", "Agra", "Jaipur", "Ranthambore", "Pushkar", "Udaipur",
      "Jodhpur", "Jaisalmer", "Bikaner", "Mandawa",
    ],
    rating: 4.9,
    reviewCount: 130,
    title: {
      en: "Explore Rajasthan",
      it: "Esplora il Rajasthan",
      de: "Rajasthan entdecken",
      fr: "Explorez le Rajasthan",
    },
    summary: {
      en: "Fourteen days through the fortress cities of Rajasthan, from the Golden Triangle to the Thar desert.",
      it: "Quattordici giorni nelle città-fortezza del Rajasthan, dal Triangolo d'Oro al deserto del Thar.",
      de: "Vierzehn Tage durch die Festungsstädte Rajasthans, vom Goldenen Dreieck zur Thar-Wüste.",
      fr: "Quatorze jours dans les villes-forteresses du Rajasthan, du Triangle d'Or au désert du Thar.",
    },
    highlights: [
      { en: "Golden Triangle: Delhi, Agra, Jaipur", it: "Triangolo d'Oro: Delhi, Agra, Jaipur", de: "Goldenes Dreieck: Delhi, Agra, Jaipur", fr: "Triangle d'Or : Delhi, Agra, Jaipur" },
      { en: "Mehrangarh Fort in Jodhpur", it: "Forte di Mehrangarh a Jodhpur", de: "Mehrangarh Fort in Jodhpur", fr: "Fort de Mehrangarh à Jodhpur" },
      { en: "Jain temples of Ranakpur", it: "Templi Jain di Ranakpur", de: "Jain-Tempel von Ranakpur", fr: "Temples jaïns de Ranakpur" },
      { en: "Tiger safari in Ranthambore", it: "Safari delle tigri a Ranthambore", de: "Tigersafari in Ranthambore", fr: "Safari des tigres à Ranthambore" },
    ],
  },
  {
    slug: "rajasthan-agra-varanasi",
    category: "spiritual",
    durationDays: 16,
    priceFromINR: 115000,
    heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2000",
    gallery: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2000",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600",
      "https://images.unsplash.com/photo-1551918120-9739cb430c6d?q=80&w=1600",
    ],
    destinations: [
      "Delhi", "Mandawa", "Bikaner", "Jaisalmer", "Jodhpur", "Udaipur",
      "Pushkar", "Ranthambore", "Jaipur", "Agra", "Varanasi",
    ],
    rating: 4.9,
    reviewCount: 140,
    title: {
      en: "Rajasthan, Agra & Varanasi",
      it: "Rajasthan, Agra e Varanasi",
      de: "Rajasthan, Agra & Varanasi",
      fr: "Rajasthan, Agra et Varanasi",
    },
    summary: {
      en: "Sixteen days from the Jaisalmer desert to the Taj Mahal and the Ganges at Varanasi.",
      it: "Sedici giorni dal deserto di Jaisalmer al Taj Mahal, fino al Gange a Varanasi.",
      de: "Sechzehn Tage von der Wüste Jaisalmers über das Taj Mahal bis zum Ganges in Varanasi.",
      fr: "Seize jours du désert de Jaisalmer au Taj Mahal et au Gange à Varanasi.",
    },
    highlights: [
      { en: "Mandawa and the painted havelis", it: "Mandawa e gli haveli affrescati", de: "Mandawa und die bemalten Havelis", fr: "Mandawa et les havelis peints" },
      { en: "Jaisalmer Fort in the Thar desert", it: "Forte di Jaisalmer nel deserto del Thar", de: "Jaisalmer-Fort in der Thar-Wüste", fr: "Fort de Jaisalmer dans le désert du Thar" },
      { en: "Taj Mahal at sunrise", it: "Taj Mahal all'alba", de: "Taj Mahal bei Sonnenaufgang", fr: "Taj Mahal au lever du soleil" },
      { en: "Evening Aarti on the Ganges at Varanasi", it: "Aarti serale sul Gange a Varanasi", de: "Abendliche Aarti am Ganges in Varanasi", fr: "Aarti du soir sur le Gange à Varanasi" },
    ],
  },
  {
    slug: "grand-tour-india-del-nord",
    category: "south-india",
    durationDays: 21,
    priceFromINR: 165000,
    heroImage: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?q=80&w=2000",
    gallery: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2000",
    ],
    destinations: [
      "Delhi", "Mandawa", "Bikaner", "Khimsar", "Jaisalmer", "Jodhpur",
      "Udaipur", "Pushkar", "Ranthambore", "Jaipur", "Bharatpur",
      "Fatehpur Sikri", "Agra", "Varanasi",
    ],
    rating: 4.9,
    reviewCount: 150,
    title: {
      en: "Grand Tour of North India",
      it: "Grand Tour dell'India del Nord",
      de: "Große Nordindien-Rundreise",
      fr: "Grand Tour du Nord de l'Inde",
    },
    summary: {
      en: "Twenty-one days across the full arc of the north: Golden Triangle, Rajasthan, desert, Varanasi.",
      it: "Ventun giorni per scoprire l'arco completo del nord: Triangolo d'Oro, Rajasthan, deserto, Varanasi.",
      de: "Einundzwanzig Tage durch den gesamten Norden: Goldenes Dreieck, Rajasthan, Wüste, Varanasi.",
      fr: "Vingt-et-un jours à travers tout le nord : Triangle d'Or, Rajasthan, désert, Varanasi.",
    },
    highlights: [
      { en: "The haveli towns of Shekhawati", it: "Le città haveli dello Shekhawati", de: "Die Haveli-Städte von Shekhawati", fr: "Les villes haveli du Shekhawati" },
      { en: "Desert night at Khimsar", it: "Notte nel deserto a Khimsar", de: "Wüstennacht in Khimsar", fr: "Nuit dans le désert à Khimsar" },
      { en: "Pushkar Lake and bazaar", it: "Lago di Pushkar e bazaar", de: "Pushkar-See und Basar", fr: "Lac et bazar de Pushkar" },
      { en: "Sunrise on the Ganges at Varanasi", it: "Alba sul Gange a Varanasi", de: "Sonnenaufgang am Ganges in Varanasi", fr: "Lever du soleil sur le Gange à Varanasi" },
    ],
  },
  {
    slug: "vacanze-indiane-india-nepal",
    category: "spiritual",
    durationDays: 23,
    priceFromINR: 185000,
    heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2000",
    gallery: [
      "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=1600",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2000",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600",
    ],
    destinations: [
      "Delhi", "Mandawa", "Bikaner", "Jaisalmer", "Jodhpur", "Udaipur",
      "Chittorgarh", "Pushkar", "Ranthambore", "Jaipur", "Fatehpur Sikri",
      "Agra", "Kathmandu",
    ],
    rating: 4.9,
    reviewCount: 160,
    title: {
      en: "India & Nepal Grand Journey",
      it: "Vacanze Indiane: India e Nepal",
      de: "Indien & Nepal Große Reise",
      fr: "Grand Voyage Inde et Népal",
    },
    summary: {
      en: "Twenty-three days through India and Nepal, from the Taj Mahal to Kathmandu, via Rajasthan and Varanasi.",
      it: "Ventitré giorni tra l'India e il Nepal, dal Taj Mahal a Kathmandu, attraverso Rajasthan e Varanasi.",
      de: "Dreiundzwanzig Tage durch Indien und Nepal, vom Taj Mahal bis Kathmandu, über Rajasthan und Varanasi.",
      fr: "Vingt-trois jours en Inde et au Népal, du Taj Mahal à Katmandou, via Rajasthan et Varanasi.",
    },
    highlights: [
      { en: "Complete Golden Triangle", it: "Triangolo d'Oro completo", de: "Komplettes Goldenes Dreieck", fr: "Triangle d'Or complet" },
      { en: "Thar desert and Jaisalmer", it: "Deserto del Thar e Jaisalmer", de: "Thar-Wüste und Jaisalmer", fr: "Désert du Thar et Jaisalmer" },
      { en: "Overnight on the Ganges", it: "Crociera notturna sul Gange", de: "Übernachtung am Ganges", fr: "Nuit sur le Gange" },
      { en: "Kathmandu and Nepal valleys", it: "Kathmandu e le valli del Nepal", de: "Kathmandu und die Täler Nepals", fr: "Katmandou et les vallées du Népal" },
    ],
  },
];

// =============================================================================
// Public API — synchronous helpers (locale-agnostic, used in non-async contexts)
// =============================================================================

/**
 * Synchronous, locale-agnostic catalog snapshot used by:
 *   - sitemap.ts (only reads slugs)
 *   - the AI chat system prompt (reads slug, duration, price, destinations, category)
 * The `title` and `summary` fields are intentionally omitted — use fetchAllTours(locale)
 * if you need locale-resolved strings.
 */
export const tours: ReadonlyArray<Omit<Tour, "title" | "summary" | "highlights">> =
  MOCK_TOURS.map((t) => ({
    slug: t.slug,
    category: t.category,
    durationDays: t.durationDays,
    priceFromINR: t.priceFromINR,
    heroImage: t.heroImage,
    gallery: t.gallery,
    destinations: t.destinations,
    rating: t.rating,
    reviewCount: t.reviewCount,
  }));

export function getTourBySlug(slug: string, locale: Locale = "en"): Tour | undefined {
  const t = MOCK_TOURS.find((x) => x.slug === slug);
  return t ? resolveMock(t, locale) : undefined;
}

export function getFeaturedTours(count: number = 4, locale: Locale = "en"): Tour[] {
  return [...MOCK_TOURS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count)
    .map((t) => resolveMock(t, locale));
}

// =============================================================================
// Supabase-backed fetchers (used by pages, with mock fallback)
// =============================================================================

export async function fetchAllTours(locale: Locale): Promise<Tour[]> {
  const fromDb = await dbFetchAllTours(locale);
  return fromDb ?? MOCK_TOURS.map((t) => resolveMock(t, locale));
}

export async function fetchFeaturedTours(locale: Locale, count = 4): Promise<Tour[]> {
  const fromDb = await dbFetchFeaturedTours(locale, count);
  return fromDb ?? getFeaturedTours(count, locale);
}

export async function fetchTourBySlug(slug: string, locale: Locale): Promise<Tour | undefined> {
  const fromDb = await dbFetchTourBySlug(slug, locale);
  return fromDb ?? getTourBySlug(slug, locale);
}

export async function fetchAllTourSlugs(): Promise<string[]> {
  const fromDb = await dbFetchAllTourSlugs();
  return fromDb ?? MOCK_TOURS.map((t) => t.slug);
}
