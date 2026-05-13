# Estrutura de Testes - Guia Rápido

Este documento explica a organização clara dos testes Playwright para o Cidadão Smart.

## Tipos de Testes

### 1. Testes Automáticos (Regressão) ✅

**Sem intervalo humano. Rodam sozinhos.**

Pastas:
- `tests/agendamento-presencial/` - Validações do fluxo de agendamento presencial
- `tests/emissao-online/` - Validações de emissão online
- `tests/consulta/` - Validações de consulta de pedidos e agendamentos
- `tests/2via/` - Validações de segunda via
- `tests/api/` - Testes de integração com APIs

Características:
- Independentes entre si
- Sem CAPTCHA manual
- Sem dependência de email
- Sem intervalo humano
- Cada teste = uma funcionalidade

Exemplos:
- `[AGP-LOCAL-001]` Validar tela de localização
- `[AGP-DH-001]` Validar seleção de data disponível
- `[EMI-CAPT-001]` Validar captura de documento

### 2. Testes E2E (Fluxos Completos) 🔗

**Fluxos ponta a ponta, sem intervalo humano.**

Pasta: `tests/e2e/`

Características:
- Testam fluxo inteiro da aplicação
- Independentes (cada um começa e termina sozinho)
- Podem ser maiores e mais complexos
- Reutilizam Page Objects e dados

Exemplos:
- `[AGP-E2E-001]` Agendamento presencial completo com posto Top Tower
- `[EMISSAO-E2E-001]` Emissão online completa com captura

### 3. Testes Assistidos / Demo 🎬

**Requerem intervalo humano. Para demonstração.**

Pasta: `tests/manual-assisted/`

Características:
- Requerem ação manual (CAPTCHA, cliques, etc)
- Úteis para demonstração
- **NÃO são testes de regressão automática**
- Podem depender de agenda disponível

Exemplos:
- `[DEMO-AGP-001]` Fluxo completo assistido de agendamento com CAPTCHA e código
- `[DEMO-EMISSAO-001]` Demo de emissão completa com envio de email

---

## Comandos de Execução

### Setup Inicial

```bash
# Instalar dependências
npm install

# Instalar browsers Playwright
npx playwright install
```

### Testes Automáticos (Regressão)

```bash
# Rodar TUDO (apenas testes automáticos, sem demos)
npm run test:all

# Agendamento Presencial
npm run test:agendamento                    # todos
npm run test:agendamento:local              # apenas localização
npm run test:agendamento:data-hora          # apenas data/hora
npm run test:agendamento:requerente         # apenas requerente
npm run test:agendamento:resumo             # apenas resumo

# Emissão Online
npm run test:emissao                        # todos
npm run test:emissao:captura                # apenas captura
npm run test:emissao:resumo                 # apenas resumo

# Consultas
npm run test:consulta

# 2 Via
npm run test:2via

# API
npm run test:api
```

### Testes E2E

```bash
# Rodar todos os E2E
npm run test:e2e

# Ou executar arquivo específico
npx playwright test tests/e2e/agendamento-presencial-fluxo-completo.spec.ts --headed
```

### Demos e Assistidas

```bash
# Demo assistida de agendamento (com CAPTCHA manual)
npm run test:demo:agendamento

# Demo passo a passo
npm run test:demo:passo-a-passo
```

### Desenvolvimento

```bash
# Modo DEBUG (abre inspector)
npm run test:debug

# Modo UI interativo
npm run test:ui

# Ver relatório
npm run report

# Listar todos os testes
npm run test:list
```

---

## Convenção de Nomes

Todo teste deve ter um nome descritivo:

```
[TIPO-FUNCAO-NUMERO] Descrição clara do que valida
```

### Abreviações

| Sigla | Significado |
|-------|------------|
| AGP | Agendamento Presencial |
| EMI | Emissão Online |
| CONS | Consulta |
| 2V | 2 Via |
| API | Integração API |
| E2E | Fluxo completo automático |
| DEMO | Teste assistido |
| LOCAL | Tela de localização |
| DH | Data e Hora |
| REQ | Requerente |
| RES | Resumo |
| AUTH | Autenticação |

### Exemplos

- `[AGP-LOCAL-001]` Validar tela de localização
- `[AGP-DH-002]` Validar seleção de horário disponível
- `[EMI-CAPT-001]` Validar captura de documento
- `[AGP-E2E-001]` Agendamento presencial completo com posto Top Tower
- `[DEMO-AGP-001]` Fluxo completo assistido de agendamento com CAPTCHA

---

## Regras Críticas

### ✅ Independência

Cada teste deve:
1. Começar sozinho (não depender de outro ter rodado antes)
2. Preparar o que precisa (dados, estado, autenticação)
3. Executar seu fluxo
4. Falhar sozinho

O que **pode** ser compartilhado:
- Massa de dados (`support/data/`)
- Funções auxiliares (`support/helpers/`)
- Page Objects (`pages/`)
- Seletores (`pages/selectors/`)

