import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRightLeft, RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react"

const CURRENCY_CODES = ["USD", "BRL", "EUR", "GBP", "JPY", "ARS", "CAD", "CHF", "AUD"]
const currencyNames = new Intl.DisplayNames(["pt-BR"], { type: "currency" })
const CURRENCIES = CURRENCY_CODES.map((code) => ({
  code,
  name: currencyNames.of(code) ?? code,
}))

const GREEN = "#4ade80"

export default function ConverterPage() {
  const [amount, setAmount] = useState("1")
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("BRL")
  const [result, setResult] = useState<number | null>(null)
  const [rate, setRate] = useState<number | null>(null)
  const [previousRate, setPreviousRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  async function convert() {
    if (!amount || isNaN(Number(amount))) return

    if (from === to) {
      setError("Selecione moedas diferentes para converter.")
      setResult(null)
      setRate(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [currentRes, historyRes] = await Promise.all([
        fetch(`http://localhost:3333/convert?from=${from}&to=${to}`),
        fetch(`http://localhost:3333/history?from=${from}&to=${to}&start=${getYesterday()}&end=${getYesterday()}`)
      ])

      const currentData = await currentRes.json()
      const historyData = await historyRes.json()

      const fetchedRate = currentData.rates[to]
      setRate(fetchedRate)
      setResult(Number(amount) * fetchedRate)
      setLastUpdated(new Date().toLocaleTimeString("pt-BR"))

      const historyRates = Object.values(historyData.rates) as any[]
      if (historyRates.length > 0) {
        setPreviousRate(historyRates[0][to])
      }
    } catch {
      setError("Erro ao buscar cotação. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  function getYesterday() {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toISOString().split("T")[0]
  }

  function swapCurrencies() {
    setFrom(to)
    setTo(from)
    setResult(null)
    setRate(null)
    setPreviousRate(null)
  }

  useEffect(() => {
    convert()
  }, [from, to])

  const variation = rate && previousRate
    ? ((rate - previousRate) / previousRate) * 100
    : null

  const isUp = variation !== null && variation > 0
  const isDown = variation !== null && variation < 0

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-4">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Converter</h1>
        <p className="text-muted-foreground text-sm mt-1">Cotações em tempo real</p>
      </div>

      {/* Card principal */}
      <Card className="w-full">
        <CardContent className="pt-6 space-y-5">

          {/* Input de valor */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Valor</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Digite o valor"
              className="text-lg h-12"
            />
          </div>

          {/* Seletores de moeda */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Moedas</label>
            <div className="flex items-center gap-3">
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="flex-1" style={{ height: "48px" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="bottom" position="popper" className="bg-card text-white z-50">
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code} className="hover:bg-white/5 cursor-pointer">
                      <span className="font-medium">{c.code}</span>
                      <span className="text-muted-foreground text-sm ml-2">{c.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={swapCurrencies} style={{ height: "48px", width: "48px" }} className="flex-shrink-0 p-0">
                <ArrowRightLeft className="w-4 h-4" />
              </Button>

              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="flex-1" style={{ height: "48px" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="bottom" position="popper" className="bg-card text-white z-50">
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code} className="hover:bg-white/5 cursor-pointer">
                      <span className="font-medium">{c.code}</span>
                      <span className="text-muted-foreground text-sm ml-2">{c.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botão converter */}
          <Button
            className="w-full h-12 gap-2 text-base"
            onClick={convert}
            disabled={loading}
            style={{ backgroundColor: GREEN, color: "#0d1a0f" }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Convertendo..." : "Converter"}
          </Button>

          {error && (
            <div className="flex items-center gap-2 bg-red-50/5 border border-red-300/30 text-red-400 rounded-md px-3 py-2 text-sm">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Resultado */}
          {result !== null && rate !== null && !error && (
            <div className="rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Resultado</p>
                  <p className="text-4xl font-bold" style={{ color: GREEN }}>
                    {result.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: to,
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                {variation !== null && (
                  <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${
                    isUp ? "text-green-400 bg-green-400/10" :
                    isDown ? "text-red-400 bg-red-400/10" :
                    "text-muted-foreground bg-white/5"
                  }`}>
                    {isUp ? <TrendingUp className="w-3.5 h-3.5" /> :
                    isDown ? <TrendingDown className="w-3.5 h-3.5" /> :
                    <Minus className="w-3.5 h-3.5" />}
                    {isUp ? "+" : ""}{variation.toFixed(2)}% hoje
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>1 {from} = {rate.toFixed(4)} {to}</span>
                {lastUpdated && <span>Atualizado às {lastUpdated}</span>}
              </div>
            </div>
          )}

        </CardContent>
      </Card>

    </div>
  )
}