import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Clock, Star, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { fetchAllTours } from "@/lib/tours";
import {
  getTourTitle,
  getTourCategoryLabel,
  getTourDestinationsList,
  getImageUrl,
} from "@/lib/tour-display";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tours" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const tours = await fetchAllTours(locale as Locale);

  return (
    <div className="container-wide py-20 md:py-28">
      <header className="max-w-3xl mb-14 md:mb-20">
        <span className="eyebrow">{t("nav.tours")}</span>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl text-ink-900 leading-[1.0] tracking-tight">
          {t("tours.title")}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-ink-900/65 leading-relaxed">
          {t("tours.subtitle")}
        </p>
      </header>

      <div className="grid gap-10 md:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => {
          const title = getTourTitle(tour, t);
          const heroUrl = getImageUrl(tour.heroImage);
          const dests = getTourDestinationsList(tour, t);
          return (
            <Link
              key={tour.slug}
              href={`/tours/${tour.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-900/5">
                {heroUrl && (
                  <Image
                    src={heroUrl}
                    alt={title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-cream-50/95 backdrop-blur px-3 py-1 text-xs font-medium text-ink-900">
                  <Clock className="h-3 w-3" />
                  {t("tours.duration", { days: tour.durationDays })}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-cream-50">
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Star className="h-3.5 w-3.5 fill-saffron-300 text-saffron-300" />
                    {tour.rating} <span className="text-cream-100/60">({tour.reviewCount})</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-1.5">
                <span className="text-xs uppercase tracking-wider text-saffron-700">
                  {getTourCategoryLabel(tour, t)}
                </span>
                <h2 className="font-serif text-2xl text-ink-900 leading-tight group-hover:text-saffron-700 transition-colors">
                  {title}
                </h2>
                <p className="text-sm text-ink-900/55">{dests.join(" · ")}</p>
                <div className="mt-2 text-sm text-ink-900/80">
                  {t("tours.fromPrice", { price: formatPrice(tour.priceFromEUR, "EUR", locale) })}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
