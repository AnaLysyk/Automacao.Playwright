# Planner Run - Emissao Online

## Metadata

- run_id: planner-cidadao-smart-emissao-online-2026-05-12-01
- created_at: 2026-05-12
- stage: Planner
- status: approved-for-generation
- product: Cidadao Smart
- feature: Emissao Online
- start_route: /
- base_url_env: CIDADAO_SMART_BASE_URL
- safety_flags:
  - dry_run: true
  - no_confirm: true
  - no_cancel: true
  - captcha_mode: manual

## Inputs Used

### User Story Summary

Mapear e automatizar o fluxo de Emissao Online de forma agentic:
Home -> Autenticacao -> Tipo de Emissao -> Captura -> Validacao -> Resumo.

### Known Routes

- /
- /emitir/nao-sei-meu-cpf
- /emitir/tipo-emissao
- /emitir/captura
- /emitir/validacao-documentos
- /emitir/valida-documentos
- /emitir/resumo
- /consulta-protocolo
- /agendamentos/consultar

### Business Rules

- Nao burlar CAPTCHA.
- Nao automatizar Gmail via UI.
- Nao confirmar emissao real sem aprovacao explicita.
- Nao cancelar agendamento sem aprovacao explicita.
- Se Top Tower foi selecionado e Resumo mostrar Aeroporto, classificar como bug.

### Known Risks

- Falta de data-testid em partes criticas.
- CAPTCHA manual aumenta tempo e variabilidade.
- Rotas de validacao podem variar entre /validacao-documentos e /valida-documentos.
- Fluxo com camera e mais instavel que upload.

### Test Data and Fixtures

- valid photo fixture: tests/support/files/valid-photo.jpg
- fallback test identity (env):
  - CIDADAO_SMART_EMISSAO_TEST_NOME
  - CIDADAO_SMART_EMISSAO_TEST_NOME_MAE
  - CIDADAO_SMART_TEST_BIRTH_DATE

## Scope

### In Scope

1. Tela Home da Emissao Online.
2. Autenticacao de Emissao.
3. Tipo de Emissao (reimpressao e 2a via com alteracoes).
4. Captura via upload (caminho principal).
5. Avanco em validacao sem alteracoes destrutivas.
6. Resumo com validacao de Top Tower e regra de aceite.
7. Consultas isoladas:
   - /consulta-protocolo
   - /agendamentos/consultar

### Out of Scope

1. Captura real por camera como caminho principal.
2. Confirmacao final real da emissao.
3. Cancelamento real de agendamento.
4. Automacao de leitura de codigo por Gmail UI.

## Scenario Matrix

| id | scenario | type | automatable | notes |
|---|---|---|---|---|
| EO-HOME-01 | Validar conteudo da Home | positive | yes | smoke de entrada |
| EO-HOME-02 | Navegar para Emissao Online | positive | yes | depende checkbox 16+ |
| EO-HOME-03 | Navegar para Consultar Pedido | positive | yes | rota dedicada |
| EO-AUTH-01 | Validar layout de autenticacao | positive | yes | campos e botoes |
| EO-AUTH-02 | Validar obrigatoriedade de campos | negative | yes | sem dados |
| EO-AUTH-03 | Preencher valido + CAPTCHA + avancar | positive | yes | manual step |
| EO-TIPO-01 | Validar opcoes de tipo | positive | yes | 2 opcoes |
| EO-TIPO-02 | Reimpressao e avancar | positive | yes | caminho simplificado |
| EO-TIPO-03 | 2a via com alteracoes e avancar | positive | yes | caminho completo |
| EO-CAP-01 | Upload foto valida + aceitar ajuste | positive | yes | usar filechooser |
| EO-CAP-02 | Prosseguir habilitado apos captura | positive | yes | gate de navegacao |
| EO-VAL-01 | Avancar validacao sem alteracoes | positive | yes | sem acoes destrutivas |
| EO-RES-01 | Validar blocos do resumo | positive | yes | dados e posto |
| EO-RES-02 | Prosseguir desabilitado sem aceite | negative | yes | regra critica |
| EO-RES-03 | Prosseguir habilitado com aceite | positive | yes | regra critica |
| EO-RES-04 | Detectar Aeroporto quando esperado Top Tower | negative | yes | classificar bug |
| EO-CONP-01 | Consulta pedido com protocolo invalido | negative | yes | sem protocolo real |
| EO-CONA-01 | Consulta agendamento com protocolo invalido | negative | yes | sem cancelamento |
| EO-CAM-01 | Abrir fluxo camera e validar UI | exploratory | partial | nao principal |

