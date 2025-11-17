"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Task } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import { API_PATHS } from "@/lib/apiPath";
import { useAuth } from "@/context/AuthProvider";

interface TaskQuery {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
}

interface TaskContextType {
    tasks: Task[];
    loading: boolean;
    pagination: Pagination;
    query: TaskQuery;
    fetchTasks: (page?: number) => Promise<void>;
    createTask: (task: Partial<Task>) => Promise<Task | null>;
    updateTask: (id: number, task: Partial<Task>) => Promise<Task | null>;
    deleteTask: (id: number) => Promise<boolean>;
    toggleTaskCompletion: (id: number) => Promise<Task | null>;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setStatusFilter: (status?: string) => void;
    setSearch: (search?: string) => void;
}

const TasksContext = createContext<TaskContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
    const { user, loading: authLoading } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 10,
    });
    const [query, setQuery] = useState<TaskQuery>({
        page: 1,
        limit: 10,
        status: undefined,
        search: undefined,
    });

    const fetchTasks = async (page: number = query.page!) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", page.toString());
            params.set("limit", (query.limit ?? 10).toString());
            if (query.status) params.set("status", query.status);
            if (query.search) params.set("search", query.search);

            const res = await apiFetch(`${API_PATHS.TASKS.GET_ALL}?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch tasks");

            const data = await res.json();
            setTasks(data.tasks || []);
            setPagination({
                currentPage: data.pagination?.currentPage || 1,
                totalPages: data.pagination?.totalPages || 1,
                totalCount: data.pagination?.totalCount || 0,
                limit: data.pagination?.limit || (query.limit ?? 10),
            });
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (task: Partial<Task>) => {
        try {
            const res = await apiFetch(API_PATHS.TASKS.ADD_TASK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task),
            });
            if (!res.ok) throw new Error("Create task failed");

            const newTask = await res.json();
            await fetchTasks(1);
            return newTask;
        } catch (err) {
            console.error("Error creating task:", err);
            return null;
        }
    };

    const updateTask = async (id: number, task: Partial<Task>) => {
        try {
            const res = await apiFetch(API_PATHS.TASKS.UPDATE(id), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task),
            });
            if (!res.ok) throw new Error("Update task failed");

            const updated = await res.json();
            await fetchTasks(query.page);
            return updated;
        } catch (err) {
            console.error("Error updating task:", err);
            return null;
        }
    };

    const deleteTask = async (id: number) => {
        try {
            const res = await apiFetch(API_PATHS.TASKS.DELETE(id), { method: "DELETE" });
            if (!res.ok) throw new Error("Delete task failed");

            await fetchTasks(query.page);
            return true;
        } catch (err) {
            console.error("Error deleting task:", err);
            return false;
        }
    };

    const toggleTaskCompletion = async (id: number) => {
        try {
            const res = await apiFetch(API_PATHS.TASKS.TOGGLE_TASK(id), { method: "PATCH" });
            if (!res.ok) throw new Error("Toggle task failed");

            const updated = await res.json();
            await fetchTasks(query.page);
            return updated;
        } catch (err) {
            console.error("Error toggling task:", err);
            return null;
        }
    };

    const setPage = (page: number) => setQuery((prev) => ({ ...prev, page }));
    const setLimit = (limit: number) => setQuery((prev) => ({ ...prev, limit }));
    const setStatusFilter = (status?: string) => setQuery((prev) => ({ ...prev, status, page: 1 }));
    const setSearch = (search?: string) => setQuery((prev) => ({ ...prev, search, page: 1 }));

    useEffect(() => {
        if (!authLoading && user) {
            const timer = setTimeout(() => {
                fetchTasks(query.page);
            }, 300); // debounce
            return () => clearTimeout(timer);
        }
    }, [authLoading, user, query.page, query.limit, query.status, query.search]);

    return (
        <TasksContext.Provider
            value={{
                tasks,
                loading,
                pagination,
                query,
                fetchTasks,
                createTask,
                updateTask,
                deleteTask,
                toggleTaskCompletion,
                setPage,
                setLimit,
                setStatusFilter,
                setSearch,
            }}
        >
            {children}
        </TasksContext.Provider>
    );
};

export const useTasksContext = () => {
    const ctx = useContext(TasksContext);
    if (!ctx) throw new Error("useTasksContext must be used within TasksProvider");
    return ctx;
};