O que **não pode** ser compartilhado:
- Teste 2 depender do teste 1 ter rodado
- Teste depender de protocolo criado em outro teste
- Teste de regressão depender de CAPTCHA manual
- Teste depender de email recebido

### ❌ Intervalo Manual

**NÃO permitido em:**
- `tests/agendamento-presencial/`
- `tests/emissao-online/`
- `tests/consulta/`
- `tests/2via/`
- `tests/api/`
- `tests/e2e/`

**PERMITIDO apenas em:**
- `tests/manual-assisted/`

### 🎯 Validação de Posto

A validação de resumo e confirmação deve refletir **EXATAMENTE** o posto selecionado no fluxo.

Se a tela mostrar posto diferente:
- Classificar como bug de produto
- **NÃO** alterar expectativa para fazer teste passar
- Reportar no relatório

---

## Estrutura do Projeto

```
tests/
├── agendamento-presencial/     # Testes de regressão
│   ├── local.spec.ts
│   ├── data-hora.spec.ts
│   ├── validacoes-requerente.spec.ts
│   ├── resumo.spec.ts
│   └── autenticacao.spec.ts
│
├── emissao-online/             # Testes de regressão
│   ├── tipo-emissao.spec.ts
│   ├── captura.spec.ts
│   └── resumo.spec.ts
│
├── consulta/                   # Testes de regressão
│   ├── consulta-pedido.spec.ts
│   └── consulta-agendamento.spec.ts
│
├── 2via/                       # Testes de regressão
│   ├── 2via-expressa.spec.ts
│   └── 2via-alteracoes.spec.ts
│
├── api/                        # Testes de integração
│   └── notificador-gbds.spec.ts
│
├── e2e/                        # Fluxos E2E completos
│   ├── agendamento-presencial-fluxo-completo.spec.ts
│   └── emissao-online-fluxo-completo.spec.ts
│
├── manual-assisted/            # Demos e testes assistidos
│   ├── cidadao-smart-demo-fluxo-completo-email.spec.ts
│   └── cidadao-smart-demo-passo-a-passo.spec.ts
│
├── pages/                      # Page Objects
│   ├── CidadaoSmartAgendamentoLocalPage.ts
│   ├── CidadaoSmartAgendamentoDataHoraPage.ts
│   ├── CidadaoSmartResumoPage.ts
│   └── selectors/              # Seletores separados
│
└── support/                    # Helpers e utilitários
    ├── helpers/
    ├── data/
    └── reports/
```

---

## Quando Usar Cada Tipo

### Devo usar Testes Automáticos (Regressão)?

✅ SIM quando:
- Validar uma parte específica do fluxo
- Testes podem rodar sem interação humana
- Sem dependência de CAPTCHA, email ou agenda instável
- Quer parte que roda todo dia sem quebras

❌ NÃO quando:
- Precisa de ação manual
- Depende de email ou SMS
- Depende de CAPTCHA

### Devo usar Testes E2E?

✅ SIM quando:
- Quer validar o fluxo inteiro
- Pode não ter agenda disponível (é ok falhar por isso)
- Cada teste pode começar e terminar sozinho

❌ NÃO quando:
- É só uma validação de tela
- Precisa de intervalo manual

### Devo usar Demos Assistidas?

✅ SIM quando:
- Quer demonstração visual do fluxo
- Precisa de ação manual (CAPTCHA, código por email)
- Não é para rodar automaticamente todo dia

❌ NÃO quando:
- Quer teste de regressão automática
- Precisa passar todo dia sem quebras

---

## Ambientes

### Configuração Necessária

Antes de rodar qualquer teste:

```bash
# Validar VPN conectada
# Validar acesso manual à URL

# Variáveis de ambiente (.env)
CIDADAO_SMART_BASE_URL=https://...
CAPTCHA_MODE=disabled ou manual ou test
CIDADAO_SMART_DRY_RUN=true ou false
```

### CAPTCHA

**Estratégias permitidas:**
- `CAPTCHA_MODE=manual` → usuário marca manualmente (para demos)
- `CAPTCHA_MODE=disabled` → desabilitado em QA controlado (para regressão)
- `CAPTCHA_MODE=test` → quando oficialmente suportado

**NUNCA** burlar CAPTCHA real em produção.

---

## Próximos Passos

1. Renomear testes atuais conforme convenção `[TIPO-FUNCAO-NUMERO]`
2. Separar dados em `support/data/`
3. Consolidar helpers em `support/helpers/`
4. Atualizar imports em testes movidos
5. Testar cada comando npm acima
6. Documentar massa de teste disponível

---

## Dúvidas?

Consulte:
- [AGENTS.md](AGENTS.md) - Regras de arquitetura
- [README.md](README.md) - Visão geral do projeto
- Pasta `docs/` - Documentação técnica
