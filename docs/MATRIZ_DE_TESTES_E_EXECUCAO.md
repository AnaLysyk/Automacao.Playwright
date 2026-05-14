# Matriz de Testes e Execução — Cidadão Smart / Booking

## 1. Objetivo

Este documento define quais testes entram na primeira organização da automação do Cidadão Smart / Booking, quais serão executados e quais pré-condições são necessárias para que eles rodem corretamente.

A suíte será separada em camadas:

- testes de API;
- testes pequenos de front;
- testes do Booking/Admin em modo somente leitura;
- teste E2E assistido;
- known issues documentados;
- relatórios de execução.

A proposta inicial não é automatizar tudo de uma vez, mas criar uma base confiável, organizada e apresentável.

## 2. Grupos de testes que vão entrar

### 2.1 API — Smoke e contratos básicos

Objetivo: validar se a API está respondendo e se os contratos principais estão minimamente funcionais.

Esses testes devem ser pequenos, rápidos e preferencialmente read-only.

| ID | Área | Teste | Tipo | Entra agora? | Precisa de quê |
|----|------|-------|------|--------------|----------------|
| API-SMOKE-001 | API | Validar /ping ou /api/ping | Smoke | Sim | API acessível |
| API-UTIL-001 | Utilidades | Listar cidades | Read-only | Sim | Token/autenticação, se exigido |
| API-UTIL-002 | Utilidades | Consultar CEP válido | Read-only | Sim | CEP válido |
| API-UTIL-003 | Utilidades | Consultar CEP inválido | Negativo | Sim | CEP inválido controlado |
| API-POSTO-001 | Postos | Filtrar postos por cidade/descrição | Read-only | Sim | Postos cadastrados |
| API-POSTO-002 | Postos | Validar tipo do posto | Read-only | Sim | Posto conhecido |
| API-BOOK-001 | Booking | Consultar processo por protocolo | Read-only | Sim, se tiver massa | Protocolo existente |
| API-BOOK-002 | Booking | Consultar protocolo inexistente | Negativo | Sim | Protocolo fake |
| API-CID-001 | Cidadão Smart | Consultar processo pelo cidadão | Read-only | Sim, se tiver massa | Protocolo + data nascimento |
| API-CID-002 | Cidadão Smart | Cancelamento com protocolo inválido | Negativo | Sim | Protocolo fake |
| API-DAE-001 | DAE | Validar contrato de geração de DAE | Read-only/condicional | Depois | Protocolo em status compatível |

**O que precisa para rodar API**

```bash
API_BASE_URL=
API_TOKEN=
API_AUTH_MODE=
API_BASIC_USER=
API_BASIC_PASSWORD=
API_VALID_PROTOCOL=
API_VALID_BIRTH_DATE=
API_INVALID_PROTOCOL=020260000000
API_VALID_CEP=88000000
API_INVALID_CEP=99999999
```

Se ainda não houver token/autenticação configurada, os testes de API podem começar apenas com endpoints públicos ou com teste de conectividade.

### 2.2 Front — Agendamento presencial público

Objetivo: validar partes menores da jornada pública do agendamento, sem depender sempre do E2E completo.

Esses testes não devem ser gigantes. Cada arquivo deve validar uma responsabilidade.

