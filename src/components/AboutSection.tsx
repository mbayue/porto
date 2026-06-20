import React from "react";
import { profile } from "@/data/profile";

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 space-y-8">
      <div className="border-l-2 border-emerald-500 pl-4">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-100 uppercase tracking-tight">
          About Me
        </h2>
        <p className="text-slate-400 font-mono text-xs mt-1">
          $ cat /var/log/syslog | grep &quot;profile&quot;
        </p>
      </div>

      <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-xl glass">
        <p className="text-slate-300 font-body leading-relaxed md:text-lg">
          {profile.summary}
        </p>
      </div>
    </section>
  );
}
