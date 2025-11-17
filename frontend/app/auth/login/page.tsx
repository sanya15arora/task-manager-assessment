"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layouts/AuthLayout";
import Input from "@/components/Inputs/Input";
import {validateEmail, validatePassword} from "@/utils/helper";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";


export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        // Manual validation
        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            return;
        }
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            toast.success("Logged in successfully!");
            router.replace("/tasks");
        } catch (err: any) {
            setError(err?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Welcome back!</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Please enter your details to log in
                </p>
                <form onSubmit={handleLogin}>
                    <Input
                        label="Email Address"
                        placeholder="john@example.com"
                        type="email"
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                    />
                    <Input
                        label="Password"
                        placeholder="Min 8 characters"
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Logging in..." : "LOGIN"}
                    </button>
                    <p className="text-[13px] text-slate-800 mt-3">
                        Don't have any account?{" "}
                        <Link href="/auth/register" className="font-medium text-primary underline">
                            SignUp
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
}
