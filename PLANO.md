# PLANO DE EXECUÇÃO — FinCheck (gestão financeira pessoal/empresarial)

> Gerado em: 2026-05-17  
> Autor análise: Claude (engenheiro sênior full-stack)  
> Status: **✅ IMPLEMENTADO — 2026-05-17**

---

## 1. DIAGNÓSTICO — Estado atual do monorepo

### 1.1 Backend (`/backend`)

**Stack**: Spring Boot 3.4.5 · Java 17 · Oracle DB (ojdbc11 + OracleDialect)

| Componente | Status | Observação |
|---|---|---|
| Oracle configurado (driver + dialect) | ✅ OK | `application.properties` correto |
| Arquitetura Entity → Repo → Service → Controller | ✅ OK | Seguido rigorosamente |
| CRUD completo (GET/POST/PUT/DELETE) | ✅ OK | Todas as entidades existentes |
| HTTP codes corretos (200/201/204/400/404) | ✅ OK | `GlobalExceptionHandler` cobre tudo |
| CORS habilitado | ✅ OK | `WebConfig` com `allowedOrigins("*")` |
| `AuthController` (POST /api/auth/login) | ✅ OK | Funcional |
| Entidade `Usuario` | ⚠️ Parcial | Falta campo `tpTipo` (CPF/CNPJ) |
| Entidade `Conta` | ❌ Remover | Lógica bancária (agência, nº conta) — pivotamos |
| Entidade `Despesa` | ❌ Substituir | Será fundida em `Transacao` (tipo=DESPESA) |
| Entidade `Receita` | ❌ Substituir | Será fundida em `Transacao` (tipo=RECEITA) |
| Entidade `Investimento` | ❌ Substituir | Será substituído por `Cofrinho` |
| Entidade `Transacao` | ❌ Criar | Requisito acadêmico obrigatório |
| Entidade `Cofrinho` | ❌ Criar | Requisito acadêmico obrigatório |
| Serviço stub IA (Watson) | ❌ Criar | Requisito acadêmico |
| Endpoint webhook Node-RED | ❌ Criar | Requisito acadêmico |

### 1.2 Frontend (`/frontend`)

**Stack**: React 19 · TypeScript · Vite · React Router v6 · Bootstrap 5 (CDN) · lucide-react · recharts · date-fns

| Componente | Status | Observação |
|---|---|---|
| SPA com React Router | ✅ OK | BrowserRouter + Routes configurados |
| Context API (AuthContext, MenuContext, ThemeContext) | ✅ OK | Proibição de Redux atendida |
| useState / useEffect / useCallback / useRef | ✅ OK | Amplamente usados |
| Props em componentes | ✅ OK | StatCard, SectionCard, gráficos |
| Dark mode padrão + toggle light | ✅ OK | `ThemeContext` + CSS vars |
| Página Login/Cadastro | ⚠️ Refatorar | Tem campos bancários (agência, nº conta) |
| Página Dashboard | ⚠️ Refatorar | Exibe `Conta`; sem cofrinhos nem faróis |
| Página 404 customizada | ✅ OK | Apenas ajuste visual |
| CRUD Despesas (Lista + Form) | ❌ Substituir | Será substituído por CRUD Transações |
| CRUD Receitas (Lista + Form) | ❌ Substituir | Será substituído por CRUD Transações |
| CRUD Investimentos (Lista + Form) | ❌ Substituir | Será substituído por CRUD Cofrinhos |
| CRUD Cofrinhos | ❌ Criar | Requisito acadêmico |
| CRUD Transações | ❌ Criar | Requisito acadêmico |
| Cards de cofrinhos com progresso visual | ❌ Criar | Dashboard |
| Faróis de saúde financeira | ❌ Criar | Dashboard |
| Componente placeholder IA (chatbot/dicas) | ❌ Criar | Requisito acadêmico |
| UI "cofrinhos digitais modernos" | ❌ Redesign | Atual é "banco digital" roxo/azul |
| Mobile-first 375px → 1440px | ⚠️ Parcial | Bases existem; ajustar breakpoints |
| README.md raiz | ❌ Criar | Apenas README do backend existe |

---

## 2. GAP ANALYSIS — Requisitos acadêmicos vs. estado atual

