import { SidebarTrigger } from "@/components/ui/sidebar";
import BreadcrumbBar from "./breadcrumb";
import { Separator } from "@/components/ui/separator";
// import { hasPermission, hasRole } from "@/lib/helpers";
import { getCurrentUser } from "@/lib/actions";
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
                <span className="text-foreground font-normal">Welcome {user.name} !</span>
            </div>
            {/* <div>
                {hasRole(user.roles, "admin") && (
                    <Link href="/admin">Roles</Link>
                )}
            </div>
            <div>
                {hasPermission(user.permissions, "create_user") && (
                    <Link href="/admin">Permissions</Link>
                )}
            </div> */}
        </header>
    )
}