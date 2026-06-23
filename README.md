# Preorder Manager

Manage product preorders — list, create, edit, toggle status, and delete. Built with Next.js 16 and Prisma on SQLite.

## Getting started

Node 20.9 or newer is required.

```bash
npm install
cp .env.example .env       # PowerShell: Copy-Item .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Open http://localhost:3000. If the database ever gets into a bad state, `npm run db:reset` wipes it and starts fresh.

## A few notes

Filters, sorting, and pagination are all handled server-side via URL query params — so refreshing or sharing a link lands you on the same view. Eight rows per page.

The SQLite file (`dev.db`) is gitignored. On a fresh clone, the migrate and seed steps above are all you need to get data in.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run db:migrate` | Create or update the database |
| `npm run db:seed` | Add sample preorders |
| `npm run db:reset` | Wipe and restart the database |
