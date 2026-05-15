# Copilot Instructions

Este projeto automatiza somente Cidadao Smart e Booking com Playwright e TypeScript.

Regras:

- Manter testes em `tests/booking/agendamento-presencial/`, `tests/cidadao-smart/emissao-online/`, `tests/cidadao-smart/consulta-pedido/` ou `tests/api/`.
- Manter locators apenas em `*.elements.ts`.
- Manter acoes e validacoes reutilizaveis apenas em `*.flow.ts`.
- Manter massa apenas em `*.data.ts`.
- Specs devem chamar flows e nao devem conter locators.
- Apoio compartilhado fica em `support/`.
- APIs sao apoio, nao substituem fluxo E2E.
- Nao criar `prompts/`, `context/`, arquitetura paralela ou documentacao longa.
- Nao criar automacao para Identity, dashboard generico, login generico ou SMART operador.
- Nao burlar Captury/reCAPTCHA; usar helper em `support/captcha/captcha.helper.ts`.
- E-mail deve passar por `support/email/email.client.ts`.
- Nunca versionar `.env.local`, sessoes, cookies, tokens, senhas ou evidencias.
