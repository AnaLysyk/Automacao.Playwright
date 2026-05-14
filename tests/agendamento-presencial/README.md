# Agendamento Presencial: Testes de Regressão

✅ **Testes automáticos estáveis do fluxo de agendamento presencial.**

## Características

✓ Automáticos (sem intervalo humano)
✓ Rodam em CI
✓ Rodam em regressão diária
✓ Sem CAPTCHA manual
✓ Sem email real
✓ Massa controlada
✓ Independentes entre si

## Estrutura

```
agendamento-presencial/
├── local.spec.ts              # Localização (busca cidade, seleciona posto)
├── data-hora.spec.ts          # Data e Hora (seleção, validações)
├── validacoes.spec.ts         # Validações (telefone, nome, idade)
├── resumo.spec.ts             # Resumo (validação de dados)
├── autenticacao.spec.ts        # Autenticação (código de segurança)
└── README.md
```

## Testes Disponíveis

### Localização

- `[SMOKE-AGP-LOCAL-001]` Home carrega com links de agendamento
- `[REG-AGP-LOCAL-001]` Validar busca por cidade
- `[REG-AGP-LOCAL-002]` Validar seleção de posto
- `[REG-AGP-LOCAL-003]` Validar que não selecionou posto errado

### Data e Hora

- `[REG-AGP-DH-VALID-001]` Validar nome com uma palavra
- `[REG-AGP-DH-VALID-002]` Validar CPF vazio permitido
- `[REG-AGP-DH-VALID-003]` Validar telefone obrigatório
- `[REG-AGP-DH-VALID-004]` Validar data menor de 16 anos
- `[REG-AGP-DH-001]` Selecionar primeira data disponível
- `[REG-AGP-DH-002]` Selecionar primeiro horário disponível

### Resumo

- `[REG-AGP-RES-001]` Validar resumo com Top Tower
- `[REG-AGP-RES-002]` Validar dados preenchidos no resumo

### Autenticação

- `[REG-AGP-AUTH-001]` Validar código de segurança obrigatório

## Como Executar

```bash
# Todos os testes de agendamento
npm run test:agendamento

# Apenas validações
npm run test:agendamento:validacoes

# Apenas por tag
npx playwright test --grep @agendamento

# Arquivo específico
npx playwright test tests/agendamento-presencial/local.spec.ts --headed
```

## Estrutura de Dados

Dados usados nos testes:

```typescript
// Pessoa válida
{
  nome: "João Silva",
  dataNascimento: "15/03/1990",
  cpf: process.env.CIDADAO_SMART_TEST_CPF,
  telefone: "(48) 99999-9999",
  email: "joao@test.com"
}

// Pessoa menor de 16 anos (bloqueada)
{
  dataNascimento: "15/03/2012"
}

// Pessoa com exatamente 16 anos (permitida)
{
  dataNascimento: "15/03/2010"
}
```

## Page Objects Utilizados

- `CidadaoSmartAgendamentoLocalPage` - Tela de localização
- `CidadaoSmartAgendamentoDataHoraPage` - Tela de data/hora
- `CidadaoSmartAgendamentoResumoPage` - Tela de resumo
- `CidadaoSmartAgendamentoAutenticacaoPage` - Tela de autenticação

## Regras Críticas

1. **Cada teste é independente**
   - Não depende de outro ter rodado antes
   - Não usa protocolo criado em outro teste

2. **Sem CAPTCHA**
   - Todos os testes correm com `CAPTCHA_MODE=disabled`
   - Nunca burlar CAPTCHA real

3. **Sem email real**
   - Não exigem código enviado por email
   - Se precisar de código, usar variável de ambiente

4. **Massa controlada**
   - Datas são relativas (hoje, amanhã, etc)
   - Não fixam data 18/05/2026 (quebra se mudar)

5. **Posto selecionado no resumo**
   - Resumo **deve** refletir exatamente o posto selecionado
   - Se não refletir = bug de produto

## Interpretação de Falhas

| Falha | Causa Provável | Ação |
|-------|----------------|------|
| Seletor não encontrado | UI mudou / classe CSS alterada | Atualizar seletor |
| Validação esperada não aparece | Bug de produto | Reportar |
| Data/horário indisponível | Ambiente/massa | Atualizar massa de dados |
| Teste passa hoje mas falha amanhã | Usa data fixa | Usar data relativa |

## Comandos Úteis

```bash
# Debug mode (abre inspector)
npm run test:debug

# UI mode (interativo)
npm run test:ui

# Lista todos os testes
npm run test:list

# Com vídeo/trace
npx playwright test --trace on
```

## Status de Maturidade

**ESTÁVEL** 🟢 - Pronto para produção e CI

Todos os testes desta pasta são considerados estáveis.

## Referências

- [ESTRATEGIA_EXECUCAO.md](../../ESTRATEGIA_EXECUCAO.md) - Classificação
- [AGENTS.md](../../AGENTS.md) - Regras gerais
- [AgendamentoHelper.ts](../helpers/AgendamentoHelper.ts) - Seleção inteligente de data/hora
