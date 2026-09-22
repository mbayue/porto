# bayue.my.id

Personal portfolio and public API for Bayu Erich. Works in the browser or via curl.

Live at [bayue.my.id](https://bayue.my.id).

## Endpoints

Every route returns JSON when requested through `/api` or inspectable through the web UI.

| Endpoint | Description |
| --- | --- |
| `/api` | Root status, response time, and available routes |
| `/api/about` | Background, education, and current focus |
| `/api/architecture` | System design, data flow, and runtime stack |
| `/api/projects` | Production apps and open-source tools with links and metrics |
| `/api/experience` | Work history and engineering roles |
| `/api/skills` | Languages, runtimes, frameworks, and tools |
| `/api/github` | Public GitHub push events with commit messages |
| `/api/contact` | Email, LinkedIn, GitHub, and PGP key |

Query directly:

```bash
# Service status
curl -s https://bayue.my.id/api

# Projects list
curl -s https://bayue.my.id/api/projects

# Live commit feed
curl -s https://bayue.my.id/api/github
```

## Pages

- `/` Web console with live route switching, JSON tree inspection, and formatted card views.
- `/cv` Printable CV with clean type, compact toggle, and custom print styles (`Ctrl+P`).

## Tech Stack

- **Framework:** Next.js 16 (App Router, standalone output)
- **Frontend:** React 19, Tailwind CSS v4, Lucide icons
- **Language:** TypeScript 5
- **Package Manager:** Bun
- **Container:** Docker (`oven/bun:1-alpine` build, `node:22-alpine` run)

## Project Structure

```text
porto/
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── api/            # Route handlers for /api and /api/[...route]
│   │   ├── cv/             # Printable resume page
│   │   ├── globals.css     # Tailwind v4 imports and print overrides
│   │   ├── layout.tsx      # Root layout, metadata, fonts
│   │   └── page.tsx        # API console web interface
│   ├── data/
│   │   ├── apiData.ts      # Endpoint content and responses
│   │   └── profile.ts      # Core bio and social links
│   └── lib/
│       └── github.ts       # GitHub API client with commit resolution
├── Dockerfile              # Multi-stage production container
├── next.config.ts          # Standalone build settings
├── package.json
└── bun.lock
```

## Local Setup

### Requirements

- Bun 1.2+

### Run Locally

```bash
# Install dependencies
bun install --frozen-lockfile

# Optional: Add GitHub token for higher API rate limits
echo "GITHUB_PAT=your_token_here" > .env.local

# Start dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
bun run build
bun run lint
```

## Docker

Build the image:

```bash
docker build -t porto .
```

Run the container:

```bash
docker run -d --name porto -p 3000:3000 porto
```

Test the running instance:

```bash
curl http://localhost:3000/api
```

## License

MIT