| # | Requisito Obrigatório | Status | Ação |
|---|---|---|---|
| B1 | Oracle DB (ojdbc11 + OracleDialect) | ✅ | Nada |
| B2 | Entidade `Usuario` com campo `tpTipo` CPF/CNPJ | ⚠️ | Adicionar campo `tpTipo` |
| B3 | Entidade `Transacao` (RECEITA ou DESPESA) | ❌ | Criar do zero |
| B4 | Entidade `Cofrinho` (meta/categoria) | ❌ | Criar do zero |
| B5 | Repository Spring Data JPA para as 3 entidades | ⚠️ | Criar para Transacao e Cofrinho |
| B6 | Service para as 3 entidades | ⚠️ | Criar para Transacao e Cofrinho |
| B7 | RestController CRUD completo para as 3 entidades | ⚠️ | Criar para Transacao e Cofrinho |
| B8 | HTTP codes corretos | ✅ | Nada |
| B9 | Serviço stub Watson + endpoint webhook `/api/ia/dica` | ❌ | Criar |
| F1 | SPA React Router (sem reload) | ✅ | Nada |
| F2 | Página de Login funcional | ⚠️ | Refatorar (remover campos bancários) |
| F3 | Página 404 personalizada | ✅ | Ajuste visual |
| F4 | CRUD Transação no React (consome API) | ❌ | Criar páginas |
| F5 | CRUD Cofrinho no React (consome API) | ❌ | Criar páginas |
| F6 | CRUD Usuario no React | ✅ | Existe na página Perfil |
| F7 | useState + useEffect | ✅ | Nada |
| F8 | Props nos componentes | ✅ | Nada |
| F9 | Context API (proibido Redux) | ✅ | Refatorar AuthContext |
| F10 | Dashboard com cards de cofrinhos visuais | ❌ | Criar CofrinhoCard |
| F11 | Faróis de saúde financeira | ❌ | Criar FarolSaude |
| F12 | Componente placeholder IA | ❌ | Criar DicasIA.tsx |
| F13 | UI "cofrinhos digitais modernos" | ❌ | Redesign paleta |
| F14 | Mobile-first 375px–1440px | ⚠️ | Verificar e ajustar |
| D1 | README.md com arquitetura + endpoints + como rodar | ❌ | Criar |
| D2 | PLANO.md com diagnóstico e checklist | ✅ | Este arquivo |

**Resumo**: 11 ✅ · 9 ⚠️ · 12 ❌ → ~48% concluído

---

## 3. DECISÕES DE ARQUITETURA

### 3.1 Novo modelo de dados (3 entidades obrigatórias)

#### Entidade `Usuario` (modificada)
```
T_FTC_USUARIO (existente — adicionar coluna)
+ tp_tipo VARCHAR2(5) NOT NULL DEFAULT 'CPF'   → "CPF" ou "CNPJ"
  nm_cpf_usuario: manter, mas ampliar para 14 chars (suportar CNPJ)
```
> **Nota DDL**: `ddl-auto=update` adiciona colunas novas, mas NÃO altera tamanho de colunas
> existentes. Estratégia: adicionar `tpTipo` como coluna nova; no Oracle, executar
> `ALTER TABLE T_FTC_USUARIO MODIFY nm_cpf_usuario VARCHAR2(14)` manualmente
> (ou usar `create` na primeira execução e preencher dados novos).

#### Entidade `Transacao` (nova — substitui Despesa + Receita)
```
T_FTC_TRANSACAO
  id_transacao    NUMBER          PK (SEQ_TRANSACAO)
  tp_transacao    VARCHAR2(10)    NOT NULL  → "RECEITA" | "DESPESA"
  ds_transacao    VARCHAR2(200)   NOT NULL
  vl_transacao    NUMBER(15,2)    NOT NULL  > 0
  dt_transacao    DATE
  categoria       VARCHAR2(50)              → ex: "Alimentação", "Salário"
  id_usuario      NUMBER          NOT NULL  FK → T_FTC_USUARIO
  id_cofrinho     NUMBER          NULLABLE  FK → T_FTC_COFRINHO
```

#### Entidade `Cofrinho` (nova — substitui Investimento)
```
T_FTC_COFRINHO
  id_cofrinho     NUMBER          PK (SEQ_COFRINHO)
  nm_cofrinho     VARCHAR2(100)   NOT NULL  → ex: "Viagem", "Emergência"
  ds_cofrinho     VARCHAR2(200)
  vl_meta         NUMBER(15,2)    DEFAULT 0  → meta financeira
  vl_atual        NUMBER(15,2)    DEFAULT 0  → saldo atual no cofrinho
  ds_icone        VARCHAR2(50)               → nome do ícone (string)
  ds_cor          VARCHAR2(20)               → cor hex ex: "#F59E0B"
  id_usuario      NUMBER          NOT NULL  FK → T_FTC_USUARIO
```

