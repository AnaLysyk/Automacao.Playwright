# Matriz de Testes - Mapeamento Cobertura

Matriz que conecta tickets, testes, e status de cobertura.

## Legend

| Status | Significado |
|--------|------------|
| ✅ | Implementado e passando |
| 🔄 | Em progresso |
| ⏳ | Pendente (não iniciado) |
| ❌ | Falha conhecida (bloqueado/skip) |
| 🟡 | Manual (requer ação humana) |

| Tipo | Significado |
|------|------------|
| AUTO | Automático (sem intervalo) |
| MAN | Manual (com intervalo humano) |
| API | Apenas backend (sem UI) |

---

## Cidadão Smart

### CID-112: Home Page

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| CID-112-001 | Home carrega | AUTO | ✅ | smoke/home.spec.ts | @smoke @cidadao |
| CID-112-002 | Menu principal | AUTO | ✅ | cidadao-smart/home/menu.spec.ts | @regressao @cidadao |
| CID-112-003 | Links de serviços | AUTO | ✅ | cidadao-smart/home/servicos.spec.ts | @regressao @cidadao |
| CID-112-004 | Responsive mobile | AUTO | ⏳ | cidadao-smart/home/responsive.spec.ts | @regressao @cidadao |

### CID-140: Agendamento Presencial

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| AGP-FLOW-001 | Fluxo completo | AUTO | ✅ | agendamento-presencial/cidadao-smart-agendamento-presencial.spec.ts | @regressao @e2e |
| AGP-VALIDATION-001 | Validação CPF | AUTO | ✅ | agendamento-presencial/cidadao-smart-agendamento-validacoes.spec.ts | @regressao |
| AGP-VALIDATION-002 | Validação email | AUTO | ✅ | agendamento-presencial/cidadao-smart-agendamento-validacoes.spec.ts | @regressao |
| AGP-VALIDATION-003 | CPF inválido | AUTO | ✅ | agendamento-presencial/cidadao-smart-agendamento-validacoes.spec.ts | @regressao |
| AGP-DATE-001 | Data/hora fallback | AUTO | 🔄 | agendamento-presencial/cidadao-smart-agendamento-autenticacao.spec.ts | @regressao |
| AGP-RESUMO-001 | Resumo agendamento | AUTO | ✅ | agendamento-presencial/cidadao-smart-agendamento-resumo.spec.ts | @regressao |
| AGP-CONFIRMATION-001 | Email confirmação | MAN | 🟡 | manual-assisted/cidadao-smart-demo-fluxo-completo-email.spec.ts | @manual @email |
| AGP-CODIGO-001 | Código por email | MAN | 🟡 | manual-assisted/cidadao-smart-demo-fluxo-completo-email.spec.ts | @manual @email |

### CID-147: Paginação Admin

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| ADMIN-AGD-001 | Listar agendamentos | AUTO | ⏳ | booking-admin/agendamentos.spec.ts | @admin @readonly |
| ADMIN-AGD-002 | Paginação próxima | AUTO | ⏳ | booking-admin/agendamentos.spec.ts | @admin @readonly |
| ADMIN-AGD-003 | Paginação anterior | AUTO | ⏳ | booking-admin/agendamentos.spec.ts | @admin @readonly |
| ADMIN-AGD-004 | Ordenação | AUTO | ⏳ | booking-admin/agendamentos.spec.ts | @admin @readonly |
| ADMIN-AGD-005 | Filtros | AUTO | ⏳ | booking-admin/agendamentos.spec.ts | @admin @readonly |

### CID-149: Segunda Via Expressa

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| EXPR-FLOW-001 | Fluxo sem alterações | AUTO | ⏳ | cidadao-smart/segunda-via-expressa/fluxo-completo.spec.ts | @regressao @e2e |
| EXPR-VALIDATION-001 | Validação documento | AUTO | ⏳ | cidadao-smart/segunda-via-expressa/validacoes.spec.ts | @regressao |
| EXPR-PAYMENT-001 | Pagamento | AUTO | ⏳ | cidadao-smart/segunda-via-expressa/pagamento.spec.ts | @regressao @pagamento |
| EXPR-DOWNLOAD-001 | Download documento | AUTO | ⏳ | cidadao-smart/segunda-via-expressa/download.spec.ts | @regressao |

### CID-148: Segunda Via com Alterações

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| ALT-FLOW-001 | Fluxo com alterações | AUTO | ⏳ | cidadao-smart/segunda-via-com-alteracoes/fluxo-completo.spec.ts | @regressao @e2e |
| ALT-CONFIRM-001 | Confirmação alterações | AUTO | ⏳ | cidadao-smart/segunda-via-com-alteracoes/confirmacao-dados.spec.ts | @regressao |
| ALT-ENDERECO-001 | Atualizar endereço | AUTO | ⏳ | cidadao-smart/segunda-via-com-alteracoes/confirmacao-dados.spec.ts | @regressao |

---

## Booking/Admin

