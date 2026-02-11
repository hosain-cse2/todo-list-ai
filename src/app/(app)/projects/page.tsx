import Link from "next/link";

export default function ProjectsPage() {
  // This will be the main projects list view for your Todo AI app.
  const mockProjects = [
    { id: "1", name: "Personal Tasks", description: "Capture your daily todos." },
    { id: "2", name: "Work", description: "Track work items and priorities." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Organize your todos into focused projects.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {mockProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-900/10 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="text-sm font-medium">{project.name}</h2>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              {project.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

