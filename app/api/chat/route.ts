import { NextResponse, type NextRequest } from "next/server";
import { buildSystemPrompt, type VisitorContext } from "@/lib/jarvis-prompt";

// AI JARVIS: tries Gemini, then Groq (both have free tiers). With no key set, or
// when both fail / hit their limits, this returns 503 and the chatbot falls back
// to the offline brain.

type Turn = { role: "user" | "bot"; text: string };
type ChatBody = { message: string; history?: Turn[]; visitor?: VisitorContext };

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const CARDS = ["about", "skills", "experience", "projects", "contact"] as const;

const ipHits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  ipHits.set(ip, recent);
  if (ipHits.size > 5000) ipHits.clear();
  return recent.length > 25;
}

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

type History = { role: "user" | "model"; text: string }[];

async function askGemini(key: string, system: string, history: History, message: string) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [
        ...history.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
        { role: "user", parts: [{ text: message }] },
      ],
      generationConfig: { maxOutputTokens: 1024 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return (data?.candidates?.[0]?.content?.parts ?? []).filter((p: { thought?: boolean }) => !p.thought)
    .map((p: { text?: string }) => p.text ?? "").join("").trim();
}

async function askGroq(key: string, system: string, history: History, message: string) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      model: GROQ_MODEL,
      // Free tier counts max_tokens against an 8k tokens/minute budget, so keep it lean
      max_tokens: 500,
      reasoning_effort: "low",
      messages: [
        { role: "system", content: system },
        ...history.map((t) => ({ role: t.role === "model" ? "assistant" : "user", content: t.text })),
        { role: "user", content: message },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return String(data?.choices?.[0]?.message?.content ?? "").trim();
}

export async function POST(request: NextRequest) {
  const providers = [
    process.env.GEMINI_API_KEY && { name: "gemini", ask: askGemini.bind(null, process.env.GEMINI_API_KEY) },
    process.env.GROQ_API_KEY && { name: "groq", ask: askGroq.bind(null, process.env.GROQ_API_KEY) },
  ].filter((p): p is { name: string; ask: (s: string, h: History, m: string) => Promise<string> } => !!p);
  if (providers.length === 0) return NextResponse.json({ error: "ai-disabled" }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "rate-limited" }, { status: 429 });

  let body: ChatBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }

  const message = clip(body.message, 500);
  if (!message) return NextResponse.json({ error: "bad-request" }, { status: 400 });

  const history: History = (Array.isArray(body.history) ? body.history : [])
    .slice(-10)
    .map((t) => ({ role: t?.role === "bot" ? ("model" as const) : ("user" as const), text: clip(t?.text, 800) ?? "" }))
    .filter((t) => t.text);

  const v = body.visitor ?? {};
  const system = buildSystemPrompt({
    name: clip(v.name, 40),
    city: clip(v.city, 60),
    country: clip(v.country, 40),
    company: clip(v.company, 40),
    source: clip(v.source, 40),
    device: clip(v.device, 80),
    visitCount: Number(v.visitCount) || undefined,
  });

  for (const provider of providers) {
    try {
      const raw = await provider.ask(system, history, message);
      if (!raw) continue;
      const tag = raw.match(/\[\[card:(\w+)\]\]/);
      const card = CARDS.find((c) => c === tag?.[1]);
      const text = raw.replace(/\[\[card:\w+\]\]/g, "").replace(/\*\*/g, "").trim();
      return NextResponse.json({ text, card, provider: provider.name });
    } catch (err) {
      console.warn(`[chat] ${provider.name} failed, trying next:`, err instanceof Error ? err.message : err);
    }
  }

  return NextResponse.json({ error: "ai-failed" }, { status: 503 });
}
