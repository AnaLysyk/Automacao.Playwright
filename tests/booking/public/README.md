# [REGRESSAO] Booking public

## Objetivo

Validar telas e comportamentos isolados do agendamento publico.

## Tipo de execucao

Regressao automatica quando o ambiente estiver controlado e sem intervencao humana obrigatoria.

## Comando principal

```bash
npm run test:booking:public
```

## Pode entrar aqui

- `cidadao-smart-agendamento-presencial.spec.ts`
- `cidadao-smart-agendamento-validacoes.spec.ts`
- `cidadao-smart-agendamento-resumo.spec.ts`
- `cidadao-smart-agendamento-autenticacao.spec.ts`

## Nao pode entrar aqui

- Fluxo com CAPTCHA real.
- Codigo de e-mail manual.
- SMART manual.
- 2a via expressa encadeada assistida.
