import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const preorders = [
  {
    name: "Multi variant 3",
    products: 1,
    preorderWhen: "OUT_OF_STOCK" as const,
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: null,
    active: false,
  },
  {
    name: "Multi variant 2",
    products: 1,
    preorderWhen: "REGARDLESS_OF_STOCK" as const,
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: new Date("2025-12-15T20:27:00"),
    active: true,
  },
  {
    name: "Multi variants 1",
    products: 1,
    preorderWhen: "REGARDLESS_OF_STOCK" as const,
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: null,
    active: true,
  },
  {
    name: "Partial payment",
    products: 1,
    preorderWhen: "REGARDLESS_OF_STOCK" as const,
    startsAt: new Date("2025-08-17T16:56:00"),
    endsAt: null,
    active: true,
  },
  {
    name: "Shipping not sure",
    products: 1,
    preorderWhen: "REGARDLESS_OF_STOCK" as const,
    startsAt: new Date("2025-08-17T16:56:00"),
    endsAt: null,
    active: true,
  },
  {
    name: "Full payment",
    products: 1,
    preorderWhen: "REGARDLESS_OF_STOCK" as const,
    startsAt: new Date("2025-08-17T16:56:00"),
    endsAt: null,
    active: true,
  },
  {
    name: "Coming soon",
    products: 1,
    preorderWhen: "REGARDLESS_OF_STOCK" as const,
    startsAt: new Date("2025-12-11T04:42:00"),
    endsAt: null,
    active: true,
  },
  {
    name: "With ends",
    products: 1,
    preorderWhen: "REGARDLESS_OF_STOCK" as const,
    startsAt: new Date("2025-08-14T15:59:00"),
    endsAt: null,
    active: true,
  },
];

async function main() {
  await prisma.preorder.deleteMany();

  for (const data of [...preorders].reverse()) {
    await prisma.preorder.create({ data });
  }

  console.log(`Seeded ${preorders.length} preorders.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
