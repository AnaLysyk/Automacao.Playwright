# Mapa de Fluxos

## Booking

- `tests/api/booking/agendamento.spec.ts`
- Cria agendamento, consulta, cancela e valida status final.
- Objetivo: smoke/sanity de CI para criacao, persistencia e cancelamento.

## Cidadao Smart

- `tests/api/cidadao-smart/via-expressa.spec.ts`
- Busca CPF com processo finalizado, valida elegibilidade, cria via expressa e consulta processo.
- Cancelamento roda apenas se houver endpoint seguro configurado.

## UI assistida

- `tests/booking/agendamento-presencial/`
- `tests/cidadao-smart/emissao-online/`
- `tests/cidadao-smart/consulta-pedido/`

UI e usada quando ha valor real de tela ou execucao assistida. CAPTCHA, Captury e codigo por e-mail nao entram como smoke autonomo de CI.
