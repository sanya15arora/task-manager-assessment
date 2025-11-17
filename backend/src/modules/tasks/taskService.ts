import { prisma } from "../../prisma/client";

export class TaskService {
    static async createTask(userId: number, data: any) {
        return prisma.task.create({
            data: { ...data, userId },
        });
    }

    static async getTasks(userId: number, query: any) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;

        const where: any = { userId };
        if (query.status) where.status = query.status;
        if (query.search) where.title = { contains: query.search, mode: "insensitive" };

        const [tasks, totalCount] = await prisma.$transaction([
            prisma.task.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.task.count({ where }),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            tasks,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
            },
        };
    }


    static async getTask(userId: number, id: number) {
        return prisma.task.findFirst({
            where: { id, userId },
        });
    }

    static async updateTask(userId: number, id: number, data: any) {
        const task = await prisma.task.findFirst({ where: { id, userId } });
        if (!task) return null;

        return prisma.task.update({
            where: { id },
            data,
        });
    }

    static async deleteTask(userId: number, id: number) {
        const task = await prisma.task.findFirst({ where: { id, userId } });
        if (!task) return null;

        return prisma.task.delete({ where: { id } });
    }

    static async toggleTask(userId: number, id: number) {
        const task = await prisma.task.findFirst({ where: { id, userId } });
        if (!task) return null;

        const newStatus = task.status === "completed" ? "pending" : "completed";

        return prisma.task.update({
            where: { id },
            data: { status: newStatus },
        });
    }
}
