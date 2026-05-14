# AGENTS.md

## Visão Geral

Este repositório é a base de automação Playwright para Booking / Cidadão Smart / SMART.

O objetivo é construir uma automação profissional, rastreável e segura para os fluxos críticos da Griaule, com suporte a ambientes 146 e 201, evidências por etapa, classificação de falhas e separação clara entre contexto funcional, casos de teste e specs automatizadas.

O projeto antigo Automation Exercise é legado e não faz parte da execução principal.

## Regras Obrigatórias

1. Usar TypeScript.
2. Não commitar senhas, tokens, credenciais, VPN, root, códigos reais ou dados sensíveis.
3. Não burlar CAPTCHA real.
4. Tratar fluxos com CAPTCHA e código por e-mail como `manual-assisted`.
5. Separar contexto, casos de teste e automação.
6. Contexto funcional fica em `context/requirements/`.
7. Casos de teste ficam em `context/test-cases/`, Qase ou CDS.
8. Specs automatizadas ficam em `tests/`.
9. Page Objects representam telas.
10. Agents orquestram fluxos.
11. Specs devem ser limpas e chamar agents.
12. Gerar evidência por etapa quando houver execução de fluxo.
13. Tratar `KNOWN-POSTO-001` Top Tower/Aeroporto como warning, não como falha do E2E principal.
14. Automation Exercise deve ficar em `legacy/automation-exercise/` e não fazer parte da execução principal.
15. A automação deve suportar ambientes 146 e 201 por `.env.local`.
16. Não implementar fluxo completo antes da fundação compilar.
17. O primeiro pacote deve garantir que `npx playwright test --list` funcione e que o project `chromium` exista.

## Estrutura Oficial

Use a estrutura abaixo. Não criar arquitetura paralela.

```text
context/
  requirements/
  test-cases/

docs/

tests/
  agents/
  config/
  data/
  types/
  pages/
  booking/
    public/
    e2e/
    manual-assisted/
  booking-admin/
    read-only/
    write/
  api/
    booking/
    cidadao-smart/
    notifier/

legacy/
  automation-exercise/
```

## Contexto, Caso de Teste e Automação

`context/requirements/` explica o produto:

- regra de negócio;
- ambiente;
- integração;
- known issue;
- comportamento esperado;
- dependência operacional.

`context/test-cases/`, Qase ou CDS descrevem casos de teste.

`tests/` contém a automação executável.

Não transformar documento de contexto em spec diretamente sem extrair critério de aceite e comportamento verificável.

## Page Objects

Page Objects conhecem telas.

Eles devem conter ações pequenas e diretas:

- acessar tela;
- validar tela;
- clicar;
- preencher;
- selecionar data;
- selecionar horário;
- prosseguir;
- ler mensagem ou valor exibido.

Page Object não decide o fluxo completo e não classifica falha de negócio.

Seletores devem ficar separados quando houver arquivo de selectors da tela.

Preferir:

- `getByRole`;
- `getByLabel`;
- `getByPlaceholder`;
- `getByText`;
- `getByTestId`.

Evitar:

- XPath;
- CSS frágil;
- excesso de `nth()`;
- seletor baseado em layout instável.

## Agents

Agents orquestram fluxos.

Eles sabem:

- qual tela vem depois;
- quando pausar;
- quando registrar evidência;
- quando tratar CAPTCHA;
- quando tratar código por e-mail;
- quando continuar;
- quando classificar erro;
- quando registrar known issue.

Agents devem usar Page Objects. Não colocar seletores diretos na spec.

## Specs

Specs devem ser limpas.

Exemplo esperado:

```ts
test('@booking @manual-assisted @e2e agendamento presencial assistido', async ({ page }) => {
  const agent = new BookingAgendamentoAssistidoAgent(page);
  await agent.executarFluxoCompleto();
});
```

Specs não devem concentrar regra de tela, lógica de fluxo, CAPTCHA, e-mail ou evidência.

