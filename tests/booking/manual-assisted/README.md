# [ASSISTIDO] Booking manual-assisted

## Objetivo

Executar fluxos de Booking/Cidadao Smart que ainda precisam de QA durante a execucao.

## Tipo de execucao

Assistida. Nao deve rodar em CI como regressao automatica.

## Comando principal

```bash
npm run test:booking:assistido
```

Para 2a via expressa encadeada:

```bash
npm run test:2via:expressa:encadeada
```

## Pode entrar aqui

- Fluxos com CAPTCHA real.
- Fluxos com codigo por e-mail manual ou assistido.
- Fluxos que dependem de SMART manual.
- E2E encadeado Booking + SMART + Cidadao.

## Nao pode entrar aqui

- Regressao automatica pura.
- POC tecnica isolada.
- Credenciais, codigos reais ou massa sensivel.

