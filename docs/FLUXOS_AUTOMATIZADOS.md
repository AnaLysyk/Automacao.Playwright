# Fluxos Automatizados — Cidadão Smart / Booking

## 1. Visão Geral dos Fluxos

Este documento descreve os fluxos automatizados implementados e planejados para o Cidadão Smart / Booking.

Os fluxos são categorizados por:

- **Tipo**: API, Front, E2E, Admin
- **Estabilidade**: Estável, Em desenvolvimento, Planejado
- **Intervenção**: Automático, Assistido, Manual
- **Ambiente**: 146, 201, 200

## 2. Fluxos de API

### 2.1 API Smoke Tests

**Objetivo**: Validar conectividade e contratos básicos.

**Status**: Em desenvolvimento

**Arquivos**:
- `tests/api/smoke.spec.ts`

**Cenários**:
- Ping/Health check
- Autenticação básica
- Resposta de erro controlada

**Execução**:
```bash
npm run test:api:smoke
```

**Intervenção**: Automática

**Ambiente**: Todos

### 2.2 API Utilitários

**Objetivo**: Validar serviços de apoio (CEP, cidades).

**Status**: Planejado

**Arquivos**:
- `tests/api/utilities.spec.ts`

**Cenários**:
- Consulta de CEP válido
- Consulta de CEP inválido
- Listagem de cidades
- Validação de formatos

**Execução**:
```bash
npm run test:api:utilities
```

**Intervenção**: Automática

**Ambiente**: 146, 200

### 2.3 API Postos

**Objetivo**: Validar gestão de postos via API.

**Status**: Planejado

**Arquivos**:
- `tests/api/postos.spec.ts`

**Cenários**:
- Listar postos ativos
- Filtrar por cidade
- Validar dados do posto
- Verificar sincronização

**Execução**:
```bash
npm run test:api:postos
```

**Intervenção**: Automática

**Ambiente**: 146, 200

### 2.4 API Agendamentos

**Objetivo**: Validar operações de agendamento via API.

**Status**: Planejado

**Arquivos**:
- `tests/api/agendamentos.spec.ts`

**Cenários**:
- Consultar agendamento por protocolo
- Validar status do agendamento
- Verificar histórico
- Testar cancelamento (se permitido)

**Execução**:
```bash
npm run test:api:agendamentos
```

**Intervenção**: Automática (read-only)

**Ambiente**: 146, 200

## 3. Fluxos de Front (Agendamento Presencial)

### 3.1 Localização

**Objetivo**: Validar tela inicial de localização.

**Status**: Em desenvolvimento

**Arquivos**:
- `tests/cidadao-smart/localizacao.spec.ts`

**Cenários**:
- Carregar página inicial
- Buscar por cidade
- Buscar por CEP válido
- Buscar por CEP inválido
- Selecionar posto disponível

**Execução**:
```bash
npm run test:front:localizacao
```

**Intervenção**: Automática

**Ambiente**: 146

### 3.2 Dados do Requerente

**Objetivo**: Validar formulário de dados pessoais.

**Status**: Planejado

**Arquivos**:
- `tests/cidadao-smart/dados-requerente.spec.ts`

**Cenários**:
- Preencher nome válido
- Validar nome obrigatório
- Validar nome com uma palavra (erro)
- Validar telefone
- Validar e-mail
- Validar CPF opcional
- Validar menor de idade

**Execução**:
```bash
npm run test:front:requerente
```

**Intervenção**: Automática

**Ambiente**: 146

### 3.3 Data e Hora

**Objetivo**: Validar seleção de agendamento.

**Status**: Planejado

**Arquivos**:
- `tests/cidadao-smart/data-hora.spec.ts`

**Cenários**:
- Abrir modal de data
- Listar datas disponíveis
- Selecionar primeira data
- Listar horários disponíveis
- Selecionar primeiro horário

**Execução**:
```bash
npm run test:front:data-hora
```

**Intervenção**: Automática

**Ambiente**: 146

### 3.4 Resumo e Confirmação

**Objetivo**: Validar finalização do agendamento.

**Status**: Planejado

**Arquivos**:
- `tests/cidadao-smart/resumo-confirmacao.spec.ts`

**Cenários**:
- Validar dados no resumo
- Confirmar agendamento
- Receber protocolo
- Validar comprovante

