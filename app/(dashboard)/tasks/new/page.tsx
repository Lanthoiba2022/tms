import type { Metadata } from "next";
import { TaskForm } from "@/components/tasks/task-form";

export const metadata: Metadata = {
  title: "New Task - TaskFlow",
};

export default function NewTaskPage() {
  return <TaskForm mode="create" />;
}
