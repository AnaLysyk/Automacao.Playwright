# SMART / Conferência

Este documento registra contexto funcional relacionado ao SMART e às conferências posteriores aos fluxos do Cidadão Smart / Booking.

Ele não substitui casos de teste e não deve conter credenciais, tokens ou dados reais.

## Objetivo

Apoiar a automação na validação de integrações, consultas e evidências entre Cidadão Smart, Booking e SMART.

## Uso Esperado

- Conferir estados gerados por fluxos públicos.
- Apoiar validações read-only em ambiente produção-like.
- Apoiar diagnóstico quando API, Booking e tela pública divergirem.

## Automação

Testes relacionados devem ficar em:

```text
tests/api/cidadao-smart/
tests/api/booking/
tests/booking-admin/read-only/
```

Qualquer teste que altere estado deve exigir ambiente controlado e aprovação.
