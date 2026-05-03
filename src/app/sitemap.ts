import type { MetadataRoute } from "next";
import { tours } from "@/lib/tours";
import { destinations } from "@/lib/destinations";
import { locales, localeDomains, type Locale } from "@/i18n/routing";

function urlsFor(locale: Locale, path: string) {
  const base = `https://${localeDomains[locale]}`;
  const url = path === "/" ? base : `${base}${path}`;
  const languages = Object.fromEntries(
    locales.map((l) => [l, path === "/" ? `https://${localeDomains[l]}` : `https://${localeDomains[l]}${path}`])
  );
  return { url, alternates: { languages } };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/tours", "/destinations", "/about", "/contact"];
  const tourPaths = tours.map((t) => `/tours/${t.slug}`);
  const destPaths = destinations.map((d) => `/destinations/${d.slug}`);

  const all = [...staticPaths, ...tourPaths, ...destPaths];

  return locales.flatMap((locale) =>
    all.map((p) => ({
      ...urlsFor(locale, p),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "/" ? 1.0 : p.startsWith("/tours/") ? 0.8 : 0.6,
    }))
  );
}
