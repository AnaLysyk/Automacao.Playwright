# Automação Playwright — Booking / Cidadão Smart

Repositório de automação com **Playwright** para validação dos fluxos do **Booking**, **Cidadão Smart** e integrações relacionadas ao **SMART**.

O objetivo é organizar uma base de QA executável, rastreável e segura, com testes **E2E**, **API**, **validações assistidas**, evidências visuais e documentação de apoio para análise de falhas, regressão funcional e acompanhamento técnico dos fluxos críticos da Griaule.

## Objetivo

Transformar os fluxos críticos do Booking e do Cidadão Smart em uma base de automação clara, fácil de executar e preparada para evolução.

A automação deve apoiar:

- validações de regressão;
- execução assistida de fluxos com CAPTCHA e código de segurança;
- análise de falhas em ambiente de homologação;
- geração de evidências visuais;
- separação entre testes de UI, API, E2E, Admin e fluxos assistidos;
- documentação do comportamento esperado;
- apoio à tomada de decisão durante validações de release.

## Escopo Inicial

O foco inicial está nos fluxos relacionados ao **Booking consumido pelo Cidadão Smart**, principalmente:

- agendamento presencial;
- busca por cidade ou CEP;
- seleção de posto;
- preenchimento dos dados do requerente;
- seleção de data e horário;
- validação por código de segurança;
- confirmação de agendamento;
- geração de protocolo;
- guia ou comprovante;
- cancelamento, quando disponível;
- consultas;
- Booking Admin;
- integrações API;
- fluxos assistidos com CAPTCHA e validação por e-mail.

Também serão organizados cenários para:

- emissão online;
- Notificador GBDS;
- SMART;
- conferência;
- integrações entre Booking, Cidadão Smart e SMART.

## Stack

- Playwright
- TypeScript
- Page Object Model
- Agentes de orquestração
- Configuração por ambiente via `.env.local`
- Evidências com screenshots, vídeos, traces e relatório HTML
- Organização por contexto, casos de teste, specs e documentação técnica

## Conceito da Arquitetura

A automação é organizada em camadas:

- **Contextos**: explicam regras, ambientes, dependências, known issues e responsabilidades dos módulos.
- **Casos de teste**: descrevem cenários funcionais e regras esperadas.
- **Page Objects**: representam telas e ações específicas da interface.
- **Agentes**: orquestram fluxos maiores, etapas, pausas assistidas, evidências e classificação de falhas.
- **Specs**: executam os testes chamando Page Objects, agentes ou APIs.
- **Evidências**: registram o comportamento observado durante a execução.

A ideia é evitar specs gigantes e manter cada camada com uma responsabilidade clara.

## Estrutura Principal

```text
context/
  requirements/
  test-cases/

docs/

tests/
  agents/
  config/
  data/
  types/
  pages/
  booking/
    public/
    e2e/
    manual-assisted/
  booking-admin/
    read-only/
    write/
  api/
    booking/
    cidadao-smart/
    notifier/
  manual-assisted/

legacy/
  automation-exercise/
```

## Pastas do Projeto

### `context/requirements/`

Contém contexto funcional, regras de negócio, ambientes, known issues, APIs e integrações.

Esses arquivos não substituem casos de teste. Eles explicam o produto e orientam a automação.

### `context/test-cases/`

Contém casos de teste exportados, estruturados ou organizados para apoiar a construção das specs automatizadas.

### `docs/`

Contém guias operacionais e documentos de apoio:

- guia de execução;
- mapa de testes;
- estratégia de automação;
- evidências e relatórios;
- análise de falhas;
- relatórios de auditoria e execução.

### `tests/agents/`

Contém agentes responsáveis por orquestrar fluxos, etapas, evidências e tratamento de falhas.

Exemplos:

- `BookingAgendamentoAssistidoAgent`;
- `CaptchaAgent`;
- `EmailCodeAgent`;
- `EvidenceAgent`;
- `StepAgent`;
- `FailureClassifierAgent`.

### `tests/pages/`

Contém Page Objects e seletores das telas automatizadas.

Page Object conhece tela. Agent orquestra fluxo. Spec deve ficar limpa.

### `tests/booking/`

Contém testes da jornada pública do Booking consumida pelo Cidadão Smart.

### `tests/booking-admin/`

Contém validações do Painel Administrativo do Booking.

Separação esperada:

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

- `146`: desenvolvimento/homologação, usado para testes em andamento, validações novas e automação assistida;
- `201`: produção ou produção-like, usado com cautela, priorizando validações read-only e comparações de comportamento.

Use `.env.local` para configurar a execução real da máquina.

Não versionar:

- senhas;
- tokens;
- credenciais;
- chaves privadas;
- códigos reais de segurança;
- credenciais de VPN;
- credenciais de banco ou servidor;
- dados sensíveis reais.

Exemplo seguro de `.env.local`:

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
- executar etapas automaticamente;
- pausar com `page.pause()`;
- permitir intervenção humana;
- continuar após Resume;
- gerar evidências por etapa.

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

- `KNOWN-POSTO-001`: divergência Top Tower / Aeroporto.

Esse comportamento deve ser registrado como warning, sem bloquear o E2E principal do agendamento enquanto estiver classificado como known issue.

## Referências do Projeto

- Regras do agente: `AGENTS.md`
- Guia de execução: `docs/GUIA_DE_EXECUCAO.md`
- Evidências e relatórios: `docs/EVIDENCIAS_E_RELATORIOS.md`
- Mapa de testes: `docs/MAPA_DE_TESTES.md`
- Estratégia de automação: `docs/ESTRATEGIA_DE_AUTOMACAO.md`
- Guia de análise de falhas: `docs/GUIA_DE_ANALISE_DE_FALHAS.md`
- Relatório de auditoria da fundação: `docs/RELATORIO_DE_AUDITORIA_DA_FUNDACAO.md`
- Contextos funcionais: `context/requirements/`
- Casos de teste: `context/test-cases/`

## Status do Projeto

Este repositório está em evolução para se tornar a base principal de automação do Booking / Cidadão Smart / SMART.

A prioridade atual é:

- manter a fundação organizada;
- configurar ambientes 146 e 201;
- estruturar agentes de automação;
- estabilizar o fluxo assistido de agendamento presencial;
- gerar evidências por etapa;
- separar testes de API, E2E, Admin e manual-assisted;
- evoluir fluxos assistidos para automações completas quando houver suporte de ambiente.

## Autoria

Projeto organizado e evoluído por Ana Paula Lysyk, com foco em qualidade, rastreabilidade, automação funcional e apoio às validações dos fluxos críticos da Griaule.
