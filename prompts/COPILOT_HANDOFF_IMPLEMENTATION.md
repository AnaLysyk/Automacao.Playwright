# 🚀 Cidadão Smart - Automação Playwright [COPILOT HANDOFF]

## Contexto Consolidado para Implementação

Você vai implementar a **automação Playwright completa** para o fluxo do Cidadão Smart 2.X.X. O projeto está 100% scaffoldado. Você precisa **afinar seletores, implementar lógica de fluxo e validações** conforme a especificação abaixo.

---

## 1. Arquivos Criados e Estado Atual

✅ **Scaffold 100% pronto:**
- 5 Page Objects estruturados (Local, DataHora, Resumo, Autenticacao, Confirmacao)
- 5 Selector files centralizados
- 4 Specs base + 3 Specs 2ª Via (expressa, alterações, GBDS)
- Fixtures, helpers, masa de teste
- `.env.example`, `playwright.config.ts`, `package.json`
- Context/documentation consolidada

❓ **Precisa implementação real:**
- Seletores CSS/getByRole/getByLabel refinados conforme UI real em 172.16.1.146
- Lógica de preenchimento de formulários (máscaras, validações frontend)
- Fluxo de CAPTCHA (manual com `page.pause()`)
- Validações de negócio (idade, telefone, CPF elegibilidade)
- Integração com webhooks GBDS

---

## 2. Regras Críticas (Falha se Violar)

1. **Top Tower vs Aeroporto**: Se resumo ou confirmação mostrar "Aeroporto", o teste FALHA
2. **CAPTCHA**: Nunca burlar, sempre `page.pause()` ou `CAPTCHA_MODE=disabled`
3. **Protocolo**: Dinâmico, regex `/02026\d{7,}/`, NUNCA hardcoded
4. **CPF em GBDS**: Webhook NUNCA com plaintext, sempre hash
5. **Validação Idade**: Menor de 16 = rejeição automática
6. **Telefone**: Obrigatório sempre
7. **Nome**: Mínimo 2 palavras (nome + sobrenome)

---

## 3. Fluxo Presencial (5 Rotas)

```
[Local] → [DataHora] → [Resumo] → [Autenticacao] → [Confirmacao]
   ↓         ↓           ↓           ↓               ↓
  Select   Fill      Validate      Code          Protocolo
  City     Data      Top Tower      Seg.         Dinâmico
  Posto    Phone     Address        + Prosseguir  Confirmado
  CAPTCHA  Email     Nenhum Aero    Validar
  Prosseguir CPF             Prosseguir
```

### Rota 1: /agendamentos/novo/local

**Actions:**
- Buscar cidade "Florianópolis" (combobox ou search)
- Clicar no radio/option da cidade
- Selecionar posto "PCI - FLORIANÓPOLIS - Top Tower" (radio ou button)
- Validar que NÃO selecionou "Aeroporto"
- Resolver CAPTCHA (manual com page.pause)
- Cliar "Prosseguir" ou "Próximo"

**Validações:**
- Página exibe "Seleione local" ou similar
- Título contém "Local"
- Cidade Florianópolis aparece na lista
- Posto Top Tower visível e selecionável

### Rota 2: /agendamentos/novo/data-e-hora

**Actions:**
- Preencher Nome (mín. 2 palavras, sem números)
- Preencher Data Nascimento (DD/MM/YYYY, >= 16 anos)
- Preencher Email (validação padrão)
- Preencher CPF (opcional, validação RFB se preenchido)
- Preencher Telefone (obrigatório)
- Clicar modal "Selecionar Data" → Escolher 18/05/2026 (ou próxima data disponível)
- Clicar modal "Selecionar Horário" → Escolher 08:00 (ou 1º disponível)
- Cliar "Prosseguir"

**Validações Frontend:**
- Nome vazio = erro "nome obrigatório"
- Nome 1 palavra = erro "nome + sobrenome"
- Data < 16 anos = erro "menor de 16"
- Telefone vazio = erro "telefone obrigatório"
- CPF inválido = aviso "CPF inválido" (se filled)

### Rota 3: /agendamentos/novo/resumo

**Actions:**
- Validar que TODOS os campos aparecem (nome, cpf, data nasc, email, telefone, data, hora)
- Validar que endereço = "Rua Esteves Júnior, 50" (Top Tower)
- Validar que NÃO contém "Aeroporto" em lugar algum
- Cliar "Prosseguir" ou "Confirmar"

**Validações:**
- Cada campo corresponde ao digitado na rota anterior
- Máscara CPF exibida corretamente (se preenchido)
- Data/hora formatadas legívelmente

### Rota 4: /agendamentos/novo/autenticacao

**Actions:**
- Validar mensagem "Código de segurança enviado"
- Preencher campo de código com valor de `process.env.CIDADAO_SMART_SECURITY_CODE` (111030)
- Cliar "Verificar" ou "Validar"
- Esperar mensagem "Código de segurança validado!"
- Cliar "Prosseguir" ou "Próximo"

