import { PreorderWhen } from "@/app/generated/prisma/client";

export type PreorderInput = {
  name: string;
  products: number;
  preorderWhen: PreorderWhen;
  startsAt: Date;
  endsAt: Date | null;
  active: boolean;
};

export type ValidationResult =
  | { success: true; data: PreorderInput }
  | { success: false; errors: Record<string, string> };

export function parsePreorderForm(formData: FormData): ValidationResult {
  const errors: Record<string, string> = {};

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  if (!name) errors.name = "Name is required.";

  const products = Number(formData.get("products"));
  if (!Number.isInteger(products) || products < 1) {
    errors.products = "Products must be a whole number of at least 1.";
  }

  const preorderWhenRaw = formData.get("preorderWhen") as string | null;
  const preorderWhen = Object.values(PreorderWhen).includes(
    preorderWhenRaw as PreorderWhen,
  )
    ? (preorderWhenRaw as PreorderWhen)
    : null;
  if (!preorderWhen) errors.preorderWhen = "Select when customers can preorder.";

  const startsAt = parseDate(formData.get("startsAt") as string | null);
  if (!startsAt) errors.startsAt = "A start date is required.";

  const endsAtRaw = (formData.get("endsAt") as string | null)?.trim();
  const endsAt = endsAtRaw ? parseDate(endsAtRaw) : null;
  if (endsAtRaw && !endsAt) errors.endsAt = "End date is invalid.";
  if (startsAt && endsAt && endsAt <= startsAt) {
    errors.endsAt = "End date must be after the start date.";
  }

  const active = formData.get("active") === "on";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name,
      products,
      preorderWhen: preorderWhen!,
      startsAt: startsAt!,
      endsAt,
      active,
    },
  };
}

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
