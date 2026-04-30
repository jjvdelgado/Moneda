# Moneda

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)

Moneda é um conversor de moedas que vai além da conversão simples. Desenvolvido com foco em experiência do usuário e arquitetura limpa, o app oferece cotações em tempo real, visualização do histórico de câmbio com gráficos interativos e um simulador que permite descobrir quanto valeria hoje uma conversão feita em qualquer data passada.

O projeto foi construído como monorepo, separando frontend web, backend e pacotes compartilhados, refletindo uma arquitetura próxima do que se encontra em projetos profissionais reais.

---

## Preview

![Moneda App](assets/preview.png)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Web | React + Vite + TypeScript |
| Estilização | Tailwind CSS + shadcn/ui |
| Animações | Framer Motion |
| Backend | Node.js + Express + TypeScript |
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Autenticação | JWT + bcryptjs |
| API de câmbio | Frankfurter API |
| Monorepo | npm Workspaces |

---

## Estrutura do projeto

Moneda/
├── apps/
│   ├── web/          # Frontend React
│   └── backend/      # API Node.js
├── packages/
│   └── shared/       # Utilitários compartilhados
└── README.md

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm 9+
- Git
- PostgreSQL

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/moneda.git
cd moneda
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` em `apps/backend/`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/moneda"
JWT_SECRET="sua-chave-secreta"
```

### 4. Execute as migrations do banco

```bash
cd apps/backend
npx prisma migrate dev
```

### 5. Rode o backend

```bash
npx ts-node src/index.ts
```

O backend estará disponível em `http://localhost:3333`

### 6. Rode o frontend

Em outro terminal:

```bash
cd apps/web
npm run dev
```

O app estará disponível em `http://localhost:5173`

## Changelog

### v1.0 — Lançamento inicial

- Conversor de moedas em tempo real com indicador de variação do dia
- Histórico de câmbio com gráfico interativo e seletor de período personalizado
- Simulador de compras históricas com ganho ou perda estimada
- Autenticação completa com login, cadastro e perfil editável
- Sidebar de navegação com tema dark e transições suaves entre páginas
- Arquitetura monorepo com frontend React, backend Node.js e banco PostgreSQL