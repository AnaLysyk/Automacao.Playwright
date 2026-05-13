# Run 001 - Baseline Agendamento Presencial

Objetivo: validar o fluxo principal completo do Cidadao Smart para Top Tower.

Checklist:
1. VPN conectada.
2. URL base acessivel.
3. CAPTCHA em modo manual/QA.
4. Slot de data/horario disponivel.
5. CIDADAO_SMART_SECURITY_CODE definido no ambiente.

Execucao sugerida:
- npx playwright test tests/cidadao-smart-agendamento-presencial.spec.ts --headed

Validacoes-chave:
- Fluxo chega em /agendamentos/novo/confirmacao.
- Texto de confirmacao visivel.
- Protocolo gerado.
- Dados exibidos batem com Top Tower.
