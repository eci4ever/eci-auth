"use client"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import HeaderBar from "./ui/header"
import { useUser } from "./user-context"

export default function Page() {

  const user = useUser()

  return (

    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl">My Roles : {user?.roles}</div>
        <div className="bg-muted/50 aspect-video rounded-xl"></div>
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        My Permissions :
        <ul>
          {user?.permissions.map((perm) => (
            <li key={perm}>{perm} </li>
          ))}
        </ul>
      </div>
    </div>

  )
}
