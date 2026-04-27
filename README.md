# Moneda

Moneda é um conversor de moedas que vai além da conversão simples. Desenvolvido com foco em experiência do usuário e arquitetura limpa, o app oferece cotações em tempo real, visualização do histórico de câmbio com gráficos interativos, alertas personalizados e um simulador que permite descobrir quanto valeria hoje uma conversão feita em qualquer data passada.

O projeto foi construído como monorepo, separando frontend web, backend e pacotes compartilhados.

---

## Preview

<!-- Adicione um print ou GIF do app aqui -->

---

## Stack

| Camada | Tecnologia |
|---|---|
| Web | React + Vite + TypeScript |
| Estilização | Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express + TypeScript |
| API de câmbio | Frankfurter API |
| Monorepo | npm Workspaces |

---

## Estrutura do projeto

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

## Como rodar localmente

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

## Changelog

### v1.4 — Autenticação
- Login e cadastro com email e senha
- JWT armazenado no localStorage
- Rotas protegidas com redirecionamento automático
- Integração com PostgreSQL via Prisma
- Logout com modal de confirmação

### v1.3 — Simulador histórico
- Simulação de compras passadas com resultado em tempo real
- Comparação entre valor na época e valor atual
- Ganho ou perda estimada com variação percentual

### v1.2 — Histórico de câmbio
- Gráfico de linha com variação do câmbio ao longo do tempo
- Seletor de período: 7, 15, 30, 90, 365 dias ou personalizado
- Cards de mínimo, máximo e variação percentual

### v1.1 — Navegação e páginas base
- Sidebar de navegação com tema dark
- Páginas de Suporte e Sobre
- Rotas para Alertas e Simulador

### v1.0 — Estrutura base e Conversor
- Setup do monorepo com npm workspaces
- Conversor de moedas em tempo real
- Integração com Frankfurter API via backend

---