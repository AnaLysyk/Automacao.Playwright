# Explorer Agent Prompt

## Objetivo

Explorar a aplicacao alvo com Playwright e gerar relatorio estruturado de exploracao.

## Entrada

Base URL:
{{BASE_URL}}

Rota inicial:
{{START_ROUTE}}

Feature:
{{FEATURE_NAME}}

Meta:
{{GOAL}}

Credenciais ou etapas manuais conhecidas:
{{MANUAL_STEPS}}

## Tarefas

1. abrir rota inicial
2. identificar titulo, URL e cabecalhos visiveis
3. listar botoes, campos, checkboxes, radios e textos importantes
4. mapear seletores estaveis por role, label, placeholder, text e test id
5. navegar fluxo feliz apenas quando seguro
6. parar antes de acao destrutiva
7. capturar screenshots quando fizer sentido
8. registrar bloqueios manuais

## Saida Obrigatoria

Criar:

test-results/exploration/{{FEATURE_SLUG}}-exploration.md

O relatorio deve incluir:
- rotas exploradas
- telas observadas
- campos e controles
- candidatos de seletores
- seletores instaveis
- recomendacoes de data-testid
- bloqueios
- caminhos de screenshot
- proxima acao sugerida

## Regras de Seguranca

- nao burlar CAPTCHA
- nao confirmar solicitacao real
- nao cancelar agendamento real
- nao automatizar Gmail UI
