import { defineRouting } from "next-intl/routing";

export const locales = ["en", "it", "de", "fr"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
  de: "Deutsch",
  fr: "Français",
};

export const localeDomains: Record<Locale, string> = {
  it: process.env.NEXT_PUBLIC_DOMAIN_IT ?? "viaggioindia.com",
  en: process.env.NEXT_PUBLIC_DOMAIN_EN ?? "italioindia.com",
  de: process.env.NEXT_PUBLIC_DOMAIN_DE ?? "indienreise.de",
  fr: process.env.NEXT_PUBLIC_DOMAIN_FR ?? "voyage-en-inde.fr",
};

// In production we want each locale on its own domain.
// In dev (localhost), we want path-based locales so the switcher works.
const useDomains = process.env.NEXT_PUBLIC_USE_DOMAIN_ROUTING === "true";

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
  ...(useDomains
    ? {
        domains: (Object.keys(localeDomains) as Locale[]).map((locale) => ({
          domain: localeDomains[locale],
          defaultLocale: locale,
          locales: [locale],
        })),
      }
    : {}),
});