### Admin Login

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| ADMIN-LOGIN-001 | Página login carrega | AUTO | ✅ | booking-admin/smoke-admin.spec.ts | @smoke @booking |
| ADMIN-LOGIN-002 | Login válido | AUTO | ✅ | booking-admin/smoke-admin.spec.ts | @smoke @booking |
| ADMIN-LOGIN-003 | Rejeita senha incorreta | AUTO | ✅ | booking-admin/smoke-admin.spec.ts | @smoke @booking |
| ADMIN-LOGIN-004 | Logout | AUTO | ✅ | booking-admin/smoke-admin.spec.ts | @smoke @booking |

### Admin Postos

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| ADMIN-POSTO-001 | Listar postos | AUTO | ✅ | booking-admin/smoke-admin.spec.ts | @smoke @booking @readonly |
| ADMIN-POSTO-002 | Criar posto | AUTO | ⏳ | booking-admin/postos.spec.ts | @admin @write |
| ADMIN-POSTO-003 | Editar posto | AUTO | ⏳ | booking-admin/postos.spec.ts | @admin @write |
| ADMIN-POSTO-004 | Deletar posto | AUTO | ⏳ | booking-admin/postos.spec.ts | @admin @write |
| ADMIN-POSTO-005 | Validações | AUTO | ⏳ | booking-admin/postos.spec.ts | @admin |

### Admin Agenda

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| CID-140-001 | Acessar agenda | AUTO | ✅ | booking-admin/smoke-admin.spec.ts | @smoke @booking @readonly |
| CID-140-002 | Adicionar horário | AUTO | ⏳ | booking-admin/agenda-horarios.spec.ts | @admin @write |
| CID-140-003 | Remover horário | AUTO | ⏳ | booking-admin/agenda-horarios.spec.ts | @admin @write |
| CID-140-004 | Bloquear dia | AUTO | ⏳ | booking-admin/bloqueios.spec.ts | @admin @write |
| CID-140-005 | Desbloquear dia | AUTO | ⏳ | booking-admin/bloqueios.spec.ts | @admin @write |
| CID-140-006 | Funcionamento | AUTO | ⏳ | booking-admin/agenda-funcionamento.spec.ts | @admin |
| CID-140-007 | Validar disponibilidade | AUTO | ⏳ | booking-admin/agenda-disponibilidade.spec.ts | @admin |

---

## SMART Interno

### SMART Login

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| SMART-LOGIN-001 | Página login carrega | AUTO | ✅ | smart/smoke-smart.spec.ts | @smoke @smart |
| SMART-LOGIN-002 | Login válido | AUTO | ✅ | smart/smoke-smart.spec.ts | @smoke @smart |
| SMART-LOGIN-003 | Rejeita senha incorreta | AUTO | ✅ | smart/smoke-smart.spec.ts | @smoke @smart |
| SMART-LOGOUT-001 | Logout | AUTO | ✅ | smart/smoke-smart.spec.ts | @smoke @smart |

### SMART Processos

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| SMART-MENU-001 | Menu carrega | AUTO | ✅ | smart/smoke-smart.spec.ts | @smoke @smart |
| SMART-PROCESSOS-001 | Listar processos | AUTO | ✅ | smart/smoke-smart.spec.ts | @regressao @smart |
| SMART-DETALHE-001 | Abrir detalhes | AUTO | ✅ | smart/smoke-smart.spec.ts | @regressao @smart |
| SMART-CIVIL-001 | Listar processos civis | AUTO | ⏳ | smart/processos-civis/lista.spec.ts | @smart @readonly |
| SMART-CIVIL-002 | Filtrar | AUTO | ⏳ | smart/processos-civis/filters.spec.ts | @smart |

### SMART Captura

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| SMART-CAP-001 | Captura facial | MAN | ⏳ | smart/captura-biometrica/facial.spec.ts | @smart @hardware @manual |
| SMART-CAP-002 | Captura digital | MAN | ⏳ | smart/captura-biometrica/digitais.spec.ts | @smart @hardware @manual |
| SMART-CAP-003 | Validação qualidade | AUTO | ⏳ | smart/captura-biometrica/validacao.spec.ts | @smart |

### SMART Conferência

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| SMART-CONF-001 | Conferência dados | AUTO | ⏳ | smart/conferencia/dados-pessoais.spec.ts | @smart |
| SMART-CONF-002 | Conferência endereço | AUTO | ⏳ | smart/conferencia/endereco.spec.ts | @smart |
| SMART-CONF-003 | Validações | AUTO | ⏳ | smart/conferencia/validacoes.spec.ts | @smart |

### SMART Pagamento

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| SMART-PAG-001 | Integração boleto | AUTO | ⏳ | smart/pagamento/boleto.spec.ts | @smart @pagamento |
| SMART-PAG-002 | Integração cartão | AUTO | ⏳ | smart/pagamento/cartao.spec.ts | @smart @pagamento |
| SMART-PAG-003 | Comprovante | AUTO | ⏳ | smart/pagamento/comprovante.spec.ts | @smart |

---

## APIs

