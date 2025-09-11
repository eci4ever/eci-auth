"use client"
import { SidebarTrigger } from "@/components/ui/sidebar";
import BreadcrumbBar from "./breadcrumb";
import { Separator } from "@/components/ui/separator";
import { hasPermission, hasRole } from "@/lib/helpers";
import { useUser } from "../user-context";

export default function HeaderBar() {
    const user = useUser()
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <BreadcrumbBar />
            </div>
            <div className="ml-auto flex items-end gap-4 px-8">
                <span className="text-foreground font-normal">Welcome {user?.name} !</span>
            </div>
            <div>
                {hasRole(user, "admin") && (
                    <a href="/admin">Roles</a>
                )}
            </div>
            <div>
                {hasPermission(user, "create_user") && (
                    <a href="/admin">Permissions</a>
                )}
            </div>
        </header>
    )
}