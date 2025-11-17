"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setAccessToken, apiFetch } from "@/lib/api";
import { API_PATHS } from "@/lib/apiPath";
import { useRouter } from "next/navigation";

type User = { id: number; name: string; email: string } | null;

type AuthContextType = {
    user: User;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Initialize auth on app load
    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await fetch(API_PATHS.AUTH.REFRESH, {
                    method: "POST",
                    credentials: "include", // send jid cookie
                });

                if (!res.ok) {
                    setUser(null);
                    return;
                }

                const data = await res.json();
                setAccessToken(data.accessToken);
                setUser(data.user ?? null);

                if (data.user) {
                    router.replace("/tasks");
                }
            } catch (err) {
                console.error("Refresh token failed:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Login function
    const login = async (email: string, password: string) => {
        try {
            const res = await fetch(API_PATHS.AUTH.LOGIN, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Login failed");

            setAccessToken(data.accessToken);
            setUser(data.user ?? null);

            router.replace("/tasks");
        } catch (err) {
            console.error("Login error:", err);
            throw err;
        }
    };

    // Register function
    const register = async (name: string, email: string, password: string) => {
        try {
            const res = await fetch(API_PATHS.AUTH.REGISTER, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Registration failed");

            setAccessToken(data.accessToken);
            setUser(data.user ?? null);
            router.replace("/tasks");
        } catch (err) {
            console.error("Registration error:", err);
            throw err;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await apiFetch(API_PATHS.AUTH.LOGOUT, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setAccessToken(null);
            setUser(null);
            router.replace("/auth/login");
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook to use auth context
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
