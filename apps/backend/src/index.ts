import express from "express"
import cors from "cors"

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
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar cotação" })
  }
})

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`)
})