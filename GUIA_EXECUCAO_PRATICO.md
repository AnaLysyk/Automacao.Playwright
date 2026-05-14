# Guia de Execução: Passo a Passo

Como rodar a suíte de testes de forma segura e produtiva.

## 1. Primeiro Setup (Uma Só Vez)

### Passo 1: Clonar o repositório

```bash
git clone <repo-url>
cd automacao-griaule
```

### Passo 2: Instalar dependências

```bash
npm install
```

### Passo 3: Configurar ambiente local

```bash
cp .env.example .env.local
```

### Passo 4: Preencher credenciais

Abra `.env.local` e adicione valores reais:

```
CIDADAO_SMART_BASE_URL=https://cidadao-smart.example.com
BOOKING_ADMIN_BASE_URL=https://booking-admin.example.com
BOOKING_ADMIN_USER=gbds_bind
BOOKING_ADMIN_PASSWORD=SenhaReal123  # ← Nunca commit!
SMART_BASE_URL=https://smart.example.com
SMART_USER=usuario
SMART_PASSWORD=Senha123  # ← Nunca commit!
X_OPERATOR_CPF=12345678901
```

**⚠️ IMPORTANTE:** `.env.local` está em `.gitignore`. Nunca fazer commit com credenciais!

### Passo 5: Testar ambiente

```bash
npm run test:list
```

Deve listar 50+ testes sem erros de "module not found".

---

## 2. Executar Testes Localmente

### Opção A: Smoke (Rápido)

Valida ambiente vivo em 2-3 minutos:

```bash
npm run test:smoke
```

Verifica:
- ✅ Cidadão Smart home carrega
- ✅ Booking Admin login funciona
- ✅ SMART login funciona
- ✅ APIs respondem (health check)

### Opção B: Regressão (Completo)

Executa suíte estável em ~15 minutos:

```bash
npm run test:regressao
```

Verifica:
- ✅ Agendamento completo
- ✅ Consulta de pedido
- ✅ Validações de entrada
- ✅ Admin postos/agenda

### Opção C: API (Contrato)

Apenas backend em 2-3 minutos:

```bash
npm run test:api
```

Verifica:
- ✅ Token de autenticação
- ✅ CRUD de processos
- ✅ Webhook do notificador

### Opção D: Manual (Com CAPTCHA)

Fluxo completo com ação humana (10-15 minutos):

```bash
npm run test:manual -- --headed
```

Vai pausar para:
- Resolver CAPTCHA manualmente
- Confirmar código por email
- Validar visualmente a tela

### Opção E: Tudo (Full Suite)

```bash
npm run test:ci
```

Exclui testes que requerem ação humana. Tempo: ~20 minutos.

---

## 3. Testar Específico

### Um arquivo

```bash
npm run test:regressao -- tests/cidadao-smart/agendamento-presencial/cidadao-smart-agendamento-presencial.spec.ts
```

### Uma suite

```bash
npm run test:regressao -- tests/booking-admin
```

### Uma tag

```bash
npm run test:regressao -- --grep "@readonly"
```

### Um teste específico

```bash
npm run test:regressao -- --grep "\[AGP-FLOW-001\]"
```

---

## 4. Com Visualização (Headed)

Ver o navegador executando:

```bash
npm run test:regressao -- --headed
```

**Vs. Headless (padrão):**
- `--headed`: Navegador visível, mais lento
- (sem flag): Headless, mais rápido

---

## 5. Com Debug

Modo interativo, pausar e inspecionar:

```bash
npm run test:regressao -- --debug
```

Abre DevTools. Use:
- `Step over` (→) → próxima linha
- `Step into` (↓) → entrar em função
- `Continue` (▶) → até próxima pausa
- Console para testar seletores: `page.locator('...')`

---

## 6. Gerar Relatório

Após execução:

```bash
npm run report
```

Abre HTML com screenshots, videos, traces.

---

## 7. Cenários Comuns

### Cenário A: "Ambiente vivo, quer validar tudo antes de push"

```bash
npm run test:smoke
npm run test:api
```

Tempo: ~5-10 minutos. Se passar, ambiente está ok.

### Cenário B: "Implementei novo teste, quer testar local"

```bash
npm run test:regressao -- tests/cidadao-smart/meu-novo-teste.spec.ts --headed --debug
```

Tempo: ~5-10 minutos (dependendo do teste).

