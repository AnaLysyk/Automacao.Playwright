# AGENTS.md

Este repositorio automatiza somente Cidadao Smart e Booking / Agendamento com Playwright e TypeScript.

## Estrategia Atual

- Priorizar fluxos criticos de API para CI/CD.
- UI fica para validacao realmente necessaria, bypass oficial ou execucao assistida.
- Cada teste deve cobrir risco claro: criacao, consulta, cancelamento, protocolo, status, persistencia ou integracao.
- Nao criar teste so porque a tela existe.

## Escopo

- Booking: agendamento critico, consulta e cancelamento.
- Cidadao Smart: via expressa, protocolo, status e persistencia.
- Smart: apoio para validar processo/protocolo quando necessario.
- Nao criar automacao de Identity, dashboard generico, login generico ou SMART operador.

## Organizacao

- Fluxos criticos de CI ficam em `tests/api/`.
- Fluxos de UI continuam por tela em `tests/booking/` e `tests/cidadao-smart/`.
- Apoio compartilhado fica em `support/`.
- Clients de API ficam em `support/api/`.
- Diagnosticos tecnicos ficam em `support/utils/diagnostico.ts`.

## Padrao por Tela

Quando houver UI:

- `*.elements.ts`: somente locators.
- `*.flow.ts`: somente acoes e validacoes reutilizaveis da tela.
- `*.data.ts`: somente massa da tela.
- `*.spec.ts`: testes limpos chamando flows.

Locators nao devem ficar em specs. Fluxos nao devem ficar em elements.

## Seguranca

- Nao versionar `.env.local`, tokens, senhas, codigos reais, credenciais, evidencias ou dados sensiveis.
- CAPTCHA/Captury real nao deve ser burlado.
- E-mail deve passar por `support/email/email.client.ts`.
- CAPTCHA/Captury deve passar por `support/captcha/captcha.helper.ts`.

## Execucao

```bash
npm install
npx playwright install
npm run typecheck
npm run test:list
npm run test:api
npm run test:booking
npm run test:cidadao
npm run booking:agendamento
npm run cidadao:via-expressa
```

Se uma execucao depender de VPN, e-mail, Captury/CAPTCHA ou massa especifica, registrar como pendencia tecnica em vez de mascarar o erro.
