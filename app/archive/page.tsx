import Link from "next/link";

import { getArchivedTasks } from "@/lib/task-repository";

export const dynamic = "force-dynamic";

const statusStyles = {
  Todo: "bg-slate-100 text-slate-700",
  "In-Progress": "bg-amber-100 text-amber-800",
  Complete: "bg-emerald-100 text-emerald-800",
};

export default function ArchivePage() {
  const tasks = getArchivedTasks();

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-5xl">
        <header className="mb-8">
          <Link
            href="/"
            className="text-sm font-semibold text-violet-700 hover:text-violet-900"
          >
            ← Back to active tasks
          </Link>

          <h1 className="mt-5 text-4xl font-bold">
            Archived Tasks
          </h1>

          <p className="mt-2 text-slate-600">
            Archived tasks remain stored and viewable.
          </p>
        </header>

        {tasks.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="font-semibold">
              No archived tasks
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Tasks you archive will appear here.
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold text-violet-700">
                    {task.topicName}
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      statusStyles[task.status]
                    }`}
                  >
                    {task.status}
                  </span>
                </header>

                <h2 className="text-xl font-bold">
                  {task.title}
                </h2>

                <p className="mt-2 leading-7 text-slate-600">
                  {task.description}
                </p>

                <footer className="mt-5 space-y-1 border-t border-slate-100 pt-4 text-sm font-medium text-slate-500">
                  <p>Due: {task.dueDate}</p>
                  <p>Archived: {task.archivedAt}</p>
                </footer>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}