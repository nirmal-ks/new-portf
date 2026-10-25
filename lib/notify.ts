// Server-only helpers that ping Nirmal on email and WhatsApp.
// Every channel is optional: unset env vars simply skip that channel.

import { profile } from "./profile";

export const OWNER_EMAIL = process.env.RECEIVER_EMAIL || profile.email;

type EmailInput = { subject: string; text: string; replyTo?: string; fromName?: string };

/** Sends via Resend, falling back to Web3Forms. Returns the provider used, or null. */
export async function sendEmail({ subject, text, replyTo, fromName = "Portfolio Comms" }: EmailInput): Promise<string | null> {
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: `${fromName.replace(/[<>"]/g, "")} <onboarding@resend.dev>`,
          to: [OWNER_EMAIL],
          ...(replyTo ? { reply_to: replyTo } : {}),
          subject,
          text,
        }),
      });
      if (res.ok) return "resend";
      console.warn("[notify] Resend dispatch warning:", await res.text());
    } catch (err) {
      console.error("[notify] Resend error:", err);
    }
  }

  if (process.env.WEB3FORMS_KEY) {
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_KEY,
          to: OWNER_EMAIL,
          from_name: fromName,
          ...(replyTo ? { email: replyTo } : {}),
          subject,
          message: text,
        }),
      });
      if (res.ok && (await res.json()).success) return "web3forms";
    } catch (err) {
      console.error("[notify] Web3Forms error:", err);
    }
  }

  return null;
}

/**
 * WhatsApp via CallMeBot (free): send "I allow callmebot to send me messages"
 * to their WhatsApp number once, and they reply with your API key.
 */
export async function sendWhatsApp(text: string): Promise<boolean> {
  const phone = process.env.WHATSAPP_PHONE;
  const apikey = process.env.CALLMEBOT_API_KEY;
  if (!phone || !apikey) return false;

  try {
    const url = `https://api.callmebot.com/whatsapp.php?${new URLSearchParams({ phone, text, apikey })}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) console.warn("[notify] CallMeBot responded", res.status);
    return res.ok;
  } catch (err) {
    console.error("[notify] WhatsApp error:", err);
    return false;
  }
}
