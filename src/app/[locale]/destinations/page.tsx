import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { destinations } from "@/lib/destinations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "destinations" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="container-wide py-20 md:py-28">
      <header className="max-w-3xl mb-14 md:mb-20">
        <span className="eyebrow">{t("nav.destinations")}</span>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl text-ink-900 leading-[1.0] tracking-tight">
          {t("destinations.title")}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-ink-900/65 leading-relaxed">
          {t("destinations.subtitle")}
        </p>
      </header>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((dest) => (
          <div key={dest.slug} className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src={dest.heroImage}
              alt={t(`destinationNames.${dest.slug}` as never)}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-cream-50">
              <div className="text-xs uppercase tracking-wider text-cream-100/70">
                {t(`regions.${dest.region}` as never)}
              </div>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl leading-tight">
                {t(`destinationNames.${dest.slug}` as never)}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
