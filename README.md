# FinCheck — Gestão Financeira Pessoal e Empresarial

Aplicação full-stack para controle financeiro com cofrinhos digitais, transações e indicadores de saúde financeira. Projeto acadêmico FIAP — Grupo EQ1S.

---

## Stack

| Camada   | Tecnologia |
|----------|-----------|
| Backend  | Spring Boot 3.4.5 · Java 17 · Oracle DB (ojdbc11) |
| Frontend | React 19 · TypeScript · Vite · React Router v6 |
| Estilo   | Bootstrap 5.3 (CDN, dark mode) · CSS Variables |
| Extras   | Recharts · lucide-react · date-fns |

---

## Arquitetura

```
fintech-react/
├── backend/          Spring Boot REST API
│   └── src/main/java/br/com/fiap/jdbc/
│       ├── model/        → Usuario, Transacao, Cofrinho
│       ├── repository/   → Spring Data JPA
│       ├── service/      → Regras de negócio + WatsonStubService
│       ├── controller/   → REST endpoints
│       └── config/       → DataSeeder, SequenceInitializer, WebConfig
└── frontend/         SPA React
    └── src/
        ├── contexts/     → AuthContext, MenuContext, ThemeContext
        ├── pages/        → Dashboard, Transacoes, Cofrinhos, Perfil, Login
        ├── components/   → CofrinhoCard, FarolSaude, DicasIA, StatCard, SectionCard
        └── services/     → transacaoService, cofrinhoService, usuarioService
```

---

## Entidades Oracle

### `T_FTC_USUARIO`
| Coluna           | Tipo          | Descrição                    |
|------------------|---------------|------------------------------|
| id_usuario       | NUMBER PK     | Sequence SEQ_USUARIO         |
| nm_completo      | VARCHAR2(100) | Nome completo                |
| dt_nascimento    | DATE          |                              |
| nm_cpf_usuario   | VARCHAR2(14)  | CPF (11) ou CNPJ (14)        |
| tp_tipo          | VARCHAR2(5)   | "CPF" ou "CNPJ"              |
| ds_email         | VARCHAR2(100) | Único                        |
| ds_senha         | VARCHAR2(100) |                              |

### `T_FTC_TRANSACAO`
| Coluna        | Tipo          | Descrição                        |
|---------------|---------------|----------------------------------|
| id_transacao  | NUMBER PK     | Sequence SEQ_TRANSACAO           |
| tp_transacao  | VARCHAR2(10)  | "RECEITA" ou "DESPESA"           |
| ds_transacao  | VARCHAR2(200) | Descrição                        |
| vl_transacao  | NUMBER(15,2)  | Valor > 0                        |
| dt_transacao  | DATE          |                                  |
| categoria     | VARCHAR2(50)  | Ex: "Alimentação", "Salário"     |
| id_usuario    | NUMBER FK     | → T_FTC_USUARIO                  |
| id_cofrinho   | NUMBER FK     | → T_FTC_COFRINHO (nullable)      |

### `T_FTC_COFRINHO`
| Coluna       | Tipo          | Descrição                    |
|--------------|---------------|------------------------------|
| id_cofrinho  | NUMBER PK     | Sequence SEQ_COFRINHO        |
| nm_cofrinho  | VARCHAR2(100) | Ex: "Viagem Europa"          |
| ds_cofrinho  | VARCHAR2(200) | Descrição opcional           |
| vl_meta      | NUMBER(15,2)  | Meta financeira              |
| vl_atual     | NUMBER(15,2)  | Saldo atual no cofrinho      |
| ds_icone     | VARCHAR2(50)  | Nome do ícone (string)       |
| ds_cor       | VARCHAR2(20)  | Cor hex ex: "#F59E0B"        |
| id_usuario   | NUMBER FK     | → T_FTC_USUARIO              |

---

## Endpoints REST

### Autenticação
| Método | URL               | Body                   |
|--------|-------------------|------------------------|
| POST   | `/api/auth/login` | `{ email, senha }`     |

### Usuários — `/api/usuarios`
| Método | URL                  |
|--------|----------------------|
| GET    | `/api/usuarios`      |
| GET    | `/api/usuarios/{id}` |
| POST   | `/api/usuarios`      |
| PUT    | `/api/usuarios/{id}` |
| DELETE | `/api/usuarios/{id}` |

### Transações — `/api/transacoes`
| Método | URL                                    |
|--------|----------------------------------------|
| GET    | `/api/transacoes`                      |
| GET    | `/api/transacoes/{id}`                 |
| GET    | `/api/transacoes/usuario/{idUsuario}`  |
| POST   | `/api/transacoes`                      |
| PUT    | `/api/transacoes/{id}`                 |
| DELETE | `/api/transacoes/{id}`                 |

### Cofrinhos — `/api/cofrinhos`
| Método | URL                                   |
|--------|---------------------------------------|
| GET    | `/api/cofrinhos`                      |
| GET    | `/api/cofrinhos/{id}`                 |
| GET    | `/api/cofrinhos/usuario/{idUsuario}`  |
| POST   | `/api/cofrinhos`                      |
| PUT    | `/api/cofrinhos/{id}`                 |
| DELETE | `/api/cofrinhos/{id}`                 |

### IA (Stub Watson) — `/api/ia`
| Método | URL              | Descrição                      |
|--------|------------------|--------------------------------|
| POST   | `/api/ia/dica`   | Retorna dica financeira (stub) |
| GET    | `/api/ia/status` | Status da integração Watson    |

---

## Como rodar

### Pré-requisitos
- Java 17+
- Node.js 18+
- Acesso ao Oracle (oracle.fiap.com.br:1521:ORCL)

### Primeira execução (banco zerado)

1. Abra o SQL Developer (`~/Downloads/opt/sqldeveloper/sqldeveloper.sh`)
2. Conecte em `rm567373` / senha configurada
3. Execute `backend/DDL_ANTES_DO_PRIMEIRO_START.sql`
4. Confirme `spring.jpa.hibernate.ddl-auto=create` no `application.properties`
5. Suba o backend — Hibernate cria as tabelas automaticamente
6. Após subida bem-sucedida, mude para `ddl-auto=update` e reinicie

### Backend
```bash
cd backend
./mvnw spring-boot:run
# API em http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App em http://localhost:5173
```

### Login de teste (seed automático)
| Campo | Valor              |
|-------|--------------------|
| Email | admin@fincheck.com |
| Senha | 123456             |

---

## Funcionalidades

- Login e cadastro (CPF ou CNPJ)
- Dashboard: saldo, KPIs mensais, grid de cofrinhos e faróis de saúde financeira
- CRUD Transações (receitas e despesas) com filtro por tipo e categoria
- CRUD Cofrinhos com progresso visual (anel SVG) e meta financeira
- Perfil: avatar (localStorage), dados pessoais, troca de senha, toggle dark/light
- Dark mode padrão + toggle para light mode
- Componente DicasIA — placeholder para integração futura com IBM Watson
- Endpoint `/api/ia/dica` preparado para webhook Node-RED
