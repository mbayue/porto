import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import SystemDiagram from "./SystemDiagram";

export default function HeroSection() {
  return (
    <section id="hero" className="hero">
      <div className="hero-copy">
        <p className="eyebrow"><span className="status-dot" aria-hidden="true" /> Backend engineer, 3+ yrs prod, Indonesia</p>
        <h1>Good software.<br />Starts <span>under<br className="desktop-break" /> the hood.</span></h1>
        <p className="hero-description">I’m {profile.shortName}. I build APIs, work with databases, and keep the systems behind the screen running.</p>
        <div className="hero-metrics" aria-label="Career highlights">
          {profile.metrics.map(m => <div key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}
        </div>
        <div className="hero-actions">
          <a href="#projects" className="button button-primary">Explore my work <ArrowDown size={17} /></a>
          <a href={`mailto:${profile.email}`} className="text-link">Let’s talk <ArrowUpRight size={17} /></a>
        </div>
        <div className="hero-footnote"><span>BASED IN TUBAN, ID</span><span>BUILDING FOR THE WEB</span></div>
      </div>
      <SystemDiagram />
    </section>
  );
}
