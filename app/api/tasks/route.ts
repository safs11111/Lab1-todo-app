import {
    createTask,
    getActiveTasks,
  } from "@/lib/task-repository";
  
  import type { TaskStatus } from "@/lib/task-types";
  
  export const runtime = "nodejs";
  
  const allowedStatuses: TaskStatus[] = [
    "Todo",
    "In-Progress",
    "Complete",
  ];
  
  export async function GET() {
    try {
      return Response.json(getActiveTasks());
    } catch (error) {
      console.error("Failed to retrieve tasks:", error);
  
      return Response.json(
        { error: "Tasks could not be retrieved." },
        { status: 500 },
      );
    }
  }
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
  
      const {
        title,
        description,
        dueDate,
        topicName,
        status,
      } = body;
  
      if (
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof dueDate !== "string" ||
        typeof topicName !== "string" ||
        typeof status !== "string"
      ) {
        return Response.json(
          { error: "All task fields are required." },
          { status: 400 },
        );
      }
  
      if (
        title.trim() === "" ||
        description.trim() === "" ||
        topicName.trim() === ""
      ) {
        return Response.json(
          { error: "Task fields cannot be blank." },
          { status: 400 },
        );
      }
  
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
        return Response.json(
          { error: "Due date must use YYYY-MM-DD format." },
          { status: 400 },
        );
      }
  
      if (!allowedStatuses.includes(status as TaskStatus)) {
        return Response.json(
          {
            error:
              "Status must be Todo, In-Progress or Complete.",
          },
          { status: 400 },
        );
      }
  
      const task = createTask({
        title,
        description,
        dueDate,
        topicName,
        status: status as TaskStatus,
      });
  
      return Response.json(task, { status: 201 });
    } catch (error) {
      console.error("Failed to create task:", error);
  
      return Response.json(
        { error: "The task could not be created." },
        { status: 500 },
      );
    }
  }