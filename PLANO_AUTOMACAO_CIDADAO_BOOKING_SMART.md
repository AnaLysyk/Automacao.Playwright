# Plano de Automação: Cidadão Smart + Booking/Admin + SMART

## Objetivo

Automatizar testes de uma suíte completa que cobre:
1. **Cidadão Smart** - Telas e fluxos do cidadão
2. **Booking/Admin** - Configuração e gestão do painel administrativo
3. **SMART interno** - Processamento, conferência e entrega
4. **Integrações** - APIs, Notificador GBDS, DAE, RFB

**Meta:** A automação deve validar não apenas a tela do cidadão, mas toda a cadeia: configuração no Booking → solicitação no Cidadão → processamento no SMART → atualização por Notifier → consulta do status pelo cidadão.

---

## 1. Arquitetura de Teste

### Visão de Sistemas

```
┌─────────────────┐
│ Booking/Admin   │  ← Configura: postos, agenda, horários, bloqueios, permissões
│  (UI + API)     │
└────────┬────────┘
         │
    configura
         ↓
┌─────────────────┐
│ Cidadão Smart   │  ← Consome: lista postos, agendar, consultar
│  (UI + API)     │
└────────┬────────┘
         │
      cria
         ↓
┌─────────────────┐
│ SMART interno   │  ← Processa: confere, captura, paga, envia, imprime
│  (UI + API)     │
└────────┬────────┘
         │
    notifica
         ↓
┌─────────────────┐
│ Notificador     │  ← Status: REVIEW → PRINTING → READY → FINALIZED
│  GBDS (API)     │
└────────┬────────┘
         │
    atualiza
         ↓
┌─────────────────┐
│ Cidadão Smart   │  ← Exibe: status atualizado, pronto para retirada
│  Status (UI)    │
└─────────────────┘
```

### Estrutura de Pastas

```
tests/
├── smoke/                          # Validações rápidas de ambiente
│   ├── cidadao-home.spec.ts
│   ├── booking-admin-login.spec.ts
│   └── smart-login.spec.ts
│
├── cidadao-smart/                  # Telas do cidadão
│   ├── home/
│   ├── agendamento-presencial/
│   ├── segunda-via-expressa/
│   ├── segunda-via-com-alteracoes/
│   ├── consulta-pedido/
│   └── status-solicitacao/
│
├── booking-admin/                  # Painel administrativo
│   ├── login/
│   ├── agendamentos/
│   ├── postos/
│   ├── agenda/
│   ├── auditoria/
│   ├── permissoes/
│   ├── ambiente/
│   └── identidade-visual/
│
├── smart/                          # SMART interno
│   ├── login/
│   ├── processos-civis/
│   ├── detalhes-processo/
│   ├── documentos-adicionais/
│   ├── captura-biometrica/
│   ├── pagamento/
│   ├── conferencia-biografica/
│   ├── envio-processo/
│   ├── emissao-expressa/
│   └── entrega-documento/
│
├── api/                            # Testes de contrato
│   ├── cidadao/
│   ├── booking/
│   ├── smart/
│   ├── notifier/
│   └── dae/
│
├── e2e/                            # Fluxos completos
│   ├── cidadao-booking/
│   ├── cidadao-smart/
│   └── booking-smart-cidadao/
│
├── manual-assisted/                # Com CAPTCHA/email/hardware
│   ├── captcha/
│   ├── smart-hardware/
│   ├── captura-bcc/
│   └── demo-fluxo-completo/
│
├── helpers/
│   ├── auth/
│   ├── api/
│   ├── logs/
│   └── data/
│
└── pages/
    ├── cidadao/
    ├── booking-admin/
    └── smart/
```

---

## 2. Tipos de Teste

