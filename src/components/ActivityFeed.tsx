"use client";

import React, { useState } from "react";
import { GitCommit, Star, Code, Activity, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface EventPayload {
  commits?: {
    sha?: string;
    message: string;
    author?: { email: string; name: string };
  }[];
  ref?: string;
  ref_type?: string;
}

interface GitEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload?: EventPayload;
}

interface ActivityFeedProps {
  events: GitEvent[];
}

export default function ActivityFeed({ events }: ActivityFeedProps) {
  const [filterType, setFilterType] = useState<string>("All");

  // Format dates
  const formatTimeAgo = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const now = new Date("2026-06-04T11:43:31+07:00"); // Use current context time
    const diffMs = now.getTime() - eventDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} days ago`;
    if (diffHours > 0) return `${diffHours} hours ago`;
    return "Recently";
  };

  const getEventDetails = (event: GitEvent) => {
    const repoName = event.repo.name.replace("bayue48/", "");
    const time = formatTimeAgo(event.created_at);

    switch (event.type) {
      case "PushEvent":
        let commitMsg = event.payload?.commits?.[0]?.message || "Pushed code changes";
        commitMsg = commitMsg.split("\n")[0];
        if (commitMsg.length > 80) {
          commitMsg = commitMsg.substring(0, 77) + "...";
        }
        return {
          title: `bayue48/${repoName}`,
          subtitle: "Pushed to Repository",
          description: commitMsg,
          icon: <GitCommit className="w-4 h-4 text-emerald-400" />,
          badge: "Commit",
          time,
        };
      case "WatchEvent":
        return {
          title: event.repo.name,
          subtitle: "Starred Repository",
          description: "Added to stars list",
          icon: <Star className="w-4 h-4 text-amber-400 fill-amber-400/10" />,
          badge: "Star",
          time,
        };
      case "CreateEvent":
        const refType = event.payload?.ref_type || "branch";
        const refName = event.payload?.ref || "main";
        return {
          title: `bayue48/${repoName}`,
          subtitle: `Created ${refType} (${refName})`,
          description: `Initialized new development ${refType}`,
          icon: <Code className="w-4 h-4 text-blue-400" />,
          badge: "Create",
          time,
        };
      default:
        return {
          title: event.repo.name,
          subtitle: "GitHub Event",
          description: "Triggered standard webhook",
          icon: <Activity className="w-4 h-4 text-slate-400" />,
          badge: "Event",
          time,
        };
    }
  };

  // Keep first 12 original events to show active timeline
  const processedEvents = events
    .slice(0, 15)
    .map((e) => ({ ...e, details: getEventDetails(e) }));

  const filteredEvents = processedEvents.filter((e) => {
    if (filterType === "All") return true;
    return e.details.badge === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Activity Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <h4 className="text-sm font-heading font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-emerald-500" />
          Recent GitHub Timeline
        </h4>

        {/* Filters */}
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          {["All", "Commit", "Star", "Create"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 border rounded cursor-pointer transition-all duration-200 ${filterType === type
                  ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-bold"
                  : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-355"
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l border-slate-850 ml-3 md:ml-4 pl-6 md:pl-8 space-y-5 py-2">
        {filteredEvents.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.04, 0.4), duration: 0.3 }}
            viewport={{ once: true }}
            className="relative group"
          >
            {/* Timeline bullet dot */}
            <div className={`absolute -left-[37px] md:-left-[45px] top-1.5 w-6.5 h-6.5 rounded-full bg-slate-950 border-2 transition-all duration-300 flex items-center justify-center z-10 shadow-md ${item.details.badge === "Commit" ? "border-emerald-500/30 group-hover:border-emerald-500 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.15)]" :
                item.details.badge === "Star" ? "border-amber-500/30 group-hover:border-amber-500 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.15)]" :
                  "border-blue-500/30 group-hover:border-blue-500 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.15)]"
              }`}>
              {item.details.icon}
            </div>

            {/* Timeline Card content */}
            <div className="bg-slate-900/10 border border-slate-850/60 p-4 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-3 group-hover:bg-slate-900/20 group-hover:border-slate-800 transition-all duration-300 shadow-sm">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="font-heading font-semibold text-slate-200 text-sm group-hover:text-emerald-450 transition-colors duration-305">
                    {item.details.title}
                  </h5>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${item.details.badge === "Commit" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450" :
                      item.details.badge === "Star" ? "bg-amber-500/10 border-amber-500/20 text-amber-450" :
                        "bg-blue-500/10 border-blue-500/20 text-blue-450"
                    }`}>
                    {item.details.badge}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 block">
                  {item.details.subtitle}
                </span>

                {/* Show commit command box ONLY for commits */}
                {item.details.badge === "Commit" && (
                  <div className="flex items-center gap-2 mt-2.5 text-[11px] font-mono text-slate-350 bg-slate-950/70 py-1.5 px-3 border border-slate-900/80 rounded-lg w-fit max-w-full overflow-hidden">
                    <span className="text-emerald-500 font-bold shrink-0">$</span>
                    <span className="text-slate-500 shrink-0">git commit -m</span>
                    <span className="text-slate-200 truncate">{`"${item.details.description}"`}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono shrink-0 self-end sm:self-start">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.details.time}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="py-6 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-850 rounded-xl">
            No events found match selection.
          </div>
        )}
      </div>
    </div>
  );
}
