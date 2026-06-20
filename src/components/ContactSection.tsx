import React from "react";
import { profile } from "@/data/profile";
import { Mail, Github, Linkedin, MapPin, ExternalLink } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 space-y-8">
      <div className="border-l-2 border-emerald-500 pl-4">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-100 uppercase tracking-tight">
          Contact
        </h2>
        <p className="text-slate-400 font-mono text-xs mt-1">
          $ ping bayu.erich
        </p>
      </div>

      <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-xl glass">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-bold text-slate-200">Let&apos;s Connect</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              I&apos;m currently open to backend engineering opportunities, freelance work, and collaboration. The easiest way to reach me is by email.
            </p>
            <div className="space-y-4">
              <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-colors group">
                <div className="p-2 bg-slate-800 rounded group-hover:bg-emerald-900/30">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-mono text-sm">{profile.email}</span>
              </a>
              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-colors group">
                <div className="p-2 bg-slate-800 rounded group-hover:bg-emerald-900/30">
                  <Github className="w-4 h-4" />
                </div>
                <span className="font-mono text-sm">github.com/{profile.github}</span>
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-colors group">
                <div className="p-2 bg-slate-800 rounded group-hover:bg-emerald-900/30">
                  <Linkedin className="w-4 h-4" />
                </div>
                <span className="font-mono text-sm">linkedin.com/in/bayuerich</span>
              </a>
              <div className="flex items-center gap-3 text-slate-300 group">
                <div className="p-2 bg-slate-800 rounded">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-mono text-sm">{profile.location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-center bg-slate-950/50 p-6 rounded-lg border border-slate-800/80">
            <div className="text-center space-y-4">
              <Mail className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
              <h4 className="text-slate-200 font-heading font-medium">Send me an email</h4>
              <p className="text-slate-500 text-xs">Direct emails preferred for quickest response.</p>
              <a 
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors duration-200 mt-2"
              >
                <span>Email Me</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
