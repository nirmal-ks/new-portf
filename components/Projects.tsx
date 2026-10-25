"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowUpRight, CheckCircle2, X, Layers, MessageSquare } from "lucide-react";
import { CuteIronBot, CuteDogBot, CuteRexBot, CuteServiceBot, CuteDumEBot, CuteDroneBot, CuteCoderBot, CuteArchitectBot, CuteSolderingBot } from "./Robots";
import { GithubIcon } from "./BrandIcons";
import { projects, profile, PROJECT_FILTERS, type Project, type ProjectCategory } from "@/lib/profile";

// Robot mascot per project id
const ROBOTS: Record<string, React.ReactNode> = {
  "ai-interview": <CuteArchitectBot size={58} />,
  "ai-code-conversion": <CuteCoderBot size={58} />,
  "ai-cork": <CuteServiceBot size={58} />,
  "kicad-pcb-ai": <CuteSolderingBot size={58} />,
  "mqtt-recorder": <CuteDumEBot size={58} />,
  unitree: <CuteDogBot size={60} />,
  rex: <CuteRexBot size={60} />,
  "service-robot": <CuteServiceBot size={60} />,
  "smart-office": <CuteDumEBot size={58} />,
  configurator: <CuteDroneBot size={58} />,
  "ups-monitor": <CuteIronBot size={55} />,
  "appy-rover": <CuteIronBot size={55} />,
  dinamani: <CuteDroneBot size={58} />,
};

export default function Projects() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: "0px 0px -60px 0px",
  });
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");
  const [active, setActive] = useState<Project | null>(null);

  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const countFor = (id: "all" | ProjectCategory) =>
    id === "all" ? projects.length : projects.filter((p) => p.category === id).length;

  // Close case study on Escape + lock background scroll while open
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const enquire = (project: Project) => {
    setActive(null);
    window.dispatchEvent(new CustomEvent("portfolio:prefill-contact", {
      detail: { subject: `Re: ${project.title}`, message: `Hi Nirmal, I saw your "${project.title}" project and would like to discuss ` },
    }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="projects" ref={ref}>
      <div className="container">
        <div className="section-heading-row" style={{ marginBottom: "2rem" }}>
          <CuteDogBot size={55} />
          <h2 className="section-title" style={{ margin: 0, left: 0, transform: "none" }}>
            Robotics & Software Prototypes
          </h2>
          <CuteIronBot size={48} />
          <CuteRexBot size={50} />
        </div>

        {/* Category filter */}
        <div className="project-filters" role="tablist" aria-label="Filter projects by category">
          {PROJECT_FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`project-filter ${filter === f.id ? "active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <span className="project-filter-count">{countFor(f.id)}</span>
            </button>
          ))}
        </div>

        <motion.div layout className="projects-grid">
          <AnimatePresence mode="popLayout">
            {visible.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <article className="glass-card project-card">
                  {/* Schematic corner brackets */}
                  <div className="hud-corner hud-corner-tl" style={{ width: "12px", height: "12px" }} />
                  <div className="hud-corner hud-corner-br" style={{ width: "12px", height: "12px" }} />

                  <div className="project-content">
                    <div className="project-card-top">
                      <span className="project-status" style={{ margin: 0 }}>
                        {project.status}
                      </span>
                      <div className="project-robot" aria-hidden="true">{ROBOTS[project.id]}</div>
                    </div>

                    <h3 className="project-title" style={{ marginTop: "0.4rem" }}>{project.title}</h3>

                    <p className="project-desc">{project.desc}</p>

                    <ul className="project-highlights">
                      {project.highlights.slice(0, 2).map((h) => (
                        <li key={h}><CheckCircle2 size={13} /> {h}</li>
                      ))}
                    </ul>

                    <div className="project-tech">
                      {project.tech.map((tech) => (
                        <span key={tech}>#{tech}</span>
                      ))}
                    </div>

                    <div className="project-actions">
                      <button className="project-case-btn" onClick={() => setActive(project)}>
                        <Layers size={14} /> Case Study
                      </button>
                      <a href={profile.github} target="_blank" rel="noreferrer" className="project-icon-link" aria-label="GitHub profile">
                        <GithubIcon />
                      </a>
                    </div>
                  </div>
                </article>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Case study modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="case-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="case-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="case-title"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="case-header">
                <div>
                  <span className="project-status">{active.status}</span>
                  <h3 id="case-title" className="case-title">{active.title}</h3>
                </div>
                <button className="lightbox-close-btn" onClick={() => setActive(null)} aria-label="Close case study" autoFocus>
                  <X size={18} />
                </button>
              </div>

              <div className="case-body">
                <div className="case-block">
                  <h4>Overview</h4>
                  <p>{active.desc}</p>
                </div>

                <div className="case-block">
                  <h4>Key Outcomes</h4>
                  <ul className="case-outcomes">
                    {active.highlights.map((h) => (
                      <li key={h}><CheckCircle2 size={15} /> {h}</li>
                    ))}
                  </ul>
                </div>

                <div className="case-block">
                  <h4>Stack</h4>
                  <div className="project-tech">
                    {active.tech.map((t) => <span key={t}>#{t}</span>)}
                  </div>
                </div>
              </div>

              <div className="case-footer">
                <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-outline">
                  <GithubIcon size={16} /> GitHub <ArrowUpRight size={14} />
                </a>
                <button className="btn btn-primary" onClick={() => enquire(active)}>
                  <MessageSquare size={16} /> Discuss this project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
