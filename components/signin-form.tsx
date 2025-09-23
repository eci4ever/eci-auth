"use client"

import { useState, useActionState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { signInAction } from "@/lib/auth-actions"
import { signIn } from "next-auth/react";

export function SignInForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [state, formAction, isPending] = useActionState(signInAction, {}, undefined)


    useEffect(() => {
        if (state.success) {
            const timer = setTimeout(() => {
                window.location.href = "/dashboard"
            }, 1500); // tunggu 1.5s sebelum redirect

            return () => clearTimeout(timer);
        }
    }, [state.success]);

    const handleGoogleSignIn = async () => {
        // Handle Google OAuth here
        // console.log("Google sign in clicked")
        await signIn("google", { callbackUrl: "/dashboard" })
    }

    return (
        <div className="space-y-6">
            {/* Logo */}
            <div className="text-center">
                <Link href="/" className="inline-block">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                        <span className="text-primary-foreground font-bold text-xl">L</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Your Logo</h1>
                </Link>
            </div>

            <Card className="border-border shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold text-balance">Welcome back</CardTitle>
                    <CardDescription className="text-muted-foreground text-pretty">
                        Enter your credentials to sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Google Sign In Button */}
                    <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleSignIn} type="button">
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    {state.error && (
                        <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            {state.error}
                        </div>
                    )}

                    {state.success && (
                        <div className="flex items-center gap-2 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
                            <CheckCircle className="h-4 w-4" />
                            <span>{state.success}</span>

                            {/* Spinner animate */}
                            <Loader2 className="ml-2 h-4 w-4 animate-spin text-green-600" />
                        </div>
                    )}

                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                className="bg-input"
                                defaultValue={state.formData?.email || ""}
                                disabled={isPending} aria-disabled={isPending}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="text-sm text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    required
                                    className="bg-input pr-10"
                                    defaultValue={state.formData?.password || ""}
                                    disabled={isPending} aria-disabled={isPending}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending} aria-disabled={isPending}>
                            Sign In
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            {/* <div className="text-center text-xs text-muted-foreground space-x-4">
                <Link href="/privacy" className="hover:underline">
                    Privacy Policy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:underline">
                    Terms of Service
                </Link>
            </div> */}
        </div>
    )
}
