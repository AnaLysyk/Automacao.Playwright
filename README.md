# Automacao Playwright - Cidadao Smart e Booking

Projeto de testes Playwright para fluxos criticos do Cidadao Smart e do Booking / Agendamento.

A estrategia atual e API-first e CI/CD-first: validar rapidamente criacao, consulta, cancelamento, protocolo, status e persistencia. A UI continua no projeto, mas fica reservada para fluxos realmente necessarios, bypass oficial ou execucao assistida.

## Sistemas cobertos

- Cidadao Smart
- Booking / Agendamento
- APIs auxiliares do Smart, Cidadao Smart e Booking

## Estrutura

```txt
tests/
  api/booking/
  api/cidadao-smart/
  booking/agendamento-presencial/
  cidadao-smart/emissao-online/
  cidadao-smart/consulta-pedido/
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

Fluxos de UI continuam por tela com `*.elements.ts`, `*.flow.ts`, `*.data.ts` e `*.spec.ts`. Fluxos criticos de CI ficam em `tests/api/`.

## Configuracao

Crie um `.env.local` a partir do `.env.example` e preencha apenas valores de ambiente de teste. Nao versionar senhas, tokens, codigos reais ou dados sensiveis.

```bash
npm install
npx playwright install
```

## Execucao

Fluxos criticos de API:

```bash
npm run test:booking
npm run test:cidadao
npm run booking:agendamento
npm run cidadao:via-expressa
npm run test:api
```

Validacoes recomendadas para CI/CD:

```bash
npm run typecheck
npm run test:list
npm run test:api
```

Fluxos assistidos ou por tela:

```bash
npm run test:booking:assistido
npm run test:booking:ui
npm run test:cidadao:ui
```

Fluxos com CAPTCHA, Captury, e-mail ou VPN dependem de ambiente controlado ou passo manual assistido.

## Agentes e e-mail assistido

As regras para Copilot/Agent ficam em `.github/copilot-instructions.md` e `.github/agents/`.

Para e-mail local assistido, use `EMAIL_CODE_MODE=browser` e faca login uma vez em um perfil separado:

```bash
npx playwright codegen --user-data-dir=./playwright/.profiles/email https://mail.google.com
```

`playwright/.profiles/` e `playwright/.auth/` ficam ignorados pelo Git.
