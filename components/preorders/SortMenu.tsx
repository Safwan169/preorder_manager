"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  SORT_FIELDS,
  SORT_FIELD_LABELS,
  type SortDirection,
  type SortField,
} from "@/lib/types";
import { ArrowDownIcon, ArrowUpIcon, SortIcon } from "@/components/ui/icons";

export function SortMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sort = (searchParams.get("sort") as SortField) ?? "createdAt";
  const direction = (searchParams.get("direction") as SortDirection) ?? "desc";

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function update(next: { sort?: SortField; direction?: SortDirection }) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", next.sort ?? sort);
    params.set("direction", next.direction ?? direction);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Sort"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50"
      >
        <SortIcon />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
          <p className="px-2 py-1 text-sm font-medium text-neutral-900">Sort by</p>
          <div className="mt-1 space-y-0.5">
            {SORT_FIELDS.map((field) => (
              <label
                key={field}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <input
                  type="radio"
                  name="sort"
                  checked={sort === field}
                  onChange={() => update({ sort: field })}
                  className="h-4 w-4 accent-neutral-900"
                />
                {SORT_FIELD_LABELS[field]}
              </label>
            ))}
          </div>

          <div className="my-2 h-px bg-neutral-100" />

          <DirectionRow
            label="Ascending"
            icon={<ArrowUpIcon />}
            active={direction === "asc"}
            onClick={() => update({ direction: "asc" })}
          />
          <DirectionRow
            label="Descending"
            icon={<ArrowDownIcon />}
            active={direction === "desc"}
            onClick={() => update({ direction: "desc" })}
          />
        </div>
      )}
    </div>
  );
}

function DirectionRow({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-neutral-100 text-neutral-900"
          : "text-neutral-700 hover:bg-neutral-50",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
