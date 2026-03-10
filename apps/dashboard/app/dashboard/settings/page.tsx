import { PageShell } from "@/components/page-shell";

export default function SettingsPage() {
  return (
    <PageShell title="Store Settings">
      <ul className="list-disc space-y-2 pl-6 text-slate-600">
        <li>Delivery zones and fees</li>
        <li>Payment methods (COD, card, transfer)</li>
        <li>Opening hours and policy summaries</li>
      </ul>
    </PageShell>
  );
}
