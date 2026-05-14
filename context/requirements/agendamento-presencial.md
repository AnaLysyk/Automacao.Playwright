# 📅 Agendamento Presencial — Contexto Funcional

## 1. Objetivo

Explicar o contexto funcional do agendamento presencial no ecossistema Cidadão Smart / SMART, estabelecendo:

- O que é responsabilidade do Booking
- Como o cidadão consome esse agendamento
- Quais dependências impactam os testes
- Qual é a relação entre Booking, Cidadão Smart e SMART

## 2. Para que serve este arquivo

Servir como referência técnica para:

- Entender por que agendamento é Booking
- Explicar que Cidadão Smart é a interface pública consumidora
- Mapear onde falhas podem originar-se (Booking vs Cidadão Smart)
- Identificar dependências que afetam testes
- Documentar configurações que impactam o agendamento
- Registrar known issues do agendamento presencial

## 3. O que este arquivo não cobre

❌ Passo a passo detalhado de execução  
❌ Massa específica de teste ou CPF fixo  
❌ Senha, token, código de segurança real  
❌ Selectors, Page Objects ou implementação Playwright  
❌ Tabela completa de casos do Qase/CDS  

📍 Para isso, veja: `context/test-cases/booking-agendamento-presencial.json` ou specs em `tests/booking/`

## 3.1. Ambientes recomendados para Agendamento Presencial

- **146**: ambiente preferido para automação de Agendamento Presencial. Deve ser usado para criação, validação e execução de fluxos completos com maior tolerância a alterações de dados.
- **201**: ambiente de confirmação / pré-produção. Use para validações conservadoras de leitura, consistência de exibição e regressões que não geram agendamentos reais sempre que possível.
- **200**: ambiente de integração GBDS/MIR. Normalmente não usado diretamente para testes de agendamento, exceto para validações de backend e integrações de notificador.

**Configurações chave**
- `TARGET_ENV` no `.env.local` deve identificar o ambiente ativo.
- `CIDADAO_SMART_BASE_URL` deve apontar para a URL do frontend Cidadão Smart do ambiente selecionado.
- `BOOKING_ADMIN_BASE_URL` deve apontar para o painel administrativo Booking/Admin correspondente.
- `SMART_BASE_URL` é o endereço do SMART interno usado para processamento e conferência.

**Recomendações práticas**
- Sempre valide manualmente que as URLs acessam antes de iniciar os testes.
- Em `201`, prefira consultas e checkpoints em vez de ações que criem ou modifiquem dados.
- Use `CIDADAO_SMART_DRY_RUN=true` para evitar enviar agendamentos reais em fluxos de demonstração.

## 4. Contexto Funcional

### O que é o Booking

O **Booking** é o módulo responsável pelas regras e operações de agendamento presencial.

Controla:
- Postos de atendimento e cidades
- Disponibilidade de datas e horários
- Vagas, limites e bloqueios
- Reagendamento, cancelamento e notificações
- Listagem administrativa e permissões

### Regra Central

| Conceito | Responsável | Camada |
|----------|-------------|--------|
| **Agendamento (lógica)** | Booking | Backend |
| **Jornada pública** | Cidadão Smart | Frontend |
| **Integração** | Via API | HTTP REST |

🔑 O cidadão **interage com Cidadão Smart**, mas as **regras vêm do Booking**.

## 5. Responsabilidades do Booking

### Configuração de Postos
- Criação e edição de postos
- Vínculo com cidade
- Status (ativo/inativo)
- Endereço e contato
- Sincronização com SMART (station_id)

### Disponibilidade
- Horário de funcionamento
- Datas disponíveis
- Horários por data
- Quantidade de vagas
- Tempo de atendimento

### Limites e Bloqueios
- Limite de agendamentos simultâneos por CPF
- Limite anual de agendamentos por e-mail
- Feriados e bloqueios de data
- Regras de janela de agendamento futuro

### Administrativo
- Listagem de agendamentos
- Busca por CPF
- Reagendamento manual
- Cancelamento
- Permissões por perfil
- Auditoria de alterações

## 6. Jornada Pública — O que o Cidadão Vê

A jornada pública é como o cidadão interage com o agendamento via Cidadão Smart.

**Fases principais:**
1. **Localização:** Busca por cidade/CEP
2. **Postos:** Visualização e seleção de posto disponível
3. **Requerente:** Preenchimento de dados (nome, telefone, e-mail, CPF)
4. **Data:** Seleção de data disponível
5. **Horário:** Seleção de horário disponível
6. **Resumo:** Revisão dos dados informados
7. **Código:** Recebimento e confirmação de código de segurança
8. **Confirmação:** Execução final do agendamento
9. **Protocolo:** Exibição do protocolo e guia/comprovante

**Ações posteriores:**
- Download de guia/comprovante
- Cancelamento (quando disponível)
- Consulta do agendamento

> ⚠️ **Importante:** A jornada não termina em "data e hora". Inclui dados do requerente, e-mail, telefone, código, confirmação e protocolo.

## 7. Jornada Administrativa — Painel do Booking

O Painel Administrativo permite:

