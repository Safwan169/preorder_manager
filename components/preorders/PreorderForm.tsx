"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormState } from "@/app/actions";
import { Switch } from "@/components/ui/Switch";
import { ChevronLeftIcon, SpinnerIcon } from "@/components/ui/icons";
import { toDateTimeLocal } from "@/lib/format";
import { PREORDER_WHEN_OPTIONS, type Preorder } from "@/lib/types";

type PreorderFormProps = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  preorder?: Preorder;
};

export function PreorderForm({ action, preorder }: PreorderFormProps) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  const [active, setActive] = useState(preorder?.active ?? true);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
        >
          <ChevronLeftIcon width={16} height={16} />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <CancelButton />
          <SubmitButton />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5">
          <h2 className="text-base font-bold text-neutral-900">Preorder details</h2>
          <p className="mt-1 text-sm text-neutral-500">
            These values appear in the preorders list.
          </p>
        </div>

        {errors.form && (
          <p className="mx-6 mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.form}
          </p>
        )}

        <div className="divide-y divide-neutral-100 px-6">
          <Field
            label="Name"
            required
            description="A label to recognize this preorder by."
            error={errors.name}
          >
            <input
              name="name"
              type="text"
              defaultValue={preorder?.name ?? ""}
              className={inputClass}
            />
          </Field>

          <Field
            label="Products"
            description="Number of products covered by this preorder."
            error={errors.products}
          >
            <div className="flex items-center gap-3">
              <input
                name="products"
                type="number"
                min={1}
                step={1}
                defaultValue={preorder?.products ?? 1}
                className={`${inputClass} w-32`}
              />
              <span className="text-sm text-neutral-500">product(s)</span>
            </div>
          </Field>

          <Field
            label="Preorder when"
            description="When customers are allowed to preorder."
            error={errors.preorderWhen}
          >
            <select
              name="preorderWhen"
              defaultValue={preorder?.preorderWhen ?? "REGARDLESS_OF_STOCK"}
              className={inputClass}
            >
              {PREORDER_WHEN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Starts at"
            description="When the preorder window opens."
            error={errors.startsAt}
          >
            <input
              name="startsAt"
              type="datetime-local"
              defaultValue={toDateTimeLocal(preorder?.startsAt ?? null)}
              className={inputClass}
            />
          </Field>

          <Field
            label="Ends at"
            description="Leave empty for no end date."
            error={errors.endsAt}
          >
            <input
              name="endsAt"
              type="datetime-local"
              defaultValue={toDateTimeLocal(preorder?.endsAt ?? null)}
              className={inputClass}
            />
          </Field>

          <Field
            label="Status"
            description="Active preorders are visible to customers."
          >
            <div className="flex items-center gap-3">
              <Switch
                aria-label="Active status"
                checked={active}
                onCheckedChange={setActive}
              />
              <span className="text-sm text-neutral-500">
                {active ? "Active" : "Inactive"}
              </span>
              <input
                type="checkbox"
                name="active"
                checked={active}
                readOnly
                hidden
              />
            </div>
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-neutral-100 px-6 py-4">
          <CancelButton />
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

const inputClass =
  "w-full max-w-md rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";

function Field({
  label,
  required,
  description,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  description: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 py-6 md:grid-cols-[260px_1fr]">
      <div>
        <p className="text-sm font-semibold text-neutral-900">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </p>
        <p className="mt-1 text-sm text-neutral-500">{description}</p>
      </div>
      <div>
        {children}
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

function CancelButton() {
  const router = useRouter();
  const { pending } = useFormStatus();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => router.push("/")}
      className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 disabled:opacity-50"
    >
      Cancel
    </button>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
    >
      {pending && <SpinnerIcon width={16} height={16} />}
      {pending ? "Saving..." : "Save changes"}
    </button>
  );
}
