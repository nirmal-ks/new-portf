import type { Metadata } from "next";
import Link from "next/link";
import { profile, experiences, projects, skillGroups, SITE_URL } from "@/lib/profile";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name} — ${profile.title}.`,
  alternates: { canonical: "/resume" },
};

const featured = ["unitree", "rex", "smart-office", "configurator", "appy-rover"];

export default function ResumePage() {
  const siteHost = SITE_URL.replace(/^https?:\/\//, "");

  return (
    <div className="resume-shell">
      <div className="resume-toolbar">
        <Link href="/" className="btn btn-outline">← Back to Portfolio</Link>
        <PrintButton />
      </div>

      <article className="resume-page">
        <header className="resume-header">
          <div>
            <h1>{profile.name}</h1>
            <p className="resume-role">{profile.title}</p>
          </div>
          <ul className="resume-contact">
            <li><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
            <li><a href={profile.phoneHref}>{profile.phone}</a></li>
            <li>{profile.location}</li>
            <li><a href={profile.linkedin}>linkedin.com/in/nirmal-saravanan</a></li>
            <li><a href={profile.github}>github.com/nirmal-ks</a></li>
            <li><a href={SITE_URL}>{siteHost}</a></li>
          </ul>
        </header>

        <section className="resume-section">
          <h2>Summary</h2>
          <p>{profile.summary}</p>
        </section>

        <section className="resume-section">
          <h2>Experience</h2>
          {experiences.map((exp) => (
            <div key={exp.company} className="resume-item">
              <div className="resume-item-head">
                <div>
                  <h3>{exp.role}</h3>
                  <span className="resume-org">{exp.company}</span>
                </div>
                <span className="resume-date">{exp.date} · {exp.location}</span>
              </div>
              <ul>
                {exp.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section className="resume-section">
          <h2>Selected Projects</h2>
          {projects.filter((p) => featured.includes(p.id)).map((p) => (
            <div key={p.id} className="resume-item resume-project">
              <h3>{p.title} <span className="resume-tech">— {p.tech.join(", ")}</span></h3>
              <p>{p.highlights.join(" · ")}</p>
            </div>
          ))}
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
