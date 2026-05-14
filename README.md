# Automação Playwright - Booking / Cidadão Smart

Repositório de automação E2E, API e fluxos assistidos para Booking / Cidadão Smart / SMART, com foco em qualidade, rastreabilidade, automação funcional e apoio às validações dos fluxos críticos da Griaule.

## Objetivo

Este repositório está em evolução para se tornar a base principal de automação do Booking / Cidadão Smart / SMART.

A prioridade inicial é:

- organizar a fundação do projeto;
- configurar ambientes 146 e 201;
- estruturar agentes de automação;
- estabilizar o fluxo assistido de agendamento presencial;
- gerar evidências por etapa;
- separar testes de API, E2E, Admin e manual-assisted;
- evoluir fluxos assistidos para automações completas quando houver suporte de ambiente.

## Estrutura do Projeto

### `context/requirements/`

Contém documentos de contexto funcional, regras de negócio, ambientes, known issues, APIs e integrações.

Exemplos:

- ambientes e acessos;
- agendamento presencial;
- Booking Admin;
- API Cidadão Smart / Booking;
- Notificador GBDS;
- SMART / Conferência;
- regras críticas;
- known issues.

Esses arquivos não substituem casos de teste. Eles explicam o funcionamento do produto e orientam a automação.

### `context/test-cases/`

Contém casos de teste exportados, estruturados ou organizados para apoiar a construção das specs automatizadas.

### `docs/`

Contém guias operacionais do projeto:

- guia de execução;
- mapa de testes;
- estratégia de automação;
- evidências e relatórios;
- análise de falhas.

### `tests/agents/`

Contém agentes responsáveis por orquestrar fluxos, etapas, evidências e tratamento de falhas.

Exemplos:

- `BookingAgendamentoAssistidoAgent`;
- `CaptchaAgent`;
- `EmailCodeAgent`;
- `EvidenceAgent`;
- `StepAgent`;
- `FailureClassifierAgent`.

### `tests/config/`

Contém leitura de ambiente, configuração de execução e registro de known issues.

### `tests/data/`

Contém massas controladas para execução dos testes.

### `tests/types/`

Contém contratos e tipos compartilhados pela automação.

### `tests/pages/`

Contém Page Objects e seletores das telas automatizadas.

### `tests/booking/`

Contém testes da jornada pública do Booking consumida pelo Cidadão Smart.

### `tests/booking-admin/`

Contém validações do Painel Administrativo do Booking.

Deve ser separado em:

- `read-only`: testes que apenas consultam informações;
- `write`: testes que alteram configuração e exigem ambiente controlado.

### `tests/api/`

Contém validações de API, contratos, payloads e diagnósticos de integração.

### `tests/manual-assisted/`

Contém fluxos assistidos que exigem intervenção humana, como CAPTCHA real ou código de segurança enviado por e-mail.

### `legacy/automation-exercise/`

Contém o projeto antigo usado como referência didática de Playwright.

Esse conteúdo não faz parte da execução principal do Booking / Cidadão Smart.

## Ambientes

A automação deve ser executada usando configuração por ambiente.

Principais ambientes:

- `146`: ambiente de desenvolvimento/homologação, usado para testes em andamento, validações novas e automação assistida;
- `201`: ambiente produção ou produção-like, usado com mais cautela, priorizando validações read-only e comparações de comportamento.

Use `.env.local` para configurar a execução real da máquina.

Não versionar:

- senhas;
- tokens;
- credenciais;
- chaves privadas;
- códigos reais de segurança;
- credenciais de VPN;
- credenciais de banco ou servidor.

Exemplo de `.env.local`:

```env
TARGET_ENV=146

CIDADAO_SMART_BASE_URL=https://172.16.1.146
BOOKING_ADMIN_BASE_URL=https://172.16.1.146/admin/login
SMART_REACT_URL=http://172.16.1.146:8100/react

CAPTCHA_MODE=manual
EXECUTION_MODE=manual-assisted
CIDADAO_SMART_SECURITY_CODE=

PW_SLOW_MO=300
EVIDENCE_DIR=test-results
```

