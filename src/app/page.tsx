import React from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { projectDetails, type Project } from "@/data/projects";

import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsMatrix from "@/components/SkillsMatrix";
import FeaturedProjects from "@/components/FeaturedProjects";
import GithubDashboard from "@/components/GithubDashboard";
import ActivityFeed from "@/components/ActivityFeed";
import ContactSection from "@/components/ContactSection";
import { profile } from "@/data/profile";

// Type definitions
interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  pushed_at: string;
  created_at: string;
  homepage: string | null;
}

interface LanguageBreakdown {
  name: string;
  count: number;
  percentage: number;
  color: string;
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
  payload?: {
    commits?: {
      sha?: string;
      message: string;
      author?: { email: string; name: string };
    }[];
    ref?: string;
    ref_type?: string;
    head?: string;
  };
}

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

async function getCommitMessage(repoName: string, sha: string, headers: Record<string, string>) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repoName}/commits/${sha}`, {
      headers,
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 10800 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.commit?.message || null;
  } catch {
    return null;
  }
}

async function getGithubData() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "mbayue-portfolio",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  const [userRes, reposRes, eventsRes] = await Promise.all([
    fetch("https://api.github.com/users/mbayue", { headers, signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } }),
    fetch("https://api.github.com/users/mbayue/repos?per_page=100&sort=updated", { headers, signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } }),
    fetch("https://api.github.com/users/mbayue/events/public?per_page=30", { headers, signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } }),
  ]);

  if (!userRes.ok || !reposRes.ok || !eventsRes.ok) {
    return null; // Return gracefully without crashing if Github fails
  }

  const user = await userRes.json();
  const repos = await reposRes.json();
  const events = await eventsRes.json();

  const enrichedEvents = await Promise.all(
    events.map(async (event: GitEvent) => {
      if (event.type === "PushEvent" && event.payload && event.payload.head) {
        if (!event.payload.commits || event.payload.commits.length === 0) {
          const message = await getCommitMessage(event.repo.name, event.payload.head, headers);
          if (message) {
            event.payload.commits = [{ message }];
          }
        }
      }
      return event;
    })
  );

  const graphqlQuery = `
    query {
      user(login: "mbayue") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  let contributionCells: { level: number; count: number; date: string }[] = [];
  try {
    const gqlRes = process.env.GITHUB_TOKEN ? await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({ query: graphqlQuery }),
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600 },
    }) : null;

    if (gqlRes?.ok) {
      const gqlData = await gqlRes.json();
      const weeks = gqlData.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
      
      weeks.forEach((week: ContributionWeek) => {
        week.contributionDays.forEach((day: ContributionDay) => {
          let level = 0;
          const count = day.contributionCount;
          if (count > 0 && count <= 3) level = 1;
          else if (count > 3 && count <= 6) level = 2;
          else if (count > 6 && count <= 10) level = 3;
          else if (count > 10) level = 4;
          
          contributionCells.push({ level, count, date: day.date });
        });
      });

      if (contributionCells.length > 315) {
        contributionCells = contributionCells.slice(-315);
      } else while (contributionCells.length < 315) {
        contributionCells.unshift({ level: 0, count: 0, date: "" });
      }
    }
  } catch (e) {
    console.error("Failed to fetch GraphQL contributions", e);
    contributionCells = Array(315).fill({ level: 0, count: 0, date: "" });
  }

  return { user, repos, events: enrichedEvents, contributionCells };
}

export default async function Page() {
  const githubData = await getGithubData().catch(() => null);
  
  let userDetails: {
    login: string;
    name: string;
    avatar_url: string;
    public_repos: number;
    followers: number;
    following: number;
    location: string;
    blog: string;
  } = {
    login: profile.github,
    name: profile.name,
    avatar_url: `https://github.com/${profile.github}.png`,
    public_repos: 0,
    followers: 0,
    following: 0,
    location: profile.location,
    blog: profile.linkedin,
  };
  
  let originalRepos: Repository[] = [];
  let featuredRepos: Project[] = profile.featuredProjects.map(name => ({
    name,
    description: projectDetails[name]?.description || null,
    language: projectDetails[name]?.stack[0] || null,
    html_url: `https://github.com/${profile.github}/${name}`,
    homepage: null,
    topics: [],
  }));
  let processedStats = { totalStars: 0, originalCount: 0, forksCount: 0, languages: [] as LanguageBreakdown[] };
  
  if (githubData) {
    const { user, repos } = githubData;
    const typedRepos = repos as Repository[];
    originalRepos = typedRepos.filter((repo) => !repo.fork);
    const forksRepos = typedRepos.filter((repo) => repo.fork);

    // Filter to only featured projects for the portfolio section
    featuredRepos = profile.featuredProjects.map(name =>
      originalRepos.find(repo => repo.name === name) || featuredRepos.find(repo => repo.name === name)!
    );
    // Fallback if none match
    if (featuredRepos.length === 0) {
      featuredRepos = originalRepos.slice(0, 6);
    }

    const totalStars = originalRepos.reduce((acc, curr) => acc + curr.stargazers_count, 0);

    const languageCounts: Record<string, number> = {};
    originalRepos.forEach((repo) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    const totalLangRepos = Object.values(languageCounts).reduce((acc, curr) => acc + curr, 0);
    const processedLanguages: LanguageBreakdown[] = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalLangRepos > 0 ? (count / totalLangRepos) * 100 : 0,
        color: "",
      }))
      .sort((a, b) => b.count - a.count);

    userDetails = {
      ...userDetails,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
    };

    processedStats = {
      totalStars,
      originalCount: originalRepos.length,
      forksCount: forksRepos.length,
      languages: processedLanguages,
    };
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main" className="site-shell">
        <HeroSection />
        <div className="stack-strip"><span>THE TOOLS<br />BEHIND THE WORK</span><div className="stack-items">{profile.stackStrip.map(tool => <span key={tool}>{tool}</span>)}</div></div>
        <section id="projects" className="section">
          <div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>Built out of curiosity.<br />Made to be useful.</h2></div><a className="text-link" href={`https://github.com/${profile.github}?tab=repositories`} target="_blank" rel="noopener noreferrer">All repositories <ArrowUpRight size={16} /></a></div>
          <FeaturedProjects repositories={featuredRepos} />
          {!githubData && <p className="project-unavailable">Showing selected projects. Live GitHub stats are temporarily unavailable.</p>}
        </section>
        <ExperienceSection />
        <section id="skills" className="section">
          <div className="section-heading"><div><p className="eyebrow">03 / THE TOOLKIT</p><h2>The right tool for the job.</h2></div><p className="section-note">Technologies I have worked with<br />across projects and production.</p></div>
          <SkillsMatrix />
        </section>
        {githubData && <section id="activity" className="section">
          <div className="section-heading"><div><p className="eyebrow">04 / IN THE OPEN</p><h2>Still building. Still exploring.</h2></div><span className="section-note">From my public GitHub activity</span></div>
          <GithubDashboard user={userDetails} stats={processedStats} contributionCells={githubData.contributionCells} />
          <ActivityFeed events={githubData.events} />
        </section>}
        <AboutSection />
        <ContactSection />
        <footer className="site-footer"><span>© {new Date().getFullYear()} {profile.shortName}</span><span>Thoughtfully built in Indonesia.</span><a href="#hero">Back to top <ArrowUp size={14} /></a></footer>
      </main>
    </>
  );
}
