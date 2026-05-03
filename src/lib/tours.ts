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
  priceFromEUR: number;
  /** Either an absolute URL (mock / Supabase row) or empty when missing. */
  heroImage: string;
  gallery: string[];
  /** When loaded from mock: list of city strings. When from Supabase: list of `{slug, name}`. */
  destinations: (string | TourDestinationRef)[];
  /** When loaded from mock: list of i18n keys. When from Supabase: list of `{text}`. */
  highlights: (string | { text: string })[];
  itinerary?: TourDay[];
  rating: number;
  reviewCount: number;
  /** Pre-translated title/summary when loaded from Supabase. */
  title?: string;
  summary?: string;
};

const MOCK_TOURS: Tour[] = [
  {
    slug: "golden-triangle-classic",
    category: "golden-triangle",
    durationDays: 7,
    priceFromEUR: 1290,
    heroImage:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2000",
    gallery: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600",
      "https://images.unsplash.com/photo-1587135941948-670b381f08ce?q=80&w=1600",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600",
    ],
    destinations: ["Delhi", "Agra", "Jaipur"],
    highlights: [
      "taj-mahal-sunrise",
      "amber-fort-elephant",
      "old-delhi-rickshaw",
      "block-printing-workshop",
    ],
    rating: 4.9,
    reviewCount: 312,
  },
  {
    slug: "rajasthan-royal",
    category: "rajasthan",
    durationDays: 12,
    priceFromEUR: 2390,
    heroImage:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000",
    gallery: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600",
      "https://images.unsplash.com/photo-1524613032530-449a5d94c285?q=80&w=1600",
    ],
    destinations: ["Jaipur", "Jodhpur", "Jaisalmer", "Udaipur"],
    highlights: [
      "mehrangarh-fort",
      "thar-desert-camel-safari",
      "udaipur-lake-palace",
      "pushkar-bazaar",
    ],
    rating: 4.95,
    reviewCount: 187,
  },
  {
    slug: "kerala-backwaters",
    category: "kerala",
    durationDays: 9,
    priceFromEUR: 1790,
    heroImage:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000",
    gallery: [
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=1600",
      "https://images.unsplash.com/photo-1591608971362-f08b2a75731a?q=80&w=1600",
    ],
    destinations: ["Cochin", "Munnar", "Thekkady", "Alleppey"],
    highlights: [
      "houseboat-overnight",
      "tea-plantation-walk",
      "kathakali-performance",
      "ayurvedic-spa",
    ],
    rating: 4.92,
    reviewCount: 241,
  },
  {
    slug: "himalaya-ladakh",
    category: "himalaya",
    durationDays: 10,
    priceFromEUR: 2490,
    heroImage:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2000",
    gallery: [
      "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=1600",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1600",
    ],
    destinations: ["Leh", "Nubra Valley", "Pangong Lake"],
    highlights: ["pangong-lake", "monastery-circuit", "khardung-la-pass", "nubra-dunes"],
    rating: 4.97,
    reviewCount: 96,
  },
  {
    slug: "south-india-temples",
    category: "south-india",
    durationDays: 14,
    priceFromEUR: 2890,
    heroImage:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2000",
    gallery: ["https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=1600"],
    destinations: ["Chennai", "Mahabalipuram", "Pondicherry", "Tanjore", "Madurai"],
    highlights: ["meenakshi-temple", "chola-bronzes", "french-quarter-pondicherry", "shore-temple"],
    rating: 4.88,
    reviewCount: 134,
  },
  {
    slug: "varanasi-spiritual",
    category: "spiritual",
    durationDays: 5,
    priceFromEUR: 990,
    heroImage:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2000",
    gallery: ["https://images.unsplash.com/photo-1551918120-9739cb430c6d?q=80&w=1600"],
    destinations: ["Varanasi", "Sarnath"],
    highlights: ["ganga-aarti", "sunrise-boat-ride", "sarnath-stupa", "silk-weavers-quarter"],
    rating: 4.86,
    reviewCount: 178,
  },
  {
    slug: "wildlife-tiger-trail",
    category: "wildlife",
    durationDays: 8,
    priceFromEUR: 2190,
    heroImage:
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=2000",
    gallery: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600"],
    destinations: ["Ranthambore", "Bandhavgarh", "Kanha"],
    highlights: ["tiger-jeep-safari", "naturalist-guide", "luxury-lodge", "elephant-encounter"],
    rating: 4.91,
    reviewCount: 89,
  },
  {
    slug: "grand-india-explorer",
    category: "south-india",
    durationDays: 21,
    priceFromEUR: 4990,
    heroImage:
      "https://images.unsplash.com/photo-1587135941948-670b381f08ce?q=80&w=2000",
    gallery: ["https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600"],
    destinations: ["Delhi", "Agra", "Jaipur", "Varanasi", "Cochin", "Munnar", "Alleppey"],
    highlights: ["full-india-arc", "north-and-south", "private-guide", "luxury-properties"],
    rating: 4.99,
    reviewCount: 67,
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
