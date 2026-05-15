# Mapa do repositorio

Este mapa mostra a estrutura real atual da automacao Playwright.

Prioridade da organizacao:

1. Nao quebrar execucao.
2. Melhorar entendimento.
3. Documentar o que existe.
4. Mover arquivos apenas em fases validadas.

## Legenda

- `[REGRESSAO]`: automatico, sem intervencao humana.
- `[ASSISTIDO]`: precisa de QA, CAPTCHA, codigo, e-mail ou SMART manual.
- `[POC]`: experimento tecnico.
- `[LEGACY]`: referencia antiga.
- `[SUPPORT]`: helper, massa, relatorio ou utilitario.

## Estrutura atual

```text
tests/
  _support/
    agents/
    captcha/
    config/
    data/
    dates/
    email/
    files/
    flows/
    helpers/
    pages/
    providers/
    reports/
    routes/
    types/

  booking/
    public/
    manual-assisted/
      agendamento-presencial/
    admin/
      read-only/
      write/

  cidadao-smart/
    consulta-pedido/
    emissao-online/
      regressao/
    segunda-via/
      regressao/
      manual-assisted/

  smart/
    read-only/
    write/

  api/
  e2e/
    automated/
    manual-assisted/
  poc/
    captura/
  smoke/
```

## Testes automaticos

- `[REGRESSAO] tests/smoke`
- `[REGRESSAO] tests/booking/public`
- `[REGRESSAO] tests/cidadao-smart/emissao-online/regressao`
- `[REGRESSAO] tests/cidadao-smart/consulta-pedido`
- `[REGRESSAO] tests/cidadao-smart/segunda-via/regressao`
- `[REGRESSAO] tests/api`
- `[REGRESSAO] tests/booking/admin/read-only`
- `[REGRESSAO] tests/smart/read-only`

## Testes assistidos

- `[ASSISTIDO] tests/booking/manual-assisted/agendamento-presencial`
- `[ASSISTIDO] tests/cidadao-smart/segunda-via/manual-assisted`
- `[ASSISTIDO] tests/e2e/manual-assisted`
- `[ASSISTIDO] tests/smart/write`
- `[ASSISTIDO] tests/booking/admin/write`

## POC

- `[POC] tests/poc/captura`

## Suporte

- `[SUPPORT] tests/_support/pages`: Page Objects e seletores.
- `[SUPPORT] tests/_support/agents`: orquestradores de fluxo.
- `[SUPPORT] tests/_support/data`: massas e dados controlados.
- `[SUPPORT] tests/_support/helpers`: helpers reutilizaveis.
- `[SUPPORT] tests/_support/reports`: geradores de relatorio.
- `[SUPPORT] tests/_support/providers`: providers de e-mail/codigo.

Use `@support/...` para importar arquivos de apoio.

## Evidencias e relatorios

Gerados localmente:

- `test-results/`
- `playwright-report/`

Comandos:

- `npm run report`
- `npm run report:testing-company`
- `npm run report:griaule`

## Status dos scripts principais

| Script | Tipo | CI? | Status |
|---|---|---:|---|
| `npm run typecheck` | validacao | sim | ok |
| `npm run test:list` | validacao | sim | ok |
| `npm run test:smoke` | regressao | sim | ok |
| `npm run test:emissao` | regressao controlada | sim/parcial | ok |
| `npm run test:consulta` | regressao | sim/parcial | ok |
| `npm run test:2via` | regressao | sim/parcial | em estabilizacao |
| `npm run test:booking:public` | regressao | sim/parcial | em estabilizacao |
| `npm run test:api` | regressao/API | sim/parcial | verificar ambiente |
| `npm run test:admin:readonly` | read-only | sim/parcial | verificar credenciais |
| `npm run test:booking:assistido` | assistido | nao | manual |
| `npm run test:2via:expressa:encadeada` | assistido | nao | aprovado manualmente |
| `npm run test:2via:alteracao-nome` | assistido | nao | em estabilizacao |
| `npm run test:smart:finalizar` | assistido/write | nao | controlado |
| `npm run test:captura:poc` | POC | nao | experimental |
| `npm run test:all` | regressao ampla | sim/parcial | usar com cautela |
| `npm run test:ci` | CI | sim | revisar antes de pipeline |

## Comandos do dia a dia

```bash
npm run typecheck
npm run test:list
npx playwright test tests/cidadao-smart/emissao-online/regressao --project=chromium
npm run test:2via:expressa:encadeada
npm run report
```

## Nao rodar em CI sem revisao

- `npm run test:booking:assistido`
- `npm run test:booking:assistido:mobile`
- `npm run test:2via:expressa:encadeada`
- `npm run test:2via:expressa:mobile`
- `npm run test:2via:alteracao-nome`
- `npm run test:smart:finalizar`
- `npm run test:e2e:booking-smart-alteracao-nome`
- `npm run test:e2e:booking-smart-2via`
- `npm run test:demo`
- `npm run test:debug`
- `npm run test:ui`
- `npm run test:captura:poc`

