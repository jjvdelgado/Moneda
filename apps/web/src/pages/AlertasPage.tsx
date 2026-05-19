import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, Bell, BellOff } from "lucide-react"
import { toast } from "sonner"

const CURRENCY_CODES = ["USD", "BRL", "EUR", "GBP", "JPY", "ARS", "CAD", "CHF", "AUD"]
const currencyNames = new Intl.DisplayNames(["pt-BR"], { type: "currency" })
const CURRENCIES = CURRENCY_CODES.map((code) => ({
  code,
  name: currencyNames.of(code) ?? code,
}))

const GREEN = "#4ade80"

interface Alert {
  id: string
  fromCurrency: string
  toCurrency: string
  condition: string
  targetRate: number
  notifyEmail: string | null
  triggered: boolean
  triggeredAt: string | null
  createdAt: string
}

export default function AlertasPage() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("BRL")
  const [condition, setCondition] = useState("below")
  const [targetRate, setTargetRate] = useState("")
  const [formError, setFormError] = useState<string | null>(null)

  const [useCustomEmail, setUseCustomEmail] = useState(false)
  const [customEmail, setCustomEmail] = useState("")

  async function fetchAlerts() {
    if (!user) return
    try {
      const response = await fetch(`http://localhost:3333/alerts/${user.id}`)
      const data = await response.json()
      setAlerts(data)
    } catch {
      toast.error("Erro ao buscar alertas.")
    } finally {
      setLoading(false)
    }
  }

  async function createAlert() {
    if (useCustomEmail && (!customEmail || !customEmail.includes("@"))) {
      setFormError("Informe um email válido.")
      return
    }
    if (from === to) {
      setFormError("Selecione moedas diferentes.")
      return
    }

    setCreating(true)
    setFormError(null)

    try {
      const response = await fetch("http://localhost:3333/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          fromCurrency: from,
          toCurrency: to,
          condition,
          targetRate: Number(targetRate),
          notifyEmail: useCustomEmail ? customEmail : user?.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setFormError(data.error)
        return
      }

      setAlerts((prev) => [data, ...prev])
      setTargetRate("")
      toast.success("Alerta criado!", {
        description: `Você será notificado quando ${from}/${to} estiver ${condition === "below" ? "abaixo de" : "acima de"} ${targetRate}.`,
        style: {
          backgroundColor: "#0d2a0d",
          border: "1px solid #4ade80",
          color: "#4ade80",
        },
      })
    } catch {
      setFormError("Erro ao criar alerta.")
    } finally {
      setCreating(false)
    }
  }

  async function deleteAlert(id: string) {
    try {
      await fetch(`http://localhost:3333/alerts/${id}`, { method: "DELETE" })
      setAlerts((prev) => prev.filter((a) => a.id !== id))
      toast.success("Alerta removido.", {
        style: {
          backgroundColor: "#0d2a0d",
          border: "1px solid #4ade80",
          color: "#4ade80",
        },
      })
    } catch {
      toast.error("Erro ao remover alerta.")
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [user])

  const activeAlerts = alerts.filter((a) => !a.triggered)
  const triggeredAlerts = alerts.filter((a) => a.triggered)

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alertas</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Seja notificado por email quando o câmbio atingir sua meta
        </p>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Criar novo alerta</CardTitle>
        </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Me avise quando o</span>

              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="w-20 flex-shrink-0" style={{ borderColor: "#4ade80", color: "white" }}>
                  <SelectValue>{from}</SelectValue>
                </SelectTrigger>
                <SelectContent side="bottom" position="popper" className="bg-card text-white">
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code} className="hover:bg-white/5 cursor-pointer">
                      <span className="font-medium">{c.code}</span>
                      <span className="text-muted-foreground text-sm ml-2">{c.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-sm text-muted-foreground whitespace-nowrap">ficar</span>

              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="w-28 flex-shrink-0" style={{ borderColor: "#4ade80", color: "white" }}>
                  <SelectValue>{condition === "below" ? "abaixo de" : "acima de"}</SelectValue>
                </SelectTrigger>
                <SelectContent side="bottom" position="popper" className="bg-card text-white">
                  <SelectItem value="below" className="hover:bg-white/5 cursor-pointer">abaixo de</SelectItem>
                  <SelectItem value="above" className="hover:bg-white/5 cursor-pointer">acima de</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="5,20"
                value={targetRate}
                onChange={(e) => setTargetRate(e.target.value)}
                className="w-20 flex-shrink-0"
                style={{ borderColor: "#4ade80" }}
              />

              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="w-20 flex-shrink-0" style={{ borderColor: "#4ade80", color: "white" }}>
                  <SelectValue>{to}</SelectValue>
                </SelectTrigger>
                <SelectContent side="bottom" position="popper" className="bg-card text-white">
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code} className="hover:bg-white/5 cursor-pointer">
                      <span className="font-medium">{c.code}</span>
                      <span className="text-muted-foreground text-sm ml-2">{c.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="mb-5">Enviar notificação para</Label>
              <div className="flex gap-2">
              <button
                onClick={() => setUseCustomEmail(false)}
                className="flex-1 px-3 py-2 rounded-lg text-sm border transition-colors truncate"
                style={{
                  borderColor: !useCustomEmail ? "#4ade80" : "rgba(255,255,255,0.1)",
                  color: !useCustomEmail ? "#4ade80" : "",
                  backgroundColor: !useCustomEmail ? "rgba(74,222,128,0.08)" : "",
                }}
              >
                Meu email • {user?.email}
              </button>
              <button
                onClick={() => setUseCustomEmail(true)}
                className="flex-1 px-3 py-2 rounded-lg text-sm border transition-colors"
                style={{
                  borderColor: useCustomEmail ? "#4ade80" : "rgba(255,255,255,0.1)",
                  color: useCustomEmail ? "#4ade80" : "",
                  backgroundColor: useCustomEmail ? "rgba(74,222,128,0.08)" : "",
                }}
              >
                Outro email
              </button>
              </div>

              {useCustomEmail && (
                <div className="pt-2">
                  <Input
                    type="email"
                    placeholder="outro@email.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                  />
                </div>
              )}
          </div>

            {formError && (
              <div className="flex items-center gap-2 bg-red-50/5 border border-red-300/30 text-red-400 rounded-md px-3 py-2 text-sm">
                <span>⚠️</span>
                <span>{formError}</span>
              </div>
            )}

            <Button
              className="w-full gap-2"
              onClick={createAlert}
              disabled={creating}
              style={{ backgroundColor: GREEN, color: "#0d1a0f" }}
            >
              <Bell className="w-4 h-4" />
              {creating ? "Criando..." : "Criar alerta"}
            </Button>
          </CardContent>
      </Card>

      {/* Alertas ativos */}
      {loading && (
        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          Carregando...
        </div>
      )}

      {!loading && activeAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Alertas ativos ({activeAlerts.length})</h2>
          {activeAlerts.map((a) => (
            <Card key={a.id} className="border-border">
              <CardContent className="py-4 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(74,222,128,0.1)" }}>
                      <Bell className="w-4 h-4" style={{ color: GREEN }} />
                    </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">
                          {a.fromCurrency}/{a.toCurrency}{" "}
                          <span className="text-muted-foreground font-normal">
                            {a.condition === "below" ? "abaixo de" : "acima de"}
                          </span>{" "}
                          <span style={{ color: GREEN }}>{a.targetRate}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Notificar: {a.notifyEmail || user?.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Criado em {new Date(a.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                    onClick={() => deleteAlert(a.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Alertas disparados */}
      {!loading && triggeredAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Alertas disparados ({triggeredAlerts.length})</h2>
          {triggeredAlerts.map((a) => (
            <Card key={a.id} className="border-border opacity-60">
              <CardContent className="py-4 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
                      <BellOff className="w-4 h-4 text-muted-foreground" />
                    </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">
                          {a.fromCurrency}/{a.toCurrency}{" "}
                          <span className="text-muted-foreground font-normal">
                            {a.condition === "below" ? "abaixo de" : "acima de"}
                          </span>{" "}
                          {a.targetRate}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Notificado: {a.notifyEmail || user?.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Criado em {new Date(a.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Disparado em {a.triggeredAt ? new Date(a.triggeredAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }) : "-"}
                        </p>
                      </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                    onClick={() => deleteAlert(a.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && alerts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
          <Bell className="w-8 h-8 text-muted-foreground" />
          <p className="text-lg font-medium">Nenhum alerta criado</p>
          <p className="text-muted-foreground text-sm max-w-xs">
            Crie um alerta acima e receba um email quando o câmbio atingir sua meta
          </p>
        </div>
      )}
    </div>
  )
}