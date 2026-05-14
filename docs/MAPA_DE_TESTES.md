# Mapa de Testes

Este documento orienta qual suíte rodar para cada área do projeto Booking / Cidadão Smart / SMART.

## Mapa Principal

Área | Tipo | Caminho | Comando | CI
--- | --- | --- | --- | ---
Booking público | UI | `tests/booking/public/` | `npm run test:booking:public` | Parcial
Booking E2E | UI | `tests/booking/e2e/` | `npm run test:booking:e2e` | Controlado
Booking assistido | Manual-assisted | `tests/booking/manual-assisted/` | `npm run test:booking:assistido` | Não
Admin read-only | UI | `tests/booking-admin/read-only/` | `npm run test:admin:readonly` | Parcial
Admin write | UI | `tests/booking-admin/write/` | `npm run test:admin:write` | Não sem ambiente controlado
API Booking | API | `tests/api/booking/` | `npm run test:api:booking` | Sim
API Cidadão Smart | API | `tests/api/cidadao-smart/` | `npm run test:api:cidadao-smart` | Sim
API Notifier | API | `tests/api/notifier/` | `npm run test:api:notifier` | Sim
Regressão geral | UI/API | `tests/agendamento-presencial/`, `tests/emissao-online/`, `tests/consulta/`, `tests/2via/`, `tests/api/` | `npm run test:all` | Parcial

## Regras de Uso

- Fluxo com CAPTCHA real ou código por e-mail é `manual-assisted`.
- Teste `manual-assisted` não deve rodar em CI.
- Teste `write` só deve rodar em ambiente controlado.
- Ambiente 201 deve priorizar validações read-only.
- Cada teste deve ser independente.

## Quando Usar Cada Suíte

- Para validar fluxo público do Booking: `tests/booking/public/`.
- Para demonstrar jornada completa com intervenção humana: `tests/booking/manual-assisted/`.
- Para investigar configuração administrativa: `tests/booking-admin/read-only/`.
- Para alterar configuração administrativa: `tests/booking-admin/write/`, com aprovação e ambiente controlado.
- Para diagnosticar integração: `tests/api/`.

## Manutenção

Quando uma nova suíte for criada:

1. Adicionar script no `package.json`.
2. Atualizar este mapa.
3. Atualizar README da pasta, se existir.
4. Garantir que a classificação entre automático, E2E e assistido esteja clara.
