# Mapa de Testes — Automação Cidadão Smart / Booking

## Objetivo

Este documento orienta a equipe sobre quais suítes de teste rodar para cada área do projeto.
Ele ajuda a responder:

- Quero testar Booking público, rodo o quê?
- Quero testar Admin, rodo o quê?
- Quero testar API, rodo o quê?
- Quero ver fluxo assistido, rodo o quê?
- Qual pode ir para CI?
- Qual precisa de humano?

## Estrutura do mapa

Área | Tipo | Caminho | Comando | CI
--- | --- | --- | --- | ---
Booking público | UI | `tests/cidadao-smart/` | `npm run test` (filtro específico) | Parcial
Booking assistido | Manual | `tests/manual-assisted/` | `npm run test:demo` | Não
Admin read-only | UI | `tests/booking-admin/` | `npm run test` (grep read-only) | Sim / Parcial
Admin write | UI | `tests/booking-admin/` | `npm run test` (grep write) | Controlado
API Booking | API | `tests/api/` | `npm run test:api` | Sim
Smoke | UI/API | `tests/smoke/` | `npm run test:smoke` | Sim
Regressão geral | UI/API | `tests/agendamento-presencial/`, `tests/emissao-online/`, `tests/consulta/`, `tests/2via/`, `tests/api/` | `npm run test:regressao` | Sim
E2E | UI | `tests/e2e/` | `npm run test:e2e` | Não / Controlado

## Observações gerais

- A suíte `tests/booking-admin/` deve ser dividida internamente entre testes read-only e write.
- O mapa usa o padrão de comandos atuais no `package.json`.
- Se houver uma nova suíte, atualize este documento e o `package.json`.

## Recomendações para execução

1. Para validar um bug de configuração administrativa: rode primeiro o Admin read-only.
2. Para validar impacto no público: rode Booking público e API Booking.
3. Para testes assistidos ou demonstrações: use `tests/manual-assisted/`.
4. Para CI: inclua apenas os testes estáveis e que não alteram estado crítico.

## Como usar este documento

- Se a dúvida for "testar Booking público", escolha a linha `Booking público`.
- Se a dúvida for "testar Admin", determine se o caso é read-only ou write.
- Se a dúvida for "testar API", use a linha `API Booking`.
- Se a dúvida for "ver fluxo assistido", use `Booking assistido`.

## Critérios de CI

- CI deve rodar somente testes que não dependem de intervenção manual.
- CI deve preferir `tests/smoke/`, `tests/api/`, `tests/booking-admin/` read-only e regressão estável.
- Testes `write` e assistidos só devem ser executados em ambiente controlado.

## Sugestão de próximos passos

- Adicionar scripts npm específicos para `booking-admin:readonly` e `booking-admin:write`.
- Mapear casos de `tests/cidadao-smart/` em categorias de fluxo público.
- Atualizar `docs/GUIA_EXECUCAO.md` com os comandos deste mapa.
- Vincular o mapa ao `docs/MATRIZ_DE_TESTES_E_EXECUCAO.md`.
