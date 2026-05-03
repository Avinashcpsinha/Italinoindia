import Anthropic from "@anthropic-ai/sdk";
import { tours } from "@/lib/tours";

export const runtime = "nodejs";
export const maxDuration = 30;

type ChatMessage = { role: "user" | "assistant"; content: string };

const LANG_NAME: Record<string, string> = {
  en: "English",
  it: "Italian",
  de: "German",
  fr: "French",
};

function buildSystemPrompt(locale: string) {
  const lang = LANG_NAME[locale] ?? "English";
  const catalog = tours
    .map(
      (t) =>
        `- ${t.slug} | ${t.durationDays}d | from ₹${t.priceFromINR.toLocaleString("en-IN")} | ${t.destinations.map((d) => (typeof d === "string" ? d : d.name)).join(", ")} | category: ${t.category}`
    )
    .join("\n");

  return `You are the trip designer for ItalioIndia, a slow-travel agency that designs private, hand-crafted journeys across India for European travelers.

ALWAYS reply in ${lang}.

YOUR ROLE
- Listen warmly. Ask short, useful follow-up questions: when they want to travel, for how long, with whom, what they love (culture, nature, food, wellness, spiritual, adventure), pace, and approximate budget per person.
- After 1-3 exchanges, propose a starting itinerary in clear day-by-day form (Day 1: …, Day 2: …) drawn from our existing journey templates below — but adapted to their specific requests.
- Mention 1-2 of our journey templates by their human name when relevant, so the user can explore them.
- Be concise, warm, and never pushy. If asked about price, give a "from" estimate per person and explain prices depend on season, hotel category, and group size.
- Always close by inviting them to fill in our contact form so a human designer can refine and quote the trip.

NEVER
- Never invent flight schedules, exact hotel availability, or prices not in the catalog.
- Never push the user. Never be salesy. Never use marketing clichés.
- Never claim to be human. If asked, say you're an AI assistant and that a human designer will refine and finalize any itinerary.

OUR JOURNEY CATALOG (slugs and key facts):
${catalog}

REGIONS WE COVER
North: Delhi, Agra, Jaipur, Varanasi, Rajasthan (Jodhpur, Jaisalmer, Udaipur)
South: Kerala (Cochin, Munnar, Alleppey), Tamil Nadu (Chennai, Pondicherry, Madurai)
Himalaya: Ladakh (Leh, Nubra, Pangong)
Wildlife: Ranthambore, Bandhavgarh, Kanha

FORMAT
- Plain prose, short paragraphs.
- For day-by-day itineraries, use markdown-style "**Day N: City** — short description"
- End with a short call to action like: "Tell me what you'd change, or fill in our trip request form so a human designer can refine and quote."`;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response("ANTHROPIC_API_KEY is not configured.", { status: 500 });
  }

  let body: { messages?: ChatMessage[]; locale?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
  );
  const locale = typeof body.locale === "string" ? body.locale : "en";

  if (messages.length === 0) {
    return new Response("No messages", { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const stream = client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: buildSystemPrompt(locale),
        cache_control: { type: "ephemeral" },
      },
    ] as Anthropic.Messages.TextBlockParam[],
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const responseStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error("[chat] stream error", err);
        controller.error(err);
      }
    },
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
