import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, Lock } from "lucide-react"

const GREEN = "#4ade80"

export default function PerfilPage() {
  const { user, token, login, updateUser } = useAuth()

  const [name, setName] = useState(user?.name || "")
  const [nameLoading, setNameLoading] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [nameSuccess, setNameSuccess] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passLoading, setPassLoading] = useState(false)
  const [passError, setPassError] = useState<string | null>(null)
  const [passSuccess, setPassSuccess] = useState(false)

  async function handleUpdateName() {
    if (!name.trim()) {
      setNameError("O nome não pode ser vazio.")
      return
    }

    setNameLoading(true)
    setNameError(null)
    setNameSuccess(false)

    try {
      const response = await fetch("http://localhost:3333/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user?.id, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        setNameError(data.error)
        return
      }

      updateUser(data.user)
      setNameSuccess(true)
      setTimeout(() => setNameSuccess(false), 3000)
    } catch {
      setNameError("Erro ao atualizar nome.")
    } finally {
      setNameLoading(false)
    }
  }

  async function handleUpdatePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError("Preencha todos os campos.")
      return
    }
    if (newPassword.length < 6) {
      setPassError("A nova senha deve ter pelo menos 6 caracteres.")
      return
    }
    if (newPassword !== confirmPassword) {
      setPassError("As senhas não coincidem.")
      return
    }

    setPassLoading(true)
    setPassError(null)
    setPassSuccess(false)

    try {
      const response = await fetch("http://localhost:3333/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user?.id, currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        setPassError(data.error)
        return
      }

      setPassSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setPassSuccess(false), 3000)
    } catch {
      setPassError("Erro ao atualizar senha.")
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie suas informações pessoais</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
          style={{ backgroundColor: GREEN, color: "#0d1a0f" }}
        >
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-lg">{user?.name}</p>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Atualizar nome */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" />
            Informações pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nome</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled className="opacity-50" />
            <p className="text-xs text-muted-foreground">O email não pode ser alterado.</p>
          </div>

          {nameError && (
            <div className="flex items-center gap-2 bg-red-50/5 border border-red-300/30 text-red-400 rounded-md px-3 py-2 text-sm">
              <span>⚠️</span>
              <span>{nameError}</span>
            </div>
          )}

          {nameSuccess && (
            <div className="flex items-center gap-2 bg-green-50/5 border border-green-300/30 text-green-400 rounded-md px-3 py-2 text-sm">
              <span>✓</span>
              <span>Nome atualizado com sucesso!</span>
            </div>
          )}

          <Button
            onClick={handleUpdateName}
            disabled={nameLoading}
            style={{ backgroundColor: GREEN, color: "#0d1a0f" }}
          >
            {nameLoading ? "Salvando..." : "Salvar nome"}
          </Button>
        </CardContent>
      </Card>

      {/* Atualizar senha */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Alterar senha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Senha atual</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Nova senha</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Confirmar nova senha</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {passError && (
            <div className="flex items-center gap-2 bg-red-50/5 border border-red-300/30 text-red-400 rounded-md px-3 py-2 text-sm">
              <span>⚠️</span>
              <span>{passError}</span>
            </div>
          )}

          {passSuccess && (
            <div className="flex items-center gap-2 bg-green-50/5 border border-green-300/30 text-green-400 rounded-md px-3 py-2 text-sm">
              <span>✓</span>
              <span>Senha alterada com sucesso!</span>
            </div>
          )}

          <Button
            onClick={handleUpdatePassword}
            disabled={passLoading}
            style={{ backgroundColor: GREEN, color: "#0d1a0f" }}
          >
            {passLoading ? "Salvando..." : "Alterar senha"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}