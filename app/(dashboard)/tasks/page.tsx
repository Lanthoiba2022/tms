import type { Metadata } from "next";
import { TaskList } from "@/components/tasks/task-list";

export const metadata: Metadata = {
  title: "Tasks - TaskFlow",
};

export default function TasksPage() {
  return <TaskList />;
}
