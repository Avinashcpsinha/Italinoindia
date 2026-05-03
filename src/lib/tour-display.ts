import type { Tour, TourDestinationRef } from "./tours";

/**
 * A next-intl translator. We require `.has(key)` so we can fall back gracefully
 * for cities that aren't in messages/*.json yet (most Indian city names are spelled
 * the same in EN/IT/DE/FR, so the raw string is a safe fallback).
 */
type Translator = ((key: string) => string) & {
  has: (key: string) => boolean;
};

export function getTourTitle(tour: Tour, t: Translator): string {
  if (tour.title) return tour.title;
  const key = `tourSlugs.${tour.slug}`;
  return t.has(key) ? t(key) : tour.slug;
}

export function getTourCategoryLabel(tour: Tour, t: Translator): string {
  const key = `tourCategories.${tour.category}`;
  return t.has(key) ? t(key) : tour.category;
}

export function getTourHighlightText(
  highlight: string | { text: string },
  t: Translator
): string {
  if (typeof highlight === "string") {
    const key = `highlights.${highlight}`;
    return t.has(key) ? t(key) : highlight;
  }
  return highlight.text;
}

export function getTourDestinationName(
  dest: string | TourDestinationRef,
  t: Translator
): string {
  if (typeof dest === "string") {
    const key = `destinationNames.${dest}`;
    // Most Indian city names are identical across locales — when missing from
    // messages, the bare name is the right fallback (e.g. "Khajuraho").
    return t.has(key) ? t(key) : dest;
  }
  return dest.name;
}

export function getTourDestinationsList(tour: Tour, t: Translator): string[] {
  return tour.destinations.map((d) => getTourDestinationName(d, t));
}

/** Pass-through for image URLs (kept as a stable surface for future image transforms). */
export function getImageUrl(image: unknown, fallback?: string): string {
  if (typeof image === "string" && image) return image;
  return fallback ?? "";
}
