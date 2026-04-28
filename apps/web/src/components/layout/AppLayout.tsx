import { Outlet, useLocation } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./AppSidebar"
import { AnimatePresence } from "framer-motion"
import PageTransition from "./PageTransition"

export default function AppLayout() {
  const location = useLocation()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="p-2 border-b">
            <SidebarTrigger />
          </div>
          <div className="flex-1">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}