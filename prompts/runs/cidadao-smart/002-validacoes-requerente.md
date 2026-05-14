# Run 002 - Validacoes Requerente

Objetivo: cobrir validacoes principais de campos do requerente.

Execucao sugerida:
- npx playwright test tests/cidadao-smart-agendamento-validacoes.spec.ts --headed

Cobertura:
- Nome com uma palavra.
- CPF vazio permitido.
- Telefone vazio obrigatorio.
- Data menor de 16 anos.
- Data exatamente 16 anos.
- Data maior de 16 anos.
- Data futura invalida.

Observacao:
- Ajustar asserts de mensagem conforme texto oficial do front.
