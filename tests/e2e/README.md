# [REGRESSAO] / [ASSISTIDO] E2E

## Objetivo

Agrupar fluxos ponta a ponta e cenarios de isolamento API/UI.

## Tipo de execucao

Em estabilizacao. Pode misturar regressao automatica e investigacao, entao nao trate tudo como CI seguro.

## Comando principal

```bash
npm run test:e2e
```

## Pode entrar aqui

- Fluxos ponta a ponta automaticos.
- Isolamento de falha API x UI.
- Cenarios CDS/JSON em estabilizacao.

## Nao pode entrar aqui

- Fluxo que exige CAPTCHA ou QA sem marcar como assistido.
- Experimento tecnico que deveria ficar em `tests/poc`.
- Teste legado.

