"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

type PaginationProps = {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
};

export function Pagination({ page, pageCount, total, pageSize }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  function goTo(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center justify-center gap-4 border-t border-neutral-200 bg-neutral-50 px-4 py-3">
      <NavButton
        ariaLabel="Previous page"
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
      >
        <ChevronLeftIcon />
      </NavButton>

      <span className="text-sm font-semibold text-neutral-700">
        Showing {from} to {to} from {total}
      </span>

      <NavButton
        ariaLabel="Next page"
        disabled={page >= pageCount}
        onClick={() => goTo(page + 1)}
      >
        <ChevronRightIcon />
      </NavButton>
    </div>
  );
}

function NavButton({
  children,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-neutral-600 transition-colors",
        "hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-neutral-100",
      )}
    >
      {children}
    </button>
  );
}
