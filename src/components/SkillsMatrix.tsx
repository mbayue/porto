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
    title: "Backend",
    icon: <Server className="w-4 h-4 text-emerald-400" />,
    skills: [
      { name: "Node.js", level: 90, info: "Core runtime, Express, microservices" },
      { name: "Go", level: 85, info: "High performance APIs, concurrency" },
      { name: "JavaScript", level: 95, info: "ES6+, async flows, backend logic" },
      { name: "REST APIs", level: 90, info: "Architecture, integrations, scalability" },
    ],
  },
  {
    title: "Database",
    icon: <Layout className="w-4 h-4 text-sky-400" />,
    skills: [
      { name: "PostgreSQL", level: 90, info: "Relational data, complex queries, tuning" },
      { name: "MongoDB", level: 85, info: "NoSQL, document stores, aggregation" },
      { name: "MySQL", level: 85, info: "Relational, maintenance, indexing" },
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: <Workflow className="w-4 h-4 text-purple-400" />,
    skills: [
      { name: "AWS", level: 80, info: "EC2, RDS, S3, deployments" },
      { name: "GCP", level: 80, info: "Compute Engine, Cloud Run, hosting" },
      { name: "Deployment", level: 85, info: "CI/CD, Docker, production rollout" },
      { name: "Server Maintenance", level: 90, info: "Linux, Nginx, troubleshooting, monitoring" },
    ],
  },
];

function SkillCategoryCard({ category, catIdx }: { category: SkillCategory; catIdx: number }) {
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  const getLevelBadge = (level: number) => {
    if (level >= 90) return { label: "Comfortable", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (level >= 80) return { label: "Familiar", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { label: "Learning", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
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

        <div className="space-y-3">
          {category.skills.map((skill) => {
            const badge = getLevelBadge(skill.level);
            return (
              <div
                key={skill.name}
                onMouseEnter={() => setSelectedSkill(skill)}
                onMouseLeave={() => setSelectedSkill(null)}
                className="flex items-center justify-between p-2 rounded hover:bg-slate-800/50 cursor-help group transition-colors duration-200"
              >
                <span className="text-slate-300 text-sm font-medium group-hover:text-emerald-400 transition-colors duration-200">
                  {skill.name}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
            );
          })}
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
