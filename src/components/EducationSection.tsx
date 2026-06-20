import React from "react";
import { profile } from "@/data/profile";
import { GraduationCap } from "lucide-react";

export default function EducationSection() {
  return (
    <section id="education" className="scroll-mt-24 space-y-8">
      <div className="border-l-2 border-emerald-500 pl-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-100 uppercase tracking-tight">
            Education
          </h2>
          <p className="text-slate-400 font-mono text-xs mt-1">
            $ cat /etc/education.conf
          </p>
        </div>
        <GraduationCap className="w-5 h-5 text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.education.map((edu, idx) => (
          <div key={idx} className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl glass flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-200">
                {edu.degree}
              </h3>
              <p className="text-slate-400 font-mono text-sm mt-1">
                {edu.institution}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/60 text-xs font-mono text-emerald-400">
              {edu.year}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
