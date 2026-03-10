import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">Moroccan Omnichannel Commerce Chatbot</h1>
      <p className="text-slate-600">Unified inbox and AI assistant for Telegram, Instagram, WhatsApp, and web widget.</p>
      <Link href="/dashboard/inbox" className="w-fit rounded bg-slate-900 px-4 py-2 text-white">
        Open dashboard
      </Link>
    </main>
  );
}
