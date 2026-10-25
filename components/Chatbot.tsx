"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  X, Send, Bot, Cpu, Zap, Briefcase, Code2,
  Mail, MapPin, Phone, User, Sparkles,
  Terminal, Globe, Activity, Shield, Heart
} from "lucide-react";
import { CuteIronBot } from "./Robots";
import { think, type Reply } from "@/lib/nirmal-brain";
import { emit, getBrain, useBrain } from "@/lib/botBrain";

// ═══════════════════════════════════════════════════════════════
// NIRMAL'S KNOWLEDGE BASE — All portfolio data for JARVIS
// ═══════════════════════════════════════════════════════════════

const NIRMAL_DATA = {
  name: "Nirmal Saravanan",
  title: "Robotics & Embedded Engineer | Full Stack Developer",
  location: "Chennai, Tamil Nadu, India",
  email: "nirmal.saravanan.dev@gmail.com",
  phone: "+91 8610680721",
  github: "https://github.com/nirmal-ks",
  linkedin: "https://www.linkedin.com/in/nirmal-saravanan-7520a8230/",
  summary:
    "A multidisciplinary engineer operating at the convergence of Robotics, Embedded IoT Systems, and Scalable Web Architectures. With over 4 years of experience, I develop autonomous robotic platforms, smart office automation systems, and high-concurrency cloud applications.",

  skills: [
    {
      category: "Robotics & Autonomous Systems",
      items: ["ROS 2", "SLAM (Cartographer / Nav2)", "LiDAR Fusion", "Computer Vision", "OpenCV", "Unitree Quadruped SDK", "Reinforcement Learning", "Gazebo Simulation", "Path Planning"],
      power: "96%",
    },
    {
      category: "Embedded Systems & Edge IoT",
      items: ["Raspberry Pi", "Arduino", "STM32 Microcontrollers", "MQTT Broker", "Modbus Protocol", "I2C / SPI / UART", "Sensor Fusion", "Motor Controllers", "TensorFlow Lite", "Edge Computing"],
      power: "94%",
    },
    {
      category: "Languages & Frameworks",
      items: ["Python", "C++", "TypeScript", "JavaScript (ES6+)", "Next.js", "React", "Node.js", "FastAPI", "Express", "Angular"],
      power: "98%",
    },
    {
      category: "Backend & AI Architecture",
      items: ["AI Agent Development", "Generative AI APIs", "WebSockets Real-time", "RESTful Architecture", "PostgreSQL", "MySQL", "Redis Caching", "Microservices"],
      power: "92%",
    },
    {
      category: "3D Graphics & HUD Interfaces",
      items: ["Three.js", "WebGL Shaders", "React Three Fiber", "Babylon.js", "3D Product Configurators", "Tailwind CSS", "Framer Motion"],
      power: "90%",
    },
    {
      category: "DevOps, Hardware Lab & Tools",
      items: ["Docker", "Linux (Ubuntu/Debian)", "Git / GitHub Actions", "AWS Cloud Deployments", "Postman", "Oscilloscopes & Logic Analyzers", "Figma", "Agile/Scrum"],
      power: "95%",
    },
  ],

  experience: [
    {
      role: "Full Stack Developer & Robotics / Embedded Engineer",
      company: "Xmedia Solution (Scopex Tech Pvt Ltd)",
      date: "Sept 2025 - Present",
      location: "Chennai, IN",
      highlights: [
        "Programmed Unitree quadruped robot with RL & SDK",
        "Built autonomous navigation with ROS 2 & LiDAR SLAM",
        "Architected Smart Office IoT with Raspberry Pi & MQTT",
        "Deployed 10+ commercial web platforms (Next.js/TS)",
        "Created 3D product configurators with Three.js/WebGL",
      ],
    },
    {
      role: "Operations & Systems Specialist",
      company: "Adani Capital Pvt Ltd",
      date: "Mar 2022 - Sept 2025",
      location: "Chennai, IN",
      highlights: [
        "Directed IT ops across 50+ branches, 99.9% uptime",
        "Automated data pipelines, saving 15+ hrs/week",
        "Managed hardware deployments & server infra",
      ],
    },
    {
      role: "Associate Developer Intern",
      company: "Grovita Technology Pvt Ltd",
      date: "Nov 2021 - Feb 2022",
      location: "Chennai, IN",
      highlights: [
        "Implemented Sequelize ORM & microservice endpoints",
        "Optimized relational schemas & REST API design",
      ],
    },
  ],

  projects: [
    { title: "Unitree Quadruped Dog Robot Control", tech: ["Python", "C++", "Unitree SDK", "PyTorch", "ROS 2"], type: "robotics" },
    { title: "Rex Robot — Autonomous Navigation", tech: ["ROS 2", "Python", "C++", "LiDAR", "OpenCV"], type: "robotics" },
    { title: "AI Service Robot Platform", tech: ["ROS 2", "Python", "TensorFlow", "WebSockets", "FastAPI"], type: "robotics" },
    { title: "Smart Office Automation System", tech: ["Python", "Raspberry Pi", "MQTT", "FastAPI", "STM32"], type: "embedded" },
    { title: "3D Product Configurator Engine", tech: ["Three.js", "WebGL", "React Three Fiber", "TypeScript"], type: "web" },
    { title: "Real-time UPS Hardware Monitor", tech: ["PostgreSQL", "WebSockets", "Node.js", "Express"], type: "embedded" },
    { title: "'Appy Rover | Scalable Travel Engine", tech: ["Next.js", "Node.js", "MySQL", "JWT", "Redis"], type: "web" },
    { title: "Dinamani Live Commercial App", tech: ["Next.js", "TypeScript", "React", "Node.js"], type: "web" },
  ],
};

