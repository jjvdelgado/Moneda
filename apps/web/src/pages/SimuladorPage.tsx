import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
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
import { CalendarIcon, TrendingUp, TrendingDown } from "lucide-react"

const CURRENCY_CODES = ["USD", "BRL", "EUR", "GBP", "JPY", "ARS", "CAD", "CHF", "AUD"]
const currencyNames = new Intl.DisplayNames(["pt-BR"], { type: "currency" })
const CURRENCIES = CURRENCY_CODES.map((code) => ({
  code,
  name: currencyNames.of(code) ?? code,
}))

const GREEN = "#4ade80"

interface SimulationResult {
  amount: number
  boughtCurrency: string
  convertTo: string
  pastDate: string
  pastRate: number
  currentRate: number
  pastValueInTarget: number
  currentValueInTarget: number
  variation: number
  profit: number
}

export default function SimuladorPage() {
  const [amount, setAmount] = useState("")
  const [boughtCurrency, setBoughtCurrency] = useState("USD")
  const [convertTo, setConvertTo] = useState("BRL")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [showCalendar, setShowCalendar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SimulationResult | null>(null)

  function clearAll() {
    setAmount("")
    setSelectedDate(undefined)
    setResult(null)
    setError(null)
  }

  async function simulate() {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Informe um valor válido.")
      return
    }
    if (!selectedDate) {
      setError("Selecione uma data.")
      return
    }
    if (boughtCurrency === convertTo) {
      setError("Selecione moedas diferentes.")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const pastDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`

      const [pastRes, currentRes] = await Promise.all([
        fetch(`http://localhost:3333/history?from=${boughtCurrency}&to=${convertTo}&start=${pastDateStr}&end=${pastDateStr}`),
        fetch(`http://localhost:3333/convert?from=${boughtCurrency}&to=${convertTo}`)
      ])

      const pastJson = await pastRes.json()
      const currentJson = await currentRes.json()

      const pastRates = Object.values(pastJson.rates) as any[]
      if (!pastRates.length) {
        setError("Não há dados para essa data. Tente um dia útil.")
        setLoading(false)
        return
      }

      const pastRate = pastRates[0][convertTo]
      const currentRate = currentJson.rates[convertTo]
      const numAmount = Number(amount)
      const pastValueInTarget = numAmount * pastRate
      const currentValueInTarget = numAmount * currentRate
      const variation = ((currentRate - pastRate) / pastRate) * 100
      const profit = currentValueInTarget - pastValueInTarget

      setResult({
        amount: numAmount,
        boughtCurrency,
        convertTo,
        pastDate: pastDateStr,
        pastRate,
        currentRate,
        pastValueInTarget,
        currentValueInTarget,
        variation,
        profit,
      })
    } catch {
      setError("Erro ao buscar dados. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const isProfit = result ? result.profit >= 0 : false

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simulador</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Descubra quanto vale hoje uma moeda que você comprou no passado
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground font-normal">
              Preencha os campos abaixo para simular
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:text-white hover:bg-white/5 text-xs"
              onClick={clearAll}
            >
              Limpar tudo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Moeda que você comprou</label>
            <div className="flex gap-3">
              <Select value={boughtCurrency} onValueChange={setBoughtCurrency}>
                <SelectTrigger className="w-52">
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
              <Input
                type="number"
                placeholder="Ex: 1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Ver valor em</label>
            <Select value={convertTo} onValueChange={setConvertTo}>
              <SelectTrigger>
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

          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Data da compra</label>
            <button
              onClick={() => setShowCalendar(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md border text-sm transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = GREEN
                e.currentTarget.style.color = GREEN
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
                e.currentTarget.style.color = ""
              }}
            >
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              {selectedDate
                ? selectedDate.toLocaleDateString("pt-BR")
                : <span className="text-muted-foreground">Selecione uma data</span>
              }
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50/5 border border-red-300/30 text-red-400 rounded-md px-3 py-2 text-sm">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <Button
            className="w-full gap-2"
            onClick={simulate}
            disabled={loading}
            style={{ backgroundColor: GREEN, color: "#0d1a0f" }}
          >
            {loading ? "Calculando..." : "Simular"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {isProfit
                ? <TrendingUp className="w-5 h-5" style={{ color: GREEN }} />
                : <TrendingDown className="w-5 h-5 text-red-400" />
              }
              Resultado da simulação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <p className="text-sm text-muted-foreground">
              Você comprou{" "}
              <span className="text-white font-medium">
                {result.amount.toLocaleString("pt-BR", { style: "currency", currency: result.boughtCurrency })}
              </span>{" "}
              em {new Date(result.pastDate + "T12:00:00").toLocaleDateString("pt-BR")}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Valia na época</p>
                <p className="text-xl font-bold">
                  {result.pastValueInTarget.toLocaleString("pt-BR", { style: "currency", currency: result.convertTo })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Cotação: {result.pastRate.toFixed(4)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Vale hoje</p>
                <p className="text-xl font-bold" style={{ color: GREEN }}>
                  {result.currentValueInTarget.toLocaleString("pt-BR", { style: "currency", currency: result.convertTo })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Cotação: {result.currentRate.toFixed(4)}
                </p>
              </div>
            </div>
            
            <div className="my-2 mx-0 h-px bg-white/10" />


            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Variação do câmbio</p>
                <p className={`text-lg font-bold ${isProfit ? "text-[#4ade80]" : "text-red-400"}`}>
                  {isProfit ? "+" : ""}{result.variation.toFixed(2)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  {isProfit ? "Ganho estimado" : "Perda estimada"}
                </p>
                <p className={`text-lg font-bold ${isProfit ? "text-[#4ade80]" : "text-red-400"}`}>
                  {isProfit ? "+" : ""}
                  {result.profit.toLocaleString("pt-BR", { style: "currency", currency: result.convertTo })}
                </p>
              </div>
            </div>

          </CardContent>
        </Card>
      )}

      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="border-border max-w-sm" style={{ backgroundColor: "#0d1a0f" }}>
          <DialogHeader>
            <DialogTitle>Selecione a data da compra</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date)
                setShowCalendar(false)
              }}
              disabled={{ after: new Date() }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}