export type Task = {
    id?: number | undefined;
    title: string;
    description: string;
    status: "pending" | "completed";
    userId?: number;
    createdAt?: string;
    updatedAt?: string;
};

export type User = {
    id: number;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export type Status<T extends string> = T;

export type TaskStatus = Status<"pending"| "completed">;




