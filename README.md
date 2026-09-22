# Bayu Erich Portfolio Website (porto)

A modern, interactive developer portfolio built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**. The UI pairs a charcoal and green palette with editorial typography, an architecture diagram, and a project-first layout.

## Features

- **Light / Dark Mode** — header toggle with a saved preference; charcoal and green remains the default.
- **Interactive Terminal** — an expandable shell in the About section with commands for profile, work, skills, projects, and contact.
- **GitHub Dashboard** — repository stats, stars, language breakdown, contribution-style metrics
- **Filterable Projects Grid** — category filters, project diagrams, accessible native dialogs, and curated content when GitHub is unavailable
- **Recent Activity Stream** — timeline-style GitHub activity display
- **Direct Contact** — email, LinkedIn, GitHub, and downloadable CV
- **Responsive UI** — mobile-first layout, accessible contrast, dark terminal visual system

## Tech Stack

- **Framework:** Next.js App Router
- **UI:** React, Tailwind CSS, Framer Motion, Lucide React
- **Language:** TypeScript
- **Package Manager:** Bun
- **Runtime:** Node.js
- **Container:** Docker / standalone Next.js output

## Project Structure

```text
porto/
├── public/                 # Static public assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout + metadata
│   │   └── page.tsx        # Main landing page
│   └── components/         # UI components
│       ├── ActivityFeed.tsx
│       ├── ContactConsole.tsx
│       ├── FeaturedProjects.tsx
│       ├── GithubDashboard.tsx
│       ├── ProjectDialog.tsx
│       └── TerminalHero.tsx
├── Dockerfile              # Production container image
├── next.config.ts          # Next.js config
├── package.json            # Scripts + dependencies
├── bun.lock                # Locked dependency graph
├── tsconfig.json           # TypeScript config
└── README.md
```

## Local Development

### Prerequisites

- Node.js 20+
- Bun 1.4+

### Install

```bash
bun install --frozen-lockfile
```

### Run Dev Server

```bash
bun run dev
```

Open:

```text
http://localhost:3000
```

### Build

```bash
bun run build
```

### Lint

```bash
bun run lint
```

## Environment Variables

Optional GitHub token support:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

## Docker

### Build Image

```bash
docker build -t porto .
```

### Run Container

```bash
docker run --rm -p 3000:3000 porto
```

Open:

```text
http://localhost:3000
```

The Dockerfile builds the app with Bun, uses Next.js standalone output, and runs the production server on port `3000`.

## Deployment

### Vercel

1. Import the GitHub repository in Vercel.
2. Use default Next.js settings.
3. Add env vars if needed.
4. Deploy.

### Docker Host / VPS

1. Build image:

```bash
docker build -t porto .
```

2. Run container:

```bash
docker run -d --name porto -p 3000:3000 porto
```

3. Put Nginx/Caddy/Traefik in front if using a custom domain and HTTPS.

### GitHub Pages Static Export

For static export, update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

Then build:

```bash
bun run build
```

Deploy the generated `out/` directory.

## Recent Fixes

- Escaped JSX quotes in `TerminalHero.tsx` to satisfy `react/no-unescaped-entities`.
- Fixed project dialog link nesting in `FeaturedProjects.tsx`.
- Added Docker production build support.
