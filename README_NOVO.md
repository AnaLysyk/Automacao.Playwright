# 🚀 Automação: Cidadão Smart + Booking/Admin + SMART

Suíte completa de testes automatizados para a plataforma Cidadão Smart com integração multi-camadas.

---

## 📚 Índice de Documentação

### 🎯 Comece Aqui

1. **[GUIA_EXECUCAO_PRATICO.md](GUIA_EXECUCAO_PRATICO.md)** ← **LEIA PRIMEIRO**
   - Setup inicial
   - Como rodar testes
   - Cenários comuns
   - Troubleshooting

2. **[CHECKLIST_PRE_EXECUCAO.md](CHECKLIST_PRE_EXECUCAO.md)**
   - Validar ambiente antes de testar
   - Evitar falsos negativos

### 📋 Planejamento & Estratégia

3. **[PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md](PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md)**
   - Arquitetura de 3 camadas
   - Tipos de teste
   - Prioridades por fase
   - O que entra em CI vs. não entra

4. **[MATRIZ_COBERTURA_DETALHADA.md](MATRIZ_COBERTURA_DETALHADA.md)**
   - Mapeamento teste ↔ ticket
   - Status de cada teste
   - % de cobertura por área
   - Próximos passos

### 🔐 Segurança

5. **[SEGURANCA_CREDENCIAIS.md](SEGURANCA_CREDENCIAIS.md)**
   - Gerenciar credenciais
   - Integração CI/CD com secrets
   - Checklist de segurança

### 📁 Estrutura de Pastas

6. **[ESTRUTURA_TESTES.md](ESTRUTURA_TESTES.md)**
   - Explicação de cada pasta
   - Por que esta organização

### ⚙️ Estratégia de Execução

7. **[ESTRATEGIA_EXECUCAO.md](ESTRATEGIA_EXECUCAO.md)**
   - Classificação de testes
   - Naming convention
   - Sistema de tags
   - CI/CD boundaries

### 🤖 Agentes & Workflows

8. **[AGENTS.md](AGENTS.md)**
   - Workflow de agentes
   - Como usar diferentes agentes
   - Regras de automação

---

## 🧪 Testes por Tipo

### 📊 Entender Testes Existentes

| Tipo | Descrição | Tempo | CI? | Arquivo |
|------|-----------|-------|-----|---------|
| **SMOKE** | Validação rápida de ambiente | 2-3 min | ✅ | `npm run test:smoke` |
| **REGRESSÃO** | Validação de funcionalidades estáveis | 15 min | ✅ | `npm run test:regressao` |
| **API** | Testes de contrato backend | 3-5 min | ✅ | `npm run test:api` |
| **E2E** | Fluxo completo multi-sistemas | 20 min | ⏳ | `npm run test:e2e` |
| **MANUAL** | Requer ação humana (CAPTCHA/email) | 15 min | ❌ | `npm run test:manual --headed` |

### 📁 Pastas de Teste

```
tests/
├── smoke/                      # 🚀 Início rápido (2-3 min)
├── cidadao-smart/             # 👤 Tela do cidadão
│   ├── agendamento-presencial/
│   ├── segunda-via-expressa/
│   ├── consulta-pedido/
│   └── ...
├── booking-admin/             # 👨‍💼 Painel administrativo
│   ├── smoke-admin.spec.ts
│   ├── agendamentos/
│   ├── postos/
│   └── ...
├── smart/                     # ⚙️ SMART interno
│   ├── smoke-smart.spec.ts
│   ├── processos-civis/
│   ├── captura-biometrica/
│   └── ...
├── api/                       # 🔌 Testes de contrato
│   ├── api-smoke.spec.ts
│   ├── cidadao/
│   ├── booking/
│   ├── smart/
│   └── notifier/
├── e2e/                       # 🔗 Integrações
│   ├── booking-cidadao/
│   ├── cidadao-smart/
│   └── booking-smart-cidadao/
├── manual-assisted/           # 🖐️ Requer humano
│   ├── captcha/
│   ├── smart-hardware/
│   └── demo-fluxo-completo/
├── helpers/                   # 🔧 Funções compartilhadas
│   ├── AuthHelper.ts
│   ├── ApiHelper.ts
│   ├── AgendamentoHelper.ts
│   └── ...
└── pages/                     # 📄 Page Objects
    ├── cidadao/
    ├── booking-admin/
    └── smart/
```

