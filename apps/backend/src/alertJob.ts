import cron from "node-cron"
import { PrismaClient } from "./generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Resend } from "resend"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })
const resend = new Resend(process.env.RESEND_API_KEY)

async function checkAlerts() {
  console.log("Verificando alertas...")

  try {
    const alerts = await prisma.alert.findMany({
      where: { triggered: false },
      include: { user: true },
    })

    for (const alert of alerts) {
      const response = await fetch(
        `https://api.frankfurter.app/latest?from=${alert.fromCurrency}&to=${alert.toCurrency}`
      )
      const data = await response.json()
      const currentRate = data.rates[alert.toCurrency]

      const conditionMet =
        (alert.condition === "below" && currentRate <= alert.targetRate) ||
        (alert.condition === "above" && currentRate >= alert.targetRate)

      if (conditionMet) {
        const emailResult = await resend.emails.send({
          from: "Moneda <onboarding@resend.dev>",
          to: alert.notifyEmail || alert.user.email,
          subject: `🔔 Alerta Moneda: ${alert.fromCurrency}/${alert.toCurrency} atingiu sua meta!`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #ffffff; border-radius: 12px;">
              <h1 style="color: #4ade80; font-size: 24px; margin-bottom: 8px;">🪙 Moneda</h1>
              <p style="color: #888; margin-bottom: 24px;">Seu alerta foi disparado!</p>

              <div style="background: #111; border: 1px solid #222; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #888;">Par de moedas</p>
                <p style="margin: 0; font-size: 20px; font-weight: bold;">${alert.fromCurrency} → ${alert.toCurrency}</p>
              </div>

              <div style="background: #111; border: 1px solid #222; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #888;">Cotação atual</p>
                <p style="margin: 0; font-size: 28px; font-weight: bold; color: #4ade80;">${currentRate.toFixed(4)}</p>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #888;">
                  Sua meta era ${alert.condition === "below" ? "abaixo de" : "acima de"} ${alert.targetRate}
                </p>
              </div>

              <p style="color: #888; font-size: 12px; text-align: center;">
                Este alerta foi disparado automaticamente pelo Moneda.
              </p>
            </div>
          `,
        })

        console.log("Resultado do email:", emailResult)

        await prisma.alert.update({
          where: { id: alert.id },
          data: { triggered: true, triggeredAt: new Date() },
        })

        console.log(`Alerta disparado para ${alert.user.email}: ${alert.fromCurrency}/${alert.toCurrency}`)
      }
    }
  } catch (err) {
    console.error("Erro ao verificar alertas:", err)
  }
}

// Roda a cada 1 hora
export function startAlertJob() {
  //cron.schedule("0 * * * *", checkAlerts)
  // Roda a cada 1 minuto (só pra teste)
  cron.schedule("* * * * *", checkAlerts)
  console.log("Job de alertas iniciado — verificando a cada hora")
}