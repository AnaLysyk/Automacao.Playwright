# 📖 Roteiro de Leitura Recomendado

Ordem ideal para entender tudo e começar a usar.

---

## 🎯 Objetivo: Estar Pronto em 30-45 Minutos

### Tempo por Documento

| Documento | Tempo | O Que Aprende |
|-----------|-------|---------------|
| README_NOVO.md | 5 min | Visão geral |
| GUIA_EXECUCAO_PRATICO.md (Seção 1-2) | 10 min | Setup |
| CHECKLIST_PRE_EXECUCAO.md (Seção 2) | 5 min | Validar ambiente |
| CHEAT_SHEET.md | 10 min | Padrões rápidos |
| **TOTAL** | **~30 min** | **Pronto para usar!** |

---

## 📚 Roteiro por Perfil

### 👶 Sou Novo no Projeto

**Tempo total: 45 minutos**

```
1️⃣ README_NOVO.md (5 min)
   ├─ Entender o que é o projeto
   ├─ Ver estrutura geral
   └─ Entender status atual

2️⃣ GUIA_EXECUCAO_PRATICO.md (10 min)
   ├─ Seção 1: Primeiro Setup
   ├─ Seção 2: Executar Testes
   └─ Fazer setup em paralelo

3️⃣ CHECKLIST_PRE_EXECUCAO.md (5 min)
   ├─ Seção 1: Setup (já fez)
   ├─ Seção 2: Pré-execução
   └─ Marcar todos os ✓

4️⃣ Rodar npm run test:smoke (5 min)
   ├─ Validar se funciona
   ├─ Ver outputs
   └─ Celebrar! 🎉

5️⃣ CHEAT_SHEET.md (15 min)
   ├─ Copiar snippets
   ├─ Entender padrões
   └─ Estar preparado para escrever testes
```

**Resultado:** Ambiente funcionando + pronto para adicionar testes.

---

### 👤 Sou Intermediário e Vou Adicionar Testes

**Tempo total: 60 minutos**

```
0️⃣ INVENTARIO_ARQUIVOS.md (2 min)
   └─ Ver o que foi criado

1️⃣ ESTRATEGIA_EXECUCAO.md (10 min)
   ├─ Naming convention [TIPO-MOD-NUM]
   ├─ Sistema de tags
   └─ Padrões de projeto

2️⃣ MATRIZ_COBERTURA_DETALHADA.md (10 min)
   ├─ Ver testes pendentes
   ├─ Escolher qual fazer
   └─ Entender predecessores

3️⃣ CHEAT_SHEET.md (10 min)
   ├─ Copiar template
   ├─ Adaptar para seu teste
   └─ Estar pronto para coding

4️⃣ tests/seu-modulo/README.md (5 min)
   ├─ Entender contexto do módulo
   ├─ Ver padrões específicos
   └─ Começar implementação

5️⃣ Implementar novo teste (20 min)
   ├─ Criar arquivo
   ├─ Preencher padrão
   └─ Rodar com --debug

6️⃣ CHECKLIST_PRE_EXECUCAO.md (antes de push) (5 min)
   ├─ Validar código
   ├─ Validar segurança
   └─ Fazer commit
```

**Resultado:** Novo teste implementado + pronto para push.

---

### 👨‍💼 Sou Líder/Arquiteto e Vou Entender Tudo

**Tempo total: 2-3 horas (completo)**

