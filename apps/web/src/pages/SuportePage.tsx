import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Mail } from "lucide-react"

const faqs = [
  {
    question: "De onde vêm as cotações?",
    answer: "As cotações são fornecidas pela Frankfurter API, que utiliza dados do Banco Central Europeu atualizados diariamente."
  },
  {
    question: "Com que frequência as taxas são atualizadas?",
    answer: "As taxas são atualizadas uma vez por dia, geralmente ao final do pregão europeu."
  },
  {
    question: "Como funcionam os alertas?",
    answer: "Você cadastra uma condição, como o dólar abaixo de R$ 5,20, e o sistema monitora periodicamente e te notifica quando atingir o valor."
  },
  {
    question: "Meus dados são salvos?",
    answer: "O histórico de conversões e alertas cadastrados são salvos de forma segura no banco de dados vinculado à sua conta."
  },
  {
    question: "O app funciona offline?",
    answer: "As conversões em tempo real precisam de conexão com a internet. O histórico de conversões salvas pode ser consultado offline."
  },
]

export default function SuportePage() {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Suporte</h1>
        <p className="text-muted-foreground text-sm mt-1">Dúvidas frequentes e formas de contato</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perguntas frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm font-medium">{faq.question}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              {index < faqs.length - 1 && <hr className="border-border mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <button
            onClick={() => window.open("https://github.com", "_blank")}
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-white transition-colors w-full"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir uma issue no GitHub</span>
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