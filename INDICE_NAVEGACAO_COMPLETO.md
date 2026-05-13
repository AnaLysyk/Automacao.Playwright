# 🗺️ Mapa de Navegação - Onde Encontrar Tudo

Use este arquivo para navegar a documentação rapidamente.

---

## 🎯 Tenho uma Dúvida Específica

### "Como faço para..."

| Pergunta | Resposta |
|----------|---------|
| ...rodar testes? | → [GUIA_EXECUCAO_PRATICO.md](GUIA_EXECUCAO_PRATICO.md) |
| ...validar ambiente? | → [CHECKLIST_PRE_EXECUCAO.md](CHECKLIST_PRE_EXECUCAO.md) |
| ...adicionar novo teste? | → [ESTRATEGIA_EXECUCAO.md](ESTRATEGIA_EXECUCAO.md) |
| ...gerenciar credenciais? | → [SEGURANCA_CREDENCIAIS.md](SEGURANCA_CREDENCIAIS.md) |
| ...entender arquitetura? | → [PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md](PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md) |
| ...debugar teste que falha? | → [GUIA_EXECUCAO_PRATICO.md#troubleshooting](GUIA_EXECUCAO_PRATICO.md) |
| ...copiar comando rápido? | → [CHEAT_SHEET.md](CHEAT_SHEET.md) |
| ...saber a cobertura? | → [MATRIZ_COBERTURA_DETALHADA.md](MATRIZ_COBERTURA_DETALHADA.md) |
| ...entender pastas? | → [ESTRUTURA_TESTES.md](ESTRUTURA_TESTES.md) |
| ...usar agentes? | → [AGENTS.md](AGENTS.md) |

---

## 🗂️ Por Tipo de Documento

### 📚 Documentação Principal (Comece Aqui)

```
1. README_NOVO.md
   ├─ Visão geral do projeto
   ├─ Status atual
   └─ Quick links
   
2. GUIA_EXECUCAO_PRATICO.md
   ├─ Setup inicial
   ├─ Como rodar testes
   ├─ Cenários comuns
   └─ Troubleshooting
   
3. CHECKLIST_PRE_EXECUCAO.md
   ├─ Validar ambiente
   ├─ Evitar problemas
   └─ Métricas de saúde
```

### 📋 Planejamento & Estratégia

```
4. PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md
   ├─ Arquitetura 3 camadas
   ├─ Tipos de teste
   ├─ Estrutura de pastas
   ├─ Fases de implementação
   └─ CI/CD boundaries
   
5. MATRIZ_COBERTURA_DETALHADA.md
   ├─ Status de cada teste
   ├─ Mapeamento ticket→teste
   ├─ % de cobertura
   └─ Próximos passos

6. ESTRATEGIA_EXECUCAO.md
   ├─ Classificação de testes
   ├─ Naming convention
   ├─ Sistema de tags
   └─ CI/CD strategy
```

### 🔐 Segurança & Ambiente

```
7. SEGURANCA_CREDENCIAIS.md
   ├─ Variáveis sensíveis
   ├─ Integração CI/CD
   ├─ Proteção de dados
   └─ Checklist segurança
   
8. .env.example
   ├─ Variáveis necessárias
   ├─ Valores padrão
   └─ Documentação por seção
```

### 📁 Estrutura & Organização

```
9. ESTRUTURA_TESTES.md
   ├─ Explicação de pastas
   ├─ Por que esta org
   └─ Manutenção de pastas
   
10. INDICE_NAVEGACAO.md (Este arquivo)
    ├─ Navegação cruzada
    ├─ Índice por tópico
    └─ Quick reference
```

### 🤖 Workflows & Automação

```
11. AGENTS.md
    ├─ Workflow de agentes
    ├─ Como usar agentes
    └─ Regras de automação
```

### 🧾 Referência Rápida

```
12. CHEAT_SHEET.md
    ├─ Comandos npm
    ├─ Snippets de código
    ├─ Padrões comuns
    └─ Troubleshooting mini
```

### 📊 Relatórios & Status

```
13. PROGRESSO_SESSAO.md
    ├─ O que foi feito
    ├─ Estatísticas
    ├─ Próximas ações
    └─ Métricas
    
14. STATUS_FINAL.md (se existir)
    ├─ Estado final do projeto
    ├─ Lições aprendidas
    └─ Recomendações
```

---

## 🧪 Por Tipo de Teste

### Smoke (Rápido)

```
📁 tests/smoke/
   └─ cidadao-home.spec.ts
   
🔗 Ver: tests/smoke/README.md
📖 Documentar em: ESTRATEGIA_EXECUCAO.md
```

### Cidadão Smart

```
📁 tests/cidadao-smart/
   ├─ agendamento-presencial/
   │  └─ cidadao-smart-agendamento-presencial.spec.ts
   ├─ segunda-via-expressa/
   ├─ consulta-pedido/
   └─ README.md
   
🔗 Ver: tests/cidadao-smart/README.md
📖 Implementar: [AGP-FLOW-001], [EXPR-FLOW-001], etc
```

### Booking/Admin

```
📁 tests/booking-admin/
   ├─ smoke-admin.spec.ts
   ├─ agendamentos/
   ├─ postos/
   ├─ agenda/
   └─ README.md
   
🔗 Ver: tests/booking-admin/README.md
📖 Implementar: [ADMIN-LOGIN-*], [ADMIN-POSTO-*], etc
```

### SMART Interno

```
📁 tests/smart/
   ├─ smoke-smart.spec.ts
   ├─ processos-civis/
   ├─ captura-biometrica/
   ├─ pagamento/
   └─ README.md
   
🔗 Ver: tests/smart/README.md
📖 Implementar: [SMART-LOGIN-*], [SMART-CAP-*], etc
```

### API

```
📁 tests/api/
   ├─ api-smoke.spec.ts
   ├─ cidadao/
   ├─ booking/
   ├─ smart/
   ├─ notifier/
   └─ README.md
   
🔗 Ver: tests/api/README.md
📖 Implementar: [API-AUTH-*], [API-CID-*], etc
```

### E2E

```
📁 tests/e2e/
   ├─ cidadao-booking/
   ├─ cidadao-smart/
   └─ booking-smart-cidadao/
   
🔗 Ver: tests/e2e/README.md
📖 Implementar: [E2E-BOOKING-CID-*], etc
```

### Manual

```
📁 tests/manual-assisted/
   ├─ captcha/
   ├─ smart-hardware/
   └─ README.md
   
🔗 Ver: tests/manual-assisted/README.md
📖 Usar com: npm run test:manual -- --headed
```

---

## 🎓 Por Nível de Experiência

### 👶 Iniciante

**Quer começar?**

1. Ler: [README_NOVO.md](README_NOVO.md)
2. Fazer: [GUIA_EXECUCAO_PRATICO.md](GUIA_EXECUCAO_PRATICO.md) (Seção "Primeiro Setup")
3. Validar: [CHECKLIST_PRE_EXECUCAO.md](CHECKLIST_PRE_EXECUCAO.md)
4. Rodar: `npm run test:smoke`

**Próximo:** [CHEAT_SHEET.md](CHEAT_SHEET.md) para copiar padrões.

### 👤 Intermediário

**Quer adicionar testes?**

1. Ler: [ESTRATEGIA_EXECUCAO.md](ESTRATEGIA_EXECUCAO.md) (padrões)
2. Revisar: [MATRIZ_COBERTURA_DETALHADA.md](MATRIZ_COBERTURA_DETALHADA.md) (cobertura)
3. Copiar: [CHEAT_SHEET.md](CHEAT_SHEET.md) (snippets)
4. Implementar: Novo arquivo em `tests/seu-modulo/`

**Próximo:** Revisar PR com cheklist de [CHECKLIST_PRE_EXECUCAO.md](CHECKLIST_PRE_EXECUCAO.md).

### 👨‍💼 Avançado

**Quer entender arquitetura?**

1. Ler: [PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md](PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md)
2. Revisar: [SEGURANCA_CREDENCIAIS.md](SEGURANCA_CREDENCIAIS.md)
3. Estudar: [AGENTS.md](AGENTS.md) (workflows)
4. Expandir: Implementar fase seguinte da [MATRIZ_COBERTURA_DETALHADA.md](MATRIZ_COBERTURA_DETALHADA.md)

**Próximo:** Preparar CI/CD conforme [SEGURANCA_CREDENCIAIS.md](SEGURANCA_CREDENCIAIS.md).

---

## 🔄 Workflows Recomendados

### Workflow: Rodar Testes Localmente

```
1. Abrir CHECKLIST_PRE_EXECUCAO.md
   ✓ Validar todos os ✓
   
2. Abrir GUIA_EXECUCAO_PRATICO.md
   ✓ Escolher tipo de teste (Smoke, Regressão, etc)
   
3. Executar comando
   npm run test:smoke  (ou outro)
   
4. Revisar PROGRESSO_SESSAO.md se fácil problemas
   
5. Se falhar, debugar com:
   npm run test -- --debug
```

### Workflow: Adicionar Novo Teste

```
1. Revisar MATRIZ_COBERTURA_DETALHADA.md
   ✓ Encontrar teste pendente: [XYZ-MOD-001]
   
2. Ler ESTRATEGIA_EXECUCAO.md
   ✓ Entender naming convention
   ✓ Entender sistema de tags
   
3. Copiar template do CHEAT_SHEET.md
   ✓ Criar arquivo em tests/seu-modulo/nome.spec.ts
   ✓ Adicionar ID e tags
   
4. Rodar teste novo
   npm run test:regressao -- --grep "\[XYZ-MOD-001\]"
   
5. Se passar, atualizar MATRIZ_COBERTURA_DETALHADA.md
   ✓ Mudar status para ✅
```

### Workflow: Debugar Teste que Falha

```
1. Ver erro no terminal
   
2. Revisar GUIA_EXECUCAO_PRATICO.md seção Troubleshooting
   
3. Se seletor, rodar com debug:
   npm run test -- --grep "\[ID-TESTE\]" --debug
   
4. Em DevTools:
   → Pausar execução
   → Inspecionar DOM
   → Atualizar seletor
   
5. Atualizar arquivo de teste
   
6. Rodar novamente
```

### Workflow: Fazer Push com Confiança

```
1. Revisar CHECKLIST_PRE_EXECUCAO.md
   ✓ Ambiente está ok?
   
2. Rodar testes:
   npm run test:smoke
   npm run test:regressao
   
3. Se passar, commit:
   git add .
   git commit -m "feat: novo teste [ID]"
   git push
   
4. CI/CD roda automaticamente
   → Revisar SEGURANCA_CREDENCIAIS.md se tiver dúvida
```

---

## 📊 Documentos por Prioridade

### 🔴 Essencial (Ler Primeiro)

1. [README_NOVO.md](README_NOVO.md) - Visão geral
2. [GUIA_EXECUCAO_PRATICO.md](GUIA_EXECUCAO_PRATICO.md) - Como usar
3. [CHECKLIST_PRE_EXECUCAO.md](CHECKLIST_PRE_EXECUCAO.md) - Validar

### 🟡 Importante (Ler Antes de Adicionar Testes)

4. [ESTRATEGIA_EXECUCAO.md](ESTRATEGIA_EXECUCAO.md) - Padrões
5. [CHEAT_SHEET.md](CHEAT_SHEET.md) - Snippets rápidos
6. [MATRIZ_COBERTURA_DETALHADA.md](MATRIZ_COBERTURA_DETALHADA.md) - O que falta

### 🟢 Contextual (Ler Conforme Necessário)

7. [PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md](PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md) - Arquitetura
8. [SEGURANCA_CREDENCIAIS.md](SEGURANCA_CREDENCIAIS.md) - CI/CD
9. [ESTRUTURA_TESTES.md](ESTRUTURA_TESTES.md) - Pastas
10. [AGENTS.md](AGENTS.md) - Workflows avançados

### ⚪ Referência (Consultar Conforme Necessário)

11. [PROGRESSO_SESSAO.md](PROGRESSO_SESSAO.md) - O que foi feito
12. [INDICE_NAVEGACAO.md](INDICE_NAVEGACAO.md) - Este arquivo

---

## 🆘 Situações Emergenciais

### "Teste falha no CI mas passa local"

1. Revisar: [CHECKLIST_PRE_EXECUCAO.md](CHECKLIST_PRE_EXECUCAO.md) → Ambiente diferente?
2. Revisar: [SEGURANCA_CREDENCIAIS.md](SEGURANCA_CREDENCIAIS.md) → Secrets faltando?
3. Executar: `npm run test:ci` localmente para reproduzir

### "Credencial vazou em código"

1. Avisar time imediatamente
2. Revogar credencial no Booking/Admin/SMART
3. Criar nova credencial
4. Remover do histórico git: `git filter-branch`
5. Ler: [SEGURANCA_CREDENCIAIS.md](SEGURANCA_CREDENCIAIS.md)

### "Qual teste devo rodar antes de push?"

→ [GUIA_EXECUCAO_PRATICO.md](GUIA_EXECUCAO_PRATICO.md) Seção "Fluxo Recomendado"

### "Como debugar CAPTCHA?"

→ [CHEAT_SHEET.md](CHEAT_SHEET.md) ou [GUIA_EXECUCAO_PRATICO.md](GUIA_EXECUCAO_PRATICO.md)

### "Teste está muito lento"

→ [CHECKLIST_PRE_EXECUCAO.md](CHECKLIST_PRE_EXECUCAO.md) e aumentar timeouts em `.env.local`

---

## 🎯 Localizar Informação Rápido

### Por Palavra-Chave

| Palavra-chave | Documento |
|---------------|-----------|
| setup | GUIA_EXECUCAO_PRATICO.md |
| checklist | CHECKLIST_PRE_EXECUCAO.md |
| segurança | SEGURANCA_CREDENCIAIS.md |
| naming | ESTRATEGIA_EXECUCAO.md |
| cobertura | MATRIZ_COBERTURA_DETALHADA.md |
| arquitetura | PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md |
| estrutura | ESTRUTURA_TESTES.md |
| agentes | AGENTS.md |
| rápido | CHEAT_SHEET.md |

### Por Sistema

| Sistema | Arquivo README | Testes |
|---------|---------------|--------|
| Cidadão | tests/cidadao-smart/README.md | cidadao-smart/*.spec.ts |
| Admin | tests/booking-admin/README.md | booking-admin/*.spec.ts |
| SMART | tests/smart/README.md | smart/*.spec.ts |
| API | tests/api/README.md | api/*.spec.ts |

---

## 📞 Precisa de Ajuda?

1. **Tenho uma dúvida:** Procure na tabela "Tenho uma Dúvida Específica" acima
2. **Não encontrei:** Procure por palavra-chave em "Localizar Informação Rápido"
3. **Ainda não:** Revise [README_NOVO.md](README_NOVO.md) Quick Links
4. **Continuei perdido:** Abra issue com sua pergunta

---

**Última atualização:** [DATA]  
**Versão:** 2.0  
**Status:** 🟢 Completo

Feliz navegação! 🗺️
