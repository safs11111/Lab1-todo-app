import Database from "better-sqlite3";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";

import {
  mkdtempSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

function openTestDatabase(databasePath: string) {
  const database = new Database(databasePath);

  database.pragma("foreign_keys = ON");

  const schemaPath = path.join(
    process.cwd(),
    "db",
    "schema.sql",
  );

  const schema = readFileSync(schemaPath, "utf8");

  database.exec(schema);

  return database;
}

describe("SQLite task storage", () => {
  let temporaryDirectory: string;
  let databasePath: string;
  let database: ReturnType<typeof openTestDatabase>;

  beforeEach(() => {
    temporaryDirectory = mkdtempSync(
      path.join(tmpdir(), "todo-test-"),
    );

    databasePath = path.join(
      temporaryDirectory,
      "test.db",
    );

    database = openTestDatabase(databasePath);
  });

  afterEach(() => {
    if (database.open) {
      database.close();
    }

    rmSync(temporaryDirectory, {
      recursive: true,
      force: true,
    });
  });

  function insertTask(): number {
    const topicResult = database
      .prepare(`
        INSERT INTO topics (name)
        VALUES (?)
      `)
      .run("COMS3011A");

    const taskResult = database
      .prepare(`
        INSERT INTO tasks (
          title,
          description,
          due_date,
          topic_id,
          status
        )
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(
        "Complete Lab 1",
        "Finish the todo application",
        "2026-08-04",
        Number(topicResult.lastInsertRowid),
        "Todo",
      );

    return Number(taskResult.lastInsertRowid);
  }

  test("creates and retrieves a task with its topic", () => {
    const taskId = insertTask();

    const task = database
      .prepare(`
        SELECT
          tasks.title,
          tasks.description,
          tasks.due_date,
          tasks.status,
          topics.name AS topic_name
        FROM tasks
        JOIN topics
          ON topics.id = tasks.topic_id
        WHERE tasks.id = ?
      `)
      .get(taskId) as {
        title: string;
        description: string;
        due_date: string;
        status: string;
        topic_name: string;
      };

    expect(task).toEqual({
      title: "Complete Lab 1",
      description: "Finish the todo application",
      due_date: "2026-08-04",
      status: "Todo",
      topic_name: "COMS3011A",
    });
  });

  test("archives a task without deleting its row", () => {
    const taskId = insertTask();

    database
      .prepare(`
        UPDATE tasks
        SET archived_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
      .run(taskId);

    const activeTask = database
      .prepare(`
        SELECT id
        FROM tasks
        WHERE id = ?
          AND archived_at IS NULL
      `)
      .get(taskId);

    const storedTask = database
      .prepare(`
        SELECT id, archived_at
        FROM tasks
        WHERE id = ?
      `)
      .get(taskId) as {
        id: number;
        archived_at: string | null;
      };

    expect(activeTask).toBeUndefined();
    expect(storedTask.id).toBe(taskId);
    expect(storedTask.archived_at).not.toBeNull();
  });

  test("persists a task after the database is closed and reopened", () => {
    const taskId = insertTask();

    database.close();

    database = new Database(databasePath);
    database.pragma("foreign_keys = ON");

    const savedTask = database
      .prepare(`
        SELECT title
        FROM tasks
        WHERE id = ?
      `)
      .get(taskId) as {
        title: string;
      };

    expect(savedTask.title).toBe("Complete Lab 1");
  });
});