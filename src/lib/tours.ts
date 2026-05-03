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
  /** Pre-translated title/summary when loaded from Supabase. */
  title?: string;
  summary?: string;
};

/**
 * Mock tours used as a graceful fallback when Supabase is not configured.
 * Content is the Italian source from viaggioindia.com — once Supabase is set up,
 * the seed in supabase/seed/tours_seed.sql is the source of truth and includes
 * full EN/IT/DE/FR translations plus the day-by-day itinerary.
 */
const MOCK_TOURS: Tour[] = [
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
    highlights: [
      { text: "Taj Mahal all'alba" },
      { text: "Forte di Amer in elefante" },
      { text: "Templi erotici di Khajuraho" },
      { text: "Aarti serale sul Gange" },
    ],
    rating: 4.9,
    reviewCount: 110,
    title: "Triangolo d'Oro, Khajuraho e Varanasi",
    summary:
      "Da Delhi al Gange sacro, passando per Agra, Jaipur, Orchha, Khajuraho — il viaggio essenziale del Nord.",
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
      "Delhi",
      "Jaipur",
      "Pushkar",
      "Deogarh",
      "Udaipur",
      "Chittorgarh",
      "Bundi",
      "Kota",
      "Ranthambore",
      "Bharatpur",
      "Fatehpur Sikri",
      "Agra",
    ],
    highlights: [
      { text: "Forte di Amer e Palazzo dei Venti" },
      { text: "Tempio sacro del Lago di Pushkar" },
      { text: "Palazzo del Lago di Udaipur" },
      { text: "Safari in jeep nel parco di Ranthambore" },
    ],
    rating: 4.9,
    reviewCount: 120,
    title: "Rajasthan, Pushkar e Ranthambore",
    summary:
      "Tredici giorni nel cuore del Rajasthan: città reali, deserto sacro di Pushkar e safari delle tigri.",
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
      "Delhi",
      "Agra",
      "Jaipur",
      "Ranthambore",
      "Pushkar",
      "Udaipur",
      "Jodhpur",
      "Jaisalmer",
      "Bikaner",
      "Mandawa",
    ],
    highlights: [
      { text: "Triangolo d'Oro: Delhi, Agra, Jaipur" },
      { text: "Forte di Mehrangarh a Jodhpur" },
      { text: "Templi Jain di Ranakpur" },
      { text: "Safari delle tigri a Ranthambore" },
    ],
    rating: 4.9,
    reviewCount: 130,
    title: "Esplora il Rajasthan",
    summary:
      "Quattordici giorni nelle città-fortezza del Rajasthan, dal Triangolo d'Oro al deserto del Thar.",
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
      "Delhi",
      "Mandawa",
      "Bikaner",
      "Jaisalmer",
      "Jodhpur",
      "Udaipur",
      "Pushkar",
      "Ranthambore",
      "Jaipur",
      "Agra",
      "Varanasi",
    ],
    highlights: [
      { text: "Mandawa e gli haveli affrescati" },
      { text: "Forte di Jaisalmer nel deserto del Thar" },
      { text: "Taj Mahal all'alba" },
      { text: "Aarti serale sul Gange a Varanasi" },
    ],
    rating: 4.9,
    reviewCount: 140,
    title: "Rajasthan, Agra e Varanasi",
    summary:
      "Sedici giorni dal deserto di Jaisalmer al Taj Mahal, fino al Gange a Varanasi.",
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
      "Delhi",
      "Mandawa",
      "Bikaner",
      "Khimsar",
      "Jaisalmer",
      "Jodhpur",
      "Udaipur",
      "Pushkar",
      "Ranthambore",
      "Jaipur",
      "Bharatpur",
      "Fatehpur Sikri",
      "Agra",
      "Varanasi",
    ],
    highlights: [
      { text: "Le città haveli dello Shekhawati" },
      { text: "Notte nel deserto a Khimsar" },
      { text: "Lago di Pushkar e bazaar" },
      { text: "Alba sul Gange a Varanasi" },
    ],
    rating: 4.9,
    reviewCount: 150,
    title: "Grand Tour dell'India del Nord",
    summary:
      "Ventun giorni per scoprire l'arco completo del nord: Triangolo d'Oro, Rajasthan, deserto, Varanasi.",
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
      "Delhi",
      "Mandawa",
      "Bikaner",
      "Jaisalmer",
      "Jodhpur",
      "Udaipur",
      "Chittorgarh",
      "Pushkar",
      "Ranthambore",
      "Jaipur",
      "Fatehpur Sikri",
      "Agra",
      "Kathmandu",
    ],
    highlights: [
      { text: "Triangolo d'Oro completo" },
      { text: "Deserto del Thar e Jaisalmer" },
      { text: "Crociera notturna sul Gange" },
      { text: "Kathmandu e le valli del Nepal" },
    ],
    rating: 4.9,
    reviewCount: 160,
    title: "Vacanze Indiane: India e Nepal",
    summary:
      "Ventitré giorni tra l'India e il Nepal, dal Taj Mahal a Kathmandu, attraverso Rajasthan e Varanasi.",
  },
];

export const tours = MOCK_TOURS;

export function getTourBySlug(slug: string): Tour | undefined {
  return MOCK_TOURS.find((t) => t.slug === slug);
}

export function getFeaturedTours(count: number = 4): Tour[] {
  return [...MOCK_TOURS].sort((a, b) => b.rating - a.rating).slice(0, count);
}

// ----- Supabase-backed fetchers (used by pages, with mock fallback) -----

export async function fetchAllTours(locale: Locale): Promise<Tour[]> {
  const fromDb = await dbFetchAllTours(locale);
  return fromDb ?? MOCK_TOURS;
}

export async function fetchFeaturedTours(locale: Locale, count = 4): Promise<Tour[]> {
  const fromDb = await dbFetchFeaturedTours(locale, count);
  return fromDb ?? getFeaturedTours(count);
}

export async function fetchTourBySlug(slug: string, locale: Locale): Promise<Tour | undefined> {
  const fromDb = await dbFetchTourBySlug(slug, locale);
  return fromDb ?? getTourBySlug(slug);
}

export async function fetchAllTourSlugs(): Promise<string[]> {
  const fromDb = await dbFetchAllTourSlugs();
  return fromDb ?? MOCK_TOURS.map((t) => t.slug);
}
