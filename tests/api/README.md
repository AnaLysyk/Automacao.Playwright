# API: Testes de Integração Backend

🟠 **Testes de integração com APIs e notificadores.**

## Estrutura

```
api/
├── api-smoke.spec.ts           # Saúde das APIs (health check)
├── cidadao/                    # Cidadão Smart API
│   ├── processes.spec.ts       # Criar, consultar, atualizar processos
│   ├── segunda-via.spec.ts     # Segunda Via via API
│   └── consulta.spec.ts        # Consulta de documentos
├── booking/                    # Booking Admin API
│   ├── service-points.spec.ts  # Listar postos
│   ├── schedule.spec.ts        # Agenda e horários
│   └── availability.spec.ts    # Disponibilidade de slots
├── smart/                      # SMART Internal API
│   ├── processes.spec.ts       # Processos civis
│   ├── payment.spec.ts         # Integração de pagamento
│   └── delivery.spec.ts        # Entrega de documentos
└── notifier/                   # Notificador GBDS
    └── webhook.spec.ts         # Webhook de status
```

## Características

✓ Validam respostas de APIs
✓ Não testam UI (ou mínima)
✓ Automáticos (sem intervalo humano)
✓ Rodam em CI
✓ Sem dependência de agenda/email
✓ Independentes
✓ Usam helpers centralizados (`ApiHelper`, `AuthHelper`)

## Testes Disponíveis

### Health Check (Smoke)

- `[API-HEALTH-001]` Cidadão Smart API deve responder
- `[API-HEALTH-002]` Booking Admin API deve responder
- `[API-HEALTH-003]` SMART API deve responder

### Autenticação

- `[API-AUTH-001]` Deve obter token de autenticação via Keycloak

### Cidadão Smart

- `[API-CID-001]` Criar processo via API
- `[API-CID-002]` Consultar processo por protocolo
- `[API-CID-003]` Listar processos com paginação
- `[API-CID-004]` Filtrar por status
- `[API-SEGUNDA-VIA-001]` Criar segunda via via API
- `[API-CONSULTA-001]` Buscar documentos via API

### Booking/Admin

- `[API-BOOKING-001]` Listar postos
- `[API-BOOKING-002]` Obter agenda de um posto
- `[API-BOOKING-003]` Verificar disponibilidade de slots
- `[API-BOOKING-004]` Criar agendamento via API

### SMART Interno

- `[API-SMART-001]` Listar processos no SMART
- `[API-SMART-002]` Obter detalhes do processo
- `[API-SMART-003]` Atualizar status

### Notificador GBDS

- `[API-NOTIF-001]` Webhook dispara ao confirmar agendamento
- `[API-NOTIF-002]` Status mapping RECEIVED → PROCESSING → APPROVED
- `[API-NOTIF-003]` Rejeição dispara notificação de erro
- `[API-NOTIF-004]` Webhook deve estar acessível

### DAE

- `[API-DAE-001]` DAE API deve estar acessível
- `[API-DAE-002]` Verificar DAE de processo
- `[API-DAE-003]` Validar documento
- `[API-NOTIF-004]` Payload nunca contém CPF em plaintext

## Como Executar

```bash
# Todos os testes de API
npm run test:api

# Apenas notificador
npx playwright test tests/api/notificador-gbds.spec.ts --headed

# Por tag
npx playwright test --grep @api
```

## Estrutura de Testes

Padrão: teste executa fluxo + valida webhook disparado

```typescript
test('[API-NOTIF-001] Webhook dispara ao confirmar agendamento', async () => {
  // 1. Executa fluxo até confirmação
  await executarFluxoAgendamento();
  
  // 2. Captura webhook disparado
  const webhookPayload = await captureWebhook();
  
  // 3. Valida payload
  expect(webhookPayload).toHaveProperty('status', 'RECEIVED');
  expect(webhookPayload).not.toHaveProperty('cpf');
});
```

## Segurança - Validação de CPF

**Regra Crítica:** Payload NUNCA deve conter CPF em plaintext

```typescript
// ✓ Correto - apenas hash
{
  "evento": "agendamento.confirmado",
  "cpfHash": "sha256:abc123...",
  "status": "RECEIVED"
}

// ❌ Errado - CPF exposto
{
  "evento": "agendamento.confirmado",
  "cpf": "12345678901",
  "status": "RECEIVED"
}
```

Teste `[API-NOTIF-004]` valida isso.

## Estrutura de Dados

Webhook esperado:

```json
{
  "timestamp": "2026-05-12T10:30:00Z",
  "evento": "agendamento.confirmado",
  "cpfHash": "sha256:...",
  "status": "RECEIVED",
  "protocoloId": "020260000001",
  "postagemId": "top-tower",
  "dataAgendamento": "2026-05-15T08:00:00Z"
}
```

## Page Objects Utilizados

- Nenhum (API pura)
- Usa `AxiosClient` ou `fetch` para requisições HTTP

## Configuração

```bash
# .env
CIDADAO_SMART_BASE_URL=https://172.16.1.146
GBDS_WEBHOOK_URL=https://webhook.gbds.local/notificar
GBDS_API_KEY=seu-api-key
```

## Interpretação de Falhas

| Falha | Causa Provável | Ação |
|-------|----------------|------|
| Webhook não disparou | Integração backend com problema | Verificar logs GBDS |
| Status incorreto | Mapeamento de estados errado | Verificar estado machine |
| CPF no payload | Vazamento de segurança | Reportar urgente |
| Timeout | API lenta | Verificar performance |

## Comandos Úteis

```bash
# Com timeout aumentado
npx playwright test tests/api/notificador-gbds.spec.ts --timeout=60000

# Com logging detalhado
DEBUG=* npx playwright test tests/api/notificador-gbds.spec.ts

# Com gravação de requisições
npx playwright test tests/api/notificador-gbds.spec.ts --trace on
```

## Status de Maturidade

**ESTÁVEL** 🟢 - Pronto para CI

Todos os testes de API são estáveis (não dependem de agenda).

## Checklist de Novo Teste API

- [ ] Valida resposta HTTP (status code)
- [ ] Valida estrutura JSON
- [ ] Valida regras de segurança (não expõe dados sensíveis)
- [ ] Valida transição de estados se aplicável
- [ ] Documento esperado no README
- [ ] Nomeado com padrão `[API-MODULO-NUM]`

## Integração com CI

Estes testes correm em CI:

```yaml
# .github/workflows/test.yml
- name: Run API Tests
  run: npm run test:api
```

## Referências

- [ESTRATEGIA_EXECUCAO.md](../../ESTRATEGIA_EXECUCAO.md)
- [AGENTS.md](../../AGENTS.md)
- GBDS API Docs (interno)
