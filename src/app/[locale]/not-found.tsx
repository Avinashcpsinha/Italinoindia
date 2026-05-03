import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("nav");
  return (
    <div className="container-narrow py-32 md:py-40 text-center">
      <div className="font-serif text-[8rem] md:text-[12rem] text-saffron-600/30 leading-none">
        404
      </div>
      <h1 className="mt-4 font-serif text-4xl md:text-5xl text-ink-900">
        Lost on the road
      </h1>
      <p className="mt-4 text-ink-900/65 max-w-md mx-auto">
        The page you were looking for has wandered off — like the best journeys do. Let's find your way back.
      </p>
      <Button asChild variant="primary" size="lg" className="mt-10">
        <Link href="/">{t("tours")}</Link>
      </Button>
    </div>
  );
}
