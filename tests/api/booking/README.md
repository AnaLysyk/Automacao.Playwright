# API Booking

Testes de integracao das APIs de Booking.

Objetivo: validar postos, agenda, horarios, vagas e diagnosticos usados antes da UI.

## Cobertura atual

- Validacao negativa de abertura de processo pelo Booking.
- Abertura de processo pelo Booking somente com `API_WRITE_ENABLED=true`.
- Contrato esperado: resposta `201` com `protocol` numerico quando a escrita estiver liberada.
