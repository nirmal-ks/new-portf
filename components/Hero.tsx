"use client";

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Download, ArrowRight, Bot, Cpu, Zap, Radio, Shield, Camera, Sparkles, X, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CuteIronBot, CuteDroneBot, CuteDogBot, CuteCoderBot, CuteHulkbusterBot } from "./Robots";
import { RealtimeHeroBadge, useRealtimeExperience } from "./RealtimeExperience";

const ROLES = [
  "Robotics & Embedded Engineer",
  "Full Stack Engineer (MK-IV)",
  "Autonomous Systems & ROS 2 Dev",
  "Quadruped & Service Robot Programmer",
  "AI Agent & IoT Architect",
];

const PHOTO_MODES = [
  {
    id: "suit",
    name: "Suit Mk-IV",
    src: "/profile_suit.jpg",
    tag: "ARMOR SUIT ACTIVE // 4-ANGLE MATRIX",
    width: 576,
    height: 1024,
    aspectRatio: "576 / 1024",
    maxWidth: 350,
    resText: "576 × 1024 HD",
    subtext: "Full Dossier: 1 Main Stance + 3 Side Perspectives",
  },
  {
    id: "classic",
    name: "Classic Portrait",
    src: "/real_avatar.jpg",
    tag: "ORIGINAL PROFILE // WORKSTATION",
    width: 685,
    height: 1024,
    aspectRatio: "685 / 1024",
    maxWidth: 360,
    resText: "685 × 1024 HD",
    subtext: "Engineering Workstation // ThinkPad Lab Stance",
  },
  {
    id: "casual",
    name: "Lab Casual",
    src: "/profile_casual.jpg",
    tag: "R&D HARDWARE LAB // 3-ANGLE TRIO",
    width: 1024,
    height: 819,
    aspectRatio: "1024 / 819",
    maxWidth: 430,
    resText: "1024 × 819 HD",
    subtext: "Hardware R&D Lab: 1 Main Stance + 2 Profile Poses",
  },
];

function TypedRole() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = ROLES[roleIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 50);
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % ROLES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIdx]);

  return (
    <span className="typed-role">
      {displayed}
      <span className="cursor-blink">_</span>
    </span>
  );
}

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

function useParticles(count: number): Particle[] {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3.5 + 1.5,
        duration: Math.random() * 5 + 3,
        delay: Math.random() * 3,
      }))
    );
  }, [count]);

  return particles;
}

const TECH_TAGS = [
  "ROS 2",
  "Python",
  "C++",
  "Raspberry Pi",
  "Next.js",
  "Three.js",
  "PyTorch",
  "FastAPI",
  "Unitree SDK",
  "MQTT"
];

