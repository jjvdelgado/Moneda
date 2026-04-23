# 🪙 Moneda

Conversor de moedas inteligente com cotações em tempo real, histórico de câmbio, alertas personalizados e simulador de compras passadas.

---

## 📸 Preview

<!-- Adicione um print ou GIF do app aqui -->

---

## ✅ Funcionalidades

-  Conversão de moedas em tempo real
-  Histórico de câmbio com gráfico interativo
-  Seletor de período (7, 15, 30, 90, 365 dias ou personalizado)
-  Cards de mínimo, máximo e variação percentual no período
-  Alertas personalizados de câmbio
-  Simulador de compras históricas
-  Autenticação de usuários
-  Histórico pessoal de conversões

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Web | React + Vite + TypeScript |
| Estilização | Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express + TypeScript |
| API de câmbio | Frankfurter API |
| Monorepo | npm Workspaces |

---

## 📁 Estrutura do projeto

```
Moneda/
├── apps/
│   ├── web/          # Frontend React
│   └── backend/      # API Node.js
├── packages/
│   └── shared/       # Utilitários compartilhados
└── README.md
```

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm 9+
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/moneda.git
cd moneda
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Rode o backend

```bash
cd apps/backend
npx ts-node src/index.ts
```

O backend estará disponível em `http://localhost:3333`

### 4. Rode o frontend

Em outro terminal:

```bash
cd apps/web
npm run dev
```

O app estará disponível em `http://localhost:5173`

---

## 📦 Changelog

### v0.2 — Histórico de câmbio
- Gráfico de linha com variação do câmbio ao longo do tempo
- Seletor de período pré-definido e personalizado com calendário
- Cards de mínimo, máximo e variação percentual

### v0.1 — Estrutura base + Conversor
- Setup do monorepo com npm workspaces
- Conversor de moedas em tempo real
- Sidebar de navegação com tema dark
- Páginas de Suporte e Sobre

---