// ═══════════════════════════════════════════════════════════════
// MESSAGES — replies come from the offline brain in lib/nirmal-brain.ts
// ═══════════════════════════════════════════════════════════════

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text?: string;
  reply?: Reply;
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════
// TYPEWRITER HOOK
// ═══════════════════════════════════════════════════════════════

function useTypewriter(text: string, speed: number = 18, startTyping: boolean = true) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!startTyping) return;
    setDisplayed("");
    setIsDone(false);
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setDisplayed(text.slice(0, idx));
      if (idx >= text.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, startTyping]);

  return { displayed, isDone };
}

// ═══════════════════════════════════════════════════════════════
// ANIMATED BOT RESPONSE SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function TypingIndicator() {
  return (
    <motion.div
      className="chatbot-typing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <span className="chatbot-typing-label">JARVIS ANALYZING</span>
      <div className="chatbot-typing-dots">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="chatbot-reactor-dot"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
          />
        ))}
      </div>
      {/* HUD Scan Line */}
      <div className="chatbot-scan-line" />
    </motion.div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const { displayed, isDone } = useTypewriter(text, 16, true);

  return (
    <span className="chatbot-typewriter">
      {displayed}
      {!isDone && <span className="chatbot-cursor-blink">▌</span>}
    </span>
  );
}

// ── Plain text reply (personal, meta, greetings) ──
function TextResponse({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="chatbot-response-block"
    >
      <TypewriterText text={text} />
    </motion.div>
  );
}

// ── About Response ──
function AboutResponse({ intro }: { intro: string }) {
  const stats = [
    { icon: <Shield size={14} />, label: "Experience", value: "4+ Yrs" },
    { icon: <Bot size={14} />, label: "Specialization", value: "Robotics & AI" },
    { icon: <MapPin size={14} />, label: "Location", value: "Chennai, IN" },
    { icon: <Zap size={14} />, label: "Focus", value: "Full Stack + Embedded" },
  ];

  return (
    <motion.div
      className="chatbot-response-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <TypewriterText text={`${intro} ${NIRMAL_DATA.summary}`} />
      <div className="chatbot-stats-grid">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            className="chatbot-stat-card"
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 1.2 + i * 0.12, type: "spring", stiffness: 200 }}
          >
            <span className="chatbot-stat-icon">{s.icon}</span>
            <div>
              <div className="chatbot-stat-value">{s.value}</div>
              <div className="chatbot-stat-label">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Skills Response ──
