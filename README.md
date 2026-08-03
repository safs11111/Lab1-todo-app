# Lab 1 Todo App

This is a local todo application made with Next.js and SQLite.

A user can:

- create tasks
- edit tasks
- archive tasks
- view archived tasks
- change a task's status
- sort tasks by due date, topic or status
- see when an incomplete task is overdue

## Running It

### Starting from a clean clone

Clone the repository:

```bash
git clone https://github.com/safs11111/Lab1-todo-app.git
```

Enter the project folder:

```bash
cd Lab1-todo-app
```

Install the packages:

```bash
npm ci
```

Create the local SQLite database:

```bash
node db/migrate.js
```

Start the application:

```bash
npm run dev
```

Open this address in a browser:

```text
http://localhost:3000
```

### Running the tests

Run all tests with:

```bash
npm test
```

The tests check:

- overdue tasks
- completed tasks not being overdue
- future tasks not being overdue
- creating and retrieving a task
- archiving without deleting the task
- persistence after closing and reopening SQLite