| ID | Área | Teste | Tipo | Entra agora? | Precisa de quê |
|----|------|-------|------|--------------|----------------|
| AGP-LOCAL-001 | Localização | Carregar tela de localização | Smoke Front | Sim | URL do Cidadão Smart |
| AGP-LOCAL-002 | Localização | Buscar por cidade | Front | Sim | Cidade válida |
| AGP-LOCAL-003 | Localização | Buscar por CEP válido | Front | Sim | CEP válido |
| AGP-LOCAL-004 | Localização | Buscar por CEP inválido | Negativo | Sim | CEP inválido |
| AGP-LOCAL-005 | Localização | Selecionar posto disponível | Front | Sim | Posto ativo |
| AGP-DADOS-001 | Dados requerente | Preencher nome válido | Front | Sim | Massa válida |
| AGP-DADOS-002 | Dados requerente | Nome com uma palavra | Negativo | Sim | Mensagem esperada |
| AGP-DADOS-003 | Dados requerente | Telefone vazio | Negativo | Sim | Campo obrigatório |
| AGP-DADOS-004 | Dados requerente | E-mail inválido | Negativo | Sim | Mensagem esperada |
| AGP-DADOS-005 | Dados requerente | CPF vazio permitido | Regra | Sim | Regra confirmada |
| AGP-DADOS-006 | Dados requerente | Menor de 16 anos | Negativo | Sim | Massa de menor idade |
| AGP-DH-001 | Data/Hora | Abrir modal de data | Front | Sim | Agenda disponível |
| AGP-DH-002 | Data/Hora | Selecionar primeira data disponível | Front | Sim | Data disponível |
| AGP-DH-003 | Data/Hora | Selecionar primeiro horário disponível | Front | Sim | Horário disponível |
| AGP-RES-001 | Resumo | Validar dados principais no resumo | Front | Sim | Fluxo avançado |
| AGP-AUTH-001 | Código | Exibir tela de código | Front | Sim | Fluxo avançado |
| AGP-CONF-001 | Confirmação | Validar tela de confirmação | Front | Sim, via E2E | Código válido |
| AGP-CONF-002 | Confirmação | Validar protocolo gerado | Front | Sim, via E2E | Fluxo concluído |
| AGP-CONF-003 | Confirmação | Validar opção de guia/comprovante | Front | Depois | Fluxo concluído |
| AGP-CONF-004 | Confirmação | Validar opção de cancelamento | Front | Depois | Agendamento cancelável |

**O que precisa para rodar front**

```bash
CIDADAO_SMART_BASE_URL=https://172.16.1.146
CIDADAO_SMART_DEFAULT_CITY=Florianópolis
CIDADAO_SMART_DEFAULT_CEP=
CIDADAO_SMART_DEFAULT_SERVICE_POINT=PCI - FLORIANÓPOLIS - Top Tower
CIDADAO_SMART_SECURITY_CODE=
CAPTCHA_MODE=manual
PW_SLOW_MO=300
```

Também precisa:

- VPN conectada;
- ambiente acessível;
- agenda disponível;
- posto ativo;
- pelo menos uma data disponível;
- pelo menos um horário disponível.

### 2.3 Booking/Admin — Read-only

Objetivo: validar se o painel administrativo abre e permite consultar dados sem alterar configuração.

Essa suíte é importante porque o Booking/Admin controla as configurações que impactam o agendamento.

| ID | Área | Teste | Tipo | Entra agora? | Precisa de quê |
|----|------|-------|------|--------------|----------------|
| ADMIN-LOGIN-001 | Admin | Carregar tela de login | Smoke | Sim | URL admin |
| ADMIN-LOGIN-002 | Admin | Login com usuário válido | Smoke | Sim | Credencial |
| ADMIN-AGD-001 | Agendamentos | Acessar listagem de agendamentos | Read-only | Sim | Usuário com acesso |
| ADMIN-AGD-002 | Agendamentos | Buscar agendamento por CPF | Read-only | Sim, se tiver massa | CPF com agendamento |
| ADMIN-AGD-003 | Agendamentos | Validar paginação | Read-only | Sim | Listagem com registros |
| ADMIN-POSTO-001 | Postos | Acessar gestão/lista de postos | Read-only | Sim | Usuário com permissão |
| ADMIN-POSTO-002 | Postos | Buscar posto Top Tower | Read-only | Sim | Posto cadastrado |
| ADMIN-POSTO-003 | Postos | Validar dados básicos do posto | Read-only | Sim | Posto cadastrado |
| ADMIN-AMB-001 | Ambiente | Acessar configurações de ambiente | Read-only | Sim | Permissão |
| ADMIN-AUD-001 | Auditoria | Acessar auditoria | Read-only | Sim | Permissão |
| ADMIN-PERM-001 | Permissões | Acessar permissões | Read-only | Sim | Permissão |

