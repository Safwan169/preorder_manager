# Preorder Manager

A small app to manage product preorders — list them, create, edit, toggle active/inactive, and delete. Built with Next.js 16 and Prisma on SQLite.

## Running it locally

You'll need Node 20.9 or newer. Then:

```bash
npm install
cp .env.example .env       # on PowerShell: Copy-Item .env.example .env
npm run db:migrate         # sets up dev.db
npm run db:seed            # drops in some sample preorders
npm run dev
```

That's it — open http://localhost:3000.

If the database ever gets messy, `npm run db:reset` wipes it and starts fresh.

## A few notes

The list filters, sorting, and pagination all run on the server through the URL query string, so you can refresh or share a link and land on the same view. Eight rows per page.

The SQLite file (`dev.db`) isn't committed, so on a fresh clone just run the migrate and seed steps above to get it back.

## Scripts

- `npm run dev` — start developing
- `npm run build` — migrate + seed + production build (also what the host runs on deploy)
- `npm run start` — run the production build
- `npm run db:migrate` — create/update the database (local, interactive)
- `npm run db:deploy` — apply migrations non-interactively (used in deploys)
- `npm run db:seed` — add sample data (only seeds an empty database)
- `npm run db:reset` — start the database over

## Deploying

This app uses **SQLite** — the database is a file on disk. That means it needs a
host with a **persistent disk/volume**, so the file survives deploys and
restarts. Good fits: **Railway**, **Render** (paid disk), or **Fly.io**.
(Vercel's filesystem is ephemeral and would reset the database — not suitable.)

Two things make deploys hands-off:

- `DATABASE_URL` controls where the SQLite file lives. Point it at the persistent
  disk, e.g. `DATABASE_URL=file:/data/prod.db`.
- The `build` script runs `prisma migrate deploy && prisma db seed` before
  building, so the schema is applied and sample data is added automatically.
  The seed is idempotent — it only populates an **empty** database, so your live
  data survives future deploys (see `prisma/seed.ts`).

### Railway

1. Push this repo to GitHub.
2. On [railway.app](https://railway.app): **New Project → Deploy from GitHub repo**.
3. Add a **Volume** to the service, mounted at `/data`.
4. Add an environment variable: `DATABASE_URL=file:/data/prod.db`.
5. Deploy. `railway.json` sets the start command to `npm run deploy:start`
   (`prisma migrate deploy && next start`); seeding happens in the build step.
