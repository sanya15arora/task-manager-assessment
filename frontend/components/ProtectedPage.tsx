"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/auth/login");
        }
        if (!loading && user) {
            // user is logged in, stay on page
        }
    }, [loading, user, router]);

    if (loading || !user) return <div>Loading...</div>;

    return <>{children}</>;
}
