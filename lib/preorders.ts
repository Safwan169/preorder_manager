import { prisma } from "@/lib/prisma";
import {
  PAGE_SIZE,
  SORT_DIRECTIONS,
  SORT_FIELDS,
  STATUS_FILTERS,
  type Preorder,
  type SortDirection,
  type SortField,
  type StatusFilter,
} from "@/lib/types";
import type { Prisma } from "@/app/generated/prisma/client";

export type ListParams = {
  status?: string;
  sort?: string;
  direction?: string;
  page?: string;
};

export type ListResult = {
  items: Preorder[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
};

function pick<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function buildWhere(status: StatusFilter): Prisma.PreorderWhereInput {
  if (status === "active") return { active: true };
  if (status === "inactive") return { active: false };
  return {};
}

export async function getPreorders(params: ListParams): Promise<ListResult> {
  const status = pick<StatusFilter>(params.status, STATUS_FILTERS, "all");
  const sort = pick<SortField>(params.sort, SORT_FIELDS, "createdAt");
  const direction = pick<SortDirection>(
    params.direction,
    SORT_DIRECTIONS,
    "desc",
  );

  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const where = buildWhere(status);
  const total = await prisma.preorder.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  const items = await prisma.preorder.findMany({
    where,
    orderBy: { [sort]: direction },
    skip: (safePage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return { items, total, page: safePage, pageCount, pageSize: PAGE_SIZE };
}

export function getPreorderById(id: string): Promise<Preorder | null> {
  return prisma.preorder.findUnique({ where: { id } });
}
