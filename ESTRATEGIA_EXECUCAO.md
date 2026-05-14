# Estratégia de Execução de Testes

Este documento define como classificar, nomear, executar e manter os testes Playwright de forma profissional e previsível.

---

## 1. Classificação de Testes

Cada teste recebe uma classificação que define seu propósito, recursos necessários e onde pode ser executado.

### SMOKE 🟢

**O que é:** Testes rápidos que validam se o básico está funcionando.

**Características:**
- Validação de elementos/telas (sem navegação complexa)
- Sem CAPTCHA
- Sem dependência de email
- Sem dependência de massa instável (data/horário)
- Execução **< 5 segundos**

**Exemplos:**
- Home carrega corretamente
- Tela de localização exibe campos obrigatórios
- Tela de data/hora exibe abas de requerente
- Consulta exibe formulário

**Onde roda:** CI, Regressão, Dev

**Pasta:** `tests/smoke/`

```typescript
test('[SMOKE-HOME-001] Home carrega corretamente', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Emissão Online')).toBeVisible();
  await expect(page.getByText('Agendamento')).toBeVisible();
});
```

---

### REGRESSÃO 🟡

**O que é:** Testes automáticos que validam funcionalidades específicas do sistema, sem intervenção humana.

**Características:**
- Sem CAPTCHA manual
- Sem email real
- Sem agenda instável (usa massa controlada)
- Sem intervalo humano
- Independentes entre si
- Um teste = uma funcionalidade

**Exemplos:**
- Validar telefone obrigatório
- Validar nome com uma palavra
- Validar seleção de cidade
- Validar seleção de posto
- Validar erro de CPF cancelado

**Onde roda:** CI, Regressão diária, Dev

**Pastas:**
- `tests/agendamento-presencial/`
- `tests/emissao-online/`
- `tests/consulta/`
- `tests/2via/`
- `tests/api/`

```typescript
test('[REG-DH-VALID-001] Validar telefone vazio bloqueia prosseguimento', async ({ page }) => {
  // Navega até data/hora
  // Preenche nome
  // Deixa telefone vazio
  // Tenta prosseguir
  await expect(page.getByText('Telefone é obrigatório')).toBeVisible();
});
```

---

### E2E 🔵

**O que é:** Fluxo completo ponta a ponta do sistema, sem intervalo humano. Pode falhar por agenda indisponível.

**Características:**
- Fluxo inteiro (localização → data/hora → requerente → resumo → confirmação)
- Sem CAPTCHA manual
- Sem email real
- **Pode** depender de agenda disponível (é ok falhar por isso)
- Pode usar dados aleados ou massa específica
- Independente de outro teste ter rodado

**Exemplos:**
- Agendamento presencial completo com Top Tower
- Emissão online completa com captura
- 2via expressa completa

**Onde roda:** Dev, Smoke, Validação manual

**Pasta:** `tests/e2e/`

```typescript
test('[E2E-AGP-001] Agendamento presencial completo com Top Tower', async ({ page }) => {
  // Localização
  await localPage.acessar();
  await localPage.buscarCidade('Florianópolis');
  await localPage.selecionarPosto('Top Tower');
  await localPage.prosseguir();
  
  // Data/Hora
  await dataHoraPage.validarTela();
  await dataHoraPage.preencherRequerente(dadosPessoa);
  await dataHoraPage.selecionarPrimeiraDataDisponivel();
  await dataHoraPage.selecionarPrimeiroHorarioDisponivel();
  await dataHoraPage.prosseguir();
  
  // Resumo
  await resumoPage.validarPostoSelecionado('Top Tower');
  await resumoPage.confirmar();
});
```

---

### DEMO 🟣

**O que é:** Fluxo visual/assistido que requer intervenção humana. Excelente para demonstração e investigação.

**Características:**
- **Requer CAPTCHA manual** ← IMPORTANTE
- **Requer código por email/SMS** ← IMPORTANTE
- Pode depender de agenda disponível
- Uso: demonstração, investigação, validação ponta a ponta
- **NÃO deve rodar em CI**
- **NÃO deve rodar em regressão automática**

**Exemplos:**
- Fluxo completo com CAPTCHA e código por email
- Demo passo a passo com pausas

**Onde roda:** Apenas local/manual

**Pasta:** `tests/manual-assisted/`

