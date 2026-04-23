import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

const CURRENCY_CODES = ["USD", "BRL", "EUR", "GBP", "JPY", "ARS", "CAD", "CHF", "AUD"]
const currencyNames = new Intl.DisplayNames(["pt-BR"], { type: "currency" })
const CURRENCIES = CURRENCY_CODES.map((code) => ({
  code,
  name: currencyNames.of(code) ?? code,
}))

const PERIODS = [
  { label: "7 dias", value: 7 },
  { label: "15 dias", value: 15 },
  { label: "30 dias", value: 30 },
  { label: "90 dias", value: 90 },
  { label: "365 dias", value: 365 },
]

const GREEN = "#4ade80"
const GREEN_BG = "rgba(74,222,128,0.08)"

function subtractDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split("T")[0]
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

function getCurrencySymbol(code: string): string {
  try {
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0)
    return formatted.replace(/[\d\s,\.]/g, "").trim()
  } catch {
    return code
  }
}

export default function HistoricoPage() {
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("BRL")
  const [period, setPeriod] = useState<number | null>(30)
  const [customRange, setCustomRange] = useState<DateRange | undefined>()
  const [showCalendar, setShowCalendar] = useState(false)
  const [data, setData] = useState<{ date: string; rate: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchHistory(startDate: string, endDate: string) {
    if (from === to) {
      setError("Selecione moedas diferentes.")
      setData([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `http://localhost:3333/history?from=${from}&to=${to}&start=${startDate}&end=${endDate}`
      )
      const json = await response.json()
      const formatted = Object.entries(json.rates).map(([date, rates]: [string, any]) => ({
        date,
        rate: rates[to],
      }))
      setData(formatted)
    } catch {
      setError("Erro ao buscar histórico. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (period !== null) {
      const startDate = subtractDays(period)
      const endDate = formatDate(new Date())
      fetchHistory(startDate, endDate)
    } else if (customRange?.from && customRange?.to) {
      fetchHistory(formatDate(customRange.from), formatDate(customRange.to))
    }
  }, [from, to, period, customRange])

  const min = data.length ? Math.min(...data.map((d) => d.rate)) : 0
  const max = data.length ? Math.max(...data.map((d) => d.rate)) : 0
  const first = data[0]?.rate
  const last = data[data.length - 1]?.rate
  const variation = first && last ? (((last - first) / first) * 100).toFixed(2) : null
  const isPositive = variation ? Number(variation) >= 0 : false
  const toSymbol = getCurrencySymbol(to)

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Histórico</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Variação do câmbio ao longo do tempo
        </p>
      </div>

      {/* Seletores de moeda */}
      <div className="flex items-center gap-4 flex-wrap">
        <Select value={from} onValueChange={setFrom}>
          <SelectTrigger className="w-48">
            <SelectValue />
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

        <span className="text-muted-foreground">→</span>

        <Select value={to} onValueChange={setTo}>
          <SelectTrigger className="w-48">
            <SelectValue />
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

      {/* Seletor de período */}
      <div className="flex items-center gap-2 flex-wrap">
        {PERIODS.map((p) => {
          const isActive = period === p.value
          return (
            <button
              key={p.value}
              onClick={() => { setPeriod(p.value); setCustomRange(undefined) }}
              className="px-4 py-1.5 rounded-lg text-sm transition-colors border"
              style={{
                borderColor: isActive ? GREEN : "rgba(255,255,255,0.1)",
                color: isActive ? GREEN : "",
                backgroundColor: isActive ? GREEN_BG : "",
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = GREEN
                  e.currentTarget.style.borderColor = GREEN
                  e.currentTarget.style.backgroundColor = GREEN_BG
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = ""
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
                  e.currentTarget.style.backgroundColor = ""
                }
              }}
            >
              {p.label}
            </button>
          )
        })}

        <button
          onClick={() => setShowCalendar(true)}
          className="px-4 py-1.5 rounded-lg text-sm transition-colors border flex items-center gap-2"
          style={{
            borderColor: period === null ? GREEN : "rgba(255,255,255,0.1)",
            color: period === null ? GREEN : "",
            backgroundColor: period === null ? GREEN_BG : "",
            fontWeight: period === null ? 600 : 400,
          }}
          onMouseEnter={(e) => {
            if (period !== null) {
              e.currentTarget.style.color = GREEN
              e.currentTarget.style.borderColor = GREEN
              e.currentTarget.style.backgroundColor = GREEN_BG
            }
          }}
          onMouseLeave={(e) => {
            if (period !== null) {
              e.currentTarget.style.color = ""
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
              e.currentTarget.style.backgroundColor = ""
            }
          }}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          {period === null && customRange?.from && customRange?.to
            ? `${customRange.from.toLocaleDateString("pt-BR")} → ${customRange.to.toLocaleDateString("pt-BR")}`
            : "Personalizado"}
        </button>
      </div>

      {/* Dialog do calendário */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="border-border max-w-sm" style={{ backgroundColor: "#0d1a0f" }}>
          <DialogHeader>
            <DialogTitle>Selecione o período</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <Calendar
              mode="range"
              selected={customRange}
              onSelect={setCustomRange}
              disabled={{ after: new Date() }}
              numberOfMonths={1}
            />
          </div>
          {customRange?.from && !customRange?.to && (
            <p className="text-muted-foreground text-sm text-center">
              Selecione a data final
            </p>
          )}
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              className="border-border text-white hover:bg-white/5"
              onClick={() => {
                setCustomRange(undefined)
                setShowCalendar(false)
                setPeriod(30)
              }}
            >
              Limpar
            </Button>
            <Button
              disabled={!customRange?.from || !customRange?.to}
              onClick={() => {
                if (customRange?.from && customRange?.to) {
                  setPeriod(null)
                  setShowCalendar(false)
                }
              }}
              style={{ backgroundColor: GREEN, color: "#0d1a0f" }}
            >
              Aplicar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cards de resumo */}
      {data.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-muted-foreground font-normal">Mínimo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">{toSymbol} {min.toFixed(4)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-muted-foreground font-normal">Máximo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">{toSymbol} {max.toFixed(4)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-muted-foreground font-normal">Variação no período</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-lg font-bold ${isPositive ? "text-[#4ade80]" : "text-red-400"}`}>
                {isPositive ? "+" : ""}{variation}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráfico */}
      <Card>
        <CardContent className="pt-6">
          {loading && (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
              Carregando...
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-64 text-red-400 text-sm">
              {error}
            </div>
          )}
          {!loading && !error && data.length === 0 && (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
              Selecione um período para visualizar o gráfico
            </div>
          )}
          {!loading && !error && data.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#666" }}
                  tickFormatter={(val) => {
                    const date = new Date(val)
                    return `${date.getDate()}/${date.getMonth() + 1}`
                  }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#666" }}
                  tickFormatter={(val) => val.toFixed(2)}
                  domain={["auto", "auto"]}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1a0f",
                    border: "1px solid rgba(74,222,128,0.2)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [Number(value).toFixed(4), `${from} → ${to}`]}
                  labelFormatter={(label) => {
                    const date = new Date(label)
                    return date.toLocaleDateString("pt-BR")
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke={GREEN}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: GREEN }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}