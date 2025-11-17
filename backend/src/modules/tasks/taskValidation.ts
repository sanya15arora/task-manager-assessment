import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(["pending", "completed"]).optional(),
});

export const querySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(["pending", "completed"]).optional(),
    search: z.string().optional(),
});
