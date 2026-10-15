"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Bot, Cpu, Zap, Activity, Terminal, ShieldCheck, Sparkles } from "lucide-react";
import { CuteDogBot, CuteDumEBot, CuteIronBot, CuteDroneBot, RoboticsSquadBar } from "./Robots";

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <section id="about" ref={ref}>
      <div className="container">
        <div className="section-heading-row" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
          <h2 className="section-title" style={{ margin: 0, left: 0, transform: "none" }}>
            Engineer Dossier // About
          </h2>
        </div>
        
        <div className="about-grid">
          {/* ── LEFT: Stark Diagnostic Frame with 2nd Photo & Cute Dog Robot Companion ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="about-photo-wrapper"
            >
              {/* HUD Corner Accents */}
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-tr" />
              <div className="hud-corner hud-corner-bl" />
              <div className="hud-corner hud-corner-br" />

              {/* Laser scanning line */}
              <div className="scan-laser" />

              <Image
                src="/casual_clean.jpg"
                alt="Nirmal Saravanan – Hardware & Robotics Lab Engineer"
                width={567}
                height={819}
                quality={100}
                unoptimized
                className="about-photo"
              />

              {/* Biometric / Telemetry HUD Bar */}
              <div className="about-hud-tag">
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Activity size={14} color="#00f0ff" className="animate-pulse" />
                  BIO-ID: NIRMAL SARAVANAN
                </span>
                <span style={{ color: "var(--stark-gold)" }}>ROBOTICS // R&D</span>
              </div>
            </motion.div>

            {/* Cute Quadruped Unitree Dog Bot Underneath Frame */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{
                marginTop: "1.2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(20, 8, 14, 0.75)",
                border: "1px solid rgba(251, 191, 36, 0.3)",
                borderRadius: "14px",
                padding: "0.6rem 1.2rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "var(--stark-gold)", fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: "bold" }}>
                  🐕 UNITREE DOG BOT // ACTIVE
                </span>
                <span style={{ color: "var(--arc-cyan)", fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}>
                  Hover/Click to wag antenna & step!
                </span>
              </div>
              <CuteDogBot size={85} />
            </motion.div>
          </div>

          {/* ── RIGHT: Engineering Narrative, Stats & Cute DUM-E Robot ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="about-text glass-card"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Terminal size={18} color="var(--arc-cyan)" />
                <span style={{ color: "var(--arc-cyan)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", letterSpacing: "1px" }}>
                  CORE ARCHITECTURE & SYSTEMS
                </span>
              </div>

              {/* Cute DUM-E Welding Robot Arm */}
              <div title="DUM-E Stark Arm Assistant">
                <CuteDumEBot size={60} />
              </div>
            </div>

            <h3 className="heading-gradient-primary" style={{ fontSize: "1.9rem", marginBottom: "1.2rem" }}>
              Merging Robotics, Embedded Hardware & High-Performance Software
            </h3>
            
            <p>
              I am a multidisciplinary engineer operating at the convergence of **Robotics, Embedded IoT Systems, and Scalable Web Architectures**. With over 4 years of experience, I develop autonomous robotic platforms, smart office automation systems, and high-concurrency cloud applications.
            </p>
            <p>
              My hardware & robotics repertoire includes programming **Unitree quadruped dog robots** (locomotion gaits & reinforcement learning), architecting navigation and SLAM stacks for **Rex Robot** & service bots with **ROS 2 & LiDAR**, and designing embedded edge-AI controllers with Raspberry Pi, STM32, and TensorFlow Lite.
            </p>
            <p>
              On the software frontier, I build hyper-performant **Next.js/TypeScript** platforms, real-time WebSocket telemetry engines, and high-efficiency API microservices built to withstand massive enterprise concurrency.
            </p>

            {/* Stat Cards with Iron Man Theme */}
            <div className="stats-grid">
              {[
                { number: "4+ Yrs", label: "Engineering Exp", icon: <ShieldCheck size={16} color="#fbbf24" /> },
                { number: "30+", label: "Projects & Bots", icon: <Bot size={16} color="#00f0ff" /> },
                { number: "40%", label: "Throughput Boost", icon: <Zap size={16} color="#ef4444" /> },
                { number: "100%", label: "System Reliability", icon: <Cpu size={16} color="#ffd700" /> },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  className="stat-card"
                  whileHover={{ y: -6, borderColor: "rgba(0, 240, 255, 0.6)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    {stat.icon}
                    <div className="stat-number" style={{ margin: 0 }}>{stat.number}</div>
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 🚀 Active Stark Robotics Squad Fleet Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <RoboticsSquadBar />
        </motion.div>
      </div>
    </section>
  );
}
