import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRightLeft, RefreshCw } from "lucide-react"


const CURRENCY_CODES = ["USD", "BRL", "EUR", "GBP", "JPY", "ARS", "CAD", "CHF", "AUD"]

const currencyNames = new Intl.DisplayNames(["pt-BR"], { type: "currency" })

const CURRENCIES = CURRENCY_CODES.map((code) => ({
  code,
  name: currencyNames.of(code) ?? code,
}))

export default function App() {
  const [amount, setAmount] = useState("1")
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("BRL")
  const [result, setResult] = useState<number | null>(null)
  const [rate, setRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      const response = await fetch(
        `http://localhost:3333/convert?from=${from}&to=${to}`
      )
      const data = await response.json()
      const fetchedRate = data.rates[to]
      setRate(fetchedRate)
      setResult(Number(amount) * fetchedRate)
    } catch (err) {
      setError("Erro ao buscar cotação. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  function swapCurrencies() {
    setFrom(to)
    setTo(from)
    setResult(null)
    setRate(null)
  }

  useEffect(() => {
    convert()
  }, [from, to])

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Moneda</CardTitle>
          <p className="text-muted-foreground text-sm">Conversão de moedas em tempo real</p>
        </CardHeader>
        <CardContent className="space-y-4">

          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Digite o valor"
          />

          <div className="flex items-center gap-2">
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="bottom" position="popper" sideOffset={4} className="bg-white">
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code} className="hover:bg-zinc-100 cursor-pointer">
                    <span className="font-medium">{c.code}</span>
                    <span className="text-muted-foreground text-sm ml-2">{c.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={swapCurrencies}>
              <ArrowRightLeft className="w-4 h-4" />
            </Button>

            <Select value={to} onValueChange={setTo}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="bottom" position="popper" sideOffset={4} className="bg-white">
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code} className="hover:bg-zinc-100 cursor-pointer">
                    <span className="font-medium">{c.code}</span>
                    <span className="text-muted-foreground text-sm ml-2">{c.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="default" className="w-full gap-2" onClick={convert} disabled={loading}>
            <RefreshCw className="w-4 h-4" />
            {loading ? "Convertendo..." : "Converter"}
          </Button>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-600 rounded-md px-3 py-2 text-sm">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {result !== null && rate !== null && !error && (
            <div className="text-center pt-2">
              <p className="text-3xl font-bold">
                {result.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: to,
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                1 {from} = {rate.toFixed(4)} {to}
              </p>
            </div>
          )}

        </CardContent>
      </Card>
    </main>
  )
}