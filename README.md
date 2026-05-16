# Fintech React

Dashboard financeiro pessoal construído com React 19 e TypeScript, integrado a uma API Spring Boot. Permite gerenciar despesas, receitas e investimentos por conta bancária.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite 7 |
| Roteamento | React Router DOM v6 |
| Estilo | Bootstrap 5 + Bootstrap Icons |
| Backend | Spring Boot (API REST em `http://localhost:8080`) |

---

## Estrutura de pastas

```
src/
├── contexts/          # Estado global (autenticação e menu)
├── components/        # Componentes reutilizáveis de UI
├── pages/             # Telas da aplicação
├── services/          # Clientes HTTP para a API
├── types/             # Interfaces TypeScript
├── utils/             # Funções utilitárias
├── routes.tsx         # Definição de rotas
└── main.tsx           # Ponto de entrada
```

---

## Fluxo geral da aplicação

```
main.tsx
  └── AppRoutes (BrowserRouter)
        └── AuthProvider   ← gerencia sessão em sessionStorage
              ├── /login          → LoginPage (pública)
              └── ProtectedLayout → verifica sessão; redireciona para /login se ausente
                    ├── MenuProvider  ← controla sidebar aberta/fechada
                    ├── Sidebar
                    ├── Overlay
                    ├── /dashboard      → Dashboard
                    ├── /despesas       → Despesas
                    ├── /receitas       → Receitas
                    └── /investimentos  → Investments
```

---

## Autenticação (`AuthContext`)

Mantém uma `session` com os dados do usuário e da conta, persistida em `sessionStorage`.

### Login

```
1. Usuário informa e-mail + senha
2. GET /api/usuarios → lista todos os usuários
3. Encontra o usuário pelo e-mail e valida a senha
4. GET /api/contas → lista todas as contas
5. Encontra a conta vinculada ao idUsuario
6. Salva { usuario, conta } em sessionStorage como "fintech_session"
7. Redireciona para /dashboard
```

### Cadastro

```
1. Usuário preenche dados pessoais + dados da conta
2. POST /api/usuarios → cria o usuário (retorna 201 sem body)
3. GET /api/usuarios → busca o usuário recém-criado pelo e-mail
4. POST /api/contas  → cria a conta vinculada ao idUsuario
5. GET /api/contas   → confirma a criação da conta
6. Salva a sessão e redireciona para /dashboard
```

### Logout

Remove `fintech_session` do `sessionStorage` e redireciona para `/login`.

### Guard de rotas

`ProtectedLayout` lê `session` do contexto. Se `null`, redireciona imediatamente para `/login`.

---

## Camada de serviços

### `apiClient.ts`

Wrapper sobre a Fetch API compartilhado por todos os serviços. Trata erro de rede, respostas não-OK e respostas sem body (201).

```ts
apiRequest<T>(url, options?) → Promise<T>
jsonBody(method, body)       → RequestInit   // helper para POST/PUT JSON
```

### Serviços disponíveis

| Arquivo | Endpoint base | Operações |
|---|---|---|
| `usuarioService.ts` | `/api/usuarios` | GET all, POST |
| `contaService.ts` | `/api/contas` | GET all, POST |
| `despesaService.ts` | `/api/despesas` | GET all, POST |
| `receitaService.ts` | `/api/receitas` | GET all, POST, PUT, DELETE |
| `investimentoService.ts` | `/api/investimentos` | GET all, POST, PUT, DELETE |

---

## Páginas

### `/login` — LoginPage

Tela pública com duas abas: **Entrar** (e-mail + senha) e **Cadastrar nova conta** (dados pessoais + dados bancários). Exibe spinner durante o carregamento e erro inline em caso de falha.

### `/dashboard` — Dashboard

Lê os dados de `session` sem chamadas à API. Exibe boas-vindas, dados da conta (número, agência, tipo, saldo) e dados do titular.

### `/despesas` — Despesas

