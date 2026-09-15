import { ArrowDown, ArrowUpRight, Braces, Database, Globe2, Server } from "lucide-react";
import { profile } from "@/data/profile";

export default function HeroSection() {
  return (
    <section id="hero" className="hero">
      <div className="hero-copy">
        <p className="eyebrow"><span className="status-dot" /> Backend engineer, 3+ yrs prod, Indonesia</p>
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
      <div className="architecture" role="img" aria-label="Backend architecture illustration: a client connects to an API service, which connects to a database and a background worker.">
        <div className="architecture-caption"><span><span className="status-dot" /> SYSTEMS OPERATIONAL</span><Braces size={17} /></div>
        <div className="system-node client-node"><Globe2 size={19} /><span>Client request</span><span className="node-code">HTTPS</span></div>
        <div className="connector connector-top"><span>GET /something-good</span></div>
        <div className="system-node api-node"><div className="api-icon"><Server size={28} /></div><div><span className="node-kicker">THE BACKEND</span><strong>Built to do the work.</strong><small>Logic. Integrations. Reliability.</small></div><span className="node-indicator" /></div>
        <div className="connector-branch"><i /><i /></div>
        <div className="system-bottom"><div className="system-node"><Database size={21} /><span>Database<small>Store what matters</small></span></div><div className="system-node"><Braces size={21} /><span>Worker<small>Handle the details</small></span></div></div>
        <div className="architecture-footer"><span><i /> Request → response</span><span>One thoughtful layer at a time.</span></div>
        <span className="diagram-index">FIG. 01 / BEHIND THE INTERFACE</span>
      </div>
    </section>
  );
}
