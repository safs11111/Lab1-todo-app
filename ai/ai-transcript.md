# AI Usage Transcript

## AI tools used

- **ChatGPT Web [GPT-5.5]** 

## Planning the application

### My prompt

> How do I create an application with Next.js and SQLite? I saw something online about Next Router App or something like that.

### AI response

The AI explained that I had probably seen the Next.js App Router. It recommended using Next.js, the App Router, TypeScript, Tailwind CSS and SQLite.

It initially suggested Prisma as an ORM and explained the basic structure of a Next.js application.

### My decision

I accepted the recommendation to use:

- Next.js
- App Router
- TypeScript
- Tailwind CSS
- SQLite

I did not use Prisma in the final application. I used `better-sqlite3` and wrote the SQLite schema and queries myself.

---

## Starting the project

### My prompt

> Please help me start my project tonight. Give me the prompts to give to AI and maybe we should do some basic setup for tonight?

### AI response

The AI suggested beginning with a small foundation instead of trying to complete the whole project immediately.

It guided me through:

1. Creating the Next.js project.
2. Running it on localhost.
3. Opening it in VS Code.
4. Replacing the default Next.js page.
5. Creating a Git commit.
6. Creating and connecting a GitHub repository.

### My decision

I followed the setup one step at a time because I had not created a project this way before.

I selected the recommended Next.js defaults:

- TypeScript
- ESLint
- Tailwind CSS
- App Router
- no `src` directory

I checked that the application worked at:

```text
http://localhost:3000
```

before continuing.

## Interaction 3 — Semantic HTML and design

### My prompt

> How do I change things to not include divs and also make it my own?

### AI response

The AI explained that a `div` is not always incorrect, but semantic HTML should be used when an element has a clear meaning.

It suggested using:

- `<main>`
- `<header>`
- `<section>`
- `<article>`
- `<nav>`
- `<footer>`

### My decision

I accepted the semantic HTML advice and used meaningful elements throughout the interface.

I did not keep the complete visual theme suggested by the AI. I continued changing the colours, text and page layout while developing the application.

## Interaction 4 — Changing the database design

### My prompt

> I also thought about it and we can't only have 1 table.

### AI response

The AI explained that one table could technically store the required information, but suggested using two related tables:

- `topics`
- `tasks`

It suggested a one-to-many relationship where one topic can be connected to many tasks.

It also advised against creating:

- a separate status table
- a separate archived-tasks table
- an overdue column

### My decision

I chose the two-table design because it gave the database a clear relationship.

The final design uses:

- `topics.id` as the topic primary key
- `tasks.topic_id` as a foreign key
- fixed status values in the `tasks` table
- `archived_at` to archive tasks without deleting them
- a derived overdue value instead of an overdue column

The three allowed statuses are:

- `Todo`
- `In-Progress`
- `Complete`

## Interaction 5 — Debugging the production build

### Problem

When I ran:

```bash
npm run build
```

Next.js detected another `package-lock.json` outside my project and tried to treat my user directory as the workspace root.

The build failed with an error saying that it was not permitted to read the Desktop directory.

### AI response

The AI identified that Turbopack had selected the wrong project root.

It suggested setting the root in `next.config.ts`:

```ts
turbopack: {
  root: process.cwd(),
}
```

### My decision

I used the small configuration change instead of deleting unrelated files from my computer.

I ran:

```bash
npm run build
```

again and confirmed that it passed.

## Interaction 6 — Correcting a routing mistake

### My prompt

> It's not opening in the dashboard. It opens in the create task and the back button isn't working.

### Problem

I had accidentally pasted the Create Task page into:

```text
app/page.tsx
```

This meant that both `/` and the Create Task route displayed the same page.

### AI response

The AI asked me to inspect the beginning of `app/page.tsx`.

The output showed that the root page imported `NewTaskForm`, confirming that the wrong code had been pasted there.

The AI suggested restoring only the dashboard file using Git.

### My decision

I ran:

```bash
git restore app/page.tsx
```

I kept the two pages separate:

```text
app/page.tsx             → dashboard at /
app/tasks/new/page.tsx   → form at /tasks/new
```

I then tested the New Task link and the Back link.


## Interaction 7 — Preventing an incorrect Git commit

### My prompt

> Is this fine before I push?

### Problem

The commit output showed:

```text
28 files changed
7445 deletions
```

It also showed that most of the project files were being deleted.

### AI response

The AI told me not to push the commit.

It suggested undoing the local commit with:

```bash
git reset --mixed HEAD~1
```

It then told me to check `git status`, stage only the intended files and verify the staged list using:

```bash
git diff --cached --name-status
```

### My decision

I did not push the incorrect commit.

I reset it and staged only:

```text
app/api/tasks/[id]/route.ts
lib/task-repository.ts
lib/task-types.ts
```

I verified the three files before committing again.

## Interaction 8 — Sorting tasks

### AI assistance

The AI suggested creating a fixed `TaskSort` type with:

- `dueDate`
- `topic`
- `status`

It suggested mapping those values to fixed SQL sorting expressions instead of inserting arbitrary URL text into an SQL query.

### My decision

I used the fixed sorting map and added links such as:

```text
/?sort=topic
/?sort=status
/?sort=dueDate
```

I tested all three sorting options in the browser.

## Interaction 9 — Understanding Vitest

### My prompt

> What is Vitest? Can't I just write unit tests and then run it?

### AI response

The AI explained that the unit tests are the behaviours I write, while Vitest is the tool that runs them and reports whether they pass.

It suggested adding this script:

```json
"test": "vitest run"
```

It also suggested testing:

- overdue behaviour
- creation
- archiving
- persistence

### My decision

I installed Vitest and created six tests.

The tests cover:

1. A past incomplete task is overdue.
2. A complete task is not overdue.
3. A future task is not overdue.
4. A task and topic can be created and retrieved.
5. Archiving keeps the database row.
6. A task persists after the database is closed and reopened.

Examples where I changed, rejected or corrected AI-assisted work include:

- using `better-sqlite3` instead of the earlier Prisma suggestion
- changing the database to two related tables
- changing the suggested visual design
- correcting the dashboard routing mistake
- shortening documentation that did not sound like my writing

## AI Declaration

This transcript was organised and edited with the assistance of:

- ChatGPT-Web[GPT-5.5]
- ChatGPT-Web[GPT-5.6 Thinking]