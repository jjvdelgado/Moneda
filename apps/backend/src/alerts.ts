import { Router, Request, Response } from "express"
import { PrismaClient } from "./generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const router = Router()

// Criar alerta
router.post("/", async (req: Request, res: Response) => {
  const { userId, fromCurrency, toCurrency, condition, targetRate, notifyEmail } = req.body

  if (!userId || !fromCurrency || !toCurrency || !condition || !targetRate) {
    return res.status(400).json({ error: "Dados incompletos." })
  }

  try {
    const alert = await prisma.alert.create({
    data: { userId, fromCurrency, toCurrency, condition, targetRate, notifyEmail }
    })
    return res.status(201).json(alert)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Erro ao criar alerta." })
  }
})

// Buscar alertas do usuário
router.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId as string

  try {
    const alerts = await prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
    return res.json(alerts)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Erro ao buscar alertas." })
  }
})

// Deletar alerta
router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string

  try {
    await prisma.alert.delete({ where: { id } })
    return res.json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Erro ao deletar alerta." })
  }
})

export default router