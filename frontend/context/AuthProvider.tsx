"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Initialize auth state by refreshing access token if cookie exists
    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await fetch(API_PATHS.AUTH.REFRESH, {
                    method: "POST",
                    credentials: "include", // send HTTP-only refresh cookie
                });

                if (!res.ok) {
                    setUser(null);
                    return;
                }

                const data = await res.json();
                if (data.accessToken) setAccessToken(data.accessToken);
                setUser(data.user ?? null);
            } catch (err) {
                console.error("Refresh token failed:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

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
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

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
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await apiFetch(API_PATHS.AUTH.LOGOUT, {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            console.error("Logout error:", e);
        } finally {
            setAccessToken(null);
            setUser(null);
            router.replace("/login");
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
