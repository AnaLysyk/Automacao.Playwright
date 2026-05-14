# Guia de Execução — Cidadão Smart / Booking

## 1. Visão Geral

Este guia fornece instruções completas para executar os testes automatizados do Cidadão Smart / Booking.

O guia cobre:

- Pré-requisitos de ambiente
- Configuração necessária
- Comandos de execução
- Interpretação de resultados
- Troubleshooting comum
- Estratégias de manutenção

## 2. Pré-requisitos

### 2.1 Infraestrutura

**Obrigatório**:
- Windows 10/11 ou Linux/Mac
- Node.js 18+ instalado
- NPM ou Yarn
- Git
- VPN Griaule conectada
- Acesso aos ambientes (146, 201, 200)

**Verificação**:
```bash
node --version  # Deve ser 18+
npm --version   # Deve ser 9+
git --version   # Deve ser funcional
```

### 2.2 Acesso aos Ambientes

**Ambiente 146** (desenvolvimento):
- URL: https://172.16.1.146
- Cidadão Smart acessível
- Booking Admin acessível
- Agenda disponível

**Ambiente 201** (produção-like):
- URL: https://172.16.1.201
- Acesso restrito
- Usar apenas read-only

**Ambiente 200** (integração):
- URL: https://172.16.1.200
- APIs GBDS disponíveis
- Processos de teste

**Verificação**:
```bash
curl -I https://172.16.1.146  # Deve retornar 200
curl -I https://172.16.1.201  # Deve retornar 200 (se acessível)
```

### 2.3 Credenciais

**Cidadão Smart**:
- Não requer login prévio
- CAPTCHA manual
- Código de segurança via e-mail

**Booking Admin**:
- Usuário de teste
- Senha de teste
- Permissões read-only

**APIs**:
- Token de autenticação (se necessário)
- Chaves de API (se aplicável)

## 3. Instalação e Setup

### 3.1 Clonagem do Repositório

```bash
git clone <url-do-repositorio>
cd automacao-griaule
```

### 3.2 Instalação de Dependências

```bash
npm install
```

**Verificação**:
```bash
npm list playwright  # Deve mostrar versão instalada
```

### 3.3 Instalação do Browser

```bash
npx playwright install chromium
```

**Verificação**:
```bash
npx playwright --version  # Deve funcionar
```

### 3.4 Configuração do Ambiente

**Arquivo: .env**

```bash
# URLs dos ambientes
CIDADAO_SMART_BASE_URL=https://172.16.1.146
BOOKING_ADMIN_BASE_URL=https://172.16.1.146/admin
API_BASE_URL=https://172.16.1.146/api

# Credenciais Admin
BOOKING_ADMIN_USER=test_user
BOOKING_ADMIN_PASSWORD=test_password

# Configurações de teste
CIDADAO_SMART_DEFAULT_CITY=Florianópolis
CIDADAO_SMART_DEFAULT_CEP=88000000
CIDADAO_SMART_DEFAULT_SERVICE_POINT=PCI - FLORIANÓPOLIS - Top Tower

# Configurações técnicas
CAPTCHA_MODE=manual
PW_SLOW_MO=300
PW_TIMEOUT=30000

# APIs
API_TOKEN=your_token_here
API_VALID_PROTOCOL=020260000000000
API_VALID_BIRTH_DATE=1990-01-01
```

**Importante**:
- Nunca commite .env
- Use .env.example como template
- Configure localmente apenas

## 4. Tipos de Execução

### 4.1 Execução Completa

**Objetivo**: Rodar toda a suíte de testes.

**Comando**:
```bash
npm run test:all
```

**Inclui**:
- API smoke
- Testes de front pequenos
- Admin read-only
- E2E assistido (se configurado)

**Duração**: ~10-15 minutos

**Intervenção**: Assistida para E2E

### 4.2 Execução por Categoria

**API Tests**:
```bash
npm run test:api
```

**Front Tests**:
```bash
npm run test:front
```

**Admin Tests**:
```bash
npm run test:admin
```

**E2E Tests**:
```bash
npm run test:e2e
```

### 4.3 Execução Específica

**Listar testes disponíveis**:
```bash
npm run test:list
```

**Executar teste específico**:
```bash
npx playwright test tests/api/smoke.spec.ts --headed
```

