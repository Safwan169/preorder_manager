import { createPreorder } from "@/app/actions";
import { PreorderForm } from "@/components/preorders/PreorderForm";
import { resolveReturnTo } from "@/lib/returnTo";

type NewPreorderPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewPreorderPage({
  searchParams,
}: NewPreorderPageProps) {
  const params = await searchParams;
  const returnTo = resolveReturnTo(params.from);

  return (
    <main className="min-h-full">
      <PreorderForm action={createPreorder} returnTo={returnTo} />
    </main>
  );
}