**Execução**:
```bash
npm run test:front:resumo
```

**Intervenção**: Assistida (CAPTCHA + código)

**Ambiente**: 146

## 4. Fluxos de Admin (Booking)

### 4.1 Login Admin

**Objetivo**: Validar acesso ao painel administrativo.

**Status**: Em desenvolvimento

**Arquivos**:
- `tests/booking-admin/login.spec.ts`

**Cenários**:
- Carregar página de login
- Login com credenciais válidas
- Login com senha inválida
- Logout funcional

**Execução**:
```bash
npm run test:admin:login
```

**Intervenção**: Automática

**Ambiente**: 146

### 4.2 Gestão de Postos (Read-only)

**Objetivo**: Validar visualização de postos no Admin.

**Status**: Planejado

**Arquivos**:
- `tests/booking-admin/postos.spec.ts`

**Cenários**:
- Acessar listagem de postos
- Buscar posto específico
- Visualizar detalhes do posto
- Validar dados básicos

**Execução**:
```bash
npm run test:admin:pos
```

**Intervenção**: Automática

**Ambiente**: 146

### 4.3 Agendamentos (Read-only)

**Objetivo**: Validar consulta de agendamentos.

**Status**: Planejado

**Arquivos**:
- `tests/booking-admin/agendamentos.spec.ts`

**Cenários**:
- Listar agendamentos
- Buscar por CPF
- Visualizar detalhes
- Validar paginação

**Execução**:
```bash
npm run test:admin:agendamentos
```

**Intervenção**: Automática

**Ambiente**: 146

## 5. Fluxos E2E

### 5.1 E2E Agendamento Completo (Assistido)

**Objetivo**: Demonstrar fluxo ponta a ponta.

**Status**: Em desenvolvimento

**Arquivos**:
- `tests/e2e/agendamento-presencial-fluxo-completo.spec.ts`

**Cenários**:
- Jornada completa do cidadão
- Validações em cada etapa
- Confirmação final
- Protocolo gerado

**Execução**:
```bash
npm run test:e2e:assistido
```

**Intervenção**: Assistida (CAPTCHA + código)

**Ambiente**: 146

**Logs esperados**:
```
[BOOKING-E2E] Abrindo jornada pública
[BOOKING-E2E] Buscando cidade
[BOOKING-E2E] Selecionando posto
[BOOKING-E2E] Aguardando CAPTCHA manual
[BOOKING-E2E] Preenchendo dados do requerente
[BOOKING-E2E] Selecionando data disponível
[BOOKING-E2E] Selecionando horário disponível
[BOOKING-E2E] Validando resumo
[BOOKING-E2E] Aguardando código de segurança
[BOOKING-E2E] Validando confirmação
[BOOKING-E2E] Protocolo gerado
```

## 6. Fluxos de Consulta

### 6.1 Consulta de Agendamento

**Objetivo**: Validar consulta pós-agendamento.

**Status**: Planejado

**Arquivos**:
- `tests/consulta/consulta-agendamento.spec.ts`

**Cenários**:
- Acessar área de consulta
- Buscar por protocolo
- Validar dados exibidos
- Verificar status

**Execução**:
```bash
npm run test:consulta:agendamento
```

**Intervenção**: Automática

**Ambiente**: 146

### 6.2 Consulta de Processo

**Objetivo**: Validar consulta de processos SMART.

**Status**: Planejado

**Arquivos**:
- `tests/consulta/consulta-processo.spec.ts`

**Cenários**:
- Buscar processo por protocolo
- Validar dados do cidadão
- Verificar andamento
- Confirmar status final

**Execução**:
```bash
npm run test:consulta:processo
```

**Intervenção**: Automática

**Ambiente**: 146, 200

## 7. Fluxos de 2ª Via

### 7.1 2ª Via Expressa

**Objetivo**: Validar emissão de 2ª via.

**Status**: Planejado

**Arquivos**:
- `tests/2via/2via-expressa.spec.ts`

**Cenários**:
- Solicitar 2ª via
- Preencher dados
- Confirmar emissão
- Receber documento

**Execução**:
```bash
npm run test:2via:expressa
```

**Intervenção**: Assistida (código)

**Ambiente**: 146

