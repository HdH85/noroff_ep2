'use client';
import { useActionState, useEffect } from "react";
import { loginPatient } from "@/modules/auth/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

const InitialState = {
    message: '',
    success: false,
};

function LoginForm() {
    const [state, dispatch] = useActionState(loginPatient, InitialState);
    const router = useRouter();
    useEffect(() => {
        if (state.success) {
            router.push('/profile/');
        }
    }, [state.success, router]);

    return (
        <div className="text-center max-w-lg mx-auto bg-gray-300 rounded-xl p-5 shadow-md">
            {state?.message && !state.success && (
                <div className="border px-4 py-3 rounded-lg mb-6 bg-red-900/20 border-red-800 text-red-400">
                    {state.message}
                </div>
            )}

            <form action={dispatch}>
                <div className="mb-6">
                    <label htmlFor="email" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        placeholder="Email"
                        autoComplete="email"
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="Password" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                        required 
                    />
                </div>

                <button 
                    type="submit"
                    className="w-30 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2.5 text-center bg-emerald-900 hover:bg-emerald-700 focus:ring-primary-800"
                >
                    Sign in
                </button>
                <p className="text-black text-sm py-8 text-center">
                    Don&apos;t have an account? 
                    <span className="px-3 font-bold text-base hover:underline text-gray-500 hover:text-red-600">
                        <Link href="/register"> Register here.</Link>
                    </span>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;