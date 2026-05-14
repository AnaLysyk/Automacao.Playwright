# Cidadão Smart: Testes End-to-End do Cidadão

Testes da interface do cidadão - o principal ponto de contato para usuários da plataforma.

## Estrutura

```
cidadao-smart/
├── home/                       # Home page
│   ├── carregamento.spec.ts
│   └── elementos-principais.spec.ts
├── agendamento-presencial/     # Agendamento presencial
│   ├── fluxo-completo.spec.ts
│   ├── selecao-de-posto.spec.ts
│   ├── selecao-de-data-hora.spec.ts
│   └── validacoes.spec.ts
├── segunda-via-expressa/       # Segunda via express
│   ├── fluxo-completo.spec.ts
│   └── validacoes.spec.ts
├── segunda-via-com-alteracoes/ # Segunda via com alterações
│   ├── fluxo-completo.spec.ts
│   └── confirmacao-dados.spec.ts
├── consulta-pedido/            # Consultar pedido/processo
│   ├── busca-por-protocolo.spec.ts
│   ├── busca-por-email.spec.ts
│   └── exibicao-de-status.spec.ts
└── status-solicitacao/         # Acompanhamento de status
    ├── timeline.spec.ts
    └── notificacoes.spec.ts
```

## Fluxos Principais

### 1. Agendamento Presencial (CID-140)

```
Home → Serviço → Posto → Data/Hora → Dados Pessoais → Email → Confirmação → Protocolo
```

**Testes:**
- `[AGP-FLOW-001]` Fluxo completo até protocolo
- `[AGP-VALIDATION-001]` Validação de CPF
- `[AGP-VALIDATION-002]` Validação de email
- `[AGP-DATE-001]` Data/horário com fallback
- `[AGP-CONFIRMATION-001]` Email de confirmação recebido

### 2. Segunda Via Expressa

```
Home → Tipo → Documento → Dados → Validação → Pagamento → Pronto
```

**Testes:**
- `[EXPR-FLOW-001]` Fluxo sem alterações
- `[EXPR-PAYMENT-001]` Processamento de pagamento
- `[EXPR-DOWNLOAD-001]` Download do documento

### 3. Segunda Via com Alterações

```
Home → Tipo → Documento → Alterações → Validação → Dados → Pronto
```

**Testes:**
- `[ALT-FLOW-001]` Fluxo com alterações
- `[ALT-CONFIRM-001]` Confirmação de alterações
- `[ALT-ENDERECO-001]` Atualizar endereço

### 4. Consulta de Pedido

```
Home → Consultar → Protocolo/Email → Status → Timeline
```

**Testes:**
- `[CONS-SEARCH-001]` Buscar por protocolo
- `[CONS-SEARCH-002]` Buscar por email
- `[CONS-STATUS-001]` Exibir status atual
- `[CONS-TIMELINE-001]` Timeline de atualizações

## Testes Implementados

- Vários em `agendamento-presencial/`
- Validações de entrada
- Seleção de data/hora com fallback
- Fluxo assistido (com CAPTCHA manual)

## Testes Futuros

- Segunda via expressa (com pagamento)
- Segunda via com alterações
- Consulta de pedido
- Status em tempo real via Notificador

## Variáveis de Ambiente

```
CIDADAO_SMART_BASE_URL=https://cidadao-smart.example.com
CIDADAO_SMART_DEFAULT_CITY=SP
CAPTCHA_MODE=manual
TEST_EMAIL=seu.email@example.com
SCHEDULING_STRATEGY=preferida
PREFERRED_TIME=09:00
```

## Execução

```bash
# Todos os testes Cidadão Smart
npm run test:cidadao

# Apenas agendamento presencial
npm run test:cidadao -- tests/cidadao-smart/agendamento-presencial

# Com headed (ver navegador)
npm run test:cidadao -- --headed

# Apenas smoke
npm run test:cidadao -- --grep "@smoke"

# Apenas regressão
npm run test:cidadao -- --grep "@regressao"

# Debug interativo
npm run test:cidadao -- --debug
```

## Tags

```
@smoke              # Teste rápido (home, navegação)
@regressao         # Validação estável (agendamento completo)
@e2e               # Fluxo ponta a ponta
@manual            # Requer ação humana (CAPTCHA)
@captcha           # Exige CAPTCHA manual
@readonly          # Apenas leitura (consulta)
@write             # Altera dados (agendamento)
@cidadao           # Tela do cidadão
@email             # Validação de email
@pagamento         # Processamento de pagamento
```

## Dados de Teste

### Email de Teste

```
CIDADAO_SMART_TEST_EMAIL=ana.testing.company@gmail.com
```

**IMAP Configuration** (para extrair código automaticamente):

```
CIDADAO_SMART_EMAIL_IMAP_HOST=imap.gmail.com
CIDADAO_SMART_EMAIL_IMAP_USER=ana.testing.company@gmail.com
CIDADAO_SMART_EMAIL_IMAP_PASSWORD=[app-password]
```

### Massa de Dados

- **Estratégia:** Preferida + Fallback
  - Tenta horário preferido (ex: 09:00)
  - Se cheio, toma primeiro disponível
  - Menos falsos positivos por agenda cheia

- **Data:** Próxima data disponível (nunca hoje)

- **Posto:** Padrão configurado, fallback para primeiro

## Troubleshooting

**Erro: "Nenhuma data disponível"**
- Verificar agenda no Booking Admin
- Pode haver bloqueios ou limite de vagas
- Tentar próxima semana

**Erro: "CAPTCHA não passou"**
- Manual: esperar e resolver no tempo limite
- `CAPTCHA_MODE=disabled` em ambiente QA

**Erro: "Email não recebeu código"**
- Verificar caixa de spam
- IMAP pode estar bloqueado
- Validar credenciais

**Erro: "Seletor não encontrado"**
- UI pode ter mudado
- Atualizar seletores em page objects
- Executar com `--debug` para inspecionar

## Performance

- `[AGP-FLOW-001]` completa em ~30-45 segundos
- `[CONS-SEARCH-001]` completa em ~5 segundos
- `[EXPR-FLOW-001]` completa em ~60-90 segundos

## Estratégia de Massa

### Agendamento Presencial

1. **Primeira tentativa:** Horário preferido (09:00)
2. **Fallback:** Primeiro horário disponível
3. **Se falhar:** Pula test (agenda cheia é motivo válido)

### Segunda Via

1. **Sem alterações:** Documento direto
2. **Com alterações:** Simples (endereço, telefone)
3. **Massa:** Reutilizar CPF do agendamento se houver

## Próximas Fases

1. ✅ Agendamento presencial (completo)
2. ⏳ Segunda via expressa (pagamento)
3. ⏳ Segunda via com alterações
4. ⏳ Consulta de pedido
5. ⏳ Status em tempo real
6. ⏳ Notificações do Notificador

## CI/CD

**Smoke:**
```bash
npm run test:smoke
```

**Regressão:**
```bash
npm run test:regressao
```

**Manual (local apenas):**
```bash
npm run test:manual -- --headed
```
