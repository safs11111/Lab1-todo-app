import { describe, expect, test } from "vitest";

import { isTaskOverdue } from "../lib/task-rules";

describe("isTaskOverdue", () => {
  test("marks an incomplete task with a past due date as overdue", () => {
    const result = isTaskOverdue(
      "2026-08-01",
      "Todo",
      "2026-08-03",
    );

    expect(result).toBe(true);
  });

  test("does not mark a completed task as overdue", () => {
    const result = isTaskOverdue(
      "2026-08-01",
      "Complete",
      "2026-08-03",
    );

    expect(result).toBe(false);
  });

  test("does not mark a future task as overdue", () => {
    const result = isTaskOverdue(
      "2026-08-04",
      "In-Progress",
      "2026-08-03",
    );

    expect(result).toBe(false);
  });
});