```typescript
/**
 * DEMO ASSISTIDA - NÃO RODAR EM CI
 * 
 * Este teste exige:
 * - Resolução manual de CAPTCHA (reCAPTCHA)
 * - Código de segurança recebido por email
 * 
 * Uso recomendado:
 * - Demonstração visual do fluxo
 * - Investigação de problemas ponta a ponta
 * - Validação de integrações com email
 * 
 * Configuração necessária:
 * - CAPTCHA_MODE=manual
 * - Email configurado e acessível
 * - Agenda com data/horário disponível
 */
test('[DEMO-AGP-001] Fluxo completo assistido com CAPTCHA e código por email', async ({ page }) => {
  // Fluxo completo com pausas para intervalo manual
  await page.pause(); // Marcar CAPTCHA aqui
});
```

---

### API 🟠

**O que é:** Testes de integração com APIs backend (notificador, validador, etc).

**Características:**
- Valida respostas de APIs
- Não testa UI (ou testa UI mínima)
- Independente
- Sem CAPTCHA

**Exemplos:**
- Notificador GBDS não envia CPF em plaintext
- Webhook dispara corretamente ao confirmar agendamento
- Status mapping RECEIVED → PROCESSING → APPROVED

**Onde roda:** CI, Regressão

**Pasta:** `tests/api/`

```typescript
test('[API-NOTIF-001] Notificador GBDS não envia CPF em plaintext', async ({ page }) => {
  // Executa fluxo e valida payload do webhook
  // Verifica que CPF não está em plaintext
});
```

---

### MANUAL ⚫

**O que é:** Testes que exigem intervenção humana específica e não teste automático.

**Características:**
- Requer ação humana no sistema
- Não segue fluxo linear
- Investigação ad-hoc

**Exemplos:**
- Validar impressora conectada
- Validar integração de VPN
- Teste manual de biometria

**Onde roda:** Nunca em automação

---

## 2. Nomeação Padrão

Todo teste deve seguir este padrão:

```
[TIPO-MODULO-NUMERO] Descrição clara do que valida
```

### Componentes

| Componente | Exemplo | Descrição |
|-----------|---------|-----------|
| TIPO | SMOKE, REG, E2E, DEMO, API | Classificação do teste |
| MODULO | HOME, AGP, EMI, CONS, 2V, NOTIF | Módulo/funcionalidade |
| NUMERO | 001, 002, 003 | Sequencial |
| Descrição | Home carrega corretamente | O que o teste valida |

### Módulos Principais

| Sigla | Significado |
|-------|------------|
| HOME | Home/landing page |
| AGP | Agendamento Presencial |
| EMI | Emissão Online |
| CONS | Consulta |
| 2V | 2 Via |
| NOTIF | Notificador/API |
| LOCAL | Localização |
| DH | Data e Hora |
| RES | Resumo |
| AUTH | Autenticação |
| CAPT | Captura |
| VALID | Validação |

### Exemplos Completos

```
[SMOKE-HOME-001] Home carrega corretamente
[REG-AGP-LOCAL-001] Validar busca por cidade
[REG-AGP-DH-VALID-001] Validar telefone vazio bloqueia
[REG-EMI-CAPT-001] Validar upload de documento
[E2E-AGP-001] Agendamento presencial completo
[E2E-EMI-001] Emissão online completa
[DEMO-AGP-001] Fluxo completo com CAPTCHA
[API-NOTIF-001] Webhook dispara corretamente
```

---

## 3. Tags para Filtro Rápido

Playwright permite usar tags no nome do teste para filtrar execução.

```typescript
test('@smoke @home deve carregar home', async ({ page }) => {});
test('@regressao @agendamento @validacao deve validar telefone', async ({ page }) => {});
test('@e2e @agendamento fluxo completo', async ({ page }) => {});
test('@demo @manual @agendamento com CAPTCHA', async ({ page }) => {});
test('@api @notificador webhook dispara', async ({ page }) => {});
```

### Executar por Tag

```bash
# Apenas smoke
npx playwright test --grep @smoke

# Apenas regressão
npx playwright test --grep @regressao

# Regressão + agendamento
npx playwright test --grep "@regressao.*@agendamento"

# Tudo menos demo
npx playwright test --grep -v @demo
```

---

## 4. Matriz de Testes

| ID | Tipo | Arquivo | Manual? | CI? | Maturidade |
|----|------|---------|---------|-----|-----------|
| SMOKE-HOME-001 | SMOKE | smoke/home.spec.ts | Não | Sim | Estável |
| REG-AGP-LOCAL-001 | REGRESSÃO | agendamento-presencial/local.spec.ts | Não | Sim | Estável |
| REG-AGP-DH-VALID-001 | REGRESSÃO | agendamento-presencial/validacoes.spec.ts | Não | Sim | Estável |
| E2E-AGP-001 | E2E | e2e/agendamento-completo.spec.ts | Não | Talvez* | Instável** |
| DEMO-AGP-001 | DEMO | manual-assisted/demo-completo.spec.ts | **Sim** | Não | Assistido |
| API-NOTIF-001 | API | api/notificador.spec.ts | Não | Sim | Estável |

