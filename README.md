# 🪙 Moneda

Moneda é um conversor de moedas que vai além da conversão simples. Desenvolvido com foco em experiência do usuário e arquitetura limpa, o app oferece cotações em tempo real, visualização do histórico de câmbio com gráficos interativos, alertas personalizados e um simulador que permite descobrir quanto valeria hoje uma conversão feita em qualquer data passada.

O projeto foi construído como monorepo, separando frontend web, backend e pacotes compartilhados.

---

## 📸 Preview

<!-- Adicione um print ou GIF do app aqui -->

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