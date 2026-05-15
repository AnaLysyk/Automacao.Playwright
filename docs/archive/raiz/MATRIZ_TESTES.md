# Matriz de Testes - Mapa do Repositório

Este documento é um mapa de **todos os testes** no repositório, classificação, onde rodamm e status de maturidade.

---

## Agendamento Presencial (Regressão - ESTÁVEL)

| ID | Nome | Arquivo | Manual? | CI? | Maturidade | Tags |
|----|------|---------|---------|-----|-----------|------|
| SMOKE-AGP-001 | Home com link agendamento | smoke/home.spec.ts | Não | Sim | Estável | @smoke @home @agendamento |
| REG-AGP-LOCAL-001 | Validar busca por cidade | agendamento-presencial/local.spec.ts | Não | Sim | Estável | @regressao @local @agendamento |
| REG-AGP-LOCAL-002 | Validar seleção de posto | agendamento-presencial/local.spec.ts | Não | Sim | Estável | @regressao @local @agendamento |
| REG-AGP-LOCAL-003 | Validar que não selecionou errado | agendamento-presencial/local.spec.ts | Não | Sim | Estável | @regressao @local @agendamento |
| REG-AGP-DH-VALID-001 | Nome com uma palavra bloqueado | agendamento-presencial/validacoes.spec.ts | Não | Sim | Estável | @regressao @validacao @agendamento |
| REG-AGP-DH-VALID-002 | CPF vazio permitido | agendamento-presencial/validacoes.spec.ts | Não | Sim | Estável | @regressao @validacao @agendamento |
| REG-AGP-DH-VALID-003 | Telefone obrigatório | agendamento-presencial/validacoes.spec.ts | Não | Sim | Estável | @regressao @validacao @agendamento |
| REG-AGP-DH-VALID-004 | Menor de 16 anos bloqueado | agendamento-presencial/validacoes.spec.ts | Não | Sim | Estável | @regressao @validacao @agendamento |
| REG-AGP-DH-001 | Selecionar primeira data | agendamento-presencial/data-hora.spec.ts | Não | Sim | Estável | @regressao @data-hora @agendamento |
| REG-AGP-DH-002 | Selecionar primeiro horário | agendamento-presencial/data-hora.spec.ts | Não | Sim | Estável | @regressao @data-hora @agendamento |
| REG-AGP-RES-001 | Validar resumo Top Tower | agendamento-presencial/resumo.spec.ts | Não | Sim | Estável | @regressao @resumo @agendamento |
| REG-AGP-AUTH-001 | Código de segurança obrigatório | agendamento-presencial/autenticacao.spec.ts | Não | Sim | Estável | @regressao @auth @agendamento |

---

## Emissão Online (Regressão - ESTÁVEL)

| ID | Nome | Arquivo | Manual? | CI? | Maturidade | Tags |
|----|------|---------|---------|-----|-----------|------|
| REG-EMI-TIPO-001 | Seleção de tipo | emissao-online/tipo.spec.ts | Não | Sim | Estável | @regressao @tipo @emissao |
| REG-EMI-CAPT-001 | Upload de documento válido | emissao-online/captura.spec.ts | Não | Sim | Estável | @regressao @captura @emissao |
| REG-EMI-CAPT-002 | Upload de formato inválido | emissao-online/captura.spec.ts | Não | Sim | Estável | @regressao @captura @emissao |
| REG-EMI-CAPT-003 | Upload de não-imagem | emissao-online/captura.spec.ts | Não | Sim | Estável | @regressao @captura @emissao |
| REG-EMI-RES-001 | Validar resumo | emissao-online/resumo.spec.ts | Não | Sim | Estável | @regressao @resumo @emissao |
| REG-EMI-AUTH-001 | Código de segurança | emissao-online/autenticacao.spec.ts | Não | Sim | Estável | @regressao @auth @emissao |

---

## Consulta (Regressão - ESTÁVEL)

| ID | Nome | Arquivo | Manual? | CI? | Maturidade | Tags |
|----|------|---------|---------|-----|-----------|------|
| REG-CONS-PED-001 | Consulta de pedido | consulta/consulta-pedido.spec.ts | Não | Sim | Estável | @regressao @consulta @pedido |
| REG-CONS-AGEN-001 | Consulta de agendamento | consulta/consulta-agendamento.spec.ts | Não | Sim | Estável | @regressao @consulta @agendamento |

---

## 2 Via (Regressão - ESTÁVEL)

| ID | Nome | Arquivo | Manual? | CI? | Maturidade | Tags |
|----|------|---------|---------|-----|-----------|------|
| REG-2V-EXP-001 | 2 Via Expressa | 2via/2via-expressa.spec.ts | Não | Sim | Estável | @regressao @2via @expressa |
| REG-2V-ALT-001 | 2 Via com Alterações | 2via/2via-alteracoes.spec.ts | Não | Sim | Estável | @regressao @2via @alteracoes |

---

## API (Regressão - ESTÁVEL)

