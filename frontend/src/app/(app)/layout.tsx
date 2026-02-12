import { redirect } from "next/navigation";
import { checkSession } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasSession = await checkSession();

  // If not logged in and trying to access protected route, redirect to login
  if (!hasSession) {
    redirect("/login");
  }

  return (
    <section className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="border-b border-zinc-200/80 bg-white/70 px-6 py-4 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Todo AI
          </span>
          <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span>Projects</span>
            <span>Settings</span>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </section>
  );
}

