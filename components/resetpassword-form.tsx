"use client"
import { useActionState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle } from "lucide-react"
import { requestPasswordReset, resetPassword } from "@/lib/auth-actions"
import Link from "next/link"

export default function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token") ?? ""
    const emailFromLink = searchParams.get("email") ?? ""
    const router = useRouter()

    const [requestState, requestAction, requesting] = useActionState(requestPasswordReset, {}, undefined)
    const [resetState, resetAction, resetting] = useActionState(resetPassword, {}, undefined)

    const isResetFlow = Boolean(token && emailFromLink)

    useEffect(() => {
        if (resetState?.success) {
            const t = setTimeout(() => router.replace("/signin"), 800)
            return () => clearTimeout(t)
        }
    }, [resetState?.success, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <Card className="border-border shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">{isResetFlow ? "Set a new password" : "Reset your password"}</CardTitle>
                        <CardDescription>
                            {isResetFlow ? "Enter a new password to complete the reset." : "Enter your email to receive a reset link."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!isResetFlow ? (
                            <form action={requestAction} className="space-y-4">
                                {requestState.error && (
                                    <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                        <AlertCircle className="h-4 w-4" />
                                        {requestState.error}
                                    </div>
                                )}
                                {requestState.success && (
                                    <div className="flex items-center gap-2 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
                                        <CheckCircle className="h-4 w-4" />
                                        {requestState.success}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="Enter your email"
                                        required
                                        disabled={resetting} aria-disabled={resetting}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={requesting} aria-disabled={requesting}>Send reset link</Button>
                                <div className="text-center text-sm text-muted-foreground">
                                    Back to {" "}
                                    <Link href="/signin" className="text-primary hover:underline">
                                        Login
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            <form action={resetAction} className="space-y-4">
                                {resetState.error && (
                                    <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                        <AlertCircle className="h-4 w-4" />
                                        {resetState.error}
                                    </div>
                                )}
                                {resetState.success && (
                                    <div className="flex items-center gap-2 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
                                        <CheckCircle className="h-4 w-4" />
                                        {resetState.success}
                                    </div>
                                )}
                                <input type="hidden" name="token" value={token} />
                                <input type="hidden" name="email" value={emailFromLink} />
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password for {emailFromLink}</Label>
                                    <Input id="password" name="password" type="password" autoComplete="new-password" placeholder="Create a new password"
                                        required
                                        disabled={resetting} aria-disabled={resetting}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={resetting} aria-disabled={resetting}>Reset password</Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


