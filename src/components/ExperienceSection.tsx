import React from "react";
import { profile } from "@/data/profile";
import { Briefcase, Star, Code, Users, Server } from "lucide-react";

export default function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-24 space-y-8">
      <div className="border-l-2 border-emerald-500 pl-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-100 uppercase tracking-tight">
            Experience Timeline
          </h2>
          <p className="text-slate-400 font-mono text-xs mt-1">
            $ history | grep &quot;work&quot;
          </p>
        </div>
        <Briefcase className="w-5 h-5 text-emerald-500" />
      </div>

      <div className="relative border-l-2 border-slate-800 ml-3 md:ml-4 space-y-8 pb-4">
        {profile.experience.map((exp, idx) => {
          const isMain = idx === 0;
          return (
            <div key={idx} className="relative pl-8 md:pl-10">
              {/* Timeline Dot */}
              <div className={`absolute left-[-9px] top-1 w-4 h-4 rounded-full border-2 border-[#0f172a] ${isMain ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" : "bg-slate-700"}`}></div>
              
              <div className={`p-5 md:p-6 rounded-xl border ${isMain ? "bg-slate-900/60 border-emerald-500/50 shadow-md shadow-emerald-900/10" : "bg-slate-900/40 border-slate-800"} glass`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                  <div>
                    <h3 className={`text-lg md:text-xl font-bold font-heading ${isMain ? "text-emerald-400" : "text-slate-200"}`}>
                      {exp.role}
                    </h3>
                    <div className="text-slate-400 font-mono text-sm mt-1">
                      {exp.company} <span className="text-slate-600">•</span> {exp.location}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-500 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800 self-start">
                    {exp.period}
                  </div>
                </div>

                {isMain && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono uppercase tracking-wider">
                      <Star className="w-3 h-3" /> Main Experience
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-mono uppercase tracking-wider">
                      <Code className="w-3 h-3" /> Backend
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-mono uppercase tracking-wider">
                      <Users className="w-3 h-3" /> Team Lead
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase tracking-wider">
                      <Server className="w-3 h-3" /> Production
                    </span>
                  </div>
                )}
                
                <ul className="space-y-2 mt-2">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className={`flex items-start gap-2.5 text-sm leading-relaxed ${isMain ? "text-slate-300" : "text-slate-400"}`}>
                      <span className="text-emerald-500 mt-1 text-xs">▹</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
