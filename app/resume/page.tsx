import type { Metadata } from "next";
import Link from "next/link";
import { profile, experiences, projects, skillGroups, SITE_URL, type ProjectCategory } from "@/lib/profile";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name} — ${profile.title}.`,
  alternates: { canonical: "/resume" },
};

// Projects grouped the way recruiters scan them: AI first, then hardware, then web
const PROJECT_GROUPS: { title: string; categories: ProjectCategory[] }[] = [
  { title: "AI & Generative AI", categories: ["ai"] },
  { title: "Robotics, Embedded & Hardware", categories: ["robotics", "embedded"] },
  { title: "Full Stack Web & 3D", categories: ["web"] },
];

const CORE_EXPERTISE = [
  "Generative AI & Agentic AI",
  "Python · FastAPI · Django",
  "Full Stack Web (Next.js / React / Node.js)",
  "ROS 2 Robotics & SLAM Navigation",
  "Embedded IoT (STM32 / Raspberry Pi / MQTT)",
  "PCB Design with KiCad",
  "Flutter & Windows Desktop Apps",
  "Cloud, Docker & DevOps",
];

export default function ResumePage() {
  const siteHost = SITE_URL.replace(/^https?:\/\//, "");
  const contacts = [
    { label: profile.email, href: `mailto:${profile.email}` },
    { label: profile.phone, href: profile.phoneHref },
    { label: profile.location },
    { label: "linkedin.com/in/nirmal-saravanan", href: profile.linkedin },
    { label: "github.com/nirmal-ks", href: profile.github },
    { label: siteHost, href: SITE_URL },
  ];

  return (
    <div className="resume-shell">
      <div className="resume-toolbar">
        <Link href="/" className="btn btn-outline">← Back to Portfolio</Link>
        <PrintButton />
      </div>

      <article className="resume-page">
        <header className="resume-header">
          <h1>{profile.name}</h1>
          <p className="resume-role">{profile.title}</p>
          <ul className="resume-contact">
            {contacts.map((c) => (
              <li key={c.label}>{c.href ? <a href={c.href}>{c.label}</a> : c.label}</li>
            ))}
          </ul>
        </header>

        <section className="resume-section">
          <h2>Professional Summary</h2>
          <p>{profile.summary}</p>
        </section>

        <section className="resume-section">
          <h2>Core Expertise</h2>
          <ul className="resume-expertise">
            {CORE_EXPERTISE.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </section>

        <section className="resume-section">
          <h2>Professional Experience</h2>
          {experiences.map((exp) => (
            <div key={exp.company} className="resume-item">
              <div className="resume-item-head">
                <h3>{exp.role}</h3>
                <span className="resume-date">{exp.date}</span>
              </div>
              <div className="resume-item-sub">
                <span className="resume-org">{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              <ul>
                {exp.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section className="resume-section">
          <h2>Key Projects</h2>
          {PROJECT_GROUPS.map((group) => {
            const list = projects.filter((p) => group.categories.includes(p.category));
            if (list.length === 0) return null;
            return (
              <div key={group.title} className="resume-project-group">
                <h4>{group.title}</h4>
                {list.map((p) => (
                  <div key={p.id} className="resume-item resume-project">
                    <div className="resume-item-head">
                      <h3>{p.title}</h3>
                    </div>
                    <p className="resume-tech">{p.tech.join(" · ")}</p>
                    <p>{p.highlights.join("; ")}.</p>
                  </div>
                ))}
              </div>
            );
          })}
        </section>

        <section className="resume-section">
          <h2>Technical Skills</h2>
          <dl className="resume-skills">
            {skillGroups.map((g) => (
              <div key={g.category}>
                <dt>{g.category}</dt>
                <dd>{g.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </div>
  );
}
