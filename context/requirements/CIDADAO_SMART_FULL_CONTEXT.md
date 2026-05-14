# Cidadão Smart / Booking — Contexto Completo da Automação Playwright

## 1. Objetivo

Automatizar e organizar os testes dos fluxos principais do **Cidadão Smart / Booking 2.X.X**, cobrindo:

- Agendamento presencial;
- 2ª via expressa;
- 2ª via com alterações;
- Consulta de pedido/protocolo;
- Painel Administrativo do Booking;
- Integração com Notificador GBDS;
- Integrações com SMART;
- Validações críticas de negócio, segurança e ambiente.

A automação deve servir como apoio para:

- regressão funcional;
- investigação de falhas;
- validação de release;
- documentação viva do comportamento esperado;
- evidências de execução;
- onboarding de novas pessoas no projeto.

---

## 2. Ambiente

### Ambiente principal

- Base URL: `https://172.16.1.146`
- Acesso: interno/VPN
- HTTPS: certificado autossinalado
- Playwright: `ignoreHTTPSErrors: true`

### Observações

O ambiente pode apresentar comportamento dinâmico dependendo de:

- agenda disponível;
- configuração do posto;
- tipo do posto no banco;
- disponibilidade de horários;
- CAPTCHA;
- código de segurança;
- configuração do Booking/Admin;
- integrações com SMART/GBDS.

Por isso, a automação deve diferenciar:

- falha real de produto;
- falha de massa;
- falha de ambiente;
- falha de configuração;
- falha da própria automação;
- known issue já identificado.

---

## 3. Escopo da automação

### 3.1 Cidadão Smart

Fluxos cobertos ou planejados:

- Home;
- Pedir nova identidade;
- Agendamento presencial;
- Seleção de posto;
- Data e hora;
- Resumo;
- Autenticação por código de segurança;
- Confirmação;
- Consulta de pedido/protocolo;
- 2ª via expressa;
- 2ª via com alterações;
- Status da solicitação;
- Cancelamento.

### 3.2 Booking / Painel Administrativo

Fluxos cobertos ou planejados:

- Login administrativo;
- Listagem de agendamentos;
- Busca por CPF;
- Paginação;
- Reagendamento;
- Cancelamento;
- Gestão de postos;
- Horários de funcionamento;
- Feriados e bloqueios;
- Permissões;
- Auditoria;
- Ambiente;
- Identidade visual.

### 3.3 API Cidadão Smart / Booking

Fluxos cobertos ou planejados:

- Obtenção de token;
- Abertura de processo;
- Abertura de processo pelo Booking;
- Segunda via expressa;
- Segunda via com alterações;
- Edição de segunda via;
- Consulta de protocolo;
- Cancelamento de protocolo;
- Geração de DAE;
- Elegibilidade;
- Contratos de status.

### 3.4 Notificador GBDS

Fluxos cobertos ou planejados:

- Recebimento de notificação;
- Validação de `operation`;
- Validação de `sender`;
- Mapeamento de `citizenStatus`;
- Status exibido ao cidadão;
- Disparo de e-mail;
- Segurança do payload.

### 3.5 SMART / Conferência

Fluxos cobertos ou planejados:

- Tela de conferência;
- Dados alterados pelo cidadão;
- Histórico de mudanças;
- Documentos auxiliares;
- Face;
- Assinatura;
- Rejeição parcial;
- Rejeição total;
- Aprovação;
- Validação de campos inválidos;
- Tomada de decisão.

---

## 4. Tipos de teste

### Smoke

Testes rápidos para validar se o ambiente está de pé.

Exemplos:

- Home abre;
- Login Admin abre;
- Tela de agendamento carrega;
- Tela de consulta carrega.

### Regressão

Testes automáticos para validar regras específicas.

Exemplos:

- Telefone obrigatório;
- Nome com apenas uma palavra;
- Data menor de 16 anos;
- CPF vazio permitido;
- Consulta de protocolo inválido.

### E2E

Testes ponta a ponta, percorrendo várias etapas.

Exemplo:

- Agendamento presencial completo até confirmação.

### Manual-assisted

Testes que exigem ação humana.

Exemplos:

- CAPTCHA manual;
- código de segurança informado manualmente;
- validação visual assistida.

Esses testes não devem entrar no CI enquanto dependerem de ação humana.

### API

Testes de contrato e integração dos endpoints.

### Admin / Booking

Testes do Painel Administrativo.

Devem ser separados entre:

- `read-only`: somente consulta;
- `write`: altera configuração e exige ambiente controlado.

---

## 5. Agendamento presencial

### 5.1 Objetivo

Automatizar o fluxo E2E de agendamento presencial para o Cidadão Smart, usando o posto principal de Florianópolis como referência.

### 5.2 Rotas do fluxo

Fluxo principal:

1. `/agendamentos/novo/local`
2. `/agendamentos/novo/data-e-hora`
3. `/agendamentos/novo/resumo`
4. `/agendamentos/novo/autenticacao`
5. `/agendamentos/novo/confirmacao`

### 5.3 Posto padrão

Posto usado como referência:

- Nome: `PCI - FLORIANÓPOLIS - Top Tower`
- Cidade: `Florianópolis`
- Endereço: `Rua Esteves Júnior, 50`

### 5.4 Fluxo esperado

1. Acessar a tela de localização.
2. Buscar por cidade.
3. Informar `Florianópolis`.
4. Selecionar posto de atendimento.
5. Resolver CAPTCHA manualmente, quando necessário.
6. Avançar para Data e Hora.
7. Preencher dados do requerente.
8. Selecionar data disponível.
9. Selecionar horário disponível.
10. Avançar para resumo.
11. Validar dados principais do requerente.
12. Informar código de segurança.
13. Confirmar agendamento.
14. Validar protocolo gerado.

### 5.5 CAPTCHA

CAPTCHA real não deve ser burlado.

Tratamentos permitidos:

- `CAPTCHA_MODE=manual`: usar `page.pause()` e ação humana;
- `CAPTCHA_MODE=disabled`: somente em ambiente QA preparado;
- `CAPTCHA_MODE=test`: reservado para implementação futura.

### 5.6 Código de segurança

No momento, o código pode ser informado via `.env`.

Exemplo:

```env
CIDADAO_SMART_SECURITY_CODE=000000