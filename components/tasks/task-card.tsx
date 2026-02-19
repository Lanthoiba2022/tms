"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { STATUS_COLORS, PRIORITY_COLORS } from "@/lib/constants";
import { Calendar, Clock } from "lucide-react";
import type { Task } from "@/types";

function formatStatus(status: string) {
  return status.replace("_", " ");
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{task.title}</h3>
            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className={STATUS_COLORS[task.status]}>
            {formatStatus(task.status)}
          </Badge>
          <Badge variant="secondary" className={PRIORITY_COLORS[task.priority]}>
            {task.priority}
          </Badge>

          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(task.dueDate)}
            </span>
          )}

          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDate(task.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
