"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CornerDownLeft, User, Briefcase, FolderGit2, Cpu, Mail, FileText,
  Copy, Phone, Link2, ArrowUp, Home,
} from "lucide-react";
import { profile, projects } from "@/lib/profile";

const OPEN_EVENT = "portfolio:open-command-palette";

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

type Action = {
  id: string;
  label: string;
  group: string;
  icon: React.ReactNode;
  keywords?: string;
  run: () => void | Promise<void>;
};

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function buildActions(notify: (msg: string) => void): Action[] {
  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(`${label} copied to clipboard`);
    } catch {
      notify("Clipboard unavailable — " + text);
    }
  };
  return [
    { id: "home", label: "Go to Top", group: "Navigate", icon: <Home size={16} />, run: () => scrollTo("home") },
    { id: "about", label: "About Nirmal", group: "Navigate", icon: <User size={16} />, keywords: "bio profile", run: () => scrollTo("about") },
    { id: "experience", label: "Experience & Career Timeline", group: "Navigate", icon: <Briefcase size={16} />, keywords: "work job history", run: () => scrollTo("experience") },
    { id: "projects", label: "Projects", group: "Navigate", icon: <FolderGit2 size={16} />, keywords: "work portfolio robots", run: () => scrollTo("projects") },
    { id: "skills", label: "Technical Expertise", group: "Navigate", icon: <Cpu size={16} />, keywords: "skills stack tech", run: () => scrollTo("skills") },
    { id: "contact", label: "Contact / Hire", group: "Navigate", icon: <Mail size={16} />, keywords: "message hire email", run: () => scrollTo("contact") },
    { id: "resume", label: "Open Printable Resume", group: "Actions", icon: <FileText size={16} />, keywords: "cv pdf download", run: () => { window.location.href = "/resume"; } },
    { id: "copy-email", label: `Copy Email — ${profile.email}`, group: "Actions", icon: <Copy size={16} />, keywords: "mail", run: () => copy(profile.email, "Email") },
    { id: "call", label: `Call ${profile.phone}`, group: "Actions", icon: <Phone size={16} />, keywords: "phone", run: () => { window.location.href = profile.phoneHref; } },
    { id: "linkedin", label: "Open LinkedIn", group: "Links", icon: <Link2 size={16} />, run: () => { window.open(profile.linkedin, "_blank", "noopener"); } },
    { id: "github", label: "Open GitHub", group: "Links", icon: <Link2 size={16} />, keywords: "code repo", run: () => { window.open(profile.github, "_blank", "noopener"); } },
    ...projects.map<Action>((p) => ({
      id: `project-${p.id}`,
      label: p.title,
      group: "Projects",
      icon: <FolderGit2 size={16} />,
      keywords: p.tech.join(" ") + " " + p.category,
      run: () => scrollTo("projects"),
    })),
  ];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  const actions = useMemo(() => buildActions(setToast), []);

  // Global shortcut + programmatic open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="cmdk-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <PalettePanel actions={actions} onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="cmdk-toast"
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Mounted only while open, so query / selection reset on every open
function PalettePanel({ actions, onClose }: { actions: Action[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => `${a.label} ${a.group} ${a.keywords ?? ""}`.toLowerCase().includes(q));
  }, [actions, query]);

  // Keep highlighted row in view
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const runAction = (action: Action | undefined) => {
    if (!action) return;
    onClose();
    action.run();
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAction(filtered[index]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <motion.div
      className="cmdk-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      initial={{ opacity: 0, y: -16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="cmdk-search">
        <Search size={17} />
        <input
          autoFocus
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
          onKeyDown={onInputKey}
          placeholder="Search sections, projects, actions…"
          aria-label="Search commands"
          role="combobox"
          aria-expanded="true"
          aria-controls="cmdk-list"
          aria-activedescendant={filtered[index] ? `cmdk-${filtered[index].id}` : undefined}
        />
        <kbd>ESC</kbd>
      </div>

      <div className="cmdk-list" id="cmdk-list" role="listbox" ref={listRef}>
        {filtered.length === 0 && <div className="cmdk-empty">No results for “{query}”</div>}
        {filtered.map((a, i) => (
          <div key={a.id}>
            {a.group !== filtered[i - 1]?.group && <div className="cmdk-group">{a.group}</div>}
            <button
              id={`cmdk-${a.id}`}
              data-idx={i}
              role="option"
              aria-selected={i === index}
              className={`cmdk-item ${i === index ? "active" : ""}`}
              onMouseMove={() => setIndex(i)}
              onClick={() => runAction(a)}
            >
              <span className="cmdk-item-icon">{a.icon}</span>
              <span className="cmdk-item-label">{a.label}</span>
              {i === index && <CornerDownLeft size={14} className="cmdk-enter" />}
            </button>
          </div>
        ))}
      </div>

      <div className="cmdk-footer">
        <span><kbd><ArrowUp size={10} /></kbd><kbd style={{ transform: "rotate(180deg)" }}><ArrowUp size={10} /></kbd> navigate</span>
        <span><kbd>↵</kbd> select</span>
        <span><kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> toggle</span>
      </div>
    </motion.div>
  );
}
