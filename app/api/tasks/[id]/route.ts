import {
  archiveTask,
  getTaskById,
  updateTask,
} from "@/lib/task-repository";
  
  import type { TaskStatus } from "@/lib/task-types";
  
  export const runtime = "nodejs";
  
  const allowedStatuses: TaskStatus[] = [
    "Todo",
    "In-Progress",
    "Complete",
  ];
  
  type RouteContext = {
    params: Promise<{ id: string }>;
  };
  
  export async function GET(
    _request: Request,
    context: RouteContext,
  ) {
    try {
      const { id } = await context.params;
      const taskId = Number(id);
  
      if (!Number.isInteger(taskId) || taskId <= 0) {
        return Response.json(
          { error: "Invalid task ID." },
          { status: 400 },
        );
      }
  
      const task = getTaskById(taskId);
  
      if (!task) {
        return Response.json(
          { error: "Task not found." },
          { status: 404 },
        );
      }
  
      return Response.json(task);
    } catch (error) {
      console.error("Failed to retrieve task:", error);
  
      return Response.json(
        { error: "The task could not be retrieved." },
        { status: 500 },
      );
    }
  }
  
  export async function PATCH(
    request: Request,
    context: RouteContext,
  ) {
    try {
      const { id } = await context.params;
      const taskId = Number(id);
  
      if (!Number.isInteger(taskId) || taskId <= 0) {
        return Response.json(
          { error: "Invalid task ID." },
          { status: 400 },
        );
      }
  
      const body = await request.json();

      if (body?.action === "archive") {
        const task = archiveTask(taskId);
      
        return Response.json(task);
      }
  
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
  
      const task = updateTask(taskId, {
        title,
        description,
        dueDate,
        topicName,
        status: status as TaskStatus,
      });
  
      return Response.json(task);
    } catch (error) {
      console.error("Failed to update task:", error);
  
      if (
        error instanceof Error &&
        error.message === "Task not found."
      ) {
        return Response.json(
          { error: "Task not found." },
          { status: 404 },
        );
      }
  
      return Response.json(
        { error: "The task could not be updated." },
        { status: 500 },
      );
    }
  }