import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin } from "lucide-react";
import { InquiryForm } from "@/components/forms/inquiry-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("metaTitle") };
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tour?: string }>;
}) {
  const { locale } = await params;
  const { tour } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="container-wide py-20 md:py-28">
      <div className="grid gap-12 lg:gap-20 lg:grid-cols-12">
        <header className="lg:col-span-5">
          <span className="eyebrow">{t("title")}</span>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl text-ink-900 leading-[1.0] tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg text-ink-900/65 leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="mt-10 pt-10 border-t border-ink-900/10">
            <div className="text-xs uppercase tracking-[0.18em] text-ink-900/55 mb-5">
              {t("directContact")}
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="size-9 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs text-ink-900/55">{t("email")}</div>
                  <a href="mailto:hello@italioindia.com" className="text-ink-900 hover:text-saffron-700">
                    hello@italioindia.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="size-9 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs text-ink-900/55">{t("phone")}</div>
                  <a href="tel:+390550000000" className="text-ink-900 hover:text-saffron-700">
                    +39 055 000 0000
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="size-9 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs text-ink-900/55">{t("address")}</div>
                  <div className="text-ink-900">{t("officeIt")}</div>
                  <div className="text-ink-900/70 text-sm">{t("officeIn")}</div>
                </div>
              </li>
            </ul>
          </div>
        </header>

        <div className="lg:col-span-7">
          <InquiryForm tourSlug={tour} />
        </div>
      </div>
    </div>
  );
}
