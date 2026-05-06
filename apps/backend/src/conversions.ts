import { Router, Request, Response } from "express"
import { PrismaClient } from "./generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const router = Router()

// Salvar conversão
router.post("/", async (req: Request, res: Response) => {
  const { userId, fromCurrency, toCurrency, amount, result, rate } = req.body

  if (!userId || !fromCurrency || !toCurrency || !amount || !result || !rate) {
    return res.status(400).json({ error: "Dados incompletos." })
  }

  try {
    const count = await prisma.conversion.count({ where: { userId } })

    if (count >= 300) {
      return res.status(429).json({ limitReached: true })
    }

    const conversion = await prisma.conversion.create({
      data: { userId, fromCurrency, toCurrency, amount, result, rate }
    })
    return res.status(201).json(conversion)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Erro ao salvar conversão." })
  }
})

// Buscar histórico do usuário
router.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId as string

  try {
    const conversions = await prisma.conversion.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return res.json(conversions)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Erro ao buscar histórico." })
  }
})

// Deletar conversão
router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string

  try {
    await prisma.conversion.delete({ where: { id } })
    return res.json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Erro ao deletar conversão." })
  }
})

// Deletar TODAS as conversões
router.delete("/all/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId as string

  try {
    await prisma.conversion.deleteMany({ where: { userId } })
    return res.json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Erro ao deletar conversões." })
  }
})

export default router