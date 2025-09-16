<div align="center">
<img alt="Logo" title="React DashGrid" src="./icongen.png"  widht="200" height="200" />

# Gerenciador de Territórios (GENTerritórios)

**Um sistema completo para gerenciamento de territórios, composto por uma API RESTful e uma interface web moderna.**

<p>
<img src="https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js" alt="Node.js">
<img src="https://img.shields.io/badge/Express.js-5.x-black?style=for-the-badge&logo=express" alt="Express.js">
<img src="https://img.shields.io/badge/PostgreSQL-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
<img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React">
<img src="https://img.shields.io/badge/Vite-5.x-purple?style=for-the-badge&logo=vite" alt="Vite">
<img src="https://img.shields.io/badge/Material%20UI-5.x-blue?style=for-the-badge&logo=mui" alt="Material UI">
<img src="https://img.shields.io/badge/AWS%20S3-orange?style=for-the-badge&logo=amazon-s3" alt="AWS S3">
<img src="https://img.shields.io/badge/Deploy%20API-Render-46E3B7?style=for-the-badge&logo=render" alt="Deploy API na Render">
<img src="https://img.shields.io/badge/Deploy%20UI-Vercel-black?style=for-the-badge&logo=vercel" alt="Deploy UI na Vercel">
</p>

</div>

---

## 📋 Índice

