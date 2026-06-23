import { createPreorder } from "@/app/actions";
import { PreorderForm } from "@/components/preorders/PreorderForm";

export default function NewPreorderPage() {
  return (
    <main className="min-h-full">
      <PreorderForm action={createPreorder} />
    </main>
  );
}
