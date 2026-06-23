"use client";

import { useEffect, useMemo, useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deletePreorder, togglePreorderStatus } from "@/app/actions";
import { Checkbox } from "@/components/ui/Checkbox";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Switch } from "@/components/ui/Switch";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { PREORDER_WHEN_OPTIONS, type Preorder } from "@/lib/types";

type SerializedPreorder = Omit<Preorder, "startsAt" | "endsAt"> & {
  startsAt: string;
  endsAt: string | null;
};

const iconButtonClass =
  "flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-800";

const WHEN_LABELS = Object.fromEntries(
  PREORDER_WHEN_OPTIONS.map((option) => [option.value, option.label]),
);

export function PreorderTable({ preorders }: { preorders: SerializedPreorder[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [removed, setRemoved] = useState<Set<string>>(new Set());

  const dataKey = preorders.map((p) => p.id).join(",");
  useEffect(() => {
    setSelected(new Set());
    setRemoved(new Set());
  }, [dataKey]);

  const rows = preorders.filter((p) => !removed.has(p.id));
  const ids = useMemo(() => rows.map((p) => p.id), [rows]);
  const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));
  const someSelected = ids.some((id) => selected.has(id));

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(ids) : new Set());
  }

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-medium text-neutral-500">
            <th className="w-12 px-4 py-3">
              <Checkbox
                aria-label="Select all"
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={toggleAll}
              />
            </th>
            <th className="px-2 py-3">Name</th>
            <th className="px-2 py-3">Products</th>
            <th className="px-2 py-3">Preorder when</th>
            <th className="px-2 py-3">Starts at</th>
            <th className="px-2 py-3">Ends at</th>
            <th className="px-2 py-3">Status</th>
            <th className="px-2 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-16 text-center text-neutral-400">
                No preorders found.
              </td>
            </tr>
          ) : (
            rows.map((preorder) => (
              <PreorderRow
                key={preorder.id}
                preorder={preorder}
                selected={selected.has(preorder.id)}
                onSelect={(checked) => toggleRow(preorder.id, checked)}
                onRemoved={() =>
                  setRemoved((prev) => new Set(prev).add(preorder.id))
                }
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function PreorderRow({
  preorder,
  selected,
  onSelect,
  onRemoved,
}: {
  preorder: SerializedPreorder;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onRemoved: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [active, setOptimisticActive] = useOptimistic(preorder.active);

  function onToggle(next: boolean) {
    startTransition(async () => {
      setOptimisticActive(next);
      try {
        await togglePreorderStatus(preorder.id, next);
        toast.success(
          `"${preorder.name}" is now ${next ? "active" : "inactive"}.`,
        );
      } catch {
        toast.error("Could not update status.");
      }
    });
  }

  function onConfirmDelete() {
    setConfirmOpen(false);
    onRemoved();
    startTransition(async () => {
      try {
        await deletePreorder(preorder.id);
        toast.success(`"${preorder.name}" deleted.`);
        router.refresh();
      } catch {
        toast.error("Could not delete preorder.");
      }
    });
  }

  return (
    <tr className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60">
      <td className="px-4 py-4">
        <Checkbox
          aria-label={`Select ${preorder.name}`}
          checked={selected}
          onCheckedChange={onSelect}
        />
      </td>
      <td className="px-2 py-4 font-semibold text-neutral-900">{preorder.name}</td>
      <td className="px-2 py-4 text-neutral-600">{preorder.products}</td>
      <td className="px-2 py-4 text-neutral-600">
        {WHEN_LABELS[preorder.preorderWhen]}
      </td>
      <td className="px-2 py-4 text-neutral-600">
        {formatDateTime(preorder.startsAt)}
      </td>
      <td className="px-2 py-4 text-neutral-600">
        {preorder.endsAt ? formatDateTime(preorder.endsAt) : ""}
      </td>
      <td className="px-2 py-4">
        <Switch
          aria-label={`Toggle status for ${preorder.name}`}
          checked={active}
          disabled={pending}
          onCheckedChange={onToggle}
        />
      </td>
      <td className="px-2 py-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/preorders/${preorder.id}/edit`}
            aria-label={`Edit ${preorder.name}`}
            className={iconButtonClass}
          >
            <PencilIcon width={17} height={17} />
          </Link>
          <button
            type="button"
            aria-label={`Delete ${preorder.name}`}
            disabled={pending}
            onClick={() => setConfirmOpen(true)}
            className={cn(iconButtonClass, "disabled:opacity-50")}
          >
            <TrashIcon width={17} height={17} />
          </button>
        </div>

        <ConfirmDialog
          open={confirmOpen}
          title="Delete preorder"
          description={`Delete "${preorder.name}"? This action cannot be undone.`}
          pending={pending}
          onConfirm={onConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      </td>
    </tr>
  );
}
