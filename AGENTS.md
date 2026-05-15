# AGENTS.md

Este repositório automatiza somente Cidadão Smart e Booking / Agendamento com Playwright e TypeScript.

## Escopo

- Manter testes principais em `tests/booking/agendamento-presencial/`, `tests/cidadao-smart/emissao-online/`, `tests/cidadao-smart/consulta-pedido/` e `tests/api/`.
- Manter apoio compartilhado em `support/`.
- Usar APIs apenas como apoio de massa, consulta, status e validação.
- Não criar automação de Identity, dashboard genérico, login genérico ou SMART operador.

## Padrão por Tela

Cada tela deve ter, quando aplicável:

- `*.elements.ts`: somente locators.
- `*.flow.ts`: somente ações e validações reutilizáveis da tela.
- `*.data.ts`: somente massa da tela.
- `*.spec.ts`: testes limpos chamando flows.

Locators não devem ficar em specs. Fluxos não devem ficar em elements.

## Segurança

- Não versionar `.env.local`, tokens, senhas, códigos reais, credenciais, evidências ou dados sensíveis.
- CAPTCHA/Captury real não deve ser burlado.
- E-mail deve passar por `support/email/email.client.ts`.
- CAPTCHA/Captury deve passar por `support/captcha/captcha.helper.ts`.

## Execução

```bash
npm install
npx playwright install
npm run test:list
npx playwright test tests/cidadao-smart
npx playwright test tests/booking
```

Se uma execução depender de VPN, e-mail, Captury/CAPTCHA ou massa específica, registrar como pendência técnica em vez de mascarar o erro.
