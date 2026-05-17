# Automacao API - Booking | Agendamento

Este diretorio organiza o fluxo API de agendamento no mesmo padrao da Via Expressa.

## Objetivo

Validar o ciclo principal do agendamento pela API:

1. Buscar um posto valido para gerar `pickupStationId`.
2. Criar agendamento.
3. Consultar o agendamento criado.
4. Cancelar o agendamento criado.
5. Consultar novamente para confirmar que ele nao permanece ativo.

## Estrutura

```txt
tests/api/booking/agendamento/
├── README.md
├── agendamento.data.ts
├── agendamento.spec.ts
├── posto/
│   ├── posto.data.ts
│   └── posto.flow.ts
├── criar/
│   ├── criar.data.ts
│   └── criar.flow.ts
├── consultar/
│   ├── consultar.data.ts
│   └── consultar.flow.ts
└── cancelar/
    ├── cancelar.data.ts
    └── cancelar.flow.ts
```

## Tags

| Tag | Uso |
|---|---|
| `@criar` | Busca posto e cria um agendamento/processo pela API |
| `@consultar` | Busca posto, cria massa e consulta o identificador gerado |
| `@cancelar` | Busca posto, cria massa e cancela o identificador gerado |
| `@cicd` | Executa o ciclo completo: buscar posto, criar, consultar, cancelar e validar pos-cancelamento |

## Comando principal

Executar o ciclo completo:

```powershell
npm run booking:agendamento:cicd
```

Comando equivalente:

```powershell
npx playwright test tests/api/booking/agendamento/agendamento.spec.ts --project=chromium --grep "@cicd"
```

Executar todos os cenarios do arquivo:

```powershell
npm run booking:agendamento
```

## Variaveis usadas

```txt
BOOKING_API_BASE_URL
BOOKING_CREATE_APPOINTMENT_PATH
BOOKING_GET_APPOINTMENT_PATH
BOOKING_CANCEL_APPOINTMENT_PATH
BOOKING_CANCEL_APPOINTMENT_METHOD
API_TOKEN_PATH
API_TOKEN_USER_NAME
API_TOKEN_USER_PASSWORD
KEYCLOAK_TOKEN_URL
KEYCLOAK_CLIENT_ID
KEYCLOAK_CLIENT_SECRET
KEYCLOAK_USERNAME
KEYCLOAK_PASSWORD
X_OPERATOR_CPF
CPF_REQUERENTE_BOOKING
TEST_EMAIL
TEST_PHONE
SERVICE_POINT_ID
SERVICE_ID
BOOKING_DATE
BOOKING_TIME
```

## Evidencias

O terminal fica enxuto. Os detalhes tecnicos ficam no HTML:

```powershell
npx playwright show-report
```

Anexos principais:

```txt
01-posto-selecionado.json
02-criacao-agendamento.json
03-consulta-agendamento-criado.json
04-cancelamento-agendamento.json
05-consulta-agendamento-apos-cancelamento.json
resumo-ciclo-completo-agendamento.md
```

## Regras

- O teste isolado nao depende de identificador fixo.
- A criacao usa `pickupStationId` retornado pela busca de posto da propria API.
- O `flow.ts` nao tem `test.describe`, `test.step` ou `expect`.
- O `spec.ts` concentra cenario, validacoes e anexos.
- Endpoints e payloads vêm das variaveis/configuracoes existentes do repositório.
