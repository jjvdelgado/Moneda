import { Coins, History, Bell, TrendingUp, LogOut, HeadphonesIcon, Info } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const navItems = [
  { to: "/", label: "Converter", icon: Coins },
  { to: "/historico", label: "Histórico", icon: History },
  { to: "/alertas", label: "Alertas", icon: Bell },
  { to: "/simulador", label: "Simulador", icon: TrendingUp },
]

const footerItems = [
  { label: "Suporte", icon: HeadphonesIcon },
  { label: "Sobre", icon: Info },
  { label: "Sair", icon: LogOut },
]

const GREEN = "#4ade80"
const GREEN_BG = "rgba(74,222,128,0.08)"

export default function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  return (
    <Sidebar>
    <SidebarHeader className="p-6 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Coins className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <span className="text-lg font-bold" style={{ color: GREEN }}>Moneda</span>
          <p className="text-muted-foreground text-xs">Conversão de moedas</p>
        </div>
      </div>
    </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarMenu className="gap-1">
          {navItems.map((item) => {
            const isActive = item.to === "/" 
              ? location.pathname === "/" 
              : location.pathname.startsWith(item.to)

            return (
              <SidebarMenuItem key={item.to}>
                <NavLink
                  to={item.to}
                  className="flex items-center gap-3 px-4 h-11 w-full rounded-lg transition-colors group"
                  style={{
                    borderLeft: isActive ? `4px solid ${GREEN}` : "4px solid transparent",
                    color: isActive ? GREEN : "",
                    backgroundColor: isActive ? GREEN_BG : "",
                    fontWeight: isActive ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = GREEN
                      e.currentTarget.style.backgroundColor = GREEN_BG
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = ""
                      e.currentTarget.style.backgroundColor = ""
                    }
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border">
        <SidebarMenu className="gap-1">
          {footerItems.map((item) => {
            const isActive = location.pathname === `/${item.label.toLowerCase()}`
            const isSair = item.label === "Sair"

            return (
              <SidebarMenuItem key={item.label}>
                <button
                  onClick={() => {
                    if (item.label === "Sair") setShowLogout(true)
                    if (item.label === "Suporte") navigate("/suporte")
                    if (item.label === "Sobre") navigate("/sobre")
                  }}
                  className="flex items-center gap-3 px-4 h-11 w-full rounded-lg transition-colors text-sm"
                  style={{
                    borderLeft: isActive && !isSair ? `4px solid ${GREEN}` : "4px solid transparent",
                    color: isSair ? "#ef4444" : isActive ? GREEN : "",
                    backgroundColor: isActive && !isSair ? GREEN_BG : "",
                    fontWeight: isActive ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (isSair) {
                      e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)"
                    } else if (!isActive) {
                      e.currentTarget.style.color = GREEN
                      e.currentTarget.style.backgroundColor = GREEN_BG
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isSair) {
                      e.currentTarget.style.backgroundColor = ""
                    } else if (!isActive) {
                      e.currentTarget.style.color = ""
                      e.currentTarget.style.backgroundColor = ""
                    }
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        <Dialog open={showLogout} onOpenChange={setShowLogout}>
          <DialogContent className="border-border" style={{ backgroundColor: "#0d1a0f" }}>
            <DialogHeader>
              <DialogTitle className="text-white">Sair da conta</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Tem certeza que deseja sair? Você precisará fazer login novamente para acessar o app.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowLogout(false)}
                className="border-border text-white hover:bg-white/5"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => setShowLogout(false)}
                style={{ backgroundColor: "#ef4444", color: "white" }}
                className="hover:opacity-90"
              >
                Sair
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  )
}