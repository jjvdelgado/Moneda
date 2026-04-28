import { Router, Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "./generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const router = Router()
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })
const JWT_SECRET = process.env.JWT_SECRET || "moneda-secret-key-2024"

// Cadastro
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." })
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ error: "Email já cadastrado." })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" })

    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch (err) {
      console.error("Erro no register:", err)
      return res.status(500).json({ error: "Erro ao criar conta." })
    }
})

// Login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: "Email ou senha incorretos." })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: "Email ou senha incorretos." })
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" })

    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch {
    return res.status(500).json({ error: "Erro ao fazer login." })
  }
})

// Atualizar perfil
router.put("/profile", async (req: Request, res: Response) => {
  const { userId, name, currentPassword, newPassword } = req.body

  if (!userId) {
    return res.status(400).json({ error: "Usuário não identificado." })
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." })
    }

    const updateData: any = {}

    if (name) updateData.name = name

    if (currentPassword && newPassword) {
      const valid = await bcrypt.compare(currentPassword, user.password)
      if (!valid) {
        return res.status(401).json({ error: "Senha atual incorreta." })
      }
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    return res.json({ user: { id: updated.id, name: updated.name, email: updated.email } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Erro ao atualizar perfil." })
  }
})

export default router