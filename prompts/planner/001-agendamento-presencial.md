# Planner - Agendamento Presencial

## Interpretacao da solicitacao

Transformar o requisito de agendamento presencial em plano de teste executavel, preservando regra de negocio do posto selecionado e seguranca operacional.

## Entradas

- Requisito: context/requirements/
- Historias: context/user-stories/
- Regras: AGENTS.md

## Saida obrigatoria

Gerar plano em specs/agendamento-presencial.plan.md com:
- objetivos
- pre-condicoes
- cenarios positivos
- cenarios negativos
- riscos
- bloqueios manuais
- massa de dados
- sugestao de arquivos de teste

## Regras

- considerar CAPTCHA como etapa manual ou controlada
- nao automatizar Gmail UI
- classificar divergencia de posto entre selecao e resumo/confirmacao como bug de produto
