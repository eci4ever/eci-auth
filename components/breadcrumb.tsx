"use client"

import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
    BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { requestEmailVerification } from "@/lib/auth-actions";
import { useActionState } from "react";
import { Button } from "./ui/button";
import { UserRole } from "@/lib/definition";


export default function BreadcrumbBar({ user }: { user: UserRole | null }) {

    const [resendState, resendAction, isResending] = useActionState(requestEmailVerification, {}, undefined)

    if (!user) {
        return <p>No user data</p>
    }

    const isVerified = user.emailVerified

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                        Smart Invoice Dashboard
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        <div className="flex flex-1 items-center">
                            Welcome {user?.name}
                            {!isVerified ?

                                <form action={resendAction} className="flex items-center">
                                    <input type="hidden" name="email" value={user?.email} />
                                    <Button type="submit" variant="outline" className="px-2 mx-2">
                                        Verify Email
                                    </Button>
                                </form> : null}
                        </div>
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}