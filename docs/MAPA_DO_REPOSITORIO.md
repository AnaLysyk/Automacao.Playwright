# Mapa do repositorio

Este mapa mostra como o repositorio esta organizado hoje e o que cada area deve receber.

Prioridade desta etapa:

1. Nao quebrar execucao.
2. Melhorar entendimento.
3. Documentar o que existe.
4. So depois pensar em mover arquivos.

## Legenda visual

- `[REGRESSAO]`: automatico, sem intervencao humana.
- `[ASSISTIDO]`: precisa de QA no fluxo, CAPTCHA, codigo, e-mail ou SMART manual.
- `[POC]`: experimento tecnico.
- `[LEGACY]`: referencia antiga.
- `[SUPPORT]`: helper, massa, relatorio ou utilitario.

## Diagnostico atual

Pastas principais do repositorio:

- `.github`
- `.runtime`
- `.vscode`
- `context`
- `docs`
- `fixtures`
- `legacy`
- `prompts`
- `scripts`
- `specs`
- `tests`

Pastas de saida local, ignoradas ou temporarias:

- `node_modules`
- `playwright-report`
- `test-results`

Pastas com testes reais em `tests/`:

- `tests/2via`: 2 specs.
- `tests/api`: 2 specs.
- `tests/booking`: 7 specs.
- `tests/booking-admin`: 2 specs.
- `tests/consulta`: 2 specs.
- `tests/e2e`: 4 specs.
- `tests/emissao-online`: 5 specs.
- `tests/manual-assisted`: 2 specs.
- `tests/poc`: 1 spec.
- `tests/smart`: 2 specs.

Pastas de suporte, sem specs:

- `tests/agents`
- `tests/config`
- `tests/data`
- `tests/helpers`
- `tests/pages`
- `tests/providers`
- `tests/support`
- `tests/types`

Pastas so com README ou documentacao:

- `tests/cidadao-smart`
- `tests/smoke`

Pastas vazias locais:

- Nenhuma pasta vazia relevante fora de `node_modules` apos a limpeza.

Documentacao duplicada ou historica:

- Documentos soltos da raiz foram preservados em `docs/archive/raiz/`.
- O ponto de entrada atual da documentacao e `docs/INDICE_NAVEGACAO.md`.

## Onde ficam os testes automaticos

Use como regressao automatica apenas fluxos sem intervencao humana obrigatoria.

- `[REGRESSAO] tests/booking/public`
- `[REGRESSAO] tests/emissao-online`
- `[REGRESSAO] tests/consulta`
- `[REGRESSAO] tests/2via`
- `[REGRESSAO] tests/api`
- `[REGRESSAO] tests/booking-admin/read-only`

Observacao: `tests/e2e` ainda mistura cenarios de investigacao e estabilizacao. Use com criterio.

## Onde ficam os testes assistidos

Fluxos assistidos dependem de QA, CAPTCHA, codigo por e-mail, SMART manual ou fluxo encadeado.

- `[ASSISTIDO] tests/booking/manual-assisted`
- `[ASSISTIDO] tests/manual-assisted`
- `[ASSISTIDO] tests/smart/write`

O fluxo de 2a via expressa encadeada fica hoje em:

```text
tests/booking/manual-assisted/cidadao-smart-2via-expressa-protocolo-finalizado.spec.ts
```

Ele nao deve ser tratado como regressao automatica enquanto depender de CAPTCHA, e-mail ou acao manual.

## Onde ficam Page Objects

- `[SUPPORT] tests/pages`
- `[SUPPORT] tests/pages/selectors`

Page Object representa tela. Nao deve concentrar fluxo completo, classificacao de falha ou regra de negocio grande.

## Onde ficam agentes

- `[SUPPORT] tests/agents`

Agents orquestram fluxo, pausas, evidencias, CAPTCHA, codigo por e-mail, known issues e classificacao de falhas.

## Onde ficam massas de dados

- `[SUPPORT] tests/data`
- `[SUPPORT] tests/support/data`
- `[SUPPORT] fixtures`

Nao versionar dados sensiveis, documentos reais, credenciais, codigos reais ou massa protegida.

## Onde ficam helpers

- `[SUPPORT] tests/helpers`
- `[SUPPORT] tests/support`
- `[SUPPORT] tests/providers`
- `[SUPPORT] scripts`

Helpers devem apoiar a automacao sem esconder regra de produto dentro de utilitario generico.

## Onde ficam relatorios e evidencias

Gerados localmente:

- `test-results/`
- `playwright-report/`

Geradores e suporte:

- `tests/support/reports`
- `npm run report`
- `npm run report:testing-company`
- `npm run report:griaule`

Nao versionar evidencias locais, videos, traces, screenshots sensiveis ou logs com credenciais.

## Scripts por finalidade

Validacao rapida:

- `npm run typecheck`
- `npm run test:list`

Regressao e smoke:

- `npm run test:regressao`
- `npm run test:all`
- `npm run test:ci`
- `npm run test:smoke`

Booking e agendamento:

- `npm run test:booking:public`
- `npm run test:agendamento`
- `npm run test:agendamento:local`
- `npm run test:agendamento:data-hora`
- `npm run test:agendamento:validacoes`

Fluxos assistidos:

- `npm run test:booking:assistido`
- `npm run test:2via:expressa:encadeada`
- `npm run test:2via:alteracao-nome`
- `npm run test:smart:finalizar`
- `npm run test:e2e:booking-smart-alteracao-nome`
- `npm run test:e2e:booking-smart-2via`

Mobile assistido:

- `npm run test:booking:assistido:mobile`
- `npm run test:2via:expressa:mobile`

Areas especificas:

- `npm run test:emissao`
- `npm run test:consulta`
- `npm run test:2via`
- `npm run test:api`
- `npm run test:admin:readonly`
- `npm run test:admin:write`

POC e suporte:

- `npm run test:captura:poc`
- `npm run media:fake-video`
- `npm run email:qa:check`

Relatorios:

- `npm run report`
- `npm run report:testing-company`
- `npm run report:griaule`

## Comandos do dia a dia

```bash
npm run typecheck
npm run test:list
npx playwright test tests/emissao-online --project=chromium
npm run test:2via:expressa:encadeada
npm run report
```

## Comandos que nao devem rodar em CI sem revisao

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

## Em estabilizacao

- Separacao definitiva de assistido x automatico.
- 2a via com alteracoes.
- Reenvio apos rejeicao parcial.
- Captura/fake video.
- E2E Booking + SMART + Cidadao.
- Revisao de scripts que apontam para pastas sem specs especificas.
- Padronizacao gradual de nomes de testes.

