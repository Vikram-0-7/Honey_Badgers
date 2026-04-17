// components/SignupForm.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/libs/supabase/client";

export default function SignupForm() {
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: "http://localhost:3000/login",
            },
        });

        setLoading(false);

        if (error) {
            alert(error.message);
        } else {
            alert("Check your email to confirm signup");
        }
    };

    return (
        <form
            onSubmit={handleSignup}
            className="w-full max-w-md space-y-6"
        >
            <h2 className="text-2xl font-black uppercase tracking-tight">
                Sign Up
            </h2>

            <input
                type="email"
                placeholder="Email"
                required
                className="w-full border border-black p-3 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                required
                className="w-full border border-black p-3 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white p-3 text-sm font-bold uppercase"
            >
                {loading ? "Creating..." : "Create Account"}
            </button>

            <p className="text-xs">
                Already have an account?{" "}
                <a href="/login" className="underline">
                    Login
                </a>
            </p>
        </form>
    );
}