### Autenticação

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| API-HEALTH-001 | Cidadão Smart health | API | ✅ | api/api-smoke.spec.ts | @api @smoke |
| API-HEALTH-002 | Booking Admin health | API | ✅ | api/api-smoke.spec.ts | @api @smoke |
| API-HEALTH-003 | SMART health | API | ✅ | api/api-smoke.spec.ts | @api @smoke |
| API-AUTH-001 | Token Keycloak | API | ✅ | api/api-smoke.spec.ts | @api @smoke |

### Cidadão API

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| API-CID-PROC-001 | Criar processo | API | ⏳ | api/cidadao/processes.spec.ts | @api |
| API-CID-PROC-002 | Consultar processo | API | ⏳ | api/cidadao/processes.spec.ts | @api |
| API-CID-PROC-003 | Listar processos | API | ⏳ | api/cidadao/processes.spec.ts | @api |
| API-2VIA-001 | Segunda via | API | ⏳ | api/cidadao/segunda-via.spec.ts | @api |

### Booking API

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| API-BOOKING-001 | Listar postos | API | ✅ | api/api-smoke.spec.ts | @api @smoke |
| API-BOOKING-002 | Agenda | API | ✅ | api/api-smoke.spec.ts | @api @smoke |
| API-BOOKING-003 | Disponibilidade | API | ⏳ | api/booking/availability.spec.ts | @api |

### SMART API

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| API-SMART-001 | Listar processos | API | ✅ | api/api-smoke.spec.ts | @api @smoke |
| API-SMART-002 | Detalhes | API | ⏳ | api/smart/processes.spec.ts | @api |
| API-SMART-003 | Status | API | ⏳ | api/smart/processes.spec.ts | @api |

### Notificador GBDS

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| API-NOTIF-001 | Webhook acessível | API | ✅ | api/api-smoke.spec.ts | @api @smoke |
| API-NOTIF-002 | Status mapping | API | ⏳ | api/notifier/webhook.spec.ts | @api |
| API-NOTIF-003 | Atualizar status | API | ⏳ | api/notifier/webhook.spec.ts | @api |

### DAE

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| API-DAE-001 | Health check | API | ✅ | api/api-smoke.spec.ts | @api @smoke |
| API-DAE-002 | Verificar DAE | API | ⏳ | api/dae.spec.ts | @api |

---

## E2E - Integrações

### Booking → Cidadão

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| E2E-BOOKING-CID-001 | Config no Admin aparece no Cidadão | E2E | ⏳ | e2e/cidadao-booking/agenda-sync.spec.ts | @e2e |
| POSTO-SYNC-001 | Postos sincronizados | E2E | ⏳ | e2e/cidadao-booking/posto-sync.spec.ts | @e2e |
| HORARIO-SYNC-001 | Horários sincronizados | E2E | ⏳ | e2e/cidadao-booking/horario-sync.spec.ts | @e2e |

### Cidadão → SMART

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| E2E-CID-SMART-001 | Protocolo aparece no SMART | E2E | ⏳ | e2e/cidadao-smart/protocolo-sync.spec.ts | @e2e |
| E2E-STATUS-001 | Status atualiza no Cidadão | E2E | ⏳ | e2e/cidadao-smart/status-sync.spec.ts | @e2e |

### Booking → Cidadão → SMART (Full)

| ID Teste | Descrição | Tipo | Status | Arquivo | Tags |
|----------|-----------|------|--------|---------|------|
| E2E-FULL-001 | Fluxo completo 3 sistemas | MAN | ⏳ | e2e/booking-cidadao-smart/fluxo-completo.spec.ts | @e2e @manual |

---

## Resumo de Cobertura

| Status | Quantidade |
|--------|-----------|
| ✅ Implementado | 15 |
| 🔄 Em Progresso | 2 |
| ⏳ Pendente | 75 |
| ❌ Bloqueado | 0 |
| 🟡 Manual | 3 |
| **TOTAL** | **95** |

| Tipo | Quantidade |
|------|-----------|
| AUTO | 72 |
| MAN | 10 |
| API | 13 |
| **TOTAL** | **95** |

| Fase | % Conclusão |
|------|------------|
| Fase 1: Agendamento | 70% (8/12) |
| Fase 2: Admin | 20% (2/10) |
| Fase 3: SMART | 15% (3/20) |
| Fase 4: API | 35% (5/14) |
| Fase 5: E2E | 0% (0/5) |
| **TOTAL** | **25%** (15/60) |

---

## Próximos Passos

1. ✅ Completar Fase 1 (Agendamento) → 6 testes pendentes
2. 🔄 Iniciar Fase 2 (Admin) → Login + 9 testes
3. 🔄 Iniciar Fase 3 (SMART) → Captura biométrica + 15 testes
4. ⏳ Expandir Fase 4 (API) → DAE + 9 testes
5. ⏳ Integração Fase 5 (E2E) → Após sistemas estáveis

---

**Última atualização:** [DATA]  
**Próxima revisão:** [+1 mês]
