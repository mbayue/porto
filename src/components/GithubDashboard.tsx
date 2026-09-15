interface GithubDashboardProps {
  user: { public_repos: number; followers: number };
  stats: { totalStars: number; originalCount: number; forksCount: number; languages: { name: string; count: number; percentage: number; color: string }[] };
  contributionCells: { level: number; count: number; date: string }[];
}

const colors: Record<string, string> = { JavaScript: "#daca72", TypeScript: "#7caacc", Python: "#88b798", Go: "#8fcdd1", HTML: "#d99977", CSS: "#b6a0c8" };

export default function GithubDashboard({ user, stats, contributionCells }: GithubDashboardProps) {
  return <div><div className="github-stats">{[
    [user.public_repos, "Public repositories"], [stats.originalCount, "Original projects"], [stats.totalStars, "Repository stars"], [user.followers, "GitHub followers"],
  ].map(([value, label]) => <div className="github-stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    <div className="github-detail"><div><h3>Languages I’m working with</h3><div className="language-bar">{stats.languages.map(language => <span key={language.name} style={{ width: `${language.percentage}%`, background: colors[language.name] || "var(--accent)" }} />)}</div><div className="language-labels">{stats.languages.map(language => <span key={language.name}><i style={{ background: colors[language.name] || "var(--accent)" }} />{language.name} · {language.percentage.toFixed(0)}%</span>)}</div><p className="contribution-note">Based on original public repositories.</p></div>
      <div><h3>A little progress, day by day.</h3>{contributionCells.some(cell => cell.date) ? <><div className="contribution-scroll"><div className="contribution-grid" aria-label="Recent GitHub contributions">{contributionCells.map((cell, index) => <div className="contribution-cell" data-level={cell.level} key={cell.date || index} title={cell.date ? `${cell.count} contributions on ${cell.date}` : "No data"} />)}</div></div><div className="contribution-caption"><p className="contribution-note">Recent contribution history</p><div className="contribution-legend" aria-label="Contribution intensity: less to more"><span>Less</span>{[0, 1, 2, 3, 4].map(level => <span key={level} className="contribution-cell" data-level={level} aria-hidden="true" />)}<span>More</span></div></div></> : <p className="body-copy">Contribution history is currently unavailable. Explore my activity below or visit GitHub.</p>}</div>
    </div>
  </div>;
}