## Ambientes

A automação deve ser configurada por `.env.local`.

Ambientes principais:

- `146`: desenvolvimento/homologação, usado para testes em andamento, validações novas e automação assistida.
- `201`: produção ou produção-like, usado com cautela, priorizando validações read-only e comparação de comportamento.

Variáveis principais:

```env
TARGET_ENV=146
CIDADAO_SMART_BASE_URL=https://172.16.1.146
BOOKING_ADMIN_BASE_URL=https://172.16.1.146/admin/login
SMART_REACT_URL=http://172.16.1.146:8100/react
CAPTCHA_MODE=manual
EXECUTION_MODE=manual-assisted
CIDADAO_SMART_SECURITY_CODE=
PW_SLOW_MO=300
EVIDENCE_DIR=test-results
```

Antes de executar testes que acessam ambiente interno, validar VPN e URL manualmente.

## Segurança

Nunca versionar:

- `.env`;
- `.env.local`;
- senhas;
- tokens;
- credenciais;
- chaves privadas;
- códigos reais de segurança;
- credenciais de VPN;
- credenciais de banco ou servidor;
- dados sensíveis reais;
- artefatos locais de execução.

`.env.example` deve conter apenas placeholders seguros.

## CAPTCHA

CAPTCHA real não deve ser burlado.

Estratégias permitidas:

- `CAPTCHA_MODE=manual`: resolução manual durante execução assistida.
- `CAPTCHA_MODE=disabled`: somente em QA controlado.
- `CAPTCHA_MODE=test`: somente quando oficialmente suportado.
- allowlist: somente em ambiente QA controlado.

Fluxos que dependem de CAPTCHA real devem ficar em:

```text
tests/booking/manual-assisted/
tests/manual-assisted/
```

## Captura com Câmera / Fake Video

Captura por câmera não é CAPTCHA.

Regras obrigatórias:

- CAPTCHA real continua proibido de burlar.
- Captura pode usar `CAPTURE_MODE=fake-video` quando tecnicamente possível e em ambiente controlado.
- Usar `CAPTURE_MODE=manual` quando a pessoa precisar realizar a captura.
- Usar `CAPTURE_MODE=disabled` somente quando houver suporte oficial de QA.
- Imagem estática de rosto pode servir como origem, mas deve ser convertida para `.y4m` antes da POC.
- Não versionar imagem ou vídeo sensível ou com pessoa real sem aprovação.
- Criar POC antes de integrar captura fake ao fluxo real.
- Se Capturing estiver instável no ambiente 146, classificar como falha de ambiente/integração quando aplicável.

Variáveis esperadas:

```env
CAPTURE_MODE=manual
CAMERA_FAKE_IMAGE_PATH=
CAMERA_FAKE_VIDEO_PATH=
CAMERA_FAKE_VIDEO_SECONDS=5
CAMERA_FAKE_VIDEO_SIZE=640x480
```

## Código de Segurança por E-mail

Não automatizar UI do Gmail.

Estratégias permitidas:

- `EMAIL_CODE_MODE=manual`: preenchimento manual na tela;
- `EMAIL_CODE_MODE=env`: código lido de `CIDADAO_SMART_SECURITY_CODE`;
- `EMAIL_CODE_MODE=gmail-api`: Gmail API/OAuth com caixa de teste;
- `EMAIL_CODE_MODE=internal-api`: endpoint interno de QA;
- `EMAIL_CODE_MODE=log`: leitura autorizada de logs;
- `CIDADAO_SMART_SECURITY_CODE` em `.env.local`;
- preenchimento manual na tela;
- Gmail API/OAuth em evolução futura;
- endpoint interno de QA;
- leitura autorizada de logs;
- mock/fake provider em ambiente controlado.

Enquanto o código depender de pessoa ou e-mail real, o fluxo é `manual-assisted`.

## Evidências

Fluxos relevantes devem registrar evidência por etapa.

Evidências esperadas:

