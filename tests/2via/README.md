# [REGRESSAO] Segunda via

## Objetivo

Guardar testes de regressao da segunda via que podem rodar sem intervencao humana.

## Tipo de execucao

Regressao automatica quando nao depender de CAPTCHA, e-mail manual ou SMART manual.

## Comando principal

```bash
npm run test:2via
```

## Pode entrar aqui

- Validacoes automaticas de segunda via.
- Regras de campos, dados reaproveitados e validacoes previsiveis.
- Cenarios que nao dependem de CAPTCHA real, codigo manual ou SMART manual.

## Nao pode entrar aqui

- Fluxo expressa encadeado que depende de protocolo finalizado e intervencao manual.
- Teste com CAPTCHA real.
- Teste que precisa aguardar QA, SMART manual ou codigo de e-mail manual.

Esses casos ficam em `tests/booking/manual-assisted` enquanto dependerem de acao humana.
