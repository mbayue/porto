"use client";

import React, { useState } from "react";
import { Layout, Workflow, Server } from "lucide-react";
import { motion } from "framer-motion";

interface SkillItem {
  name: string;
  level: number; // 0 to 100
  info: string;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: SkillItem[];
}

const SKILL_TREE: SkillCategory[] = [
  {
    title: "Frontend Engineering",
    icon: <Layout className="w-4 h-4 text-sky-400" />,
    skills: [
      { name: "TypeScript", level: 90, info: "Type safety, class models, generic frameworks" },
      { name: "Next.js", level: 85, info: "App Router, Static Gen, hydration tuning" },
      { name: "React.js", level: 90, info: "Custom hooks, Context API, state machines" },
      { name: "Tailwind CSS", level: 95, info: "Responsive utilities, theme setups, styling" },
      { name: "JavaScript (ES6+)", level: 95, info: "DOM, async/await, modules, event loop" },
    ],
  },
  {
    title: "Backend & Systems",
    icon: <Server className="w-4 h-4 text-emerald-400" />,
    skills: [
      { name: "Node.js", level: 90, info: "Event loops, file streams, HTTP servers, Express" },
      { name: "Python", level: 85, info: "Scraping, pandas, EPUB converters, scripts" },
      { name: "Go (Golang)", level: 75, info: "REST APIs, structures, backend utilities" },
      { name: "REST APIs", level: 90, info: "Integrations, middleware, auth configurations" },
    ],
  },
  {
    title: "Bots & Automation",
    icon: <Workflow className="w-4 h-4 text-purple-400" />,
    skills: [
      { name: "Discord.js", level: 95, info: "Music playback embeds, queues, slash commands" },
      { name: "Web Scraping", level: 90, info: "BeautifulSoup4, headers, proxy rotation, crawlers" },
      { name: "Link Preview Engines", level: 90, info: "Metadata parsing, headers spoofing for embeds" },
      { name: "Automation Scripts", level: 85, info: "Chron tasks, data formatters, system pipelines" },
    ],
  },
];

function SkillCategoryCard({ category, catIdx }: { category: SkillCategory; catIdx: number }) {
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: catIdx * 0.1, duration: 0.35 }}
      viewport={{ once: true }}
      className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl glass flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-slate-950 border border-slate-850 rounded-lg">
            {category.icon}
          </div>
          <h4 className="font-heading font-bold text-slate-200 text-sm md:text-base uppercase tracking-tight">
            {category.title}
          </h4>
        </div>

        <div className="space-y-4">
          {category.skills.map((skill) => (
            <div
              key={skill.name}
              onMouseEnter={() => setSelectedSkill(skill)}
              onMouseLeave={() => setSelectedSkill(null)}
              className="space-y-1.5 cursor-help group"
            >
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-medium group-hover:text-emerald-400 transition-colors duration-200">
                  {skill.name}
                </span>
                <span className="text-slate-500 font-semibold group-hover:text-emerald-400 transition-colors duration-200">
                  {skill.level}%
                </span>
              </div>
              {/* Progress bar container */}
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="h-full bg-emerald-500 rounded-full group-hover:bg-emerald-400 transition-colors duration-200"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick info panel at bottom of card */}
      <div className="mt-6 pt-3 border-t border-slate-850 h-10 flex items-center justify-center text-center">
        {selectedSkill ? (
          <motion.span
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-mono text-emerald-400 font-medium"
          >
            {selectedSkill.info}
          </motion.span>
        ) : (
          <span className="text-[11px] font-mono text-slate-500 select-none">
            Hover over a skill for details
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function SkillsMatrix() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {SKILL_TREE.map((category, catIdx) => (
        <SkillCategoryCard
          key={category.title}
          category={category}
          catIdx={catIdx}
        />
      ))}
    </div>
  );
}
