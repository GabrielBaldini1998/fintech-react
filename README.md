# Fintech — FIAP | Grupo EQ1S

## Sobre o Projeto

Dashboard financeiro pessoal que permite gerenciar despesas, receitas e investimentos por conta bancária. Desenvolvido como projeto acadêmico na FIAP, o sistema integra uma API REST em Spring Boot com um SPA React, armazenando os dados no banco Oracle da instituição.

---

## Tecnologias

- **Backend:** Java 17, Spring Boot 3.4.5, Spring Data JPA, Oracle DB (ojdbc11)
- **Frontend:** ReactJS 19, TypeScript, React Router DOM v6, Vite 7

---

## Estrutura do Monorepo

```
fintech-react/
├── backend/     → API REST Spring Boot
│   └── src/main/java/br/com/fiap/jdbc/
│       ├── controller/   → 6 controllers (auth + 5 entidades)
│       ├── service/      → 5 services com regras de negócio
│       ├── repository/   → 5 repositories JPA
│       ├── model/        → 5 entidades JPA
│       ├── config/       → CORS, DataSeeder
│       └── exception/    → GlobalExceptionHandler
├── frontend/    → SPA React + TypeScript
│   └── src/
│       ├── pages/        → Login, Dashboard, Despesas, Receitas, Investimentos, Perfil, NotFound
│       ├── components/   → Sidebar, Navbar, Footer, Charts, UI
│       ├── services/     → apiClient, 5 services de entidade
│       ├── contexts/     → AuthContext, MenuContext, ThemeContext
│       └── types/        → interfaces TypeScript
└── README.md
```

---

## Como Executar

### Pré-requisitos

- Java 17+
- Maven 3.8+
- Node.js 18+
- Acesso à rede da FIAP (ou VPN)

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

API disponível em: `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponível em: `http://localhost:5173`

---

## Usuário de Teste

| Campo | Valor              |
|-------|--------------------|
| Email | admin@fintech.com  |
| Senha | 123456             |

> O usuário é criado automaticamente na primeira inicialização do backend (via `DataSeeder`), com saldo inicial de R$ 5.000,00 na conta `00001-0`.

---

## Endpoints da API

### Autenticação

| Método | URL                  | Descrição                        |
|--------|----------------------|----------------------------------|
| POST   | /api/auth/login      | Login com email e senha          |

### Usuários

| Método | URL                  | Descrição                        |
|--------|----------------------|----------------------------------|
| GET    | /api/usuarios        | Listar todos os usuários         |
| GET    | /api/usuarios/{id}   | Buscar usuário por ID            |
| POST   | /api/usuarios        | Criar novo usuário               |
| PUT    | /api/usuarios/{id}   | Atualizar usuário                |
| DELETE | /api/usuarios/{id}   | Excluir usuário                  |

### Contas

| Método | URL                          | Descrição                        |
|--------|------------------------------|----------------------------------|
| GET    | /api/contas                  | Listar todas as contas           |
| GET    | /api/contas/{numeroDaConta}  | Buscar conta por número          |
| POST   | /api/contas                  | Criar nova conta                 |
| PUT    | /api/contas/{numeroDaConta}  | Atualizar conta                  |
| DELETE | /api/contas/{numeroDaConta}  | Excluir conta                    |

### Despesas

| Método | URL                  | Descrição                        |
|--------|----------------------|----------------------------------|
| GET    | /api/despesas        | Listar todas as despesas         |
| GET    | /api/despesas/{id}   | Buscar despesa por ID            |
| POST   | /api/despesas        | Criar nova despesa               |
| PUT    | /api/despesas/{id}   | Atualizar despesa                |
| DELETE | /api/despesas/{id}   | Excluir despesa                  |

### Receitas

| Método | URL                  | Descrição                        |
|--------|----------------------|----------------------------------|
| GET    | /api/receitas        | Listar todas as receitas         |
| GET    | /api/receitas/{id}   | Buscar receita por ID            |
| POST   | /api/receitas        | Criar nova receita               |
| PUT    | /api/receitas/{id}   | Atualizar receita                |
| DELETE | /api/receitas/{id}   | Excluir receita                  |

### Investimentos

| Método | URL                      | Descrição                        |
|--------|--------------------------|----------------------------------|
| GET    | /api/investimentos       | Listar todos os investimentos    |
| GET    | /api/investimentos/{id}  | Buscar investimento por ID       |
| POST   | /api/investimentos       | Criar novo investimento          |
| PUT    | /api/investimentos/{id}  | Atualizar investimento           |
| DELETE | /api/investimentos/{id}  | Excluir investimento             |

---

## Entidades

### Usuario
Campos: `idUsuario`, `nmCompleto`, `dtNascimento`, `nmCpfUsuario` (único), `dsEmail`, `dsSenha`
Tabela Oracle: `T_FTC_USUARIO` | Sequence: `SEQ_USUARIO`

### Conta
Campos: `numeroDaConta` (PK String), `titular`, `agencia`, `tipo`, `saldo`, `idUsuario` (FK)
Tabela Oracle: `T_FTC_CONTA`

### Despesa
Campos: `idDespesa`, `tpDespesa`, `vlDespesa`, `dtDespesa`, `numeroDaConta` (FK)
Tabela Oracle: `T_FTC_DESPESA` | Sequence: `SEQ_DESPESA`

### Receita
Campos: `idReceita`, `dtReceita`, `vlRecebido`, `dsReceita`, `numeroDaConta` (FK)
Tabela Oracle: `T_FTC_RECEITA` | Sequence: `SEQ_RECEITA`

### Investimento
Campos: `idInvestimento`, `nmAplicacao`, `nmBancoCorretora`, `vlAplicacao`, `dtAplicacao`, `dtVencimentoAplicacao`, `numeroDaConta` (FK)
Tabela Oracle: `T_FTC_INVESTIMENTO` | Sequence: `SEQ_INVESTIMENTO`
