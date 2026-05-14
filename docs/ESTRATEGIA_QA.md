# Estratégia de QA — Cidadão Smart / Booking

## 1. Visão Geral

Esta estratégia define como os papéis de QA devem trabalhar de forma colaborativa e organizada para transformar este repositório em uma suíte profissional de automação E2E.

A abordagem foca em:
- planejamento estratégico;
- tomada de decisões com base no contexto;
- aprendizado a partir de execuções;
- melhoria contínua de código e documentação;
- consistência entre artefatos;
- priorização de valor de negócio.

## 2. Ciclo de vida do processo

### 2.1 Fase 1: Planejamento e organização (Atual)

**Objetivo**: Estabelecer base sólida e organizada.

**Papéis envolvidos**:
- **Planner**: Define roadmap e prioridades.
- **Explorer**: Mapeia estrutura atual e identifica gaps.
- **Generator**: Cria documentos de contexto e estrutura base.

**Deliverables**:
- Documentos de contexto limpos e separados.
- Estrutura de testes organizada.
- Matriz de testes clara.
- Scripts de execução definidos.

**Critérios de sucesso**:
- Repositório limpo e organizado.
- Contextos bem definidos.
- Testes independentes identificados.
- Ambiente configurado.

### 2.2 Fase 2: Implementação Core (Próxima)

**Objetivo**: Implementar testes estáveis e confiáveis.

**Papéis envolvidos**:
- **Generator**: Cria testes Playwright.
- **Healer**: Corrige falhas técnicas.
- **Runner**: Executa e valida testes.
- **Reporter**: Gera relatórios e evidências.

**Deliverables**:
- Testes de API funcionais.
- Testes de front pequenos e estáveis.
- E2E assistido demonstrável.
- Relatórios de execução.

**Critérios de sucesso**:
- Testes rodam sem intervenção manual (exceto E2E assistido).
- Cobertura de cenários críticos.
- Evidências completas.
- Relatórios apresentáveis.

### 2.3 Fase 3: Otimização e Expansão (Futuro)

**Objetivo**: Expandir cobertura e melhorar eficiência.

**Papéis envolvidos**:
- **Planner**: Identifica gaps e prioridades.
- **Generator**: Cria testes adicionais.
- **Healer**: Otimiza performance e robustez.
- **Reporter**: Analisa tendências e métricas.

**Deliverables**:
- Cobertura completa de regressão.
- Testes de performance.
- Integração com CI/CD.
- Dashboard de métricas.

## 3. Papéis de QA

### 3.1 Planner

**Responsabilidades**:
- Definir roadmap estratégico.
- Priorizar features por impacto e risco.
- Coordenar trabalho entre papéis.
- Validar alinhamento com objetivos de negócio.

**Comportamentos esperados**:
- Analisa o contexto antes de decidir.
- Sugere abordagens alternativas quando identifica riscos.
- Mantém foco em valor de negócio.
- Adapta o plano com base no feedback de execução.

**Exemplos de decisões**:
- "Vamos priorizar read-only no Admin porque write pode impactar ambiente compartilhado."
- "E2E assistido é melhor que automático enquanto CAPTCHA for manual."
- "Testes pequenos de front são mais estáveis que E2E gigante."

### 3.2 Explorer

**Responsabilidades**:
- Mapear estrutura atual do repositório.
- Identificar arquivos duplicados ou desatualizados.
- Descobrir dependências e relacionamentos.
- Validar conformidade com padrões.

**Comportamentos esperados**:
- Analisa profundamente antes de propor mudanças.
- Identifica padrões e anomalias.
- Sugere melhorias baseadas na descoberta.
- Documenta achados para a equipe.

**Exemplos de descobertas**:
- "Encontrou 3 arquivos de configuração similares, podemos consolidar."
- "Testes estão misturando contexto com implementação."
- "Selectors estão hardcoded, deveriam estar em arquivos separados."

### 3.3 Generator

**Responsabilidades**:
- Criar código de teste Playwright.
- Gerar Page Objects e helpers.
- Produzir documentos de contexto.
- Organizar estrutura de diretórios.

**Comportamentos esperados**:
- Gera código seguindo padrões estabelecidos.
- Reutiliza componentes existentes.
- Adapta a geração ao contexto descoberto.
- Valida consistência com a arquitetura definida.

**Exemplos de geração**:
- "Criando teste de API smoke baseado no contrato identificado."
- "Gerando Page Object para tela de localização."
- "Criando documento de contexto para Admin, separando do agendamento."

### 3.4 Healer

**Responsabilidades**:
- Corrigir falhas técnicas em testes.
- Otimizar seletores quebrados.
- Melhorar waits e timings.
- Resolver dependências ausentes.

**Comportamentos esperados**:
- Diagnostica a causa raiz da falha.
- Sugere correção técnica vs mudança de expectativa.
- Aprende com padrões de falha.
- Previne problemas similares.

**Exemplos de correções**:
- "Selector quebrou porque classe mudou, atualizando para data-testid."
- "Wait insuficiente, adicionando waitForResponse."
- "Import ausente, adicionando ao arquivo."

### 3.5 Runner

**Responsabilidades**:
- Executar testes em sequência controlada.
- Coletar evidências (screenshots, videos, traces).
- Validar ambiente antes de execução.
- Reportar status em tempo real.

**Comportamentos esperados**:
- Valida pré-condições antes de executar.
- Para execução se detectar problema de ambiente.
- Coleta evidências completas para debugging.
- Sugere melhorias com base na execução.

**Exemplos de execuções**:
- "Ambiente não acessível, abortando execução."
- "Teste falhou por timeout, coletando trace completo."
- "Sucesso, mas lento, sugerindo otimização."

