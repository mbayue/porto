"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Minimize2, ExternalLink } from "lucide-react";
import { profile } from "@/data/profile";
import { API_DATA } from "@/data/apiData";

export default function CvPage() {
  const [compact, setCompact] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const projects = API_DATA["/projects"].data;
  const github = API_DATA["/github"];

  return (
    <div className={`min-h-screen bg-white text-[#16181d] font-sans antialiased selection:bg-black selection:text-white transition-all duration-200`}>
      <main id="main-content" className={`max-w-[1080px] mx-auto px-4 sm:px-8 transition-all duration-200 ${compact ? "py-4" : "py-6 sm:py-10"}`}>
        {/* Navigation / Actions Bar */}
        <div className={`flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e3e1] print:hidden ${compact ? "pb-2" : "pb-4"}`}>
          <div className="font-mono text-xs text-[#525866] flex items-center gap-2">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-black hover:underline font-semibold py-1">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>bayue.my.id</span>
            </Link>
            <span>/</span>
            <span>cv</span>
            <span className="hidden sm:inline text-[#525866]">- print-ready</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs whitespace-nowrap shrink-0">
            <button
              type="button"
              onClick={() => setCompact(!compact)}
              aria-pressed={compact}
              className={`px-2.5 sm:px-3 py-1.5 min-h-[36px] border border-[#9ca3af] transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                compact ? "bg-black text-white border-black font-semibold" : "hover:bg-neutral-100"
              }`}
            >
              <Minimize2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{compact ? "Exit Compact" : "Compact View"}</span>
              <span className="sm:hidden">{compact ? "Normal" : "Compact"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-2.5 sm:px-3 py-1.5 min-h-[36px] bg-black text-white border border-black hover:bg-neutral-800 transition-colors flex items-center gap-1.5 font-medium whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Print / Save PDF</span>
              <span className="sm:hidden">Print PDF</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <header className={`border-b-2 border-[#16181d] transition-all ${compact ? "py-3" : "py-6"}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h1 className={`font-bold tracking-tight text-[#16181d] transition-all ${compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>
              {profile.name}
            </h1>
            <span className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#16181d]">
              {profile.role}
            </span>
          </div>
          <p className="font-mono text-[11px] sm:text-xs text-[#5c626b] mt-0.5">
            {profile.location} • open to backend roles and contracts
          </p>
          <p className={`text-[#33383f] max-w-4xl leading-relaxed transition-all ${compact ? "mt-1.5 text-xs sm:text-[13px]" : "mt-3 text-sm sm:text-base"}`}>
            {profile.summary}
          </p>

          <div className={`flex flex-wrap gap-x-6 gap-y-1.5 font-mono text-xs text-[#33383f] ${compact ? "mt-2" : "mt-4"}`}>
            <a href={`mailto:${profile.email}`} className="hover:text-black underline underline-offset-2">
              {profile.email}
            </a>
            <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-black underline underline-offset-2">
              github.com/{profile.github}
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-black underline underline-offset-2">
              linkedin.com/in/bayuerich
            </a>
            <Link href="/" className="hover:text-black underline underline-offset-2">
              bayue.my.id (API Console)
            </Link>
          </div>
        </header>

        {/* 2-Column Content */}
        <div className={`grid grid-cols-1 md:grid-cols-12 transition-all ${compact ? "gap-4 pt-3" : "gap-8 pt-6"}`}>
          {/* Left Column (Toolkit, Stats, Education) */}
          <aside className={`md:col-span-4 transition-all md:border-r md:border-[#e2e3e1] ${compact ? "space-y-3.5 md:pr-4" : "space-y-6 md:pr-6"}`}>
            {/* Toolkit */}
            <section>
              <h2 className={`font-mono text-xs font-semibold tracking-widest uppercase text-[#16181d] border-b border-[#e2e3e1] ${compact ? "pb-1 mb-1.5" : "pb-1.5 mb-3"}`}>
                Toolkit
              </h2>
              <div className={`font-mono text-xs ${compact ? "space-y-2" : "space-y-3"}`}>
                <div>
                  <span className="inline-block bg-black text-white px-1.5 py-0.5 text-[10px] mb-1">Backend</span>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.backend.concat(profile.skills.languages).slice(0, 6).map((item) => (
                      <span key={item} className="bg-neutral-100 border border-[#e2e3e1] px-1.5 py-0.5 text-[11px] text-[#33383f]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="inline-block bg-black text-white px-1.5 py-0.5 text-[10px] mb-1">Databases</span>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.database.map((item) => (
                      <span key={item} className="bg-neutral-100 border border-[#e2e3e1] px-1.5 py-0.5 text-[11px] text-[#33383f]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="inline-block bg-black text-white px-1.5 py-0.5 text-[10px] mb-1">Cloud & DevOps</span>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.cloud.concat(profile.skills.devops).map((item) => (
                      <span key={item} className="bg-neutral-100 border border-[#e2e3e1] px-1.5 py-0.5 text-[11px] text-[#33383f]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Public Work Metrics */}
            <section>
              <h2 className={`font-mono text-xs font-semibold tracking-widest uppercase text-[#16181d] border-b border-[#e2e3e1] ${compact ? "pb-1 mb-1.5" : "pb-1.5 mb-3"}`}>
                Public Work
              </h2>
              <div className={`text-xs ${compact ? "space-y-0.5" : "space-y-1.5"}`}>
                <div className="flex justify-between py-0.5 border-b border-[#e2e3e1]">
                  <span className="text-[#5c626b]">Public repositories</span>
                  <span className="font-mono font-semibold tabular-nums">{github.public_repositories}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#e2e3e1]">
                  <span className="text-[#5c626b]">Original projects</span>
                  <span className="font-mono font-semibold tabular-nums">{github.original_projects}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#e2e3e1]">
                  <span className="text-[#5c626b]">Repository stars</span>
                  <span className="font-mono font-semibold tabular-nums">{github.repository_stars}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#e2e3e1]">
                  <span className="text-[#5c626b]">GitHub followers</span>
                  <span className="font-mono font-semibold tabular-nums">{github.followers}</span>
                </div>
              </div>
            </section>

            {/* Languages */}
            <section>
              <h2 className={`font-mono text-xs font-semibold tracking-widest uppercase text-[#16181d] border-b border-[#e2e3e1] ${compact ? "pb-1 mb-1.5" : "pb-1.5 mb-3"}`}>
                Languages Breakdown
              </h2>
              <div className="space-y-0.5 text-xs">
                {Object.entries(github.languages as Record<string, number>).map(([lang, pct]) => (
                  <div key={lang} className="flex justify-between py-0.5 border-b border-[#e2e3e1]">
                    <span className="text-[#5c626b]">{lang}</span>
                    <span className="font-mono">{pct}%</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className={`font-mono text-xs font-semibold tracking-widest uppercase text-[#16181d] border-b border-[#e2e3e1] ${compact ? "pb-1 mb-1.5" : "pb-1.5 mb-3"}`}>
                Education
              </h2>
              <div className={`transition-all ${compact ? "space-y-1.5" : "space-y-3"}`}>
                {profile.education.map((edu) => (
                  <div key={edu.institution} className="text-xs">
                    <b className="block text-xs font-semibold text-[#16181d]">{edu.institution}</b>
                    <span className="text-[#5c626b] text-[11px]">{edu.degree}</span>
                    <em className="block font-mono text-[10px] text-[#525866] not-italic">
                      {edu.year}
                    </em>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          {/* Right Column (Experience + Selected Projects) */}
          <section className={`md:col-span-8 transition-all ${compact ? "space-y-3.5" : "space-y-6"}`}>
            {/* Experience */}
            <div>
              <h2 className={`font-mono text-xs font-semibold tracking-widest uppercase text-[#16181d] border-b border-[#e2e3e1] ${compact ? "pb-1 mb-2" : "pb-1.5 mb-4"}`}>
                Experience
              </h2>
              <div className={`transition-all ${compact ? "space-y-2.5" : "space-y-5"}`}>
                {profile.experience.map((exp) => (
                  <div key={exp.company} className={`border-b border-[#e2e3e1] last:border-b-0 ${compact ? "pb-2" : "pb-4"}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className={`font-bold text-[#16181d] ${compact ? "text-sm" : "text-sm sm:text-base"}`}>{exp.company}</h3>
                        <span className="text-xs font-semibold text-[#5c626b]">{exp.role}</span>
                      </div>
                      <span className="font-mono text-xs text-[#525866]">{exp.period}</span>
                    </div>
                    <ul className={`text-[#33383f] ${compact ? "mt-1 space-y-0.5 text-xs" : "mt-2 space-y-1 text-xs sm:text-sm"}`}>
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="relative pl-3.5 before:content-['•'] before:absolute before:left-0 before:text-black">
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Projects */}
            <div>
              <h2 className={`font-mono text-xs font-semibold tracking-widest uppercase text-[#16181d] border-b border-[#e2e3e1] ${compact ? "pb-1 mb-2" : "pb-1.5 mb-4"}`}>
                Selected Projects
              </h2>
              <div className={`transition-all ${compact ? "space-y-2" : "space-y-4"}`}>
                {projects.map((proj: any) => (
                  <div key={proj.name} className={`border-b border-[#e2e3e1] last:border-b-0 ${compact ? "pb-1.5" : "pb-3"}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono font-semibold text-xs sm:text-sm hover:underline inline-flex items-center gap-1"
                        >
                          <span>{proj.name}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-[#525866]" aria-hidden="true" />
                        </a>
                        <span className="text-[10px] font-mono text-[#525866] uppercase">
                          {proj.category}
                        </span>
                      </div>
                      {proj.stars && (
                        <span className="font-mono text-[11px] text-[#5c626b]">
                          ★ {proj.stars} stars
                        </span>
                      )}
                    </div>
                    <p className={`text-[#33383f] leading-snug ${compact ? "mt-0.5 text-[11px]" : "mt-1 text-xs"}`}>
                      {proj.description}
                    </p>
                    <div className={`flex flex-wrap gap-1 ${compact ? "mt-1" : "mt-2"}`}>
                      {proj.tags?.map((tag: string) => (
                        <span key={tag} className="font-mono text-[10px] text-[#5c626b] border border-[#e2e3e1] px-1 py-0.2">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className={`border-t-2 border-[#16181d] flex flex-wrap justify-between items-center gap-4 font-mono text-xs text-[#5c626b] ${compact ? "mt-4 pt-2" : "mt-8 pt-4"}`}>
          <p>© {new Date().getFullYear()} Bayu Erich. Built in Indonesia.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-black underline underline-offset-2">
              API Console (bayue.my.id)
            </Link>
            <a href={`https://github.com/${profile.github}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="hover:text-black underline underline-offset-2">
              All repositories →
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
