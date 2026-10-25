"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// =========================================================================
// 🤖 1. CUTE IRON MAN HOVER-BOT (Mark-Cute Flight Engineer)
// =========================================================================
export function CuteIronBot({ size = 95, className = "", speech = "" }: { size?: number; className?: string; speech?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <motion.div
      className={`cute-robot-wrapper ${className}`}
      style={{ width: size, height: size, cursor: "pointer", position: "relative", display: "inline-block" }}
      animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setClicked(true);
        setTimeout(() => setClicked(false), 2000);
      }}
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence>
        {(clicked || speech) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: "absolute",
              top: -12,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(18, 6, 12, 0.96)",
              border: "1px solid var(--stark-gold)",
              color: "var(--arc-cyan)",
              fontSize: "0.72rem",
              fontFamily: "var(--font-mono)",
              padding: "3px 10px",
              borderRadius: "8px",
              whiteSpace: "nowrap",
              zIndex: 30,
              boxShadow: "0 0 15px rgba(0,240,255,0.5)",
              pointerEvents: "none"
            }}
          >
            {speech || (isHovered ? "I AM IRON BOT! ⚡" : "POWER AT 100%! 🚀")}
          </motion.div>
        )}
      </AnimatePresence>

      <svg viewBox="0 0 160 160" width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="ironCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="60%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient id="ironGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="arcCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Thruster Plumes */}
        <motion.ellipse
          cx="80" cy="145" rx="14" ry="6"
          fill="url(#arcCyan)" filter="url(#arcGlow)"
          animate={{ ry: [4, 10, 4], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        <motion.ellipse
          cx="80" cy="148" rx="24" ry="4"
          fill="#00f0ff" opacity="0.4" filter="url(#arcGlow)"
          animate={{ scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />

        {/* Armor Body */}
        <rect x="52" y="90" width="56" height="46" rx="14" fill="url(#ironCrimson)" stroke="#f59e0b" strokeWidth="2" />
        <rect x="36" y="92" width="18" height="14" rx="6" fill="url(#ironGold)" stroke="#b91c1c" strokeWidth="1.5" />
        <rect x="106" y="92" width="18" height="14" rx="6" fill="url(#ironGold)" stroke="#b91c1c" strokeWidth="1.5" />

        {/* Arm with tool */}
        <motion.g
          animate={{ rotate: isHovered ? [0, -20, 0] : 0 }}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
          style={{ transformOrigin: "42px 105px" }}
        >
          <rect x="34" y="102" width="12" height="20" rx="4" fill="url(#ironCrimson)" />
          <circle cx="40" cy="122" r="5" fill="url(#ironGold)" />
          <path d="M34 124 L22 136 M20 134 L26 140" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        </motion.g>

        {/* Arc Reactor */}
        <circle cx="80" cy="112" r="11" fill="#080609" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="80" cy="112" r="7" fill="url(#arcCyan)" filter="url(#arcGlow)" />
        <circle cx="80" cy="112" r="3" fill="#ffffff" />

        {/* Helmet */}
        <rect x="42" y="32" width="76" height="64" rx="22" fill="url(#ironCrimson)" stroke="#f59e0b" strokeWidth="2.5" />
        <path d="M52 46 C52 40, 108 40, 108 46 L104 84 C104 90, 56 90, 56 84 Z" fill="url(#ironGold)" stroke="#b91c1c" strokeWidth="1.5" />
        <rect x="36" y="48" width="8" height="20" rx="3" fill="url(#ironGold)" />
        <rect x="116" y="48" width="8" height="20" rx="3" fill="url(#ironGold)" />

        {/* Blinking Eyes */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
          style={{ transformOrigin: "80px 62px" }}
        >
          <rect x="60" y="56" width="14" height="9" rx="3" fill="url(#arcCyan)" filter="url(#arcGlow)" />
          <rect x="62" y="58" width="6" height="4" rx="1" fill="#ffffff" />
          <rect x="86" y="56" width="14" height="9" rx="3" fill="url(#arcCyan)" filter="url(#arcGlow)" />
          <rect x="88" y="58" width="6" height="4" rx="1" fill="#ffffff" />
        </motion.g>
        <polygon points="76,36 84,36 80,42" fill="url(#arcCyan)" filter="url(#arcGlow)" />
      </svg>
    </motion.div>
  );
}

// =========================================================================
// 🐕 2. CUTE UNITREE QUADRUPED DOG ROBOT (Scout Bot)
// =========================================================================
export function CuteDogBot({ size = 95, className = "", speech = "" }: { size?: number; className?: string; speech?: string }) {
  const [wag, setWag] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <motion.div
      className={`cute-dog-robot ${className}`}
      style={{ width: size, height: size * 0.85, cursor: "pointer", position: "relative", display: "inline-block" }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      onMouseEnter={() => setWag(true)}
      onMouseLeave={() => setWag(false)}
      onClick={() => {
        setClicked(true);
        setTimeout(() => setClicked(false), 2000);
      }}
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence>
        {(clicked || speech) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: "absolute",
              top: -10,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(18, 6, 12, 0.96)",
              border: "1px solid var(--stark-gold)",
              color: "var(--stark-gold-light)",
              fontSize: "0.72rem",
              fontFamily: "var(--font-mono)",
              padding: "2px 8px",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              zIndex: 30,
              boxShadow: "0 0 12px rgba(251,191,36,0.5)",
              pointerEvents: "none"
            }}
          >
            {speech || "WOOF! QUADRUPED READY! 🐶"}
          </motion.div>
        )}
      </AnimatePresence>

      <svg viewBox="0 0 160 130" width="100%" height="100%">
        {/* Wagging Antenna */}
        <motion.g
          animate={{ rotate: wag || clicked ? [-30, 30, -30] : [-8, 8, -8] }}
          transition={{ duration: wag || clicked ? 0.25 : 1.2, repeat: Infinity }}
          style={{ transformOrigin: "35px 50px" }}
        >
          <line x1="35" y1="50" x2="20" y2="28" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <circle cx="20" cy="28" r="5" fill="#00f0ff" filter="url(#arcGlow)" />
        </motion.g>

        {/* Legs */}
        <motion.g animate={{ rotate: [6, -6, 6] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <line x1="45" y1="75" x2="38" y2="105" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="45" cy="75" r="4" fill="#ffd700" />
          <circle cx="38" cy="108" r="4" fill="#00f0ff" />
        </motion.g>
        <motion.g animate={{ rotate: [-6, 6, -6] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <line x1="58" y1="75" x2="52" y2="108" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
          <circle cx="58" cy="75" r="4" fill="#ffd700" />
          <circle cx="52" cy="110" r="4" fill="#f59e0b" />
        </motion.g>
        <motion.g animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <line x1="102" y1="75" x2="98" y2="108" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
          <circle cx="102" cy="75" r="4" fill="#ffd700" />
          <circle cx="98" cy="110" r="4" fill="#f59e0b" />
        </motion.g>
        <motion.g animate={{ rotate: [8, -8, 8] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <line x1="115" y1="75" x2="118" y2="105" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="115" cy="75" r="4" fill="#ffd700" />
          <circle cx="118" cy="108" r="4" fill="#00f0ff" />
        </motion.g>

        {/* Chassis */}
        <rect x="35" y="48" width="85" height="34" rx="12" fill="#2c141c" stroke="#f59e0b" strokeWidth="2" />
        <rect x="55" y="58" width="40" height="6" rx="3" fill="#0d080c" />
        <rect x="57" y="59" width="30" height="4" rx="2" fill="#00f0ff" />

        {/* Head */}
        <rect x="110" y="32" width="36" height="32" rx="10" fill="#2c141c" stroke="#f59e0b" strokeWidth="2" />
        
        {/* Eye */}
        <motion.ellipse
          cx="128" cy="46" rx="10" ry="6" fill="#00f0ff" filter="url(#arcGlow)"
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
        />
        <circle cx="126" cy="45" r="2.5" fill="#ffffff" />

        {/* LiDAR */}
        <motion.ellipse
          cx="128" cy="28" rx="8" ry="3" fill="#ffd700"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </motion.div>
  );
}

// =========================================================================
// 💻 3. CUTE SOFTWARE & AI CODER BOT (Typing on Hologram Laptop)
// =========================================================================
export function CuteCoderBot({ size = 95, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={`cute-coder-robot ${className}`}
      style={{ width: size, height: size, cursor: "pointer", position: "relative", display: "inline-block" }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.18 }}
    >
      <svg viewBox="0 0 150 150" width="100%" height="100%">
        {/* Cute Programmer Cyber Goggles */}
        <rect x="42" y="38" width="66" height="48" rx="16" fill="#1e0c16" stroke="#f59e0b" strokeWidth="2" />
        <rect x="50" y="48" width="22" height="14" rx="4" fill="#00f0ff" filter="url(#arcGlow)" />
        <rect x="78" y="48" width="22" height="14" rx="4" fill="#00f0ff" filter="url(#arcGlow)" />
        <line x1="72" y1="55" x2="78" y2="55" stroke="#f59e0b" strokeWidth="2" />

        {/* Head Antenna */}
        <line x1="75" y1="38" x2="75" y2="22" stroke="#f59e0b" strokeWidth="3" />
        <circle cx="75" cy="20" r="5" fill="#ffd700" />

        {/* Body */}
        <rect x="48" y="88" width="54" height="42" rx="12" fill="#dc2626" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="75" cy="106" r="8" fill="#00f0ff" filter="url(#arcGlow)" />

        {/* Holographic Glowing Laptop */}
        <polygon points="50,126 100,126 94,142 56,142" fill="#180a14" stroke="#f59e0b" strokeWidth="1.5" />
        <polygon points="52,98 98,98 100,126 50,126" fill="rgba(0, 240, 255, 0.25)" stroke="#00f0ff" strokeWidth="1.5" />
        
        {/* Binary code lines on screen */}
        <line x1="58" y1="106" x2="88" y2="106" stroke="#00f0ff" strokeWidth="2" strokeDasharray="3 2" />
        <line x1="58" y1="112" x2="92" y2="112" stroke="#ffd700" strokeWidth="2" strokeDasharray="4 2" />
        <line x1="58" y1="118" x2="82" y2="118" stroke="#00f0ff" strokeWidth="2" strokeDasharray="2 2" />

        {/* Cute Rapid Typing Hands */}
        <motion.circle
          cx="62" cy="128" r="4" fill="#ffd700"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.25, repeat: Infinity }}
        />
        <motion.circle
          cx="88" cy="128" r="4" fill="#ffd700"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.25, repeat: Infinity, delay: 0.12 }}
        />
      </svg>
    </motion.div>
  );
}

// =========================================================================
// 🔬 4. CUTE HARDWARE & SOLDERING LAB BOT (With Mini Torch & Safety Specs)
// =========================================================================
export function CuteSolderingBot({ size = 95, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={`cute-solder-robot ${className}`}
      style={{ width: size, height: size, cursor: "pointer", position: "relative", display: "inline-block" }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.18 }}
    >
      <svg viewBox="0 0 150 150" width="100%" height="100%">
        {/* Body */}
        <rect x="48" y="75" width="54" height="50" rx="14" fill="#b91c1c" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="75" cy="98" r="9" fill="#f59e0b" />

        {/* Head */}
        <rect x="42" y="24" width="66" height="48" rx="16" fill="#180a12" stroke="#f59e0b" strokeWidth="2" />
        
        {/* Safety Goggles */}
        <rect x="48" y="34" width="24" height="18" rx="6" fill="#ffd700" stroke="#b91c1c" strokeWidth="2" />
        <rect x="78" y="34" width="24" height="18" rx="6" fill="#ffd700" stroke="#b91c1c" strokeWidth="2" />
        <circle cx="60" cy="43" r="4" fill="#00f0ff" />
        <circle cx="90" cy="43" r="4" fill="#00f0ff" />

        {/* Left Arm holding Microchip PCB */}
        <rect x="30" y="85" width="18" height="18" rx="3" fill="#166534" stroke="#4ade80" strokeWidth="1" />
        <circle cx="39" cy="94" r="2" fill="#ffd700" />

        {/* Right Arm holding Soldering Pen */}
        <line x1="98" y1="88" x2="120" y2="108" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
        <line x1="120" y1="108" x2="128" y2="116" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        
        {/* Hot Solder Tip Glow & Spark */}
        <motion.circle
          cx="128" cy="116" r="4" fill="#00f0ff" filter="url(#arcGlow)"
          animate={{ scale: [0.8, 1.6, 0.8], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 0.35, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}

// =========================================================================
// 🏗️ 5. CUTE MECHANICAL & CAD ARCHITECT BOT (With Hard Hat & Blueprints)
// =========================================================================
export function CuteArchitectBot({ size = 95, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={`cute-architect-robot ${className}`}
      style={{ width: size, height: size, cursor: "pointer", position: "relative", display: "inline-block" }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.18 }}
    >
      <svg viewBox="0 0 150 150" width="100%" height="100%">
        {/* Golden Engineer Hard Hat */}
        <path d="M40 38 C40 20, 110 20, 110 38 L118 44 C118 46, 32 46, 32 44 Z" fill="#ffd700" stroke="#b45309" strokeWidth="2" />
        <rect x="71" y="16" width="8" height="16" rx="3" fill="#dc2626" />

        {/* Head */}
        <rect x="44" y="44" width="62" height="42" rx="14" fill="#180a14" stroke="#f59e0b" strokeWidth="2" />
        
        {/* Eyes */}
        <circle cx="62" cy="62" r="6" fill="#00f0ff" filter="url(#arcGlow)" />
        <circle cx="88" cy="62" r="6" fill="#00f0ff" filter="url(#arcGlow)" />
        <circle cx="64" cy="60" r="2" fill="#ffffff" />
        <circle cx="90" cy="60" r="2" fill="#ffffff" />

        {/* Body */}
        <rect x="50" y="88" width="50" height="44" rx="12" fill="#dc2626" stroke="#f59e0b" strokeWidth="2" />
        
        {/* Holding Rolled Blueprint Scroll */}
        <rect x="32" y="102" width="46" height="12" rx="4" fill="#0284c7" stroke="#00f0ff" strokeWidth="1.5" />
        <line x1="38" y1="108" x2="72" y2="108" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 2" />
        
        {/* Caliper Tool in Right Hand */}
        <path d="M102 96 L118 116 M114 118 L122 110" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

// =========================================================================
// 🦾 6. CUTE DUM-E MECHANICAL WELDING ARM BOT
// =========================================================================
export function CuteDumEBot({ size = 95, className = "" }: { size?: number; className?: string }) {
  const [active, setActive] = useState(false);

  return (
    <motion.div
      className={`cute-dume-robot ${className}`}
      style={{ width: size, height: size, cursor: "pointer", position: "relative", display: "inline-block" }}
      whileHover={{ scale: 1.18 }}
      onClick={() => setActive(!active)}
    >
      <svg viewBox="0 0 140 140" width="100%" height="100%">
        <ellipse cx="70" cy="120" rx="36" ry="12" fill="#1e0c14" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="48" cy="124" r="7" fill="#dc2626" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="92" cy="124" r="7" fill="#dc2626" stroke="#f59e0b" strokeWidth="1.5" />
        <rect x="64" y="90" width="12" height="28" rx="4" fill="#f59e0b" />
        <circle cx="70" cy="90" r="8" fill="#dc2626" stroke="#f59e0b" strokeWidth="2" />

        <motion.g
          animate={{ rotate: active ? [-25, 25, -25] : [-10, 10, -10] }}
          transition={{ duration: active ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "70px 90px" }}
        >
          <line x1="70" y1="90" x2="55" y2="52" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
          <circle cx="55" cy="52" r="7" fill="#ffd700" />
          <motion.g
            animate={{ rotate: active ? [35, -25, 35] : [20, -15, 20] }}
            transition={{ duration: active ? 1.2 : 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "55px 52px" }}
          >
            <line x1="55" y1="52" x2="88" y2="35" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
            <circle cx="88" cy="35" r="6" fill="#dc2626" />
            <path d="M88 35 L102 26 M88 35 L102 44" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" />
            <motion.circle
              cx="108" cy="35" r="4" fill="#00f0ff" filter="url(#arcGlow)"
              animate={{ scale: [0.6, 1.6, 0.6], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.35, repeat: Infinity }}
            />
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
}

// =========================================================================
// 🛸 7. CUTE STARK QUADCOPTER DRONE BOT
// =========================================================================
export function CuteDroneBot({ size = 85, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={`cute-drone-robot ${className}`}
      style={{ width: size, height: size * 0.75, cursor: "pointer", position: "relative", display: "inline-block" }}
      animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.2 }}
    >
      <svg viewBox="0 0 150 110" width="100%" height="100%">
        <motion.line
          x1="15" y1="30" x2="55" y2="30" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round"
          animate={{ scaleX: [1, 0.1, 1] }} transition={{ duration: 0.15, repeat: Infinity }}
          style={{ transformOrigin: "35px 30px" }}
        />
        <rect x="30" y="32" width="10" height="15" rx="3" fill="#f59e0b" />
        <motion.line
          x1="95" y1="30" x2="135" y2="30" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round"
          animate={{ scaleX: [1, 0.1, 1] }} transition={{ duration: 0.15, repeat: Infinity }}
          style={{ transformOrigin: "115px 30px" }}
        />
        <rect x="110" y="32" width="10" height="15" rx="3" fill="#f59e0b" />
        <line x1="35" y1="45" x2="115" y2="45" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
        <rect x="52" y="35" width="46" height="42" rx="14" fill="#dc2626" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="75" cy="56" r="12" fill="#0c060a" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="75" cy="56" r="7" fill="#00f0ff" filter="url(#arcGlow)" />
        <circle cx="73" cy="54" r="2.5" fill="#ffffff" />
      </svg>
    </motion.div>
  );
}

// =========================================================================
// 🤖 8. CUTE REX AUTONOMOUS MOBILE ROVER (SLAM/LiDAR)
// =========================================================================
export function CuteRexBot({ size = 95, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={`cute-rex-robot ${className}`}
      style={{ width: size, height: size * 0.9, cursor: "pointer", position: "relative", display: "inline-block" }}
      animate={{ x: [0, 4, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.18 }}
    >
      <svg viewBox="0 0 150 140" width="100%" height="100%">
        <rect x="25" y="105" width="100" height="22" rx="10" fill="#14080e" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="40" cy="116" r="6" fill="#dc2626" />
        <circle cx="65" cy="116" r="6" fill="#dc2626" />
        <circle cx="85" cy="116" r="6" fill="#dc2626" />
        <circle cx="110" cy="116" r="6" fill="#dc2626" />
        <rect x="35" y="60" width="80" height="48" rx="12" fill="#dc2626" stroke="#f59e0b" strokeWidth="2" />
        <rect x="45" y="70" width="60" height="26" rx="6" fill="#160810" />
        <motion.ellipse
          cx="62" cy="83" rx="6" ry="5" fill="#00f0ff" filter="url(#arcGlow)"
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
        />
        <motion.ellipse
          cx="88" cy="83" rx="6" ry="5" fill="#00f0ff" filter="url(#arcGlow)"
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
        />
        <rect x="70" y="38" width="10" height="24" rx="2" fill="#f59e0b" />
        <motion.rect
          x="58" y="28" width="34" height="12" rx="5" fill="#ffd700" stroke="#b91c1c" strokeWidth="1.5"
          animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "75px 34px" }}
        />
        <circle cx="75" cy="34" r="4" fill="#00f0ff" filter="url(#arcGlow)" />
      </svg>
    </motion.div>
  );
}

// =========================================================================
// 🤝 9. CUTE AI SERVICE ROBOT (Smiling Face & Serving Tray)
// =========================================================================
export function CuteServiceBot({ size = 95, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={`cute-service-robot ${className}`}
      style={{ width: size, height: size * 1.1, cursor: "pointer", position: "relative", display: "inline-block" }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.18 }}
    >
      <svg viewBox="0 0 140 160" width="100%" height="100%">
        <ellipse cx="70" cy="142" rx="28" ry="10" fill="#180a12" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="70" cy="142" r="5" fill="#00f0ff" filter="url(#arcGlow)" />
        <rect x="52" y="78" width="36" height="58" rx="12" fill="#dc2626" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="70" cy="98" r="8" fill="#ffd700" />
        <rect x="58" y="114" width="24" height="12" rx="3" fill="#12060c" />
        <rect x="62" y="118" width="16" height="4" rx="1" fill="#00f0ff" />
        <line x1="42" y1="92" x2="30" y2="108" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
        <line x1="98" y1="92" x2="110" y2="108" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
        <rect x="42" y="24" width="56" height="46" rx="16" fill="#1e0c16" stroke="#f59e0b" strokeWidth="2" />
        <motion.g animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <circle cx="58" cy="42" r="5" fill="#00f0ff" filter="url(#arcGlow)" />
          <circle cx="82" cy="42" r="5" fill="#00f0ff" filter="url(#arcGlow)" />
          <path d="M62 54 Q70 60 78 54" stroke="#00f0ff" strokeWidth="3" fill="none" strokeLinecap="round" />
        </motion.g>
        <line x1="70" y1="24" x2="70" y2="12" stroke="#f59e0b" strokeWidth="3" />
        <circle cx="70" cy="10" r="4" fill="#ffd700" />
      </svg>
    </motion.div>
  );
}

// =========================================================================
// 🛡️ 10. CUTE MINI HULKBUSTER TITAN BOT (Chunky Golden Power Fists)
// =========================================================================
export function CuteHulkbusterBot({ size = 100, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={`cute-hulkbuster-robot ${className}`}
      style={{ width: size, height: size * 1.05, cursor: "pointer", position: "relative", display: "inline-block" }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.2 }}
    >
      <svg viewBox="0 0 160 160" width="100%" height="100%">
        {/* Chunky Heavy Legs */}
        <rect x="44" y="118" width="28" height="28" rx="8" fill="#991b1b" stroke="#f59e0b" strokeWidth="2" />
        <rect x="88" y="118" width="28" height="28" rx="8" fill="#991b1b" stroke="#f59e0b" strokeWidth="2" />

        {/* Massive Heavy Chest Plate */}
        <rect x="36" y="65" width="88" height="60" rx="18" fill="#b91c1c" stroke="#f59e0b" strokeWidth="3" />
        
        {/* Giant Heavy Golden Fists */}
        <motion.circle
          cx="24" cy="98" r="16" fill="#ffd700" stroke="#b45309" strokeWidth="2"
          animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle
          cx="136" cy="98" r="16" fill="#ffd700" stroke="#b45309" strokeWidth="2"
          animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Huge Central Tri-Arc Reactor */}
        <circle cx="80" cy="95" r="15" fill="#0c060a" stroke="#ffd700" strokeWidth="2.5" />
        <circle cx="80" cy="95" r="9" fill="#00f0ff" filter="url(#arcGlow)" />
        <circle cx="80" cy="95" r="4" fill="#ffffff" />

        {/* Heavy Dome Helmet */}
        <rect x="48" y="24" width="64" height="48" rx="20" fill="#7f1d1d" stroke="#ffd700" strokeWidth="2.5" />
        <path d="M56 36 C56 30, 104 30, 104 36 L100 62 C100 66, 60 66, 60 62 Z" fill="#ffd700" />
        
        {/* Powerful Slit Eyes */}
        <rect x="62" y="44" width="12" height="6" rx="2" fill="#00f0ff" filter="url(#arcGlow)" />
        <rect x="86" y="44" width="12" height="6" rx="2" fill="#00f0ff" filter="url(#arcGlow)" />
      </svg>
    </motion.div>
  );
}

