"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import type { TaskStatus } from "@/lib/task-types";

type EditableTask = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  topicName: string;
  status: TaskStatus;
};

type EditTaskFormProps = {
  task: EditableTask;
};

export default function EditTaskForm({
  task,
}: EditTaskFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description,
  );
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [topicName, setTopicName] = useState(task.topicName);
  const [status, setStatus] = useState<TaskStatus>(
    task.status,
  );

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          dueDate,
          topicName,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error ?? "The task could not be updated.",
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("The application could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Title
        </span>

        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Description
        </span>

        <textarea
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          required
          rows={4}
          className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
        />
      </label>

      <section className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Due date
          </span>

          <input
            type="date"
            value={dueDate}
            onChange={(event) =>
              setDueDate(event.target.value)
            }
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Topic
          </span>

          <input
            type="text"
            value={topicName}
            onChange={(event) =>
              setTopicName(event.target.value)
            }
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
          />
        </label>
      </section>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Status
        </span>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as TaskStatus)
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
        >
          <option value="Todo">Todo</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Complete">Complete</option>
        </select>
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          {error}
        </p>
      )}

      <footer className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </footer>
    </form>
  );
}