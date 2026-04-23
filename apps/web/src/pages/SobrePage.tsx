import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Mail, ExternalLink } from "lucide-react"

const techs = ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "shadcn/ui"]

export default function SobrePage() {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
          <Coins className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Moneda</h1>
          <p className="text-muted-foreground text-sm">Versão 1.0.0</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sobre o projeto</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed">
          Moneda é um conversor de moedas que vai além da conversão simples. Acompanhe o histórico
          do câmbio, simule compras passadas, configure alertas personalizados e saiba o melhor
          momento para comprar moeda estrangeira.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tecnologias utilizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {techs.map((tech) => (
              <span
                key={tech}
                className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Desenvolvedor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
        <button
            onClick={() => window.open("https://github.com", "_blank")}
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-white transition-colors w-full"
        >
            <ExternalLink className="w-4 h-4" />
            <span>GitHub</span>
        </button>
        <button
            onClick={() => window.location.href = "mailto:contato@email.com"}
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-white transition-colors w-full"
        >
            <Mail className="w-4 h-4" />
            <span>contato@email.com</span>
        </button>
        </CardContent>
      </Card>
    </div>
  )
}