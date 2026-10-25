import { NextResponse, after } from "next/server";
import { OWNER_EMAIL, sendEmail, sendWhatsApp } from "@/lib/notify";

interface ContactRequestBody {
  name: string;
  email: string;
  company?: string;
  roleType?: string;
  subject?: string;
  message: string;
  website?: string; // honeypot
}

const TARGET_EMAIL = OWNER_EMAIL;

// Best-effort in-memory rate limit: 5 submissions per IP per 10 minutes.
// (Per server instance — good enough to stop casual spam on a portfolio.)
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_MAX;
}

const LIMITS = { name: 120, email: 120, company: 120, roleType: 120, subject: 160, message: 4000 };

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages in a short time. Please wait a few minutes or use direct mail." },
        { status: 429 }
      );
    }

    const body: ContactRequestBody = await request.json();
    const { name, email, company, roleType, subject, message, website } = body;

    // Bots fill the hidden honeypot field — pretend success, send nothing
    if (website) {
      return NextResponse.json({ success: true, delivered: false });
    }

    for (const [field, max] of Object.entries(LIMITS)) {
      const value = body[field as keyof ContactRequestBody];
      if (value !== undefined && (typeof value !== "string" || value.length > max)) {
        return NextResponse.json({ error: `The ${field} field is too long (max ${max} characters).` }, { status: 400 });
      }
    }

    // 1. Basic validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Employer or Recruiter name is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid corporate or personal email address is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Transmission message must be at least 5 characters long." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanCompany = (company || "Not Specified").trim();
    const cleanRoleType = (roleType || "General Opportunity").trim();
    const cleanSubject = (subject || `Portfolio Comms: ${cleanRoleType} from ${cleanCompany}`).trim();
    const cleanMessage = message.trim();

    const transmissionId = `TX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    // 2. Prepare transmission content
    const emailSubject = `[PORTFOLIO TRANSMISSION] ${cleanSubject} — from ${cleanName} (${cleanCompany})`;
    const emailBodyText = `
=========================================
⚡ STARK COMMS UPLINK // TRANSMISSION
=========================================
Transmission ID: ${transmissionId}
Timestamp      : ${timestamp}
Target Receiver: ${TARGET_EMAIL}

FROM SENDER:
- Name   : ${cleanName}
- Company: ${cleanCompany}
- Email  : ${cleanEmail}
- Category: ${cleanRoleType}

SUBJECT:
${cleanSubject}

MESSAGE PAYLOAD:
-----------------------------------------
${cleanMessage}
-----------------------------------------

To reply directly to the sender, contact: ${cleanEmail}
=========================================
`.trim();

    // 3. Email via Resend → Web3Forms (whichever is configured)
    const provider = await sendEmail({
      subject: emailSubject,
      text: emailBodyText,
      replyTo: cleanEmail,
      fromName: `${cleanName} [${cleanCompany}]`,
    });
    const dispatchedVia = provider ?? "none";
    const isDelivered = provider !== null;

    // 4. WhatsApp ping, sent after the response so the form stays fast
    after(() =>
      sendWhatsApp(
        `📨 *New portfolio message*
👤 ${cleanName} (${cleanCompany})
✉️ ${cleanEmail}
🏷️ ${cleanRoleType}

${cleanMessage.slice(0, 600)}`
      )
    );

    // 5. Construct mailto fallback string
    const mailtoParams = new URLSearchParams({
      subject: emailSubject,
      body: emailBodyText,
    });
    const mailtoUrl = `mailto:${TARGET_EMAIL}?${mailtoParams.toString()}`;

    // Return receipt
    return NextResponse.json({
      success: true,
      delivered: isDelivered,
      provider: dispatchedVia,
      transmissionId,
      timestamp,
      targetEmail: TARGET_EMAIL,
      sender: {
        name: cleanName,
        email: cleanEmail,
        company: cleanCompany,
        roleType: cleanRoleType,
      },
      mailtoFallback: mailtoUrl,
      message: isDelivered
        ? `Transmission successfully dispatched to ${TARGET_EMAIL}.`
        : `Transmission logged. Direct uplink ready for ${TARGET_EMAIL}.`,
    });
  } catch (error) {
    console.error("[Contact API] Unexpected error:", error);
    return NextResponse.json(
      { error: "Transmission uplink failed. Please try again or use direct mail." },
      { status: 500 }
    );
  }
}
