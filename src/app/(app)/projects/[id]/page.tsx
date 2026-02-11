interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = params;

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Project
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Project #{id}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This is a placeholder detail view for a single todo project.
        </p>
      </header>
      <section className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        Replace this with your project-level todo list UI.
      </section>
    </div>
  );
}

