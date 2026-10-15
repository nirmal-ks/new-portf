"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion, AnimatePresence, useScroll, useSpring, useTransform, useVelocity,
  useMotionValue, useMotionValueEvent, useReducedMotion, useAnimationControls,
} from "framer-motion";

// Side gutters only exist when the viewport is wider than the 1200px container + room for a bot
const WIDE_QUERY = "(min-width: 1440px)";

function useWideScreen() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(WIDE_QUERY);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(WIDE_QUERY).matches,
    () => false
  );
}

const SECTIONS: { id: string; label: string; line: string }[] = [
  { id: "home", label: "Home", line: "SYSTEMS ONLINE ⚡" },
  { id: "snapshot", label: "Snapshot", line: "QUICK INTEL 📋" },
  { id: "about", label: "About", line: "MEET NIRMAL 👋" },
  { id: "experience", label: "Experience", line: "CAREER LOG 📈" },
  { id: "projects", label: "Projects", line: "WE BUILT THESE 🤖" },
  { id: "skills", label: "Expertise", line: "POWER LEVELS 💪" },
  { id: "contact", label: "Contact", line: "HIRE HIM! 🚀" },
];

export default function SideBots() {
  const wide = useWideScreen();
  const reduced = useReducedMotion();
  if (!wide || reduced) return null;

  return (
    <div className="sidebots" aria-hidden="true">
      <RappelBot />
      <ScoutDrone />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEFT — Rappelling bot that descends a cable with the page
═══════════════════════════════════════════════════════════ */
function RappelBot() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.6 });
  const pct = useTransform(progress, (v) => `${v * 100}%`);
  const velocity = useVelocity(scrollY);
  // Pendulum lean: the bot lags behind the direction of travel
  const swing = useSpring(useTransform(velocity, [-2500, 0, 2500], [16, 0, -16]), { stiffness: 50, damping: 6 });

  const [mode, setMode] = useState<"idle" | "down" | "up">("idle");
  const [waving, setWaving] = useState(false);
  const [active, setActive] = useState("home");
  const [bubble, setBubble] = useState<string | null>(null);
  const [markers, setMarkers] = useState<{ id: string; label: string; at: number }[]>([]);

  const modeRef = useRef(mode);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useMotionValueEvent(velocity, "change", (v) => {
    if (Math.abs(v) < 40) return;
    const next = v > 0 ? "down" : "up";
    if (modeRef.current !== next) {
      modeRef.current = next;
      setMode(next);
      setWaving(false);
    }
    clearTimers();
    timers.current.push(setTimeout(() => {
      modeRef.current = "idle";
      setMode("idle");
      timers.current.push(setTimeout(() => {
        setWaving(true);
        timers.current.push(setTimeout(() => setWaving(false), 2600));
      }, 2500));
    }, 220));
  });

  useEffect(() => clearTimers, []);

  // Track the section in view → speech bubble
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setActive(e.target.id);
          setBubble(SECTIONS.find((s) => s.id === e.target.id)?.line ?? null);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!bubble) return;
    const t = setTimeout(() => setBubble(null), 2400);
    return () => clearTimeout(t);
  }, [bubble]);

  // Rail markers at the scroll position where each section reaches the top
  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      setMarkers(
        SECTIONS.flatMap((s) => {
          const el = document.getElementById(s.id);
          if (!el) return [];
          const top = el.getBoundingClientRect().top + window.scrollY;
          return [{ id: s.id, label: s.label, at: Math.min(1, Math.max(0, top / max)) }];
        })
      );
    };
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  const activeIdx = SECTIONS.findIndex((s) => s.id === active);
  const moving = mode !== "idle";

  return (
    <div className="sidebot-rail">
      <div className="sidebot-rail-line" />

      <div className="sidebot-track">
        {markers.map((m) => {
          const passed = SECTIONS.findIndex((s) => s.id === m.id) <= activeIdx;
          return (
            <button
              key={m.id}
              tabIndex={-1}
              className={`sidebot-marker ${passed ? "passed" : ""} ${m.id === active ? "current" : ""}`}
              style={{ top: `${m.at * 100}%` }}
              onClick={() => document.getElementById(m.id)?.scrollIntoView({ behavior: "smooth" })}
            >
              <span className="sidebot-marker-label">{m.label}</span>
            </button>
          );
        })}

        {/* Glowing cable from the anchor down to the bot */}
        <motion.div className="sidebot-cable" style={{ height: pct }} />

        <motion.div className="sidebot-hanger" style={{ top: pct }}>
          <AnimatePresence>
            {(bubble || waving) && (
              <motion.div
                key={waving ? "wave" : bubble}
                className="sidebot-bubble"
                initial={{ opacity: 0, y: 6, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {waving ? "SCROLL ON! 👋" : bubble}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div className="sidebot-swing" style={{ rotate: swing }}>
            <motion.div
              className="sidebot-body"
              animate={moving ? { rotate: 0 } : { rotate: [-4, 4, -4] }}
              transition={moving ? { duration: 0.3 } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <RappelBotSvg mode={mode} waving={waving} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function RappelBotSvg({ mode, waving }: { mode: "idle" | "down" | "up"; waving: boolean }) {
  const moving = mode !== "idle";
  // Pupils glance in the direction of travel
  const lookY = mode === "down" ? 2.5 : mode === "up" ? -2.5 : 0;
  const kick = (phase: number) =>
    moving
      ? { rotate: phase ? [20, -20, 20] : [-20, 20, -20], transition: { duration: 0.35, repeat: Infinity } }
      : { rotate: phase ? 4 : -4, transition: { duration: 0.4 } };

  return (
    <svg viewBox="0 0 100 124" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="sb-crimson" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="60%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="sb-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <radialGradient id="sb-arc">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#0284c7" />
        </radialGradient>
        <filter id="sb-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Carabiner hook */}
      <path d="M50 0 v6" stroke="#fbbf24" strokeWidth="2.5" />
      <ellipse cx="50" cy="9" rx="4" ry="5" fill="none" stroke="#fbbf24" strokeWidth="2.5" />

      {/* Legs */}
      <motion.g style={{ transformOrigin: "42px 92px" }} animate={kick(0)}>
        <rect x="37" y="90" width="9" height="20" rx="4" fill="url(#sb-crimson)" stroke="#f59e0b" strokeWidth="1.2" />
        <rect x="34" y="107" width="14" height="7" rx="3" fill="url(#sb-gold)" />
      </motion.g>
      <motion.g style={{ transformOrigin: "58px 92px" }} animate={kick(1)}>
        <rect x="54" y="90" width="9" height="20" rx="4" fill="url(#sb-crimson)" stroke="#f59e0b" strokeWidth="1.2" />
        <rect x="52" y="107" width="14" height="7" rx="3" fill="url(#sb-gold)" />
      </motion.g>

      {/* Left arm — grips the harness strap */}
      <motion.g
        style={{ transformOrigin: "32px 64px" }}
        animate={moving ? { rotate: [10, -10, 10] } : { rotate: 0 }}
        transition={moving ? { duration: 0.5, repeat: Infinity } : { duration: 0.4 }}
      >
        <rect x="22" y="62" width="10" height="22" rx="5" fill="url(#sb-crimson)" stroke="#f59e0b" strokeWidth="1.2" />
        <circle cx="27" cy="86" r="4.5" fill="url(#sb-gold)" />
      </motion.g>

      {/* Right arm — waves when idle */}
      <motion.g
        style={{ transformOrigin: "68px 64px" }}
        animate={waving ? { rotate: [-150, -115, -150, -115, -150] } : moving ? { rotate: [-10, 10, -10] } : { rotate: 0 }}
        transition={waving ? { duration: 1.4, repeat: 1 } : moving ? { duration: 0.5, repeat: Infinity } : { duration: 0.4 }}
      >
        <rect x="68" y="62" width="10" height="22" rx="5" fill="url(#sb-crimson)" stroke="#f59e0b" strokeWidth="1.2" />
        <circle cx="73" cy="86" r="4.5" fill="url(#sb-gold)" />
      </motion.g>

      {/* Torso + harness */}
      <rect x="31" y="56" width="38" height="38" rx="11" fill="url(#sb-crimson)" stroke="#f59e0b" strokeWidth="1.8" />
      <path d="M36 58 L50 74 L64 58" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" />
      <motion.circle
        cx="50" cy="78" r="6.5" fill="url(#sb-arc)" filter="url(#sb-glow)"
        animate={{ r: moving ? [6.5, 8, 6.5] : [6, 7, 6] }}
        transition={{ duration: moving ? 0.4 : 1.6, repeat: Infinity }}
      />

      {/* Head */}
      <rect x="24" y="14" width="52" height="42" rx="15" fill="url(#sb-crimson)" stroke="#f59e0b" strokeWidth="2" />
      <rect x="30" y="24" width="40" height="22" rx="9" fill="#080609" stroke="#7f1d1d" />
      <motion.g
        style={{ transformOrigin: "50px 35px" }}
        animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.46, 0.5, 0.54, 1] }}
      >
        <circle cx="41" cy="35" r="5.5" fill="url(#sb-arc)" filter="url(#sb-glow)" />
        <circle cx="59" cy="35" r="5.5" fill="url(#sb-arc)" filter="url(#sb-glow)" />
        <motion.g animate={{ y: lookY }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
          <circle cx="41" cy="35" r="2.2" fill="#ffffff" />
          <circle cx="59" cy="35" r="2.2" fill="#ffffff" />
        </motion.g>
      </motion.g>
      {/* Mouth: open "O" while moving, smile when idle */}
      {moving
        ? <ellipse cx="50" cy="51" rx="3" ry="2.2" fill="#00f0ff" opacity="0.8" />
        : <path d="M45 50 Q50 54 55 50" fill="none" stroke="#00f0ff" strokeWidth="1.6" strokeLinecap="round" />}
      <rect x="18" y="28" width="7" height="14" rx="3" fill="url(#sb-gold)" />
      <rect x="75" y="28" width="7" height="14" rx="3" fill="url(#sb-gold)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   RIGHT — Scout drone that tracks the cursor
═══════════════════════════════════════════════════════════ */
function ScoutDrone() {
  const ref = useRef<HTMLDivElement>(null);
  const targetY = useMotionValue(typeof window === "undefined" ? 360 : window.innerHeight * 0.42);
  const y = useSpring(targetY, { stiffness: 60, damping: 14, mass: 0.8 });
  const tilt = useTransform(useVelocity(y), [-1400, 1400], [-18, 18]);
  const pupilX = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  const pupilY = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  const roll = useAnimationControls();

  const [locked, setLocked] = useState(false);
  const [scanning, setScanning] = useState(false);
  const lockedRef = useRef(false);
  const scanningRef = useRef(false);

  const scan = () => {
    if (scanningRef.current) return;
    scanningRef.current = true;
    setScanning(true);
    setTimeout(() => {
      scanningRef.current = false;
      setScanning(false);
    }, 1500);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const h = window.innerHeight;
      targetY.set(Math.min(h * 0.68, Math.max(h * 0.2, e.clientY)));

      const rect = ref.current?.getBoundingClientRect();
      if (rect) {
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const reach = 3.2 * Math.min(1, dist / 160);
        pupilX.set((dx / dist) * reach);
        pupilY.set((dy / dist) * reach);
      }

      const target = e.target instanceof Element ? e.target.closest("a, button, [role='tab'], input, textarea") : null;
      const isLocked = !!target && !ref.current?.contains(target);
      if (isLocked !== lockedRef.current) {
        lockedRef.current = isLocked;
        setLocked(isLocked);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    // Periodic patrol scan
    const patrol = setInterval(scan, 11000);
    return () => {
      window.removeEventListener("mousemove", onMove);
      clearInterval(patrol);
    };
  }, [targetY, pupilX, pupilY]);

  const onClick = async () => {
    scan();
    await roll.start({ rotate: [0, -360], scale: [1, 1.15, 1], transition: { duration: 0.8, ease: "easeInOut" } });
    roll.set({ rotate: 0 });
  };

  const bubble = scanning ? "SCANNING… 📡" : locked ? "TARGET LOCKED 🎯" : null;

  return (
    <motion.div className="sidebot-drone" style={{ y }}>
      <div className="sidebot-drone-anchor" ref={ref}>
        {/* Scan beam sweeping toward the content */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              className="sidebot-beam"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 0.9, 0.9, 0], rotate: [-8, 8, -8, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {bubble && (
            <motion.div
              key={bubble}
              className="sidebot-bubble"
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {bubble}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div style={{ rotate: tilt }}>
          <motion.div
            className="sidebot-drone-body"
            animate={roll}
            onClick={onClick}
            whileHover={{ scale: 1.08 }}
            title="Click me!"
          >
            <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
              <DroneSvg locked={locked} pupilX={pupilX} pupilY={pupilY} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Thruster sparks */}
        <div className="sidebot-sparks">
          {[0, 1, 2, 3].map((i) => <span key={i} style={{ animationDelay: `${i * 0.35}s`, left: `${30 + i * 13}%` }} />)}
        </div>
      </div>
    </motion.div>
  );
}

function DroneSvg({ locked, pupilX, pupilY }: {
  locked: boolean;
  pupilX: ReturnType<typeof useSpring>;
  pupilY: ReturnType<typeof useSpring>;
}) {
  const eye = locked ? "#fbbf24" : "url(#sd-arc)";
  const rotorSpeed = locked ? 0.08 : 0.16;

  return (
    <svg viewBox="0 0 140 112" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="sd-crimson" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="60%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="sd-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <radialGradient id="sd-arc">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#0284c7" />
        </radialGradient>
        <filter id="sd-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Rotor arms */}
      <path d="M44 52 L20 30 M96 52 L120 30" stroke="url(#sd-gold)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="20" cy="30" r="5" fill="#1f0a10" stroke="#f59e0b" strokeWidth="2" />
      <circle cx="120" cy="30" r="5" fill="#1f0a10" stroke="#f59e0b" strokeWidth="2" />
      {[20, 120].map((cx) => (
        <motion.ellipse
          key={cx}
          cx={cx} cy="26" rx="20" ry="3.2"
          fill="rgba(0,240,255,0.35)" stroke="#00f0ff" strokeWidth="0.8"
          style={{ transformOrigin: `${cx}px 26px` }}
          animate={{ scaleX: [1, 0.15, 1] }}
          transition={{ duration: rotorSpeed, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* Thruster flame */}
      <motion.ellipse
        cx="70" cy="98" rx="10" ry="6" fill="url(#sd-arc)" filter="url(#sd-glow)"
        animate={{ ry: [4, 10, 4], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />

      {/* Hull */}
      <ellipse cx="70" cy="62" rx="40" ry="30" fill="url(#sd-crimson)" stroke="#f59e0b" strokeWidth="2.2" />
      <path d="M40 72 Q70 92 100 72" fill="none" stroke="url(#sd-gold)" strokeWidth="3" />
      <rect x="64" y="86" width="12" height="8" rx="3" fill="url(#sd-gold)" />

      {/* Antenna */}
      <path d="M70 32 V18" stroke="#fbbf24" strokeWidth="2" />
      <motion.circle
        cx="70" cy="16" r="3.5" fill={locked ? "#ef4444" : "#00f0ff"} filter="url(#sd-glow)"
        animate={{ opacity: [1, 0.25, 1] }}
        transition={{ duration: locked ? 0.35 : 1.2, repeat: Infinity }}
      />

      {/* Visor + tracking eyes */}
      <rect x="44" y="46" width="52" height="26" rx="12" fill="#080609" stroke="#7f1d1d" />
      <motion.g
        style={{ transformOrigin: "70px 59px" }}
        animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
        transition={{ duration: 3.6, repeat: Infinity, times: [0, 0.46, 0.5, 0.54, 1] }}
      >
        <circle cx="58" cy="59" r="7" fill={eye} filter="url(#sd-glow)" />
        <circle cx="82" cy="59" r="7" fill={eye} filter="url(#sd-glow)" />
        <motion.g style={{ x: pupilX, y: pupilY }}>
          <circle cx="58" cy="59" r="2.8" fill="#ffffff" />
          <circle cx="82" cy="59" r="2.8" fill="#ffffff" />
        </motion.g>
      </motion.g>
    </svg>
  );
}
