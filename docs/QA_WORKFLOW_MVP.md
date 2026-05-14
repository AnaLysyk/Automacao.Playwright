# Workflow QA MVP — Cidadão Smart / Booking

## 1. Visão Geral do MVP

Este documento descreve o workflow mínimo viável (MVP) dos papéis de QA para o projeto Cidadão Smart / Booking.

O MVP foca no essencial para demonstrar valor rapidamente, estabelecendo uma base sólida que pode ser expandida.

**Objetivo do MVP**: Ter uma suíte funcional, organizada e apresentável em 2-3 semanas.

## 2. Escopo do MVP

### 2.1 O que ENTRA no MVP

**Funcionalidades Core**:
- API smoke tests (ping, conectividade)
- Testes de localização Cidadão Smart
- Login Booking Admin
- E2E assistido básico
- Relatórios básicos

**Documentação**:
- Matriz de testes clara
- Guia de execução
- Estratégia de QA
- Contextos de negócio

**Infraestrutura**:
- Estrutura organizada
- Scripts de execução
- Configuração .env
- Relatórios Playwright

### 2.2 O que NÃO ENTRA no MVP

- Cobertura completa de regressão
- Testes de performance
- Integração CI/CD avançada
- Automação de CAPTCHA
- Testes destrutivos
- Monitoramento 24/7

## 3. Workflow dos Papéis no MVP

### 3.1 Fase 1: Planejamento (1-2 dias)

**Planner**:
- Analisa requisitos atuais
- Define escopo MVP
- Cria matriz de testes
- Estabelece prioridades

**Deliverables**:
- `docs/MATRIZ_DE_TESTES_E_EXECUCAO.md`
- Plano de execução MVP
- Critérios de aceitação

**Explorer**:
- Mapeia estrutura atual
- Identifica arquivos duplicados
- Lista dependências
- Documenta estrutura existente

**Deliverables**:
- Inventário de arquivos
- Mapa de dependências
- Lista de limpeza necessária

### 3.2 Fase 2: Organização (2-3 dias)

**Generator**:
- Cria documentos de contexto
- Estrutura pastas organizadas
- Gera .env.example
- Cria scripts package.json

**Deliverables**:
- `context/requirements/*.md`
- `docs/*.md`
- Estrutura limpa
- Scripts funcionais

**Healer** (se necessário):
- Corrige imports quebrados
- Ajusta dependências
- Limpa código não usado

### 3.3 Fase 3: Implementação Core (3-5 dias)

**Generator**:
- Cria testes API smoke
- Implementa testes de localização
- Gera login Admin básico
- Estrutura E2E assistido

**Deliverables**:
- `tests/api/smoke.spec.ts`
- `tests/cidadao-smart/localizacao.spec.ts`
- `tests/booking-admin/login.spec.ts`
- `tests/e2e/assisted.spec.ts`

**Runner**:
- Executa testes isoladamente
- Valida funcionamento básico
- Coleta primeiras evidências

**Healer**:
- Corrige falhas técnicas
- Ajusta timeouts
- Otimiza seletores

### 3.4 Fase 4: Validação e Demonstração (2-3 dias)

**Runner**:
- Executa suíte completa
- Testa cenários diferentes
- Valida estabilidade

**Reporter**:
- Gera relatórios demonstráveis
- Organiza evidências
- Cria apresentações

**Planner**:
- Valida critérios MVP
- Planeja próximos passos
- Documenta lições aprendidas

## 4. Critérios de Sucesso do MVP

### 4.1 Funcional

- [ ] API smoke roda sem erros
- [ ] Localização Cidadão Smart funciona
- [ ] Login Admin acessível
- [ ] E2E assistido executável
- [ ] Relatórios gerados

### 4.2 Qualidade

- [ ] Código organizado e comentado
- [ ] Documentação clara
- [ ] Estrutura consistente
- [ ] Sem dependências quebradas

### 4.3 Apresentabilidade

- [ ] Demo executável em 15 minutos
- [ ] Relatórios compreensíveis
- [ ] Evidências visuais
- [ ] Explicação clara do workflow

### 4.4 Escalabilidade

- [ ] Estrutura permite expansão
- [ ] Padrões estabelecidos
- [ ] Documentação atualizável
- [ ] Base para próximos passos

## 5. Timeline MVP

### Semana 1: Foundation

**Dia 1-2**: Planejamento e análise
- Criar matriz de testes
- Mapear estrutura atual
- Definir escopo MVP

**Dia 3-4**: Organização
- Criar documentos de contexto
- Estruturar pastas
- Configurar ambiente