## Manual-Only or Controlled Steps

- CAPTCHA: manual/controlado por ambiente.
- Protocolo valido de consulta: depende massa real em ambiente.
- Confirmacao final de emissao: bloqueada por seguranca neste run.

## Blockers

1. Se a VPN cair, run bloqueado.
2. Se faltar fixture valid-photo.jpg, cenario de captura fica skipped.
3. Se ambiente exigir camera para seguir, upload pode nao cobrir 100% do fluxo.

## Selector Strategy

Prioridade de locators:
1. getByRole
2. getByLabel
3. getByPlaceholder
4. getByText
5. getByTestId

Recomendacao para produto:
- adicionar data-testid em cards, botoes de prosseguir, upload, aceite e bloco de posto.

## Generated/Target Artifacts

### Spec Files (implemented)

- tests/cidadao-smart-home.spec.ts
- tests/cidadao-smart-emissao-autenticacao.spec.ts
- tests/cidadao-smart-emissao-tipo.spec.ts
- tests/cidadao-smart-emissao-online-captura.spec.ts
- tests/cidadao-smart-emissao-resumo.spec.ts
- tests/cidadao-smart-consulta-pedido.spec.ts
- tests/cidadao-smart-consulta-agendamento.spec.ts
- tests/cidadao-smart-emissao-online-fluxo-completo.spec.ts

### Page Objects (implemented)

- tests/pages/CidadaoSmartHomePage.ts
- tests/pages/CidadaoSmartEmissaoAutenticacaoPage.ts
- tests/pages/CidadaoSmartEmissaoTipoPage.ts
- tests/pages/CidadaoSmartEmissaoCapturaPage.ts
- tests/pages/CidadaoSmartEmissaoResumoPage.ts
- tests/pages/CidadaoSmartConsultaPedidoPage.ts
- tests/pages/CidadaoSmartAgendamentoConsultaPage.ts

### Selector Files (implemented)

- tests/pages/selectors/CidadaoSmartHomePageSelectors.ts
- tests/pages/selectors/CidadaoSmartEmissaoAutenticacaoPageSelectors.ts
- tests/pages/selectors/CidadaoSmartEmissaoTipoPageSelectors.ts
- tests/pages/selectors/CidadaoSmartEmissaoCapturaPageSelectors.ts
- tests/pages/selectors/CidadaoSmartEmissaoResumoPageSelectors.ts
- tests/pages/selectors/CidadaoSmartConsultaPedidoPageSelectors.ts
- tests/pages/selectors/CidadaoSmartAgendamentoConsultaPageSelectors.ts

## Acceptance Criteria for Planner Stage

- Escopo separado por mundo (Emissao, Consulta, Agendamento): done.
- Cenarios positivos e negativos definidos: done.
- Riscos e bloqueios documentados: done.
- Regras criticas de negocio preservadas: done.
- Saida orientada para geracao e execucao: done.

## Next Stage Handoff

### Explorer

- Executar exploracao guiada por rota, coletando candidatos de selectors estaveis e prints.
- Salvar em: test-results/exploration/emissao-online-exploration.md

### Runner

Comandos iniciais sugeridos:

- npx playwright test tests/cidadao-smart-home.spec.ts --headed
- npx playwright test tests/cidadao-smart-emissao-autenticacao.spec.ts --headed
- npx playwright test tests/cidadao-smart-emissao-tipo.spec.ts --headed
- npx playwright test tests/cidadao-smart-emissao-online-captura.spec.ts --headed
- npx playwright test tests/cidadao-smart-emissao-online-fluxo-completo.spec.ts --headed

### Healer

- Corrigir apenas falhas tecnicas (selector/wait/import/data format).
- Nao alterar expectativa de Top Tower para Aeroporto.

### Reporter

- Consolidar resultado em: test-results/reports/emissao-online-test-report.md
