"use client";

import React from "react";
import { GitPullRequest, Star, Users, FolderCode, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface GithubDashboardProps {
  user: {
    login: string;
    name: string;
    avatar_url: string;
    public_repos: number;
    followers: number;
    following: number;
    location: string;
    blog: string;
  };
  stats: {
    totalStars: number;
    originalCount: number;
    forksCount: number;
    languages: LanguageStat[];
  };
  contributionCells: { level: number; count: number; date: string }[];
}

// Generate colors for languages
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Go: "#00ADD8",
  PowerShell: "#012456",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Java: "#b07219",
};

export default function GithubDashboard({ user, stats, contributionCells }: GithubDashboardProps) {

  const getIntensityColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-slate-950 border-slate-900/60"; // empty
      case 1:
        return "bg-emerald-900/50 border-emerald-950/20"; // light green
      case 2:
        return "bg-emerald-700/70 border-emerald-800/40"; // medium green
      case 3:
        return "bg-emerald-500 border-emerald-600/55"; // bright green
      case 4:
        return "bg-emerald-400 border-emerald-500"; // super bright
      default:
        return "bg-slate-950 border-slate-900/60";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Public Repositories",
            value: user.public_repos,
            icon: FolderCode,
            color: "text-blue-400",
            bg: "border-blue-500/10 hover:border-blue-500/30",
          },
          {
            label: "Original Creations",
            value: stats.originalCount,
            icon: GitPullRequest,
            color: "text-purple-400",
            bg: "border-purple-500/10 hover:border-purple-500/30",
          },
          {
            label: "Total Repo Stars",
            value: stats.totalStars,
            icon: Star,
            color: "text-amber-400",
            bg: "border-amber-500/10 hover:border-amber-500/30",
          },
          {
            label: "GitHub Followers",
            value: user.followers,
            icon: Users,
            color: "text-emerald-400",
            bg: "border-emerald-500/10 hover:border-emerald-500/30",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              viewport={{ once: true }}
              className={`p-4 rounded-xl glass border ${item.bg} flex items-center justify-between transition-all duration-300 group`}
            >
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">
                  {item.label}
                </span>
                <span className="text-2xl md:text-3xl font-heading font-bold text-slate-100 block group-hover:scale-105 transition-transform duration-200 origin-left">
                  {item.value}
                </span>
              </div>
              <div className={`p-3 bg-slate-900 rounded-lg border border-slate-800 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Language Breakdown Card */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="lg:col-span-5 p-5 rounded-xl glass border border-slate-800 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <FolderCode className="w-4 h-4 text-emerald-500" />
              Languages Breakdown
            </h3>

            {/* Visual breakdown bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex mb-6">
              {stats.languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: LANGUAGE_COLORS[lang.name] || "#6e7681",
                  }}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
                  title={`${lang.name}: ${lang.percentage}%`}
                />
              ))}
            </div>

            {/* List with percentages */}
            <div className="space-y-3">
              {stats.languages.map((lang) => {
                const color = LANGUAGE_COLORS[lang.name] || "#6e7681";
                return (
                  <div key={lang.name} className="flex items-center justify-between text-sm font-mono">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full block shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-slate-300 font-medium">{lang.name}</span>
                    </div>
                    <div className="text-slate-400">
                      <span>{lang.count} repos</span>
                      <span className="text-slate-600 mx-1.5">|</span>
                      <span className="text-emerald-400 font-semibold">{lang.percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-4 mt-6 text-xs text-slate-500 font-mono text-center">
            *Derived from original public repositories
          </div>
        </motion.div>

        {/* Contributions Calendar Card */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="lg:col-span-7 p-5 rounded-xl glass border border-slate-800 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Contribution Metrics
            </h3>

            <div className="overflow-x-auto pb-2">
              {/* Contributions Calendar representation */}
              <div
                className="grid grid-flow-col gap-1 w-max mx-auto"
                style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
              >
                {contributionCells.map((cell, idx) => {
                  const tooltipText = cell.date 
                    ? `${cell.count} contributions on ${new Date(cell.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` 
                    : "No contributions";
                  return (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-sm border ${getIntensityColor(
                      cell.level
                    )} transition-all duration-300 hover:scale-125 hover:z-10 cursor-crosshair`}
                    title={tooltipText}
                  />
                  );
                })}
              </div>
            </div>

            {/* Calendar Legend */}
            <div className="flex justify-between items-center mt-4 text-xs font-mono text-slate-500">
              <div className="flex gap-2">
                <span>Location: {user.location || "Jakarta, ID"}</span>
              </div>
              <div className="flex items-center gap-1.5 select-none">
                <span>Less</span>
                <span className="w-3 h-3 bg-slate-950 border border-slate-900/60 rounded-sm" />
                <span className="w-3 h-3 bg-emerald-900/50 border border-emerald-950/20 rounded-sm" />
                <span className="w-3 h-3 bg-emerald-700/70 border border-emerald-800/40 rounded-sm" />
                <span className="w-3 h-3 bg-emerald-500 border border-emerald-600/55 rounded-sm" />
                <span className="w-3 h-3 bg-emerald-400 border border-emerald-500 rounded-sm" />
                <span>More</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 mt-6 flex justify-between items-center text-xs font-mono text-slate-500">
            <span>Profile ID: {user.login}</span>
            <span>API Status: live</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
