PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL COLLATE NOCASE UNIQUE
    CHECK (length(trim(name)) > 0),

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  title TEXT NOT NULL
    CHECK (length(trim(title)) > 0),

  description TEXT NOT NULL DEFAULT '',

  due_date TEXT NOT NULL
    CHECK (due_date GLOB '????-??-??'),

  topic_id INTEGER NOT NULL,

  status TEXT NOT NULL DEFAULT 'Todo'
    CHECK (
      status IN ('Todo', 'In-Progress', 'Complete')
    ),

  archived_at TEXT DEFAULT NULL,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (topic_id)
    REFERENCES topics(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_tasks_topic_id
  ON tasks(topic_id);

CREATE INDEX IF NOT EXISTS idx_tasks_due_date
  ON tasks(due_date);

CREATE INDEX IF NOT EXISTS idx_tasks_status
  ON tasks(status);

CREATE INDEX IF NOT EXISTS idx_tasks_archived_at
  ON tasks(archived_at);