"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check, Globe } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, localeLabels, localeDomains, type Locale } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

const useDomains = process.env.NEXT_PUBLIC_USE_DOMAIN_ROUTING === "true";

export function LocaleSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");

  function switchTo(locale: Locale) {
    if (useDomains) {
      window.location.href = `https://${localeDomains[locale]}${pathname}`;
    } else {
      router.replace(pathname, { locale });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-ink-900/70 hover:text-ink-900 hover:bg-ink-900/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-600"
        aria-label={t("openMenu")}
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{currentLocale.toUpperCase()}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        {locales.map((locale) => {
          const isActive = locale === currentLocale;
          return (
            <DropdownMenuPrimitive.Item
              key={locale}
              onSelect={(e) => {
                e.preventDefault();
                if (!isActive) switchTo(locale);
              }}
              className="relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-ink-900/5 hover:bg-ink-900/5"
            >
              <span className="flex-1 font-medium">{localeLabels[locale]}</span>
              <span className="text-xs text-ink-900/40 uppercase">{locale}</span>
              {isActive && <Check className="h-4 w-4 text-saffron-600" />}
            </DropdownMenuPrimitive.Item>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
