import { PageShell } from "@/components/page-shell";

export default function AnalyticsPage() {
  return (
    <PageShell title="Basic Analytics">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded border bg-white p-4">Total conversations: 128</div>
        <div className="rounded border bg-white p-4">Leads captured: 37</div>
        <div className="rounded border bg-white p-4">Human handoff rate: 14%</div>
      </div>
    </PageShell>
  );
}
