"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { TaskForm } from "./task-form";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FullPageLoader } from "@/components/shared/loading-spinner";
import { STATUS_COLORS } from "@/lib/constants";
import { ArrowLeftRight, Trash2 } from "lucide-react";
import type { Task } from "@/types";

function formatStatus(status: string) {
  return status.replace("_", " ");
}

interface EditTaskContentProps {
  taskId: string;
}

export function EditTaskContent({ taskId }: EditTaskContentProps) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    async function fetchTask() {
      try {
        const data = await apiClient<{ task: Task }>(`/api/tasks/${taskId}`);
        setTask(data.task);
      } catch {
        toast.error("Task not found");
        router.push("/tasks");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTask();
  }, [taskId, router]);

  async function handleToggle() {
    if (!task) return;
    setIsToggling(true);
    try {
      const data = await apiClient<{ task: Task }>(
        `/api/tasks/${task.id}/toggle`,
        { method: "PATCH" }
      );
      setTask(data.task);
      toast.success(`Status changed to ${formatStatus(data.task.status)}`);
    } catch {
      toast.error("Failed to toggle status");
    } finally {
      setIsToggling(false);
    }
  }

  if (isLoading) return <FullPageLoader />;
  if (!task) return null;

  return (
    <div className="space-y-4">
      {/* Action bar above the form */}
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Current status:</span>
          <Badge variant="secondary" className={STATUS_COLORS[task.status]}>
            {formatStatus(task.status)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={isToggling}
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Toggle Status
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <TaskForm task={task} mode="edit" />

      <DeleteTaskDialog
        taskId={task.id}
        taskTitle={task.title}
        open={showDelete}
        onOpenChange={setShowDelete}
        onDeleted={() => router.push("/tasks")}
      />
    </div>
  );
}
