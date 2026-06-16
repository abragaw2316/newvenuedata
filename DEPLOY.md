# Deploying New Venue Data

How to ship the New Venue Data site to Vercel. **The build is verified locally and
ready to deploy** — the only steps left require your GitHub + Vercel accounts, so
the exact commands are below for you to run.

> **TL;DR:** push this repo to GitHub → import it in Vercel → set **Root Directory =
> `licensesignal`** → deploy.

---

## What gets deployed (and what doesn't)

This is a **monorepo** with two independent parts:

| Path | What | Deployed to Vercel? |
|---|---|---|
| `licensesignal/` | The Next.js 16 site + API (the product) | ✅ Yes — this is the app |
| `data-pipeline/` | Standalone Node ingestion (runs in CI / locally) | ❌ No — not part of the web app |
| `research/`, `*.md` | Founding research + notes | ❌ No |

The API serves the **committed** data files at `licensesignal/data/licenses.json`
(~35 MB) and `signals.json`. **The pipeline does NOT run on Vercel** — those JSON
files are produced locally / in CI by `data-pipeline` and committed to the repo, then
shipped with the serverless functions via `next.config.ts` `outputFileTracingIncludes`.
This is why they are intentionally **not** git-ignored.

### Why Root Directory = `licensesignal` (and config lives there, not at repo root)

The Next app is in a subdirectory. Vercel resolves the framework, build, and
`vercel.json` **relative to the project's Root Directory** — and there is no
`rootDirectory` field you can set from a repo-root `vercel.json`. So the correct
pattern for a subdirectory app is to set the **Root Directory** to `licensesignal`
in project settings; Vercel then treats it as the app root, auto-detects Next.js 16,
and reads `licensesignal/vercel.json`. The `data-pipeline/` folder is simply outside
the Root Directory and is never uploaded to the build.

---

## Prerequisites

- A **GitHub** account + a new empty repo (e.g. `licensesignal`).
- A **Vercel** account (the Hobby/free tier is fine to start).
- Optional: the Vercel CLI — `npm i -g vercel`.

---

## Step 1 — Push to GitHub

From the repo root (`Public-Data-API-Business/`):

```bash
git add -A
git commit -m "New Venue Data: site + live data pipeline + full-dataset API"
git branch -M main
git remote add origin https://github.com/<you>/<your-repo>.git
git push -u origin main
```

> The first push includes the ~35 MB `licensesignal/data/licenses.json`. That's
> expected (see the data-as-a-flat-file note below). It is well under GitHub's
> 100 MB per-file hard limit; GitHub may print a >50 MB advisory warning — that's
> fine.

## Step 2 — Deploy on Vercel

### Option A — Dashboard (recommended)

1. **vercel.com → Add New → Project → Import** your GitHub repo.
2. **Set Root Directory to `licensesignal`** (the "Edit" link next to Root
   Directory on the import screen). This is the one setting that matters.
3. Framework auto-detects as **Next.js**. Leave Build/Install commands on their
   defaults. No env vars are required.
4. **Deploy.** First build is a few minutes; subsequent pushes auto-deploy.

### Option B — Vercel CLI

```bash
cd licensesignal        # deploy from the app root
vercel                  # first run links the project — accept defaults; it infers Root Directory
vercel --prod           # promote to production
```

## Step 3 — (Optional) Enable the nightly data refresh

`.github/workflows/data-refresh.yml` (daily cron `0 9 * * *`) runs the pipeline,
regenerates `licensesignal/lib/real-data.ts` + `signals.ts` + `data/*.json`, and
commits them. Once the repo is on GitHub the workflow is active; each commit it makes
triggers a fresh Vercel deploy automatically. Nothing to configure — it uses the
default `GITHUB_TOKEN`. (Sunbiz SFTP is optional and skips gracefully.)

---

## Verified locally (before handing off)

- `npm run build` → clean; **all 5 API routes are dynamic (ƒ)**; the data JSON is
  traced into each function bundle (confirmed in the `.nft.json` traces).
- `npm run typecheck` → clean. `npm test` → **39 passing**.
- `npx next start` → endpoints serve the full dataset live (`/api/stats` reports
  `totalRecords: 59004`, `newFilings: 7870`, 67 counties).

Run them yourself any time:

```bash
cd licensesignal
npm install
npm run build && npm start     # production server on http://localhost:3000
```

---

## Known tradeoff — data ships as a flat file (stopgap)

The API reads the full ~59k-record dataset from a committed 35 MB JSON file, parsed
once per serverless instance (memoized). This keeps the stack dependency-free and
deploys with zero infra, but:

- It **bloats the git repo** (~35 MB added per data refresh that changes it).
- It adds **cold-start latency + memory** (the array is held in each function
  instance's heap). Default function memory (1024 MB) is sufficient today; if you
  ever see OOM, bump it via `vercel.json` `functions` config.

The honest long-term fix is a real database (Postgres/SQLite) once query volume or
freshness needs grow — see `handoff.md` TODO-A. The flat file is the documented
stopgap, not the destination.