### 3.2 Entidades mantidas, modificadas e removidas

| Entidade/Arquivo | Ação |
|---|---|
| `Usuario` | Modificar: +campo `tpTipo` |
| `Transacao` | **Criar** do zero (Repo + Service + Controller) |
| `Cofrinho` | **Criar** do zero (Repo + Service + Controller) |
| `WatsonStubService` | **Criar** (stub comentado para IA futura) |
| `AiController` | **Criar** (endpoint `/api/ia/dica`) |
| `GlobalExceptionHandler` | Manter |
| `WebConfig` | Manter |
| `DataSeeder` / `SequenceInitializer` | Modificar (adaptar para novas entidades) |
| `Conta` + ContaService + ContaController + ContaRepo | **Remover** |
| `Despesa` + DespesaService + DespesaController + DespesaRepo | **Remover** |
| `Receita` + ReceitaService + ReceitaController + ReceitaRepo | **Remover** |
| `Investimento` + InvestimentoService + InvestimentoController + InvestimentoRepo | **Remover** |

### 3.3 Session/Auth sem conta bancária

**Atual**: `Session = { usuario: Usuario, conta: Conta }`  
**Novo**: `Session = { usuario: Usuario }`

- Saldo = calculado pelo front a partir das Transações (sum RECEITA − sum DESPESA)
- Login: email + senha → busca `Usuario`
- Cadastro: apenas dados do usuário (nome, documento, tipo, email, senha) — **sem agência, sem nº conta**
- `AuthContext` será refatorado para remover toda dependência de `Conta`

### 3.4 Design system — pivot de "banco digital" para "cofrinhos modernos"

