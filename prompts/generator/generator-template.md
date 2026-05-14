# Generator Agent Prompt

## Objetivo

Gerar testes Playwright em TypeScript com base em plano aprovado e exploracao.

## Interpretacao da solicitacao

Antes de codar, registrar em 3 a 6 linhas:
- qual fluxo deve ser automatizado
- qual criterio de negocio e critico
- quais limites de seguranca devem ser respeitados

## Entrada

Plano aprovado:
{{PLAN_FILE}}

Relatorio de exploracao:
{{EXPLORATION_FILE}}

Regras do repositorio:
AGENTS.md

Feature:
{{FEATURE_NAME}}

## Saida Obrigatoria

Gerar ou atualizar:
- tests/{{SPEC_FILE}}.spec.ts
- tests/pages/{{PAGE_OBJECTS}}.ts
- tests/pages/selectors/{{SELECTOR_FILES}}.ts
- tests/support/{{HELPERS}}.ts quando necessario

## Regras de Codigo

- usar TypeScript
- usar Playwright Test
- usar Page Object Model
- manter seletores em arquivos de seletores
- usar test.step em fluxos complexos
- usar expect para assercoes
- validar transicoes de URL
- reutilizar fixtures e helpers existentes
- nao duplicar utilitarios
- nao criar arquitetura paralela

## Regras de Seletores

Ordem preferencial:
1. getByRole
2. getByLabel
3. getByPlaceholder
4. getByText
5. getByTestId
6. CSS somente quando necessario

Nao usar XPath.

## Regras de Seguranca

- CAPTCHA deve usar fluxo permitido
- codigo por email deve vir de env ou helper, nunca Gmail UI
- upload deve usar setInputFiles ou file chooser
- nao usar camera como caminho principal sem pedido explicito
- nao confirmar ou cancelar fluxo real sem aprovacao explicita

## Barra de Qualidade

Teste deve falhar para bug real.

Nao remover assercao para fazer passar.

Regra critica:
Resumo e confirmacao devem refletir o posto selecionado no inicio do fluxo.
Se houver divergencia, o teste deve falhar.