### 3.6 Reporter

**Responsabilidades**:
- Gerar relatórios de execução.
- Consolidar evidências.
- Identificar tendências de falha.
- Criar dashboards e métricas.

**Comportamentos esperados**:
- Estrutura relatório por audiência (técnica vs negócio).
- Destaca insights importantes.
- Sugere ações baseadas em dados.
- Mantém histórico para análise de tendência.

**Exemplos de relatórios**:
- "80% dos testes passaram, falhas concentradas em timing."
- "Ambiente 146 teve melhor performance que 201."
- "Recomendação: implementar retry em testes de rede."

## 4. Princípios de QA

### 4.1 Autonomia com Supervisão

- Decisões técnicas são definidas pelo processo.
- Decisões de negócio requerem validação humana.
- O processo sugere opções, humanos escolhem.

### 4.2 Aprendizado Continuado

- Lições são extraídas de cada execução.
- Padrões de sucesso/falha são registrados.
- Melhorias são implementadas gradualmente.

### 4.3 Colaboração

- Contexto é compartilhado entre papéis.
- Outputs de uma fase alimentam a fase seguinte.
- Consistência é mantida ao longo do ciclo.

### 4.4 Foco em Valor

- Priorizar testes que validam regras de negócio.
- Evitar testes puramente técnicos sem impacto.
- Medir sucesso por cobertura de risco, não linhas de código.

### 4.5 Transparência

- Decisões são documentadas.
- Logs detalhados facilitam o debug.
- Relatórios ficam claros para stakeholders.

## 5. Workflow Típico

### 5.1 Planejamento

1. **Planner** analisa requisitos e contexto.
2. **Explorer** mapeia o estado atual.
3. **Planner** define próximos passos.
4. **Generator** cria plano detalhado em specs/.

### 5.2 Implementação

1. **Generator** cria código de teste.
2. **Runner** executa teste isoladamente.
3. **Healer** corrige falhas técnicas.
4. **Runner** valida a correção.

### 5.3 Validação

1. **Runner** executa a suíte completa.
2. **Reporter** gera relatório.
3. **Planner** analisa resultados.
4. **Generator** atualiza documentação.

### 5.4 Aprimoramento

1. **Reporter** identifica tendências.
2. **Planner** sugere melhorias.
3. **Generator** implementa otimizações.
4. **Healer** previne problemas conhecidos.

## 6. Comunicação Entre Papéis

### 6.1 Formatos Padronizados

- **Specs**: Planos de teste em `specs/`.
- **Context**: Documentos em `context/requirements/`.
- **Tests**: Código em `tests/`.
- **Reports**: Resultados em `test-results/`.

### 6.2 Handover Points

- **Planning → Implementation**: Specs aprovadas.
- **Implementation → Validation**: Testes criados.
- **Validation → Reporting**: Execuções completas.
- **Reporting → Planning**: Insights para próximos ciclos.

### 6.3 Feedback Loops

- **Runner → Healer**: Falhas técnicas identificadas.
- **Reporter → Planner**: Tendências descobertas.
- **Explorer → Generator**: Estrutura descoberta.
- **Healer → Generator**: Padrões de correção.

## 7. Métricas de Sucesso

### 7.1 Qualidade

- Taxa de sucesso de testes (meta: >90%).
- Tempo médio de correção de falha (meta: <30min).
- Cobertura de cenários críticos (meta: 100%).

### 7.2 Eficiência

- Tempo de geração de teste (meta: <15min por teste).
- Tempo de execução da suíte (meta: <10min).
- Redução de falhas repetidas (meta: <5%).

### 7.3 Valor de Negócio

- Tempo para detectar regressão (meta: <1h).
- Confiança na automação (meta: alta).
- Uso em decisões de negócio (meta: frequente).

## 8. Riscos e Mitigações

### 8.1 Riscos Técnicos

- **Flakiness**: Mitigação - testes pequenos, waits robustos, retries.
- **Dependência de ambiente**: Mitigação - validação pré-execução, fallbacks.
- **Mudanças de UI**: Mitigação - seletores robustos, Page Objects atualizados.

### 8.2 Riscos de Processo

- **Automação excessiva**: Mitigação - foco em valor de negócio.
- **Technical debt**: Mitigação - refactoring regular, padrões consistentes.
- **Staleness**: Mitigação - execução frequente, atualização proativa.

### 8.3 Riscos Humanos

- **Dependência excessiva**: Mitigação - documentação clara, handover suave.
- **Perda de contexto**: Mitigação - memória versionada, histórico mantido.
- **Resistência a mudança**: Mitigação - demonstrações frequentes, valor mostrado.

## 9. Roadmap de QA

### 9.1 Short Term (1-2 semanas)

- Implementar testes de API smoke.
- Criar testes de front pequenos.
- Estabelecer E2E assistido.
- Configurar relatórios automáticos.

### 9.2 Medium Term (1-2 meses)

- Expandir cobertura de regressão.
- Implementar testes de Admin read-only.
- Integrar com CI/CD básico.
- Criar dashboard de métricas.

### 9.3 Long Term (3-6 meses)

- Automação completa de regressão.
- Testes de performance integrados.
- Geração automática de testes com base em regras.
- Monitoramento 24/7 em produção.

## 10. Conclusão

A estratégia de QA transforma a prática de QA de reativa para proativa.

Uma abordagem estruturada que aprende com a execução e se adapta ao produto cria uma suíte de testes que:

- Evolui com o produto.
- Antecipar problemas.
- Fornece insights relevantes.
- Reduz tempo de feedback.
- Aumenta confiança na qualidade.

Esta não é apenas automação técnica, mas uma forma de trabalhar mais clara e sustentável.