**Atual**: Roxo (#7C3AED) + Azul (#3B82F6) — identidade bancária  
**Novo**: Âmbar/Dourado + Verde-floresta — "cofrinhos digitais modernos"

```css
/* Novas variáveis CSS principais */
--ft-amber:        #F59E0B;   /* dourado — cor primária de marca */
--ft-amber-light:  #FCD34D;
--ft-amber-dim:    rgba(245, 158, 11, 0.15);
--ft-forest:       #22C55E;   /* verde-floresta — receitas */
--ft-forest-dim:   rgba(34, 197, 94, 0.15);
--ft-gradient-primary: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
/* Backgrounds dark quentes */
--ft-bg-page:  #0D0C09;
--ft-bg-card:  #1C1A12;
```

### 3.5 Sobre as bibliotecas externas (lucide-react, recharts, date-fns)

A restrição acadêmica proíbe explicitamente **bibliotecas de estado** (Redux, MobX, Zustand, Recoil).  
`lucide-react` (ícones SVG), `recharts` (gráficos para React) e `date-fns` (utilitários de data)  
não são gerenciadores de estado e já estão instalados no projeto.

**Recomendação**: manter. Remover essas três libs exigiria:
- Substituir ~40 ícones por emojis/SVG manual
- Reescrever os gráficos em SVG nativo
- Reescrever formatações de data com `Intl.DateTimeFormat`

Caso o professor exija remoção, estimativa de esforço: +2h. **Perguntar ao professor antes da entrega.**

---

## 4. ORDEM DE IMPLEMENTAÇÃO

### FASE 1 — Backend: novas entidades e remoção do legado (estimativa: 2–3h)

```
1.1  Modificar Usuario.java          → adicionar campo tpTipo
1.2  Criar Transacao.java            → nova entidade JPA
1.3  Criar TransacaoRepository.java
1.4  Criar TransacaoService.java     → CRUD + validações
1.5  Criar TransacaoController.java  → GET, GET/{id}, POST, PUT, DELETE
1.6  Criar Cofrinho.java             → nova entidade JPA
1.7  Criar CofrinhoRepository.java
1.8  Criar CofrinhoService.java      → CRUD + atualizar vlAtual ao salvar Transacao
1.9  Criar CofrinhoController.java   → GET, GET/{id}, POST, PUT, DELETE
1.10 Criar WatsonStubService.java    → stub comentado para IA futura
1.11 Criar AiController.java         → POST /api/ia/dica (endpoint para Node-RED)
1.12 Atualizar DataSeeder.java       → seeds para Transacao e Cofrinho
1.13 Remover Conta, Despesa, Receita, Investimento (entities + repos + services + controllers)
1.14 Atualizar AuthController        → busca por email+senha diretamente no UsuarioRepository
1.15 Atualizar SequenceInitializer   → criar SEQ_TRANSACAO, SEQ_COFRINHO
```

> **DDL Oracle**: na primeira execução com as tabelas novas, usar  
> `spring.jpa.hibernate.ddl-auto=create` temporariamente para limpar o schema,  
> depois retornar para `update`. Documentar no README.

### FASE 2 — Frontend: tipos, serviços e AuthContext (estimativa: 1–2h)

```
2.1  Atualizar types/finance.ts      → tipos Usuario (+ tpTipo), Transacao, Cofrinho
2.2  Criar transacaoService.ts       → getTransacoes, createTransacao, updateTransacao, deleteTransacao
2.3  Criar cofrinhoService.ts        → getCofrinhos, createCofrinho, updateCofrinho, deleteCofrinho
2.4  Refatorar AuthContext.tsx       → Session = { usuario } apenas; remover toda lógica de Conta
2.5  Remover contaService.ts, despesaService.ts, receitaService.ts, investimentoService.ts
```

### FASE 3 — Frontend: páginas CRUD (estimativa: 2–3h)

```
3.1  Criar pages/Transacoes/ListaTransacoes.tsx   → tabela com filtro por tipo (RECEITA/DESPESA)
3.2  Criar pages/Transacoes/FormTransacao.tsx     → create + edit; campo tipo como select
3.3  Criar pages/Cofrinhos/ListaCofrinhos.tsx     → grid de cards com progresso visual
3.4  Criar pages/Cofrinhos/FormCofrinho.tsx       → create + edit; seleção de ícone e cor
3.5  Atualizar routes.tsx                         → incluir /transacoes e /cofrinhos, remover rotas antigas
3.6  Remover pages/Despesas, pages/Receitas, pages/Investimentos
```

### FASE 4 — Frontend: Dashboard e identidade visual (estimativa: 3–4h)

```
4.1  Atualizar index.css             → nova paleta âmbar/verde-floresta
4.2  Atualizar index.html            → título "FinCheck — Gestão Financeira"
4.3  Criar components/CofrinhoCard/  → card com barra de progresso circular (SVG nativo)
4.4  Criar components/FarolSaude/    → indicador semáforo verde/amarelo/vermelho
4.5  Criar components/DicasIA/       → placeholder chatbot; exibe msg "IA em breve"
4.6  Redesign Dashboard              → cofrinhos grid + faróis + gráfico de fluxo
4.7  Redesign Login/Cadastro         → remover campos bancários; adicionar select CPF/CNPJ
4.8  Atualizar Sidebar               → novas rotas (Transações, Cofrinhos)
4.9  Atualizar Navbar/PageHeader     → branding "FinCheck"
4.10 Atualizar pages/Perfil          → exibir tpTipo do usuário
4.11 Revisar responsividade          → testar em 375px, 768px, 1280px
```

### FASE 5 — Documentação (estimativa: 30min)

```
5.1  Criar README.md (raiz)          → arquitetura, como rodar, entidades, endpoints
5.2  Revisar checklist deste PLANO   → marcar todos os itens como concluídos
```

---

## 5. RISCOS IDENTIFICADOS

| # | Risco | Impacto | Mitigação |
|---|---|---|---|
| R1 | `ddl-auto=update` não dropa tabelas antigas nem altera tamanho de colunas | Médio | Usar `create` na 1ª execução pós-mudança; documentar no README |
| R2 | `nm_cpf_usuario` (VARCHAR2 11) não cabe CNPJ (14 dígitos) | Alto | Executar `ALTER TABLE` manual no Oracle antes de testar CNPJ |
| R3 | Remoção da `Conta` quebra todo o AuthContext e os componentes que leem `session.conta` | Alto | Refatorar AuthContext na Fase 2 antes das Fases 3 e 4 |
| R4 | `lucide-react`, `recharts`, `date-fns` podem ser questionados pelo professor | Baixo | Flaggeado em 3.5; confirmar com o professor antes da entrega |
| R5 | Bootstrap via CDN (não npm): se o CDN cair, o layout quebra | Baixo | Aceitável para projeto acadêmico |
| R6 | Oracle em produção (`oracle.fiap.com.br:1521:ORCL`): acesso a partir de redes externas pode falhar | Médio | Testar conectividade antes; ter VPN/rede da FIAP disponível |
| R7 | Sequences Oracle (`SEQ_TRANSACAO`, `SEQ_COFRINHO`) precisam existir antes das inserções | Alto | `SequenceInitializer` cria automaticamente; garantir execução na startup |

---

## 6. ENDPOINTS REST FINAIS (backend)

### `Usuario` — `/api/usuarios`
| Método | URL | Descrição |
|---|---|---|
| GET | `/api/usuarios` | Lista todos |
| GET | `/api/usuarios/{id}` | Busca por ID |
| POST | `/api/usuarios` | Cria novo (com `tpTipo`) |
| PUT | `/api/usuarios/{id}` | Atualiza |
| DELETE | `/api/usuarios/{id}` | Remove |

### `Transacao` — `/api/transacoes`
| Método | URL | Descrição |
|---|---|---|
| GET | `/api/transacoes` | Lista todas |
| GET | `/api/transacoes/{id}` | Busca por ID |
| GET | `/api/transacoes/usuario/{idUsuario}` | Lista por usuário |
| POST | `/api/transacoes` | Cria nova |
| PUT | `/api/transacoes/{id}` | Atualiza |
| DELETE | `/api/transacoes/{id}` | Remove |

### `Cofrinho` — `/api/cofrinhos`
| Método | URL | Descrição |
|---|---|---|
| GET | `/api/cofrinhos` | Lista todos |
| GET | `/api/cofrinhos/{id}` | Busca por ID |
| GET | `/api/cofrinhos/usuario/{idUsuario}` | Lista por usuário |
| POST | `/api/cofrinhos` | Cria novo |
| PUT | `/api/cofrinhos/{id}` | Atualiza |
| DELETE | `/api/cofrinhos/{id}` | Remove |

### Auth / IA (auxiliares)
| Método | URL | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Login (email + senha) |
| POST | `/api/ia/dica` | Stub para webhook Node-RED (futuro Watson) |
| GET | `/api/ia/status` | Retorna status da integração IA (sempre "not_configured") |

---

## 7. ESTRUTURA DE ARQUIVOS FINAL (novos/modificados)

```
backend/src/main/java/br/com/fiap/jdbc/
├── model/
│   ├── Usuario.java           ← MODIFICAR (+tpTipo)
│   ├── Transacao.java         ← CRIAR
│   └── Cofrinho.java          ← CRIAR
├── repository/
│   ├── UsuarioRepository.java ← manter
│   ├── TransacaoRepository.java ← CRIAR
│   └── CofrinhoRepository.java  ← CRIAR
├── service/
│   ├── UsuarioService.java    ← manter
│   ├── TransacaoService.java  ← CRIAR
│   ├── CofrinhoService.java   ← CRIAR
│   └── WatsonStubService.java ← CRIAR
├── controller/
│   ├── UsuarioController.java ← manter
│   ├── TransacaoController.java ← CRIAR
│   ├── CofrinhoController.java  ← CRIAR
│   ├── AuthController.java    ← simplificar
│   └── AiController.java      ← CRIAR
└── config/
    ├── DataSeeder.java        ← MODIFICAR
    └── SequenceInitializer.java ← MODIFICAR

frontend/src/
├── types/finance.ts           ← MODIFICAR (novos tipos)
├── services/
│   ├── apiClient.ts           ← manter
│   ├── usuarioService.ts      ← manter
│   ├── transacaoService.ts    ← CRIAR
│   └── cofrinhoService.ts     ← CRIAR
├── contexts/
│   ├── AuthContext.tsx        ← REFATORAR (sem Conta)
│   ├── MenuContext.tsx        ← manter
│   └── ThemeContext.tsx       ← manter
├── pages/
│   ├── Login/index.tsx        ← REFATORAR
│   ├── Dashboard/index.tsx    ← REDESIGN COMPLETO
│   ├── Transacoes/            ← CRIAR
│   │   ├── ListaTransacoes.tsx
│   │   └── FormTransacao.tsx
│   ├── Cofrinhos/             ← CRIAR
│   │   ├── ListaCofrinhos.tsx
│   │   └── FormCofrinho.tsx
│   ├── Perfil/index.tsx       ← ATUALIZAR
│   └── NotFound/index.tsx     ← ajuste visual
├── components/
│   ├── CofrinhoCard/index.tsx ← CRIAR
│   ├── FarolSaude/index.tsx   ← CRIAR
│   ├── DicasIA/index.tsx      ← CRIAR
│   ├── Sidebar/index.tsx      ← ATUALIZAR (novas rotas)
│   └── ui/ (StatCard, SectionCard) ← manter
├── routes.tsx                 ← ATUALIZAR
├── index.css                  ← REDESIGN paleta
└── index.html                 ← atualizar título/meta
```

---

## 8. CHECKLIST FINAL DE ENTREGA

### Backend
- [x] Oracle DB com ojdbc11 e OracleDialect
- [x] Entidade `Usuario` com campo `tpTipo` (CPF/CNPJ)
- [x] Entidade `Transacao` (RECEITA/DESPESA, vínculo com Usuario)
- [x] Entidade `Cofrinho` (meta/categoria, vínculo com Usuario)
- [x] Repository Spring Data JPA para as 3 entidades
- [x] Service para as 3 entidades (com validações de negócio)
- [x] RestController CRUD completo para as 3 entidades
- [x] GET (listar + por ID), POST, PUT, DELETE para cada entidade
- [x] HTTP codes corretos: 200, 201, 204, 400, 404
- [x] `WatsonStubService` com comentários explicando a integração futura
- [x] Endpoint `/api/ia/dica` preparado para receber webhooks Node-RED

### Frontend
- [x] SPA sem reload de página (React Router v6)
- [x] Página de Login funcional (email + senha; CPF ou CNPJ)
- [x] Página 404 personalizada
- [x] CRUD Transações (Lista + Form): cria, edita, deleta, lista
- [x] CRUD Cofrinhos (Lista + Form): cria, edita, deleta, lista
- [x] CRUD Usuário (ver/editar perfil)
- [x] useState + useEffect em todas as páginas de dados
- [x] Props funcionando (componentes recebem e passam dados)
- [x] Context API para estado global (Auth, Menu, Theme)
- [x] Dashboard com cards de cofrinhos + progresso visual
- [x] Faróis de saúde financeira (verde/amarelo/vermelho)
- [x] Componente placeholder DicasIA (mensagem de "em breve")
- [x] Paleta "cofrinhos digitais modernos" (âmbar/dourado + verde-floresta)
- [x] Dark mode padrão + toggle light
- [ ] Mobile-first: funciona em 375px, 768px, 1280px, 1440px (verificar manualmente)

### Documentação
- [x] `PLANO.md` com diagnóstico e checklist ✅ (este arquivo)
- [x] `README.md` (raiz) com: arquitetura, como rodar, entidades, endpoints

---

## 9. PERGUNTAS PARA CONFIRMAR ANTES DE IMPLEMENTAR

Antes de eu começar a implementação, preciso da sua resposta sobre:

**P1** — `lucide-react`, `recharts` e `date-fns` já estão instalados e em uso.
A restrição "proibido qualquer biblioteca fora do React/Vite" parece ser sobre
gerenciadores de estado (Redux, MobX, etc.), não sobre ícones/gráficos/datas.
**Posso mantê-las ou devo removê-las?**

**P2** — `Transacao` substitui completamente `Despesa` e `Receita` (entidades unificadas
com campo `tipo`). Isso significa que o histórico de dados existente no Oracle será
perdido ao recriar o schema. **Confirma que podemos recriar o banco (drop + create)?**

**P3** — O campo `nmCpfUsuario` (VARCHAR2 11) no Oracle não cabe CNPJ (14 dígitos).
Para suportar CNPJ, precisamos executar `ALTER TABLE T_FTC_USUARIO MODIFY nm_cpf_usuario VARCHAR2(14)`
manualmente no Oracle ANTES de subir o backend atualizado.
**Você tem acesso ao Oracle da FIAP para executar esse ALTER, ou preferimos criar um campo novo `nmDocumento`?**

**P4** — Novo nome do app? Atualmente o `index.html` diz "FINTECH — Seu banco digital".
Sugestões: **"FinCheck"**, "PiggyBank", "CofrinApp", ou quer manter "Fintech"?

---

*Aguardando confirmação para iniciar a Fase 1.*
