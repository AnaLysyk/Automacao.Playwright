# Booking - Automacao Assistida

Esta suite executa o fluxo E2E assistido do Booking / Agendamento Presencial consumido pelo Cidadao Smart.

## Por que e assistida?

O fluxo ainda pode exigir:

- CAPTCHA manual;
- codigo de verificacao enviado por e-mail.

Enquanto esses pontos dependerem de intervencao humana, esta suite nao deve rodar em CI.

## Como rodar

```powershell
npm run test:booking:assistido
```

Modo debug:

```powershell
npm run test:booking:debug
```

## O que valida

- localizacao;
- selecao de posto;
- dados do requerente;
- data disponivel;
- horario disponivel;
- resumo;
- codigo de seguranca;
- confirmacao;
- protocolo quando o fluxo nao estiver em dry run.

## Evidencias

As evidencias ficam em:

```text
test-results/booking/manual-assisted/<data-hora>/
```

Cada execucao gera screenshots por etapa e `resumo-execucao.md`.

## Seguranca

Se `CIDADAO_SMART_DRY_RUN=true`, o agente para no resumo e nao confirma uma solicitacao real.
Para validar confirmacao e protocolo, rode em ambiente controlado e configure explicitamente `CIDADAO_SMART_DRY_RUN=false`.