export default function Hero() {
  const ringControls = useAnimation();
  const innerRingControls = useAnimation();
  const particles = useParticles(24);
  const [selectedPhoto, setSelectedPhoto] = useState(PHOTO_MODES[0]);
  const [inspectModal, setInspectModal] = useState(false);
  const exp = useRealtimeExperience("2021-11-01");

  useEffect(() => {
    ringControls.start({
      rotate: 360,
      transition: { duration: 25, repeat: Infinity, ease: "linear" },
    });
    innerRingControls.start({
      rotate: -360,
      transition: { duration: 18, repeat: Infinity, ease: "linear" },
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInspectModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ringControls, innerRingControls]);

  useEffect(() => {
    if (!inspectModal) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [inspectModal]);

  return (
    <section className="hero" id="home">
      {/* Iron Man Reactor energy particles */}
      <div className="hero-particles" aria-hidden="true">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container hero-content">
        {/* ── LEFT: Text & Holographic Dossier ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="hero-text"
        >
          {/* Stark HUD System Pill & Cute Assistant Robot */}
          <div className="hero-top-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-greeting-pill"
            >
              <span className="pill-dot" />
              <span>JARVIS SYSTEM // STATUS: OPTIMAL</span>
            </motion.div>

            {/* Cute Mini Floating Iron Man Engineer Bot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              title="Click me!"
            >
              <CuteIronBot size={54} />
            </motion.div>
          </div>

          <motion.p
            className="hero-hello"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Radio size={14} color="#00f0ff" className="animate-pulse" /> PROTOCOL ENGAGED // MEET
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
          >
            <span className="heading-gradient">NIRMAL </span>
            <span className="heading-gradient-primary">SARAVANAN</span>
          </motion.h1>

          <motion.div
            className="hero-role-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}
          >
            <TypedRole />
            <div className="hero-coder-bot" style={{ marginLeft: "auto" }} title="AI Neural Code Bot">
              <CuteCoderBot size={48} />
            </div>
          </motion.div>

          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            Engineering state-of-the-art autonomous robotics, embedded IoT systems, 
            and high-concurrency web platforms. Specializing in Unitree quadruped programming, 
            ROS 2 SLAM navigation, and full-stack software architectures with Stark-grade precision.
          </motion.p>

          {/* Tech stack pills row with Cute Hover Drone */}
          <div style={{ position: "relative" }}>
            <div className="hero-drone" style={{ position: "absolute", top: -26, right: 0, zIndex: 10 }}>
              <CuteDroneBot size={60} />
            </div>
            <motion.div
              className="hero-tech-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {TECH_TAGS.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="tech-pill"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.95 + i * 0.05 }}
                  whileHover={{ y: -3, scale: 1.08 }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25 }}
          >
            <a href="#projects" className="btn btn-primary">
              <Zap size={18} color="#ffd700" /> View Robotics & Work <ArrowRight size={18} />
            </a>
            <a
              href="/resume"
              className="btn btn-outline"
            >
              <Download size={18} /> View / Download Resume
            </a>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Avatar Section with Completely Clear Unobstructed View & Photo Switcher ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="hero-right-column"
        >
          {/* Photo Switcher Selector Bar */}
          <div className="photo-mode-selector">
            <span className="photo-selector-label">
              <Camera size={13} color="var(--stark-gold)" /> VIEW MODE:
            </span>
            <div className="photo-mode-buttons">
              {PHOTO_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedPhoto(mode)}
                  className={`photo-mode-btn ${selectedPhoto.id === mode.id ? "active" : ""}`}
                >
                  {mode.name}
                </button>
              ))}
            </div>
          </div>

          <div
            className="hero-image-container"
            style={{ maxWidth: selectedPhoto.maxWidth }}
          >
            {/* Rotating Arc Reactor Holographic Ring 1 */}
            <motion.div className="hero-ring" animate={ringControls}>
              <div className="ring-dot ring-dot-1" />
              <div className="ring-dot ring-dot-2" />
              <div className="ring-dot ring-dot-3" />
              <div className="ring-dot ring-dot-4" />
            </motion.div>

            {/* Counter-rotating Inner Arc Ring 2 */}
            <motion.div className="hero-ring-inner" animate={innerRingControls} />

            {/* Stark Ambient Reactor Glow Blobs */}
            <div className="hero-glow glow-crimson" aria-hidden="true" />
            <div className="hero-glow glow-gold" aria-hidden="true" />
            <div className="hero-glow glow-arc" aria-hidden="true" />

            {/* Photo Frame Armor Chamber with Clear Visibility - Full Photo Framing */}
            <motion.div
              className="hero-image-wrapper"
              layout
              style={{ aspectRatio: selectedPhoto.aspectRatio }}
              whileHover={{ scale: 1.015 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              onClick={() => setInspectModal(true)}
              title="Click to inspect full photo dossier"
            >
              <div className="image-border-gradient">
                <div className="image-inner">
                  {/* HUD Crosshairs / Bracket overlays */}
                  <div className="hud-corner hud-corner-tl" />
                  <div className="hud-corner hud-corner-tr" />
                  <div className="hud-corner hud-corner-bl" />
                  <div className="hud-corner hud-corner-br" />

                  {/* Active Hologram Mode Header Bar */}
                  <div className="hud-photo-tag">
                    <span className="pill-dot" style={{ width: "6px", height: "6px" }} />
                    <span>{selectedPhoto.tag}</span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedPhoto.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.35 }}
                      style={{ width: "100%", height: "100%", position: "relative" }}
                    >
                      <Image
                        src={selectedPhoto.src}
                        alt="Nirmal Saravanan – Robotics & Embedded Systems Engineer"
                        width={selectedPhoto.width}
                        height={selectedPhoto.height}
                        priority
                        quality={100}
                        unoptimized
                        className="avatar-photo theme-graded-photo"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Click to inspect HUD cue */}
                  <div className="hud-expand-hint">
                    <Maximize2 size={10} color="var(--stark-gold)" />
                    <span>FULL FRAME</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── DEDICATED TELEMETRY HUD DECK (Neatly positioned underneath/flanking, 0% Overlap on Face) ── */}
          <div className="hero-telemetry-deck">
            {/* HUD Stat 1: Live Real-time Calculated Experience */}
            <motion.div
              className="telemetry-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ y: -3, borderColor: "var(--arc-cyan)" }}
              title={`Exact Real-Time Experience: ${exp.years} Years, ${exp.months} Months, ${exp.days} Days`}
            >
              <div className="badge-icon" style={{ position: "relative" }}>
                <Shield size={16} />
                <span className="live-pulsing-dot" />
              </div>
              <div className="telemetry-info">
                <div className="badge-value" style={{ color: "var(--arc-cyan)" }}>
                  {exp.totalYearsDecimal} Yrs
                </div>
                <div className="badge-label" style={{ color: "var(--stark-gold)" }}>
                  Real-time Exp ⚡
                </div>
              </div>
            </motion.div>

            {/* HUD Stat 2 */}
            <motion.div
              className="telemetry-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ y: -3, borderColor: "var(--arc-cyan)" }}
            >
              <div className="badge-icon badge-icon-cyan">
                <Bot size={16} />
              </div>
              <div className="telemetry-info">
                <div className="badge-value">Robotics</div>
                <div className="badge-label">ROS 2 & AI</div>
              </div>
            </motion.div>

            {/* HUD Stat 3 */}
            <motion.div
              className="telemetry-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              whileHover={{ y: -3, borderColor: "var(--stark-gold)" }}
            >
              <div className="badge-icon badge-icon-gold">
                <Cpu size={16} />
              </div>
              <div className="telemetry-info">
                <div className="badge-value">30+</div>
                <div className="badge-label">Deployments</div>
              </div>
            </motion.div>

            {/* HUD Stat 4 */}
            <motion.div
              className="telemetry-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              whileHover={{ y: -3, borderColor: "var(--stark-gold)" }}
            >
              <div className="badge-icon badge-icon-amber">
                <Zap size={16} />
              </div>
              <div className="telemetry-info">
                <div className="badge-value">Full Stack</div>
                <div className="badge-label">Embedded + Web</div>
              </div>
            </motion.div>
          </div>

          {/* Real-time Live Chronometer Ticker Badge */}
          <div className="hero-realtime-wrap"><RealtimeHeroBadge /></div>

          {/* Mini Cute Squad Guard Banner */}
          <div className="hero-squad-banner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0.4rem 0.8rem", background: "rgba(18, 6, 12, 0.6)", borderRadius: "10px", border: "1px solid rgba(251, 191, 36, 0.15)" }}>
            <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--stark-gold)" }}>
              🤖 ARMOR & POWER LAB // PATROL FLEET
            </span>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <CuteHulkbusterBot size={44} />
              <CuteDogBot size={44} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom scroll cue */}
      <motion.div
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <motion.div
          className="scroll-dot"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      </motion.div>

      {/* ── FULL PHOTO DOSSIER LIGHTBOX MODAL (100% Crisp Full Unclipped Inspection) ── */}
      <AnimatePresence>
        {inspectModal && (
          <motion.div
            className="photo-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setInspectModal(false)}
          >
            <motion.div
              className="photo-lightbox-panel"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="lightbox-header">
                <div className="lightbox-title-block">
                  <div className="lightbox-tag">
                    <span className="pill-dot" style={{ width: 6, height: 6 }} />
                    <span>JARVIS DOSSIER // FULL FRAME INSPECTOR</span>
                  </div>
                  <h3 className="lightbox-title">{selectedPhoto.name}</h3>
                  <p className="lightbox-subtext">{selectedPhoto.subtext}</p>
                </div>

                <div className="lightbox-header-actions">
                  <span className="lightbox-res-badge">{selectedPhoto.resText}</span>
                  <button
                    className="lightbox-close-btn"
                    onClick={() => setInspectModal(false)}
                    aria-label="Close dossier view"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Mode Switcher Inside Modal */}
              <div className="lightbox-modes">
                {PHOTO_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedPhoto(mode)}
                    className={`lightbox-mode-btn ${selectedPhoto.id === mode.id ? "active" : ""}`}
                  >
                    {mode.name}
                  </button>
                ))}
              </div>

              {/* Image Frame Chassis */}
              <div className="lightbox-image-chassis">
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-tr" />
                <div className="hud-corner hud-corner-bl" />
                <div className="hud-corner hud-corner-br" />

                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.name}
                  width={selectedPhoto.width}
                  height={selectedPhoto.height}
                  priority
                  quality={100}
                  unoptimized
                  className="lightbox-photo"
                />
              </div>

              {/* Modal Footer */}
              <div className="lightbox-footer">
                <span className="lightbox-status-text">
                  <Sparkles size={13} color="var(--arc-cyan)" /> 100% UNCLIPPED DOSSIER FRAME // FULL RESOLUTION
                </span>
                <a
                  href={selectedPhoto.src}
                  download
                  className="lightbox-download-btn"
                >
                  <Download size={14} /> Download High-Res
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
