import Link from "next/link";
import { notFound } from "next/navigation";

import EditTaskForm from "@/components/EditTaskForm";
import { getTaskById } from "@/lib/task-repository";

type EditTaskPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTaskPage({
  params,
}: EditTaskPageProps) {
  const { id } = await params;
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    notFound();
  }

  const task = getTaskById(taskId);

  if (!task || task.archivedAt !== null) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-3xl">
        <header className="mb-8">
          <Link
            href="/"
            className="text-sm font-semibold text-violet-700 hover:text-violet-900"
          >
            ← Back to tasks
          </Link>

          <h1 className="mt-5 text-4xl font-bold">
            Edit task
          </h1>

          <p className="mt-2 text-slate-600">
            Update the task details or change its status.
          </p>
        </header>

        <EditTaskForm task={task} />
      </section>
    </main>
  );
}