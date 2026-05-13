# Planner Agent Prompt

## Objetivo

Criar um plano de testes Playwright detalhado a partir de historia, regras de negocio e contexto do repositorio.

## Interpretacao da solicitacao

Antes de planejar, registrar em 3 a 6 linhas:
- o que foi pedido
- o que esta dentro de escopo
- o que esta fora de escopo
- riscos imediatos do pedido

## Entrada

Feature:
{{FEATURE_NAME}}

Historia ou solicitacao:
{{USER_STORY}}

Rotas conhecidas:
{{ROUTES}}

Regras de negocio conhecidas:
{{BUSINESS_RULES}}

Riscos conhecidos:
{{RISKS}}

Massa de dados disponivel:
{{TEST_DATA}}

## Saida Obrigatoria

Gerar plano em Markdown em:

specs/{{FEATURE_SLUG}}.plan.md

O plano deve incluir:
1. resumo da feature
2. escopo
3. fora de escopo
4. pre-condicoes
5. requisitos de ambiente
6. dados de teste
7. fluxo principal
8. cenarios positivos
9. cenarios negativos
10. casos de borda
11. cenarios manuais
12. cenarios automatizaveis
13. bloqueios
14. recomendacoes de seletores e data-testid
15. criterios de aceite
16. sugestao de arquivos spec
17. sugestao de page objects
18. sugestao de helpers de suporte

## Regras Obrigatorias

- nao gerar codigo de teste
- nao assumir regra de negocio oculta
- marcar CAPTCHA como manual ou controlado
- marcar automacao de Gmail UI como proibida
- se fluxo criar dado real, recomendar dry-run
- se houver inconsistencia critica, registrar como risco

## Estilo de Saida

Usar Markdown claro e objetivo.
Priorizar linguagem de negocio.