**Validações:**
- Campo visível e editável
- Mensagem sucesso aparece
- Botão próximo ativado após validação

### Rota 5: /agendamentos/novo/confirmacao

**Actions:**
- Validar mensagem "Agendamento confirmado"
- Extrair protocolo usando regex `/02026\d{7,}/`
- Validar que protocolo é único (não fixo)
- Validar que TopTower aparece (endereço, postal, etc.)
- Validar botões: "Baixar Guia", "Página Inicial"
- **NÃO cliar "Cancelar"** (apenas validar visibilidade)

**Validações:**
- Título contém "Confirmado" ou "Sucesso"
- Protocolo exibido e válido
- Dados finais (nome, data, hora, local) visíveis
- Botões Next Steps disponíveis

---

## 4. Massa de Teste (CPFs em `cidadaoSmartMass.ts`)

### Elegíveis

```typescript
// 2ª Via Expressa OK
{
  cpf: "03659187763",
  nome: "ILHZMV HLZIVH ERVRIZ",
  dataNascimento: "19740124",
  statusRFB: "0"
}

// 2ª Via com Alterações OK
{
  cpf: "06834801707",
  nome: "OFXRVMV WZ XLMXVRXZL TLMXZOEVH XZNKLH",
  dataNascimento: "19761208",
  statusRFB: "0"
}
```

### Inelegíveis

```typescript
// Menor 16
{
  cpf: "13036174630",
  dataNascimento: "20130516",
  bloqueadoPor: "MENOR_16_ANOS"
}

// CPF Cancelado
{
  cpf: "00979771447",
  statusRFB: "2",
  bloqueadoPor: "CPF_CANCELADO"
}

// Processo Duplicado
{
  cpf: "03659184829",
  bloqueadoPor: "PROCESSO_EM_ANDAMENTO"
}
```

---

## 5. Helpers Reutilizáveis (já em `flows/cidadaoSmartFlows.ts`)

```typescript
// Chegar na tela Data e Hora (reutilizável em validações)
await chegarNaTelaDataHora(page, "Florianópolis", "PCI - FLORIANÓPOLIS - Top Tower");

// Chegar na tela Resumo (com dados preenchidos)
const { dataAgendamento, horarioAgendamento } = await chegarNaTelaResumo(
  page,
  {
    nome: "Ana Teste Automacao",
    dataNascimento: "01/01/2009",
    email: "ana@test.com",
    cpf: "03659184829",
    telefone: "55555555555"
  }
);
```

---

## 6. Seletores Dinâmicos (Ajustar conforme UI real)

### getByRole (Preferência 1)
```typescript
page.getByRole('radio', { name: /Florianópolis/i })
page.getByRole('button', { name: /Prosseguir/i })
page.getByRole('option', { name: /Top Tower/i })
```

### getByLabel (Preferência 2)
```typescript
page.getByLabel(/Nome Completo/i)
page.getByLabel(/Data de Nascimento/i)
page.getByLabel(/Telefone/i)
```

### getByPlaceholder (Preferência 3)
```typescript
page.getByPlaceholder('Ex: João Silva')
page.getByPlaceholder('(XX) XXXXX-XXXX')
```

### getByText (Preferência 4)
```typescript
page.locator('text=/Selecione local/i')
page.getByText('Agendamento confirmado')
```

### data-testid (Preferência 5)
```typescript
page.locator('[data-testid="protocolo-numero"]')
page.locator('[data-testid="endereco-confirmacao"]')
```

---

## 7. Validações de Negócio

### Validação Idade
```typescript
const birthDate = new Date("20130516");
const today = new Date();
const age = today.getFullYear() - birthDate.getFullYear();

if (age < 16) {
  // Erro: Menor 16 anos não é elegível
  await expect(page.locator('text=Menor de 16 anos')).toBeVisible();
}
```

### Validação CPF RFB
```typescript
// Se status = "2" (cancelado), rejeitar
if (cpfStatus === "2") {
  await expect(page.locator('text=CPF cancelado junto à Receita Federal')).toBeVisible();
}
```

### Validação Telefone
```typescript
if (!telefone || telefone.trim() === "") {
  await expect(page.locator('text=Telefone obrigatório')).toBeVisible();
}
```

---

## 8. Integração GBDS Notificador

### Webhook Esperado

```typescript
POST /notificador/notificar
{
  "status": "RECEIVED" | "PROCESSING" | "APPROVED" | "REJECTED",
  "protocolo": "020260001234567", // dinâmico
  "cpfHash": "e3b0c44...", // SHA256(cpf)
  "email": "usuario@example.com",
  "nome": "Ana Teste",
  "motivo": "CPF_CANCELADO" // só em REJECTED
}
```

### Capturar e Validar

```typescript
const payloads: any[] = [];

await page.on("request", (request) => {
  if (request.url().includes("/notificador/notificar")) {
    payloads.push(request.postDataJSON());
  }
});

// Validar que CPF NUNCA é plaintext
expect(payloads[0]).not.toHaveProperty("cpf");
expect(payloads[0]).toHaveProperty("cpfHash");
```

