import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters")
    .trim(),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .trim()
    .optional()
    .nullable(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z
    .string()
    .datetime({ message: "Invalid date format" })
    .optional()
    .nullable(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .trim()
    .optional()
    .nullable(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z
    .string()
    .datetime({ message: "Invalid date format" })
    .optional()
    .nullable(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
