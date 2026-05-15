# [REGRESSAO] API

## Objetivo

Validar APIs, contratos, payloads e diagnosticos de integracao.

## Tipo de execucao

Regressao automatica quando nao altera estado critico nem depende de massa instavel.

## Comando principal

```bash
npm run test:api
```

## Pode entrar aqui

- Smoke de endpoint.
- Contratos de payload.
- Validacoes de seguranca.
- Diagnosticos de Booking, Cidadao Smart, SMART e Notifier.

## Nao pode entrar aqui

- Fluxo visual de UI.
- CAPTCHA, e-mail manual ou acao humana.
- Tokens, senhas ou payloads reais sensiveis.

