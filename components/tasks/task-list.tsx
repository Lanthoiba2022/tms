"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { TaskCard } from "./task-card";
import { TaskFilters } from "./task-filters";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { Task, TasksResponse } from "@/types";

export function TaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (search) params.set("search", search);
      if (status && status !== "ALL") params.set("status", status);

      const data = await apiClient<TasksResponse>(
        `/api/tasks?${params.toString()}`
      );
      setTasks(data.tasks);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch {
      // handled by api client (401 -> redirect)
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Debounce search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  function handleClear() {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="text-sm text-muted-foreground">
            {!isLoading && total > 0
              ? `Showing ${tasks.length} of ${total} task${total !== 1 ? "s" : ""}`
              : `${total} task${total !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Button asChild>
          <Link href="/tasks/new">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>

      <TaskFilters
        search={searchInput}
        status={status}
        onSearchChange={setSearchInput}
        onStatusChange={handleStatusChange}
        onClear={handleClear}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title={search || status ? "No tasks found" : "No tasks yet"}
          description={
            search || status
              ? "Try adjusting your filters or search term."
              : "Get started by creating your first task."
          }
          actionHref={search || status ? undefined : "/tasks/new"}
          actionLabel="Create Task"
        />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => router.push(`/tasks/${task.id}/edit`)}
            />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
