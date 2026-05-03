"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./locale-switcher";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/tours", key: "tours" },
  { href: "/destinations", key: "destinations" },
  { href: "/about", key: "story" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const tSite = useTranslations("site");
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled || open
          ? "bg-cream-50/95 backdrop-blur-md border-b border-ink-900/5"
          : "bg-transparent"
      )}
    >
      <div className="container-wide flex h-16 md:h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl tracking-tight" aria-label={tSite("name")}>
          <LogoMark />
          <span className="hidden sm:inline-block">{tSite("name")}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm text-ink-900/80 hover:text-ink-900 transition-colors"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <Button asChild variant="primary" size="sm" className="hidden md:inline-flex">
            <Link href="/contact">{t("planTrip")}</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden inline-flex items-center justify-center size-10 rounded-full hover:bg-ink-900/5 transition-colors"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-900/5 bg-cream-50">
          <div className="container-wide py-6 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-lg font-serif rounded-lg hover:bg-ink-900/5 transition-colors"
              >
                {t(item.key)}
              </Link>
            ))}
            <Button asChild variant="primary" size="lg" className="mt-4 w-full">
              <Link href="/contact" onClick={() => setOpen(false)}>
                {t("planTrip")}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 22 Q16 8, 22 22"
        fill="none"
        stroke="var(--color-saffron-600)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="14" r="1.8" fill="var(--color-saffron-600)" />
    </svg>
  );
}
