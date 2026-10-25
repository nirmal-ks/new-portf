import { NextResponse, after, userAgent, type NextRequest } from "next/server";
import { sendEmail, sendWhatsApp } from "@/lib/notify";

// Drone scan backend: approximate location (city-level), network/company,
// traffic source and device, then pings Nirmal on WhatsApp + email.
// No names, emails or other personal details are collected unless the visitor
// types their own name into JARVIS.

type VisitBody = {
  kind: "arrive" | "summary";
  vid: string;
  owner?: boolean; // Nirmal browsing his own site: scan, but don't alert
  visitCount?: number;
  referrer?: string;
  utm?: string;
  tz?: string;
  seconds?: number;
  sections?: Record<string, number>;
  resume?: boolean;
  topics?: string[];
  name?: string;
};

type Geo = { city?: string; region?: string; country?: string; org?: string; company?: string };

// Home/mobile ISPs and cloud hosts aren't "who" is visiting, so never greet by them
const NOT_A_COMPANY = /jio|airtel|bharti|bsnl|mtnl|vodafone|\bidea\b|\bvi\b|hathway|act fibernet|atria convergence|excitel|spectra|you broadband|alliance broadband|asianet|railtel|sify|tata (play|sky|teleservices|communications)|comcast|verizon|at&t|charter|spectrum|t-mobile|telstra|singtel|etisalat|orange|google|amazon|aws|microsoft|azure|digitalocean|cloudflare|ovh|hetzner|linode|akamai|fastly|oracle cloud|alibaba|tencent|telecom|telekom|broadband|communications|cable|wireless|mobile|internet|\bisp\b|hosting|data ?cent(er|re)|\bvps\b|\bnetworks?\b/i;

const SHORT_NAMES: [RegExp, string][] = [
  [/tata consultancy/i, "TCS"], [/infosys/i, "Infosys"], [/wipro/i, "Wipro"], [/\bhcl/i, "HCLTech"],
  [/cognizant/i, "Cognizant"], [/accenture/i, "Accenture"], [/tech mahindra/i, "Tech Mahindra"],
  [/capgemini/i, "Capgemini"], [/ltimindtree|larsen|\bl&t\b/i, "LTIMindtree"], [/zoho/i, "Zoho"],
  [/freshworks/i, "Freshworks"], [/\bibm\b/i, "IBM"], [/deloitte/i, "Deloitte"], [/mphasis/i, "Mphasis"],
  [/hexaware/i, "Hexaware"], [/\bpwc\b|pricewaterhouse/i, "PwC"], [/\bey\b|ernst & young/i, "EY"], [/kpmg/i, "KPMG"],
];

function companyFrom(org: string | undefined) {
  if (!org || NOT_A_COMPANY.test(org)) return undefined;
  const known = SHORT_NAMES.find(([re]) => re.test(org));
  if (known) return known[1];
  const name = org
    .replace(/\b(private|pvt|limited|ltd|inc|llc|llp|corp|corporation|company|co|gmbh|plc|india)\b\.?/gi, "")
    .replace(/[,.\s]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return name.length >= 2 ? name.slice(0, 28) : undefined;
}

const SECTION_LABELS: Record<string, string> = {
  home: "Home", snapshot: "Snapshot", about: "About", experience: "Experience",
  projects: "Projects", skills: "Skills", contact: "Contact",
};

const DEDUPE_MS = 30 * 60 * 1000;
const seen = new Map<string, number>();
const geoCache = new Map<string, Geo>();
const ipHits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  ipHits.set(ip, recent);
  if (ipHits.size > 5000) ipHits.clear();
  return recent.length > 30;
}

function firstTime(key: string) {
  const now = Date.now();
  const last = seen.get(key);
  if (last && now - last < DEDUPE_MS) return false;
  seen.set(key, now);
  if (seen.size > 5000) seen.clear();
  return true;
}

const PRIVATE_IP = /^(unknown|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|::ffff:127\.|f[cd]|fe80)/i;

async function lookupGeo(ip: string, req: NextRequest): Promise<Geo> {
  const h = req.headers;
  const dec = (v: string | null) => (v ? decodeURIComponent(v) : undefined);
  const fromEdge: Geo = {
    city: dec(h.get("x-vercel-ip-city")),
    region: dec(h.get("x-vercel-ip-country-region")),
    country: dec(h.get("x-vercel-ip-country")),
  };
  if (PRIVATE_IP.test(ip)) return fromEdge;

  const cached = geoCache.get(ip);
  if (cached) return cached;

  // ipinfo adds the network owner (e.g. "Infosys Limited"); works without a token at low volume
  let geo = fromEdge;
  try {
    const token = process.env.IPINFO_TOKEN ? `?token=${process.env.IPINFO_TOKEN}` : "";
    const res = await fetch(`https://ipinfo.io/${encodeURIComponent(ip)}/json${token}`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const d = await res.json();
      geo = {
        city: fromEdge.city ?? d.city,
        region: d.region ?? fromEdge.region,
        country: fromEdge.country ?? d.country,
        org: typeof d.org === "string" ? d.org.replace(/^AS\d+\s*/, "") : undefined,
      };
    }
  } catch {
    // geo is best effort
  }
  geo.company = companyFrom(geo.org);
  geoCache.set(ip, geo);
  if (geoCache.size > 2000) geoCache.clear();
  return geo;
}

