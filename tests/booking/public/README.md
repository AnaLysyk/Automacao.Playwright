# Booking Public

Suites automaticas da area publica do Cidadao Smart / Booking.

Objetivo: validar telas e comportamentos isolados do agendamento publico, usando massa controlada e configuracao por `.env.local`.

Testes atuais:

- `cidadao-smart-agendamento-presencial.spec.ts`
- `cidadao-smart-agendamento-validacoes.spec.ts`
- `cidadao-smart-agendamento-resumo.spec.ts`
- `cidadao-smart-agendamento-autenticacao.spec.ts`

Nao colocar aqui specs que dependam de intervencao humana obrigatoria. Fluxos com CAPTCHA real ou codigo de e-mail manual devem ficar em `tests/booking/manual-assisted/`.