---

## 9. Configuração de Ambiente

### .env (criar localmente)
```env
CIDADAO_SMART_BASE_URL=https://172.16.1.146
CIDADAO_SMART_SECURITY_CODE=111030
CAPTCHA_MODE=manual
CIDADAO_SMART_DEFAULT_CITY=Florianópolis
CIDADAO_SMART_DEFAULT_SERVICE_POINT=PCI - FLORIANÓPOLIS - Top Tower
```

### playwright.config.ts (já pronto)
- timeout: 90_000 (VPN)
- expect.timeout: 15_000
- ignoreHTTPSErrors: true
- retries: 0
- baseURL: `process.env.CIDADAO_SMART_BASE_URL`

---

## 10. Npm Scripts

```bash
# Rodar TODOS os testes Cidadão
npm run test:cidadao

# Rodar apenas presencial
npm run test:cidadao:agendamento

# Rodar 2ª via expressa
npm run test:cidadao:2via-expressa

# Rodar 2ª via alterações
npm run test:cidadao:2via-alteracoes

# Rodar GBDS notificador
npm run test:cidadao:gbds

# Com browser visível (debug)
npm run test:headed

# Modo debug completo
npm run test:debug

# Ver relatório HTML
npm run test:report
```

---

## 11. Test.step() - Usar para Granularidade

Todos os specs devem usar `test.step()` para clareza em relatórios:

```typescript
test("Fluxo feliz 2ª via", async ({ page }) => {
  await test.step("1. Acessar local", async () => { ... });
  await test.step("2. Selecionar cidade", async () => { ... });
  await test.step("3. Resolver CAPTCHA", async () => { ... });
  // ... etc
});
```

---

## 12. Tarefas de Implementação Imediata

### Priority 1 - Fluxo Feliz Presencial
- [ ] Confirmar URLs exatas das 5 rotas
- [ ] Afinar seletores para cada campo (getByRole > getByLabel > data-testid)
- [ ] Implementar lógica de preenchimento com máscaras (DD/MM/YYYY, telefone, CPF)
- [ ] Testar CAPTCHA pause com browser real
- [ ] Validar que protocolo /02026\d{7,}/ é dinâmico
- [ ] **CRÍTICO**: Verificar Top Tower x Aeroporto em resumo/confirmacao

### Priority 2 - Validações Negativas
- [ ] Testar rejeição menor 16 anos
- [ ] Testar rejeição CPF cancelado
- [ ] Testar obrigatoriedade de telefone
- [ ] Testar validação nome (mín. 2 palavras)
- [ ] Testar data nascimento limite (16 anos)

### Priority 3 - 2ª Via com Alterações
- [ ] Mapear tela de conferência de documentos
- [ ] Implementar lógica aceita/rejeita docs
- [ ] Validar status PARTIALLY_REJECTED vs TOTAL_REJECTED
- [ ] Testar fluxo pagamento Pix

### Priority 4 - GBDS & Segurança
- [ ] Validar webhook `/notificador/notificar` é disparado
- [ ] Verificar que CPF está sempre hasheado (NUNCA plaintext)
- [ ] Testar sequência status: RECEIVED → PROCESSING → APPROVED
- [ ] Validar payload com protocolo correto

---

## 13. Dúvidas/Bloqueadores (Reportar)

- [ ] URL exata da rota 2ª Via Alterações? (`/agendamentos/2via-alteracoes`?)
- [ ] Modal de horários usa scroll, select ou buttons?
- [ ] CAPTCHA é reCAPTCHA v3 ou v2?
- [ ] Agenda está pre-carregada com múltiplas datas ou dinamicamente?
- [ ] Campo CPF é obrigatório ou opcional na rota 2?
- [ ] Máscara CPF é aplicada pelo input ou pelo JS?

---

## 14. Próximos Passos Após Implementação

1. Rodar suite completa contra 172.16.1.146 (VPN)
2. Validar relatório HTML (screenshot/video em caso de falha)
3. Ajustar timeouts se necessário (VPN pode ser lenta)
4. Implementar Gmail API (substituir .env SECURITY_CODE)
5. Adicionar specs: download guia, cancelamento, rastreamento

---

## 📋 Resumo para Você

**Projeto:** Automação Playwright - Cidadão Smart 2ª Via Expressa + 2ª Via com Alterações

**Scaffold:** 100% Pronto (25 arquivos)

**Sua Missão:**
1. Afinar seletores CSS/getByRole conforme UI real em 172.16.1.146
2. Implementar lógica fluxo: Local → DataHora → Resumo → Auth → Confirmacao
3. Validar regras críticas: Top Tower, CAPTCHA, protocolo dinâmico, CPF hash em webhook
4. Rodar suite, reportar falhas, iterar até verde

**Tempo Estimado:** 4-6 horas (seletores + fluxo + validações)

**Entrega:** Suite rodando 100%, relatório HTML sem falhas, docs atualizadas

---

**BOA SORTE! 🚀**