// =========================================================================
// 🚀 11. MEGA ROBOTICS SQUAD WORKSHOP SHOWCASE (All 8+ Engineer Types!)
// =========================================================================
export function RoboticsSquadBar() {
  const [activeBot, setActiveBot] = useState<string | null>(null);

  const squad = [
    { id: "iron", name: "Mark-Cute", role: "Flight & Power", component: <CuteIronBot size={75} speech="READY TO FLY! ⚡" /> },
    { id: "dog", name: "Unitree Dog", role: "Terrain SLAM Scout", component: <CuteDogBot size={75} speech="WOOF! ON MISSION! 🐕" /> },
    { id: "coder", name: "AI Coder Bot", role: "Neural Matrix Dev", component: <CuteCoderBot size={75} /> },
    { id: "solder", name: "Hardware Bot", role: "PCB & Soldering", component: <CuteSolderingBot size={75} /> },
    { id: "architect", name: "CAD Architect", role: "Mechanical Blueprint", component: <CuteArchitectBot size={75} /> },
    { id: "rex", name: "Rex Rover", role: "Autonomous LiDAR", component: <CuteRexBot size={75} /> },
    { id: "dume", name: "DUM-E Arm", role: "Welding & Assembly", component: <CuteDumEBot size={75} /> },
    { id: "drone", name: "Sky Drone", role: "Aerial Telemetry", component: <CuteDroneBot size={70} /> },
    { id: "service", name: "Service Unit", role: "Voice & NLP Chat", component: <CuteServiceBot size={70} /> },
    { id: "hulk", name: "Titan Bot", role: "Heavy Load Ops", component: <CuteHulkbusterBot size={75} /> },
  ];

  return (
    <div className="robotics-squad-container glass-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.6rem", flexWrap: "wrap", gap: "0.8rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="logo-reactor" style={{ width: "16px", height: "16px" }} />
          <h3 className="squad-title">
            ⚡ STARK ALL-STAR ROBOTICS SQUAD // 10 ENGINEER UNITS ACTIVE
          </h3>
        </div>
        <span style={{ 
          fontSize: "0.75rem", 
          fontFamily: "var(--font-mono)", 
          color: "var(--arc-cyan)",
          background: "rgba(0, 240, 255, 0.12)",
          padding: "4px 12px",
          borderRadius: "6px",
          border: "1px solid rgba(0, 240, 255, 0.3)"
        }}>
          CLICK ANY ROBOT TO ACTIVATE TALK & WEAPONS
        </span>
      </div>

      <div className="squad-grid">
        {squad.map((bot) => (
          <motion.div
            key={bot.id}
            className="squad-card"
            style={{
              background: activeBot === bot.id ? "rgba(220, 38, 38, 0.35)" : "rgba(18, 8, 14, 0.75)",
              border: `1px solid ${activeBot === bot.id ? "var(--stark-gold)" : "rgba(251, 191, 36, 0.2)"}`,
              borderRadius: "14px",
              padding: "0.9rem 0.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: activeBot === bot.id ? "0 0 22px rgba(220, 38, 38, 0.6)" : "none"
            }}
            whileHover={{ y: -6, borderColor: "var(--arc-cyan)" }}
            onClick={() => setActiveBot(bot.id)}
          >
            {bot.component}
            <div style={{ marginTop: "0.4rem" }}>
              <div style={{ color: "#ffffff", fontWeight: "bold", fontSize: "0.82rem" }}>{bot.name}</div>
              <div style={{ color: "var(--stark-gold-light)", fontSize: "0.68rem", fontFamily: "var(--font-mono)", marginTop: "1px" }}>
                {bot.role}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// 🛸 12. GLOBAL INTERACTIVE FLOATING COMPANION WITH SUMMON BUTTON
// =========================================================================
export function FloatingCompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);

  const tips = [
    "JARVIS: 10 Autonomous Engineer Robots fully active! ⚡",
    "UNITREE DOG: Quadruped locomotion algorithms nominal! 🐶",
    "AI CODER: Next.js and PyTorch neural weights loaded! 💻",
    "DUM-E ARM: Welding calibrations & circuits optimal! 🦾",
    "TITAN BOT: Heavy concurrency loads supported! 🛡️",
    "STARK DRONE: High-altitude real-time telemetry streaming! 🛸",
  ];

  return (
    <div style={{ position: "fixed", bottom: "25px", right: "25px", zIndex: 9999 }}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            background: "rgba(16, 6, 12, 0.96)",
            border: "1px solid var(--stark-gold)",
            borderRadius: "14px",
            padding: "14px 18px",
            color: "#ffffff",
            width: "270px",
            marginBottom: "12px",
            backdropFilter: "blur(18px)",
            boxShadow: "0 10px 35px rgba(0,0,0,0.9), 0 0 20px rgba(0,240,255,0.4)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem"
          }}
        >
          <div style={{ color: "var(--stark-gold)", fontWeight: "bold", marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
            <span>⚡ STARK ROBOT SQUAD</span>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9rem" }}
            >
              ✕
            </button>
          </div>
          <p style={{ color: "var(--arc-cyan)", lineHeight: 1.45 }}>{tips[msgIdx]}</p>
          <button
            onClick={() => setMsgIdx((prev) => (prev + 1) % tips.length)}
            style={{
              marginTop: "10px",
              background: "linear-gradient(135deg, rgba(220, 38, 38, 0.4), rgba(245, 158, 11, 0.4))",
              border: "1px solid var(--stark-gold)",
              color: "#ffffff",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "0.72rem",
              cursor: "pointer",
              width: "100%",
              fontWeight: 600
            }}
          >
            Next Robot Telemetry ❯
          </button>
        </motion.div>
      )}

      <div onClick={() => setIsOpen(!isOpen)} title="Click for Stark Robot Squad Telemetry">
        <CuteIronBot size={80} />
      </div>
    </div>
  );
}
