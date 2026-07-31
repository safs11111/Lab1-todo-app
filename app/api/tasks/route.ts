import { getActiveTasks } from "@/lib/task-repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    const tasks = getActiveTasks();

    return Response.json(tasks);
  } catch (error) {
    console.error("Failed to retrieve tasks:", error);

    return Response.json(
      { error: "Tasks could not be retrieved." },
      { status: 500 },
    );
  }
}