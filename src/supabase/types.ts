/**
 * Hand-written types matching the schemas in supabase/migrations/.
 * After your Supabase project is set up, you can replace this file by running:
 *   pnpm dlx supabase gen types typescript --project-id <id> --schema public > src/supabase/types.ts
 */

import type { Locale } from "@/i18n/routing";

export type LocaleString = Partial<Record<Locale, string>>;

// ---------- Leads (already used by /api/inquiry) ----------

export type LeadStatus = "new" | "in_progress" | "quoted" | "won" | "lost";

export type LeadRow = {
  id: string;
  created_at: string;
  status: LeadStatus;
  locale: string;
  name: string;
  email: string;
  phone: string | null;
  travelers: number | null;
  duration_days: number | null;
  travel_month: string | null;
  interests: string[];
  budget: string | null;
  message: string | null;
  tour_slug: string | null;
  source: string | null;
  utm: Record<string, string> | null;
};

export type LeadInsert = {
  status?: LeadStatus;
  locale: string;
  name: string;
  email: string;
  phone?: string | null;
  travelers?: number | null;
  duration_days?: number | null;
  travel_month?: string | null;
  interests?: string[];
  budget?: string | null;
  message?: string | null;
  tour_slug?: string | null;
  source?: string | null;
  utm?: Record<string, string> | null;
};

// ---------- Content tables ----------

export type DestinationRow = {
  id: string;
  slug: string;
  name: LocaleString;
  region: "north" | "south" | "east" | "west" | "himalaya";
  intro: LocaleString | null;
  body: LocaleString | null;
  hero_image: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type TourCategoryDb =
  | "golden-triangle"
  | "rajasthan"
  | "kerala"
  | "himalaya"
  | "south-india"
  | "spiritual"
  | "wildlife";

export type TourDestinationEmbed = { slug: string; name: LocaleString };
export type TourItineraryDay = {
  day: number;
  title: LocaleString;
  body: LocaleString;
};

export type TourRow = {
  id: string;
  slug: string;
  category: TourCategoryDb;
  title: LocaleString;
  summary: LocaleString | null;
  description: LocaleString | null;
  duration_days: number;
  price_from_eur: number;
  hero_image: string | null;
  gallery: string[];
  destinations: TourDestinationEmbed[];
  highlights: LocaleString[];
  itinerary: TourItineraryDay[];
  rating: number | null;
  review_count: number | null;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type TestimonialRow = {
  id: string;
  author: string;
  trip: LocaleString | null;
  quote: LocaleString;
  rating: number;
  featured: boolean;
  display_order: number;
  created_at: string;
};

export type JournalPostRow = {
  id: string;
  slug: string;
  title: LocaleString;
  excerpt: LocaleString | null;
  body: LocaleString | null;
  cover_image: string | null;
  author: string | null;
  published_at: string | null;
  created_at: string;
};

// ---------- Database type used by createClient<Database>() ----------

type ContentTableShape<Row extends { id: string; slug: string; created_at: string }> = {
  Row: Row;
  Insert: Partial<Omit<Row, "id" | "created_at" | "updated_at">> & { slug: Row["slug"] };
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadRow>;
        Relationships: [];
      };
      tours: ContentTableShape<TourRow>;
      destinations: ContentTableShape<DestinationRow>;
      testimonials: {
        Row: TestimonialRow;
        Insert: Partial<Omit<TestimonialRow, "id" | "created_at">> &
          Pick<TestimonialRow, "author" | "quote">;
        Update: Partial<TestimonialRow>;
        Relationships: [];
      };
      journal_posts: ContentTableShape<JournalPostRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: { lead_status: LeadStatus };
    CompositeTypes: Record<string, never>;
  };
};