**O que precisa para rodar Admin**

```bash
BOOKING_ADMIN_BASE_URL=
BOOKING_ADMIN_USER=
BOOKING_ADMIN_PASSWORD=
BOOKING_ADMIN_DEFAULT_CPF=
BOOKING_ADMIN_DEFAULT_SERVICE_POINT=PCI - FLORIANÓPOLIS - Top Tower
```

Também precisa:

- usuário com acesso ao painel;
- permissão para visualizar módulos;
- ambiente estável;
- não usar usuário que altera dados sem controle.

### 2.4 E2E assistido — Fluxo completo visual

Objetivo: validar visualmente o fluxo completo de agendamento presencial, com execução lenta e pausas controladas.

Esse teste serve para demonstração, investigação e validação ponta a ponta.

Ele não deve rodar em CI enquanto depender de CAPTCHA e código manual.

| ID | Área | Teste | Tipo | Entra agora? | Precisa de quê |
|----|------|-------|------|--------------|----------------|
| E2E-ASSIST-001 | Booking/Cidadão | Fluxo completo de agendamento presencial assistido | E2E assistido | Sim | CAPTCHA manual + código |
| E2E-ASSIST-002 | Booking/Cidadão | Validar protocolo na confirmação | E2E assistido | Sim | Fluxo concluído |
| E2E-ASSIST-003 | Booking/Cidadão | Validar guia/comprovante após confirmação | E2E assistido | Depois | Fluxo concluído |
| E2E-ASSIST-004 | Booking/Cidadão | Validar cancelamento após confirmação | E2E assistido | Depois | Agendamento cancelável |

**O que o E2E assistido precisa fazer**

O teste deve:

- abrir navegador headed;
- rodar devagar;
- mostrar cada etapa;
- pausar no CAPTCHA;
- permitir digitar código de segurança;
- continuar depois da intervenção manual;
- validar confirmação;
- capturar evidências;
- gerar relatório.

**Logs esperados**

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

**O que precisa para rodar E2E assistido**

```bash
CIDADAO_SMART_BASE_URL=
CIDADAO_SMART_SECURITY_CODE=
CAPTCHA_MODE=manual
PW_SLOW_MO=500
```

Também precisa:

- VPN;
- navegador instalado;
- ambiente disponível;
- posto ativo;
- agenda disponível;
- horário disponível;
- e-mail/código acessível;
- pessoa acompanhando a execução.

### 2.5 Known issues

Objetivo: documentar comportamento conhecido para não quebrar fluxo principal indevidamente.

| ID | Área | Teste | Tipo | Entra agora? | Precisa de quê |
|----|------|-------|------|--------------|----------------|
| KNOWN-POSTO-001 | Posto | Registrar divergência Top Tower/Aeroporto | Known issue | Sim | Fluxo com posto |
| KNOWN-POSTO-002 | Posto | Evidenciar bug de tipo/configuração do posto | Separado | Depois | Massa específica |

**Regra**

Top Tower aparecendo como Aeroporto não deve quebrar o E2E principal enquanto estiver classificado como known issue.

Deve gerar warning:

```
[KNOWN-POSTO-001] Aeroporto visível após seleção de Top Tower. Divergência conhecida de configuração/tipo de posto no banco. Não bloquear E2E principal.
```

## 3. Testes que não entram agora

Esses ficam para uma segunda fase.

Área | Motivo
-----|-------
Admin write | Altera configuração do ambiente
Criar posto via Admin | Pode impactar ambiente compartilhado
Editar horário de funcionamento | Pode quebrar agenda real
Alterar limite de agendamento | Precisa autorização
Alterar identidade visual | Pode impactar cliente/ambiente
Cancelar agendamento real em massa | Precisa controle de massa
Gmail via UI | Não deve ser automatizado
Bypass de CAPTCHA | Só se houver modo QA autorizado
Testes destrutivos de API | Só em ambiente controlado

