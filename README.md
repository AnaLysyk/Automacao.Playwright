# Projeto Demo Playwright - Cidadao Smart

Repositório de demonstração de automação E2E com Playwright para o Cidadão Smart, com foco em validação técnica e apresentação para a Griaule.

## Objetivo da Demo

Mostrar, de ponta a ponta, que um fluxo estruturado de QA consegue:
1. ler requisito
2. planejar testes
3. gerar automação Playwright
4. executar testes
5. salvar evidência
6. gerar relatório
7. sugerir correção técnica quando houver falha

## Escopo Atual

- Agendamento presencial
- Emissao online - captura
- Emissao online - resumo

## Estrutura Principal

- tests/: specs executaveis
- tests/pages/: page objects
- tests/pages/selectors/: seletores
- tests/support/: dados, rotas, timeouts, relatorios
- prompts/: prompts de execução
- specs/: planos de teste gerados
- test-results/: evidências e relatórios
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

- Regras de execução: AGENTS.md
- Guia de execucao: docs/GUIA_DE_EXECUCAO.md
- Estratégia de QA: docs/ESTRATEGIA_QA.md
