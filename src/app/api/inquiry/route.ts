import { Resend } from "resend";
import { z } from "zod";
import { getSupabaseAdmin } from "@/supabase/server";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  travelers: z.string().max(10),
  duration: z.string().max(10),
  month: z.string().max(20).optional(),
  interests: z.array(z.string()).max(20),
  budget: z.string().max(60).optional(),
  message: z.string().max(4000).optional(),
  tour: z.string().max(120).optional(),
  locale: z.string().max(5).optional(),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "invalid payload", issues: parsed.error.issues },
      { status: 422 }
    );
  }
  const data = parsed.data;

  // Run the two side effects in parallel; either failing should not break the other.
  const [dbResult, mailResult] = await Promise.allSettled([
    saveLeadToSupabase(data),
    sendInquiryEmail(data),
  ]);

  const dbOk = dbResult.status === "fulfilled" && dbResult.value !== "error";
  const mailOk = mailResult.status === "fulfilled" && mailResult.value !== "error";

  // If both failed and both were configured, return 500.
  // If at least one succeeded (or one was unconfigured), the lead is captured somewhere — return 200.
  if (!dbOk && !mailOk) {
    if (dbResult.status === "rejected") console.error("[inquiry] db error", dbResult.reason);
    if (mailResult.status === "rejected") console.error("[inquiry] mail error", mailResult.reason);
    return Response.json({ error: "all delivery channels failed" }, { status: 500 });
  }

  return Response.json({
    ok: true,
    db: dbResult.status === "fulfilled" ? dbResult.value : "error",
    mail: mailResult.status === "fulfilled" ? mailResult.value : "error",
  });
}

type Inquiry = z.infer<typeof schema>;

async function saveLeadToSupabase(data: Inquiry): Promise<"ok" | "skipped" | "error"> {
  const client = getSupabaseAdmin();
  if (!client) return "skipped";
  const { error } = await client.from("leads").insert({
    locale: data.locale ?? "en",
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    travelers: data.travelers ? parseInt(data.travelers, 10) : null,
    duration_days: data.duration ? parseInt(data.duration, 10) : null,
    travel_month: data.month ?? null,
    interests: data.interests,
    budget: data.budget ?? null,
    message: data.message ?? null,
    tour_slug: data.tour ?? null,
    source: "inquiry-form",
    utm: null,
  });
  if (error) {
    console.error("[inquiry] supabase insert error", error);
    return "error";
  }
  return "ok";
}

async function sendInquiryEmail(data: Inquiry): Promise<"ok" | "skipped" | "error"> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[inquiry] RESEND_API_KEY missing — skipping email", { email: data.email });
    return "skipped";
  }
  const fromEmail = process.env.INQUIRY_FROM ?? "ItalioIndia <noreply@italioindia.com>";
  const toEmail = process.env.INQUIRY_TO ?? "hello@italioindia.com";

  const resend = new Resend(apiKey);
  const subject = data.tour
    ? `New trip request — ${data.tour} — ${data.name}`
    : `New trip request — ${data.name} (${data.travelers} pax, ${data.duration} days)`;

  const html = `
    <h2 style="font-family: Georgia, serif">New trip request</h2>
    <p style="font-family: -apple-system, sans-serif; font-size: 14px; color: #555">
      Locale: <b>${data.locale ?? "—"}</b>
    </p>
    <table style="font-family: -apple-system, sans-serif; font-size: 14px; border-collapse: collapse">
      ${[
        ["Name", data.name],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Travelers", data.travelers],
        ["Duration (days)", data.duration],
        ["When", data.month],
        ["Budget", data.budget],
        ["Interests", data.interests.join(", ")],
        ["Tour ref", data.tour],
        ["Message", data.message?.replace(/\n/g, "<br>")],
      ]
        .filter(([, v]) => v)
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 16px 6px 0;color:#666;vertical-align:top">${k}</td><td style="padding:6px 0">${v}</td></tr>`
        )
        .join("")}
    </table>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: data.email,
      subject,
      html,
    });
    return "ok";
  } catch (err) {
    console.error("[inquiry] resend send failed", err);
    return "error";
  }
}