| Tipo | Uso | CI? | Exemplo |
|------|-----|-----|---------|
| **SMOKE** | Ambiente vivo | Sim | Login, home carrega |
| **REGRESSÃO** | Regra estável | Sim | Validações, listagem |
| **API** | Contrato backend | Sim | Token, processo, protocolo |
| **E2E** | Fluxo completo | Talvez* | Booking → Cidadão → SMART |
| **ADMIN-READONLY** | Consulta painel | Sim | Listar postos, agenda |
| **ADMIN-WRITE** | Altera config | Autorização | Criar posto, bloquear dia |
| **MANUAL-ASSISTED** | CAPTCHA/email/hardware | Não | Demo com CAPTCHA |

*E2E pode falhar por razões válidas (agenda indisponível).

---

## 3. Tags Padrão

```
@smoke               # Teste rápido
@regressao          # Validação estável
@api                # Contrato backend
@e2e                # Fluxo ponta a ponta
@admin              # Painel administrativo
@manual             # Requer ação humana
@captcha            # Exige CAPTCHA manual
@hardware           # Exige equipamento (câmera, leitor)
@cidadao            # Envolve tela do Cidadão
@booking            # Envolve Booking/Admin
@smart              # Envolve SMART interno
@readonly           # Apenas leitura
@write              # Altera configuração
@notifier           # Envolve Notificador GBDS
@release            # Pertence a uma versão
```

---

## 4. Configuração de Ambiente

### .env.example

```
# Cidadão Smart
CIDADAO_SMART_BASE_URL=
CIDADAO_SMART_DEFAULT_CITY=
CIDADAO_SMART_DEFAULT_POSTO=

# Booking/Admin
BOOKING_ADMIN_BASE_URL=
BOOKING_ADMIN_USER=
BOOKING_ADMIN_PASSWORD=

# SMART
SMART_BASE_URL=
SMART_USER=
SMART_PASSWORD=

# APIs e Integrações
KEYCLOAK_TOKEN_URL=
KEYCLOAK_CLIENT_ID=
KEYCLOAK_CLIENT_SECRET=
X_OPERATOR_CPF=
GBDS_WEBHOOK_URL=
GBDS_API_KEY=

# Configurações de Teste
CAPTCHA_MODE=manual
EXECUTION_MODE=local
BROWSER=chromium
```

### Variáveis Críticas

- **BOOKING_ADMIN_USER** e **BOOKING_ADMIN_PASSWORD**: NUNCA em código/README. Usar .env apenas.
- **X_OPERATOR_CPF**: Obrigatório em POST de APIs.
- **CAPTCHA_MODE**: `manual` (pausa), `disabled` (env QA), `test` (se disponível).

---

## 5. O Que Entra em CI

### ✅ Pode Entrar

- Smoke Cidadão Smart
- Smoke Booking Admin
- Smoke SMART
- API (token, processo, protocolo)
- Admin read-only (listar postos, agenda)
- Cidadão com massa controlada
- Notificador (com mock/API)

### ❌ NÃO Entra

- CAPTCHA manual
- Captura com câmera
- Captura com leitor biométrico
- Assinatura com pad
- BCC Services local
- Entrega com biometria real
- Fluxos que alteram configuração crítica

---

## 6. Prioridades de Automação

### Fase 1: Concluir Fluxo Assistido (Agora)

- [ ] Corrigir CAPTCHA manual
- [ ] Corrigir seleção de posto
- [ ] Corrigir data/horário com fallback
- [ ] Chegar até resumo/protocolo
- [ ] Enviar código por email
- [ ] Confirmar agendamento

### Fase 2: Organizar Projeto (Semana 1-2)

- [ ] Separar pastas conforme estrutura
- [ ] Criar scripts npm
- [ ] Criar .env.example
- [ ] Criar tags em todos os testes
- [ ] Criar helpers

### Fase 3: Cobertura Admin/Booking (Semana 2-4)

- [ ] Login admin
- [ ] Listar postos
- [ ] Validar agenda
- [ ] Configurar bloqueios
- [ ] Testar permissões

### Fase 4: Cobertura API (Semana 3-5)

- [ ] Token/autenticação
- [ ] Criar processo
- [ ] Consultar protocolo
- [ ] Status mapping
- [ ] DAE

### Fase 5: Cobertura SMART (Semana 4-6)

