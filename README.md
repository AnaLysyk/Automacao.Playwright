# Automacao Playwright - Cidadao Smart e Booking

Projeto de testes E2E Playwright para fluxos reais do Cidadao Smart e do Booking / Agendamento.

## Sistemas cobertos

- Cidadao Smart
- Booking / Agendamento
- APIs auxiliares do Smart, Cidadao Smart e Booking apenas como apoio de massa, consulta e validacao

## Estrutura

```txt
tests/
  cidadao-smart/telas/
  booking/telas/
support/
  api/
  captcha/
  config/
  email/
  fixtures/
  utils/
assets/
  imagens/
  documentos/
```

Cada tela fica em uma pasta propria com `*.elements.ts`, `*.flow.ts`, `*.data.ts` e, quando existir teste funcional, `*.spec.ts`.

## Configuracao

Crie um `.env.local` a partir do `.env.example` e preencha apenas valores de ambiente de teste. Nao versionar senhas, tokens, codigos reais ou dados sensiveis.

```bash
npm install
npx playwright install
```

## Execucao

```bash
npx playwright test tests/cidadao-smart
npx playwright test tests/booking
npx playwright test tests/booking/telas/agendamento-presencial/agendamento-presencial.spec.ts
npm run test:list
```

Fluxos com CAPTCHA, Captury, e-mail ou VPN dependem de ambiente controlado ou passo manual assistido.

## Agentes e e-mail assistido

As regras para Copilot/Agent ficam em `.github/copilot-instructions.md` e `.github/agents/`.

Para e-mail local assistido, use `EMAIL_CODE_MODE=browser` e faça login uma vez em um perfil separado:

```bash
npx playwright codegen --user-data-dir=./playwright/.profiles/email https://mail.google.com
```

`playwright/.profiles/` e `playwright/.auth/` ficam ignorados pelo Git.
