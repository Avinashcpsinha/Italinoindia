import { useTranslations } from "next-intl";
import { Sparkles, HeadphonesIcon, Leaf, Languages } from "lucide-react";

export function WhyUs() {
  const t = useTranslations("home");
  const items = [
    { icon: Sparkles, title: t("why1Title"), body: t("why1Body") },
    { icon: HeadphonesIcon, title: t("why2Title"), body: t("why2Body") },
    { icon: Leaf, title: t("why3Title"), body: t("why3Body") },
    { icon: Languages, title: t("why4Title"), body: t("why4Body") },
  ];

  return (
    <section className="py-24 md:py-32 bg-cream-100">
      <div className="container-wide">
        <div className="max-w-2xl">
          <span className="eyebrow">{t("whyEyebrow")}</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-ink-900 leading-[1.05] tracking-tight">
            {t("whyTitle")}
          </h2>
        </div>

        <div className="mt-14 md:mt-20 grid gap-8 md:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex flex-col">
                <div className="size-12 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-serif text-2xl text-ink-900 leading-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-ink-900/65 leading-relaxed">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