---

## 🎬 Como Começar

### 1️⃣ Setup Inicial (Uma só vez)

```bash
# Clonar repo
git clone <url>
cd automacao-griaule

# Instalar dependências
npm install

# Copiar exemplo de ambiente
cp .env.example .env.local

# Editar credenciais
nano .env.local
# Adicionar:
# BOOKING_ADMIN_PASSWORD=SenhaReal
# SMART_PASSWORD=SenhaReal
# X_OPERATOR_CPF=12345678901

# Validar setup
npm run test:list  # Deve listar 50+ testes
```

**Tempo:** ~10 minutos

### 2️⃣ Validar Ambiente (Antes de cada sessão)

```bash
# Verificar checklist
# Abrir CHECKLIST_PRE_EXECUCAO.md
# Marcar todos os ✓

# Rodapé rápido
npm run test:smoke
```

**Tempo:** ~5 minutos

### 3️⃣ Executar Testes

**Opção A: Smoke (Rápido)**
```bash
npm run test:smoke
# Tempo: 2-3 min
# Valida: Ambientes up, APIs respondendo, login funciona
```

**Opção B: Regressão (Completo)**
```bash
npm run test:regressao
# Tempo: 15 min
# Valida: Funcionalidades principais, fluxos estáveis
```

**Opção C: API (Backend)**
```bash
npm run test:api
# Tempo: 3-5 min
# Valida: Contrato de APIs, status codes, payloads
```

**Opção D: Manual (Com CAPTCHA)**
```bash
npm run test:manual -- --headed
# Tempo: 15 min
# Valida: Fluxo ponta-a-ponta, email, código
# ⚠️ REQUER VOCÊ RESOLVER CAPTCHA
```

**Opção E: Tudo (CI)**
```bash
npm run test:ci
# Tempo: 20 min
# Valida: Smoke + Regressão + API (sem manual)
# Pronto para push?
```

### 4️⃣ Revisar Resultados

```bash
npm run report
# Abre relatório HTML
# Ver: Screenshots, videos, traces de falhas
```

---

## 🔍 Entender Resultado

### ✅ Testes Passando

```
50 passed ✓
```

**Próximo passo:** Fazer push com confiança

```bash
git add .
git commit -m "test: validar regressão pre-release"
git push
```

### ❌ Testes Falhando

```
5 failed ✗
```

**Próximo passo:** Debugar

```bash
# Revisar relatório
npm run report

# Debugar um teste específico
npm run test:regressao -- \
  --grep "\[AGP-FLOW-001\]" \
  --headed --debug

# Inspecionar DOM no DevTools
# Pausar, investigar, copiar seletor correto
# Atualizar em tests/pages/...
```

---

## 🎯 Fluxo Recomendado

### Antes de Fazer Commit

```bash
# 1. Validar checklist
# → CHECKLIST_PRE_EXECUCAO.md

# 2. Rodar smoke
npm run test:smoke

# 3. Rodar regressão
npm run test:regressao

# 4. Commit se passar
git add -A
git commit -m "..."
git push
```

### Antes de Release

```bash
# 1. Rodar smoke
npm run test:smoke

# 2. Rodar regressão
npm run test:regressao

# 3. Rodar API
npm run test:api

# 4. Rodar manual (se necessário)
npm run test:manual -- --headed

# 5. Verificar matriz
# → MATRIZ_COBERTURA_DETALHADA.md

# 6. Tag & release
git tag v1.2.3
git push --tags
```

---

## 📊 Status Atual

