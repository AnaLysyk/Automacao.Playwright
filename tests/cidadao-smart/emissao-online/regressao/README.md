# [REGRESSAO] Emissao online

## Objetivo

Validar telas e regras basicas da emissao online em cenario controlado.

## Tipo de execucao

Regressao automatica, desde que o ambiente esteja com CAPTCHA/codigo controlado.

## Comando principal

```bash
npx playwright test tests/emissao-online --project=chromium
```

## Pode entrar aqui

- Specs automaticas de autenticacao, tipo de emissao, captura e resumo.
- Validacoes que nao exigem acao humana obrigatoria.
- Cenarios com massa controlada e evidencias reproduziveis.

## Nao pode entrar aqui

- Fluxo com CAPTCHA real manual.
- Codigo por e-mail manual.
- SMART manual ou fluxo encadeado com QA.

