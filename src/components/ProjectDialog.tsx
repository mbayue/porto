"use client";

import React, { useEffect } from "react";
import { X, Star, GitFork, ExternalLink, Github, Terminal, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-500",
  Python: "bg-sky-600",
  Go: "bg-cyan-500",
  PowerShell: "bg-blue-800",
  CSS: "bg-violet-500",
  HTML: "bg-orange-500",
};

export default function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [project]);

  if (!project) return null;

  const formattedDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/85 backdrop-filter backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-terminal overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-950/60 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-heading font-bold text-slate-100 font-mono tracking-tight">
                {project.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors duration-200 cursor-pointer"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content scrollable */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            {/* Project description */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">
                Description
              </span>
              <p className="text-slate-200 leading-relaxed text-sm bg-slate-950/50 p-4 border border-slate-800/80 rounded-lg">
                {project.description || "No description provided for this repository."}
              </p>
            </div>

            {/* Metrics and Dates grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  Stars
                </span>
                <span className="text-slate-200 font-heading font-bold text-lg flex items-center gap-1.5 mt-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                  {project.stargazers_count}
                </span>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  Forks
                </span>
                <span className="text-slate-200 font-heading font-bold text-lg flex items-center gap-1.5 mt-1">
                  <GitFork className="w-4 h-4 text-emerald-400" />
                  {project.forks_count}
                </span>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  Language
                </span>
                <span className="text-slate-200 font-heading font-bold text-sm flex items-center gap-2 mt-1">
                  {project.language ? (
                    <>
                      <span
                        className={`w-2.5 h-2.5 rounded-full block shrink-0 ${
                          LANGUAGE_COLORS[project.language] || "bg-slate-500"
                        }`}
                      />
                      <span>{project.language}</span>
                    </>
                  ) : (
                    <span className="text-slate-500">Unknown</span>
                  )}
                </span>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">
                  Last Commit
                </span>
                <span className="text-slate-200 font-heading font-bold text-[11px] flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  {formattedDate(project.pushed_at)}
                </span>
              </div>
            </div>

            {/* Topics/Tags */}
            {project.topics && project.topics.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">
                  Keywords / Topics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 text-xs font-mono rounded-full"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Shell installation demo code block */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">
                Clone Command
              </span>
              <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 font-mono text-xs rounded-lg text-emerald-400 overflow-x-auto">
                <code>git clone {project.html_url}.git</code>
              </div>
            </div>
          </div>

          {/* Footer Action Links */}
          <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex flex-wrap gap-3 justify-end shrink-0">
            <a
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 font-mono text-xs font-medium rounded-lg cursor-pointer transition-all duration-200"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Code</span>
            </a>
            {project.homepage && (
              <a
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-mono text-xs font-semibold rounded-lg cursor-pointer transition-all duration-200 shadow-md"
              >
                <span>Live Project</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
