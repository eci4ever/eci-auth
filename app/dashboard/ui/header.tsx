import { SidebarTrigger } from "@/components/ui/sidebar";
import BreadcrumbBar from "./breadcrumb";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { hasPermission, hasRole } from "@/lib/helpers";
import { getCurrentUser, signOutAction } from "@/lib/actions";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";

type UserSafe = Omit<User, "password"> & {
    roles: string[];
    permissions: string[];
};

export default function HeaderBar() {

    const [user, setUser] = useState<UserSafe | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const user = await getCurrentUser();
            setUser(user);
        }
        fetchUser();
    }, []);

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    const handleSignOut = async () => {
        try {
            await signOutAction();
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

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
                {/* Placeholder for right-aligned content */}
                <Link href={"/"}> Home <span className="text-xl text-blue-500">{user.name}</span></Link>
            </div>
            <div>
                {hasRole(user.roles, "admin") && (
                    <Link href="/admin">Roles</Link>
                )}
            </div>
            <div>
                {hasPermission(user.permissions, "create_user") && (
                    <Link href="/admin">Permissions</Link>
                )}
            </div>
            <button
                onClick={handleSignOut}
                className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            >
                <div className="hidden md:block">Sign Out</div>
            </button>
        </header>
    )
}