import Link from "next/link";

const links = [
  ["Inbox", "/dashboard/inbox"],
  ["Stores", "/dashboard/stores"],
  ["Products", "/dashboard/products"],
  ["FAQs", "/dashboard/faqs"],
  ["Settings", "/dashboard/settings"],
  ["Analytics", "/dashboard/analytics"]
] as const;

export function Nav() {
  return (
    <nav className="flex gap-3 border-b bg-white p-4 text-sm">
      {links.map(([label, href]) => (
        <Link key={href} href={href} className="rounded px-3 py-1 hover:bg-slate-100">
          {label}
        </Link>
      ))}
    </nav>
  );
}
