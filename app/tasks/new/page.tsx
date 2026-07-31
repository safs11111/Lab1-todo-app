import Link from "next/link";
import NewTaskForm from "@/components/NewTaskForm";

export default function NewTaskPage() {
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
            Create a new task
          </h1>

          <p className="mt-2 text-slate-600">
            Add the task information and choose its starting status.
          </p>
        </header>

        <NewTaskForm />
      </section>
    </main>
  );
}