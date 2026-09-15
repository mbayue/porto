import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { profile } from "@/data/profile";

export default function ContactSection() {
  return <section id="contact" className="contact-section"><div><p className="eyebrow"><span className="status-dot" aria-hidden="true" /> LET’S CONNECT</p><h2>Have a system that<br /><span>needs care?</span></h2><p>Open to backend roles, freelance builds, and prod fixes.</p><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight /></a></div><div className="contact-aside"><span className="contact-symbol" aria-hidden="true">↗</span><div className="social-links"><a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer"><Github size={17} />GitHub<ArrowUpRight size={15} /></a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={17} />LinkedIn<ArrowUpRight size={15} /></a></div></div></section>;
}
