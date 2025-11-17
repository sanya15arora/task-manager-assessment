import { Request, Response, NextFunction } from "express";
import { TaskService } from "./taskService";
import { createTaskSchema, updateTaskSchema, querySchema } from "./taskValidation";
import { AuthRequest } from "../../middlewares/authMiddleware";

export class TaskController {
    static async create(req: AuthRequest, res: Response, next: NextFunction) {

        try {
            const parsed = createTaskSchema.safeParse(req.body);
            if (!parsed.success)
                return res.status(400).json({ message: "Validation failed", errors: parsed.error.issues });

            const task = await TaskService.createTask(req.user!.userId, parsed.data);
            return res.status(201).json(task);
        } catch (err) {
            next(err);
        }
    }

    static async list(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const parsed = querySchema.safeParse(req.query);
            if (!parsed.success)
                return res.status(400).json({ message: "Invalid query params", errors: parsed.error.issues });

            const tasks = await TaskService.getTasks(req.user!.userId, parsed.data);
            return res.json(tasks);
        } catch (err) {
            next(err);
        }
    }

    static async get(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const task = await TaskService.getTask(req.user!.userId, id);

            if (!task) return res.status(404).json({ message: "Task not found" });

            return res.json(task);
        } catch (err) {
            next(err);
        }
    }

    static async update(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const parsed = updateTaskSchema.safeParse(req.body);
            if (!parsed.success)
                return res.status(400).json({ message: "Validation failed", errors: parsed.error.issues });

            const id = Number(req.params.id);
            const task = await TaskService.updateTask(req.user!.userId, id, parsed.data);

            if (!task) return res.status(404).json({ message: "Task not found" });

            return res.json(task);
        } catch (err) {
            next(err);
        }
    }

    static async remove(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const task = await TaskService.deleteTask(req.user!.userId, id);

            if (!task) return res.status(404).json({ message: "Task not found" });

            return res.json({ message: "Task deleted" });
        } catch (err) {
            next(err);
        }
    }

    static async toggle(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const task = await TaskService.toggleTask(req.user!.userId, id);

            if (!task) return res.status(404).json({ message: "Task not found" });

            return res.json(task);
        } catch (err) {
            next(err);
        }
    }
}