### Cenário C: "Teste está falhando, quer debugar"

```bash
npm run test:regressao -- --grep "\[NOME-DO-TESTE\]" --headed --debug
```

Abre navegador + DevTools. Pode pausar e inspecionar DOM.

### Cenário D: "Quer rodas testes em CI (pipeline)"

```bash
npm run test:ci
```

Sem `--headed`, sem `@manual`, sem `@hardware`. Tempo: ~20 minutos.

### Cenário E: "Quer testar segunda via com pagamento"

Não existe ainda. Futuro:

```bash
npm run test:regressao -- --grep "@pagamento"
```

---

## 8. Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| "Cannot find module '@playwright/test'" | `npm install` |
| "BOOKING_ADMIN_PASSWORD não configurada" | Adicione em `.env.local` |
| "Seletor não encontrado" | UI mudou. Use `--debug` para inspecionar |
| "Timeout ao aguardar elemento" | Elemento não existe. Verificar HTML/seletor |
| "Fluxo muito lento" | Aumentar `NAVIGATION_TIMEOUT` em `.env.local` |
| "CAPTCHA falhou" | `CAPTCHA_MODE=manual` não foi completado no tempo |

---

## 9. Após Testes

### Revisar Relatório

```bash
npm run report
```

Ver:
- Testes passou/falhou
- Screenshots de falhas
- Videos (se ativado)
- Traces para debug

### Limpar Artifacts

```bash
rm -rf test-results/
rm -rf playwright-report/
rm -rf .playwright/
```

### Atualizar Código

Se testes passaram:

```bash
git add .
git commit -m "test: adicionar cobertura ABC"
git push
```

---

## 10. Integração com CI (Pipeline)

### GitLab CI

```yaml
# .gitlab-ci.yml
test:
  script:
    - npm ci
    - npm run test:ci
  variables:
    BOOKING_ADMIN_PASSWORD: $BOOKING_ADMIN_PASSWORD
    SMART_PASSWORD: $SMART_PASSWORD
```

### GitHub Actions

```yaml
# .github/workflows/test.yml
- name: Run Tests
  env:
    BOOKING_ADMIN_PASSWORD: ${{ secrets.BOOKING_ADMIN_PASSWORD }}
    SMART_PASSWORD: ${{ secrets.SMART_PASSWORD }}
  run: npm run test:ci
```

---

## 11. Checklist Antes de Executar

- [ ] `.env.local` preenchido com credenciais?
- [ ] Ambiente vivo está acessível (try abrir em browser)?
- [ ] Internet está boa (não usar WiFi instável)?
- [ ] Variáveis de environment estão corretas?
- [ ] Nenhuma outra instância de testes rodando?
- [ ] Disco tem espaço (para screenshots/videos)?

---

## 12. FAQ

**P: Quantos testes existem?**  
A: ~50+. Distribuidos em: smoke (~5), regressão (~20), API (~15), admin (~10).

**P: Quanto tempo leva rodar tudo?**  
A: Smoke: 2-3 min. Regressão: 15 min. API: 3 min. Full: 20 min.

**P: Posso rodar testes em paralelo?**  
A: Sim, por padrão roda em ~4 workers. Use `--workers=1` para serial.

**P: E se internet cair no meio?**  
A: Testes falham com timeout. Retry ou verificar conexão.

**P: Posso rodar em Mac/Linux?**  
A: Sim, comandos são idênticos. Playwright roda em qualquer OS.

**P: Qual navegador usar?**  
A: Padrão: Chromium. Pode trocar em `.env.local`: `BROWSER=firefox`

**P: Posso usar Chrome/Firefox instalado?**  
A: Não (por enquanto). Playwright usa binários próprios.

**P: Como ignore um teste temporariamente?**  
A: `test.skip('nome', ...)`

**P: Como marcar teste como "em progresso"?**  
A: `test('nome', async () => { test.fixme(true, 'Motivo'); })`

---

## 13. Próximas Execuções

Após primeiro setup, rotina é:

```bash
# Antes de trabalhar (validar ambiente)
npm run test:smoke

# Após implementar novo teste
npm run test:regressao -- tests/seu-novo-teste.spec.ts

# Antes de push para main
npm run test:ci

# Antes de release
npm run test:regressao && npm run test:api
```

---

**Sucesso! 🎉**

Ambiente configurado e pronto. Próximo: ler [PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md](PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md) para entender estratégia geral.
