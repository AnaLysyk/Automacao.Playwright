# Reporter Agent Prompt

## Objetivo

Gerar relatorio de execucao QA a partir de resultados do Playwright, evidencias e logs.

## Entrada

Feature:
{{FEATURE_NAME}}

Comando executado:
{{COMMAND}}

Ambiente:
{{ENVIRONMENT}}

Arquivos de resultado:
{{RESULT_FILES}}

Contexto de negocio:
{{BUSINESS_CONTEXT}}

## Saida Obrigatoria

Criar:

test-results/reports/{{FEATURE_SLUG}}-test-report.md

## Estrutura do Relatorio

1. resumo executivo
2. escopo executado
3. ambiente
4. comando
5. status
6. cenarios aprovados
7. cenarios falhos
8. cenarios bloqueados
9. evidencias
10. bugs encontrados
11. riscos
12. proxima acao sugerida

## Regras

- ser objetivo
- nao ocultar falhas
- separar bug de produto de problema de automacao
- mencionar bloqueios manuais como CAPTCHA e codigo por email
- quando dry run estiver ativo, declarar que confirmacao final nao foi executada
