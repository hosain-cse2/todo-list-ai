export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 px-4 py-12 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
          {children}
        </div>
      </div>
    </div>
  );
}
