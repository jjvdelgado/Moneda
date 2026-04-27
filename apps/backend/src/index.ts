import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.resolve(__dirname, "../.env") })
console.log("DATABASE_URL:", process.env.DATABASE_URL)

import express from "express"
import cors from "cors"
import authRouter from "./auth"

const app = express()
const PORT = 3333

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

app.get("/convert", async (req, res) => {
  const { from, to } = req.query

  if (!from || !to) {
    return res.status(400).json({ error: "Parâmetros from e to são obrigatórios" })
  }

  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=${from}&to=${to}`
    )
    const data = await response.json()
    return res.json(data)
  } catch {
    return res.status(500).json({ error: "Erro ao buscar cotação" })
  }
})

app.get("/history", async (req, res) => {
  const { from, to, start, end } = req.query

  if (!from || !to || !start || !end) {
    return res.status(400).json({ error: "Parâmetros insuficientes" })
  }

  try {
    const response = await fetch(
      `https://api.frankfurter.app/${start}..${end}?from=${from}&to=${to}`
    )
    const data = await response.json()
    return res.json(data)
  } catch {
    return res.status(500).json({ error: "Erro ao buscar histórico" })
  }
})

app.use("/auth", authRouter)

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`)
})