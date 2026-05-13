# Projeto Demo Playwright - Cidadao Smart

Repositorio de demonstracao de automacao E2E com Playwright, focado em mostrar um fluxo agentico de QA para a Griaule.

## Objetivo da Demo

Mostrar, de ponta a ponta, que um fluxo com IA consegue:
1. ler requisito
2. planejar testes
3. gerar automacao Playwright
4. executar testes
5. salvar evidencia
6. gerar relatorio
7. sugerir correcao tecnica quando falhar

## Escopo Atual

- Agendamento presencial
- Emissao online - captura
- Emissao online - resumo

## Estrutura Principal

- tests/: specs executaveis
- tests/pages/: page objects
- tests/pages/selectors/: seletores
- tests/support/: dados, rotas, timeouts, relatorios
- prompts/: prompts por papel de agente
- specs/: planos de teste gerados
- test-results/: evidencias e relatorios
- docs/: guias e materiais de apresentacao

## Pre-requisitos

- Node.js 18+
- VPN conectada ao ambiente alvo
- URL do Cidadao Smart acessivel

## Configuracao Rapida

1. Instalar dependencias:

```bash
npm install
```

2. Instalar browsers do Playwright:

```bash
npx playwright install
```

3. Criar .env com base no .env.example.

## Conexao de E-mail para Validacao

O fluxo de autenticacao aceita dois modos:

- env: usa codigo fixo em CIDADAO_SMART_SECURITY_CODE
- imap: busca codigo automaticamente no e-mail

Exemplo rapido para IMAP no .env:

```env
CIDADAO_SMART_SECURITY_CODE_SOURCE=imap
CIDADAO_SMART_EMAIL_IMAP_HOST=imap.gmail.com
CIDADAO_SMART_EMAIL_IMAP_PORT=993
CIDADAO_SMART_EMAIL_IMAP_SECURE=true
CIDADAO_SMART_EMAIL_IMAP_USER=seu-email@dominio.com
CIDADAO_SMART_EMAIL_IMAP_PASSWORD=sua-senha-ou-app-password
CIDADAO_SMART_EMAIL_IMAP_MAILBOX=INBOX
CIDADAO_SMART_EMAIL_FROM_FILTER=no-reply@dominio.com
CIDADAO_SMART_EMAIL_CODE_REGEX=\b(\d{6})\b
```

Observacao: nao automatizamos UI do Gmail. A leitura e feita por protocolo IMAP.

## Comandos Principais

```bash
npm run test:list
npm run test:cidadao:agendamento
npm run test:cidadao:emissao:captura
npm run test:cidadao:emissao:resumo
npm run report:testing-company
npm run report:griaule
```

## Regra Critica de Negocio

A validacao de resumo e confirmacao deve refletir o posto efetivamente selecionado no inicio do fluxo.

Se houver divergencia de posto, o teste deve falhar e o resultado deve ser classificado como bug de produto.

## Evidencias

- Artefatos do Playwright: test-results/
- Protocolos gerados: test-results/reports/protocolos-gerados.json
- Relatorios de execucao: test-results/reports/

## Referencias

- Regras para agentes: AGENTS.md
- Guia de execucao: docs/GUIA_DE_EXECUCAO.md
- Estrategia agentica: docs/ESTRATEGIA_AGENTIC_QA.md
