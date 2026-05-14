# Checklist Pré-Execução

Use este checklist antes de rodar qualquer teste para validar ambiente e evitar falsos negativos.

---

## ✅ Checklist de Setup (Fazer Uma Vez)

- [ ] **Node.js instalado?**
  ```bash
  node --version  # Deve ser v18 ou superior
  ```

- [ ] **npm ou yarn instalado?**
  ```bash
  npm --version
  ```

- [ ] **Projeto clonado e dependências instaladas?**
  ```bash
  npm install
  npm run test:list  # Deve listar 50+ testes
  ```

- [ ] **.env.local criado a partir de .env.example?**
  ```bash
  ls -la .env.local  # Deve existir
  ```

- [ ] **Credenciais preenchidas em .env.local?**
  - [ ] `CIDADAO_SMART_BASE_URL` preenchida
  - [ ] `BOOKING_ADMIN_BASE_URL` preenchida
  - [ ] `BOOKING_ADMIN_USER` preenchida
  - [ ] `BOOKING_ADMIN_PASSWORD` preenchida (NUNCA no .env.example!)
  - [ ] `SMART_BASE_URL` preenchida
  - [ ] `SMART_USER` preenchida
  - [ ] `SMART_PASSWORD` preenchida (NUNCA no .env.example!)
  - [ ] `X_OPERATOR_CPF` preenchida

- [ ] **.gitignore contém .env.local?**
  ```bash
  grep ".env.local" .gitignore
  ```

- [ ] **Playwright binários instalados?**
  ```bash
  npx playwright install
  ```

---

## ✅ Checklist Pré-Execução (Antes de Cada Rodada)

### Ambiente Vivo

- [ ] **Cidadão Smart está acessível?**
  - Abrir `$CIDADAO_SMART_BASE_URL` no browser
  - Deve carregar home sem erros

- [ ] **Booking Admin está acessível?**
  - Abrir `$BOOKING_ADMIN_BASE_URL` no browser
  - Deve carregar página de login

- [ ] **SMART está acessível?**
  - Abrir `$SMART_BASE_URL` no browser
  - Deve carregar página de login

- [ ] **APIs respondendo?**
  ```bash
  curl -v https://cidadao-smart.example.com/health
  curl -v https://booking-admin.example.com/health
  curl -v https://smart.example.com/health
  ```
  Todos devem retornar 200.

### Conectividade

- [ ] **Internet está estável?**
  - Testes precisam de conexão constante
  - Evitar WiFi fraco ou 4G instável
  - Usar Ethernet se possível

- [ ] **Nenhuma VPN bloqueando?**
  - Se usar VPN, verificar se permite acesso aos hosts
  - Alguns ambientes bloqueiam Selenium/Playwright

- [ ] **Firewall deixa requisições sair?**
  - Ports 80, 443, 8080 desbloqueadas
  - Considerar exceção para `*.example.com`

### Máquina Local

- [ ] **Disco tem pelo menos 2GB disponível?**
  ```bash
  df -h  # Mostrar espaço em disco
  ```
  Testes geram screenshots e videos.

- [ ] **RAM livre? (Recomendado: 4GB mínimo)**
  ```bash
  free -h  # Linux/Mac
  wmic OS get TotalVisibleMemorySize,FreePhysicalMemory  # Windows
  ```

- [ ] **Nenhum outro Playwright/Puppeteer rodando?**
  ```bash
  ps aux | grep -E "playwright|chrome|firefox"
  ```
  Fechar outra instância se houver.

- [ ] **Porta padrão 3000/8080 livre?**
  ```bash
  lsof -i :3000  # Verificar se porta está ocupada
  ```

### Variáveis de Teste

- [ ] **Email de teste está acessível?**
  - Entrar em `CIDADAO_SMART_TEST_EMAIL`
  - Validar IMAP se configurado

- [ ] **CAPTCHA_MODE está correto?**
  - Se teste manual: `CAPTCHA_MODE=manual`
  - Se CI: `CAPTCHA_MODE=disabled`

- [ ] **Horário preferido é válido?**
  ```
  PREFERRED_TIME=09:00  # Formato HH:mm
  ```

### Hardware (Se Aplicável)

- [ ] **Câmera conectada e funcionando?**
  - Se teste exigir captura biométrica
  - Testar em Configurações → Câmera

- [ ] **Leitor biométrico conectado?**
  - Serial/USB deve ser detectado
  - Port correto em `BCC_PORT`

- [ ] **Microfone funcionando?**
  - Se conferência requer áudio
  - Testar em Configurações → Som

---

## ✅ Checklist Pré-Smoke (Rápida Validação)

Antes de rodar `npm run test:smoke`:

- [ ] Todos os 3 ambientes (Cidadão, Admin, SMART) acessíveis
- [ ] `.env.local` preenchido (ao menos URLs)
- [ ] Internet estável
- [ ] Sem outras execuções de teste rodando

---

## ✅ Checklist Pré-Regressão (Suite Completa)

Antes de rodar `npm run test:regressao`:

- [ ] **Todos os itens acima ✓**

- [ ] **Massa de dados preparada?**
  - Pelo menos 1 posto com horários disponíveis
  - Próxima semana sem bloqueios

