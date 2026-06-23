import { notFound } from "next/navigation";
import { updatePreorder } from "@/app/actions";
import { PreorderForm } from "@/components/preorders/PreorderForm";
import { getPreorderById } from "@/lib/preorders";
import { resolveReturnTo } from "@/lib/returnTo";

type EditPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EditPreorderPage({
  params,
  searchParams,
}: EditPageProps) {
  const { id } = await params;
  const preorder = await getPreorderById(id);
  if (!preorder) notFound();

  const { from } = await searchParams;
  const returnTo = resolveReturnTo(from);
  const action = updatePreorder.bind(null, id);

  return (
    <main className="min-h-full">
      <PreorderForm action={action} preorder={preorder} returnTo={returnTo} />
    </main>
  );
}
