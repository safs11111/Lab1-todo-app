import type { TaskStatus } from "./task-types";

function getLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isTaskOverdue(
  dueDate: string,
  status: TaskStatus,
  today: string = getLocalDate(new Date()),
): boolean {
  return status !== "Complete" && dueDate < today;
}