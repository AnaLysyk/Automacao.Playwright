# Guia de Execução — Cidadão Smart / Booking

## 1. Objetivo

Este guia explica como rodar a suíte de automação, desde a configuração do ambiente até a coleta de evidências.
Ele é para QA e equipe técnica, não para detalhar casos de teste individuais.

## 2. Antes de começar

### 2.1 Conectar VPN

- Conectar à VPN Griaule antes de qualquer execução.
- Verificar que o endereço interno do ambiente está acessível.
- Preferir o ambiente homologação/controlado para automação.

### 2.2 Validar acesso aos ambientes

Testar manualmente no navegador:
- `http://172.16.1.146:8128/smart/` (Cidadão Smart)
- `http://172.16.1.146:8100/react/` (Booking Admin)
- `http://172.16.0.200:8100/react/` (SMART/GBDS)

### 2.3 Verificar requisitos locais

- Node.js 18+
- npm 9+
- Git instalado
- Playwright instalado
- Acesso à pasta do repositório

Verificar rapidamente:
```bash
node --version
npm --version
git --version
```

## 3. Instalação de dependências

### 3.1 Clonar o repositório

```bash
git clone <url-do-repositorio>
cd "Automação - Griaule"
```

### 3.2 Instalar pacotes

```bash
npm install
```

### 3.3 Instalar browsers do Playwright

```bash
npx playwright install chromium
```

### 3.4 Verificar instalação

```bash
npx playwright --version
npm list @playwright/test
```

## 4. Configuração de ambiente

### 4.1 Arquivo `.env.local`

Criar um arquivo local para variáveis de ambiente.
Não versionar este arquivo.

### 4.2 Variáveis recomendadas

Exemplo mínimo:
```env
CIDADAO_SMART_BASE_URL=http://172.16.1.146:8128/smart/
BOOKING_ADMIN_BASE_URL=http://172.16.1.146:8100/react/
API_BASE_URL=http://172.16.1.146:8100/api/

BOOKING_ADMIN_USER=admin
BOOKING_ADMIN_PASSWORD=griaule4096PD$

CAPTCHA_MODE=manual
PW_SLOW_MO=300
PW_TIMEOUT=30000
```

### 4.3 Boas práticas

- Use `.env.local` ou um arquivo local equivalente.
- Nunca commite credenciais reais.
- Mantenha apenas dados de execução temporária.
- Use variáveis para URLs e credenciais, não altere código fonte.

## 5. Comandos principais

### 5.1 Executar todos os testes

```bash
npm run test:all
```

### 5.2 Executar smoke tests

```bash
npm run test:smoke
```

### 5.3 Executar API

```bash
npm run test:api
```

### 5.4 Executar regressão

```bash
npm run test:regressao
```

### 5.5 Executar E2E

```bash
npm run test:e2e
```

### 5.6 Executar demo/manual-assisted

```bash
npm run test:demo
```

### 5.7 Listar testes disponíveis

```bash
npm run test:list
```

### 5.8 Debug com Playwright

```bash
npm run test:debug
```

### 5.9 Exibir relatório

```bash
npm run report
```

## 6. Execução com navegador visível

Para acompanhar o fluxo e capturar ações manuais:

```bash
npm run test:headed
```

Se precisar de inspeção durante a execução, use:

```bash
npm run test:debug
```

## 7. Resolver CAPTCHA e código de segurança

### 7.1 CAPTCHA

- O fluxo atual usa `CAPTCHA_MODE=manual`.
- Interrompa no ponto do CAPTCHA e forneça a validação manual.
- O teste retoma após a confirmação.

### 7.2 Código de e-mail

- Caso o fluxo exija código de segurança, usar valor em `.env.local` ou entrada manual.
- Não automatizar Gmail via UI.
- Documente sempre a origem do código usado.

## 8. Abrir evidências

### 8.1 Relatório Playwright

Após a execução, abrir o relatório:

```bash
npm run report
```

### 8.2 Artefatos principais

- Screenshots: capturas de telas de falha.
- Vídeos: gravações de falha quando ativado.
- Trace: rastreamento detalhado para debug.
- HTML report: resumo de execução.

### 8.3 Onde encontrar

Os artefatos ficam em:
- `playwright-report/`
- `test-results/`
- `tests/support/` (helpers de relatório)

## 9. Recomendações de uso

### 9.1 Antes de um run importante

- Verificar VPN ativa
- Validar URL no navegador
- Atualizar `.env.local`
- Confirmar ambiente correto

### 9.2 Para CI e validação automática

- Rodar apenas testes que não exigem intervenção manual.
- Preferir `npm run test:api`, `npm run test:smoke` e `npm run test:regressao`.
- Evitar incluir `test:demo` ou operações write sem ambiente controlado.

### 9.3 Quando algo falhar

- Verificar se o problema é de ambiente ou de automação.
- Confirmar se o CAPTCHA está pendente.
- Revisar logs no `playwright-report`.
- Se o erro for instável, executar de novo em modo `debug`.

## 10. Referências

- `docs/MAPA_TESTES.md`
- `docs/EVIDENCIAS_E_RELATORIOS.md`
- `context/requirements/ambientes-e-acessos.md`
- `context/requirements/booking-admin.md`