### 7.2 2ª Via com Alterações

**Objetivo**: Validar 2ª via com mudanças.

**Status**: Planejado

**Arquivos**:
- `tests/2via/2via-alteracoes.spec.ts`

**Cenários**:
- Solicitar 2ª via
- Alterar dados
- Reconfirmar
- Emitir documento

**Execução**:
```bash
npm run test:2via:alteracoes
```

**Intervenção**: Assistida (código)

**Ambiente**: 146

## 8. Integração com GBDS

### 8.1 Notificador GBDS

**Objetivo**: Validar notificações para GBDS.

**Status**: Planejado

**Arquivos**:
- `tests/api/notificador-gbds.spec.ts`

**Cenários**:
- Enviar notificação
- Validar formato
- Confirmar recebimento
- Verificar processamento

**Execução**:
```bash
npm run test:api:gbds
```

**Intervenção**: Automática

**Ambiente**: 200

## 9. Estratégia de Execução

### 9.1 Ordem Recomendada

1. **Validação de Ambiente**
   - API smoke
   - Login Admin
   - Carregamento Cidadão Smart

2. **Testes Isolados**
   - API utilitários
   - Front localização
   - Admin read-only

3. **Integrações**
   - API postos/agendamentos
   - Front dados/data-hora
   - Consultas

4. **E2E e Ponta a Ponta**
   - E2E assistido
   - 2ª via
   - Consultas pós-agendamento

### 9.2 Frequência

- **Diária**: Smoke tests, testes críticos
- **Semanal**: Regressão completa
- **Por demanda**: E2E assistido para demo
- **Pré-deploy**: Validação de ambiente

### 9.3 Paralelização

- API tests: Podem rodar em paralelo
- Front tests: Sequenciais por sessão
- Admin tests: Sequenciais por login
- E2E: Isolado (único por vez)

## 10. Dependências e Pré-condições

### 10.1 Infraestrutura

- VPN conectada
- Ambiente acessível (146/201/200)
- Credenciais válidas
- Browser Playwright instalado

### 10.2 Dados

- Postos ativos cadastrados
- Agenda com disponibilidade
- Massa de teste controlada
- Protocolos conhecidos (para consulta)

### 10.3 Configuração

- .env configurado
- URLs corretas
- Timeouts adequados
- Capturas habilitadas

## 11. Tratamento de Falhas

### 11.1 Falhas Técnicas

- **Timeout**: Retry automático
- **Selector quebrado**: Correção via Healer
- **Rede**: Reexecução
- **Ambiente indisponível**: Skip com aviso

### 11.2 Falhas de Negócio

- **Agenda esgotada**: Known issue
- **Posto inativo**: Configuração
- **Dados inválidos**: Validação esperada
- **Limite atingido**: Regra de negócio

### 11.3 Known Issues

- Divergência Top Tower/Aeroporto
- Sincronização Admin ↔ Cidadão Smart
- Cache de configurações
- Variação por ambiente

## 12. Métricas de Qualidade

### 12.1 Cobertura

- Cenários críticos: 100%
- Fluxos principais: 90%
- Casos edge: 70%

### 12.2 Performance

- Tempo execução suíte: < 10min
- Tempo por teste: < 30s
- Taxa sucesso: > 90%

### 12.3 Manutenibilidade

- Tempo correção falha: < 15min
- Reutilização código: > 80%
- Documentação atualizada: 100%

## 13. Evolução dos Fluxos

### 13.1 Short Term

- Implementar API smoke
- Completar front localização
- Estabelecer E2E assistido
- Configurar relatórios

### 13.2 Medium Term

- Expandir API coverage
- Implementar Admin read-only
- Adicionar consultas
- Melhorar estabilidade

### 13.3 Long Term

- Automação completa
- Integração CI/CD
- Testes de performance
- Monitoramento contínuo

## 14. Conclusão

Os fluxos automatizados seguem uma estratégia gradual:

1. **Base sólida**: API e smoke tests
2. **Funcionalidades core**: Agendamento público
3. **Administração**: Controle e validação
4. **Integração**: Consultas e 2ª via
5. **Ponta a ponta**: E2E demonstrável

Cada fluxo é independente, testável isoladamente, e contribui para uma suíte robusta e apresentável.
