import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Coins } from "lucide-react"

const GREEN = "#4ade80"

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    if (!email || !password) {
      setError("Preencha todos os campos.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      navigate("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "radial-gradient(ellipse at top, #0d2a0d 0%, #000000 70%)" }}>
      <div className="w-full max-w-md space-y-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg" style={{ boxShadow: "0 0 40px rgba(74,222,128,0.2)" }}>
            <Coins className="w-9 h-9 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold" style={{ color: GREEN }}>Moneda</h1>
            <p className="text-muted-foreground text-sm mt-1">Bem-vindo de volta</p>
          </div>
        </div>

        {/* Card */}
        <Card className="border-border w-full">
          <CardContent className="pt-8 pb-8 px-10 space-y-5">

        <div className="text-center">
          <h2 className="text-xl font-bold">Entrar</h2>
          <p className="text-muted-foreground text-sm mt-1">Acesse sua conta do Moneda</p>
        </div>

            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Senha</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="h-11"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50/5 border border-red-300/30 text-red-400 rounded-md px-3 py-2 text-sm">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <Button
              className="w-full h-11 text-base font-medium"
              onClick={handleLogin}
              disabled={loading}
              style={{ backgroundColor: GREEN, color: "#0d1a0f" }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Não tem conta?{" "}
              <Link to="/cadastro" className="font-medium hover:underline" style={{ color: GREEN }}>
                Cadastre-se gratuitamente
              </Link>
            </p>

          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          © 2026 Moneda • Cotações fornecidas pela Frankfurter API
        </p>

      </div>
    </div>
  )
}