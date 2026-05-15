# Automacao Playwright - Cidadao Smart e Booking

Projeto de testes E2E Playwright para fluxos reais do Cidadao Smart e do Booking / Agendamento.

## Sistemas cobertos

- Cidadao Smart
- Booking / Agendamento
- APIs auxiliares do Smart, Cidadao Smart e Booking apenas como apoio de massa, consulta e validacao

## Estrutura

```txt
tests/
  booking/agendamento-presencial/
  cidadao-smart/emissao-online/
  cidadao-smart/consulta-pedido/
  api/
support/
  api/
  captcha/
  config/
  email/
  fixtures/
  utils/
docs/
  README_EXECUCAO.md
  MAPA_FLUXOS.md
  KNOWN_ISSUES.md
```

Cada fluxo principal fica em uma pasta propria com `*.elements.ts`, `*.flow.ts`, `*.data.ts` e `*.spec.ts`.

## Configuracao

Crie um `.env.local` a partir do `.env.example` e preencha apenas valores de ambiente de teste. Nao versionar senhas, tokens, codigos reais ou dados sensiveis.

```bash
npm install
npx playwright install
```

## Execucao

```bash
npm run test:booking:assistido
npm run test:booking
npm run test:cidadao
npm run test:api
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
