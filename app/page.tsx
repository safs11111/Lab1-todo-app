import Link from "next/link";
import { getActiveTasks } from "@/lib/task-repository";
import ArchiveTaskButton from "@/components/ArchiveTaskButton";
import type { TaskSort } from "@/lib/task-types";

export const dynamic = "force-dynamic";

const statusStyles = {
  Todo: "bg-slate-100 text-slate-700",
  "In-Progress": "bg-amber-100 text-amber-800",
  Complete: "bg-emerald-100 text-emerald-800",
};

type HomePageProps = {
  searchParams: Promise<{
    sort?: string | string[];
  }>;
};

function isTaskSort(
  value: string | string[] | undefined,
): value is TaskSort {
  return (
    typeof value === "string" &&
    ["dueDate", "topic", "status"].includes(value)
  );
}

export default async function Home({
  searchParams,
}: HomePageProps) {
  const requestedSort = (await searchParams).sort;

  const sort: TaskSort = isTaskSort(requestedSort)
    ? requestedSort
    : "dueDate";

  const tasks = getActiveTasks(sort);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <header className="mx-auto mb-8 flex max-w-5xl items-center justify-between">
        <section>
          <p className="text-sm font-bold tracking-[0.2em] text-violet-700">
            TODO
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            My Tasks
          </h1>

          <p className="mt-2 text-slate-600">
            Organise your work and keep track of your deadlines.
          </p>
        </section>

        <nav
  aria-label="Task navigation"
  className="flex flex-wrap items-center gap-3"
>
  <Link
    href="/archive"
    className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
  >
    View Archive
  </Link>

  <Link
    href="/tasks/new"
    className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white shadow-sm hover:bg-violet-800"
  >
    + New Task
  </Link>
</nav>
      </header>

      <section
        aria-labelledby="active-tasks-heading"
        className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm"
      >
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
  <section>
    <h2
      id="active-tasks-heading"
      className="text-2xl font-bold"
    >
      Active Tasks
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      {tasks.length} active{" "}
      {tasks.length === 1 ? "task" : "tasks"}
    </p>
  </section>

  <nav
    aria-label="Sort active tasks"
    className="flex flex-wrap gap-2"
  >
    <Link
      href="/?sort=dueDate"
      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
        sort === "dueDate"
          ? "border-violet-700 bg-violet-700 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      Due date
    </Link>

    <Link
      href="/?sort=topic"
      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
        sort === "topic"
          ? "border-violet-700 bg-violet-700 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      Topic
    </Link>

    <Link
      href="/?sort=status"
      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
        sort === "status"
          ? "border-violet-700 bg-violet-700 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      Status
    </Link>
  </nav>
</header>

        {tasks.length === 0 ? (
          <section className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
            <h3 className="font-semibold">
              No tasks yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create your first task to get started.
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            {tasks.map((task) => (
              <article
                key={task.id}
                className={`rounded-xl border p-5 ${
                  task.isOverdue
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold text-violet-700">
                    {task.topicName}
                  </p>

                  <section className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        statusStyles[task.status]
                      }`}
                    >
                      {task.status}
                    </span>

                    {task.isOverdue && (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                        ⚠ Overdue
                      </span>
                    )}
                  </section>
                </header>

                <h3 className="text-xl font-bold">
                  {task.title}
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  {task.description}
                </p>

                <p className="mt-4 text-sm font-semibold text-slate-500">
                  Due: {task.dueDate}
                </p>

                <footer className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
                <Link
  href={`/tasks/${task.id}/edit`}
  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
>
  Edit
</Link>

<ArchiveTaskButton
  taskId={task.id}
  taskTitle={task.title}
/>
                </footer>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}