```
1️⃣ README_NOVO.md (5 min)
   └─ Visão geral

2️⃣ PROGRESSO_SESSAO.md (10 min)
   ├─ O que foi feito
   ├─ Estatísticas
   └─ Decisões de design

3️⃣ PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md (30 min)
   ├─ Arquitetura 3 camadas
   ├─ Tipos de teste
   ├─ Estrutura de pastas
   ├─ Fases de implementação
   └─ CI/CD boundaries

4️⃣ MATRIZ_COBERTURA_DETALHADA.md (20 min)
   ├─ 95 testes mapeados
   ├─ Status de cada um
   ├─ % de cobertura por área
   └─ Próximas fases

5️⃣ SEGURANCA_CREDENCIAIS.md (15 min)
   ├─ Variáveis sensíveis
   ├─ CI/CD secrets
   ├─ Proteção de dados
   └─ Checklist segurança

6️⃣ ESTRATEGIA_EXECUCAO.md (15 min)
   ├─ Classificação de testes
   ├─ Naming convention
   ├─ Sistema de tags
   └─ CI/CD strategy

7️⃣ INDICE_NAVEGACAO_COMPLETO.md (10 min)
   ├─ Navegação cruzada
   ├─ Como encontrar tudo
   └─ Workflows recomendados

8️⃣ GUIA_EXECUCAO_PRATICO.md (20 min)
   ├─ Cenários comuns
   ├─ Troubleshooting
   └─ FAQ

9️⃣ Revisar código (30 min)
   ├─ smoke-admin.spec.ts
   ├─ smoke-smart.spec.ts
   ├─ api-smoke.spec.ts
   ├─ AuthHelper.ts
   └─ ApiHelper.ts

🔟 Revisar estrutura (20 min)
   ├─ tests/booking-admin/
   ├─ tests/smart/
   ├─ tests/api/
   └─ Validar padrões

1️⃣1️⃣ AGENTS.md (10 min)
   └─ Workflows de automação
```

**Resultado:** Compreensão completa + pronto para orientar time.

---

## 🎯 Por Objetivo Específico

### "Quero rodar testes localmente"

```
1. README_NOVO.md (Seção "2. Executar Testes Localmente")
2. GUIA_EXECUCAO_PRATICO.md (Seção "2. Executar Testes Localmente")
3. Rodar: npm run test:smoke
4. Se error: GUIA_EXECUCAO_PRATICO.md (Seção "Troubleshooting")
```

**Tempo:** 15 minutos

---

### "Quero adicionar novo teste"

```
1. ESTRATEGIA_EXECUCAO.md (naming convention)
2. MATRIZ_COBERTURA_DETALHADA.md (escolher teste)
3. CHEAT_SHEET.md (copiar template)
4. tests/seu-modulo/README.md (contexto)
5. Implementar
6. CHECKLIST_PRE_EXECUCAO.md (antes de push)
```

**Tempo:** 45 minutos

---

### "Quero entender segurança"

```
1. SEGURANCA_CREDENCIAIS.md (completo)
2. .env.example (ver variáveis)
3. tests/helpers/AuthHelper.ts (exemplo de uso)
```

**Tempo:** 30 minutos

---

### "Quero configurar CI/CD"

```
1. SEGURANCA_CREDENCIAIS.md (Seção "CI/CD")
2. PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md (Seção "CI/CD")
3. GUIA_EXECUCAO_PRATICO.md (Seção "CI (Pipeline)")
```

**Tempo:** 20 minutos

---

### "Quero encontrar algo específico"

```
1. INDICE_NAVEGACAO_COMPLETO.md (Seção "Tenho uma Dúvida")
2. Se não encontrei: usar busca ctrl+F
3. Se ainda não: INDICE_NAVEGACAO_COMPLETO.md (Seção "Localizar por Palavra-chave")
```

**Tempo:** 5-10 minutos

---

### "Quero ver tudo que foi feito"

```
1. RESUMO_EXECUTIVO_SESSAO.md (visão geral)
2. PROGRESSO_SESSAO.md (detalhado)
3. INVENTARIO_ARQUIVOS.md (lista completa)
```

**Tempo:** 20 minutos

---

## 📊 Mapa de Dependências

