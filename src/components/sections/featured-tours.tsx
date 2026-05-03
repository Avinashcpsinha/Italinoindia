import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { ArrowUpRight, Clock, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { fetchFeaturedTours } from "@/lib/tours";
import {
  getTourTitle,
  getTourCategoryLabel,
  getTourDestinationsList,
  getImageUrl,
} from "@/lib/tour-display";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export async function FeaturedTours() {
  const locale = (await getLocale()) as Locale;
  const tours = await fetchFeaturedTours(locale, 4);
  const t = await getTranslations();

  return (
    <section className="py-24 md:py-32 bg-cream-50">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
          <div className="max-w-2xl">
            <span className="eyebrow">{t("home.featuredEyebrow")}</span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-ink-900 leading-[1.05] tracking-tight">
              {t("home.featuredTitle")}
            </h2>
            <p className="mt-5 text-lg text-ink-900/65 leading-relaxed">
              {t("home.featuredSubtitle")}
            </p>
          </div>
          <Button asChild variant="outline" className="self-start md:self-auto">
            <Link href="/tours">{t("home.viewAll")} <ArrowUpRight /></Link>
          </Button>
        </div>

        <div className="grid gap-8 md:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {tours.map((tour, idx) => {
            const title = getTourTitle(tour, t);
            const heroUrl = getImageUrl(tour.heroImage);
            const dests = getTourDestinationsList(tour, t);
            return (
              <Link
                key={tour.slug}
                href={`/tours/${tour.slug}`}
                className="group relative flex flex-col"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-900/5">
                  {heroUrl && (
                    <Image
                      src={heroUrl}
                      alt={title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={idx < 2}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-cream-50/95 backdrop-blur px-3 py-1 text-xs font-medium text-ink-900">
                    <Clock className="h-3 w-3" />
                    {t("tours.duration", { days: tour.durationDays })}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-cream-50 text-xs">
                      <Star className="h-3.5 w-3.5 fill-saffron-300 text-saffron-300" />
                      {tour.rating} <span className="text-cream-100/60">({tour.reviewCount})</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-1.5">
                  <span className="text-xs uppercase tracking-wider text-saffron-700">
                    {getTourCategoryLabel(tour, t)}
                  </span>
                  <h3 className="font-serif text-2xl text-ink-900 leading-tight group-hover:text-saffron-700 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-ink-900/55 line-clamp-1">
                    {dests.join(" · ")}
                  </p>
                  <div className="mt-2 text-sm text-ink-900/80">
                    {t("tours.fromPrice", { price: formatPrice(tour.priceFromEUR, "EUR", locale) })}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
