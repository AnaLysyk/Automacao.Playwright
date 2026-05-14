# Automação Playwright - Booking / Cidadao Smart

Repositório  de automação E2E, API e fluxos assistidos para Booking / Cidadao Smart / SMART, com foco em demonstração técnica, regressão funcional e evidencia visual para a Griaule.

## Objetivo

Transformar os fluxos criticos do Cidadao Smart em uma base de QA executavel com Playwright:

- agendamento presencial;
- emissao online;
- consultas;
- Booking Admin;
- integracoes API;
- fluxos assistidos com CAPTCHA e codigo de seguranca.

## Stack

- Playwright
- TypeScript
- Page Object Model
- Agentes de orquestracao
- Configuracao por ambiente via `.env.local`

## Estrutura principal

- `context/requirements/`: regras de negocio, ambientes, known issues e APIs.
- `docs/`: guias de execucao, mapa de testes, estrategia e relatorios.
- `tests/agents/`: agentes que orquestram fluxos, etapas, evidencia e falhas.
- `tests/config/`: leitura de ambiente e known issues.
- `tests/data/`: massa de teste controlada.
- `tests/types/`: contratos compartilhados de execucao.
- `tests/pages/`: Page Objects e seletores.
- `tests/booking/`: automacao publica de Booking/Cidadao Smart.
- `tests/booking-admin/`: validacoes do painel administrativo.
- `tests/api/`: validacoes API e diagnosticos.
- `tests/manual-assisted/`: demos que exigem intervencao humana.
- `legacy/automation-exercise/`: projeto antigo usado como referencia didatica.

## Ambientes

Use `.env.local` para a configuracao real da maquina. Nao versionar senhas, tokens, codigos de seguranca ou credenciais.

Variaveis principais:

```env
TARGET_ENV=146
CIDADAO_SMART_BASE_URL=https://172.16.1.146
BOOKING_ADMIN_BASE_URL=https://172.16.1.146/admin/login
SMART_REACT_URL=http://172.16.1.146:8100/react
CAPTCHA_MODE=manual
EXECUTION_MODE=manual-assisted
CIDADAO_SMART_SECURITY_CODE=
PW_SLOW_MO=300
```

## Comandos

Instalar dependencias:

```bash
npm install
```

Instalar navegadores:

```bash
npx playwright install
```

Listar testes:

```bash
npm run test:list
```

Rodar fluxo assistido de Booking:

```bash
npm run test:booking:assistido
```

Rodar regressao automatica:

```bash
npm run test:all
```

Abrir relatorio HTML:

```bash
npm run report
```

## Fluxos assistidos

Fluxos com CAPTCHA real ou codigo por e-mail ficam em suites assistidas. Eles podem abrir navegador, pausar com `page.pause()` e gerar evidencias por etapa.

Nao burlar CAPTCHA real. Estrategias permitidas:

- `CAPTCHA_MODE=manual`;
- `CAPTCHA_MODE=disabled` somente em QA controlado;
- `CAPTCHA_MODE=test` somente quando oficialmente suportado.

## Evidencias

Artefatos locais:

- `test-results/`;
- `playwright-report/`;
- screenshots;
- videos;
- traces;
- resumos Markdown em `docs/` quando o resultado precisa ir para GitHub.

## Projeto legado

O conteudo antigo do desafio Automation Exercise foi preservado em `legacy/automation-exercise/`. Ele nao faz parte da execucao principal do Booking/Cidadao Smart.

## Referencias

- Regras do agente: `AGENTS.md`
- Guia de execucao: `docs/GUIA_EXECUCAO.md`
- Evidencias: `docs/EVIDENCIAS_E_RELATORIOS.md`
- Mapa de testes: `docs/MAPA_TESTES.md`
