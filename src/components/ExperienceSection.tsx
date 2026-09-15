import { profile } from "@/data/profile";

export default function ExperienceSection() {
  return (
    <section id="experience" className="section">
      <div className="section-heading"><div><p className="eyebrow">02 / EXPERIENCE</p><h2>Where I’ve contributed.</h2></div><p className="section-note">Real teams. Production systems.<br />Plenty of lessons along the way.</p></div>
      <div className="experience-list">{profile.experience.map((experience, index) => <article className="experience-row" key={experience.company}><div className="experience-date"><span className="mono">{experience.period}</span><span>{experience.location}</span></div><div className="experience-main"><div className="experience-title"><h3>{experience.company}</h3>{index === 0 && <span className="tag tag-accent">Most recent role</span>}</div><p className="experience-role">{experience.role}</p><ul>{experience.responsibilities.map(item => <li key={item}>{item}</li>)}</ul></div><span className="experience-number">0{index + 1}</span></article>)}</div>
    </section>
  );
}
