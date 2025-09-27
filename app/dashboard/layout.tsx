import { AppSidebar } from "@/components/app-sidebar";
import BreadcrumbBar from "@/components/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth-actions";
import { Separator } from "@radix-ui/react-separator";

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const user = await getCurrentUser()

    return (
        <div>
            <SidebarProvider>
                <AppSidebar user={user} />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <BreadcrumbBar user={user} />
                        </div>
                    </header>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}