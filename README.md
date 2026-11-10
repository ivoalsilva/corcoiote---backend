# Corcoiote Backend

API REST para gestão de clientes e faturas, com cadastro e autenticação de usuários.

**Stack:** Node.js 24 · Express 5 · TypeScript · Prisma 7 · PostgreSQL · Zod · JWT

## Como rodar

Pré-requisitos: Node.js 24+ e Docker.

```bash
# 1. Variáveis de ambiente (edite o JWT_SECRET)
cp .env.example .env

# 2. Dependências (também gera o client do Prisma)
npm install

# 3. Banco de dados
docker compose up -d
npm run db:deploy

# 4. Servidor em modo desenvolvimento
npm run dev
```

O servidor sobe em `http://localhost:3000` (ou na porta definida em `PORT`).

### Variáveis de ambiente

| Variável         | Obrigatória | Descrição                                                  |
| ---------------- | ----------- | ---------------------------------------------------------- |
| `DATABASE_URL`   | sim         | URL de conexão do PostgreSQL                               |
| `JWT_SECRET`     | sim         | Segredo usado para assinar os tokens                       |
| `JWT_EXPIRES_IN` | não         | Validade do token (padrão `1d`)                            |
| `PORT`           | não         | Porta do servidor (padrão `3000`)                          |
| `CORS_ORIGIN`    | não         | Origens permitidas, separadas por vírgula (padrão: todas) |

## Scripts

| Comando              | O que faz                                     |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Servidor com recarga automática               |
| `npm start`          | Servidor sem recarga                          |
| `npm test`           | Testes unitários                              |
| `npm run typecheck`  | Checagem de tipos                             |
| `npm run lint`       | Lint e formatação (Biome)                     |
| `npm run db:migrate` | Cria/aplica migrations em desenvolvimento     |
| `npm run db:deploy`  | Aplica as migrations existentes               |

## Autenticação

1. Crie um usuário em `POST /users` (rota pública).
2. Faça login em `POST /auth/login` para receber o token.
3. Envie o token nas demais rotas: `Authorization: Bearer <token>`.

## Endpoints

Rotas marcadas com 🔒 exigem token.

### Autenticação

| Método | Rota          | Descrição                    |
| ------ | ------------- | ---------------------------- |
| POST   | `/auth/login` | Login `{ email, password }`  |
| GET    | `/auth/me` 🔒 | Dados do usuário autenticado |

### Usuários

| Método | Rota            | Descrição                               |
| ------ | --------------- | --------------------------------------- |
| POST   | `/users`        | Cadastro `{ name, email, password }`    |
| GET    | `/users` 🔒     | Lista usuários                          |
| GET    | `/users/:id` 🔒 | Busca usuário                           |
| PUT    | `/users/:id` 🔒 | Atualiza (campos parciais)              |
| DELETE | `/users/:id` 🔒 | Remove                                  |

A senha precisa ter no mínimo 8 caracteres, é armazenada como hash e nunca é retornada.

### Clientes 🔒

| Método | Rota                    | Descrição                             |
| ------ | ----------------------- | ------------------------------------- |
| GET    | `/customers?page=1`     | Lista (10 por página, ordem alfabética) |
| GET    | `/customers/:id`        | Busca cliente                         |
| POST   | `/customers`            | Cria `{ name, email, imageUrl? }`     |
| PUT    | `/customers/:id`        | Atualiza (campos parciais)            |
| DELETE | `/customers/:id`        | Remove (e suas faturas)               |

### Faturas 🔒

| Método | Rota                | Descrição                                          |
| ------ | ------------------- | -------------------------------------------------- |
| GET    | `/invoices?page=1`  | Lista (10 por página, mais recentes primeiro)      |
| GET    | `/invoices/:id`     | Busca fatura                                       |
| POST   | `/invoices`         | Cria `{ amount, status, date, customerId }`        |
| PUT    | `/invoices/:id`     | Atualiza (campos parciais)                         |
| DELETE | `/invoices/:id`     | Remove                                             |

- `amount`: inteiro positivo, em centavos (`1500` = R$ 15,00)
- `status`: `PENDING` ou `PAID`
- `date`: data em formato ISO (`2026-01-10`)

## Erros

Todas as respostas de erro seguem o formato `{ "message": "..." }`.
Erros de validação incluem também `fields: [{ field, message }]`.

| Status | Quando                                         |
| ------ | ---------------------------------------------- |
| 400    | Dados inválidos, JSON malformado ou id inválido |
| 401    | Token ausente, inválido ou expirado; login incorreto |
| 404    | Registro não encontrado                        |
| 409    | E-mail já cadastrado                           |
| 500    | Erro interno                                   |

## Estrutura

```
src/
├── controllers/   # recebem a requisição e respondem
├── services/      # regras de negócio e acesso ao banco
├── routes/        # definição das rotas
├── schemas/       # validação com Zod
├── middlewares/   # autenticação, validação, logs e erros
├── lib/           # prisma, jwt e hash de senha
├── errors/        # classes de erro da aplicação
└── server.ts
tests/             # testes unitários (node:test)
prisma/            # schema e migrations
```