*E2E pode falhar por agenda indisponível - ok rodar em regressão específica, não em CI principal.
**Instável = depende de agenda disponível.

---

## 5. Onde Cada Tipo Roda

### CI (GitHub Actions / Pipeline)

```bash
npm run test:smoke     # Sempre - 2 minutos
npm run test:regressao # Sempre - 10 minutos
npm run test:api       # Sempre - 5 minutos
```

### Regressão Local (Dev)

```bash
npm run test:all       # Smoke + Regressão + API - 20 minutos
npm run test:e2e       # Se agenda disponível - 15 minutos
```

### Manual (Sob Demanda)

```bash
npm run test:demo      # Com CAPTCHA manual - N/A
```

### NÃO Roda em CI

❌ `test:demo` - requer CAPTCHA
❌ `test:manual` - requer intervalo humano
❌ E2E com agenda instável - usa massa de prod

---

## 6. Status de Maturidade

### ESTÁVEL 🟢

- Pronto para produção
- Pode rodar em CI
- Confiável 99% das vezes
- Exemplos: validações de campo, busca, erro esperado

### INSTÁVEL 🟡

- Depende de ambiente
- Pode falhar por motivo externo (agenda, email)
- Rodar em regressão específica
- Exemplos: E2E, fluxo completo

### ASSISTIDO 🟣

- Requer ação humana
- Não rodar em automação
- Exemplos: demo com CAPTCHA

### EXPLORATÓRIO 🔵

- Em investigação
- Pode mudar
- Exemplos: testes novos, debugging

### RASCUNHO ⚫

- Ainda em construção
- Não pronto para uso
- Exemplos: WIP, skeleton

---

## 7. Estrutura de Pastas + README

```
tests/
├── smoke/                    # Tests rápidos - ESTÁVEL
│   ├── home.spec.ts
│   ├── README.md             ← Explicar smoke
│   └── ...
│
├── agendamento-presencial/   # Tests regressão - ESTÁVEL
│   ├── local.spec.ts
│   ├── data-hora.spec.ts
│   ├── validacoes.spec.ts
│   ├── README.md             ← Explicar agendamento
│   └── ...
│
├── emissao-online/           # Tests regressão - ESTÁVEL
│   ├── tipo.spec.ts
│   ├── captura.spec.ts
│   ├── README.md
│   └── ...
│
├── e2e/                      # Tests E2E - INSTÁVEL
│   ├── agendamento-completo.spec.ts
│   ├── emissao-completo.spec.ts
│   ├── README.md             ← Alertar sobre instabilidade
│   └── ...
│
├── manual-assisted/          # Tests Demo - ASSISTIDO
│   ├── demo-agendamento.spec.ts
│   ├── demo-passo-a-passo.spec.ts
│   ├── README.md             ← ADVERTÊNCIA: MANUAL
│   └── ...
│
├── api/                      # Tests API - ESTÁVEL
│   ├── notificador.spec.ts
│   ├── README.md
│   └── ...
│
├── pages/
├── support/
└── helpers/                  ← Novo: helpers específicos
    ├── dataHoraHelper.ts
    ├── captchaHelper.ts
    ├── modalHelper.ts
    └── ...
```

---

## 8. Comentários em Português (Boas Práticas)

### ❌ Ruim

```typescript
// clica no botão
await button.click();

// valida texto
await expect(page.getByText('Erro')).toBeVisible();
```

### ✅ Bom

```typescript
// A tela de Data/Hora não permite digitação direta de data.
// A seleção obrigatoriamente passa pelo modal do calendário.
await page.getByText('Selecione', { exact: true }).first().click();

// Este teste é assistido porque o reCAPTCHA não pode ser burlado pela automação.
// O usuário precisa marcar "Não sou um robô" manualmente.
await page.pause();
```

### ✅ Muito Bom

```typescript
/**
 * Seleção de Data e Horário
 * 
 * Lógica:
 * 1. Tenta a data preferida pelo usuário
 * 2. Se indisponível, seleciona a primeira disponível
 * 3. Mesmo para horário
 * 
 * Por que assim?
 * - Deixa o teste resistente a mudanças de agenda
 * - Simula melhor o comportamento do usuário real
 * - Reduz falhas falsas por agenda indisponível
 */
async selecionarDataDisponivel(dataPreferida: string): Promise<void> {
  // Implementação...
}
```

---

## 9. Dados por Ambiente

Criar `.env.local` e documentar:

