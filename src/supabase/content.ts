import { getSupabasePublic } from "./public";
import type {
  DestinationRow,
  JournalPostRow,
  LocaleString,
  TestimonialRow,
  TourRow,
} from "./types";
import type { Locale } from "@/i18n/routing";
import type { Tour, TourDestinationRef, TourDay } from "@/lib/tours";

/** Pick the locale value from a locale-keyed object, falling back to EN, then any non-empty string. */
function pick(value: LocaleString | null | undefined, locale: Locale): string {
  if (!value) return "";
  return value[locale] ?? value.en ?? Object.values(value).find((v) => v) ?? "";
}

function rowToTour(row: TourRow, locale: Locale): Tour {
  return {
    slug: row.slug,
    category: row.category,
    durationDays: row.duration_days,
    priceFromEUR: row.price_from_eur,
    heroImage: row.hero_image ?? "",
    gallery: row.gallery ?? [],
    destinations: (row.destinations ?? []).map<TourDestinationRef>((d) => ({
      slug: d.slug,
      name: pick(d.name, locale),
    })),
    highlights: (row.highlights ?? []).map((h) => ({ text: pick(h, locale) })),
    itinerary: (row.itinerary ?? []).map<TourDay>((d) => ({
      day: d.day,
      title: pick(d.title, locale),
      body: pick(d.body, locale),
    })),
    rating: row.rating ?? 0,
    reviewCount: row.review_count ?? 0,
    title: pick(row.title, locale),
    summary: pick(row.summary, locale),
  };
}

export async function dbFetchAllTours(locale: Locale): Promise<Tour[] | null> {
  const supa = getSupabasePublic();
  if (!supa) return null;
  const { data, error } = await supa
    .from("tours")
    .select("*")
    .order("display_order", { ascending: true })
    .order("duration_days", { ascending: true });
  if (error) {
    console.warn("[supabase] tours fetch failed", error);
    return null;
  }
  if (!data || data.length === 0) return null;
  return data.map((r) => rowToTour(r, locale));
}

export async function dbFetchFeaturedTours(locale: Locale, count = 4): Promise<Tour[] | null> {
  const supa = getSupabasePublic();
  if (!supa) return null;
  const { data, error } = await supa
    .from("tours")
    .select("*")
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .limit(count);
  if (error) {
    console.warn("[supabase] featured tours fetch failed", error);
    return null;
  }
  if (!data || data.length === 0) return null;
  return data.map((r) => rowToTour(r, locale));
}

export async function dbFetchTourBySlug(slug: string, locale: Locale): Promise<Tour | null> {
  const supa = getSupabasePublic();
  if (!supa) return null;
  const { data, error } = await supa.from("tours").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.warn("[supabase] tour by slug failed", error);
    return null;
  }
  if (!data) return null;
  return rowToTour(data, locale);
}

export async function dbFetchAllTourSlugs(): Promise<string[] | null> {
  const supa = getSupabasePublic();
  if (!supa) return null;
  const { data, error } = await supa.from("tours").select("slug");
  if (error || !data) return null;
  return data.map((r) => r.slug);
}

// ---------- Destinations ----------

export type DestinationSummary = {
  slug: string;
  region: DestinationRow["region"];
  name: string;
  intro: string;
  heroImage: string;
};

export async function dbFetchDestinations(locale: Locale): Promise<DestinationSummary[] | null> {
  const supa = getSupabasePublic();
  if (!supa) return null;
  const { data, error } = await supa
    .from("destinations")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) {
    console.warn("[supabase] destinations fetch failed", error);
    return null;
  }
  if (!data || data.length === 0) return null;
  return data.map((r) => ({
    slug: r.slug,
    region: r.region,
    name: pick(r.name, locale),
    intro: pick(r.intro, locale),
    heroImage: r.hero_image ?? "",
  }));
}

// ---------- Testimonials ----------

export type TestimonialSummary = {
  author: string;
  trip: string;
  quote: string;
  rating: number;
};

export async function dbFetchFeaturedTestimonials(
  locale: Locale,
  count = 3
): Promise<TestimonialSummary[] | null> {
  const supa = getSupabasePublic();
  if (!supa) return null;
  const { data, error } = await supa
    .from("testimonials")
    .select("*")
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .limit(count);
  if (error) {
    console.warn("[supabase] testimonials fetch failed", error);
    return null;
  }
  if (!data || data.length === 0) return null;
  return data.map<TestimonialSummary>((t: TestimonialRow) => ({
    author: t.author,
    trip: pick(t.trip, locale),
    quote: pick(t.quote, locale),
    rating: t.rating,
  }));
}

// ---------- Journal ----------

export async function dbFetchPublishedJournal(): Promise<JournalPostRow[] | null> {
  const supa = getSupabasePublic();
  if (!supa) return null;
  const { data, error } = await supa
    .from("journal_posts")
    .select("*")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });
  if (error || !data) return null;
  return data;
}
