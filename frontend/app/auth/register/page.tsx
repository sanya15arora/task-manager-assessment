"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layouts/AuthLayout";
import Input from "@/components/Inputs/Input";
import {validateEmail, validatePassword} from "@/utils/helper";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();

    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);



    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();

        // Validation
        if (!fullName) {
            setError("Please enter your full name");
            return;
        }
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
            await register(fullName, email, password);
            toast.success("Account created successfully!");
            router.push("/auth/login");
        } catch (err: any) {
            setError(err?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Create an Account</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Join us today by entering your details below.
                </p>

                <form onSubmit={handleSignUp}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            type="text"
                            value={fullName}
                            onChange={({ target }) => setFullName(target.value)}
                        />
                        <Input
                            label="Email Address"
                            placeholder="john@example.com"
                            type="email"
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                        />
                        <div className="col-span-2">
                            <Input
                                label="Password"
                                placeholder="Min 8 characters"
                                type="password"
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "SIGN UP"}
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="font-medium text-primary underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
}
