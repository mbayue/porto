"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, BookMarked, BookOpen, Braces, Download, FileCode2, Film, GitBranch, Images, Music2, Pencil, Star, Workflow } from "lucide-react";
import ProjectDialog from "./ProjectDialog";
import { getProjectCategory, projectDetails, type Project } from "@/data/projects";
import { profile } from "@/data/profile";

function ProjectVisual({ name, index }: { name: string; index: number }) {
  return <div className="project-visual" aria-hidden="true"><span className="project-index">PROJECT / {String(index + 1).padStart(2, "0")}</span>
    {name === "gitSdm" ? <div className="repo-graph"><span><GitBranch size={20} /></span><span>repository</span><div><span>src/</span><span>components/</span><span>data/</span></div></div>
      : name === "pia-scrap" ? <div className="scrape-flow"><span><FileCode2 size={27} />HTML</span><ArrowRight size={24} /><span><Braces size={27} />PARSE</span><ArrowRight size={24} /><span><BookOpen size={27} />EPUB</span></div>
      : name === "sketchbook_" ? <div className="scrape-flow"><span><Pencil size={27} />SKETCH</span><ArrowRight size={24} /><span><Film size={27} />TIMELAPSE</span><ArrowRight size={24} /><span><Images size={27} />GALLERY</span></div>
      : name === "novelpia-reader" ? <div className="scrape-flow"><span><Download size={27} />FETCH</span><ArrowRight size={24} /><span><BookOpen size={27} />READ</span><ArrowRight size={24} /><span><BookMarked size={27} />EPUB</span></div>
      : name === "keking" ? <div className="bot-flow"><span>!play</span><Music2 size={26} /><span className="eq" aria-hidden="true"><i /><i /><i /><i /><i /></span></div>
      : name === "pixeldrain-bypasser" ? <div className="batch-flow"><span><i style={{ width: "100%" }} /><b>album.zip · done</b></span><span><i style={{ width: "100%" }} /><b>part-02 · done</b></span><span><i style={{ width: "45%" }} /><b>part-03 · 45%</b></span></div>
      : name === "porto" ? <div className="site-frame"><div className="site-bar"><i /><i /><i /><span>bayue · portfolio</span></div><div className="site-body"><i /><i /><b /></div></div>
      : <Workflow />}
    <span className="project-visual-label">{name === "gitSdm" ? "MAKE THE CONNECTIONS VISIBLE" : name === "pia-scrap" ? "COLLECT. CONVERT. READ." : name === "novelpia-reader" ? "YOUR LIBRARY. AVAILABLE OFFLINE." : name === "sketchbook_" ? "ART. ONE PAGE." : name === "pixeldrain-bypasser" ? "BATCH DOWNLOADS. READY TO RESUME." : name === "porto" ? "YOU’RE LOOKING AT IT." : "SMALL TOOLS. USEFUL POSSIBILITIES."}</span>
  </div>;
}

export default function FeaturedProjects({ repositories }: { repositories: Project[] }) {
  const [active, setActive] = useState("All work");
  const [selected, setSelected] = useState<Project | null>(null);
  const categories = ["All work", ...new Set(repositories.map(getProjectCategory))];
  const filtered = repositories.filter(project => active === "All work" || getProjectCategory(project) === active);
  return <div><div className="project-filters" aria-label="Filter projects">{categories.map(category => <button key={category} aria-pressed={active === category} onClick={() => setActive(category)}>{category}</button>)}</div>
    <div className="projects-grid">{filtered.map(project => {
      const details = projectDetails[project.name];
      const description = details?.description || project.description || "Explore the source and documentation on GitHub.";
      return <article className="project-card" key={project.name}>
        <ProjectVisual name={project.name} index={repositories.indexOf(project)} />
        <div className="project-content"><div className="project-title-row"><h3>{project.name}</h3><button className="project-open" aria-label={`View ${project.name} details`} onClick={() => setSelected({ ...project, description })}><ArrowUpRight size={20} /></button></div><p>{description}</p>
{(profile.impacts as Record<string, string>)[project.name] && <span className="impact-line">→ {(profile.impacts as Record<string, string>)[project.name]}</span>}
<div className="project-bottom"><div className="project-tags">{(details?.stack || [project.language || "Source code"]).map(tech => <span className="tag" key={tech}>{tech}</span>)}</div>{project.stargazers_count !== undefined && <span className="project-stars" aria-label={`${project.stargazers_count} GitHub stars`}><Star size={13} />{project.stargazers_count}</span>}</div></div>
      </article>;
    })}</div>
    {filtered.length === 0 && <p className="empty-state">No projects in this category yet.</p>}
    <ProjectDialog project={selected} onClose={() => setSelected(null)} />
  </div>;
}