**Executar com debug**:
```bash
npm run test:debug
```

### 4.4 Modos de Execução

**Headed (com navegador visível)**:
```bash
npm run test:headed
```

**Headless (em background)**:
```bash
npm run test:all  # Default é headless
```

**Com slow motion**:
```bash
PW_SLOW_MO=1000 npm run test:front
```

## 5. Cenários de Execução

### 5.1 Desenvolvimento Local

**Objetivo**: Desenvolvimento e debugging.

**Setup**:
```bash
# Ambiente 146
CIDADAO_SMART_BASE_URL=https://172.16.1.146
CAPTCHA_MODE=manual
PW_SLOW_MO=500
```

**Execução**:
```bash
npm run test:debug  # Abre Playwright Inspector
```

**Características**:
- Browser visível
- Slow motion ativado
- Pausas para debugging
- Evidências detalhadas

### 5.2 CI/CD Pipeline

**Objetivo**: Validação automatizada.

**Setup**:
```bash
# Ambiente controlado
CIDADAO_SMART_BASE_URL=https://staging.example.com
CAPTCHA_MODE=disabled  # Se disponível
PW_SLOW_MO=0
```

**Execução**:
```bash
npm run test:all
```

**Características**:
- Headless
- Sem intervenção manual
- Relatórios automáticos
- Fail-fast para CI

### 5.3 Demonstração

**Objetivo**: Apresentar para stakeholders.

**Setup**:
```bash
# Ambiente 146
CIDADAO_SMART_BASE_URL=https://172.16.1.146
CAPTCHA_MODE=manual
PW_SLOW_MO=1000
```

**Execução**:
```bash
npm run test:e2e:assistido
```

**Características**:
- Browser visível
- Execução lenta
- Pausas para explicação
- Evidências visuais

### 5.4 Troubleshooting

**Objetivo**: Diagnosticar problemas.

**Setup**:
```bash
# Ambiente de teste
PWDEBUG=1  # Ativa debug mode
PW_SLOW_MO=2000
```

**Execução**:
```bash
npx playwright test --headed --debug
```

**Características**:
- Step-by-step execution
- Inspector disponível
- Logs detalhados
- Screenshots automáticos

## 6. Interpretação de Resultados

### 6.1 Status dos Testes

**✅ Passed**: Teste executado com sucesso.

**❌ Failed**: Teste falhou (pode ser bug ou configuração).

**⏭️ Skipped**: Teste pulado (pré-condição não atendida).

**🔄 Flaky**: Teste instável (passou após retry).

### 6.2 Relatórios

**Playwright Report**:
```bash
npm run report  # Abre relatório HTML
```

**Localização**:
- `playwright-report/index.html`
- `test-results/` (evidências)

**Conteúdo do relatório**:
- Status geral
- Tempo de execução
- Screenshots de falha
- Videos de execução
- Traces de debug
- Logs detalhados

### 6.3 Evidências

**Screenshots**: Capturados automaticamente em falhas.

**Videos**: Gravados para testes críticos.

**Traces**: Arquivos .zip com timeline da execução.

**Logs**: Output do console e steps.

## 7. Troubleshooting Comum

### 7.1 Problemas de Conectividade

**Sintoma**: "net::ERR_CONNECTION_REFUSED"

**Soluções**:
```bash
# Verificar VPN
ping 172.16.1.146

# Verificar URL
curl -I $CIDADAO_SMART_BASE_URL

# Testar conectividade
npx playwright test tests/api/smoke.spec.ts
```

### 7.2 Problemas de Autenticação

**Sintoma**: "Login failed" ou "401 Unauthorized"

**Soluções**:
```bash
# Verificar credenciais
echo $BOOKING_ADMIN_USER
echo $BOOKING_ADMIN_PASSWORD

# Testar login manual
# Abrir browser e tentar login

# Verificar token API
curl -H "Authorization: Bearer $API_TOKEN" $API_BASE_URL/ping
```

### 7.3 Problemas de Selectors

**Sintoma**: "Selector not found" ou "Timeout"

**Soluções**:
```bash
# Executar com debug
npm run test:debug

# Verificar estrutura da página
# Usar DevTools do browser

# Atualizar selectors se necessário
# Verificar se UI mudou
```

### 7.4 Problemas de Ambiente

**Sintoma**: "Environment not ready" ou "Agenda unavailable"