```bash
# .env
CIDADAO_SMART_BASE_URL=https://172.16.1.146
CIDADAO_SMART_DEFAULT_CITY=Florianópolis
CIDADAO_SMART_DEFAULT_POSTO=Top Tower
CAPTCHA_MODE=disabled  # ou manual, ou test
CIDADAO_SMART_DRY_RUN=false
```

Ambientes:
- **172.16.1.146** → Desenvolvimento (CAPTCHA disabled ok)
- **172.16.1.201** → Validação (autorização necessária)
- **prod-like** → Similar a produção (nunca burlar CAPTCHA)

---

## 10. Checklist de Novo Teste

Quando criar um novo teste, verificar:

- [ ] Classificação definida (SMOKE/REG/E2E/DEMO/API)
- [ ] Nome segue padrão `[TIPO-MOD-NUM] Descrição`
- [ ] Tags adicionadas (`@tipo`, `@modulo`)
- [ ] Comentários explicam decisão (não óbvio)
- [ ] Sem dependência de outro teste ter rodado
- [ ] Sem CAPTCHA manual (exceto DEMO)
- [ ] Sem email real (exceto DEMO)
- [ ] Comentário no topo se assistido
- [ ] Arquivo no lugar certo (`tests/tipo/`)
- [ ] README da pasta menciona o teste

---

## 11. Interpretação de Falhas

Quando um teste falha, perguntar:

| Tipo | Possível Causa | Ação |
|------|----------------|------|
| SMOKE | Seletor quebrou / UI mudou | Arrumar seletor / Page Object |
| REGRESSÃO | Bug do sistema / Massa inválida | Investigar / Reportar / Atualizar massa |
| E2E | Agenda indisponível / Email não chegou | Aceitar falha / Tentar depois |
| DEMO | Pausa de CAPTCHA / Email com atraso | Marcar CAPTCHA / Aguardar email |
| API | Integrção backend com problema | Investigar API / Logs backend |

---

## 12. Exemplo Prático: Novo Teste

```typescript
/**
 * Teste de Validação de Telefone
 * 
 * CLASSIFICAÇÃO: Regressão
 * MATURIDADE: Estável
 * 
 * Por que regressão?
 * - Valida regra crítica de negócio
 * - Sem dependência externa
 * - Massa controlada
 * - Não exige intervalo humano
 * 
 * Por que estável?
 * - Campo de texto simples
 * - Erro esperado está mapeado
 * - Não depende de agenda/email
 */

import { test, expect } from '../fixtures';
import { CidadaoSmartAgendamentoDataHoraPage } from '../pages/CidadaoSmartAgendamentoDataHoraPage';

test('@regressao @agendamento @validacao [REG-AGP-DH-VALID-001] Validar telefone obrigatório bloqueia prosseguimento', async ({ page }) => {
  // Navega até data/hora
  await page.goto('/agendamentos/novo/data-e-hora');
  
  // Preenche dados obrigatórios EXCETO telefone
  const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);
  await dataHoraPage.preencherNome('João Silva');
  await dataHoraPage.preencherCpf('12345678901');
  // Deixa telefone vazio propositalmente
  
  // Tenta prosseguir
  await dataHoraPage.prosseguir();
  
  // Valida mensagem de erro
  await expect(page.getByText('Telefone é obrigatório')).toBeVisible();
  
  // Valida que não avançou
  await expect(page).toHaveURL(/data-e-hora/);
});
```

---

## 13. Scripts npm Prontos

Ver `package.json` - seção "scripts"

Exemplos:
```bash
npm run test:smoke          # SMOKE apenas
npm run test:regressao      # REGRESSÃO apenas
npm run test:e2e            # E2E apenas
npm run test:demo           # DEMO apenas (local)
npm run test:api            # API apenas
npm run test:all            # SMOKE + REG + API (sem DEMO)
npm run test:ci             # CI pipeline (SMOKE + REG + API)
npm run test:list           # Listar todos os testes
```

---

## Resumo

| Tipo | Pasta | Manual? | CI? | Quando |
|------|-------|---------|-----|--------|
| **SMOKE** | `smoke/` | Não | Sim | Sempre - rápido |
| **REGRESSÃO** | `agendamento-presencial/`, `emissao-online/`, etc | Não | Sim | Sempre - completo |
| **E2E** | `e2e/` | Não | Talvez | Local/validação |
| **DEMO** | `manual-assisted/` | **Sim** | **Não** | Manual apenas |
| **API** | `api/` | Não | Sim | Sempre |

A ideia é deixar claro:
- Quem executa não se perde
- Cada tipo tem propósito específico
- Cada tipo tem local específico
- Cada tipo tem documentação específica
- Falha é interpretável
