import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const STATUS_CYCLE = {
  PENDING: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
  COMPLETED: "PENDING",
} as const;

// PATCH /api/tasks/:id/toggle - Toggle task status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.userId !== user.userId) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const nextStatus = STATUS_CYCLE[task.status];

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status: nextStatus },
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error("Toggle task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
