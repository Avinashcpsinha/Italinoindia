"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const interestKeys = [
  "culture",
  "nature",
  "wellness",
  "food",
  "adventure",
  "spiritual",
  "family",
  "honeymoon",
] as const;

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  travelers: z.string(),
  duration: z.string(),
  month: z.string().optional(),
  interests: z.array(z.string()),
  budget: z.string().optional(),
  message: z.string().optional(),
  tour: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function InquiryForm({ tourSlug }: { tourSlug?: string }) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = React.useState<"idle" | "ok" | "error">("idle");
  const [interests, setInterests] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      travelers: "2",
      duration: "10",
      interests: [],
      tour: tourSlug,
    },
  });

  const toggleInterest = (key: string) => {
    setInterests((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      setValue("interests", next);
      return next;
    });
  };

  const onSubmit = async (data: Values) => {
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error("inquiry failed");
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  };

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-jade-500/30 bg-jade-500/5 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-jade-600 mx-auto" />
        <h2 className="mt-4 font-serif text-3xl text-ink-900">{t("successTitle")}</h2>
        <p className="mt-3 text-ink-900/70 max-w-md mx-auto">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("fields.name")}</Label>
          <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("fields.email")}</Label>
          <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("fields.phone")}</Label>
          <Input id="phone" type="tel" {...register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="travelers">{t("fields.travelers")}</Label>
          <Input id="travelers" type="number" min="1" {...register("travelers")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">{t("fields.duration")}</Label>
          <Input id="duration" type="number" min="1" {...register("duration")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="month">{t("fields.month")}</Label>
          <Select onValueChange={(v) => setValue("month", v)}>
            <SelectTrigger id="month">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              {["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].map((m) => (
                <SelectItem key={m} value={m}>
                  {new Date(2026, ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(m), 1).toLocaleString(locale, { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>{t("fields.interests")}</Label>
        <div className="flex flex-wrap gap-2">
          {interestKeys.map((key) => {
            const active = interests.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleInterest(key)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-saffron-600 bg-saffron-600 text-white"
                    : "border-ink-900/15 bg-cream-50 text-ink-900 hover:border-ink-900/30"
                }`}
              >
                {t(`interestOptions.${key}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">{t("fields.budget")}</Label>
        <Input id="budget" placeholder="€2,500" {...register("budget")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("fields.message")}</Label>
        <Textarea id="message" rows={5} {...register("message")} />
      </div>

      {tourSlug && <input type="hidden" {...register("tour")} value={tourSlug} />}

      {status === "error" && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/5 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-ink-900">{t("errorTitle")}</div>
            <div className="text-sm text-ink-900/70">{t("errorBody")}</div>
          </div>
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? t("submitting") : (
          <>
            {t("submit")} <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
