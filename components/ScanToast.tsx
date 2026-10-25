"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { getBrain, onBrainEvent, type VisitorScan } from "@/lib/botBrain";
import { CuteDroneBot } from "./Robots";
import { useWideScreen, welcomeLine } from "./SideBots";

// On screens without the side gutters (or with reduced motion, where the side
// bots are off) the drone greets the visitor from a small corner card instead.
// Shown once per browser session.

type Phase = "scanning" | "done" | null;

export default function ScanToast() {
  const wide = useWideScreen();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(null);
  const [scan, setScan] = useState<VisitorScan | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const sideDroneVisible = wide && !reduced;

  useEffect(() => {
    if (sideDroneVisible) return;
    try {
      if (sessionStorage.getItem("drone-toast")) return;
    } catch {}

    const show = (s: VisitorScan) => {
      try {
        sessionStorage.setItem("drone-toast", "1");
      } catch {}
      setScan(s);
      setPhase("scanning");
      timers.current.push(setTimeout(() => setPhase("done"), 1600));
      timers.current.push(setTimeout(() => setPhase(null), 8000));
    };

    const early = setTimeout(() => {
      const s = getBrain().scan;
      if (s) show(s);
    }, 0);
    const off = onBrainEvent((e) => e.type === "visitor:scanned" && show(e.scan));
    return () => {
      clearTimeout(early);
      off();
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [sideDroneVisible]);

  const sub = scan
    ? [
        scan.source && scan.source !== "Direct" ? `via ${scan.source}` : null,
        scan.visitCount > 1 ? `visit #${scan.visitCount} 🔁` : "first visit 🆕",
      ].filter(Boolean).join(" · ")
    : "";

  return (
    <AnimatePresence>
      {phase && scan && !sideDroneVisible && (
        <motion.div
          className="scan-toast"
          role="status"
          initial={{ opacity: 0, x: -40, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={() => setPhase(null)}
          title="Tap to dismiss"
        >
          <div className="scan-toast-bot">
            <CuteDroneBot size={46} />
          </div>
          <div className="scan-toast-body">
            {phase === "scanning" ? (
              <>
                <span className="scan-toast-title">SCANNING VISITOR… 📡</span>
                <span className="scan-toast-bar"><span /></span>
              </>
            ) : (
              <>
                <span className="scan-toast-kicker">SCAN COMPLETE ✅</span>
                <span className="scan-toast-title">{welcomeLine(scan)}</span>
                {sub && <span className="scan-toast-sub">{sub}</span>}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
