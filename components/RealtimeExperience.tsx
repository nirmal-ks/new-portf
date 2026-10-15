"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, Shield, Award, Calendar, Zap, Sparkles } from "lucide-react";

export interface ExperienceTime {
  totalYearsDecimal: string;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
}

export function useRealtimeExperience(startDate: string = "2021-11-01"): ExperienceTime {
  const [exp, setExp] = useState<ExperienceTime>({
    totalYearsDecimal: "4.8",
    years: 4,
    months: 9,
    days: 21,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 1750,
    totalHours: 42000,
  });

  useEffect(() => {
    const calculate = () => {
      const start = new Date(startDate);
      const now = new Date();

      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();
      let hours = now.getHours() - start.getHours();
      let minutes = now.getMinutes() - start.getMinutes();
      let seconds = now.getSeconds() - start.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes -= 1;
      }
      if (minutes < 0) {
        minutes += 60;
        hours -= 1;
      }
      if (hours < 0) {
        hours += 24;
        days -= 1;
      }
      if (days < 0) {
        const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonthDays;
        months -= 1;
      }
      if (months < 0) {
        months += 12;
        years -= 1;
      }

      const diffMs = now.getTime() - start.getTime();
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      const totalYearsDecimal = (diffMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(3);

      setExp({
        totalYearsDecimal,
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        totalDays,
        totalHours,
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return exp;
}

// ⚡ 1. LIVE HERO TELEMETRY TICKER BADGE
export function RealtimeHeroBadge() {
  const exp = useRealtimeExperience("2021-11-01");

  return (
    <div className="realtime-hero-telemetry">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--stark-gold)", fontFamily: "var(--font-mono)", fontSize: "0.74rem", fontWeight: "bold" }}>
          <span className="pill-dot" style={{ width: "6px", height: "6px" }} />
          REAL-TIME CAREER TELEMETRY
        </span>
        <span style={{ color: "var(--arc-cyan)", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
          LIVE // ACTIVE
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", textAlign: "center" }}>
        <div className="ticker-box">
          <div className="ticker-val">{exp.years}</div>
          <div className="ticker-lbl">Years</div>
        </div>
        <div className="ticker-box">
          <div className="ticker-val">{exp.months}</div>
          <div className="ticker-lbl">Months</div>
        </div>
        <div className="ticker-box">
          <div className="ticker-val">{exp.days}</div>
          <div className="ticker-lbl">Days</div>
        </div>
        <div className="ticker-box live-sec">
          <div className="ticker-val" style={{ color: "var(--arc-cyan)" }}>
            {String(exp.seconds).padStart(2, "0")}s
          </div>
          <div className="ticker-lbl">Secs</div>
        </div>
      </div>
    </div>
  );
}

// ⚡ 2. LIVE STARK TELEMETRY DASHBOARD (For Experience Section)
export function RealtimeExperienceDashboard() {
  const exp = useRealtimeExperience("2021-11-01");

  return (
    <motion.div
      className="experience-telemetry-dashboard glass-card"
      style={{
        margin: "0 0 3.5rem 0",
        padding: "1.8rem",
        border: "1px solid var(--stark-gold)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(220,38,38,0.25)",
        background: "linear-gradient(135deg, rgba(30, 10, 18, 0.9) 0%, rgba(12, 5, 9, 0.95) 100%)",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Dashboard Top Status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(251, 191, 36, 0.2)", paddingBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="logo-reactor" style={{ width: "18px", height: "18px" }} />
          <div>
            <h3 style={{ margin: 0, fontSize: "1.3rem", color: "var(--stark-gold-bright)" }}>
              STARK TIME-MATRIX // LIVE CAREER EXPERIENCE CLOCK
            </h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              ACCUMULATED FIELD ENGINEERING METRICS SINCE NOV 2021
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0, 240, 255, 0.1)", border: "1px solid rgba(0, 240, 255, 0.35)", padding: "4px 12px", borderRadius: "8px" }}>
          <Activity size={15} color="#00f0ff" className="animate-pulse" />
          <span style={{ color: "var(--arc-cyan)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: "bold" }}>
            EXACT EXP: {exp.totalYearsDecimal} YEARS ACTIVE
          </span>
        </div>
      </div>

      {/* Live Chronometer Clock Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="clock-card">
          <div className="clock-number">{exp.years}</div>
          <div className="clock-label">YEARS</div>
          <div className="clock-bar" style={{ width: "100%" }} />
        </div>
        <div className="clock-card">
          <div className="clock-number">{exp.months}</div>
          <div className="clock-label">MONTHS</div>
          <div className="clock-bar" style={{ width: `${(exp.months / 12) * 100}%` }} />
        </div>
        <div className="clock-card">
          <div className="clock-number">{exp.days}</div>
          <div className="clock-label">DAYS</div>
          <div className="clock-bar" style={{ width: `${(exp.days / 31) * 100}%` }} />
        </div>
        <div className="clock-card">
          <div className="clock-number">{String(exp.hours).padStart(2, "0")}</div>
          <div className="clock-label">HOURS</div>
          <div className="clock-bar" style={{ width: `${(exp.hours / 24) * 100}%` }} />
        </div>
        <div className="clock-card">
          <div className="clock-number">{String(exp.minutes).padStart(2, "0")}</div>
          <div className="clock-label">MINUTES</div>
          <div className="clock-bar" style={{ width: `${(exp.minutes / 60) * 100}%` }} />
        </div>
        <div className="clock-card clock-card-seconds">
          <div className="clock-number" style={{ color: "var(--arc-cyan)" }}>
            {String(exp.seconds).padStart(2, "0")}
          </div>
          <div className="clock-label" style={{ color: "var(--arc-cyan)" }}>
            LIVE SECONDS ⚡
          </div>
          <div className="clock-bar" style={{ width: `${(exp.seconds / 60) * 100}%`, background: "var(--arc-cyan)" }} />
        </div>
      </div>

      {/* Live Milestone Progress Trackers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.2rem" }}>
        {/* Role 1: XMedia Solution */}
        <div className="telemetry-milestone-box active-milestone">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
            <span style={{ fontWeight: "bold", fontSize: "0.85rem", color: "#ffffff" }}>
              Xmedia Solution // Robotics & Full Stack
            </span>
            <span className="live-tag">ACTIVE ROLE</span>
          </div>
          <div style={{ color: "var(--stark-gold)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", marginBottom: "6px" }}>
            Sept 2025 – Present (Real-time Active Deployment)
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill pulse-bar" style={{ width: "100%" }} />
          </div>
        </div>

        {/* Role 2: Adani Capital */}
        <div className="telemetry-milestone-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
            <span style={{ fontWeight: "bold", fontSize: "0.85rem", color: "#ffffff" }}>
              Adani Capital // Operations Specialist
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>3 Yrs 6 Mos</span>
          </div>
          <div style={{ color: "var(--stark-gold-light)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", marginBottom: "6px" }}>
            Mar 2022 – Sept 2025 (42 Months Completed)
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: "100%", background: "var(--stark-gold)" }} />
          </div>
        </div>

        {/* Role 3: Grovita Internship */}
        <div className="telemetry-milestone-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
            <span style={{ fontWeight: "bold", fontSize: "0.85rem", color: "#ffffff" }}>
              Grovita Technology // Backend Intern
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>4 Months</span>
          </div>
          <div style={{ color: "var(--stark-gold-light)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", marginBottom: "6px" }}>
            Nov 2021 – Feb 2022 (Core Backend Lab)
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: "100%", background: "var(--crimson-primary)" }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
