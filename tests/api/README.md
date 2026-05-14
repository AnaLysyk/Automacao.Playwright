# API

Esta pasta contém validações de API, contratos, payloads e diagnósticos de integração do Booking / Cidadão Smart / SMART.

Ela não deve conter fluxo visual de UI nem depender de CAPTCHA, e-mail ou intervenção manual.

## Estrutura Esperada

```text
tests/api/
  booking/
  cidadao-smart/
  notifier/
```

## Responsabilidade

- Validar status HTTP.
- Validar estrutura de resposta.
- Validar contrato de payload.
- Validar regras de segurança, como não expor CPF em texto puro.
- Apoiar diagnóstico de ambiente e integração.

## Comandos

Rodar todas as APIs:

```bash
npm run test:api
```

Rodar API Booking:

```bash
npm run test:api:booking
```

Rodar API Cidadão Smart:

```bash
npm run test:api:cidadao-smart
```

Rodar Notifier:

```bash
npm run test:api:notifier
```

## Segurança

Não versionar tokens, chaves, credenciais ou payloads reais sensíveis.

Use `.env.local` para execução local e `.env.example` apenas como referência de variáveis.

## Maturidade

Testes de API devem ser candidatos naturais a CI, desde que não alterem estado crítico e não dependam de dados instáveis.
