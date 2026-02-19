"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { CheckCircle2, Circle, Clock, ListTodo, Plus } from "lucide-react";
import Link from "next/link";
import type { TasksResponse } from "@/types";

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [all, pending, inProgress, completed] = await Promise.all([
          apiClient<TasksResponse>("/api/tasks?limit=1"),
          apiClient<TasksResponse>("/api/tasks?limit=1&status=PENDING"),
          apiClient<TasksResponse>("/api/tasks?limit=1&status=IN_PROGRESS"),
          apiClient<TasksResponse>("/api/tasks?limit=1&status=COMPLETED"),
        ]);
        setStats({
          total: all.pagination.total,
          pending: pending.pagination.total,
          inProgress: inProgress.pagination.total,
          completed: completed.pagination.total,
        });
      } catch {
        // handled by api client
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0]}
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your tasks.
          </p>
        </div>
        <Button asChild>
          <Link href="/tasks/new">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Circle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.inProgress ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completed ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button variant="outline" asChild>
          <Link href="/tasks">View All Tasks</Link>
        </Button>
      </div>
    </div>
  );
}
