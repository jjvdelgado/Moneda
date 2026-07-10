import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowRight, ArrowUp, ArrowDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { API_URL } from "@/lib/api"

interface Conversion {
  id: string
  fromCurrency: string
  toCurrency: string
  amount: number
  result: number
  rate: number
  createdAt: string
}

const GREEN = "#4ade80"

export default function HistoricoConversoesPage() {
  const { user } = useAuth()
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [showDeleteAll, setShowDeleteAll] = useState(false)
  const [sortAsc, setSortAsc] = useState(false)


  async function fetchConversions() {
    if (!user) return
    try {
      const response = await fetch(`${API_URL}/conversions/${user.id}`)
      const data = await response.json()
      setConversions(data)
    } catch {
      setError("Erro ao buscar histórico.")
    } finally {
      setLoading(false)
    }
  }

  async function deleteSelected() {
    try {
      await Promise.all(
        selected.map((id) =>
          fetch(`${API_URL}/conversions/${id}`, { method: "DELETE" })
        )
      )
      setConversions((prev) => prev.filter((c) => !selected.includes(c.id)))
      setSelected([])
      toast.success(`${selected.length} conversão(ões) excluída(s).`, {
        style: {
          backgroundColor: "#0d2a0d",
          border: "1px solid #4ade80",
          color: "#4ade80",
        },
      })
    } catch {
      toast.error("Erro ao excluir conversões.")
    }
  }

  async function deleteAll() {
    if (!user) return
    try {
      await fetch(`${API_URL}/conversions/all/${user.id}`, {
        method: "DELETE",
      })
      setConversions([])
      setSelected([])
      setShowDeleteAll(false)
      toast.success("Histórico limpo com sucesso.", {
        style: {
          backgroundColor: "#0d2a0d",
          border: "1px solid #4ade80",
          color: "#4ade80",
        },
      })
    } catch {
      toast.error("Erro ao limpar histórico.")
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  useEffect(() => {
    fetchConversions()
  }, [user])

  const currencyNames = new Intl.DisplayNames(["pt-BR"], { type: "currency" })

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Histórico de Conversões</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {conversions.length} conversão(ões) salva(s)
          </p>
        </div>

        {conversions.length > 0 && (
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2"
                onClick={deleteSelected}
              >
                <Trash2 className="w-4 h-4" />
                Excluir {selected.length} selecionado(s)
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2"
              onClick={() => setShowDeleteAll(true)}
            >
              <Trash2 className="w-4 h-4" />
              Apagar tudo
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:bg-white/5 gap-2"
                onClick={() => setSortAsc(!sortAsc)}
                >
                {sortAsc ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {sortAsc ? "Mais antigas" : "Mais recentes"}
            </Button>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
          Carregando...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50/5 border border-red-300/30 text-red-400 rounded-md px-3 py-2 text-sm">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && conversions.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 gap-2 text-center">
          <p className="text-lg font-medium">Nenhuma conversão ainda</p>
          <p className="text-muted-foreground text-sm">
            Suas conversões aparecerão aqui automaticamente
          </p>
        </div>
      )}

        {!loading && !error && conversions.length > 0 && (
        <div className="space-y-3">
            {[...conversions]
            .sort((a, b) => sortAsc
                ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map((c) => {
            const isSelected = selected.includes(c.id)
            return (
              <Card
                key={c.id}
                className="border-border cursor-pointer transition-colors"
                style={isSelected ? { borderColor: GREEN, backgroundColor: "rgba(74,222,128,0.05)" } : {}}
                onClick={() => toggleSelect(c.id)}
              >
                <CardContent className="py-4 px-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                        style={{
                          border: `2px solid ${isSelected ? GREEN : "rgba(255,255,255,0.2)"}`,
                          backgroundColor: isSelected ? "rgba(74,222,128,0.15)" : "transparent"
                        }}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: GREEN }} />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <span>{c.fromCurrency}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{c.toCurrency}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {currencyNames.of(c.fromCurrency)} → {currencyNames.of(c.toCurrency)}
                        </p>
                      </div>

                      <div className="hidden sm:block h-8 w-px bg-border" />

                      <div className="hidden sm:block space-y-1">
                        <p className="text-sm font-medium">
                          {c.amount.toLocaleString("pt-BR", { style: "currency", currency: c.fromCurrency })}
                          {" → "}
                          <span style={{ color: GREEN }}>
                            {c.result.toLocaleString("pt-BR", { style: "currency", currency: c.toCurrency })}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          1 {c.fromCurrency} = {c.rate.toFixed(4)} {c.toCurrency}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        {new Date(c.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                        onClick={(e) => {
                        e.stopPropagation()
                        fetch(`${API_URL}/conversions/${c.id}`, { method: "DELETE" })
                        setConversions((prev) => prev.filter((conv) => conv.id !== c.id))
                        setSelected((prev) => prev.filter((id) => id !== c.id))
                        toast.success("Conversão excluída.", {
                            style: {
                            backgroundColor: "#0d2a0d",
                            border: "1px solid #4ade80",
                            color: "#4ade80",
                            },
                        })
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog apagar tudo */}
      <Dialog open={showDeleteAll} onOpenChange={setShowDeleteAll}>
        <DialogContent className="border-border" style={{ backgroundColor: "#0d1a0f" }}>
          <DialogHeader>
            <DialogTitle>Apagar todo o histórico</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja apagar todas as {conversions.length} conversões salvas? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-border text-white hover:bg-white/5"
              onClick={() => setShowDeleteAll(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={deleteAll}
              style={{ backgroundColor: "#ef4444", color: "white" }}
              className="hover:opacity-90"
            >
              Apagar tudo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}