import database from "./db";
import { isTaskOverdue } from "./task-rules";
import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "./task-types";

type TaskRow = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  topic_id: number;
  topic_name: string;
  status: TaskStatus;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

function convertRowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    topicId: row.topic_id,
    topicName: row.topic_name,
    status: row.status,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isOverdue: isTaskOverdue(row.due_date, row.status),
  };
}

const selectTaskById = database.prepare(`
  SELECT
    tasks.id,
    tasks.title,
    tasks.description,
    tasks.due_date,
    tasks.topic_id,
    topics.name AS topic_name,
    tasks.status,
    tasks.archived_at,
    tasks.created_at,
    tasks.updated_at
  FROM tasks
  JOIN topics ON topics.id = tasks.topic_id
  WHERE tasks.id = ?
`);

export function getTaskById(id: number): Task | null {
  const row = selectTaskById.get(id) as TaskRow | undefined;

  return row ? convertRowToTask(row) : null;
}

export function getActiveTasks(): Task[] {
  const rows = database
    .prepare(`
      SELECT
        tasks.id,
        tasks.title,
        tasks.description,
        tasks.due_date,
        tasks.topic_id,
        topics.name AS topic_name,
        tasks.status,
        tasks.archived_at,
        tasks.created_at,
        tasks.updated_at
      FROM tasks
      JOIN topics ON topics.id = tasks.topic_id
      WHERE tasks.archived_at IS NULL
      ORDER BY tasks.due_date ASC
    `)
    .all() as TaskRow[];

  return rows.map(convertRowToTask);
}

export function createTask(input: CreateTaskInput): Task {
  const createTaskTransaction = database.transaction(() => {
    database
      .prepare(`
        INSERT INTO topics (name)
        VALUES (?)
        ON CONFLICT(name) DO NOTHING
      `)
      .run(input.topicName.trim());

    const topic = database
      .prepare(`
        SELECT id
        FROM topics
        WHERE name = ? COLLATE NOCASE
      `)
      .get(input.topicName.trim()) as { id: number } | undefined;

    if (!topic) {
      throw new Error("The task topic could not be created.");
    }

    const result = database
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
        input.title.trim(),
        input.description.trim(),
        input.dueDate,
        topic.id,
        input.status,
      );

    return Number(result.lastInsertRowid);
  });

  const taskId = createTaskTransaction();
  const task = getTaskById(taskId);

  if (!task) {
    throw new Error("The task was created but could not be retrieved.");
  }

  return task;
}

export function updateTask(
  id: number,
  input: UpdateTaskInput,
): Task {
  const updateTaskTransaction = database.transaction(() => {
    database
      .prepare(`
        INSERT INTO topics (name)
        VALUES (?)
        ON CONFLICT(name) DO NOTHING
      `)
      .run(input.topicName.trim());

    const topic = database
      .prepare(`
        SELECT id
        FROM topics
        WHERE name = ? COLLATE NOCASE
      `)
      .get(input.topicName.trim()) as
      | { id: number }
      | undefined;

    if (!topic) {
      throw new Error("The task topic could not be found.");
    }

    const result = database
      .prepare(`
        UPDATE tasks
        SET
          title = ?,
          description = ?,
          due_date = ?,
          topic_id = ?,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
      .run(
        input.title.trim(),
        input.description.trim(),
        input.dueDate,
        topic.id,
        input.status,
        id,
      );

    if (result.changes === 0) {
      throw new Error("Task not found.");
    }
  });

  updateTaskTransaction();

  const task = getTaskById(id);

  if (!task) {
    throw new Error(
      "The task was updated but could not be retrieved.",
    );
  }

  return task;
}

export function archiveTask(id: number): Task {
  const result = database
    .prepare(`
      UPDATE tasks
      SET
        archived_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND archived_at IS NULL
    `)
    .run(id);

  if (result.changes === 0) {
    throw new Error("Task not found.");
  }

  const task = getTaskById(id);

  if (!task) {
    throw new Error(
      "The task was archived but could not be retrieved.",
    );
  }

  return task;
}

export function getArchivedTasks(): Task[] {
  const rows = database
    .prepare(`
      SELECT
        tasks.id,
        tasks.title,
        tasks.description,
        tasks.due_date,
        tasks.topic_id,
        topics.name AS topic_name,
        tasks.status,
        tasks.archived_at,
        tasks.created_at,
        tasks.updated_at
      FROM tasks
      JOIN topics ON topics.id = tasks.topic_id
      WHERE tasks.archived_at IS NOT NULL
      ORDER BY tasks.archived_at DESC
    `)
    .all() as TaskRow[];

  return rows.map(convertRowToTask);
}