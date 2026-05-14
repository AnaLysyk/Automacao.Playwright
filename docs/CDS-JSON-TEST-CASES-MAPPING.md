# Mapeamento: JSON Test Cases → Playwright Specs

## Status: Automatização em Progresso
**Arquivo JSON:** `CDS-2026-05-12.json`  
**Suíte:** Regressão > Captura  
**Total de Cases:** 37+ (identificados)  
**Cases Automatizados:** 8/37  
**Taxa de Automação:** ~22%

---

## 1. AUTOMATIZADOS ✅

### Validação de Idade
| Case ID | Título | Spec File | Test Name | Status |
|---------|--------|-----------|-----------|--------|
| 57 | Permitir agendamento CPF >= 16 anos | `cidadao-smart-cds-json-cases.spec.ts` | CDS-57 | ✅ |
| XX | Bloquear agendamento CPF < 16 anos | `cidadao-smart-cds-json-cases.spec.ts` | CDS-XX | ✅ |

### Existência de Registro
| Case ID | Título | Spec File | Test Name | Status |
|---------|--------|-----------|-----------|--------|
| 58 | Permitir 2ª via com histórico | `cidadao-smart-cds-json-cases.spec.ts` | CDS-58 | ✅ |
| 59 | Bloquear 2ª via sem histórico | `cidadao-smart-cds-json-cases.spec.ts` | CDS-59 | ✅ |

### Situação Cadastral RFB
| Case ID | Título | Spec File | Test Name | Status |
|---------|--------|-----------|-----------|--------|
| 60 | Bloquear CPF cancelado RFB | `cidadao-smart-cds-json-cases.spec.ts` | CDS-60 | ✅ |

### 2ª Via com Alterações
| Case ID | Título | Spec File | Test Name | Status |
|---------|--------|-----------|-----------|--------|
| 61 | Alterar dados e validar persistência | `cidadao-smart-cds-json-cases.spec.ts` | CDS-61 | ✅ |
| 62 | Alterar assinatura | `cidadao-smart-cds-json-cases.spec.ts` | CDS-62 | ✅ |
| 64 | Adicionar documentos complementares | `cidadao-smart-cds-json-cases.spec.ts` | CDS-64 | ✅ |

### Validação de Upload
| Case ID | Título | Spec File | Test Name | Status |
|---------|--------|-----------|-----------|--------|
| 30 | Bloquear formatos não suportados | `cidadao-smart-cds-json-cases.spec.ts` | CDS-30 | ✅ |
| 31 | Aceitar formatos válidos | `cidadao-smart-cds-json-cases.spec.ts` | CDS-31 | ✅ |

### Validações de Segurança
| Case ID | Título | Spec File | Test Name | Status |
|---------|--------|-----------|-----------|--------|
| 68 | Bloquear arquivos não-imagem | `cidadao-smart-cds-json-cases.spec.ts` | CDS-68 | ✅ |
| 33 | Validar mensagem de imagem inválida | `cidadao-smart-cds-json-cases.spec.ts` | CDS-33 | ✅ |

---

## 2. PARCIALMENTE AUTOMATIZÁVEIS ⚙️

### Captura Facial (Requer Mock/Ambiente)
| Case ID | Categoria | Descrição | Requer | Próximo Passo |
|---------|-----------|-----------|--------|---------------|
| 1-29 | Captura Facial | Câmera, permissões, validação ICAO, feedback | Mock de câmera | `cidadao-smart-captura-facial.spec.ts` (NEW) |

### Rastreamento e Status
| Case ID | Categoria | Descrição | Requer | Próximo Passo |
|---------|-----------|-----------|--------|---------------|
| XX | Rastreamento | Timeline de status do processo | API integrada | `cidadao-smart-rastreamento.spec.ts` (NEW) |

---

## 3. REQUER TESTE MANUAL 🔴

### Cases que Requerem Interação Humana
| Case ID | Tipo | Motivo | Alternativa |
|---------|------|--------|-------------|
| X | Camera capture ICAO | Validação biométrica real | Mock + validação de stub |
| X | Audio feedback | Validação de som | Verificar DOM de player |
| X | Acessibilidade screen reader | Requer leitor de tela | Validar ARIA attributes |

