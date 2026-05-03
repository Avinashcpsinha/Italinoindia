import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  const t = useTranslations("home");

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2400&auto=format&fit=crop"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink-900/65" />
      </div>

      <div className="container-narrow relative z-10 text-center text-cream-50">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
          {t("ctaTitle")}
        </h2>
        <p className="mt-6 text-lg md:text-xl text-cream-100/85 max-w-xl mx-auto leading-relaxed">
          {t("ctaSubtitle")}
        </p>
        <Button asChild variant="primary" size="lg" className="mt-10 group">
          <Link href="/contact">
            {t("ctaButton")}
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
