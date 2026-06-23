import type { Preorder } from "@/app/generated/prisma/client";

export type { Preorder };

export const STATUS_FILTERS = ["all", "active", "inactive"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export const SORT_FIELDS = ["name", "createdAt", "startsAt", "endsAt"] as const;
export type SortField = (typeof SORT_FIELDS)[number];

export const SORT_DIRECTIONS = ["asc", "desc"] as const;
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export const PREORDER_WHEN_OPTIONS = [
  { value: "REGARDLESS_OF_STOCK", label: "regardless-of-stock" },
  { value: "OUT_OF_STOCK", label: "out-of-stock" },
] as const;

export const PAGE_SIZE = 8;

export const SORT_FIELD_LABELS: Record<SortField, string> = {
  name: "Name",
  createdAt: "Created At",
  startsAt: "Starts At",
  endsAt: "Ends At",
};
