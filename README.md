# FinCheck — Gestão Financeira Pessoal e Empresarial

Aplicação full-stack para controle financeiro com transações, cofrinhos digitais e indicadores de saúde financeira.  
Projeto acadêmico FIAP — Grupo EQ1S.

---

## Tecnologias

| Camada   | Tecnologia |
|----------|------------|
| Backend  | Java 17 · Spring Boot 3.4.5 · Spring Data JPA · Oracle DB (ojdbc11) |
| Frontend | React 19 · TypeScript · Vite · React Router v6 |
| Estilos  | Bootstrap 5.3 (CDN, dark mode) · CSS Variables |
| Extras   | Recharts · lucide-react · date-fns |

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

| Ferramenta | Versão mínima | Download |
|------------|---------------|----------|
| Java JDK   | 17            | https://adoptium.net |
| Maven      | 3.x           | https://maven.apache.org/download.cgi |
| Node.js    | 18            | https://nodejs.org |

> **Verificar instalações** (execute no terminal):
> ```bash
> java -version
> mvn -version
> node -v
> ```

---

## Estrutura do Projeto

```
fintech-react/
├── backend/    → API REST Spring Boot (porta 8080)
├── frontend/   → SPA React + Vite (porta 5173)
└── README.md
```

---

## 1. Subindo o Backend

Abra um terminal na pasta `backend/` e execute:

```bash
cd backend
mvn spring-boot:run
```

Aguarde a mensagem:
```
Started BancoApplication in X seconds
```

A API estará disponível em: **http://localhost:8080**

> **Nota:** Na **primeira execução**, o Hibernate cria automaticamente as tabelas na instância Oracle da FIAP e o `DataSeeder` insere os dados de teste. Nenhuma configuração manual de banco é necessária.

---

## 2. Subindo o Frontend

Abra **outro terminal** na pasta `frontend/` e execute:

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

---

## Dados de Autenticação (Usuário de Teste)

| Campo | Valor               |
|-------|---------------------|
| Email | admin@fincheck.com  |
| Senha | 123456              |

---

## Entidades e Endpoints REST

O projeto implementa **3 entidades principais**, cada uma com camadas Model → Repository → Service → Controller e CRUD completo.

### Usuario — `/api/usuarios`

| Método | Rota                  | Descrição           | Status |
|--------|-----------------------|---------------------|--------|
| GET    | `/api/usuarios`       | Lista todos         | 200    |
| GET    | `/api/usuarios/{id}`  | Busca por ID        | 200/404|
| POST   | `/api/usuarios`       | Cria usuário        | 201    |
| PUT    | `/api/usuarios/{id}`  | Atualiza usuário    | 200/404|
| DELETE | `/api/usuarios/{id}`  | Remove usuário      | 204/404|

### Transacao — `/api/transacoes`

| Método | Rota                                   | Descrição                  | Status |
|--------|----------------------------------------|----------------------------|--------|
| GET    | `/api/transacoes`                      | Lista todas                | 200    |
| GET    | `/api/transacoes/{id}`                 | Busca por ID               | 200/404|
| GET    | `/api/transacoes/usuario/{idUsuario}`  | Lista por usuário          | 200    |
| POST   | `/api/transacoes`                      | Cria transação             | 201    |
| PUT    | `/api/transacoes/{id}`                 | Atualiza transação         | 200/404|
| DELETE | `/api/transacoes/{id}`                 | Remove transação           | 204/404|

### Cofrinho — `/api/cofrinhos`

| Método | Rota                                  | Descrição             | Status |
|--------|---------------------------------------|-----------------------|--------|
| GET    | `/api/cofrinhos`                      | Lista todos           | 200    |
| GET    | `/api/cofrinhos/{id}`                 | Busca por ID          | 200/404|
| GET    | `/api/cofrinhos/usuario/{idUsuario}`  | Lista por usuário     | 200    |
| POST   | `/api/cofrinhos`                      | Cria cofrinho         | 201    |
| PUT    | `/api/cofrinhos/{id}`                 | Atualiza cofrinho     | 200/404|
| DELETE | `/api/cofrinhos/{id}`                 | Remove cofrinho       | 204/404|

---

## Funcionalidades do Frontend

- **Login** — autenticação com e-mail e senha
- **Dashboard** — saldo consolidado, KPIs mensais, cofrinhos ativos e faróis de saúde financeira
- **Transações** — CRUD completo de receitas e despesas com filtros e categorias
- **Cofrinhos** — CRUD de metas financeiras com progresso visual
- **Usuários** — listagem, cadastro, edição e exclusão de contas
- **Perfil** — edição de dados pessoais, troca de senha e toggle dark/light mode
- **Página 404** — página de erro personalizada

---

## Arquitetura

```
fintech-react/
├── backend/src/main/java/br/com/fiap/jdbc/
│   ├── model/        → Usuario, Transacao, Cofrinho
│   ├── repository/   → Spring Data JPA (CrudRepository)
│   ├── service/      → Regras de negócio
│   ├── controller/   → REST endpoints (@RestController)
│   └── config/       → CORS, DataSeeder, SequenceInitializer
└── frontend/src/
    ├── contexts/     → AuthContext, MenuContext, ThemeContext
    ├── pages/        → Dashboard, Transacoes, Cofrinhos, Usuarios, Perfil, Login, NotFound
    ├── components/   → Sidebar, Navbar, Footer, StatCard, SectionCard, CofrinhoCard, FarolSaude
    └── services/     → transacaoService, cofrinhoService, usuarioService (consumo da API REST)
```

---

## Integrantes do Grupo EQ1S

| Nome | RM |
|------|----|
| Gabriel Baldini | rm567373 |