## 4. Pré-condições gerais

Antes de rodar qualquer teste:

- [ ] VPN conectada
- [ ] Ambiente 146 acessível
- [ ] Cidadão Smart abre
- [ ] API responde
- [ ] Admin abre, se for executar Admin
- [ ] .env configurado
- [ ] Browser instalado com Playwright
- [ ] Posto ativo
- [ ] Agenda disponível
- [ ] Horário disponível
- [ ] CAPTCHA tratado como manual
- [ ] Código de segurança disponível

## 5. Variáveis de ambiente necessárias

Arquivo: `.env`

Modelo:

```bash
CIDADAO_SMART_BASE_URL=https://172.16.1.146
BOOKING_ADMIN_BASE_URL=
BOOKING_ADMIN_USER=
BOOKING_ADMIN_PASSWORD=

API_BASE_URL=
API_TOKEN=
API_AUTH_MODE=

CIDADAO_SMART_DEFAULT_CITY=Florianópolis
CIDADAO_SMART_DEFAULT_CEP=
CIDADAO_SMART_DEFAULT_SERVICE_POINT=PCI - FLORIANÓPOLIS - Top Tower

CIDADAO_SMART_SECURITY_CODE=
CAPTCHA_MODE=manual
PW_SLOW_MO=500

API_VALID_PROTOCOL=
API_VALID_BIRTH_DATE=
API_INVALID_PROTOCOL=020260000000
API_VALID_CEP=88000000
API_INVALID_CEP=99999999
```

Não commitar `.env`.

O repositório deve ter apenas: `.env.example`

## 6. Comandos de execução esperados

- Listar testes: `npm run test:list`
- Rodar API smoke: `npm run test:api:smoke`
- Rodar testes de API: `npm run test:api`
- Rodar testes pequenos de front: `npm run test:front`
- Rodar agendamento presencial: `npm run test:booking`
- Rodar Admin read-only: `npm run test:admin`
- Rodar E2E assistido: `npm run test:e2e:assistido`
- Abrir relatório: `npm run report`

## 7. Scripts necessários no package.json

```json
{
  "scripts": {
    "test:list": "playwright test --list",
    "test:api": "playwright test tests/api --project=chromium",
    "test:api:smoke": "playwright test tests/api/smoke --project=chromium",
    "test:front": "playwright test tests/cidadao-smart --headed --project=chromium",
    "test:booking": "playwright test tests/cidadao-smart/agendamento-presencial --headed --project=chromium",
    "test:e2e:assistido": "playwright test tests/e2e/assisted --headed --project=chromium",
    "test:admin": "playwright test tests/booking-admin/read-only --headed --project=chromium",
    "report": "playwright show-report"
  }
}
```

## 8. Ordem recomendada de execução

1. Primeiro: validar ambiente
   - API-SMOKE-001
   - AGP-LOCAL-001
   - ADMIN-LOGIN-001

2. Depois: validar API
   - API-UTIL-001
   - API-UTIL-002
   - API-POSTO-001
   - API-BOOK-002
   - API-CID-002

3. Depois: validar front pequeno
   - AGP-LOCAL-002
   - AGP-LOCAL-005
   - AGP-DADOS-001
   - AGP-DADOS-002
   - AGP-DADOS-003
   - AGP-DH-001
   - AGP-DH-002
   - AGP-DH-003

4. Depois: validar E2E assistido
   - E2E-ASSIST-001
   - E2E-ASSIST-002

5. Depois: relatório
   - RELATORIO_EXECUCAO.md
   - playwright-report
   - screenshots
   - videos
   - trace

## 9. Entrega esperada para apresentar

A entrega deve conter:

1. Repositório limpo
2. Estrutura organizada
3. Testes de API pequenos
4. Testes de front pequenos
5. E2E assistido lento e visual
6. Known issues documentados
7. Guia de execução
8. Matriz de testes
9. Relatório de execução
10. Evidências Playwright