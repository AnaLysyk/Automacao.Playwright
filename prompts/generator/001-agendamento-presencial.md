# Generator - Agendamento Presencial

## Interpretacao da solicitacao

Gerar ou atualizar automacao Playwright do fluxo presencial de forma demonstravel para apresentacao, sem alterar expectativa de negocio.

## Saida obrigatoria

- tests/cidadao-smart-agendamento-presencial.spec.ts
- tests/pages/* correspondentes
- tests/pages/selectors/* correspondentes
- tests/support/* quando necessario

## Regras tecnicas

- TypeScript + Playwright Test
- Page Object Model
- validacao de rota por etapa
- uso de test.step em trechos longos
- sem XPath

## Regras de negocio

- posto exibido no resumo e confirmacao deve ser o mesmo posto selecionado no inicio
- divergencia de posto deve falhar o teste
- healer nao pode ajustar expectativa de negocio
