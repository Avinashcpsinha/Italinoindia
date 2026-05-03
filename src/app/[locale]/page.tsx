import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { FeaturedTours } from "@/components/sections/featured-tours";
import { Story } from "@/components/sections/story";
import { WhyUs } from "@/components/sections/why-us";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaBanner } from "@/components/sections/cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <FeaturedTours />
      <Story />
      <WhyUs />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
