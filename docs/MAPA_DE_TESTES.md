# Mapa de Testes

Este documento orienta qual suite rodar para cada area do projeto Booking / Cidadao Smart / SMART.

## Mapa principal

| Area | Tipo | Caminho | Comando | CI |
|---|---|---|---|---|
| Smoke | UI | `tests/smoke/` | `npm run test:smoke` | Sim |
| Booking publico | UI | `tests/booking/public/` | `npm run test:booking:public` | Parcial |
| Booking assistido | Manual-assisted | `tests/booking/manual-assisted/agendamento-presencial/` | `npm run test:booking:assistido` | Nao |
| Admin read-only | UI | `tests/booking/admin/read-only/` | `npm run test:admin:readonly` | Parcial |
| Admin write | UI | `tests/booking/admin/write/` | `npm run test:admin:write` | Nao sem ambiente controlado |
| Emissao online | UI | `tests/cidadao-smart/emissao-online/regressao/` | `npm run test:emissao` | Parcial |
| Consulta | UI | `tests/cidadao-smart/consulta-pedido/` | `npm run test:consulta` | Parcial |
| Segunda via regressao | UI | `tests/cidadao-smart/segunda-via/regressao/` | `npm run test:2via` | Parcial |
| Segunda via assistida | Manual-assisted | `tests/cidadao-smart/segunda-via/manual-assisted/` | `npm run test:2via:expressa:encadeada` | Nao |
| API | API | `tests/api/` | `npm run test:api` | Parcial |
| SMART read-only | UI | `tests/smart/read-only/` | `npx playwright test tests/smart/read-only --project=chromium` | Parcial |
| SMART write | Manual-assisted/write | `tests/smart/write/` | `npm run test:smart:finalizar` | Nao |
| E2E automatico | E2E | `tests/e2e/automated/` | `npm run test:e2e` | Controlado |
| E2E assistido | Manual-assisted | `tests/e2e/manual-assisted/` | `npm run test:demo` | Nao |
| POC captura | POC | `tests/poc/captura/` | `npm run test:captura:poc` | Nao |

## Regras de uso

- Fluxo com CAPTCHA real ou codigo por e-mail e `manual-assisted`.
- Teste `manual-assisted` nao deve rodar em CI.
- Teste `write` so deve rodar em ambiente controlado.
- Ambiente 201 deve priorizar validacoes read-only.
- Cada teste deve ser independente.

## Quando usar cada suite

- Para validacao rapida: `npm run typecheck` e `npm run test:list`.
- Para validar fluxo publico do Booking: `tests/booking/public/`.
- Para demonstrar jornada completa com intervencao humana: `tests/booking/manual-assisted/agendamento-presencial/`.
- Para validar emissao online: `tests/cidadao-smart/emissao-online/regressao/`.
- Para validar segunda via expressa assistida: `tests/cidadao-smart/segunda-via/manual-assisted/`.
- Para investigar configuracao administrativa: `tests/booking/admin/read-only/`.
- Para alterar configuracao administrativa: `tests/booking/admin/write/`, com aprovacao e ambiente controlado.
- Para diagnosticar integracao: `tests/api/`.

## Manutencao

Quando uma nova suite for criada:

1. Adicionar script no `package.json`.
2. Atualizar este mapa.
3. Atualizar `docs/CATALOGO_AUTOMACAO.md`.
4. Atualizar README da pasta, se existir.
5. Garantir que a classificacao entre automatico, E2E, POC e assistido esteja clara.