- [ ] **Email de teste tem espaço?**
  - Caixa de entrada não está cheia
  - Deixar livre para receber códigos

- [ ] **Nenhum teste anterior deixou sistema inconsistente?**
  - Se dúvida, limpar dados (ex: agendamentos anteriores)

- [ ] **Esperar pelo menos 2 horas desde último teste**
  - Evitar throttling por rate limiting
  - Permitir cache expirar

---

## ✅ Checklist Pré-Manual (Com CAPTCHA)

Antes de rodar `npm run test:manual -- --headed`:

- [ ] **Todos os itens acima ✓**

- [ ] **CAPTCHA_MODE=manual?**
  ```
  CAPTCHA_MODE=manual
  ```

- [ ] **Tempo livre para completar?**
  - Fluxo completo leva 10-15 min
  - Reservar esse tempo, sem pressa

- [ ] **Teclado/mouse responsivos?**
  - CAPTCHA exigirá ação humana
  - Estar pronto para agir em tempo

- [ ] **Tela com boa iluminação?**
  - Para ver claramente os elementos
  - CAPTCHA pode ser difícil em tela escura

---

## ✅ Checklist Pré-CI (Pipeline)

Antes de fazer push que vai rodar testes em CI:

- [ ] **Nenhuma credencial em .env.example?**
  ```bash
  grep -i "password\|secret\|token" .env.example
  ```
  Não deve conter valores reais.

- [ ] **Nenhuma credencial em código?**
  ```bash
  grep -r "Griaule\|gbds_bind\|Senha" tests/ --include="*.ts"
  ```
  Não deve encontrar.

- [ ] **Nenhuma credencial em screenshots?**
  - Revisar últimos screenshots
  - Não deve conter senhas visíveis

- [ ] **Tag @manual não roda em CI?**
  ```bash
  npm run test:ci  # Não deve incluir @manual
  ```

- [ ] **Secrets configurados em CI/CD?**
  - GitLab: `Settings` → `CI/CD` → `Variables`
  - GitHub: `Settings` → `Secrets`
  - Variáveis: `BOOKING_ADMIN_PASSWORD`, `SMART_PASSWORD`

- [ ] **Branch está limpo?**
  ```bash
  git status  # Tudo committed
  git log -1  # Última mensagem faz sentido
  ```

---

## ✅ Checklist Pós-Execução (Após Testes Rodarem)

- [ ] **Todos os testes passaram ou falharam sabidamente?**
  - Revisar `test-results/` ou `playwright-report/`

- [ ] **Nenhum crash ou hang indefinido?**
  - Processo finalizou corretamente
  - Relatório foi gerado

- [ ] **Screenshots com credenciais foram removidos?**
  ```bash
  grep -r "password\|Griaule" test-results/ test-reports/
  ```
  Não deve conter.

- [ ] **Limpar artifacts se espaço em disco?**
  ```bash
  rm -rf test-results/ playwright-report/
  ```

---

## 🚨 Problemas Comuns & Soluções Rápidas

| Problema | Solução |
|----------|---------|
| "Cannot find module '@playwright/test'" | `npm install` |
| "BOOKING_ADMIN_PASSWORD não configurada" | Preencher `.env.local` |
| "Connection refused" | Verificar se ambiente vivo está up |
| "Timeout após 30s" | Aumentar `NAVIGATION_TIMEOUT` |
| "CAPTCHA não resolveu" | Aumentar `CAPTCHA_MANUAL_TIMEOUT` |
| "Email código não chegou" | Verificar spam/IMAP |
| "Nenhuma data disponível" | Verificar agenda no Booking Admin |
| "Port 3000 already in use" | `lsof -i :3000` e fechar |
| "Out of memory" | Fechar outros apps / reiniciar |
| "Video file not found" | Ativar `TRACE_ON_FAILURE=true` |

---

## 📋 Template de Checklist Personalizado

Copiar e colar em issue/ticket antes de rodar testes:

```markdown
### Pré-Execução
- [ ] Ambientes up
- [ ] .env.local preenchido
- [ ] Internet estável
- [ ] Disco com espaço
- [ ] Nenhuma execução anterior rodando

### Tipo de Teste
- [ ] Smoke (2-3 min)
- [ ] Regressão (15 min)
- [ ] API (3 min)
- [ ] Manual (15 min - com CAPTCHA)
- [ ] Full CI (20 min)

### Pós-Execução
- [ ] Resultado validado
- [ ] Screenshots limpos
- [ ] Relatório salvo
- [ ] Artefatos removidos (se needed)
```

---

## ⏱️ Tempo Estimado

| Atividade | Tempo |
|-----------|------|
| Setup inicial | 10 min (uma só vez) |
| Checklist pré-smoke | 2 min |
| Smoke test | 3 min |
| Checklist pré-regressão | 2 min |
| Regressão | 15 min |
| Checklist pré-manual | 1 min |
| Manual + CAPTCHA | 15 min |
| CI full | 20 min |

---

**Lembrete:** ✅ Checklist rigoroso = Testes confiáveis! 

Cada falta compromete resultado.
