"use client";

import { useEffect } from "react";
import { emit, getBrain } from "@/lib/botBrain";

// Feeds the drone: one "arrive" ping on load (the server answers with the
// city-level scan), then a "summary" beacon when the tab is hidden or closed.
// Visit /?owner=1 once on your own devices to stop alerts about yourself
// (/?owner=0 turns them back on).

const SECTIONS = ["home", "snapshot", "about", "experience", "projects", "skills", "contact"];

function safe<T>(fn: () => T): T | null {
  try {
    return fn();
  } catch {
    return null;
  }
}

function visitorId() {
  let vid = safe(() => localStorage.getItem("drone-vid"));
  if (!vid) {
    vid = safe(() => crypto.randomUUID()) ?? `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    safe(() => localStorage.setItem("drone-vid", vid!));
  }
  return vid;
}

function visitCount() {
  let count = Number(safe(() => localStorage.getItem("drone-visits"))) || 0;
  if (!safe(() => sessionStorage.getItem("drone-session"))) {
    count += 1;
    safe(() => {
      localStorage.setItem("drone-visits", String(count));
      sessionStorage.setItem("drone-session", "1");
    });
  }
  return Math.max(1, count);
}

export default function VisitorTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("owner") === "1") safe(() => localStorage.setItem("nirmal-owner", "1"));
    if (params.get("owner") === "0") safe(() => localStorage.removeItem("nirmal-owner"));
    const owner = safe(() => localStorage.getItem("nirmal-owner")) === "1";

    const vid = visitorId();
    const count = visitCount();

    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "arrive",
        vid,
        owner,
        visitCount: count,
        referrer: document.referrer,
        utm: params.get("utm_source") ?? undefined,
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        emit({
          type: "visitor:scanned",
          scan: { city: d?.city, region: d?.region, country: d?.country, org: d?.org, company: d?.company, source: d?.source, device: d?.device, visitCount: count },
        });
      })
      .catch(() => emit({ type: "visitor:scanned", scan: { visitCount: count } }));

    // Dwell time per section, counted only while the tab is visible
    const visible = new Set<string>();
    const dwell: Record<string, number> = {};
    let seconds = 0;
    let resume = false;
    let lastSent = -1;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id))),
      { threshold: 0.3 }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const tick = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      seconds += 1;
      visible.forEach((id) => (dwell[id] = (dwell[id] ?? 0) + 1));
    }, 1000);

    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('a[href^="/resume"]')) resume = true;
    };

    // Re-send only when there's at least a minute of new activity, so tab
    // switching doesn't spam WhatsApp
    const sendSummary = () => {
      if (owner || (lastSent >= 0 && seconds - lastSent < 60)) return;
      lastSent = seconds;
      const { questions, visitorName } = getBrain();
      const payload = JSON.stringify({
        kind: "summary",
        vid,
        seconds,
        sections: dwell,
        resume,
        topics: questions,
        name: visitorName ?? undefined,
      });
      if (!navigator.sendBeacon?.("/api/visit", new Blob([payload], { type: "application/json" }))) {
        fetch("/api/visit", { method: "POST", body: payload, keepalive: true }).catch(() => {});
      }
    };
    const onHide = () => document.visibilityState === "hidden" && sendSummary();

    document.addEventListener("click", onClick, true);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", sendSummary);
    return () => {
      observer.disconnect();
      clearInterval(tick);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", sendSummary);
    };
  }, []);

  return null;
}
