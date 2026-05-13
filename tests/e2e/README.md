# E2E: Fluxos Completos Ponta a Ponta

🔵 **Testes de fluxo completo do sistema.**

## Características

✓ Fluxo inteiro (localização → resumo → confirmação)
✓ Sem intervalo humano
✓ Sem CAPTCHA manual
✓ Pode falhar por agenda indisponível (é ok)
⚠️ Pode rodar em regressão específica (não em CI principal)
⚠️ Status de maturidade: INSTÁVEL

## Por Que Instável?

Estes testes dependem de:
- Data/horário disponível na agenda
- Email funcional (se aplicável)
- Ambiente com massa suficiente
- Disponibilidade de recursos

Se a agenda mudar ou email falhar, o teste quebra **sem ser bug**.

## Estrutura

```
e2e/
├── agendamento-presencial-fluxo-completo.spec.ts
├── emissao-online-fluxo-completo.spec.ts
├── agendamento-json-cases.spec.ts
└── README.md
```

## Testes Disponíveis

### Agendamento Presencial

- `[E2E-AGP-001]` Agendamento presencial completo com Top Tower
- Fluxo: Localização → Data/Hora → Requerente → Resumo → Confirmação

### Emissão Online

- `[E2E-EMI-001]` Emissão online completa com captura
- Fluxo: Tipo → Captura → Requerente → Resumo → Confirmação

### JSON Test Cases

- `[E2E-CDS-XXX]` Casos de teste automáticos via JSON
- Validam regras de negócio completas

## Como Executar

```bash
# Todos os E2E
npm run test:e2e

# Apenas agendamento
npx playwright test tests/e2e/agendamento-presencial-fluxo-completo.spec.ts --headed

# Com marca específica
npx playwright test --grep @e2e

# Sem parar na primeira falha
npx playwright test --grep @e2e --no-exit-on-failed
```

## Estratégia de Dados

Usa `AgendamentoHelper` para seleção inteligente:

```typescript
// Tenta data preferida, se não disponível pega a primeira
const { data, horario } = await agendamentoHelper
  .selecionarPrimeiraDataEHorarioDisponiveis();

console.log(`Agendado para ${data} às ${horario}`);
```

Isso deixa o teste resistente a mudanças de agenda.

## Quando Deve Falhar

✓ **Ok falhar:**
- Nenhuma data disponível no calendário
- Email não chegou
- CAPTCHA não foi marcado (demo)

❌ **Não ok falhar:**
- Seletor não encontrado
- Erro 500 do servidor
- Resumo com dado errado

Se falhar com "ok", **não é bug do teste**.

## Page Objects Utilizados

- `CidadaoSmartAgendamentoLocalPage`
- `CidadaoSmartAgendamentoDataHoraPage`
- `CidadaoSmartAgendamentoResumoPage`
- `CidadaoSmartAgendamentoConfirmacaoPage`
- `AgendamentoHelper` (para seleção inteligente)

## Configuração

```bash
# .env
CIDADAO_SMART_BASE_URL=https://172.16.1.146
CAPTCHA_MODE=disabled
CIDADAO_SMART_DRY_RUN=false
```

## Interpretação de Falhas

| Falha | O Que Significa | Ação |
|-------|-----------------|------|
| "Nenhuma data disponível" | Agenda muito cheia | Tentar depois |
| "Email não chegou" | Integração email lenta | Verificar email |
| "Seletor não encontrado" | Bug de UI / teste | Reportar / atualizar seletor |
| "Resumo incorreto" | Bug de produto | Reportar |

## Quando Usar E2E

✓ **Use quando:**
- Quer validar fluxo completo
- Quer demonstração ponta a ponta
- Quer investigar problema em produção
- Pode tolerar falhas por agenda

❌ **Não use quando:**
- Precisa de teste estável 100%
- Está em pipeline de CI principal
- Precisa rodar toda noite sem falha

## Próximos Passos

Quando ambiente estabilizar:
1. Aumentar confiabilidade dos dados
2. Mover alguns testes para REGRESSÃO
3. Mover para CI com tolerância a falha
4. Criar alertas se agenda mudar drasticamente

## Status de Maturidade

**INSTÁVEL** 🟡 - Útil para investigação, não para regressão automática

## Referências

- [ESTRATEGIA_EXECUCAO.md](../../ESTRATEGIA_EXECUCAO.md)
- [AGENTS.md](../../AGENTS.md)
- [AgendamentoHelper.ts](../helpers/AgendamentoHelper.ts)
