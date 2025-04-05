"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";

export default function MainLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    
    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 p-6">
                <div className="flex items-center space-x-2 mb-8">
                    <FileText className="h-8 w-8 text-emerald-500" />
                    <h1 className="text-2xl font-bold text-white">LOKRR</h1>
                </div>
                
                <nav className="space-y-4">
                    <Link
                        href="/dashboard"
                        className={`block font-medium ${
                            pathname === "/dashboard"
                                ? "text-white"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/settings"
                        className={`block font-medium ${
                            pathname === "/settings"
                                ? "text-white"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        Settings
                    </Link>
                </nav>

                <div className="absolute bottom-6 left-6">
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="text-gray-400 hover:bg-purple-600 hover:text-white"
                    >
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <main className="pl-64">
                {children}
            </main>
        </div>
    );
} 