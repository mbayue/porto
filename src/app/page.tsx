import React from "react";
import { Github, Heart, TerminalIcon } from "lucide-react";

import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsMatrix from "@/components/SkillsMatrix";
import FeaturedProjects from "@/components/FeaturedProjects";
import EducationSection from "@/components/EducationSection";
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
    "User-Agent": "bayue48-portfolio",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  const [userRes, reposRes, eventsRes] = await Promise.all([
    fetch("https://api.github.com/users/bayue48", { headers, next: { revalidate: 3600 } }),
    fetch("https://api.github.com/users/bayue48/repos?per_page=100&sort=updated", { headers, next: { revalidate: 3600 } }),
    fetch("https://api.github.com/users/bayue48/events/public?per_page=30", { headers, next: { revalidate: 3600 } }),
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
      user(login: "bayue48") {
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
    const gqlRes = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({ query: graphqlQuery }),
      next: { revalidate: 3600 },
    });

    if (gqlRes.ok) {
      const gqlData = await gqlRes.json();
      const weeks = gqlData.data.user.contributionsCollection.contributionCalendar.weeks;
      
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
  const githubData = await getGithubData();
  
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
  let featuredRepos: Repository[] = [];
  let processedStats = { totalStars: 0, originalCount: 0, forksCount: 0, languages: [] as LanguageBreakdown[] };
  
  if (githubData) {
    const { user, repos } = githubData;
    const typedRepos = repos as Repository[];
    originalRepos = typedRepos.filter((repo) => !repo.fork);
    const forksRepos = typedRepos.filter((repo) => repo.fork);

    // Filter to only featured projects for the portfolio section
    featuredRepos = originalRepos.filter(repo => profile.featuredProjects.includes(repo.name));
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
    <div className="relative min-h-screen bg-[#0f172a] text-[#f8fafc] flex flex-col selection:bg-emerald-500/30 selection:text-emerald-400">
      <div className="scanlines fixed inset-0 pointer-events-none z-40 opacity-[0.03]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.06),rgba(255,255,255,0))] pointer-events-none z-0"></div>

      <header className="sticky top-0 z-30 w-full glass border-b border-slate-800/80 shrink-0">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded group-hover:border-emerald-500 transition-colors duration-200">
              <TerminalIcon className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <span className="font-heading font-bold text-sm tracking-wider uppercase font-mono group-hover:text-emerald-400 transition-colors duration-200">
              bayue48.sh
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 font-mono text-sm text-slate-400">
            <a href="#about" className="hover:text-emerald-400 transition-colors duration-150">~/about</a>
            <a href="#experience" className="hover:text-emerald-400 transition-colors duration-150">~/experience</a>
            <a href="#projects" className="hover:text-emerald-400 transition-colors duration-150">~/projects</a>
            <a href="#skills" className="hover:text-emerald-400 transition-colors duration-150">~/skills</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors duration-150">~/ping</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`https://github.com/${profile.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-lg transition-all duration-200 cursor-pointer"
              aria-label="GitHub Profile Link"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
            <a
              href="/cv-bayu-erich.pdf"
              target="_blank"
              className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 hover:border-emerald-500/50 text-emerald-400 font-mono text-[10px] font-bold uppercase rounded cursor-pointer transition-all duration-200"
            >
              Get CV
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-10 space-y-24 z-10">
        <HeroSection />
        
        <AboutSection />
        
        <ExperienceSection />
        
        <div className="space-y-8 scroll-mt-24" id="skills">
          <div className="border-l-2 border-emerald-500 pl-4">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-100 uppercase tracking-tight">
              Technical Arsenal
            </h2>
            <p className="text-slate-400 font-mono text-xs mt-1">
              $ analyze-competence --detailed
            </p>
          </div>
          <SkillsMatrix />
        </div>

        <div className="space-y-8 scroll-mt-24" id="projects">
          <div className="border-l-2 border-emerald-500 pl-4">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-100 uppercase tracking-tight">
              Selected Projects
            </h2>
            <p className="text-slate-400 font-mono text-xs mt-1">
              $ ls -la ~/projects/featured
            </p>
          </div>
          {featuredRepos.length > 0 && (
            <FeaturedProjects repositories={featuredRepos} />
          )}
        </div>
        
        <EducationSection />

        {/* Optional GitHub Dashboard / Activity feed pushed down */}
        {githubData && (
          <section className="space-y-16 pt-8 border-t border-slate-800/60 mt-16">
            <div className="space-y-8">
              <div className="border-l-2 border-emerald-500 pl-4">
                <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-100 uppercase tracking-tight">
                  GitHub Metrics
                </h2>
                <p className="text-slate-400 font-mono text-xs mt-1">
                  $ cat profile.json | jq .analytics
                </p>
                <p className="text-slate-500 font-mono text-[10px] mt-2 italic">
                  Some data is pulled automatically from GitHub.
                </p>
              </div>
              <GithubDashboard user={userDetails} stats={processedStats} contributionCells={githubData.contributionCells} />
            </div>

            <div className="space-y-8">
              <div className="border-l-2 border-emerald-500 pl-4">
                <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-100 uppercase tracking-tight">
                  Recent Activity
                </h2>
                <p className="text-slate-400 font-mono text-xs mt-1">
                  $ git log --oneline -n 15
                </p>
              </div>
              <ActivityFeed events={githubData.events} />
            </div>
          </section>
        )}

        <ContactSection />

      </main>

      <footer className="w-full glass border-t border-slate-850 shrink-0 mt-20 py-8 z-10">
        <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()}</span>
            <span className="text-slate-400">{profile.name}</span>
            <span>• Built with Next.js & Tailwind</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>by</span>
            <a href={`https://github.com/${profile.github}`} className="text-slate-400 hover:text-emerald-400">
              @{profile.github}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