function SkillsResponse({ intro }: { intro: string }) {
  return (
    <motion.div
      className="chatbot-response-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <TypewriterText text={intro} />
      <div className="chatbot-skills-container">
        {NIRMAL_DATA.skills.map((group, gi) => (
          <motion.div
            key={gi}
            className="chatbot-skill-group"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + gi * 0.15, type: "spring", stiffness: 180 }}
          >
            <div className="chatbot-skill-header">
              <span className="chatbot-skill-category">{group.category}</span>
              <span className="chatbot-skill-power">{group.power}</span>
            </div>
            <div className="chatbot-power-bar">
              <motion.div
                className="chatbot-power-fill"
                initial={{ width: 0 }}
                animate={{ width: group.power }}
                transition={{ delay: 1.0 + gi * 0.15, duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <div className="chatbot-skill-pills">
              {group.items.map((skill, si) => (
                <motion.span
                  key={si}
                  className="chatbot-skill-pill"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + gi * 0.15 + si * 0.04, type: "spring", stiffness: 250 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Experience Response ──
function ExperienceResponse({ intro }: { intro: string }) {
  return (
    <motion.div
      className="chatbot-response-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <TypewriterText text={intro} />
      <div className="chatbot-exp-container">
        {NIRMAL_DATA.experience.map((exp, i) => (
          <motion.div
            key={i}
            className="chatbot-exp-card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.2, type: "spring", stiffness: 150, damping: 15 }}
          >
            <div className="chatbot-exp-header">
              <Briefcase size={14} className="chatbot-exp-icon" />
              <span className="chatbot-exp-role">{exp.role}</span>
            </div>
            <div className="chatbot-exp-company">{exp.company}</div>
            <div className="chatbot-exp-meta">
              <span className="chatbot-exp-date">{exp.date}</span>
              <span className="chatbot-exp-location">
                <MapPin size={11} /> {exp.location}
              </span>
            </div>
            <ul className="chatbot-exp-highlights">
              {exp.highlights.map((h, hi) => (
                <motion.li
                  key={hi}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.2 + hi * 0.08 }}
                >
                  {h}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Projects Response ──
function ProjectsResponse({ intro }: { intro: string }) {
  const typeColors: Record<string, string> = {
    robotics: "var(--arc-cyan)",
    embedded: "var(--stark-gold)",
    web: "var(--crimson-primary)",
  };

  return (
    <motion.div
      className="chatbot-response-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <TypewriterText text={intro} />
      <div className="chatbot-projects-grid">
        {NIRMAL_DATA.projects.map((proj, i) => (
          <motion.div
            key={i}
            className="chatbot-project-card"
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.1, type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="chatbot-project-type" style={{ color: typeColors[proj.type] || "#fff" }}>
              {proj.type === "robotics" ? <Bot size={12} /> : proj.type === "embedded" ? <Cpu size={12} /> : <Globe size={12} />}
              <span>{proj.type.toUpperCase()}</span>
            </div>
            <div className="chatbot-project-title">{proj.title}</div>
            <div className="chatbot-project-tech">
              {proj.tech.map((t, ti) => (
                <motion.span
                  key={ti}
                  className="chatbot-tech-tag"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + i * 0.1 + ti * 0.05 }}
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Contact Response ──
function ContactResponse({ intro }: { intro: string }) {
  const contacts = [
    { icon: <Mail size={16} />, label: "Email", value: NIRMAL_DATA.email, href: `mailto:${NIRMAL_DATA.email}` },
    { icon: <Phone size={16} />, label: "Phone", value: NIRMAL_DATA.phone, href: `tel:${NIRMAL_DATA.phone.replace(/\s/g, "")}` },
    { icon: <MapPin size={16} />, label: "Location", value: NIRMAL_DATA.location, href: "#" },
  ];

  return (
    <motion.div
      className="chatbot-response-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <TypewriterText text={intro} />
      <div className="chatbot-contact-cards">
        {contacts.map((c, i) => (
          <motion.a
            key={i}
            href={c.href}
            className="chatbot-contact-card"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.0 + i * 0.15, type: "spring", stiffness: 220, damping: 15 }}
            whileHover={{ y: -3, scale: 1.03 }}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noreferrer" : undefined}
          >
            <motion.span
              className="chatbot-contact-icon"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ delay: 1.3 + i * 0.15, duration: 0.5 }}
            >
              {c.icon}
            </motion.span>
            <div>
              <div className="chatbot-contact-label">{c.label}</div>
              <div className="chatbot-contact-value">{c.value}</div>
            </div>
          </motion.a>
        ))}
      </div>
      <motion.div
        className="chatbot-social-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <a href={NIRMAL_DATA.github} target="_blank" rel="noreferrer" className="chatbot-social-btn">
          GitHub ↗
        </a>
        <a href={NIRMAL_DATA.linkedin} target="_blank" rel="noreferrer" className="chatbot-social-btn">
          LinkedIn ↗
        </a>
      </motion.div>
    </motion.div>
  );
}

// Professional topics get their rich card; everything else is text
function BotResponse({ reply }: { reply: Reply }) {
  switch (reply.intent) {
    case "about": return <AboutResponse intro={reply.text} />;
    case "skills": return <SkillsResponse intro={reply.text} />;
    case "experience": return <ExperienceResponse intro={reply.text} />;
    case "projects": return <ProjectsResponse intro={reply.text} />;
    case "contact": return <ContactResponse intro={reply.text} />;
    default: return <TextResponse text={reply.text} />;
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN CHATBOT COMPONENT
// ═══════════════════════════════════════════════════════════════

const QUICK_ACTIONS: { label: string; icon: React.ReactNode; query: string }[] = [
  { label: "About", icon: <User size={13} />, query: "Tell me about Nirmal" },
  { label: "Personal", icon: <Heart size={13} />, query: "Nirmal eppadi patta aalu?" },
  { label: "Skills", icon: <Code2 size={13} />, query: "What are his skills?" },
  { label: "Experience", icon: <Briefcase size={13} />, query: "Show his experience" },
  { label: "Projects", icon: <Terminal size={13} />, query: "What projects has he built?" },
  { label: "Contact", icon: <Mail size={13} />, query: "How to contact him?" },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scan = useBrain((s) => s.scan);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when opened, and let the other bots know
  useEffect(() => {
    if (isOpen) {
      emit({ type: "chat:open" });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const processMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate JARVIS "processing" delay
    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      const { visitorName, scan } = getBrain();
      const reply = think(text, { visitorName, scan });
      if (reply.name) emit({ type: "chat:name", name: reply.name });
      if (!["name", "greeting", "thanks", "bye"].includes(reply.topic)) emit({ type: "chat:asked", topic: reply.topic });
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      setGlowPulse(true);
      setTimeout(() => setGlowPulse(false), 1200);
    }, delay);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    processMessage(input.trim());
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    if (isTyping) return;
    processMessage(action.query);
  };

  return (
    <>
      {/* ═══ Chat Toggle Button ═══ */}
      <motion.div
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Chat with JARVIS AI"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="chatbot-toggle-close"
            >
              <X size={26} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ position: "relative" }}
            >
              <CuteIronBot size={56} />
              {/* Notification pulse */}
              {messages.length === 0 && (
                <motion.span
                  className="chatbot-notif-dot"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ Chat Window ═══ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`chatbot-window ${glowPulse ? "chatbot-glow-pulse" : ""}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* ── Header ── */}
            <div className="chatbot-header">
              <div className="chatbot-header-left">
                <motion.span
                  className="chatbot-reactor"
                  animate={{ scale: [1, 1.2, 1], boxShadow: ["0 0 8px #00f0ff", "0 0 18px #00f0ff", "0 0 8px #00f0ff"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div>
                  <div className="chatbot-header-title">JARVIS AI</div>
                  <div className="chatbot-header-sub">
                    <Activity size={10} className="chatbot-pulse-icon" />
                    Portfolio Intelligence System
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="chatbot-close-btn" aria-label="Close chat">
                <X size={18} />
              </button>
            </div>

            {/* ── Messages ── */}
            <div className="chatbot-messages">
              {/* Welcome message if empty */}
              {messages.length === 0 && (
                <motion.div
                  className="chatbot-welcome"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="chatbot-welcome-reactor"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles size={28} color="#00f0ff" />
                  </motion.div>
                  <div className="chatbot-welcome-text">
                    Welcome, I&apos;m <span style={{ color: "var(--stark-gold)" }}>JARVIS</span> — Nirmal&apos;s AI assistant.
                  </div>
                  <div className="chatbot-welcome-hint">
                    Ask me anything about his work or his personal side, in English or Tanglish!
                  </div>
                  {(scan?.city || scan?.country) && (
                    <div className="chatbot-welcome-hint chatbot-scan-hint">
                      📡 Drone scan: {[scan.company, scan.city, scan.country].filter(Boolean).join(", ")} visitor
                      {scan.source && scan.source !== "Direct" ? ` via ${scan.source}` : ""}
                      {scan.visitCount > 1 ? ` · visit #${scan.visitCount}` : ""}. Welcome! 👋
                    </div>
                  )}
                </motion.div>
              )}

              {/* Message thread */}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`chatbot-msg ${msg.sender === "user" ? "chatbot-msg-user" : "chatbot-msg-bot"}`}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  {msg.sender === "user" ? (
                    <div className="chatbot-msg-bubble-user">
                      <span>{msg.text}</span>
                    </div>
                  ) : (
                    <div className="chatbot-msg-bubble-bot">
                      <BotResponse reply={msg.reply!} />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && <TypingIndicator />}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ── Quick Actions ── */}
            <div className="chatbot-quick-actions">
              {QUICK_ACTIONS.map((action) => (
                <motion.button
                  key={action.label}
                  className="chatbot-quick-btn"
                  onClick={() => handleQuickAction(action)}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isTyping}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </motion.button>
              ))}
            </div>

            {/* ── Input ── */}
            <form className="chatbot-input-bar" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="chatbot-input"
                placeholder="Ask JARVIS anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                id="chatbot-input"
              />
              <motion.button
                type="submit"
                className="chatbot-send-btn"
                disabled={!input.trim() || isTyping}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Send message"
              >
                <Send size={18} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
