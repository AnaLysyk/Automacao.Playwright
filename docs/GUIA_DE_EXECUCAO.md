# Guia de Execução

Este guia explica como preparar o ambiente e executar a automação Booking / Cidadão Smart / SMART.

Ele não substitui casos de teste. Casos estruturados ficam em `context/test-cases/`, Qase ou CDS. Specs executáveis ficam em `tests/`.

## Pré-requisitos

- Node.js 18 ou superior.
- npm instalado.
- Navegadores do Playwright instalados.
- VPN conectada quando o ambiente interno for usado.
- `.env.local` configurado na máquina.

## Instalação

```bash
npm install
npx playwright install
```

## Configuração Local

Crie `.env.local` a partir de `.env.example`.

Exemplo seguro:

```env
TARGET_ENV=146

CIDADAO_SMART_BASE_URL=https://172.16.1.146
BOOKING_ADMIN_BASE_URL=https://172.16.1.146/admin/login
SMART_REACT_URL=http://172.16.1.146:8100/react
SMART_BASE_URL=http://172.16.1.146:8100/react

CAPTCHA_MODE=manual
EXECUTION_MODE=manual-assisted
CIDADAO_SMART_SECURITY_CODE=

PW_SLOW_MO=300
EVIDENCE_DIR=test-results

BOOKING_ADMIN_USER=
BOOKING_ADMIN_PASSWORD=
API_BASE_URL=
API_TOKEN=
```

Nunca versionar `.env`, `.env.local`, senhas, tokens, códigos reais de segurança, credenciais de VPN ou dados sensíveis.

## Comandos Principais

Listar testes disponíveis:

```bash
npm run test:list
```

Rodar todos os testes automáticos principais:

```bash
npm run test:all
```

Rodar Booking assistido:

```bash
npm run test:booking:assistido
```

Rodar Booking assistido em debug:

```bash
npm run test:booking:debug
```

Rodar Booking público:

```bash
npm run test:booking:public
```

Rodar Booking E2E:

```bash
npm run test:booking:e2e
```

Rodar Admin read-only:

```bash
npm run test:admin:readonly
```

Rodar API Booking:

```bash
npm run test:api:booking
```

Abrir relatório HTML:

```bash
npm run report
```

## Fluxos Assistidos

Fluxos com CAPTCHA real, código por e-mail ou intervenção humana devem ficar em modo `manual-assisted`.

Esses fluxos podem:

- abrir navegador em modo visual;
- pausar com `page.pause()`;
- aguardar a ação humana;
- continuar após Resume;
- gerar evidências por etapa.

CAPTCHA real não deve ser burlado.

## Evidências

Os artefatos ficam em:

- `test-results/`;
- `playwright-report/`.

Artefatos esperados:

- screenshots;
- vídeos;
- traces;
- resumo Markdown da execução quando aplicável;
- logs de etapa;
- classificação de falha.

## Quando Uma Execução Falhar

1. Verifique VPN e URL do ambiente.
2. Confirme se `.env.local` está correto.
3. Abra o HTML report com `npm run report`.
4. Consulte `docs/GUIA_DE_ANALISE_DE_FALHAS.md`.
5. Classifique a falha antes de tratá-la como bug de produto.

## Referências

- `AGENTS.md`
- `docs/MAPA_DE_TESTES.md`
- `docs/EVIDENCIAS_E_RELATORIOS.md`
- `docs/GUIA_DE_ANALISE_DE_FALHAS.md`
- `context/requirements/`
