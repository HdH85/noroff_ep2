'use client';
import { logoutPatient } from "@/modules/auth/actions";
import Link from "next/link";
import { usePathname, useRouter, } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";

interface INavbar {
    isLoggedIn: boolean;
    patientId?: string | null;
    expiresAt: number | null;
}

const Navbar = ({ isLoggedIn, patientId, expiresAt }: INavbar) => {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!expiresAt) return;
        const ms = expiresAt - Date.now();
        if (ms <= 0) {
            router.refresh();
            return;
        }
        const timer = setTimeout(() => router.refresh(), ms);
        return () => clearTimeout(timer);
    }, [expiresAt, router]);

    useEffect(() => {
        let lastCheck = 0;
        const check = () => {
            if (!expiresAt) return;
            const now = Date.now();
            if (now - lastCheck < 10_000) return;
            lastCheck = now;
            if (expiresAt < now) router.refresh();
        };
        const visibility = () => {
            if (document.visibilityState == 'visible') check();
        };
        window.addEventListener('focus', check);
        document.addEventListener('visibilitychange', visibility);
        return () => {
            window.removeEventListener('focus', check);
            document.removeEventListener('visibilitychange', visibility);
        }
    }, [expiresAt, router]);

    return (
        <nav className="fixed inset-x-0 top-0 z-50 bg-teal-700">
            <div className="grid grid-cols-6 gap-4">
                <div className="col-start-1 col-span-5">
                    <div className="flex items-center justify-between h-20">
                        
                        <div className="shrink-0 px-12">
                            <Link 
                                href="/"
                            >
                                <Image
                                    src="/EP2_logo.png"
                                    width={65}
                                    height={65}
                                    alt="Logo"
                                    unoptimized
                                />
                            </Link>
                        </div>

                        <div className="flex items-center gap-8">
                            <Link
                                href="/clinics"
                                className={`text-l font-bold transition-colors hover:text-gray-800 ${
                                    pathname === '/clinics' ? 'underline underline-offset-2' : 'text-white'
                                }`}
                            >
                                Clinics
                            </Link>
                            <Link
                                href="/search"
                                className={`text-l font-bold transition-colors hover:text-gray-800 ${
                                    pathname === '/search' ? 'underline underline-offset-2' : 'text-white'
                                }`}
                            >
                                Doctors
                            </Link>

                            {isLoggedIn && patientId && (
                                <Link
                                    href={`/profile/${patientId}`}
                                    className={`text-l font-bold transition-colors hover:text-gray-800 ${
                                        pathname === `/profile/${patientId}` ? 'underline underline-offset-2' : 'text-white'
                                    }`}
                                >
                                    My profile
                                </Link>
                            )}

                            {isLoggedIn ? (
                                <form action={logoutPatient}>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-l font-bold text-white bg-amber-600 rounded-md hover:bg-red-600 transition-colors"
                                    >
                                        Log out
                                    </button>
                                </form>
                            ) : (
                                <Link href="/login">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-l font-bold text-white bg-emerald-900 rounded-md hover:bg-emerald-700  transition-colors"
                                    >
                                        Login
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;