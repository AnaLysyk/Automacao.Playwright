# 📍 ÍNDICE DE NAVEGAÇÃO - Cidadão Smart Automação

## 🎯 Leia Primeiro (5 min)

1. **[RESUMO_EXECUTIVO.md](./RESUMO_EXECUTIVO.md)** ← AQUI!
   - Status do projeto (100% pronto)
   - Checklist pré-execução
   - Próximos passos
   - Regras críticas

---

## 📚 Documentação Consolidada

### Para Implementadores (Copilot/AI)

📌 **[prompts/COPILOT_HANDOFF_IMPLEMENTATION.md](./prompts/COPILOT_HANDOFF_IMPLEMENTATION.md)** ⭐
- Tarefas Priority 1-4
- Fluxo 5 rotas detalhado
- Seletores dinâmicos
- Validações de negócio
- GBDS + Segurança CPF
- Dúvidas/Bloqueadores

### Para QA/Testers

📌 **[README.md](./README.md)**
- Quick Start
- Npm Scripts essenciais
- Page Objects + métodos
- Exemplo execução
- Troubleshooting

### Para Product/Stakeholders

📌 **[context/requirements/CIDADAO_SMART_FULL_CONTEXT.md](./context/requirements/CIDADAO_SMART_FULL_CONTEXT.md)**
- Objetivo + Ambiente
- Fluxo presencial (5 rotas)
- 2ª Via Expressa
- 2ª Via com Alterações
- Massa de testes (CPFs)
- Matriz completa
- Regras críticas

---

## 🗂️ Estrutura de Código

### Page Objects (5 rotas)
```
tests/pages/
├── CidadaoSmartAgendamentoLocalPage.ts         (Rota 1)
├── CidadaoSmartAgendamentoDataHoraPage.ts      (Rota 2)
├── CidadaoSmartAgendamentoResumoPage.ts        (Rota 3)
├── CidadaoSmartAgendamentoAutenticacaoPage.ts  (Rota 4)
├── CidadaoSmartAgendamentoConfirmacaoPage.ts   (Rota 5)
└── selectors/                                   (5 selector files)
```

### Specs (7 suites)
```
tests/
├── cidadao-smart-agendamento-presencial.spec.ts      (Fluxo feliz)
├── cidadao-smart-agendamento-validacoes.spec.ts      (Negativos)
├── cidadao-smart-agendamento-resumo.spec.ts
├── cidadao-smart-agendamento-autenticacao.spec.ts
├── cidadao-smart-2via-expressa.spec.ts               (2ª Via Exp.)
├── cidadao-smart-2via-alteracoes.spec.ts             (Docs + Pgto)
└── cidadao-smart-notificador-gbds.spec.ts            (Webhooks)
```

### Support/Helpers
```
tests/support/
├── data/cidadaoSmartMass.ts                   (CPFs + status)
├── captcha/handleCaptcha.ts                   (CAPTCHA modes)
├── dates/birthDateFactory.ts                  (Datas dinâmicas)
└── flows/cidadaoSmartFlows.ts                 (Helpers reutilizáveis)
```

### Config
```
.env.example                                    (Template variáveis)
playwright.config.ts                            (Config Playwright)
package.json                                    (Scripts + deps)
fixtures.ts                                     (Base fixtures)
```

---

## 🚀 Fluxo de Uso Rápido

### 1️⃣ Setup Inicial
```bash
# Clonar/abrir projeto
cd "c:\Users\Testing Company\Desktop\Automação - Griaule"

# Copiar .env
cp .env.example .env
# Editar .env com credenciais

# Instalar deps
npm install
```

### 2️⃣ Executar Testes
```bash
# Toda suite
npm run test:cidadao

# Suite específica
npm run test:cidadao:agendamento
npm run test:cidadao:2via-expressa
npm run test:cidadao:2via-alteracoes
npm run test:cidadao:gbds

# Com browser visível
npm run test:headed

# Ver relatório
npm run test:report
```

### 3️⃣ Implementação (Copilot)
1. Abrir `prompts/COPILOT_HANDOFF_IMPLEMENTATION.md`
2. Copiar conteúdo
3. Colar no Copilot/ChatGPT/Claude
4. Aguardar implementação
5. Rodar `npm run test:cidadao -- --headed`

---

## 📊 Massa de Testes

Localização: `tests/support/data/cidadaoSmartMass.ts`

### CPFs Elegíveis
- `03659187763` - Ana (2ª Via Exp.)
- `06834801707` - Luciene (2ª Via Alt.)

