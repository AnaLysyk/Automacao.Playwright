# Segurança: Gerenciamento de Credenciais

## Regra Principal

**Credenciais NUNCA entram em código, README, screenshots ou commits.**

---

## 1. Variáveis Sensíveis

| Variável | Sensibilidade | Onde Armazenar | Risco |
|----------|---------------|-----------------|-------|
| `BOOKING_ADMIN_PASSWORD` | 🔴 Crítica | .env.local | Acesso admin |
| `SMART_PASSWORD` | 🔴 Crítica | .env.local | Acesso interno |
| `X_OPERATOR_CPF` | 🟡 Alta | .env.local | Identidade falsa |
| `GBDS_API_KEY` | 🟡 Alta | CI/CD secrets | Acesso notificador |
| `KEYCLOAK_CLIENT_SECRET` | 🟡 Alta | CI/CD secrets | Acesso autenticação |
| `DAE_API_KEY` | 🟡 Alta | CI/CD secrets | Acesso DAE |

---

## 2. Configuração Local

### Passo 1: Criar .env.local

```bash
# Na raiz do projeto
cp .env.example .env.local
```

### Passo 2: Preencher Valores Reais

```bash
# .env.local (NUNCA fazer commit!)
BOOKING_ADMIN_PASSWORD=SenhaRealAqui
SMART_PASSWORD=OutraSenhaAqui
X_OPERATOR_CPF=12345678901
```

### Passo 3: Verificar .gitignore

O arquivo `.env.local` **deve** estar em `.gitignore`:

```
# .gitignore
.env.local
.env.*.local
*.key
credentials/
```

---

## 3. Configuração para CI/CD

### GitLab CI

```yaml
# .gitlab-ci.yml
test:
  script:
    - npm ci
    - npm run test:ci
  variables:
    BOOKING_ADMIN_PASSWORD: $BOOKING_ADMIN_PASSWORD  # Secret configurado no CI
    X_OPERATOR_CPF: $X_OPERATOR_CPF
```

**No GitLab UI:**
- Ir para `Settings` → `CI/CD` → `Variables`
- Adicionar `BOOKING_ADMIN_PASSWORD` como "Masked" e "Protected"

### GitHub Actions

```yaml
# .github/workflows/test.yml
- name: Run Tests
  env:
    BOOKING_ADMIN_PASSWORD: ${{ secrets.BOOKING_ADMIN_PASSWORD }}
    X_OPERATOR_CPF: ${{ secrets.X_OPERATOR_CPF }}
  run: npm run test:ci
```

**No GitHub UI:**
- Ir para `Settings` → `Secrets and variables` → `Actions`
- Adicionar `BOOKING_ADMIN_PASSWORD` (será mascarado automaticamente)

---

## 4. Acessando Variáveis em Código

### ✅ Correto

```typescript
// pages/booking-admin-login.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export class BookingAdminLoginPage {
  async login(page: Page) {
    const user = process.env.BOOKING_ADMIN_USER;
    const password = process.env.BOOKING_ADMIN_PASSWORD;  // ✅ Nunca hardcoded

    if (!password) {
      throw new Error('BOOKING_ADMIN_PASSWORD não configurada em .env.local');
    }

    await page.fill('#username', user);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
  }
}
```

### ❌ Errado

```typescript
// ❌ NUNCA fazer isso
const password = 'Griaule.123';  // Credencial hardcoded!

// ❌ NUNCA fazer isso
await page.fill('#password', 'SenhaDoAdmin');  // Credencial em código!

// ❌ NUNCA fazer isso
console.log(process.env.BOOKING_ADMIN_PASSWORD);  // Credencial em log!
```

---

## 5. Proteção de Screenshots/Logs

### Mascarar Credenciais em Screenshots

```typescript
// helpers/screenshot-helper.ts
export async function safeScreenshot(page: Page, path: string) {
  // Máscara campos de senha
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[type="password"]');
    inputs.forEach(input => {
      (input as HTMLInputElement).value = '••••••••';
    });
  });

  await page.screenshot({ path });
}
```

### Não Logar Credenciais

```typescript
// ❌ NUNCA
console.log('Logging in as:', user, password);

// ✅ OK
console.log('Logging in as:', user);
```

---

## 6. Auditoria

### Verificar se Credencial Vazou

```bash
# Procurar por padrões de senha em commits
git log -p | grep -i "password\|senha\|credencial"

# Procurar por CPF
git log -p | grep -E "\d{3}\.\d{3}\.\d{3}-\d{2}"
```

### Se Vazou, Agir Rapidamente

1. **Revogar** a credencial imediatamente
2. **Gerar** nova credencial no Booking/Admin
3. **Remover** do histórico Git (se possível)
4. **Notificar** o time

---

## 7. Checklist de Segurança

Antes de fazer commit:

- [ ] `.env.local` está em `.gitignore`?
- [ ] Nenhuma senha em código `*.ts`?
- [ ] Nenhuma senha em `*.md` (README, planos)?
- [ ] Nenhuma senha em `.env.example`?
- [ ] X_OPERATOR_CPF real está em `.env.local`, não em `.env.example`?
- [ ] Logs não expõem credenciais?
- [ ] Screenshots não mostram senhas?
- [ ] Tests com `@manual` não são executadas em CI?

---

## 8. Recuperação de Senha

Se esquecer a senha do admin:

1. Acessar Booking Admin interface
2. Clicar em "Forgot Password"
3. Receber link no email configurado
4. Resetar senha
5. Atualizar `.env.local` com nova senha
6. Testar login

**Nunca** armazenar em texto plano permanentemente.

---

## 9. Rotação de Credenciais

**Recomendação:** A cada 3 meses ou após saída de alguém do time:

```bash
# 1. Alterar senha no Booking/Admin
# 2. Atualizar .env.local
# 3. Testar login
# 4. Atualizar CI/CD secrets
```

---

## 10. Integração com Vault/Secrets Manager

Para produção, considerar:

- **HashiCorp Vault**: Centralizar secretos
- **AWS Secrets Manager**: Se usar AWS
- **Azure Key Vault**: Se usar Azure
- **GitLab Secrets**: Se usar GitLab

Exemplo (futuro):

```typescript
import * as Vault from '@hashicorp/vault-api';

const vault = new Vault.VaultClient();
const secret = await vault.read('secret/booking-admin-password');
const password = secret.data.data.password;
```

---

## Perguntas Frequentes

**P: E se alguém clonar meu repositório e ver .env.example?**  
A: .env.example não tem valores reais, apenas nomes de variáveis. É seguro.

**P: E se eu acidentalmente fazer commit de .env.local?**  
A: Use `git rm --cached .env.local` e depois commit. Depois remova do histórico com `git filter-branch` (perigoso, coordenar com o time).

**P: E em CI/CD, como a senha chega ao container?**  
A: Via secrets do pipeline (GitLab CI, GitHub Actions). O pipeline injeta como variável de ambiente no container, nunca em arquivo.

**P: E se o teste falhar? Apareça a senha no erro?**  
A: Não, porque o teste acessa via `process.env.BOOKING_ADMIN_PASSWORD`, nunca hardcoded. O erro mostra apenas que a variável não está definida.

**P: E testes em pull request de forks?**  
A: Secrets não são passadas para forks por segurança. Esses testes precisam de credencial teste ou ser rodados manualmente.