- [ ] Login SMART
- [ ] Listar processos
- [ ] Detalhes processo
- [ ] Pagamento
- [ ] Conferência

### Fase 6: E2E Confiável (Semana 5-7)

- [ ] Booking valida agenda
- [ ] Cidadão consome agenda
- [ ] Processo chega no SMART
- [ ] Notifier atualiza status
- [ ] Consulta exibe andamento

### Fase 7: CI (Semana 6-8)

- [ ] Smoke passa
- [ ] API passa
- [ ] Admin readonly passa
- [ ] Cidadão passa
- [ ] Relatório gerado

---

## 7. Matriz de Cobertura

| Área | Ticket | Tipo | Teste | Status |
|------|--------|------|-------|--------|
| Cidadão Home | CID-112 | UI | cidadao-home.spec.ts | Pendente |
| Agendamento Local | CID-140 | UI/E2E | agendamento-local.spec.ts | Pendente |
| Data/Hora | CID-140 | UI/E2E | agendamento-data-hora.spec.ts | Pendente |
| Booking Agenda | CID-140 | Admin | booking-agenda.spec.ts | Pendente |
| Booking Horários | CID-140 | Admin | booking-horario-funcionamento.spec.ts | Pendente |
| Admin Paginação | CID-147 | Admin | booking-agendamentos-paginacao.spec.ts | Pendente |
| API Processos | - | API | api-processos.spec.ts | Pendente |
| Notifier Status | - | API | api-notifier-status.spec.ts | Pendente |
| SMART Conferência | SMART-642 | UI/E2E | smart-conferencia.spec.ts | Pendente |
| E2E Completo | - | E2E | e2e-booking-cidadao-smart.spec.ts | Pendente |

---

## 8. Dependências Críticas

### Sem Automação (Manual/Hardware)

- Resolução de CAPTCHA reCAPTCHA
- Captura de face em câmera real
- Captura de digitais com leitor
- Assinatura em pad
- BCC Services instalado

### Com Mock/API

- Geração de DAE
- Envio de email
- Webhook do Notificador
- Lookup RFB

### Segurança

- Credencial admin NUNCA em código
- x-operator-cpf em variável
- .env.example sem valores
- Testes de write com tag `@write`

---

## 9. Scripts npm

```json
{
  "scripts": {
    "test:list": "playwright test --list",
    "test:smoke": "playwright test --grep @smoke",
    "test:regressao": "playwright test --grep @regressao",
    "test:api": "playwright test tests/api",
    "test:cidadao": "playwright test tests/cidadao-smart",
    "test:booking": "playwright test tests/booking-admin",
    "test:booking:readonly": "playwright test tests/booking-admin --grep @readonly",
    "test:smart": "playwright test tests/smart",
    "test:e2e": "playwright test tests/e2e",
    "test:manual": "playwright test tests/manual-assisted --headed",
    "test:ci": "playwright test --grep -v @manual --grep -v @hardware",
    "test:release": "playwright test tests/releases",
    "report": "playwright show-report",
    "debug": "playwright test --debug"
  }
}
```

---

## 10. Como Interpretar Falhas

| Erro | Causa | Ação |
|------|-------|------|
| Seletor não encontrado | UI mudou | Atualizar seletor |
| Data/horário indisponível | Agenda cheia | Aceitar falha válida |
| Processo não aparece no SMART | Integração com problema | Verificar logs backend |
| Código email rejeitado | Email antigo/expirado | Regenerar código |
| Biometria rejeitada | Qualidade baixa | Hardware BCC |
| CAPTCHA não passou | Manual não feito | Completar intervalo |

---

## 11. Próximo Passo

1. Criar estrutura de pastas conforme seção 1
2. Mover testes atuais para pastas corretas
3. Adicionar tags em todos os testes
4. Criar helpers conforme seção de Helpers
5. Começar com Admin/Booking read-only
6. Criar API tests com mocks
7. Amarrar com E2E

---

## Documento Vivo

Este plano evolui conforme:
- Novas releases chegam
- Novos sistemas entram no escopo
- Cobertura aumenta
- Tickets são completados
