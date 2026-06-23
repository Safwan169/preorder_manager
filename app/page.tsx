import Link from "next/link";
import { FilterTabs } from "@/components/preorders/FilterTabs";
import { Pagination } from "@/components/preorders/Pagination";
import { PreorderTable } from "@/components/preorders/PreorderTable";
import { SortMenu } from "@/components/preorders/SortMenu";
import { getPreorders } from "@/lib/preorders";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function asString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PreordersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { items, total, page, pageCount, pageSize } = await getPreorders({
    status: asString(params.status),
    sort: asString(params.sort),
    direction: asString(params.direction),
    page: asString(params.page),
  });

  const rows = items.map((item) => ({
    ...item,
    startsAt: item.startsAt.toISOString(),
    endsAt: item.endsAt ? item.endsAt.toISOString() : null,
  }));

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Preorders</h1>
        <Link
          href="/preorders/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Create Preorder
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <FilterTabs />
          <SortMenu />
        </div>

        <PreorderTable preorders={rows} />

        <Pagination
          page={page}
          pageCount={pageCount}
          total={total}
          pageSize={pageSize}
        />
      </div>
    </main>
  );
}
