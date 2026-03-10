export default function WidgetPreviewPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Widget Integration</h1>
      <pre className="mt-4 rounded bg-slate-900 p-4 text-sm text-slate-100">
{`<script src="https://your-domain.com/widget/chat-widget.js" data-store-id="STORE_UUID"></script>`}
      </pre>
    </main>
  );
}
