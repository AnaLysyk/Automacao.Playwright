# Status atual da automacao

Status revisado em 2026-05-15.

## Aprovado / funcionando

- `[REGRESSAO]` Emissao Online basica em regressao controlada.
- `[ASSISTIDO]` 2a via expressa assistida com geracao de protocolo e evidencia.
- `[SUPPORT]` Estrutura de apoio centralizada em `tests/_support`.
- `[REGRESSAO]` Smoke minimo da home criado em `tests/smoke`.

Evidencia recente:

- `npm run typecheck`: passou.
- `npm run test:list`: passou e encontrou 500 testes em 30 arquivos.
- `npm run test:smoke`: passou com 1 teste aprovado.
- `npx playwright test tests/cidadao-smart/emissao-online/regressao --project=chromium`: passou com 2 aprovados e 7 ignorados pela propria suite.

## Em estabilizacao

- `[ASSISTIDO]` 2a via com alteracoes.
- `[ASSISTIDO]` Reenvio apos rejeicao parcial.
- `[POC]` Captura/fake video.
- `[ASSISTIDO]` E2E Booking + SMART + Cidadao.
- `[REGRESSAO]` E2E com dependencias de agenda, massa e ambiente.
- `[REGRESSAO]` Segunda via de regressao sem intervencao humana.

## Pendente

- Separacao futura de `tests/booking/public` por subfluxo interno, se valer a pena.
- Criacao de specs dedicadas para `segunda-via/reenvio-documentos`.
- Padronizacao gradual dos nomes de specs antigas.
- Revisao de API para separar `booking`, `cidadao-smart`, `notifier` e `smart` quando houver ganho real.
- Definir quais scripts entram em CI definitivo.

## Regras de leitura

- Fluxo assistido nao e regressao automatica.
- CAPTCHA real nao deve ser burlado.
- Codigo por e-mail pode ser manual, env, IMAP, Gmail API ou endpoint interno autorizado.
- `test-results/` e `playwright-report/` sao evidencias locais e nao devem ser versionados.
- `.env.local` nunca deve ir para o Git.

## Caminhos importantes

- Catalogo: `docs/CATALOGO_AUTOMACAO.md`
- Mapa: `docs/MAPA_DO_REPOSITORIO.md`
- Regras: `AGENTS.md`
