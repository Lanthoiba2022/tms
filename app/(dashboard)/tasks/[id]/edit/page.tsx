import type { Metadata } from "next";
import { EditTaskContent } from "@/components/tasks/edit-task-content";

export const metadata: Metadata = {
  title: "Edit Task - TaskFlow",
};

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditTaskContent taskId={id} />;
}
