"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Mail, MapPin, Phone, Zap, Sparkles, Send, CheckCircle2, 
  AlertCircle, Building2, User, FileText, ExternalLink, 
  RefreshCw, Terminal, ShieldCheck, ArrowRight
} from "lucide-react";
import { CuteIronBot, CuteServiceBot, CuteDroneBot } from "./Robots";

interface ReceiptData {
  transmissionId: string;
  timestamp: string;
  targetEmail: string;
  sender: {
    name: string;
    email: string;
    company: string;
    roleType: string;
  };
  mailtoFallback?: string;
  message?: string;
  delivered?: boolean;
}

const OPPORTUNITY_TYPES = [
  { id: "fulltime", label: "🚀 Full-Time Engineering Role", defaultSubject: "Full-Time Engineering Opportunity" },
  { id: "robotics", label: "🤖 Autonomous Robotics / Embedded", defaultSubject: "Autonomous Robotics Project Inquiry" },
  { id: "consulting", label: "⚡ Architecture & Consulting", defaultSubject: "Technical Consulting & Advisory" },
  { id: "contract", label: "🤝 Contract / Freelance Project", defaultSubject: "Contract Engineering Project" },
  { id: "direct", label: "💬 Recruiter Comms / Interview", defaultSubject: "Direct Recruiter Comms & Interview" },
];

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const terminalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    roleType: OPPORTUNITY_TYPES[0].label,
    subject: OPPORTUNITY_TYPES[0].defaultSubject,
    message: "",
  });
  // Honeypot — real visitors never see or fill this field
  const [website, setWebsite] = useState("");

  const [status, setStatus] = useState<"idle" | "transmitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [botSpeech, setBotSpeech] = useState("AWAITING TRANSMISSION! 📡");

  // Prefill from elsewhere on the page (e.g. "Discuss this project" in a case study)
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const { subject, message } = (e as CustomEvent<{ subject?: string; message?: string }>).detail ?? {};
      setFormData((prev) => ({ ...prev, subject: subject ?? prev.subject, message: message ?? prev.message }));
      setStatus("idle");
      setReceipt(null);
    };
    window.addEventListener("portfolio:prefill-contact", onPrefill);
    return () => window.removeEventListener("portfolio:prefill-contact", onPrefill);
  }, []);

  const handleRoleSelect = (role: typeof OPPORTUNITY_TYPES[0]) => {
    setFormData((prev) => ({
      ...prev,
      roleType: role.label,
      subject: prev.subject === "" || OPPORTUNITY_TYPES.some((o) => o.defaultSubject === prev.subject)
        ? role.defaultSubject
        : prev.subject,
    }));
  };

  const scrollToTerminal = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Form validation
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name or recruiter title.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid work or personal email address.");
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      setErrorMessage("Please include a brief message or job opportunity description.");
      return;
    }

    setStatus("transmitting");
    setBotSpeech("ENCRYPTING UPLINK... ⚡");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, website }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to transmit message. Please try again.");
      }

      setReceipt(data);
      setStatus("success");
      setBotSpeech(data.delivered ? "TRANSMISSION CONFIRMED! 📬" : "ONE MORE STEP — SEND VIA MAIL APP 📨");
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      const errMsg = err instanceof Error ? err.message : "Network error during transmission.";
      setErrorMessage(errMsg);
      setStatus("error");
      setBotSpeech("UPLINK GLITCH! USE DIRECT MAIL ⚠️");
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      company: "",
      roleType: OPPORTUNITY_TYPES[0].label,
      subject: OPPORTUNITY_TYPES[0].defaultSubject,
      message: "",
    });
    setStatus("idle");
    setReceipt(null);
    setErrorMessage("");
    setBotSpeech("READY FOR NEXT TRANSMISSION! 📡");
  };

  const getFallbackMailto = () => {
    const subject = encodeURIComponent(`[PORTFOLIO UPLINK] ${formData.subject || formData.roleType} from ${formData.name || "Employer"}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nCompany: ${formData.company || "N/A"}\nEmail: ${formData.email}\nRole Type: ${formData.roleType}\n\nMessage:\n${formData.message}`
    );
    return `mailto:nirmal.saravanan.dev@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" ref={ref}>
      <div className="container">
        <div className="section-heading-row" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "3rem", flexWrap: "wrap" }}>
          <CuteDroneBot size={55} />
          <h2 className="section-title" style={{ margin: 0, left: 0, transform: "none" }}>
            Comms Uplink // Get In Touch
          </h2>
          <CuteIronBot size={50} speech={botSpeech} />
          <CuteServiceBot size={52} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="contact-wrapper glass-card"
        >
          {/* Comms Header Banner */}
          <div style={{
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            paddingBottom: "1.2rem", 
            borderBottom: "1px solid rgba(251, 191, 36, 0.2)",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "0.6rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="logo-reactor" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--arc-cyan)", letterSpacing: "1px" }}>
                SECURE CHANNEL // DIRECT TRANSMISSION FREQUENCY
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
                color: "var(--stark-gold)",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                padding: "2px 8px",
                borderRadius: "4px"
              }}>
                RECEIVER: nirmal.saravanan.dev@gmail.com
              </span>
            </div>
          </div>

          {/* Quick Contact Info Cards */}
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <Mail size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: "0.4rem", color: "var(--stark-gold-light)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                  EMAIL FREQUENCY
                </div>
                <a href="mailto:nirmal.saravanan.dev@gmail.com" className="text-muted hover:text-primary" style={{ fontSize: "0.95rem" }}>
                  nirmal.saravanan.dev@gmail.com
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Phone size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: "0.4rem", color: "var(--stark-gold-light)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                  DIRECT COMMS
                </div>
                <a href="tel:+918610680721" className="text-muted hover:text-primary" style={{ fontSize: "0.95rem" }}>
                  +91 8610680721
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <MapPin size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: "0.4rem", color: "var(--stark-gold-light)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                  LOCATION BASE
                </div>
                <span className="text-muted" style={{ fontSize: "0.95rem" }}>
                  Chennai, Tamil Nadu, India
                </span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 1.5rem" }}>
            <p style={{ color: "#cbd5e1", marginBottom: "1.2rem", fontSize: "1.05rem" }}>
              Currently open for full-time engineering roles, autonomous robotics projects, embedded hardware consulting, and high-concurrency systems architectures.
            </p>
            <button 
              type="button" 
              onClick={scrollToTerminal} 
              className="btn btn-primary" 
              style={{ padding: "0.85rem 2.2rem", fontSize: "0.95rem" }}
            >
              <Zap size={18} color="#ffd700" /> Transmit Message to Nirmal <ArrowRight size={16} />
            </button>
          </div>

          {/* ═════════════════════════════════════════════════════════
              INTERACTIVE STARK COMMS TRANSMISSION TERMINAL
          ════════════════════════════════════════════════════════════ */}
          <div ref={terminalRef} className="uplink-terminal-card">
            <div className="uplink-header-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Terminal size={18} color="var(--stark-gold)" />
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.95rem", color: "#ffffff", letterSpacing: "1px" }}>
                  DIRECT TRANSMISSION UPLINK
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className={`uplink-status-pill ${status === "transmitting" ? "transmitting" : ""}`}>
                  <span className="logo-reactor" style={{ width: "9px", height: "9px" }} />
                  {status === "idle" && "CHANNEL: ONLINE & READY"}
                  {status === "transmitting" && "TRANSMITTING ENCRYPTED PACKETS..."}
                  {status === "success" && (receipt?.delivered ? "TRANSMISSION DELIVERED" : "READY // SEND VIA MAIL APP")}
                  {status === "error" && "UPLINK ERROR // MAILTO READY"}
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {status === "success" && receipt ? (
                /* ── SUCCESS RECEIPT STATE ── */
                <motion.div
                  key="receipt"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="transmission-receipt"
                >
                  {receipt.delivered ? (
                    <>
                      <div className="receipt-stamp">
                        <CheckCircle2 size={18} color="#10b981" /> TRANSMISSION LOGGED & CONFIRMED
                      </div>
                      <h3 style={{ color: "#ffffff", fontSize: "1.4rem", marginBottom: "0.6rem" }}>
                        Message Received for Nirmal Saravanan!
                      </h3>
                      <p style={{ color: "#94a3b8", fontSize: "0.92rem", maxWidth: "540px", margin: "0 auto" }}>
                        Your transmission payload has been dispatched to <strong style={{ color: "var(--stark-gold)" }}>{receipt.targetEmail}</strong>. Nirmal typically reviews and replies to recruiter inquiries within 24 hours.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="receipt-stamp receipt-stamp-pending">
                        <AlertCircle size={18} /> ONE MORE STEP REQUIRED
                      </div>
                      <h3 style={{ color: "#ffffff", fontSize: "1.4rem", marginBottom: "0.6rem" }}>
                        Your message is ready — send it from your mail app
                      </h3>
                      <p style={{ color: "#94a3b8", fontSize: "0.92rem", maxWidth: "540px", margin: "0 auto" }}>
                        Direct delivery is offline right now. Tap <strong style={{ color: "var(--arc-cyan)" }}>Open in Email App</strong> below — your message is pre-filled for <strong style={{ color: "var(--stark-gold)" }}>{receipt.targetEmail}</strong>.
                      </p>
                    </>
                  )}

                  <div className="receipt-details-box">
                    <div className="receipt-row">
                      <span className="receipt-label">TRANSMISSION ID:</span>
                      <span className="receipt-val">{receipt.transmissionId}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">TIMESTAMP:</span>
                      <span className="receipt-val">{new Date(receipt.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">FROM SENDER:</span>
                      <span className="receipt-val">{receipt.sender.name} ({receipt.sender.company || "Personal"})</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">REPLY-TO:</span>
                      <span className="receipt-val">{receipt.sender.email}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">CATEGORY:</span>
                      <span className="receipt-val">{receipt.sender.roleType}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-label">RECEIVER:</span>
                      <span className="receipt-val">{receipt.targetEmail}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn btn-outline"
                      style={{ padding: "0.75rem 1.6rem", fontSize: "0.88rem" }}
                    >
                      <RefreshCw size={15} /> Send Another Message
                    </button>
                    {receipt.mailtoFallback && (
                      <a
                        href={receipt.mailtoFallback}
                        className={receipt.delivered ? "btn btn-cyan" : "btn btn-primary"}
                        style={{ padding: "0.75rem 1.6rem", fontSize: "0.88rem" }}
                      >
                        <ExternalLink size={15} /> Open in Email App
                      </a>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* ── TRANSMISSION INPUT FORM ── */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                >
                  <input
                    type="text"
                    name="website"
                    className="hp-field"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                  {/* Opportunity Type Preset Chips */}
                  <div className="uplink-roles-container">
                    <span className="uplink-roles-label">
                      ⚡ SELECT INQUIRY / OPPORTUNITY TYPE:
                    </span>
                    <div className="uplink-role-chips">
                      {OPPORTUNITY_TYPES.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => handleRoleSelect(role)}
                          className={`uplink-role-chip ${formData.roleType === role.label ? "active" : ""}`}
                        >
                          {role.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Inputs Grid */}
                  <div className="uplink-form-grid">
                    <div className="uplink-field-group">
                      <label className="uplink-field-label">
                        <User size={13} color="var(--stark-gold)" /> EMPLOYER / RECRUITER NAME *
                      </label>
                      <input
                        type="text"
                        required
                        className="uplink-input"
                        maxLength={120}
                        placeholder="e.g., Sarah Connor — Technical Recruiter"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={status === "transmitting"}
                      />
                    </div>

                    <div className="uplink-field-group">
                      <label className="uplink-field-label">
                        <Building2 size={13} color="var(--stark-gold)" /> COMPANY / ORGANIZATION
                      </label>
                      <input
                        type="text"
                        className="uplink-input"
                        maxLength={120}
                        placeholder="e.g., Tesla, Unitree, Boston Dynamics, Tech Startup"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        disabled={status === "transmitting"}
                      />
                    </div>

                    <div className="uplink-field-group">
                      <label className="uplink-field-label">
                        <Mail size={13} color="var(--stark-gold)" /> YOUR WORK / CONTACT EMAIL *
                      </label>
                      <input
                        type="email"
                        required
                        className="uplink-input"
                        maxLength={120}
                        placeholder="e.g., recruiter@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={status === "transmitting"}
                      />
                    </div>

                    <div className="uplink-field-group">
                      <label className="uplink-field-label">
                        <FileText size={13} color="var(--stark-gold)" /> SUBJECT / POSITION TITLE
                      </label>
                      <input
                        type="text"
                        className="uplink-input"
                        maxLength={120}
                        placeholder="e.g., Full-Time Robotics Engineer Opportunity"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        disabled={status === "transmitting"}
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="uplink-field-group" style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label className="uplink-field-label">
                        <Terminal size={13} color="var(--stark-gold)" /> TRANSMISSION PAYLOAD / MESSAGE *
                      </label>
                      <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "#64748b" }}>
                        {formData.message.length} / 4000
                      </span>
                    </div>
                    <textarea
                      required
                      className="uplink-textarea"
                      maxLength={4000}
                      placeholder="Hi Nirmal, we reviewed your autonomous robotics and engineering portfolio. We would love to discuss an exciting role / project with our team..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      disabled={status === "transmitting"}
                    />
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "0.75rem 1rem",
                      background: "rgba(220, 38, 38, 0.15)",
                      border: "1px solid rgba(220, 38, 38, 0.4)",
                      borderRadius: "8px",
                      color: "#fca5a5",
                      fontSize: "0.85rem",
                      marginBottom: "1rem"
                    }}>
                      <AlertCircle size={16} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="uplink-actions-bar">
                    <div className="uplink-target-note">
                      <ShieldCheck size={14} color="var(--arc-cyan)" />
                      <span>Direct route to: <strong style={{ color: "var(--arc-cyan)" }}>nirmal.saravanan.dev@gmail.com</strong></span>
                    </div>

                    <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
                      {/* One-click Mail Client Fallback */}
                      <a
                        href={getFallbackMailto()}
                        className="btn btn-outline"
                        style={{ fontSize: "0.84rem", padding: "0.75rem 1.2rem" }}
                        title="Open your device's default mail client with this message pre-filled"
                      >
                        <ExternalLink size={14} /> Open in Mail App
                      </a>

                      <button
                        type="submit"
                        disabled={status === "transmitting"}
                        className="uplink-transmit-btn"
                      >
                        {status === "transmitting" ? (
                          <>
                            <RefreshCw size={17} className="animate-spin" /> TRANSMITTING UPLINK...
                          </>
                        ) : (
                          <>
                            <Zap size={17} color="#ffd700" /> TRANSMIT MESSAGE ⚡
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Social Profiles */}
          <div className="social-links">
            <a 
              href="https://github.com/nirmal-ks" 
              target="_blank" 
              rel="noreferrer" 
              className="social-link" 
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/nirmal-saravanan-7520a8230/" 
              target="_blank" 
              rel="noreferrer" 
              className="social-link" 
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
