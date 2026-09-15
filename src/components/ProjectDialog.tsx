"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Github, X } from "lucide-react";
import type { Project } from "@/data/projects";

export default function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!project || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [project]);

  return <dialog ref={dialogRef} className="project-dialog" aria-labelledby="project-dialog-title" onCancel={onClose} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    {project && <><div className="dialog-heading"><h2 id="project-dialog-title">{project.name}</h2><button type="button" className="dialog-close" onClick={onClose} aria-label="Close project details"><X size={20} /></button></div>
      <p className="dialog-description">{project.description || "Explore this project on GitHub."}</p>
      <div className="dialog-meta">{project.language && <span className="tag">{project.language}</span>}{project.stargazers_count !== undefined && <span className="tag">{project.stargazers_count} stars</span>}{project.forks_count !== undefined && <span className="tag">{project.forks_count} forks</span>}{project.pushed_at && <span className="tag">Updated {new Date(project.pushed_at).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}</span>}</div>
      {project.topics.length > 0 && <div className="project-tags">{project.topics.map(topic => <span className="tag" key={topic}>{topic}</span>)}</div>}
      <code className="dialog-code">git clone {project.html_url}.git</code>
      <div className="dialog-actions"><a href={project.html_url} className="button button-primary" target="_blank" rel="noopener noreferrer"><Github size={17} /> View source <ArrowUpRight size={16} /></a>{project.homepage && /^https?:\/\//i.test(project.homepage) && <a href={project.homepage} className="text-link" target="_blank" rel="noopener noreferrer">Live project <ArrowUpRight size={16} /></a>}</div>
    </>}
  </dialog>;
}