* [Arquitetura Geral](#arquitetura-geral)
* [Back-end (API)](#back-end-api)
* [Front-end (Interface)](#front-end-interface)
* [Configuração e Execução Local](#configuração-e-execução-local)
* [Deploy](#deploy)
* [Roadmap Futuro](#roadmap-futuro)
* [Demonstração Online](#demonstração-online)
* [Como Contribuir](#como-contribuir)
* [Licença](#licença)
* [Contato](#contato)

---

## 🏛️ Arquitetura Geral

O sistema é dividido em duas partes principais: o **Back-end (API)**, que implementa a lógica de negócio e comunica-se com o banco de dados e storage; e o **Front-end (Interface)**, a aplicação React que o usuário utiliza.

### Diagrama (Mermaid)

```mermaid
graph LR
    %% Define os estilos
    classDef frontend fill:#61DAFB,stroke:#333,stroke-width:2px,color:#000
    classDef api fill:#8CC84B,stroke:#333,stroke-width:2px,color:#000
    classDef database fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    classDef storage fill:#FF9900,stroke:#333,stroke-width:2px,color:#000

    %% Define os nós do diagrama
    A[👨‍💻<br/>Front-end<br/>React]
    B{🚀<br/>API<br/>Node.js/Express}
    C[(🐘<br/>Banco de Dados<br/>PostgreSQL)]
    D([📦<br/>Storage<br/>AWS S3)]

    %% Conecta os nós
    A -- Requisições HTTP --> B
    B -- Consultas SQL --> C
    B -- Upload/Download --> D

    %% Aplica os estilos
    class A frontend
    class B api
    class C database
    class D storage
```

---

## 🚀 Back-end (API)

API RESTful construída com **Node.js** (18+) e **Express 5.x**. Projetada para ser modular, testável e segura.

### ✨ Principais funcionalidades

* CRUD completo de territórios com upload de mapas para S3.
* Gestão de usuários/publicadores (CRUD).
* Sistema transacional de designação (check-out / check-in) para evitar conflitos.
* Agrupamento por *grupos* e *campanhas*.
* Endpoints analíticos para dashboards (métricas principais).
* Exportação de relatórios em CSV.
* Logs de auditoria para histórico de movimentações.

### 🛠️ Tecnologias e bibliotecas

| Categoria           | Tecnologia / Observações                                             |
| ------------------- | -------------------------------------------------------------------- |
| Runtime / Framework | Node.js (18+) / Express 5.x                                          |
| Banco de Dados      | PostgreSQL (com `pg` ou ORM como Prisma/TypeORM opcional)            |
| Storage             | AWS S3 (via `@aws-sdk/client-s3`)                                    |
| Uploads             | `multer` + `multer-s3` ou integração direta com SDK                  |
| Autenticação        | JWT (ex.: `jsonwebtoken`) — *recomendado* implementar refresh tokens |
| Validação           | `zod` / `joi` / `yup`                                                |
| Documentação        | Swagger / OpenAPI (rodar em `/docs`)                                 |
| Testes              | Jest + Supertest (endpoints)                                         |
| Container           | Docker + Docker Compose (Postgres local)                             |

### Estrutura de pastas (sugestão)

```
backend/
├─ src/
│  ├─ controllers/
│  ├─ services/
│  ├─ repositories/
│  ├─ models/
│  ├─ routes/
│  ├─ middlewares/
│  └─ utils/
├─ prisma/ (opcional)
├─ scripts/
└─ Dockerfile
```

### Exemplo de endpoints

```
POST /auth/login
POST /auth/refresh
GET  /territories
GET  /territories/:id
POST /territories
PUT  /territories/:id
DELETE /territories/:id
POST /territories/:id/checkout
POST /territories/:id/checkin
GET  /reports/export.csv
GET  /dashboard/metrics
```

---

## 💻 Front-end (Interface)

Aplicação React (v19) com Vite e Material-UI para uma interface responsiva e acessível.

### ✨ Funcionalidades

* Dashboard com métricas e filtros.
* CRUD de territórios com visualização de mapa/anotações.
* Designação de publicadores (check-out/check-in) com controle transacional no back-end.
* CRUD de publicadores, grupos e campanhas.
* Histórico e logs.
* Exportação de relatórios e CSV.

### 🛠️ Tecnologias

| Categoria  | Tecnologia                                          |
| ---------- | --------------------------------------------------- |
| Framework  | React (v19)                                         |
| Build      | Vite (5.x)                                          |
| UI         | MUI (Material UI)                                   |
| Roteamento | react-router-dom                                    |
| HTTP       | axios                                               |
| Estado     | React Context + hooks (ou Redux / Zustand opcional) |
| Forms      | react-hook-form (+ zod resolver)                    |

### Estrutura de pastas (sugestão)

```
frontend/
├─ src/
│  ├─ pages/
│  ├─ components/
│  ├─ contexts/
│  ├─ services/ (api calls)
│  ├─ hooks/
│  └─ styles/
├─ public/
└─ vite.config.ts
```

---

## 🏁 Configuração e Execução Local

> Execute os serviços do backend e frontend em terminais separados.

### 1) Back-end (API)

```bash
# Clone o repositório da API
git clone [LINK-DO-REPOSITORIO-BACKEND]
cd [NOME-DA-PASTA-BACKEND]

# Instale as dependências (npm / pnpm / yarn)
npm install
# ou
# pnpm install

# Copie o .env.example para .env e ajuste as variáveis
cp .env.example .env
# Exemplo mínimo de .env:
# DATABASE_URL="postgres://USER:PASS@HOST:PORT/DATABASE"
# AWS_REGION="us-east-1"
# AWS_ACCESS_KEY_ID="SUA_ACCESS_KEY_ID"
# AWS_SECRET_ACCESS_KEY="SUA_SECRET_ACCESS_KEY"
# JWT_SECRET="uma_senha_segura"
# PORT=3001

# Rodar localmente (modo dev com nodemon/metnod)
npm run dev
# ou
pnpm dev

# API estará em: http://localhost:3001
```

> Se preferir usar Docker (recomendado para desenvolvimento mais próximo da produção):

```bash
# Build e sobe serviços via docker-compose
docker compose up --build
```

### 2) Front-end (Interface)

```bash
# Clone o repositório do Front-end
git clone [LINK-DO-REPOSITORIO-FRONTEND]
cd [NOME-DA-PASTA-FRONTEND]

# Instale as dependências
npm install
# ou
# pnpm install

# Crie .env com a URL da API
# VITE_API_URL=http://localhost:3001

# Rodar em modo dev
npm run dev
# ou
pnpm dev

# Front-end estará em: http://localhost:5173 (padrão Vite)
```

---

## 🚀 Deploy

### Back-end (ex.: Render / Heroku / Railway)

* **Comando de build**: `npm install` (ou o default do serviço)
* **Comando de start**: `npm start` (procfile ou start script)
* **Variáveis de ambiente**: `DATABASE_URL`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `JWT_SECRET`, `NODE_ENV=production`.
* Configure o serviço para usar o Dockerfile se preferir imagem customizada.

### Front-end (ex.: Vercel)

* Faça deploy apontando para o repositório do frontend.
* Configure `VITE_API_URL` para a URL da API em produção.
* Em build settings deixe o framework detectado (Vite).

> Observação: sempre proteja chaves e secrets (use secret managers do provedor ou variáveis de ambiente do serviço). Nunca comite `.env` no repositório.

---

## 🗺️ Roadmap Futuro

* [ ] Implementar suíte de testes (Jest / Supertest / React Testing Library).
* [ ] Adicionar autenticação por roles (admin, gestor, publicador) e política de autorização.
* [ ] Documentação da API com Swagger/OpenAPI.
* [ ] Exportação de relatórios em PDF (ex.: Puppeteer / pdfkit).
* [ ] Melhorias na UI: mapas interativos, clusters e filtros avançados.
* [ ] Integração com provedores de mapas (Mapbox / Leaflet + OpenStreetMap).
* [ ] Monitoramento e observabilidade (Sentry, Prometheus, Grafana).

---

## 🖼️ Demonstração Online

> Link de demonstração (substitua pelos seus deploys):

* Front-end: `https://seu-frontend.vercel.app`
* API: `https://sua-api.onrender.com`

---

## 🤝 Como Contribuir

Contribuições são bem-vindas! Siga o fluxo abaixo:

1. Fork do projeto
2. Crie uma branch com a feature: `git checkout -b feature/minha-feature`
3. Faça commits descritivos: `git commit -m "feat: adiciona X"`
4. Push e abra um Pull Request

### Boas práticas para PRs

* Mantenha PRs pequenos e objetivos.
* Adicione descrição com motivo e como testar.
* Inclua testes quando aplicável.

---

## 📜 Licença

Distribuído sob a Licença **ISC**. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📬 Contato

<p align="center">
Feito por Matheus Lemes com ❤️
</p>

<p align="center">
<a href="https://www.linkedin.com/in/matheuslemess/">
<img alt="Conecte-se comigo no LinkedIn" src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white">
</a>
<a href="https://github.com/matheuslemess">
<img alt="Siga-me no GitHub" src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white">
</a>
</p>