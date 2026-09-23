export interface ApiRoute {
  path: string;
  method: "GET" | "POST";
  desc: string;
}

export const ROUTES: ApiRoute[] = [
  { path: "/", method: "GET", desc: "service root and engineer record" },
  { path: "/about", method: "GET", desc: "background and focus areas" },
  { path: "/architecture", method: "GET", desc: "request lifecycle and system layout" },
  { path: "/projects", method: "GET", desc: "seven shipped engineering tools" },
  { path: "/stack", method: "GET", desc: "languages, databases, platforms" },
  { path: "/experience", method: "GET", desc: "roles and production history" },
  { path: "/github", method: "GET", desc: "repository metrics and commits" },
  { path: "/contact", method: "GET", desc: "communication channels" },
  { path: "/messages", method: "POST", desc: "send a message payload" },
];

export const API_DATA: Record<string, any> = {
  "/": {
    service: "bayue.my.id",
    version: "v2.1.0",
    status: "healthy",
    uptime: "99.98%",
    engineer: {
      name: "Bayu Erich",
      role: "Backend Engineer",
      location: "Tuban, East Java, Indonesia",
      headline: "Building reliable APIs and backend systems.",
      intro: "I build APIs, write SQL, and deploy services on Linux.",
      available_for: [
        "backend engineering roles",
        "freelance projects",
        "technical conversations"
      ]
    },
    endpoints: [
      "/about",
      "/architecture",
      "/projects",
      "/stack",
      "/experience",
      "/github",
      "/contact",
      "/messages"
    ]
  },
  "/about": {
    heading: "Backend engineer focused on runtime reliability.",
    lines: [
      "Production service maintenance.",
      "Database tuning and API design."
    ],
    bio: "Backend engineer based in Tuban, Indonesia. I maintain core production APIs, review pull requests, deploy Linux servers, and build developer utilities. Most of my work centers on TypeScript, Go, and PostgreSQL.",
    focus: [
      "REST API design",
      "Query optimization",
      "Linux server deployment"
    ],
    cv: "https://bayue.my.id/cv"
  },
  "/architecture": {
    concept: "Server-side pipeline",
    pipeline: [
      "Client request",
      "Edge / CDN",
      "Reverse proxy / HTTPS",
      "Node.js runtime / Next.js app",
      "Database / cache / workers"
    ],
    components: {
      database: "PostgreSQL, MongoDB, MySQL, Redis.",
      worker: "Async queues, scheduled tasks, and webhook listeners.",
      networking: "REST endpoints, auth middleware, and rate limits."
    },
    closing: "Standard layered request-response pipeline.",
    tools: [
      "Node.js",
      "TypeScript",
      "Go",
      "PostgreSQL",
      "MongoDB",
      "AWS",
      "Google Cloud",
      "Docker"
    ]
  },
  "/projects": {
    total: 7,
    data: [
      {
        name: "gitSdm",
        category: "web app",
        description: "Interactive visualizer for repository structure, dependencies, and file connections.",
        tags: ["React", "Vite", "Bun", "AI"],
        url: "https://gsdm.site"
      },
      {
        name: "pia-scrap",
        category: "tool",
        stars: 14,
        description: "Python scraper that extracts web novel chapters into clean EPUB files.",
        tags: ["Python", "Beautiful Soup", "EPUB"],
        url: "https://github.com/mbayue/pia-scrap"
      },
      {
        name: "sketchbook_",
        category: "web app",
        description: "Single-page art gallery showcasing sketches and finished illustrations.",
        tags: ["React", "Vite", "Tailwind CSS"],
        url: "https://sketch.my.id"
      },
      {
        name: "keking",
        category: "automation",
        description: "Discord audio bot with music queue controls and server utilities.",
        tags: ["Node.js", "Discord.js"],
        url: "https://github.com/mbayue/keking"
      },
      {
        name: "novelpia-reader",
        category: "desktop app",
        description: "Desktop reader and offline downloader for Novelpia with background batch exports.",
        tags: ["Rust", "Tauri", "React"],
        url: "https://github.com/mbayue/novelpia-reader"
      },
      {
        name: "pixeldrain-bypasser",
        category: "tool",
        description: "Batch downloader script with resumable file downloads and status checks.",
        tags: ["PowerShell", "aria2c"],
        url: "https://github.com/mbayue/pixeldrain-bypasser"
      },
      {
        name: "porto",
        category: "web app",
        description: "Developer portfolio and API console built with Next.js, TypeScript, and Tailwind CSS.",
        tags: ["TypeScript", "Next.js", "Tailwind CSS"],
        url: "https://github.com/mbayue/porto"
      }
    ]
  },
  "/stack": {
    backend: {
      summary: "Server logic and service design.",
      items: ["Node.js", "TypeScript", "Go", "Python", "NestJS", "REST APIs"]
    },
    databases: {
      summary: "Relational, document, and cache storage.",
      items: ["PostgreSQL", "MongoDB", "MySQL", "Redis"]
    },
    cloud_operations: {
      summary: "Deployment, containers, and maintenance.",
      items: ["AWS", "GCP", "Docker", "CI/CD", "Server Maintenance"]
    },
    foundations: [
      {
        school: "Arkademy",
        program: "Full Stack Mobile Developer Bootcamp",
        year: "2021"
      },
      {
        school: "SMK Negeri 1 Tuban",
        program: "Computer Systems Networking and Telecommunications",
        period: "2015 - 2018"
      }
    ]
  },
  "/experience": {
    data: [
      {
        company: "Yue Shop",
        role: "Owner",
        period: "Jan 2025 - Mar 2026",
        location: "Tuban, East Java",
        highlights: [
          "Operated an online store for digital game top-ups and app purchases.",
          "Handled vendor accounts, user support, and order processing."
        ]
      },
      {
        company: "Orderfaz",
        role: "Software Engineer",
        period: "Mar 2022 - May 2024",
        location: "Bandung",
        highlights: [
          "Led backend engineering team across core checkout and integration services.",
          "Reviewed pull requests and enforced API standards across services.",
          "Deployed and maintained backend production instances.",
          "Fixed bugs and built features for Orderfaz and partner platforms like Apikurir."
        ]
      },
      {
        company: "Nashta Global Utama",
        role: "Backend Developer",
        period: "Jun 2021 - Dec 2021",
        location: "Jakarta",
        highlights: [
          "Maintained and patched the 2nd generation SINSW government platform.",
          "Contributed backend modules for PJKEK and SINAS NK economic trade systems."
        ]
      }
    ]
  },
  "/github": {
    public_repositories: 42,
    original_projects: 25,
    repository_stars: 18,
    followers: 36,
    languages: {
      JavaScript: 50,
      TypeScript: 27,
      Python: 9,
      Rust: 5,
      PowerShell: 5,
      Go: 5
    },
    note: "Public GitHub repositories count.",
    recent_activity: [
      {
        repo: "mbayue/gitSdm",
        date: "Sep 13",
        message: "fix: simulation stability, queue abort handling, endpoint retries, and manifest parser"
      },
      {
        repo: "mbayue/gitSdm",
        date: "Sep 14",
        message: "fix(dev): remove syntax brace in dev-api middleware"
      },
      {
        repo: "mbayue/gitSdm",
        date: "Sep 14",
        message: "update: server/dev-api.ts"
      },
      {
        repo: "mbayue/gitSdm",
        date: "Sep 14",
        message: "update: AGENTS.md"
      }
    ]
  },
  "/contact": {
    email: "bayu.erich@gmail.com",
    github: "https://github.com/mbayue",
    linkedin: "https://www.linkedin.com/in/bayuerich/",
    cv: "https://bayue.my.id/cv",
    status: "Available for backend roles, contracts, and conversations."
  },
  "/messages": {
    status: "201 Created",
    accepted: { channel: "email", address: "bayu.erich@gmail.com" },
    message: "Direct contact endpoint. Messages forward directly to bayu.erich@gmail.com.",
    next: "Send an email or use the terminal form below."
  }
};
