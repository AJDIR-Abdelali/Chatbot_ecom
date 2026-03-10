import type { ReactNode } from "react";
import { Nav } from "./nav";

export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-6xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">{title}</h1>
        {children}
      </section>
    </main>
  );
}
