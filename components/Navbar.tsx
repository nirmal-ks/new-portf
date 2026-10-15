"use client";

import { useState, useEffect } from "react";
import { Menu, X, Zap, Command, FileText } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { CuteIronBot } from "./Robots";
import { NAV_SECTIONS } from "@/lib/profile";
import { openCommandPalette } from "./CommandPalette";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Highlight the section currently crossing the middle of the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["home", ...NAV_SECTIONS.map((s) => s.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Mobile drawer: lock background scroll, close on Escape / resize to desktop
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    const onResize = () => window.innerWidth > 1024 && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} aria-label="Primary">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />

      <div className="container nav-content">
        <Link href="/" className="logo" aria-label="Nirmal Saravanan — home">
          <span className="logo-bot"><CuteIronBot size={34} /></span>
          <span className="logo-reactor" />
          <span className="heading-gradient" style={{ letterSpacing: "1.5px" }}>NIRMAL</span>
          <span style={{ color: "var(--crimson-primary)", fontWeight: 900 }}>.MK</span>
          <span className="logo-badge">IV</span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-desktop">
          {NAV_SECTIONS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav-link ${activeId === link.id ? "active" : ""}`}
              aria-current={activeId === link.id ? "true" : undefined}
              onClick={(e) => handleLinkClick(e, `#${link.id}`)}
            >
              {link.name}
            </a>
          ))}
          <button className="cmdk-trigger" onClick={openCommandPalette} aria-label="Open command palette">
            <Command size={13} /> K
          </button>
          <a
            href="#contact"
            className="btn btn-primary nav-cta"
            onClick={(e) => handleLinkClick(e, "#contact")}
          >
            <Zap size={14} color="#ffd700" /> Hire Me
          </a>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="nav-mobile-actions">
          <button className="cmdk-trigger" onClick={openCommandPalette} aria-label="Open command palette">
            <Command size={14} />
          </button>
          <button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-drawer"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="mobile-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              id="mobile-drawer"
              className="mobile-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button className="mobile-drawer-close" onClick={() => setIsOpen(false)} aria-label="Close menu">
                <X size={26} />
              </button>

              <div className="mobile-drawer-status">
                <span className="logo-reactor" />
                <span>STARK HUD // ONLINE</span>
              </div>

              {NAV_SECTIONS.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`nav-link mobile-drawer-link ${activeId === link.id ? "active" : ""}`}
                  onClick={(e) => handleLinkClick(e, `#${link.id}`)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <span className="mobile-drawer-index">0{i + 1}</span> {link.name}
                </motion.a>
              ))}

              <div className="mobile-drawer-ctas">
                <a href="#contact" className="btn btn-primary" onClick={(e) => handleLinkClick(e, "#contact")}>
                  <Zap size={15} color="#ffd700" /> Hire Me
                </a>
                <a href="/resume" className="btn btn-outline">
                  <FileText size={15} /> Resume
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
