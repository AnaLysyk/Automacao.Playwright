# Status atual da automacao

Status revisado em 2026-05-15.

## Aprovado / funcionando

- `[REGRESSAO]` Emissao Online basica em regressao controlada.
- `[ASSISTIDO]` 2a via expressa assistida com geracao de protocolo e evidencia.

Evidencia recente:

- `npm run typecheck`: passou.
- `npm run test:list`: passou e encontrou 495 testes em 29 arquivos.
- `npx playwright test tests/emissao-online --project=chromium`: 3 passaram e 6 foram ignorados pela propria suite.

## Em estabilizacao

- `[ASSISTIDO]` 2a via com alteracoes.
- `[ASSISTIDO]` Reenvio apos rejeicao parcial.
- `[POC]` Captura/fake video.
- `[ASSISTIDO]` E2E Booking + SMART + Cidadao.
- `[REGRESSAO]` E2E com dependencias de agenda, massa e ambiente.

## Pendente

- Organizacao final das pastas.
- Separacao definitiva de assistido x automatico.
- Correcao de imports quebrados em API, se houver nova ocorrencia.
- Revisao recorrente de pastas vazias.
- Padronizacao dos nomes dos testes.
- Revisao de scripts que misturam regressao e fluxos em estabilizacao.

## Regras de leitura

- Fluxo assistido nao e regressao automatica.
- CAPTCHA real nao deve ser burlado.
- Codigo por e-mail pode ser manual, env, IMAP, Gmail API ou endpoint interno autorizado.
- `test-results/` e `playwright-report/` sao evidencias locais e nao devem ser versionados.
- `.env.local` nunca deve ir para o Git.

## Proxima etapa recomendada

Manter os testes onde estao e melhorar leitura, README e classificacao.

Mover specs fisicamente deve ser uma etapa separada, com atualizacao de imports, scripts e validacao completa.

