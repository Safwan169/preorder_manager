"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parsePreorderForm } from "@/lib/validation";

export type FormState = {
  errors?: Record<string, string>;
};

function safeReturnTo(formData: FormData): string {
  const raw = formData.get("returnTo");
  if (typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }
  return "/";
}

export async function createPreorder(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = parsePreorderForm(formData);
  if (!result.success) {
    return { errors: result.errors };
  }

  try {
    await prisma.preorder.create({ data: result.data });
  } catch {
    return { errors: { form: "Could not create the preorder. Please try again." } };
  }

  const returnTo = safeReturnTo(formData);
  revalidatePath("/");
  redirect(returnTo);
}

export async function updatePreorder(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = parsePreorderForm(formData);
  if (!result.success) {
    return { errors: result.errors };
  }

  try {
    await prisma.preorder.update({ where: { id }, data: result.data });
  } catch {
    return { errors: { form: "Could not save changes. The preorder may no longer exist." } };
  }

  const returnTo = safeReturnTo(formData);
  revalidatePath("/");
  redirect(returnTo);
}

export async function togglePreorderStatus(id: string, active: boolean) {
  await prisma.preorder.update({ where: { id }, data: { active } });
  revalidatePath("/");
}

export async function deletePreorder(id: string) {
  await prisma.preorder.delete({ where: { id } });
  revalidatePath("/");
}
