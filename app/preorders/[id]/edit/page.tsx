import { notFound } from "next/navigation";
import { updatePreorder } from "@/app/actions";
import { PreorderForm } from "@/components/preorders/PreorderForm";
import { getPreorderById } from "@/lib/preorders";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPreorderPage({ params }: EditPageProps) {
  const { id } = await params;
  const preorder = await getPreorderById(id);
  if (!preorder) notFound();

  const action = updatePreorder.bind(null, id);

  return (
    <main className="min-h-full">
      <PreorderForm action={action} preorder={preorder} />
    </main>
  );
}
