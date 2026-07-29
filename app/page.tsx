export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] px-6 py-10 text-stone-900">
      <header className="mx-auto mb-10 flex max-w-4xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <section aria-labelledby="page-title">
          <p className="mb-2 text-sm font-bold tracking-[0.25em] text-orange-700">
            TO DO TRACKER
          </p>

          <h1
            id="page-title"
            className="text-4xl font-bold tracking-tight"
          >
            Today&apos;s tasks
          </h1>

          <p className="mt-2 text-stone-600">
            turn plans into progress
          </p>
        </section>

        <button
          type="button"
          className="rounded-xl bg-orange-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-800"
        >
          + Add task
        </button>
      </header>

      <section
        aria-labelledby="active-tasks-heading"
        className="mx-auto max-w-4xl rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
      >
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <section>
            <h2
              id="active-tasks-heading"
              className="text-xl font-bold"
            >
              Active tasks
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Your current work and upcoming deadlines.
            </p>
          </section>

          <label className="flex items-center gap-3 text-sm font-semibold">
            Sort by

            <select className="rounded-lg border border-stone-300 bg-white px-3 py-2">
              <option>Due date</option>
              <option>Topic</option>
              <option>Status</option>
            </select>
          </label>
        </header>

        <article className="rounded-xl border border-stone-200 bg-[#fffdf9] p-5">
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold text-orange-700">
              COMS3011A
            </p>

            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              In-Progress
            </span>
          </header>

          <h3 className="text-xl font-bold">
            Design the task database
          </h3>

          <p className="mt-2 leading-7 text-stone-600">
            Plan the SQLite table that will store the application tasks.
          </p>

          <p className="mt-4 text-sm font-semibold text-stone-500">
            Due 4 August 2026
          </p>

          <footer className="mt-5 flex gap-3 border-t border-stone-100 pt-4">
            <button
              type="button"
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold transition hover:bg-stone-100"
            >
              Edit
            </button>

            <button
              type="button"
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold transition hover:bg-stone-100"
            >
              Archive
            </button>
          </footer>
        </article>
      </section>
    </main>
  );
}