import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";

export function Testimonials() {
  const t = useTranslations("home");

  const items = [
    { quote: t("testimonial1"), name: t("testimonial1Name"), trip: t("testimonial1Trip") },
    { quote: t("testimonial2"), name: t("testimonial2Name"), trip: t("testimonial2Trip") },
    { quote: t("testimonial3"), name: t("testimonial3Name"), trip: t("testimonial3Trip") },
  ];

  return (
    <section className="py-24 md:py-32 bg-cream-50">
      <div className="container-wide">
        <div className="max-w-2xl">
          <span className="eyebrow">{t("testimonialsEyebrow")}</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-ink-900 leading-[1.05] tracking-tight">
            {t("testimonialsTitle")}
          </h2>
        </div>

        <div className="mt-14 md:mt-20 grid gap-8 md:gap-10 grid-cols-1 md:grid-cols-3">
          {items.map((item, idx) => (
            <figure
              key={idx}
              className="flex flex-col bg-cream-100 rounded-2xl p-8 md:p-10 border border-ink-900/5"
            >
              <Quote className="h-8 w-8 text-saffron-600/60 mb-4" />
              <blockquote className="font-serif text-xl md:text-2xl text-ink-900 leading-snug flex-1">
                "{item.quote}"
              </blockquote>
              <figcaption className="mt-6 pt-6 border-t border-ink-900/10">
                <div className="font-medium text-ink-900">{item.name}</div>
                <div className="text-sm text-ink-900/55 mt-0.5">{item.trip}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
