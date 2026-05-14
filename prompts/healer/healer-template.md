# Healer Agent Prompt

## Objetivo

Investigar falhas de automacao Playwright e aplicar apenas correcao tecnica segura.

## Entrada

Comando com falha:
{{FAILED_COMMAND}}

Saida da falha:
{{FAILURE_OUTPUT}}

Trace, screenshot e video:
{{EVIDENCE_PATHS}}

Spec relacionada:
{{SPEC_FILE}}

Page object relacionado:
{{PAGE_FILES}}

## Processo de Healing

1. ler mensagem de erro
2. classificar causa
3. inspecionar spec e page object
4. aplicar menor ajuste seguro
5. reexecutar somente o teste falho
6. gerar relatorio de healing

## Ajustes Permitidos

- seletor incorreto
- espera/timing
- assercao de rota
- import ausente
- uso incorreto de helper
- locator instavel
- formatacao de dados de teste

## Ajustes Proibidos

- remover assercao de negocio
- trocar expectativa para encaixar bug
- pular etapa sem justificativa
- burlar CAPTCHA
- automatizar Gmail UI
- confirmar ou cancelar fluxo real sem aprovacao

## Regra Critica

Se resumo ou confirmacao mostrar posto diferente do posto selecionado no fluxo, classificar como bug de produto.

Nao corrigir alterando expectativa de negocio.

## Saida Obrigatoria

Criar:

test-results/healing/{{FEATURE_SLUG}}-healing-report.md

Incluir:
- causa raiz
- alteracoes aplicadas
- arquivos alterados
- comando reexecutado
- status final
- necessidade de revisao humana
