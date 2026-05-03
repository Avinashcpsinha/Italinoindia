import type { Tour, TourDestinationRef } from "./tours";

type Translator = (key: string) => string;

/**
 * Resolve display strings for a tour. Supabase-fetched data already has localized
 * `title`, `summary`, and string highlights/destinations. Mock data uses i18n keys
 * that need to be looked up via the translator.
 */

export function getTourTitle(tour: Tour, t: Translator): string {
  if (tour.title) return tour.title;
  return t(`tourSlugs.${tour.slug}`);
}

export function getTourCategoryLabel(tour: Tour, t: Translator): string {
  return t(`tourCategories.${tour.category}`);
}

export function getTourHighlightText(
  highlight: string | { text: string },
  t: Translator
): string {
  if (typeof highlight === "string") return t(`highlights.${highlight}`);
  return highlight.text;
}

export function getTourDestinationName(
  dest: string | TourDestinationRef,
  t: Translator
): string {
  if (typeof dest === "string") return t(`destinationNames.${dest}`);
  return dest.name;
}

export function getTourDestinationsList(tour: Tour, t: Translator): string[] {
  return tour.destinations.map((d) => getTourDestinationName(d, t));
}

/** Pass-through; just exists for symmetry with the previous Sanity implementation. */
export function getImageUrl(image: unknown, fallback?: string): string {
  if (typeof image === "string" && image) return image;
  return fallback ?? "";
}