**Dia 5**: Revisão e ajustes

### Semana 2: Core Implementation

**Dia 6-8**: API e localização
- Implementar smoke tests
- Criar testes localização
- Validar execução básica

**Dia 9-10**: Admin e E2E
- Login Admin funcional
- E2E assistido básico
- Integração inicial

**Dia 11**: Testes integrados

### Semana 3: Polish e Demo

**Dia 12-13**: Refinamento
- Correções e otimizações
- Documentação final
- Scripts de execução

**Dia 14-15**: Validação e demo
- Testes completos
- Relatórios finais
- Preparação apresentação

## 6. Deliverables MVP

### 6.1 Código

```
tests/
├── api/smoke.spec.ts
├── cidadao-smart/localizacao.spec.ts
├── booking-admin/login.spec.ts
└── e2e/assisted.spec.ts

context/requirements/
├── agendamento-presencial.md
├── booking-admin.md
├── ambientes-e-acessos.md
└── api-cidadao-booking.md

docs/
├── MATRIZ_DE_TESTES_E_EXECUCAO.md
├── ESTRATEGIA_QA.md
├── FLUXOS_AUTOMATIZADOS.md
├── GUIA_DE_EXECUCAO.md
└── QA_WORKFLOW_MVP.md
```

### 6.2 Configuração

- `.env.example` completo
- `package.json` com scripts
- `playwright.config.ts` otimizado
- README atualizado

### 6.3 Documentação

- Guia de execução prática
- Matriz de testes clara
- Estratégia de QA explicada
- Workflow MVP documentado

### 6.4 Relatórios

- Playwright report funcional
- Evidências organizadas
- Logs de execução
- Métricas básicas

## 7. Riscos e Mitigações MVP

### 7.1 Riscos Técnicos

**Dependências complexas**:
- Mitigação: Focar no essencial, adiar avançado

**Ambiente instável**:
- Mitigação: Usar ambiente 146 controlado

**Selectors frágeis**:
- Mitigação: Usar data-testid quando possível

### 7.2 Riscos de Processo

**Escopo creep**:
- Mitigação: Critérios claros de aceitação

**Dependências entre tarefas**:
- Mitigação: Workflow sequencial definido

**Falta de expertise**:
- Mitigação: Começar simples, aprender iterativamente

### 7.3 Riscos de Qualidade

**Código não testado**:
- Mitigação: Execução diária obrigatória

**Documentação incompleta**:
- Mitigação: Revisões regulares

**Estrutura inconsistente**:
- Mitigação: Padrões definidos antecipadamente

## 8. Métricas MVP

### 8.1 Quantitativas

- **Linhas de código**: ~500-800
- **Testes implementados**: 4-6 specs
- **Tempo execução**: < 5 minutos
- **Taxa de sucesso**: > 80%

### 8.2 Qualitativas

- **Facilidade de execução**: Alta
- **Compreensão do código**: Alta
- **Valor demonstrado**: Alto
- **Potencial de expansão**: Alto

### 8.3 Stakeholder

- **Satisfação liderança**: Demo impressionante
- **Confiança equipe**: Base sólida estabelecida
- **Entendimento negócio**: Contextos claros
- **Visão futuro**: Roadmap definido

## 9. Próximos Passos Pós-MVP

### 9.1 Imediato (Semana 4)

- Expandir cobertura API
- Adicionar testes dados requerente
- Melhorar relatórios
- Implementar CI básico

### 9.2 Short Term (1-2 meses)

- Cobertura completa agendamento
- Testes Admin read-only
- Automação CAPTCHA (se possível)
- Dashboard métricas

### 9.3 Medium Term (3-6 meses)

- Regressão completa
- Performance testing
- Integração produção
- Monitoramento avançado

## 10. Lições Aprendidas Esperadas

### 10.1 Técnicas

- Importância de contexto claro
- Valor de testes pequenos
- Necessidade de documentação
- Benefício de estrutura organizada

### 10.2 Processuais

- MVP acelera aprendizado
- Papéis colaborativos funcionam
- Iteração rápida é essencial
- Demonstração cria momentum

### 10.3 Estratégicas

- Focar valor sobre perfeição
- Começar pequeno, crescer orgânico
- Documentação é investimento
- Stakeholders querem ver funcionando

## 11. Conclusão

O MVP estabelece uma base sólida para automação QA no Cidadão Smart / Booking.

**Sucesso do MVP significa**:
- Suíte funcional e organizada
- Workflow de QA demonstrado
- Valor para negócio mostrado
- Base para expansão criada

**O MVP não é o fim, mas o começo de uma transformação em QA.**
