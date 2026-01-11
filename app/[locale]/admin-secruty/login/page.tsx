"use client";

import { Eye, EyeOff, Lock, LogIn, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/service/auth.service";

const LoginPage = () => {
    const router = useRouter();
    const locale = useLocale();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await login(username, password);

            if (result.success) {
                router.push(`/${locale}/admin-secruty`);
            } else {
                setError(result.error || "Login failed. Please try again.");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                        <Lock className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h1 className="mt-6 font-spaceGrotesk text-3xl font-bold">
                        Admin Panel
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Tizimga kirish uchun ma&apos;lumotlaringizni kiriting
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-8 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="username">Foydalanuvchi nomi yoki Email</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Parol</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Yuklanmoqda...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Kirish
                                </span>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