**Soluções**:
```bash
# Verificar disponibilidade
curl -s $CIDADAO_SMART_BASE_URL | grep "Cidadão Smart"

# Verificar agenda
# Acessar manualmente e verificar datas disponíveis

# Usar ambiente alternativo
# Mudar CIDADAO_SMART_BASE_URL
```

### 7.5 Problemas de Performance

**Sintoma**: "Timeout" ou "Slow execution"

**Soluções**:
```bash
# Aumentar timeouts
PW_TIMEOUT=60000 npm run test:api

# Reduzir slow motion
PW_SLOW_MO=0 npm run test:all

# Executar testes isoladamente
npx playwright test tests/api/smoke.spec.ts
```

## 8. Manutenção e Atualização

### 8.1 Atualização de Dependências

```bash
# Verificar updates
npm outdated

# Atualizar playwright
npm update @playwright/test

# Reinstalar browsers
npx playwright install
```

### 8.2 Limpeza de Cache

```bash
# Limpar cache playwright
npx playwright install --force

# Limpar node_modules
rm -rf node_modules
npm install
```

### 8.3 Backup de Resultados

```bash
# Arquivar resultados antigos
mv test-results test-results-$(date +%Y%m%d)

# Manter apenas últimos 7 dias
find test-results-* -mtime +7 -delete
```

### 8.4 Monitoramento de Saúde

**Verificações diárias**:
```bash
# Smoke test
npm run test:api:smoke

# Verificar estrutura
npm run test:list

# Validar configuração
node -e "require('dotenv').config(); console.log('Config OK')"
```

## 9. Scripts de Automação

### 9.1 Scripts Disponíveis

**package.json**:
```json
{
  "scripts": {
    "test:all": "playwright test",
    "test:api": "playwright test tests/api",
    "test:front": "playwright test tests/cidadao-smart",
    "test:admin": "playwright test tests/booking-admin",
    "test:e2e": "playwright test tests/e2e",
    "test:list": "playwright test --list",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "report": "playwright show-report",
    "install:browser": "playwright install"
  }
}
```

### 9.2 Scripts Customizados

**Para ambiente específico**:
```bash
# Ambiente 146
npm run test:all

# Ambiente 201 (read-only)
TARGET_ENV=201 npm run test:api

# Com configuração customizada
PW_SLOW_MO=1000 CAPTCHA_MODE=manual npm run test:e2e
```

## 10. Boas Práticas

### 10.1 Antes de Executar

- [ ] VPN conectada
- [ ] Ambiente acessível
- [ ] .env configurado
- [ ] Browsers instalados
- [ ] Agenda disponível

### 10.2 Durante a Execução

- [ ] Monitorar logs
- [ ] Intervir quando necessário (CAPTCHA/código)
- [ ] Não interferir no browser
- [ ] Registrar observações

### 10.3 Após a Execução

- [ ] Revisar relatório
- [ ] Arquivar evidências
- [ ] Documentar problemas
- [ ] Atualizar known issues

### 10.4 Manutenção Regular

- [ ] Atualizar dependências mensalmente
- [ ] Limpar cache semanalmente
- [ ] Backup de resultados
- [ ] Revisar configurações

## 11. Suporte e Contato

### 11.1 Documentação Relacionada

- `docs/MATRIZ_DE_TESTES_E_EXECUCAO.md` — O que testar
- `docs/ESTRATEGIA_QA.md` — Como a estratégia de QA funciona
- `docs/FLUXOS_AUTOMATIZADOS.md` — Fluxos disponíveis
- `AGENTS.md` — Arquitetura geral

### 11.2 Quando Pedir Ajuda

- Problemas de infraestrutura
- Mudanças na aplicação
- Novos requisitos
- Falhas persistentes

### 11.3 Logs para Debug

**Coletar sempre**:
- playwright-report/index.html
- .env (mascarado)
- Console output
- Screenshots/videos de falha

## 12. Conclusão

Este guia garante execuções consistentes e confiáveis da suíte de testes.

**Lembre-se**:
- Testes são ferramentas para qualidade, não fins em si
- Falhas indicam oportunidades de melhoria
- Automação evolui com o produto
- Documentação mantém valor a longo prazo

Para dúvidas específicas, consulte a documentação técnica ou abra issue no repositório.