| Área | Operações |
|------|-----------|
| **Agendamentos** | Listagem, busca, edição, reagendamento, cancelamento |
| **Postos** | Criação, edição, ativação, inativação |
| **Atendimento** | Vagas, tempo, limites |
| **Horários** | Funcionamento, dias, intervalos |
| **Bloqueios** | Feriados, datas, motivos |
| **Permissões** | Perfis, e-mails bloqueados/liberados |
| **Auditoria** | Alterações, histórico |

## 8. Dependências que Impactam os Testes

| Dependência | Impacto | Mitigação |
|-------------|---------|-----------|
| **VPN conectada** | Sem acesso à URL | Validar antes de rodar |
| **Ambiente disponível** | Telas não carregam | Validar ping e acesso manual |
| **Posto ativo** | Não aparece para cidadão | Validar configuração no Admin |
| **Agenda configurada** | Sem horários | Configurar no Admin |
| **Data/horário disponível** | Indisponível para seleção | Validar bloqueios/feriados |
| **CAPTCHA** | Bloqueia automação | Usar manual-assisted |
| **Código por e-mail** | Bloqueia automação | Usar manual-assisted ou integração |
| **Limite atingido** | Agendamento rejeitado | Resetar ou outro CPF |
| **Permissão Admin** | Ações rejeitadas | Validar papel do usuário |

## 9. Análise de Falhas — Onde Procurar

Quando um teste falha, a causa pode estar em:

| Origem | Exemplos | Como Validar |
|--------|----------|--------------|
| **Booking** | Posto inativo, agenda não configurada, limite atingido, bloqueio | Acessar Painel Admin |
| **Cidadão Smart** | Tela não carrega, botão não funciona, dados não salvam | Acessar URL diretamente |
| **Integração** | Dados não sincronizam, station_id inconsistente | Verificar logs de API |
| **Automação** | Selector quebrado, timing insuficiente, lógica errada | Rodar em debug mode |
| **Ambiente** | VPN desconectada, banco fora do ar, config errada | Validar dependências |

## 10. Relação com SMART

O Booking sincroniza postos com o SMART através do `station_id`.

O posto escolhido pelo cidadão pode ser enviado ao SMART como parte do fluxo de criação ou acompanhamento do processo.

**Possíveis problemas:**
- Posto existe em Booking mas não no SMART
- station_id mismatch
- Sincronização atrasada

## 11. Relação com Notificador GBDS

O Booking dispara notificações pelo Notificador GBDS em eventos como:

- Confirmação de agendamento
- Reagendamento
- Cancelamento
- Alterações administrativas

Essas notificações atualizam o status visível ao cidadão.

## 12. Known Issues Registradas

### KNOWN-POSTO-001 — Divergência Top Tower / Aeroporto

Em alguns ambientes, após selecionar o posto **PCI - FLORIANÓPOLIS - Top Tower**, o fluxo pode exibir referência ao posto **Aeroporto** em etapas posteriores.

**Origem provável:** Tipo/configuração do posto no banco  
**Impacto:** Cidadão visualiza nome inconsistente  
**Tratamento:** Registrar warning, não quebra E2E principal  
**Quando quebra:** Apenas em spec específica para investigar esse problema  

📍 Veja: `context/requirements/known-issues.md`

## 13. Relação com Automação Playwright

Este arquivo ajuda a automação entendendo:

- ✅ Qual módulo está sendo testado (Booking)
- ✅ Quais dependências existem (postos, agendas, bloqueios)
- ✅ Qual camada pode ser a origem da falha (Booking Admin vs Cidadão Smart)
- ✅ O que pertence a cada sistema
- ✅ Quais known issues não quebram o fluxo

**Onde fica a automação:**
- `tests/booking/public/` — Jornada pública (cidadão)
- `tests/booking/e2e/` — Fluxo completo automático
- `tests/booking/manual-assisted/` — Com CAPTCHA/código manual
- `tests/booking-admin/` — Painel administrativo
- `tests/api/booking/` — Contratos de API

## 14. Casos de Teste Detalhados

Casos de teste detalhados (com passo-a-passo, massa, asserts) devem ficar em:

- `context/test-cases/booking-agendamento-presencial.json` — Casos estruturados
- `tests/booking/` — Specs Playwright automatizadas

**NÃO** devem ficar neste arquivo.

## 15. Status deste Documento

📅 **Última atualização:** [DATA]  
✅ **Status:** Ativo  
📝 **Revisar quando:**
- Uma regra geral do Booking mudar
- Uma dependência nova for identificada
- Um known issue for confirmado
- Uma integração alterar o comportamento
- Um novo tipo de teste for criado

---

## 🔗 Documentos Relacionados

- 📄 [known-issues.md](known-issues.md) — Known issues do Booking
- 📄 [booking-admin.md](booking-admin.md) — Painel administrativo
- 📄 [api-cidadao-booking.md](api-cidadao-booking.md) — Contratos de API
- 📄 [notificador-gbds.md](notificador-gbds.md) — Sistema de notificações
- 📁 [context/test-cases/](../test-cases/) — Casos de teste estruturados
- 📁 [tests/booking/](../../tests/booking/) — Automação Playwright
