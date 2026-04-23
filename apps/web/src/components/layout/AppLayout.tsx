import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./AppSidebar"

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="p-2 border-b">
            <SidebarTrigger />
          </div>
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}