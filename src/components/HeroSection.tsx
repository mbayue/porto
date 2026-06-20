import React from "react";
import { Sparkles, FileText, ArrowRight, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import TerminalHero from "./TerminalHero";

export default function HeroSection() {
  return (
    <section id="hero" className="scroll-mt-24 space-y-12 pt-4">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-mono text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{profile.role}</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-slate-100 leading-none">
          {profile.shortName}
        </h1>
        
        <p className="text-slate-400 font-body text-sm md:text-base leading-relaxed">
          {profile.tagline}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="#projects"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors duration-200"
          >
            <span>View Projects</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/cv-bayu-erich.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 font-medium rounded-lg transition-colors duration-200"
          >
            <FileText className="w-4 h-4" />
            <span>Download CV</span>
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 px-5 py-2.5 bg-transparent hover:bg-slate-800/50 border border-slate-700 text-slate-300 font-medium rounded-lg transition-colors duration-200"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Me</span>
          </a>
        </div>
      </div>

      <TerminalHero />
    </section>
  );
}
