"use client";

import { useState } from "react";
import { ArrowUpRight, GitBranch, GitCommit, Star } from "lucide-react";
import { profile } from "@/data/profile";

interface GitEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload?: { commits?: { message: string }[]; ref?: string; ref_type?: string };
}

const filters = ["All", "Commits", "Stars", "New work"];
const types: Record<string, string> = { Commits: "PushEvent", Stars: "WatchEvent", "New work": "CreateEvent" };

export default function ActivityFeed({ events }: { events: GitEvent[] }) {
  const [filter, setFilter] = useState("All");
  const filtered = events.slice(0, 15).filter(event => filter === "All" || event.type === types[filter]).slice(0, 5);
  return <div><div className="activity-heading"><h3>Fresh from GitHub</h3><div className="activity-filters" aria-label="Filter GitHub activity">{filters.map(item => <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}</div></div>
    <div>{filtered.map(event => {
      const Icon = event.type === "WatchEvent" ? Star : event.type === "PushEvent" ? GitCommit : GitBranch;
      const description = event.type === "PushEvent" ? event.payload?.commits?.[0]?.message.split("\n")[0] || "Pushed code changes" : event.type === "WatchEvent" ? "Starred a repository" : event.type === "CreateEvent" ? `Created ${event.payload?.ref_type || "repository"}${event.payload?.ref ? ` · ${event.payload.ref}` : ""}` : "Repository activity";
      return <article className="activity-row" key={event.id}><Icon size={17} /><div><a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer">{event.repo.name}</a><p>{description}</p></div><time dateTime={event.created_at}>{new Date(event.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}</time></article>;
    })}{filtered.length === 0 && <p className="empty-state">No recent activity in this category.</p>}</div>
    <a className="text-link activity-more" href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">More on GitHub <ArrowUpRight size={15} /></a>
  </div>;
}
