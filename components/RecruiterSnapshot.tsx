"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Cpu, Globe, TrendingUp, FileText, Copy, Check, MapPin, Mail } from "lucide-react";
import { LinkedinIcon } from "./BrandIcons";
import { profile } from "@/lib/profile";
import { useRealtimeExperience } from "./RealtimeExperience";

const PILLARS = [
  {
    icon: <Bot size={20} />,
    title: "Autonomous Robotics",
    text: "Unitree quadruped locomotion, ROS 2 + LiDAR SLAM navigation for Rex & service robots.",
    accent: "var(--arc-cyan)",
  },
  {
    icon: <Cpu size={20} />,
    title: "Embedded & Edge AI",
    text: "Raspberry Pi / STM32 controllers, MQTT sensor networks, TensorFlow Lite at the edge.",
    accent: "var(--stark-gold)",
  },
  {
    icon: <Globe size={20} />,
    title: "Production Full Stack",
    text: "10+ live commercial platforms shipped with Next.js, TypeScript, Node.js and Docker.",
    accent: "var(--crimson-primary)",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Measured Impact",
    text: "40% lower facility energy use, +25% session engagement, 99.9% uptime across 50+ branches.",
    accent: "#34d399",
  },
];

export default function RecruiterSnapshot() {
  const exp = useRealtimeExperience(profile.careerStart);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="snapshot" className="snapshot-section" aria-labelledby="snapshot-title">
      <div className="container">
        <motion.div
          className="snapshot-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="snapshot-head">
            <div>
              <span className="snapshot-eyebrow">RECRUITER SNAPSHOT // 30-SECOND READ</span>
              <h2 id="snapshot-title" className="snapshot-title">
                One engineer across <span className="heading-gradient-primary">hardware, robots & the web.</span>
              </h2>
            </div>
            <div className="snapshot-status">
              <span className="snapshot-open"><span className="pill-dot" /> Open to opportunities</span>
              <span className="snapshot-meta"><MapPin size={13} /> {profile.location}</span>
              <span className="snapshot-meta">⚡ {exp.totalYearsDecimal.slice(0, 3)}+ yrs experience</span>
            </div>
          </div>

          <div className="snapshot-grid">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                className="snapshot-pillar"
                style={{ "--pillar-accent": p.accent } as React.CSSProperties}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <span className="snapshot-pillar-icon">{p.icon}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="snapshot-actions">
            <a href="/resume" className="btn btn-primary">
              <FileText size={16} /> View / Print Resume
            </a>
            <button type="button" className="btn btn-outline" onClick={copyEmail} aria-live="polite">
              {copied ? <><Check size={16} /> Email Copied</> : <><Copy size={16} /> Copy Email</>}
            </button>
            <a href={`mailto:${profile.email}?subject=${encodeURIComponent("Interview request")}`} className="btn btn-outline">
              <Mail size={16} /> Request Interview
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-cyan">
              <LinkedinIcon size={16} /> LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
