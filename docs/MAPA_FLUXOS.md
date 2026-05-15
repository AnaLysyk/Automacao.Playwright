# Mapa de Fluxos

## Booking

- `tests/booking/agendamento-presencial/`
- Fluxo assistido principal para agendamento presencial.
- Usa CAPTCHA manual/bypass oficial e validacao de e-mail isolada.

## Cidadao Smart

- `tests/cidadao-smart/emissao-online/`
- `tests/cidadao-smart/consulta-pedido/`

## APIs de apoio

- `tests/api/booking/`
- `tests/api/cidadao-smart/`
- `tests/api/smart/`

As APIs apoiam massa, consulta de protocolo, agendamento e status. Elas nao substituem o E2E pela interface.