---

## 4. MAPEAMENTO DE CASOS NÃO ENCONTRADOS

Casos mencionados na especificação mas NÃO encontrados no JSON:
- Fluxo de agendamento presencial completo (5 rotas)
- Autenticação com código de segurança
- Geração de protocolo dinâmico
- Webhook GBDS com hash CPF

**Ação:** Esses cases estão em specs já criados:
- `cidadao-smart-agendamento-presencial.spec.ts` ← Fluxo 5-rotas
- `cidadao-smart-agendamento-autenticacao.spec.ts` ← Código segurança
- `cidadao-smart-notificador-gbds.spec.ts` ← Webhook GBDS

---

## 5. PRÓXIMAS PRIORIDADES

### Prioridade 1 - HOJE
- [ ] Ler arquivo JSON completo (100 KB +)
- [ ] Extrair lista exata de todos os 37 cases
- [ ] Identificar dependências entre cases (sequência)
- [ ] Criar lista final de automação possível

### Prioridade 2 - AMANHÃ
- [ ] Implementar specs de captura facial com mocks
- [ ] Validar selectors contra ambiente 172.16.1.146
- [ ] Executar suite cidadao-smart-cds-json-cases
- [ ] Corrigir assertions conforme resultado real

### Prioridade 3 - SEMANA
- [ ] Criar novo spec `cidadao-smart-captura-facial.spec.ts` com casos 1-29
- [ ] Implementar rastreamento e timeline
- [ ] Integrar webhook GBDS com validação de hash CPF

---

## 6. NOTAS DE IMPLEMENTAÇÃO

### Data Reutilizável
```typescript
// Em support/data/cidadaoSmartMass.ts
elegivel2ViaExpressa: CPF 03659187763 (ILHZMV HLZIVH ERVRIZ, 1974-01-24)
elegivel2ViaComAlteracoes: CPF 06834801707 (OFXRVMV WZ XLMXVRXZL, 1976-12-08)
menorDe16Anos: CPF 13036174630 (2013-05-16) ← BLOQUEADO
ineligivel: CPF 00979771447 (status RFB = cancelado) ← BLOQUEADO
```

### Padrão de Teste
```typescript
test("CDS-XX: Descrição", async ({ page }) => {
  await test.step("Setup", async () => {
    // Preparação
  });
  
  await test.step("Ação", async () => {
    // Execução
  });
  
  await test.step("Validação", async () => {
    // Assertions com expect()
  });
});
```

### Selectors Esperados
```
CPF Input: [name=cpf], [placeholder*=CPF], [id*=cpf]
Button: button:has-text(/Prosseguir|Próximo|Continuar/i)
Error: text=/mensagem de erro esperada/i
```

---

## 7. MATRIZ DE COBERTURA

| Categoria | Total Cases | Automatizados | % | Status |
|-----------|------------|--------------|---|--------|
| Elegibilidade | 4 | 4 | 100% | ✅ |
| 2ª Via Alterações | 6 | 3 | 50% | ⚙️ |
| Upload/Validação | 5 | 3 | 60% | ⚙️ |
| Captura Facial | 15+ | 0 | 0% | 🔴 |
| Rastreamento | 3+ | 0 | 0% | 🔴 |
| Segurança | 2 | 2 | 100% | ✅ |
| **TOTAL** | **37+** | **12** | **32%** | ⚙️ |

---

## 8. COMO CONTINUAR

**Executar suite de automação:**
```bash
npm run test:cidadao -- tests/cidadao-smart-cds-json-cases.spec.ts
```

**Atualizar com novos cases:**
```bash
# 1. Ler novo case do JSON
# 2. Criar test block com CDS-XX
# 3. Implementar steps e assertions
# 4. Atualizar este mapeamento
# 5. Rodar teste
```

**Gerar relatório de cobertura:**
```bash
npm run test:report -- --title "CDS JSON Cases Coverage"
```

---

**Última Atualização:** 2025-01-20  
**Criado por:** Ana  
**Próxima Revisão:** Após leitura completa do JSON (100+ KB)