```
README_NOVO.md (início)
    ↓
    ├─→ GUIA_EXECUCAO_PRATICO.md
    │    └─→ CHECKLIST_PRE_EXECUCAO.md
    │
    ├─→ ESTRATEGIA_EXECUCAO.md (patterns)
    │    └─→ CHEAT_SHEET.md (snippets)
    │
    ├─→ PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md (arquitetura)
    │    └─→ MATRIZ_COBERTURA_DETALHADA.md
    │
    └─→ SEGURANCA_CREDENCIAIS.md (compliance)
         └─→ CI/CD setup
```

---

## ✅ Checklist Leitura Recomendada

### Essencial (Fazer Logo)
- [ ] README_NOVO.md
- [ ] GUIA_EXECUCAO_PRATICO.md (Seção 1-2)
- [ ] CHECKLIST_PRE_EXECUCAO.md (Seção 2)
- [ ] Rodar: npm run test:smoke

### Importante (Antes de Adicionar Testes)
- [ ] ESTRATEGIA_EXECUCAO.md
- [ ] MATRIZ_COBERTURA_DETALHADA.md
- [ ] CHEAT_SHEET.md
- [ ] README.md do seu módulo

### Contextual (Conforme Necessário)
- [ ] PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md
- [ ] SEGURANCA_CREDENCIAIS.md
- [ ] INDICE_NAVEGACAO_COMPLETO.md
- [ ] AGENTES.md

### Referência (Consultar)
- [ ] PROGRESSO_SESSAO.md
- [ ] RESUMO_EXECUTIVO_SESSAO.md
- [ ] INVENTARIO_ARQUIVOS.md

---

## 🎓 Tracklist por Experiência

### Level 1: Iniciante (45 min)

```
→ README_NOVO.md
→ GUIA_EXECUCAO_PRATICO.md (Setup)
→ npm run test:smoke
→ Comemorar! 🎉
```

**Próximo:** Ler CHEAT_SHEET.md

### Level 2: Intermediário (60 min)

```
→ ESTRATEGIA_EXECUCAO.md
→ MATRIZ_COBERTURA_DETALHADA.md
→ CHEAT_SHEET.md
→ Implementar teste novo
→ CHECKLIST_PRE_EXECUCAO.md (review)
→ Push! 🚀
```

**Próximo:** Ler PLANO_AUTOMACAO

### Level 3: Avançado (2 horas)

```
→ PLANO_AUTOMACAO_CIDADAO_BOOKING_SMART.md
→ SEGURANCA_CREDENCIAIS.md
→ INDICE_NAVEGACAO_COMPLETO.md
→ Revisar código completo
→ AGENTS.md
→ Treinar time! 👨‍🏫
```

**Próximo:** Setup CI/CD

---

## 📝 Anotações Enquanto Lê

Você pode fazer anotações em `.env.local`:

```
# Minha configuração
CIDADAO_SMART_BASE_URL=meu-url-aqui
BOOKING_ADMIN_USER=meu-user-aqui
# ... etc
```

E adicionar favoritos em seu editor (VS Code):
- Ctrl+K Ctrl+B para abrir sidebar
- Marcar arquivos como favoritos

---

## 🎯 Meta: 100% Pronto em 1 Hora

Se você seguir este roteiro rigorosamente, em 1 hora você estará:

- ✅ Ambiente configurado
- ✅ Testes smoke passando
- ✅ Pronto para rodar testes
- ✅ Pronto para adicionar novo teste
- ✅ Segurança entendida
- ✅ Padrões entendidos

**Tempo estimado:** 45 minutos (+ 15 min setup paralelo)

---

## 🚀 Próximo Passo

Após terminar o roteiro:

1. **Rodar smoke:** `npm run test:smoke`
2. **Ver que passa:** ✅
3. **Pegar café:** ☕
4. **Implementar teste novo:** 👨‍💻

---

**Última atualização:** [DATA]  
**Versão:** 1.0  
**Tempo total de leitura:** Varia por perfil (30 min - 3 horas)

🎓 **Bom aprendizado!**
