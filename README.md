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
- `npm run build` / `npm run start` — production build and run
- `npm run db:migrate` — create/update the database
- `npm run db:seed` — add sample data
- `npm run db:reset` — start the database over