| ID | Nome | Arquivo | Manual? | CI? | Maturidade | Tags |
|----|------|---------|---------|-----|-----------|------|
| API-NOTIF-001 | Webhook dispara | api/notificador-gbds.spec.ts | Não | Sim | Estável | @api @notificador @webhook |
| API-NOTIF-002 | Status mapping | api/notificador-gbds.spec.ts | Não | Sim | Estável | @api @notificador @status |
| API-NOTIF-003 | Rejeição notificada | api/notificador-gbds.spec.ts | Não | Sim | Estável | @api @notificador @erro |
| API-NOTIF-004 | CPF não em plaintext | api/notificador-gbds.spec.ts | Não | Sim | Estável | @api @notificador @seguranca |

---

## E2E (Fluxo Completo - INSTÁVEL)

| ID | Nome | Arquivo | Manual? | CI? | Maturidade | Tags |
|----|------|---------|---------|-----|-----------|------|
| E2E-AGP-001 | Agendamento completo | e2e/agendamento-presencial-fluxo-completo.spec.ts | Não | Talvez | Instável | @e2e @agendamento |
| E2E-EMI-001 | Emissão completa | e2e/emissao-online-fluxo-completo.spec.ts | Não | Talvez | Instável | @e2e @emissao |
| E2E-CDS-57 | CDS-57: Idade >= 16 | e2e/agendamento-json-cases.spec.ts | Não | Talvez | Instável | @e2e @cds @idade |
| E2E-CDS-58 | CDS-58: Histórico emissão | e2e/agendamento-json-cases.spec.ts | Não | Talvez | Instável | @e2e @cds @historico |

---

## Manual/Demo (Assistido - ASSISTIDO)

| ID | Nome | Arquivo | Manual? | CI? | Maturidade | Tags |
|----|------|---------|---------|-----|-----------|------|
| DEMO-AGP-001 | Fluxo completo com CAPTCHA | manual-assisted/demo-fluxo-completo-email.spec.ts | **Sim** | **Não** | Assistido | @demo @manual @agendamento @captcha |
| DEMO-PASSO-001 | Demo passo a passo | manual-assisted/demo-passo-a-passo.spec.ts | **Sim** | **Não** | Assistido | @demo @manual @passo-a-passo |

---

## Legenda

### Manual?
- **Não** = Totalmente automático
- **Sim** = Requer intervalo humano (CAPTCHA, email, etc)

### CI?
- **Sim** = Roda em pipeline CI
- **Não** = Apenas local
- **Talvez** = Pode rodar com tolerância a falha

### Maturidade
- **Estável** 🟢 = Pronto para produção, confiável 99%+
- **Instável** 🟡 = Pode falhar por razões externas (agenda, email, etc)
- **Assistido** 🟣 = Requer ação humana, apenas demonstração

### Tags
Usado para filtrar com `--grep`

---

## Resumo por Tipo

### SMOKE (Rápidos) 
1 teste | Execução: < 5s | CI: Sim
```bash
npm run test:smoke
```

### REGRESSÃO (Automáticos Estáveis)
18 testes | Execução: ~20-30min | CI: Sim
```bash
npm run test:regressao
```

### E2E (Fluxos Completos)
4 testes | Execução: ~15-20min | CI: Talvez
```bash
npm run test:e2e
```

### DEMO (Assistidos)
2 testes | Execução: ~10-20min | CI: Não
```bash
npm run test:demo
```

### API (Backend)
4 testes | Execução: ~5-10min | CI: Sim
```bash
npm run test:api
```

---

## Distribuição

```
TOTAL: 29 testes

Automáticos Estáveis (CI): 23 testes (79%)
├─ Smoke: 1
├─ Regressão: 18
└─ API: 4

Fluxo Completo (Talvez CI): 4 testes (14%)
└─ E2E: 4

Assistidos (Sem CI): 2 testes (7%)
└─ Demo: 2
```

---

## Referências Rápidas

| Preciso... | Comando |
|-----------|---------|
| Verificar se está tudo OK | `npm run test:ci` |
| Rodar regressão completa | `npm run test:regressao` |
| Rodar E2E se agenda permitir | `npm run test:e2e` |
| Demonstrar para cliente | `npm run test:demo` |
| Testar apenas agendamento | `npx playwright test --grep @agendamento` |
| Testar apenas API | `npm run test:api` |
| Listar todos os testes | `npm run test:list` |

---

## Próximas Adições

- [ ] Testes SMOKE adicionais (home, consulta, validações)
- [ ] Testes de validação de segurança
- [ ] Testes de performance
- [ ] Testes de acessibilidade
- [ ] Testes de compatibilidade entre browsers

---

## Atualização

Última atualização: 12/05/2026

Para manter matriz sempre atualizada:
1. Quando criar novo teste, adicionar linha aqui
2. Respeitar padrão de nomeação `[TIPO-MOD-NUM]`
3. Incluir tags no teste
4. Atualizar categoria correspondente

---

## Documentação

- [ESTRATEGIA_EXECUCAO.md](ESTRATEGIA_EXECUCAO.md) - Classificações detalhadas
- [AGENTS.md](AGENTS.md) - Regras gerais
- [ESTRUTURA_TESTES.md](ESTRUTURA_TESTES.md) - Guia rápido
- `tests/*/README.md` - Documentação por pasta
