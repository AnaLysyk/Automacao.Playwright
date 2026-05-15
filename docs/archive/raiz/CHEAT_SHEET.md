# Cheat Sheet - Referência Rápida

Copie & cole comandos e padrões aqui.

---

## 🎯 Comandos Essenciais

### Listar Testes

```bash
npm run test:list
```

### Executar Testes

```bash
# Smoke (rápido)
npm run test:smoke

# Regressão (completo)
npm run test:regressao

# API (backend)
npm run test:api

# Admin (painel)
npm run test:admin

# Manual (com CAPTCHA)
npm run test:manual -- --headed

# CI (tudo menos manual)
npm run test:ci

# Específico (um teste)
npm run test:regressao -- --grep "\[AGP-FLOW-001\]"

# Específico (uma tag)
npm run test:regressao -- --grep "@admin"

# Debugar
npm run test:regressao -- --debug

# Headed (ver navegador)
npm run test:regressao -- --headed

# Vídeo (gravar execução)
npm run test:regressao -- --headed --record
```

### Relatórios

```bash
# Ver relatório HTML
npm run report

# Limpar artefatos
rm -rf test-results/ playwright-report/
```

---

## 🧪 Escrever Novo Teste

### Template Básico

```typescript
import { test, expect, Page } from '@playwright/test';

test.describe('@smoke @meu-modulo', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(process.env.BASE_URL || '');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('[MEU-MODULO-001] Deve fazer algo', async () => {
    // Arrange
    const expectedValue = 'algo';

    // Act
    await page.click('button');
    const result = await page.textContent('h1');

    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

### Importar Helpers

```typescript
import { AuthHelper } from '../helpers/AuthHelper';
import { ApiHelper } from '../helpers/ApiHelper';

// Usar
await AuthHelper.loginBookingAdmin(page);
const token = await ApiHelper.getAuthToken(request);
```

### Selectors Comuns

```typescript
// Elemento por text
page.locator('button:has-text("Enviar")')

// Input de email
page.locator('input[type="email"]')

// Por classe
page.locator('.button-primary')

// Por ID
page.locator('#submit-button')

// Por data-testid
page.locator('[data-testid="user-menu"]')

// Primeiro
page.locator('button').first()

// Com role
page.locator('[role="button"]')
```

### Assertions Comuns

```typescript
// Visibilidade
await expect(page.locator('h1')).toBeVisible();

// Texto
await expect(page.locator('h1')).toHaveText('Título');

// Valor
await expect(page.locator('input')).toHaveValue('valor');

// Contagem
await expect(page.locator('li')).toHaveCount(5);

// URL
expect(page.url()).toContain('/dashboard');
```

---

## 🔐 Variáveis de Ambiente

```bash
# URLs
CIDADAO_SMART_BASE_URL=
BOOKING_ADMIN_BASE_URL=
SMART_BASE_URL=

# Credenciais
BOOKING_ADMIN_USER=gbds_bind
BOOKING_ADMIN_PASSWORD=
SMART_USER=
SMART_PASSWORD=

# APIs
X_OPERATOR_CPF=12345678901

# Teste
CAPTCHA_MODE=manual
TEST_EMAIL=user@example.com
```

---

## 🏷️ Tags Padrão

```
@smoke           # Rápido
@regressao      # Estável
@api            # Backend
@e2e            # Completo
@admin          # Admin
@booking        # Booking
@cidadao        # Cidadão
@smart          # SMART
@manual         # Com humano
@captcha        # CAPTCHA
@hardware       # Hardware
@readonly       # Leitura
@write          # Altera
```

---

## 📝 Naming Convention

```
[TIPO-MODULO-NUM]

Exemplos:
[AGP-FLOW-001]        # Agendamento, fluxo, 001
[ADMIN-LOGIN-002]     # Admin, login, 002
[API-AUTH-001]        # API, auth, 001
```

---

## 🐛 Debug

```bash
npm run test:regressao -- --debug
```

Abre DevTools, step through, inspeciona DOM.

---

## ✅ Validações Comuns

### Formulário

```typescript
await page.fill('input[name="email"]', 'user@example.com');
await page.click('button[type="submit"]');
await page.waitForNavigation();
```

### Tabela

```typescript
const rows = page.locator('tbody tr');
expect(await rows.count()).toBeGreaterThan(0);
```

### Modal

```typescript
const modal = page.locator('[role="dialog"]');
await expect(modal).toBeVisible();
await modal.locator('button:has-text("OK")').click();
await expect(modal).toBeHidden();
```

---

## 📊 Performance

| Ação | Tempo |
|------|--------|
| Navegar | 1-3 seg |
| Clicar | 100-500 ms |
| Preencher | 200-1000 ms |
| Esperar | 1-5 seg |
| Teste smoke | 2-5 min |

---

**Documentação completa:** [GUIA_EXECUCAO_PRATICO.md](GUIA_EXECUCAO_PRATICO.md)
