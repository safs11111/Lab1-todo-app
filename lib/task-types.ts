export type TaskStatus =
  | "Todo"
  | "In-Progress"
  | "Complete";

export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;

  topicId: number;
  topicName: string;

  status: TaskStatus;

  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;

  isOverdue: boolean;
};

export type CreateTaskInput = {
    title: string;
    description: string;
    dueDate: string;
    topicName: string;
    status: TaskStatus;
  };