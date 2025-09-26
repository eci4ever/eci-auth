import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { verifyEmail } from "@/lib/auth-actions"

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string; email?: string }> }) {
    const params = await searchParams
    const token = params?.token ?? ""
    const email = params?.email ?? ""

    let ok = false
    if (token && email) {
        try {
            ok = await verifyEmail(token, email)
        } catch {
            ok = false
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <Card className="border-border shadow-lg">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
                        <CardDescription>
                            {token && email ? (ok ? "Your email has been verified successfully." : "Verification link is invalid or expired.") : "Missing verification parameters."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Link href={ok ? "/signin" : "/signup"}>
                            <Button>{ok ? "Proceed to sign in" : "Back to sign up"}</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