- screenshot;
- vídeo;
- trace;
- URL atual;
- timestamp;
- etapa;
- status;
- known issue;
- classificação de falha;
- resumo Markdown quando aplicável.

Diretórios esperados:

```text
test-results/
playwright-report/
```

## Known Issues

Known issues são comportamentos já mapeados que não devem quebrar o fluxo principal quando a regra do projeto mandar continuar.

Known issue atual:

```text
KNOWN-POSTO-001 - Divergência Top Tower / Aeroporto
```

Se aparecer Aeroporto após seleção de Top Tower:

- registrar warning;
- registrar evidência;
- não quebrar o E2E principal por essa divergência específica;
- não alterar a expectativa de negócio para esconder o problema.

## Classificação de Falhas

Ao falhar, classificar a causa provável:

- produto;
- automação;
- ambiente;
- massa;
- configuração;
- permissão;
- integração;
- agenda indisponível;
- CAPTCHA;
- código de e-mail;
- known issue.

Não tratar todo erro automaticamente como bug de produto.

## Ordem de Implementação

Não abrir novas frentes fora desta ordem.

### Pacote 1 - Fundação

Criar ou ajustar:

- `AGENTS.md`;
- `.env.example`;
- `package.json`;
- `playwright.config.ts`;
- `tsconfig.json`;
- `.gitignore`;
- estrutura de pastas;
- `tests/config/env.ts`;
- `tests/config/knownIssues.ts`;
- `tests/types/ExecutionContext.ts`;
- `tests/data/bookingAgendamentoData.ts`;
- `tests/agents/EvidenceAgent.ts`;
- `tests/agents/StepAgent.ts`.

Critério mínimo:

- TypeScript compila;
- `npx playwright test --list` funciona;
- project `chromium` existe;
- Automation Exercise está em `legacy/automation-exercise/`.

### Pacote 2 - Barreiras Manuais

Criar:

- `tests/agents/CaptchaAgent.ts`;
- `tests/agents/EmailCodeAgent.ts`.

Responsabilidades:

- CAPTCHA: detectar, pausar, orientar, continuar após Resume.
- Código por e-mail: usar `.env.local` ou permitir preenchimento manual.

### Pacote 3 - Fluxo Assistido

Criar:

- `tests/agents/BookingAgendamentoAssistidoAgent.ts`;
- `tests/booking/manual-assisted/booking-agendamento-assistido.spec.ts`.

Fluxo esperado:

- localização;
- posto;
- CAPTCHA;
- dados do requerente;
- data;
- horário;
- resumo;
- código;
- confirmação;
- protocolo;
- evidências.

### Pacote 4 - Regressão

Depois que o assistido rodar, quebrar em testes menores:

- `tests/booking/public/agendamento-local.spec.ts`;
- `tests/booking/public/dados-requerente.spec.ts`;
- `tests/booking/public/data-hora.spec.ts`;
- `tests/booking/public/resumo.spec.ts`;
- `tests/booking/public/autenticacao.spec.ts`;
- `tests/booking/public/confirmacao.spec.ts`.

## Projeto Legado

Automation Exercise deve ficar somente em:

```text
legacy/automation-exercise/
```

Esse conteúdo serve como referência didática e não deve entrar na execução principal do Booking / Cidadão Smart.

Não criar novos testes Booking dentro da estrutura legacy.

## Git e Publicação

Antes de commit/push:

1. Conferir `git status`.
2. Garantir que `.env.local`, evidências e logs não estão staged.
3. Rodar validações possíveis.
4. Informar falhas conhecidas.
5. Pedir aprovação quando houver alteração relevante.

Não fazer commit para esconder falha.

## Relatório

Todo relatório de execução deve conter:

- feature;
- ambiente;
- comando executado;
- status;
- cenários aprovados;
- cenários falhos;
- cenários bloqueados;
- caminhos de evidência;
- bugs encontrados;
- classificação provável da falha;
- próxima ação sugerida.
