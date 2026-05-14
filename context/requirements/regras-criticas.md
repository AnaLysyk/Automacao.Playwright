# Regras Críticas

Este documento consolida regras que devem orientar a automação Booking / Cidadão Smart / SMART.

## Segurança

- Não versionar senha, token, credencial, chave privada, VPN, código real de segurança ou dado sensível.
- Usar `.env.local` para execução real.
- Manter `.env.example` apenas com placeholders.

## CAPTCHA

- Não burlar CAPTCHA real.
- Usar `CAPTCHA_MODE=manual` para fluxo assistido.
- Usar `CAPTCHA_MODE=disabled` ou `CAPTCHA_MODE=test` apenas quando oficialmente suportado em QA controlado.

## Código de Segurança

- Não automatizar UI do Gmail.
- Usar `CIDADAO_SMART_SECURITY_CODE` ou preenchimento manual enquanto não houver integração autorizada.

## Fluxos Assistidos

Fluxos com CAPTCHA, código por e-mail ou intervenção humana devem ficar em:

```text
tests/booking/manual-assisted/
tests/manual-assisted/
```

## Posto Selecionado

Resumo e confirmação devem refletir o posto selecionado.

Se aparecer divergência não mapeada, classificar como falha de produto ou configuração.
