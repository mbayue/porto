"use client";

import React, { useState } from "react";
import { Star, GitFork, ExternalLink, Terminal, ShieldAlert, Library, Sparkles, MessageSquareCode, Server } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectDialog from "./ProjectDialog";

interface Project {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  updated_at: string;
  pushed_at: string;
  created_at: string;
}

interface FeaturedProjectsProps {
  repositories: Project[];
}

const CATEGORIES = ["All", "Web & Mobile Apps", "Backend & APIs", "Bots & Automation", "Scrapers & Tools", "Other"];

export default function FeaturedProjects({ repositories }: FeaturedProjectsProps) {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Assign categories to repos based on names/topics
  const categorizeProject = (repoName: string): string => {
    const name = repoName.toLowerCase();
    if (name.includes("api") || name.includes("server") || name.includes("backend") || name.includes("cita") ||
      name.includes("payung") || name.includes("xyz") || name.includes("-be")) {
      return "Backend & APIs";
    }
    if (name.includes("gitsdm") || name.includes("dbid") || name.includes("app") || name.includes("web") ||
      name.includes("mobile") || name.includes("-fe") || name.includes("frontend") || name.includes("porto")) {
      return "Web & Mobile Apps";
    }
    if (name.includes("keking") || name.includes("bot") || name.includes("discord") || name.includes("jeta")) {
      return "Bots & Automation";
    }
    if (name.includes("scrap") || name.includes("xfa") || name.includes("xrd")) {
      return "Scrapers & Tools";
    }
    return "Other"; // default
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Web & Mobile Apps":
        return <Sparkles className="w-3.5 h-3.5" />;
      case "Backend & APIs":
        return <Server className="w-3.5 h-3.5" />;
      case "Bots & Automation":
        return <MessageSquareCode className="w-3.5 h-3.5" />;
      case "Scrapers & Tools":
        return <Terminal className="w-3.5 h-3.5" />;
      case "Other":
      default:
        return <Library className="w-3.5 h-3.5" />;
    }
  };

  const filteredRepos = repositories.filter((repo) => {
    if (activeTab === "All") return true;
    return categorizeProject(repo.name) === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Category selection tabs */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {CATEGORIES.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 border rounded-lg font-mono text-xs font-semibold cursor-pointer transition-all duration-200 ${activeTab === tab
              ? "bg-emerald-500 border-emerald-500 text-white shadow-md glow-border"
              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
          >
            {getCategoryIcon(tab)}
            <span>{tab}</span>
          </button>
        ))}
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredRepos.map((repo) => {
            const projectCategory = categorizeProject(repo.name);
            return (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
                onClick={() => setSelectedProject(repo)}
                className="group relative flex flex-col justify-between bg-slate-900/40 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-xl cursor-pointer transition-all duration-300 hover:bg-slate-900/80 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
              >
                {/* Accent line top */}
                <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/0 group-hover:via-emerald-500/60 to-transparent transition-all duration-300" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-500 border border-slate-850 rounded font-mono uppercase tracking-wider">
                      {projectCategory}
                    </span>
                    <div className="flex items-center gap-2.5 text-xs text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500/80" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-emerald-500/70" />
                        {repo.forks_count}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-heading font-bold text-slate-200 group-hover:text-emerald-400 transition-colors duration-200">
                    {repo.name}
                  </h4>

                  <p className="text-slate-400 text-xs md:text-sm line-clamp-3 leading-relaxed font-body">
                    {repo.description || "No repository description has been configured."}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-850">
                  <span className="text-xs font-mono text-slate-500">
                    {repo.language || "Shell / Config"}
                  </span>
                  <span className="text-xs font-mono text-emerald-500 flex items-center gap-1 group-hover:underline">
                    View Logs <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredRepos.length === 0 && (
        <div className="p-10 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 space-y-2">
          <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="font-mono text-sm">No repositories found in this category.</p>
        </div>
      )}

      {/* Details Lightbox */}
      <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
