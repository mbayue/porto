import { ArrowUpRight, MapPin } from "lucide-react";
import { profile } from "@/data/profile";
import TerminalHero from "./TerminalHero";

export default function AboutSection() {
  return (
    <section id="about" className="section about-section">
      <div className="section-heading"><div><p className="eyebrow">05 / ABOUT</p><h2>A person behind<br />the pull requests.</h2></div><span className="location"><MapPin size={16} /> Tuban, East Java</span></div>
      <div className="about-grid"><p className="about-statement">Practical problems.<br />Thoughtful solutions.<br /><span>Always learning.</span></p><div><p className="body-copy">I maintain production backend systems, review code, and improve reliability. Lately exploring AI-assisted development.</p><div className="education-compact">{profile.education.map(e => <p key={e.institution} className="section-note">{e.degree}, {e.institution}, {e.year}</p>)}</div><a className="text-link" href="/cv-bayu-erich.pdf" target="_blank" rel="noopener noreferrer">The full story, in my CV <ArrowUpRight size={17} /></a></div></div>
      <details className="terminal-disclosure"><summary><span className="mono">&gt;_</span> More of a terminal person?<span className="terminal-hint">Try: help, work, contact +</span></summary><TerminalHero /></details>
    </section>
  );
}
