import { Braces, Database, Cloud } from "lucide-react";
import { profile } from "@/data/profile";

const categories = [
  { title: "Backend", icon: Braces, description: "The logic behind the experience.", skills: profile.skills.backend },
  { title: "Databases", icon: Database, description: "A solid foundation for your data.", skills: profile.skills.database },
  { title: "Cloud & operations", icon: Cloud, description: "From deployment to day-to-day reliability.", skills: profile.skills.cloud },
];

export default function SkillsMatrix() {
  return <div className="skills-grid">{categories.map(({ title, icon: Icon, description, skills }, index) => <article className="skill-card" key={title}><div className="skill-top"><Icon size={25} strokeWidth={1.5} /><span className="mono">0{index + 1}</span></div><h3>{title}</h3><p>{description}</p><div className="skill-tags">{skills.map(skill => <span className="tag" key={skill}>{skill.replace("Amazon Web Service (AWS)", "AWS").replace("Google Cloud Platform (GCP)", "GCP")}</span>)}</div></article>)}</div>;
}
