# Project Documentation

## Third-Party Code

| Package | Why I used it |
|---|---|
| `next` | Used to create the pages, navigation, server-side code and API routes. |
| `react` | Used to build the forms and task interface. |
| `react-dom` | Allows the React interface to display in the browser. |
| `better-sqlite3` | Used to read and write information in the local SQLite database. |
| `typescript` | Used to define task types and catch type errors. |
| `tailwindcss` | Used to style the application and make the pages responsive. |
| `@tailwindcss/postcss` | Allows Tailwind CSS to be processed by PostCSS. |
| `vitest` | Used to run the automated tests with `npm test`. |
| `eslint` | Used to check the code for common problems. |
| `eslint-config-next` | Provides the recommended ESLint rules for Next.js. |
| `@types/better-sqlite3` | Provides TypeScript types for `better-sqlite3`. |
| `@types/node` | Provides TypeScript types for Node.js. |
| `@types/react` | Provides TypeScript types for React. |
| `@types/react-dom` | Provides TypeScript types for React DOM. |

## Database Design

The application uses a local SQLite database with two tables: `topics` and `tasks`.

One topic can be linked to many tasks, while every task is linked to one topic through the `topic_id` foreign key.

### `topics`

The `topics` table contains:

- `id` — the unique ID of the topic
- `name` — the unique topic name
- `created_at` — when the topic was created

### `tasks`

The `tasks` table contains:

- `id` — the unique task ID
- `title`
- `description`
- `due_date`
- `topic_id` — links the task to the `topics` table
- `status`
- `archived_at`
- `created_at`
- `updated_at`

The database only accepts these three statuses:

- `Todo`
- `In-Progress`
- `Complete`

Tasks are not deleted. An active task has a `NULL` value in `archived_at`. When it is archived, a timestamp is stored in this column, so the task remains in the database and can still be viewed.

Overdue is not stored as a column or status. It is calculated when the task is read. A task is overdue when its due date has passed and its status is not `Complete`.

## Running It

The project was developed using Node.js `v24.13.1` and npm `11.8.0`.

From a clean clone, run:

```bash
git clone https://github.com/safs11111/Lab1-todo-app.git
cd Lab1-todo-app
npm ci
node db/migrate.js
npm test
npm run dev
```

Then open:

```text
http://localhost:3000
```

`node db/migrate.js` creates the local SQLite database. `npm test` runs all automated tests using temporary databases.

---

AI Declaration: The preceding document was planned, generated, reviewed and edited with the assistance of: ChatGPT-Web[GPT-5.6 Thinking].