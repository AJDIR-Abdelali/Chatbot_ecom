import { PageShell } from "@/components/page-shell";
import { mockConversations } from "@/lib/mock-data";

export default function InboxPage() {
  return (
    <PageShell title="Unified Inbox">
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <input className="rounded border p-2" placeholder="Filter by store" />
        <select className="rounded border p-2"><option>All channels</option></select>
        <select className="rounded border p-2"><option>All status</option></select>
        <button className="rounded bg-slate-900 px-3 py-2 text-white">Apply filters</button>
      </div>
      <div className="space-y-3">
        {mockConversations.map((c) => (
          <article key={c.id} className="rounded border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{c.store}</h2>
              <span className="text-xs uppercase text-slate-500">{c.channel}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{c.lastMessage}</p>
            {c.needsHuman ? <p className="mt-2 text-xs text-amber-600">Human intervention needed</p> : null}
          </article>
        ))}
      </div>
    </PageShell>
  );
}
