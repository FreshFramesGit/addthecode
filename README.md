# ff-astro-sanity-template

Fresh Frames starter template for Astro + Sanity + Vercel projects.

Current release: `v1.2.0`
Last audited: `2026-04-19`

This is the shared baseline for `ff-www` and `webflow-migration`. The template is intentionally opinionated about the repeatable core, but it should not absorb every project-specific integration by default. Use the governance docs in [`docs/`](docs/README.md) to decide what belongs in the core template, what should stay optional, and what should remain project-only.

## Read This First

Before changing anything in a copied project, read these files in order:

1. [`README.md`](README.md)
2. [`docs/README.md`](docs/README.md)
3. [`docs/template-governance.md`](docs/template-governance.md)
4. [`docs/optional-module-catalog.md`](docs/optional-module-catalog.md)
5. The current audit linked from [`docs/README.md`](docs/README.md)

Then record the copied template release in `discovery/notes.md` and list selected optional modules or deviations in `discovery/settings-and-integrations.md`.

## Structure

```text
├── astro-app/    Astro frontend (default Vercel deploy root)
├── studio/       Sanity Studio workspace
├── discovery/    Project artifacts, decisions, and kickoff checklists
├── docs/         Template governance, audits, and release guidance
└── scripts/      Seed data and QA helpers
```

## Quick Start

1. **Copy the template** to a new project directory.
2. **Read the governance docs** in `docs/` and record `v1.2.0` in `discovery/notes.md`.
3. **Create a Sanity project** at [sanity.io/manage](https://www.sanity.io/manage).
4. **Configure environment**:
   ```bash
   cp astro-app/.env.example astro-app/.env
   cp studio/.env.example studio/.env
   # Fill in your Sanity project ID, dataset, URLs, and tokens
   ```
5. **Classify project needs** in `discovery/settings-and-integrations.md`.
   Capture domains, SEO signals, tracking, forms, Turnstile, rich media, syncs, and any optional modules before Phase 1 modeling starts.
6. **Install dependencies**:
   ```bash
   npm run install:all
   ```
7. **Add CORS origins** at sanity.io/manage -> API -> CORS Origins:
   - `http://localhost:4321` (allow credentials)
   - `http://localhost:3333` (usually auto-added for Studio)
8. **Start dev servers**:
   ```bash
   npm run dev:all
   # Astro: http://localhost:4321
   # Studio: http://localhost:3333
   ```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Astro dev server |
| `npm run studio` | Start Sanity Studio |
| `npm run dev:all` | Start both servers |
| `npm run build` | Build Astro for production |
| `npm run install:all` | Install deps in both workspaces |
| `npm run typegen` | Generate TypeScript types from Sanity schemas |

## Environment Variables

Each workspace has its own `.env.example`:
- `astro-app/.env.example` for frontend vars (`PUBLIC_*` and server-only secrets)
- `studio/.env.example` for Studio vars (`SANITY_STUDIO_*`)

The root `.env.example` is only the shared overview. Project-specific provider names, secret names, and optional modules must be captured in `discovery/settings-and-integrations.md` and reflected in the real workspace `.env` files.

The starter now also ships:
- a shared site URL helper for canonicals, robots, and sitemap generation
- secure contact-form backend primitives with Turnstile, honeypot, Sanity-first storage, and optional webhook fanout
- a reusable [`TurnstileField.astro`](astro-app/src/components/forms/TurnstileField.astro) primitive for future form UIs

## Deployment

- Default Vercel deploy root: `astro-app/`
- In monorepos, link from the repo root and build/deploy from `astro-app/`
- Set all required frontend env vars from `astro-app/.env.example`
- If the project embeds Studio at `/admin`, also set the required `SANITY_STUDIO_*` vars in production
- Keep runtime host/canonical decisions env-driven instead of hardcoding production domains in source

## Governance And Versioning

- Template version source of truth: root [`package.json`](package.json)
- Release notes and operating rules live in [`docs/README.md`](docs/README.md) and [`docs/template-governance.md`](docs/template-governance.md)
- Optional feature choices live in [`docs/optional-module-catalog.md`](docs/optional-module-catalog.md)
- Run a template audit after every 3 completed projects or every 4-6 weeks, whichever comes first
- Promote learnings using the governance buckets: `core template`, `optional module`, `docs only`, or `project-specific`
- Do not add a new feature to the core template just because one project needed it

## Skills

This template is used by:
- [`ff-www`](/Users/alex/.agents/skills/ff-www/SKILL.md) for greenfield Astro + Sanity projects
- [`webflow-migration`](/Users/alex/.agents/skills/webflow-migration/SKILL.md) for Webflow to Astro + Sanity migrations
