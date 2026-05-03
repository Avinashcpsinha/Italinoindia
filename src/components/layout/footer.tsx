import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { locales, localeLabels } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tSite = useTranslations("site");
  const tContact = useTranslations("contact");

  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-ink-900/10 bg-ink-900 text-cream-100">
      <div className="container-wide py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-serif text-2xl text-cream-50 mb-4">{tSite("name")}</div>
            <p className="text-cream-100/70 max-w-sm leading-relaxed">{t("tagline")}</p>

            <form className="mt-8 max-w-sm" action="/api/newsletter" method="post">
              <div className="text-xs uppercase tracking-[0.18em] text-cream-100/60 mb-3">
                {t("newsletter")}
              </div>
              <div className="flex gap-2">
                <Input
                  name="email"
                  type="email"
                  placeholder={t("newsletterPlaceholder")}
                  className="bg-ink-800 border-ink-700 text-cream-50 placeholder:text-cream-100/30 focus-visible:border-saffron-400"
                  required
                />
                <Button type="submit" variant="primary">
                  {t("newsletterButton")}
                </Button>
              </div>
            </form>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.18em] text-cream-100/40 mb-5">
              {t("explore")}
            </div>
            <ul className="space-y-3 text-sm">
              <li><Link href="/tours" className="hover:text-saffron-300 transition-colors">{tNav("tours")}</Link></li>
              <li><Link href="/destinations" className="hover:text-saffron-300 transition-colors">{tNav("destinations")}</Link></li>
              <li><Link href="/about" className="hover:text-saffron-300 transition-colors">{tNav("story")}</Link></li>
              <li><Link href="/contact" className="hover:text-saffron-300 transition-colors">{tNav("contact")}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.18em] text-cream-100/40 mb-5">
              {t("languages")}
            </div>
            <ul className="space-y-3 text-sm">
              {locales.map((locale) => (
                <li key={locale}>
                  <Link
                    href="/"
                    locale={locale}
                    className="hover:text-saffron-300 transition-colors"
                  >
                    {localeLabels[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[0.18em] text-cream-100/40 mb-5">
              {tNav("contact")}
            </div>
            <ul className="space-y-3 text-sm text-cream-100/80">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-saffron-400" />
                <a href="mailto:hello@italioindia.com" className="hover:text-cream-50">hello@italioindia.com</a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-saffron-400" />
                <a href="tel:+390550000000" className="hover:text-cream-50">+39 055 000 0000</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-saffron-400" />
                <span>{tContact("officeIt")}<br />{tContact("officeIn")}</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              <a href="#" aria-label="Instagram" className="size-9 rounded-full bg-ink-800 flex items-center justify-center hover:bg-saffron-600 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="size-9 rounded-full bg-ink-800 flex items-center justify-center hover:bg-saffron-600 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ink-700/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-cream-100/40">
          <div>{t("rights", { year })}</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-cream-100">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-cream-100">{t("terms")}</Link>
            <Link href="/cookies" className="hover:text-cream-100">{t("cookies")}</Link>
            <Link href="/imprint" className="hover:text-cream-100">{t("imprint")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
