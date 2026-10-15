"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { CuteIronBot, CuteDogBot, CuteDumEBot, CuteRexBot } from "./Robots";
import { RealtimeExperienceDashboard } from "./RealtimeExperience";
import { experiences } from "@/lib/profile";

// Robot mascot per timeline entry (same order as `experiences`)
const ROBOTS = [
  <CuteDogBot key="dog" size={65} speech="XMEDIA ROBOTICS LAB! 🤖" />,
  <CuteDumEBot key="dume" size={60} />,
  <CuteIronBot key="iron" size={55} speech="INTERN CODE LAB! 💻" />,
];

export default function Experience() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="experience" ref={ref}>
      <div className="container">
        <div className="section-heading-row" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          <CuteRexBot size={55} />
          <h2 className="section-title" style={{ margin: 0, left: 0, transform: "none" }}>
            Engineering Logs // Career Timeline
          </h2>
          <CuteIronBot size={48} />
        </div>
        
        {/* ⚡ Stark Real-time Experience Matrix Clock */}
        <RealtimeExperienceDashboard />

        <div className="timeline">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="timeline-item"
            >
              <div className="timeline-dot" />
              <div className="timeline-content glass-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.8rem" }}>
                  <div>
                    <h3>{exp.role}</h3>
                    <div className="timeline-subtitle" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Briefcase size={15} color="var(--stark-gold)" />
                      {exp.company}
                    </div>
                  </div>

                  {/* Cute Milestone Robot Inspector */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <span style={{
                      fontSize: "0.75rem",
                      fontFamily: "var(--font-mono)",
                      color: "var(--arc-cyan)",
                      background: "rgba(0, 240, 255, 0.1)",
                      border: "1px solid rgba(0, 240, 255, 0.3)",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      textTransform: "uppercase"
                    }}>
                      {exp.type}
                    </span>
                    <span className="timeline-robot">{ROBOTS[index]}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1.2rem", margin: "0.8rem 0 1.2rem", flexWrap: "wrap" }}>
                  <span className="timeline-date" style={{ margin: 0, display: "flex", alignItems: "center", gap: "5px" }}>
                    <Calendar size={13} /> {exp.date}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "5px", fontFamily: "var(--font-mono)" }}>
                    <MapPin size={13} color="var(--crimson-primary)" /> {exp.location}
                  </span>
                </div>

                <ul>
                  {exp.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
