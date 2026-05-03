import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Clock, MapPin, Star, ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { fetchAllTourSlugs, fetchTourBySlug } from "@/lib/tours";
import {
  getTourTitle,
  getTourCategoryLabel,
  getTourDestinationName,
  getTourHighlightText,
  getImageUrl,
} from "@/lib/tour-display";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  const slugs = await fetchAllTourSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tour = await fetchTourBySlug(slug, locale as Locale);
  if (!tour) return {};
  const t = await getTranslations({ locale });
  return {
    title: getTourTitle(tour, t as never),
    description: tour.summary ?? tour.destinations.map((d) => (typeof d === "string" ? d : d.name)).join(", "),
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tour = await fetchTourBySlug(slug, locale as Locale);
  if (!tour) notFound();
  const t = await getTranslations();

  const title = getTourTitle(tour, t);
  const categoryLabel = getTourCategoryLabel(tour, t);
  const heroUrl = getImageUrl(tour.heroImage);

  return (
    <article>
      <div className="relative h-[70vh] min-h-[480px] -mt-16 md:-mt-20 overflow-hidden">
        {heroUrl && (
          <Image
            src={heroUrl}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/45 via-ink-900/15 to-ink-900/85" />
        <div className="container-wide absolute inset-x-0 bottom-0 pb-12 md:pb-16 lg:pb-20 text-cream-50">
          <span className="eyebrow text-saffron-300">{categoryLabel}</span>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.0] tracking-tight max-w-4xl">
            {title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream-100/85">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {t("tours.duration", { days: tour.durationDays })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {tour.destinations.length} {t("tours.destinations").toLowerCase()}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-saffron-300 text-saffron-300" />
              {tour.rating} ({tour.reviewCount})
            </span>
          </div>
        </div>
      </div>

      <div className="container-wide py-16 md:py-24 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-16">
          {tour.summary && (
            <p className="text-xl md:text-2xl font-serif text-ink-900 leading-snug">
              {tour.summary}
            </p>
          )}

          <section>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-8">
              {t("tours.destinations")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {tour.destinations.map((dest, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-ink-900/10 bg-cream-100 px-4 py-3 text-sm font-medium text-ink-900"
                >
                  {getTourDestinationName(dest, t)}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-8">
              {t("tours.highlights")}
            </h2>
            <ul className="space-y-4">
              {tour.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 size-6 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-lg text-ink-900/85 leading-snug">
                    {getTourHighlightText(h, t)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {tour.itinerary && tour.itinerary.length > 0 && (
            <section>
              <h2 className="font-serif text-3xl md:text-4xl text-ink-900 mb-8">
                Day by day
              </h2>
              <ol className="space-y-6 border-l border-ink-900/10 pl-6">
                {tour.itinerary.map((day) => (
                  <li key={day.day} className="relative">
                    <span className="absolute -left-[1.92rem] top-1 size-6 rounded-full bg-saffron-600 text-white text-xs font-medium flex items-center justify-center">
                      {day.day}
                    </span>
                    <h3 className="font-serif text-xl text-ink-900">{day.title}</h3>
                    <p className="mt-2 text-ink-900/70 leading-relaxed">{day.body}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {tour.gallery.length > 0 && (
            <section>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {tour.gallery.map((src, i) => {
                  const url = getImageUrl(src);
                  if (!url) return null;
                  return (
                    <div
                      key={i}
                      className={`relative overflow-hidden rounded-xl ${
                        i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                      }`}
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 33vw, 50vw"
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 rounded-2xl border border-ink-900/10 bg-cream-100 p-8">
            <div className="text-xs uppercase tracking-wider text-ink-900/55">
              {t("common.from")}
            </div>
            <div className="mt-1 font-serif text-4xl text-ink-900">
              {formatPrice(tour.priceFromEUR, "EUR", locale)}
            </div>
            <div className="text-sm text-ink-900/55">
              {t("common.perPerson")} · {t("tours.duration", { days: tour.durationDays })}
            </div>

            <div className="my-6 h-px bg-ink-900/10" />

            <h3 className="font-serif text-xl text-ink-900">
              {t("tours.inquireTitle")}
            </h3>
            <p className="mt-2 text-sm text-ink-900/65">
              {t("tours.inquireSubtitle")}
            </p>

            <Button asChild variant="primary" size="lg" className="mt-6 w-full group">
              <Link href={`/contact?tour=${tour.slug}`}>
                {t("home.ctaButton")}
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </article>
  );
}