## Comandos Principais

Instalar dependências:

```bash
npm install
```

Instalar navegadores do Playwright:

```bash
npx playwright install
```

Listar testes disponíveis:

```bash
npm run test:list
```

Rodar fluxo assistido de Booking:

```bash
npm run test:booking:assistido
```

Rodar em modo debug:

```bash
npm run test:booking:debug
```

Rodar regressão automatizada:

```bash
npm run test:all
```

Abrir relatório HTML:

```bash
npm run report
```

## Fluxos Assistidos

Alguns fluxos não devem ser tratados como automação 100% autônoma enquanto dependerem de barreiras externas, como:

- CAPTCHA real;
- código de segurança enviado por e-mail;
- ação manual obrigatória.

Esses fluxos devem ser classificados como `manual-assisted`.

Nesse modo, a automação pode:

- abrir o navegador;
- executar as etapas automaticamente;
- pausar com `page.pause()`;
- permitir intervenção humana;
- continuar após Resume;
- gerar evidências por etapa.

## CAPTCHA

CAPTCHA real não deve ser burlado.

Estratégias permitidas:

- `CAPTCHA_MODE=manual`: resolução manual durante execução;
- `CAPTCHA_MODE=disabled`: apenas em ambiente QA controlado;
- `CAPTCHA_MODE=test`: apenas quando oficialmente suportado.

## Código de Segurança

Enquanto não existir integração controlada com e-mail, o código pode ser tratado por:

- variável de ambiente;
- preenchimento manual;
- futura integração com Gmail API/OAuth;
- endpoint interno de QA;
- leitura autorizada de logs;
- mock/fake provider em ambiente controlado.

## Evidências

A automação deve gerar evidências para facilitar análise e rastreabilidade.

Artefatos esperados:

- screenshots;
- vídeos;
- traces;
- relatório HTML;
- resumo da execução em Markdown;
- logs de etapa;
- classificação de falha;
- registro de known issues.

Diretórios esperados:

- `test-results/`;
- `playwright-report/`.

O relatório HTML pode ser aberto com:

```bash
npm run report
```

## Classificação de Falhas

Quando um teste falhar, a análise deve buscar classificar a causa provável.

Categorias sugeridas:

- falha de produto;
- falha de automação;
- falha de ambiente;
- falha de massa;
- falha de configuração;
- falha de permissão;
- falha de integração;
- agenda indisponível;
- bloqueio por CAPTCHA;
- bloqueio por código de e-mail;
- known issue.

O objetivo é evitar que todo erro seja tratado automaticamente como bug do produto.

## Known Issues

Known issues são comportamentos conhecidos que podem aparecer durante a execução e que não devem quebrar o fluxo principal quando já estiverem mapeados.

Exemplo atual:

- `KNOWN-POSTO-001`: Divergência Top Tower / Aeroporto.

Esse comportamento deve ser registrado como warning, sem bloquear o E2E principal do agendamento enquanto estiver classificado como known issue.

## Projeto Legado

O conteúdo antigo do desafio Automation Exercise foi preservado em:

```text
legacy/automation-exercise/
```

Ele serve apenas como referência didática de Playwright e não faz parte da execução principal do Booking / Cidadão Smart.

## Referências do Projeto

- Regras do agente: `AGENTS.md`
- Guia de execução: `docs/GUIA_DE_EXECUCAO.md`
- Evidências e relatórios: `docs/EVIDENCIAS_E_RELATORIOS.md`
- Mapa de testes: `docs/MAPA_DE_TESTES.md`
- Guia de análise de falhas: `docs/GUIA_DE_ANALISE_DE_FALHAS.md`
- Contextos funcionais: `context/requirements/`
- Casos de teste: `context/test-cases/`

## Autoria

Projeto organizado e evoluído por Ana Paula Lysyk, com foco em qualidade, rastreabilidade, automação funcional e apoio às validações dos fluxos críticos da Griaule.
