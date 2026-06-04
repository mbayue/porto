# Bayu Erich Portfolio Website (porto)

A modern, interactive developer portfolio built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**. The UI uses a **Vibrant Block Terminal IDE** style in Slate Dark Mode with Run Green accents.

## Features

- **Interactive Terminal Hero** — simulated shell commands: `help`, `about`, `projects`, `skills`, `activity`, `secret`
- **GitHub Dashboard** — repository stats, stars, language breakdown, contribution-style metrics
- **Filterable Projects Grid** — category filters, hover states, project dialogs
- **Recent Activity Stream** — timeline-style GitHub activity display
- **Contact Console** — terminal-inspired contact form
- **Responsive UI** — mobile-first layout, accessible contrast, dark terminal visual system

## Tech Stack

- **Framework:** Next.js App Router
- **UI:** React, Tailwind CSS, Framer Motion, Lucide React
- **Language:** TypeScript
- **Package Manager:** pnpm
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
├── pnpm-lock.yaml          # Locked dependency graph
├── tsconfig.json           # TypeScript config
└── README.md
```

## Local Development

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install

```bash
pnpm install --ignore-scripts
```

### Run Dev Server

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
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

The Dockerfile builds the app with pnpm, uses Next.js standalone output, and runs the production server on port `3000`.

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
pnpm build
```

Deploy the generated `out/` directory.

## Recent Fixes

- Escaped JSX quotes in `TerminalHero.tsx` to satisfy `react/no-unescaped-entities`.
- Fixed project dialog link nesting in `FeaturedProjects.tsx`.
- Added Docker production build support.