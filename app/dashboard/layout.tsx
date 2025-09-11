// "use client"
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import HeaderBar from "./ui/header";
import { getCurrentUser } from "@/lib/actions";
import { UserProvider } from "./user-context";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const user = await getCurrentUser();

    return (
        <UserProvider value={user}>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <HeaderBar />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </UserProvider>
    )
} 