# bayue.my.id

Developer portfolio structured as an interactive **HTTP API Console** with an editorial brutalist monochrome design. Built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## Architecture & Features

- **Interactive API Console (`/`)** — Explorable JSON/Card endpoints simulating a live REST API (`/`, `/about`, `/architecture`, `/projects`, `/experience`, `/skills`, `/github`, `/contact`).
- **Real REST API Routes (`/api/...`)** — Next.js Route Handlers delivering actual JSON payloads with CORS and health telemetry.
- **Print-Ready CV (`/cv`)** — Clean editorial printable curriculum vitae with compact density toggle and `@media print` styling.
- **Live GitHub Integration** — Fetches recent push events and resolves real commit messages via GitHub REST API with `GITHUB_PAT` / `GITHUB_TOKEN`.
- **WCAG AA Compliant** — High contrast monochrome palette (`#000000`, `#8a8a8a`, `#EDEDED`), verified zero horizontal overflow across 320px–1440px viewports.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Standalone Output)
- **UI & Styling:** React 19, Tailwind CSS v4, Lucide React
- **Language:** TypeScript 5
- **Package Manager:** Bun
- **Container:** Docker (`oven/bun:1-alpine` build, `node:22-alpine` runner)

## Project Structure

```text
porto/
├── public/                 # Static assets (favicons, icons)
├── src/
│   ├── app/
│   │   ├── api/            # Live REST API route handlers
│   │   │   ├── [...route]/ # Dynamic endpoint dispatcher
│   │   │   └── route.ts    # Service root handler
│   │   ├── cv/             # Printable CV page (/cv)
│   │   │   └── page.tsx
│   │   ├── globals.css     # Tailwind v4 theme & print rules
│   │   ├── layout.tsx      # Root metadata & fonts
│   │   └── page.tsx        # Interactive API Console UI
│   ├── data/
│   │   ├── apiData.ts      # Canonical endpoint datasets & schemas
│   │   └── profile.ts      # Core profile, bio, and social links
│   └── lib/
│       └── github.ts       # GitHub REST client with commit lookup
├── Dockerfile              # Multi-stage Bun production container
├── next.config.ts          # Standalone output configuration
├── package.json            # Scripts & dependencies
├── bun.lock                # Locked dependency tree
└── tsconfig.json           # TypeScript configuration
```

## Local Development

### Prerequisites

- [Bun](https://bun.sh) 1.2+ (or Node.js 20+)

### Install Dependencies

```bash
bun install --frozen-lockfile
```

### Environment Variables

Create a `.env` or `.env.local` file:

```env
# Optional: GitHub Personal Access Token to avoid rate limits on /github
GITHUB_PAT=your_github_pat_token
```

### Run Dev Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

### Build & Typecheck

```bash
bun run build
bun run lint
```

## Docker

### Build Image

```bash
docker build -t porto .
```

### Run Container

```bash
docker run -d --name porto -p 3000:3000 porto
```

Access at [http://localhost:3000](http://localhost:3000).

## Deployment

- **Vercel / Cloudflare:** Import repository directly. Next.js App Router defaults apply automatically.
- **Docker VPS / Fly.io / Coolify:** Run the multi-stage Docker image using standalone output on port 3000.
