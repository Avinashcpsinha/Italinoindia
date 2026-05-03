import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function Story() {
  const t = useTranslations("home");

  return (
    <section className="py-24 md:py-32 bg-ink-900 text-cream-50 overflow-hidden">
      <div className="container-wide grid gap-12 md:gap-16 lg:grid-cols-2 items-center">
        <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] order-last lg:order-first">
          <div className="absolute -inset-4 md:-inset-6 border border-saffron-600/30 rounded-3xl" />
          <Image
            src="https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=1600&auto=format&fit=crop"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover rounded-2xl"
          />
        </div>

        <div className="max-w-xl">
          <span className="eyebrow text-saffron-300">{t("storyEyebrow")}</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight whitespace-pre-line">
            {t("storyTitle")}
          </h2>
          <p className="mt-8 text-lg text-cream-100/80 leading-relaxed">
            {t("storyBody")}
          </p>
          <Button asChild variant="cream" className="mt-10 group">
            <Link href="/about">
              {t("storyCta")}
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
