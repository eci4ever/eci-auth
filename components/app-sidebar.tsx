"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserRole } from "@/lib/definition"
import { ComponentProps } from "react"
import { sidebarData } from "@/lib/sidebar-data"
import Link from "next/link"

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  user?: UserRole | null
}

const data = sidebarData

export function AppSidebar({ user, ...props }: AppSidebarProps) {

  const roles = user?.roles ?? []

  const hasAccess = (required?: string[]) =>
    !required || required.some((r) => roles.includes(r))

  const navMain = data.navMain
    .filter((item) => hasAccess(item.requiredRoles))
    .map((item) => ({
      ...item,
      items: item.items?.filter((sub) => hasAccess(sub.requiredRoles)) || [],
    }))

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.name ?? "Guest",
          email: user?.email ?? "guest@example.com",
          image: user?.image ?? "",
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