### CPFs Inelegíveis
- `13036174630` - Menor 16 anos ❌
- `00979771447` - CPF cancelado ❌
- `03659184829` - Processo duplicado ❌

---

## ✅ Checklist Execução

- [ ] VPN conectada (172.16.1.146)
- [ ] `.env` criado com credenciais
- [ ] `npm install` executado
- [ ] Chromium baixado: `npx playwright install chromium`
- [ ] `CAPTCHA_MODE` configurado (manual ou disabled)
- [ ] Executar: `npm run test:cidadao -- --headed`

---

## 🎯 Regras Críticas

| Regra | Por Quê | Impacto |
|-------|---------|--------|
| Top Tower ≠ Aeroporto | Validação corretude | 🔴 FALHA |
| CAPTCHA nunca burlar | Segurança | 🔴 FALHA |
| Protocolo dinâmico | Não hardcoded | 🔴 FALHA |
| CPF hash em GBDS | Segurança dados | 🔴 FALHA |
| Menor 16 rejeitado | Regra RFB | 🔴 FALHA |
| Telefone obrigatório | Validação | 🔴 FALHA |
| Nome 2+ palavras | Validação | 🔴 FALHA |

---

## 📋 Prompts Complementares

### Run 001: Agendamento Presencial Baseline
`prompts/runs/cidadao-smart/001-agendamento-presencial-baseline.md`

### Run 002: Validações Requerente
`prompts/runs/cidadao-smart/002-validacoes-requerente.md`

### Run 003: Confirmação Email (Gmail)
`prompts/runs/cidadao-smart/003-confirmacao-email-gmail.md`

### Diagnostic
`prompts/planner/CIDADAO_SMART_AGENDAMENTO_DIAGNOSTIC.md`

---

## 🔗 Links Rápidos

| Arquivo | Propósito | Acesso |
|---------|-----------|--------|
| RESUMO_EXECUTIVO.md | Status + checklist | 5 min leitura |
| README.md | Guia completo | Quick start |
| COPILOT_HANDOFF_IMPLEMENTATION.md | Implementação | Tarefas Priority |
| CIDADAO_SMART_FULL_CONTEXT.md | Contexto completo | Specs detalhadas |
| cidadaoSmartMass.ts | Dados testes | CPFs + status |
| playwright.config.ts | Config Playwright | Timeouts + baseURL |
| package.json | Scripts npm | test:cidadao |
| .env.example | Variáveis | CAPTCHA_MODE |

---

## 💡 Dicas Rápidas

### Para ativar CAPTCHA manual
```bash
CAPTCHA_MODE=manual npm run test:cidadao
# page.pause() na tela local para resolver manualmente
```

### Para desabilitar CAPTCHA (QA)
```bash
CAPTCHA_MODE=disabled npm run test:cidadao
# Pula CAPTCHA automaticamente
```

### Para debug completo
```bash
npm run test:debug
# Abre debugger, usar: continue (c), step (s), step over (o)
```

### Ver um teste específico
```bash
npm test -- --grep "Fluxo feliz"
```

### Ver relatório offline
```bash
npm run test:report
# Abre `playwright-report/index.html`
```

---

## 📞 Suporte

### Erro: "Element not found"
1. Validar seletores em 172.16.1.146 com DevTools
2. Atualizar em `tests/pages/selectors/*.ts`

### Erro: "Timeout 90s"
1. Aumentar em `playwright.config.ts`
2. Pode ser VPN lentidão

### Erro: "CAPTCHA pausa infinita"
1. Usar `CAPTCHA_MODE=disabled` em QA
2. Manual: resolver no navegador e clicar Prosseguir

### Erro: "CPF inválido"
1. Validar massa em `cidadaoSmartMass.ts`
2. Testar CPF manualmente no ambiente

---

## 📈 Status Final

```
✅ Scaffold:              100% Completo
✅ Documentação:          100% Completo
✅ Dependências:          100% Instaladas
🟡 Implementação:         0% (aguardando Copilot)
🟡 Validação:             0% (aguardando execução)

Proxime Milestone: Fluxo feliz até confirmacao verde
Estimativa: 6-9 horas
```

---

## 🎬 Comece Aqui

1. **Ler:** `RESUMO_EXECUTIVO.md` (este arquivo)
2. **Setup:** Seguir "Checklist Execução"
3. **Implementar:** Passar `COPILOT_HANDOFF_IMPLEMENTATION.md` para IA
4. **Executar:** `npm run test:cidadao -- --headed`
5. **Validar:** Abrir `test-results/` para relatório

---

**🚀 Pronto para começar!**
