import React from "react";
import { Github, Heart, MapPin, Mail, Globe, Sparkles, BookOpen, Layers, TerminalIcon } from "lucide-react";
import TerminalHero from "@/components/TerminalHero";
import GithubDashboard from "@/components/GithubDashboard";
import FeaturedProjects from "@/components/FeaturedProjects";
import SkillsMatrix from "@/components/SkillsMatrix";
import ActivityFeed from "@/components/ActivityFeed";
import ContactConsole from "@/components/ContactConsole";



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

async function getCommitMessage(repoName: string, sha: string, headers: Record<string, string>) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repoName}/commits/${sha}`, {
      headers,
      next: { revalidate: 10800 }, // Cache individual commits for 3 hours
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
    throw new Error(`GitHub response error: User: ${userRes.status}, Repos: ${reposRes.status}, Events: ${eventsRes.status}`);
  }

  const user = await userRes.json();
  const repos = await reposRes.json();
  const events = await eventsRes.json();

  // Enrich PushEvents with real commit messages using HEAD sha if commits list is missing
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

  return { user, repos, events: enrichedEvents };
}

export default async function Page() {
  const { user, repos, events } = await getGithubData();

  // 1. Process Repository Statistics
  const typedRepos = repos as Repository[];
  const originalRepos = typedRepos.filter((repo) => !repo.fork);
  const forksRepos = typedRepos.filter((repo) => repo.fork);

  const totalStars = originalRepos.reduce((acc, curr) => acc + curr.stargazers_count, 0);

  // 2. Language Breakdown (original repos)
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
      color: "", // will be styled in dashboard
    }))
    .sort((a, b) => b.count - a.count);

  // 3. User details structure
  const userDetails = {
    login: user.login,
    name: user.name || "Bayu Erich",
    avatar_url: user.avatar_url,
    public_repos: user.public_repos,
    followers: user.followers,
    following: user.following,
    location: user.location || "Jakarta, Indonesia",
    blog: user.blog || "bayue.netlify.app",
  };

  const processedStats = {
    totalStars,
    originalCount: originalRepos.length,
    forksCount: forksRepos.length,
    languages: processedLanguages,
  };

  return (
    <div className="relative min-h-screen bg-[#0f172a] text-[#f8fafc] flex flex-col selection:bg-emerald-500/30 selection:text-emerald-400">

      {/* Scanline overlay for retro CRT terminal feeling */}
      <div className="scanlines fixed inset-0 pointer-events-none z-40 opacity-[0.03]"></div>

      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.06),rgba(255,255,255,0))] pointer-events-none z-0"></div>

      {/* Floating Header Navigation */}
      <header className="sticky top-0 z-30 w-full glass border-b border-slate-800/80 shrink-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded group-hover:border-emerald-500 transition-colors duration-200">
              <TerminalIcon className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <span className="font-heading font-bold text-sm tracking-wider uppercase font-mono group-hover:text-emerald-400 transition-colors duration-200">
              bayue48.sh
            </span>
          </a>

          <nav className="hidden sm:flex items-center gap-6 font-mono text-xs text-slate-400">
            <a href="#about" className="hover:text-emerald-400 transition-colors duration-150">~/about</a>
            <a href="#projects" className="hover:text-emerald-400 transition-colors duration-150">~/projects</a>
            <a href="#skills" className="hover:text-emerald-400 transition-colors duration-150">~/skills</a>
            <a href="#activity" className="hover:text-emerald-400 transition-colors duration-150">~/activity</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors duration-150">~/ping</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/bayue48"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-lg transition-all duration-200 cursor-pointer"
              aria-label="GitHub Profile Link"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
            <a
              href="#contact"
              className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 hover:border-emerald-500/50 text-emerald-400 font-mono text-[10px] font-bold uppercase rounded cursor-pointer transition-all duration-200"
            >
              Run Ping
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-10 space-y-24 z-10">

        {/* Section 1: Hero & Terminal Shell */}
        <section id="hero" className="scroll-mt-24 space-y-8 pt-4">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-mono text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Web & Automation Engineer</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-slate-100 leading-none">
              Bayu Erich
            </h1>
            <p className="text-slate-400 font-body text-sm md:text-base leading-relaxed">
              Jakarta-based builder crafting interactive visualization tools, scraping pipelines, and automation systems. Persistent debugger, microservice organizer.
            </p>
          </div>

          <TerminalHero />
        </section>

        {/* Section 2: About Me / Profile Dashboard */}
        <section id="about" className="scroll-mt-24 space-y-8">
          <div className="border-l-2 border-emerald-500 pl-4">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-100 uppercase tracking-tight">
              About & Metrics
            </h2>
            <p className="text-slate-400 font-mono text-xs mt-1">
              $ cat profile.json | jq .analytics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-4 p-5 bg-slate-900/40 border border-slate-800 rounded-xl glass flex flex-col justify-between text-center lg:text-left h-full">
              <div className="space-y-5">
                <div className="relative w-24 h-24 mx-auto lg:mx-0 rounded-xl overflow-hidden border border-slate-700/60 p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={userDetails.avatar_url}
                    alt={userDetails.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-heading font-bold text-slate-200">
                    {userDetails.name}
                  </h3>
                  <span className="text-xs font-mono text-emerald-400">
                    @{userDetails.login}
                  </span>
                </div>
                <p className="text-slate-400 font-body text-xs md:text-sm leading-relaxed italic">
                  {`"${user.bio || "pull stuck overflow dev"}"`}
                </p>
              </div>

              <div className="border-t border-slate-850 pt-4 space-y-2.5 font-mono text-xs text-slate-400 mt-6">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{userDetails.location}</span>
                </div>
                {userDetails.blog && (
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                    <a
                      href={`https://${userDetails.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-400 underline"
                    >
                      {userDetails.blog}
                    </a>
                  </div>
                )}
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                  <a href="#contact" className="hover:text-emerald-400">
                    bayu.erich@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <GithubDashboard user={userDetails} stats={processedStats} />
            </div>
          </div>
        </section>

        {/* Section 3: Featured Projects */}
        <section id="projects" className="scroll-mt-24 space-y-8">
          <div className="border-l-2 border-emerald-500 pl-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-100 uppercase tracking-tight">
                Featured Projects
              </h2>
              <p className="text-slate-400 font-mono text-xs mt-1">
                $ list-repositories --filter=original
              </p>
            </div>
            <BookOpen className="w-5 h-5 text-emerald-500" />
          </div>

          <FeaturedProjects repositories={originalRepos} />
        </section>

        {/* Section 4: Tech Stack Matrix */}
        <section id="skills" className="scroll-mt-24 space-y-8">
          <div className="border-l-2 border-emerald-500 pl-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-100 uppercase tracking-tight">
                Skills Matrix
              </h2>
              <p className="text-slate-400 font-mono text-xs mt-1">
                $ analyze-competence --detailed
              </p>
            </div>
            <Layers className="w-5 h-5 text-emerald-500" />
          </div>

          <SkillsMatrix />
        </section>

        {/* Section 5: Activity timeline */}
        <section id="activity" className="scroll-mt-24 space-y-8">
          <div className="border-l-2 border-emerald-500 pl-4">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-100 uppercase tracking-tight">
              Recent Activity
            </h2>
            <p className="text-slate-400 font-mono text-xs mt-1">
              $ git log --oneline -n 15
            </p>
          </div>

          <ActivityFeed events={events} />
        </section>

        {/* Section 6: Contact Console */}
        <section id="contact" className="scroll-mt-24 space-y-8">
          <div className="border-l-2 border-emerald-500 pl-4">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-100 uppercase tracking-tight">
              Contact Console
            </h2>
            <p className="text-slate-400 font-mono text-xs mt-1">
              $ telnet mail.bayue48.site 25
            </p>
          </div>

          <ContactConsole />
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full glass border-t border-slate-850 shrink-0 mt-20 py-8 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()}</span>
            <span className="text-slate-400">Bayu Erich</span>
            <span>• Built with Next.js & Tailwind</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>by</span>
            <a href="https://github.com/bayue48" className="text-slate-400 hover:text-emerald-400">
              @bayue48
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