| Componente | Status | % Completo |
|------------|--------|-----------|
| Cidadão Smart | 🟢 Agendamento básico | 70% |
| Booking/Admin | 🟡 Login + postos | 30% |
| SMART Interno | 🟡 Login + processos | 20% |
| API | 🟡 Health check | 40% |
| E2E | 🔴 Não iniciado | 0% |
| **TOTAL** | 🟡 **Em progresso** | **32%** |

---

## 📈 Próximas Fases

### Fase 1: Setup ✅ (Completo)
- ✅ Estrutura de pastas
- ✅ Helpers centralizados
- ✅ Scripts npm
- ✅ Documentação

### Fase 2: Cidadão Smart 🟢 (70%)
- ✅ Agendamento presencial
- ⏳ Segunda via
- ⏳ Consulta de pedido
- ⏳ Status em tempo real

### Fase 3: Booking/Admin 🟡 (30%)
- ✅ Login + smoke
- ⏳ Postos (CRUD)
- ⏳ Agenda (configuração)
- ⏳ Auditoria

### Fase 4: SMART 🟡 (20%)
- ✅ Login + processos
- ⏳ Captura biométrica
- ⏳ Pagamento
- ⏳ Entrega

### Fase 5: API 🟡 (40%)
- ✅ Health check
- ⏳ CRUD de processos
- ⏳ DAE
- ⏳ Notificador

### Fase 6: E2E 🔴 (0%)
- ⏳ Booking → Cidadão
- ⏳ Cidadão → SMART
- ⏳ Full 3-camadas

---

## 🆘 Ajuda Rápida

**P: Teste está falhando. Por onde começo?**
→ Ler [GUIA_EXECUCAO_PRATICO.md](GUIA_EXECUCAO_PRATICO.md) seção "Troubleshooting"

**P: Como adicionar novo teste?**
→ Ler [ESTRATEGIA_EXECUCAO.md](ESTRATEGIA_EXECUCAO.md) seção "Naming Convention"

**P: Esqueci credencial do admin. O que fazer?**
→ Ler [SEGURANCA_CREDENCIAIS.md](SEGURANCA_CREDENCIAIS.md) seção "Recuperação"

**P: Como rodar em CI/CD?**
→ Ler [SEGURANCA_CREDENCIAIS.md](SEGURANCA_CREDENCIAIS.md) seção "CI/CD"

**P: Qual teste devo rodar antes de push?**
→ Ler "Fluxo Recomendado" acima

---

## 📞 Contato & Suporte

- **Problemas de teste:** Revisar documentação primeiro
- **Bugs em helpers:** Abrir issue no repo
- **Pedidos de novo teste:** Atualizar [MATRIZ_COBERTURA_DETALHADA.md](MATRIZ_COBERTURA_DETALHADA.md)
- **Questões de segurança:** Ler [SEGURANCA_CREDENCIAIS.md](SEGURANCA_CREDENCIAIS.md)

---

## 📅 Próxima Revisão

- **Documentação:** [+1 mês]
- **Cobertura:** [+2 semanas]
- **Infraestrutura:** [+3 meses] (Vault, K8s, etc)

---

**Versão:** 2.0.0  
**Última atualização:** [HOJE]  
**Status:** 🟡 Em Produção (Fase 2/6)

---

## 🚦 Quick Links

- 🎬 [Como começar](GUIA_EXECUCAO_PRATICO.md)
- ✅ [Validar antes de testar](CHECKLIST_PRE_EXECUCAO.md)
- 📋 [Planejamento completo](PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md)
- 📊 [Matriz de cobertura](MATRIZ_COBERTURA_DETALHADA.md)
- 🔐 [Segurança & credenciais](SEGURANCA_CREDENCIAIS.md)
- 📁 [Explicação de pastas](ESTRUTURA_TESTES.md)
- ⚙️ [Estratégia de execução](ESTRATEGIA_EXECUCAO.md)
- 🤖 [Agentes & workflows](AGENTS.md)

---

**Bom testing! 🎉**
