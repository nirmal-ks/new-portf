"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code2, Monitor, Database, Wrench, Cpu, Bot, Activity, Sparkles } from "lucide-react";
import { CuteIronBot, CuteDogBot, CuteCoderBot, CuteSolderingBot, CuteArchitectBot, CuteRexBot, CuteDroneBot, CuteHulkbusterBot } from "./Robots";

const skillsData = [
  {
    category: "Robotics & Autonomous Systems",
    icon: <Bot size={22} />,
    robot: <CuteDogBot size={55} speech="SLAM & MOTORS! 🐶" />,
    power: "96%",
    color: "var(--arc-cyan)",
    items: ["ROS 2", "SLAM (Cartographer / Nav2)", "LiDAR Fusion", "Computer Vision", "OpenCV", "Unitree Quadruped SDK", "Reinforcement Learning", "Gazebo Simulation", "Path Planning"],
  },
  {
    category: "Embedded Systems & Edge IoT",
    icon: <Cpu size={22} />,
    robot: <CuteSolderingBot size={55} />,
    power: "94%",
    color: "var(--stark-gold)",
    items: ["Raspberry Pi", "Arduino", "STM32 Microcontrollers", "MQTT Broker", "Modbus Protocol", "I2C / SPI / UART", "Sensor Fusion", "Motor Controllers", "TensorFlow Lite", "Edge Computing"],
  },
  {
    category: "Languages & Frameworks",
    icon: <Code2 size={22} />,
    robot: <CuteCoderBot size={55} />,
    power: "98%",
    color: "var(--crimson-primary)",
    items: ["Python", "C++", "TypeScript", "JavaScript (ES6+)", "Next.js", "React", "Node.js", "FastAPI", "Express", "Angular"],
  },
  {
    category: "Backend & AI Architecture",
    icon: <Database size={22} />,
    robot: <CuteRexBot size={55} />,
    power: "92%",
    color: "var(--arc-cyan)",
    items: ["AI Agent Development", "Generative AI APIs", "WebSockets Real-time", "RESTful Architecture", "PostgreSQL", "MySQL", "Redis Caching", "Microservices"],
  },
  {
    category: "3D Graphics & HUD Interfaces",
    icon: <Monitor size={22} />,
    robot: <CuteDroneBot size={55} />,
    power: "90%",
    color: "var(--stark-gold)",
    items: ["Three.js", "WebGL Shaders", "React Three Fiber", "Babylon.js", "3D Product Configurators", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "DevOps, Hardware Lab & Tools",
    icon: <Wrench size={22} />,
    robot: <CuteArchitectBot size={55} />,
    power: "95%",
    color: "var(--crimson-primary)",
    items: ["Docker", "Linux (Ubuntu/Debian)", "Git / GitHub Actions", "AWS Cloud Deployments", "Postman", "Oscilloscopes & Logic Analyzers", "Figma", "Agile/Scrum"],
  },
];

export default function Skills() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="skills" ref={ref}>
      <div className="container">
        <div className="section-heading-row" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "3.5rem", flexWrap: "wrap" }}>
          <CuteSolderingBot size={52} />
          <h2 className="section-title" style={{ margin: 0, left: 0, transform: "none" }}>
            Technical Expertise // Subsystems
          </h2>
          <CuteArchitectBot size={52} />
          <CuteHulkbusterBot size={52} />
        </div>
        
        <div className="skills-grid">
          {skillsData.map((skillGroup, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card skill-category"
            >
              {/* Top Subsystem Status Header & Skill Category Robot Specialist */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                <h3 style={{ margin: 0, border: "none", padding: 0 }}>
                  <span style={{ color: skillGroup.color }}>{skillGroup.icon}</span>
                  <span>{skillGroup.category}</span>
                </h3>
                
                {/* Cute Mini Robot Mascot for this Skill */}
                <div title={`Specialist for ${skillGroup.category}`}>
                  {skillGroup.robot}
                </div>
              </div>

              {/* Power / Calibration bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  CALIBRATION POWER:
                </span>
                <span style={{ 
                  fontSize: "0.75rem", 
                  fontFamily: "var(--font-mono)", 
                  color: "var(--arc-cyan)",
                  fontWeight: "bold"
                }}>
                  {skillGroup.power}
                </span>
              </div>
              <div style={{ 
                width: "100%", 
                height: "4px", 
                background: "rgba(255,255,255,0.08)", 
                borderRadius: "2px", 
                marginBottom: "1.2rem",
                overflow: "hidden" 
              }}>
                <div style={{ 
                  width: skillGroup.power, 
                  height: "100%", 
                  background: `linear-gradient(90deg, ${skillGroup.color}, #ffd700)`, 
                  boxShadow: `0 0 8px ${skillGroup.color}` 
                }} />
              </div>

              <div className="skill-list">
                {skillGroup.items.map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
