"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { STATUS_FILTERS, type StatusFilter } from "@/lib/types";

const TAB_LABELS: Record<StatusFilter, string> = {
  all: "All",
  active: "Active",
  inactive: "Inactive",
};

export function FilterTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = (searchParams.get("status") as StatusFilter) ?? "all";

  function hrefFor(status: StatusFilter) {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") params.delete("status");
    else params.set("status", status);
    params.delete("page");
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <div className="flex items-center gap-1">
      {STATUS_FILTERS.map((status) => {
        const isActive = current === status;
        return (
          <Link
            key={status}
            href={hrefFor(status)}
            scroll={false}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-neutral-200 text-neutral-900"
                : "text-neutral-500 hover:text-neutral-900",
            )}
          >
            {TAB_LABELS[status]}
          </Link>
        );
      })}
    </div>
  );
}
