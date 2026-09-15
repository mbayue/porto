import { Braces, Code2, Container, Database, Cloud } from "lucide-react";
import { profile } from "@/data/profile";

const categories = [
  { title: "Languages", icon: Code2, description: "The languages I reach for.", skills: profile.skills.languages },
  { title: "Backend", icon: Braces, description: "The logic behind the experience.", skills: profile.skills.backend },
  { title: "Databases", icon: Database, description: "A solid foundation for your data.", skills: profile.skills.database },
  { title: "Cloud", icon: Cloud, description: "Where the systems run.", skills: profile.skills.cloud },
  { title: "DevOps", icon: Container, description: "Shipping it and keeping it up.", skills: profile.skills.devops },
];

export default function SkillsMatrix() {
  return <div className="skills-grid">{categories.map(({ title, icon: Icon, description, skills }, index) => <article className="skill-card" key={title}><div className="skill-top"><Icon size={25} strokeWidth={1.5} /><span className="mono">0{index + 1}</span></div><h3>{title}</h3><p>{description}</p><div className="skill-tags">{skills.map(skill => <span className="tag" key={skill}>{skill}</span>)}</div></article>)}</div>;
}