```
1. Monta → GET /api/despesas → filtra por session.conta.numeroDaConta
2. Exibe tabela: ID, tipo, valor (vermelho), data
3. Formulário "Nova Despesa": tipo + valor + data
4. Submit → POST /api/despesas → recarrega a lista
```

### `/receitas` — Receitas

```
1. Monta → GET /api/receitas → filtra por numeroDaConta
2. Exibe tabela com ações editar / excluir
3. Criar  → POST /api/receitas
4. Editar → PUT /api/receitas/:id
5. Excluir → confirm() → DELETE /api/receitas/:id
```

### `/investimentos` — Investments

Mesma lógica de Receitas. Campos extras: banco/corretora, data de aplicação e data de vencimento. Exibe o total aplicado somado de todos os registros da conta.

---

## Componentes

### `Sidebar`

Menu lateral com links para todas as rotas. Marca o item ativo pelo `pathname` atual. Botão "Sair" chama `logout()` e redireciona para `/login`.

### `Navbar` (PageHeader)

Cabeçalho de cada página. Recebe `title` como prop, exibe o nome do usuário logado e o botão de logout. Renderiza o `HamburgerButton` para toggle da sidebar em mobile.

### `MenuContext` + `HamburgerButton` + `Overlay`

Controlam a sidebar em telas menores. `isMenuOpen` aplica a classe CSS `toggled` no `document.body`, fazendo a sidebar deslizar via CSS.

### `Footer`

Rodapé simples renderizado em todas as rotas protegidas.

---

## Tipos (`types/finance.ts`)

```ts
Usuario      { idUsuario, nmCompleto, dtNascimento, nmCpfUsuario, dsEmail, dsSenha }
Conta        { numeroDaConta, titular, agencia, tipo, saldo, idUsuario }
Despesa      { idDespesa, tpDespesa, vlDespesa, dtDespesa, numeroDaConta }
Receita      { idReceita, dtReceita, vlRecebido, dsReceita, numeroDaConta }
Investimento { idInvestimento, nmAplicacao, nmBancoCorretora, vlAplicacao,
               dtAplicacao, dtVencimentoAplicacao, numeroDaConta }
```

---

## Utilitários (`utils/formatters.ts`)

```ts
formatCurrency(value)  // → "R$ 1.500,00"
formatDate(iso)        // "2024-01-15" → "15/01/2024"
```

---

## Como executar

### Pré-requisitos

- Node.js 18+
- API Spring Boot rodando em `http://localhost:8080`

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`.

### Build de produção

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Endpoints esperados no backend

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/usuarios` | Lista todos os usuários |
| POST | `/api/usuarios` | Cria usuário (retorna 201) |
| GET | `/api/contas` | Lista todas as contas |
| POST | `/api/contas` | Cria conta |
| GET | `/api/despesas` | Lista todas as despesas |
| POST | `/api/despesas` | Cria despesa |
| GET | `/api/receitas` | Lista todas as receitas |
| POST | `/api/receitas` | Cria receita |
| PUT | `/api/receitas/:id` | Atualiza receita |
| DELETE | `/api/receitas/:id` | Remove receita |
| GET | `/api/investimentos` | Lista todos os investimentos |
| POST | `/api/investimentos` | Cria investimento |
| PUT | `/api/investimentos/:id` | Atualiza investimento |
| DELETE | `/api/investimentos/:id` | Remove investimento |

> **Nota:** O frontend filtra despesas, receitas e investimentos no cliente pelo `numeroDaConta` da sessão ativa. O backend retorna todos os registros sem filtro por usuário.

---

## Decisões de arquitetura

- **Sessão em `sessionStorage`**: expira ao fechar o browser, sem necessidade de JWT ou refresh token.
- **Filtro client-side por conta**: como a API não filtra por usuário, cada página busca todos os registros e filtra pelo `numeroDaConta` da sessão.
- **Alias `@/`**: configurado no Vite apontando para `src/`, evitando imports com caminhos relativos longos.
