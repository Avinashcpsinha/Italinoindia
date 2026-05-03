"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2400&auto=format&fit=crop";

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative min-h-[88vh] md:min-h-screen overflow-hidden -mt-16 md:-mt-20 pt-16 md:pt-20">
      <div className="absolute inset-0 -z-10">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105 motion-safe:animate-[float_12s_ease-in-out_infinite]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/55 via-ink-900/35 to-ink-900/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/40 via-transparent to-transparent" />
      </div>

      <div className="container-wide relative z-10 flex min-h-[calc(88vh-4rem)] md:min-h-[calc(100vh-5rem)] flex-col justify-end pb-16 md:pb-24 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-cream-50/15 backdrop-blur-md border border-cream-50/20 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-cream-50">
            <Sparkles className="h-3.5 w-3.5 text-saffron-300" />
            {t("heroEyebrow")}
          </span>

          <h1 className="mt-6 font-serif text-5xl md:text-7xl lg:text-8xl text-cream-50 leading-[0.95] tracking-tight whitespace-pre-line">
            {t("heroTitle")}
          </h1>

          <p className="mt-8 text-lg md:text-xl text-cream-100/85 max-w-2xl leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Button asChild variant="primary" size="lg" className="group">
              <Link href="/contact">
                {t("heroCtaPrimary")}
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="cream" size="lg">
              <Link href="/tours">{t("heroCtaSecondary")}</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <div className="h-12 w-px bg-cream-50/50" />
      </div>
    </section>
  );
}
