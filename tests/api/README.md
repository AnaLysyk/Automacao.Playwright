# [REGRESSAO] API

## Objetivo

Validar APIs, contratos, payloads e diagnosticos de integracao.

## Tipo de execucao

Regressao automatica quando nao altera estado critico nem depende de massa instavel.

## Comando principal

```bash
npm run test:api
npm run test:api:booking
npm run test:api:cidadao-smart
```

## Regras de seguranca

- Testes read-only e negativos rodam por padrao.
- Testes que criam processo, cancelam protocolo ou geram DAE exigem `API_WRITE_ENABLED=true`.
- Token, client secret, CPF de operador e massas reais ficam apenas no `.env.local`.
- CPF, protocolo valido e posto devem ser massas controladas de QA.

## Pode entrar aqui

- Smoke de endpoint.
- Contratos de payload.
- Validacoes de seguranca.
- Diagnosticos de Booking, Cidadao Smart, SMART e Notifier.

## Nao pode entrar aqui

- Fluxo visual de UI.
- CAPTCHA, e-mail manual ou acao humana.
- Tokens, senhas ou payloads reais sensiveis.
