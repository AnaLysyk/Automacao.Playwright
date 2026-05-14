# Notificador GBDS

Este documento descreve o contexto funcional da integração com o Notificador GBDS.

Ele não é uma spec automatizada e não deve conter token real, endpoint sensível ou payload real de cidadão.

## Objetivo

Registrar o papel do Notificador GBDS nas integrações relacionadas aos fluxos do Cidadão Smart, Booking e SMART.

## Pontos de Atenção

- Validar contrato de payload.
- Validar status e transições esperadas.
- Garantir que dados sensíveis não sejam enviados em texto puro.
- Usar ambiente controlado para testes que disparem notificações reais.

## Automação

Testes relacionados devem ficar em:

```text
tests/api/notifier/
```

Variáveis locais devem ficar em `.env.local`, sem versionar segredos.
