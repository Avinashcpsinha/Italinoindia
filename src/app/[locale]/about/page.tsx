import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("metaTitle") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <article>
      <div className="container-wide py-20 md:py-28">
        <header className="max-w-3xl">
          <span className="eyebrow">{t("title")}</span>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl text-ink-900 leading-[1.0] tracking-tight">
            {t("lead")}
          </h1>
        </header>

        <div className="mt-16 md:mt-20 grid gap-12 lg:gap-20 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6 text-lg md:text-xl text-ink-900/80 leading-relaxed">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>{t("p3")}</p>
            <p>{t("p4")}</p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1581789491058-32d2efb91d2d?q=80&w=1600"
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-cream-100 py-20 md:py-28">
        <div className="container-wide">
          <h2 className="font-serif text-4xl md:text-5xl text-ink-900 mb-12">
            {t("values")}
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n}>
                <div className="font-serif text-6xl text-saffron-600/80 leading-none">
                  0{n}
                </div>
                <h3 className="mt-6 font-serif text-3xl text-ink-900">
                  {t(`value${n}Title` as never)}
                </h3>
                <p className="mt-3 text-ink-900/65 leading-relaxed">
                  {t(`value${n}Body` as never)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
