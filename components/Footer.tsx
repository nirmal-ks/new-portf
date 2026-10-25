"use client";

import { ArrowUp, Mail, FileText } from "lucide-react";
import { profile, NAV_SECTIONS } from "@/lib/profile";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="logo-reactor" style={{ width: "12px", height: "12px" }} />
            <strong className="heading-gradient">{profile.name.toUpperCase()}</strong>
          </div>
          <p>{profile.title}. Based in {profile.location}, open to full-time and contract roles.</p>
          <div className="footer-socials">
            <a href={profile.github} target="_blank" rel="noreferrer" className="social-link" aria-label="GitHub"><GithubIcon size={18} /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn"><LinkedinIcon size={18} /></a>
            <a href={`mailto:${profile.email}`} className="social-link" aria-label="Email"><Mail size={18} /></a>
            <a href="/resume" className="social-link" aria-label="Resume"><FileText size={18} /></a>
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer">
          <span className="footer-heading">Navigate</span>
          {NAV_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>{s.name}</a>
          ))}
        </nav>

        <div className="footer-links">
          <span className="footer-heading">Reach Out</span>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.phoneHref}>{profile.phone}</a>
          <span className="footer-hint">Tip: press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> to jump anywhere</span>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {profile.name} · Built with Next.js, TypeScript & Framer Motion
          <span className="footer-privacy">
            🛸 Privacy: this site logs approximate city, network, device and referrer for visit stats. No names, emails or cookies for ads.
          </span>
        </span>
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
          <ArrowUp size={16} /> Top
        </button>
      </div>
    </footer>
  );
}
