# Booking E2E

Esta pasta reúne os testes automatizados de ponta a ponta do fluxo de Booking / Cidadão Smart.

Use esta pasta apenas para cenários que podem ser executados do início ao fim sem intervenção manual.

## Quando usar

- Fluxos completos de agendamento
- Validação de integração entre Booking e Cidadão Smart
- Testes que dependem do ambiente estar disponível
- Cenários que podem ser executados automaticamente pelo Playwright

## Como executar

```bash
npm run test:regressao -- --grep "@booking"