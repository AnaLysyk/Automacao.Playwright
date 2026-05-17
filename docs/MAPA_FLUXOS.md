# Mapa de Fluxos

## Booking

### CI/CD automático

- `tests/api/booking/agendamento/agendamento.spec.ts`

Fluxo validado:

- Criar agendamento
- Consultar agendamento
- Cancelar agendamento
- Consultar novamente
- Validar status final
- Validar liberação do slot quando aplicável

Objetivo:

Smoke/sanity de CI para validar criação, persistência, cancelamento e consistência do agendamento sem depender de tela, CAPTCHA ou e-mail real.

---

## Cidadão Smart

### CI/CD automático

- `tests/api/cidadao-smart/via-expressa/via-expressa.spec.ts`

Fluxo validado:

- Buscar CPF com processo finalizado
- Validar elegibilidade
- Criar solicitação de via expressa
- Consultar processo/protocolo criado
- Validar status e payload final

Observação:

Rollback técnico ou limpeza da massa deve rodar somente quando existir endpoint seguro e configurado para ambiente de teste.

---

## UI assistida

Fluxos que devem permanecer fora do smoke autônomo de CI:

- `tests/fluxos-assistidos/booking/agendamento-presencial/`
- `tests/fluxos-assistidos/cidadao-smart/emissao-expressa/fluxo-assistido/`
- `tests/fluxos-assistidos/cidadao-smart/emissao-expressa/emissao-online/`
- `tests/fluxos-assistidos/cidadao-smart/emissao-expressa/consulta-pedido/`

A UI assistida deve ser usada quando houver valor real de tela, validação visual, comportamento de navegador, câmera, Captury, CAPTCHA ou código por e-mail.

CAPTCHA, Captury e código por e-mail não entram como smoke autônomo de CI.

---

## Regra de decisão

- API passou + UI passou = fluxo saudável
- API passou + UI falhou = provável problema no front
- API falhou + UI falhou = provável problema no back, regra ou integração
- API falhou + UI passou = alerta de inconsistência ou caminho diferente usado pela UI