"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ArchiveTaskButtonProps = {
  taskId: number;
  taskTitle: string;
};

export default function ArchiveTaskButton({
  taskId,
  taskTitle,
}: ArchiveTaskButtonProps) {
  const router = useRouter();

  const [isArchiving, setIsArchiving] = useState(false);
  const [error, setError] = useState("");

  async function handleArchive() {
    const confirmed = window.confirm(
      `Archive "${taskTitle}"? The task will remain stored and viewable in the archive.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setIsArchiving(true);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "archive",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error ?? "The task could not be archived.",
        );
        return;
      }

      router.refresh();
    } catch {
      setError("The application could not connect to the server.");
    } finally {
      setIsArchiving(false);
    }
  }

  return (
    <span className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleArchive}
        disabled={isArchiving}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isArchiving ? "Archiving..." : "Archive"}
      </button>

      {error && (
        <span
          role="alert"
          className="text-xs font-semibold text-red-700"
        >
          {error}
        </span>
      )}
    </span>
  );
}