function trafficSource(referrer: string | undefined, utm: string | undefined, host: string | null) {
  if (utm) return utm.slice(0, 40);
  if (!referrer) return "Direct";
  try {
    const h = new URL(referrer).hostname.replace(/^www\./, "");
    if (host && h === host.replace(/^www\./, "")) return "Direct";
    const known: [RegExp, string][] = [
      [/linkedin|lnkd/, "LinkedIn"], [/google/, "Google"], [/bing/, "Bing"], [/duckduckgo/, "DuckDuckGo"],
      [/github/, "GitHub"], [/(^|\.)t\.co$|twitter|(^|\.)x\.com$/, "X / Twitter"], [/facebook|fb\.com/, "Facebook"],
      [/instagram/, "Instagram"], [/whatsapp|wa\.me/, "WhatsApp"], [/naukri/, "Naukri"], [/indeed/, "Indeed"],
      [/mail\./, "Email"], [/chatgpt|openai|claude|perplexity/, "AI assistant"],
    ];
    return known.find(([re]) => re.test(h))?.[1] ?? h;
  } catch {
    return "Direct";
  }
}

function deviceLabel(req: NextRequest) {
  const ua = userAgent(req);
  const kind = ua.device.model ? [ua.device.vendor, ua.device.model].filter(Boolean).join(" ") : ua.device.type ? ua.device.type[0].toUpperCase() + ua.device.type.slice(1) : "Desktop";
  return [kind, ua.browser.name, ua.os.name].filter(Boolean).join(" · ");
}

const fmtTime = () =>
  new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) + " IST";

const fmtDuration = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`);

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\r\n]+/g, " ").trim().slice(0, max) : undefined);

function channels() {
  const set = (process.env.VISIT_ALERTS ?? "whatsapp,email").toLowerCase();
  return { whatsapp: set.includes("whatsapp"), email: set.includes("email") };
}

function dispatch(subject: string, text: string) {
  const ch = channels();
  after(() =>
    Promise.allSettled([
      ch.whatsapp ? sendWhatsApp(text) : Promise.resolve(false),
      ch.email ? sendEmail({ subject, text: text.replace(/\*/g, ""), fromName: "Portfolio Drone" }) : Promise.resolve(null),
    ])
  );
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false }, { status: 429 });
  if (userAgent(request).isBot) return NextResponse.json({ ok: true });

  let body: VisitBody;
  try {
    const raw = await request.text();
    if (raw.length > 8000) return NextResponse.json({ ok: false }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const vid = clean(body.vid, 40);
  if (!vid || !/^[a-z0-9-]{8,40}$/i.test(vid) || (body.kind !== "arrive" && body.kind !== "summary")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const geo = await lookupGeo(ip, request);
  const place = [geo.city, geo.region, geo.country].filter(Boolean).join(", ") || "Unknown location";
  const visitCount = Math.max(1, Math.min(9999, Number(body.visitCount) || 1));

  if (body.kind === "arrive") {
    const source = trafficSource(clean(body.referrer, 300), clean(body.utm, 40), request.headers.get("host"));
    const device = deviceLabel(request);

    if (!body.owner && firstTime(`a:${vid}`)) {
      const text = [
        "🛸 *DRONE SCAN: New visitor on your portfolio*",
        `📍 ${place}`,
        geo.company ? `🏢 Company: ${geo.company} (${geo.org})` : geo.org && `🌐 Network: ${geo.org}`,
        `🔗 Came from: ${source}`,
        `💻 Device: ${device}`,
        visitCount > 1 ? `🔁 Returning visitor, visit #${visitCount}` : "🆕 First visit",
        `🕒 ${fmtTime()}`,
      ].filter(Boolean).join("\n");
      dispatch(`🛸 Portfolio visitor: ${[geo.company, geo.city ?? place].filter(Boolean).join(", ")} via ${source}`, text);
    }

    return NextResponse.json({ ok: true, city: geo.city, region: geo.region, country: geo.country, org: geo.org, company: geo.company, source, device });
  }

  // Summary (sent with sendBeacon when the tab is hidden/closed)
  const seconds = Math.max(0, Math.min(6 * 3600, Math.round(Number(body.seconds) || 0)));
  const name = clean(body.name, 40);
  const topics = Array.isArray(body.topics) ? [...new Set(body.topics.map((t) => clean(t, 24)).filter(Boolean))].slice(0, 12) : [];
  const sections = Object.entries(body.sections ?? {})
    .filter(([id, s]) => SECTION_LABELS[id] && Number(s) >= 2)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .map(([id, s]) => `${SECTION_LABELS[id]} (${fmtDuration(Math.round(Number(s)))})`);
  const engaged = seconds >= 20 || body.resume || !!name || topics.length > 0;

  if (engaged && firstTime(`s:${vid}:${Math.floor(seconds / 60)}`)) {
    const text = [
      `📊 *VISIT SUMMARY: ${geo.city ?? place} visitor*`,
      (geo.company || geo.org) && `🏢 ${geo.company ?? geo.org}`,
      `⏱️ Time on site: ${fmtDuration(seconds)}`,
      sections.length > 0 && `👀 Viewed: ${sections.join(", ")}`,
      `📄 Opened resume: ${body.resume ? "Yes ✅" : "No"}`,
      topics.length > 0 && `💬 Asked JARVIS about: ${topics.join(", ")}`,
      name && `🙋 Name given in chat: ${name}`,
      `🕒 ${fmtTime()}`,
    ].filter(Boolean).join("\n");
    dispatch(`📊 Visit summary: ${name ?? geo.city ?? "visitor"} spent ${fmtDuration(seconds)}`, text);
  }

  return NextResponse.json({ ok: true });
}
