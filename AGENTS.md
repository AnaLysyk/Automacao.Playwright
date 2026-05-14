# AGENTS.md

## Visao Geral do Projeto

Este repositorio demonstra automacao E2E com Playwright para o Cidadao Smart, com foco em apresentacao para Griaule.

Fluxo esperado:
- ler requisito
- planejar testes
- gerar automação Playwright
- executar testes
- salvar evidências
- gerar relatório
- sugerir correção técnica quando houver falha

## Escopo Principal

- Cidadao Smart - Agendamento Presencial
- Cidadao Smart - Emissao Online (captura e resumo)
- Fluxos complementares de consulta quando aplicavel

## Arquitetura Obrigatoria

Usar a estrutura organizada do repositorio, sem arquitetura paralela.

Pastas oficiais:
- tests/e2e/* para fluxos E2E independentes (sem intervencao manual)
- tests/manual-assisted/* para demos e testes assistidos (requerem acao manual)
- tests/agendamento-presencial/* para testes de regressao (agendamento presencial)
- tests/emissao-online/* para testes de regressao (emissao online)
- tests/consulta/* para testes de regressao (consultas)
- tests/2via/* para testes de regressao (2via)
- tests/api/* para testes de integracao com APIs
- tests/pages/*Page.ts para Page Objects
- tests/pages/selectors/*Selectors.ts para seletores
- tests/support/* para helpers, dados, rotas e diagnosticos
- context/requirements/* para regras de negocio
- context/user-stories/* para historias
- context/test-cases/* para repositorio de casos
- prompts/* para prompts de execução
- specs/* para planos de teste gerados
- test-results/* para artefatos de execução

## Regras de Implementacao Playwright

- usar TypeScript
- usar Page Object Model
- manter seletores separados dos metodos de pagina
- preferir getByRole, getByLabel, getByPlaceholder, getByText e getByTestId
- evitar XPath
- evitar CSS fragil
- evitar excesso de nth()
- usar test.step em fluxos maiores
- validar URL apos navegacao
- validar textos de negocio na tela
- manter trace, screenshot e video em caso de falha

## Regras de Seguranca

Nunca versionar:
- .env
- credenciais
- tokens Gmail
- codigos de seguranca
- dados sensiveis reais
- credenciais de VPN

## Regras de Ambiente

A aplicacao normalmente depende de VPN.

Antes da execucao, validar:
- VPN conectada
- CIDADAO_SMART_BASE_URL configurada
- URL acessa manualmente
- CAPTCHA_MODE configurado

## Regras de CAPTCHA

Nunca burlar CAPTCHA real.

Estrategias permitidas:
- CAPTCHA_MODE=manual
- CAPTCHA_MODE=disabled em QA controlado
- CAPTCHA_MODE=test quando oficialmente suportado
- allowlist em ambiente de QA controlado

## Regras de Codigo por Email

Nao automatizar UI do Gmail.

Usar:
- CIDADAO_SMART_SECURITY_CODE para execucoes manuais temporarias
- helper via API de email em evolucao futura

## Classificacao de Testes

### 1. Testes Automaticos Estáveis (Regressão)

São testes que rodam SEM intervencao humana e validam partes especificas do sistema.

Pastas:
- tests/agendamento-presencial/
- tests/emissao-online/
- tests/consulta/
- tests/2via/
- tests/api/

Características:
- Independentes entre si
- Sem dependencia de CAPTCHA manual
- Sem dependencia de email
- Sem dependencia de intervencao manual
- Validam aspectos isolados (um teste = uma funcionalidade)

Exemplos de nomes:
- [AGP-LOCAL-001] Validar tela de selecao de localizacao
- [AGP-DH-001] Validar selecao de data e horario disponivel
- [AGP-REQ-001] Validar validacao de telefone vazio

### 2. Testes E2E (Fluxos Completos Automaticos)

São testes que validam o fluxo inteiro da aplicacao, fim ao fim, sem intervencao manual.

Pasta:
- tests/e2e/

Características:
- Testam fluxo ponta a ponta
- Nao dependem de outro teste ter rodado antes
- Podem reaproveitar Page Objects e dados
- Podem ser maiores e mais complexos

Exemplos de nomes:
- [AGP-E2E-001] Agendamento presencial completo com posto Top Tower
- [EMISSAO-E2E-001] Emissao online completa com captura

### 3. Testes Assistidos / Demo (Manual-Assisted)

São testes que requerem intervencao humana durante a execucao e sao uteis para demonstracao.

Pasta:
- tests/manual-assisted/

Características:
- Requerem acao manual (CAPTCHA, cliques, etc)
- Uteis para demonstracao
- NAO devem ser tratados como regressao automatica
- Podem depender de ambiente instavel ou agenda disponivel

Exemplos de nomes:
- [DEMO-AGP-001] Fluxo completo assistido de agendamento com CAPTCHA e codigo
- [DEMO-EMISSAO-001] Demo de emissao completa com envio de email

## Nomeacao de Testes

Use padroes consistentes:

[TIPO-FUNCAO-NUMERO] Descricao clara do que valida

Abreviacoes:
- AGP = Agendamento Presencial
- EMI = Emissao Online
- CONS = Consulta
- 2V = 2Via
- API = Integracao API
- E2E = Fluxo completo automatico
- DEMO = Teste assistido
- LOCAL = Tela de localizacao
- DH = Data e Hora
- REQ = Requerente
- RES = Resumo
- AUTH = Autenticacao

Exemplos:
- [AGP-LOCAL-001] Validar tela de localizacao
- [AGP-DH-002] Validar selecao de horario
- [EMI-CAPT-001] Validar captura de documento
- [CONS-AGEN-001] Validar consulta de agendamento
- [API-NOTIF-001] Validar notificacao GBDS

## Regra Critica: Independencia de Testes

Cada teste deve:

1. Comecar sozinho (nao depender de outro ter rodado antes)
2. Preparar o que precisa (dados, estado, autenticacao)
3. Executar seu fluxo
4. Falhar sozinho (sem afetar outros testes)

O que PODE ser compartilhado:
- Massa de dados (em support/data/)
- Funcoes auxiliares (em support/helpers/)
- Page Objects (em pages/)
- Seletores (em pages/selectors/)

O que NAO PODE ser compartilhado:
- Teste 2 depender do teste 1 ter rodado
- Teste 3 depender do protocolo criado no teste 2
- Teste de regressao depender de CAPTCHA manual
- Teste depender de email recebido

## Regra Critica: Intervencao Manual

NAO permitida em:
- tests/agendamento-presencial/
- tests/emissao-online/
- tests/consulta/
- tests/2via/
- tests/api/
- tests/e2e/

PERMITIDA apenas em:
- tests/manual-assisted/

## Regra Critica: Posto Selecionado

A validacao de resumo e confirmacao deve refletir EXATAMENTE o posto selecionado no fluxo.

Se a tela mostrar posto diferente do selecionado:
- Classificar como bug de produto
- NAO alterar expectativa de negocio para fazer teste passar
- Reportar no relatorio

## Regras de Ambiente

A aplicacao normalmente depende de VPN.

Antes da execucao, validar:
- VPN conectada
- CIDADAO_SMART_BASE_URL configurada
- URL acessa manualmente
- CAPTCHA_MODE configurado (conforme tipo de teste)

Para testes assistidos (manual-assisted):
- CAPTCHA_MODE=manual (usuario marca manualmente)

Para testes automaticos (regressao, e2e):
- CAPTCHA_MODE=disabled (se em QA controlado)
- OU aguardar solucao de CAPTCHA automatizado
- OU usar allowlist em ambiente de QA

## Regras de Dry Run

Quando CIDADAO_SMART_DRY_RUN=true:
- parar no resumo
- validar dados
- nao confirmar solicitacao real
- nao cancelar agendamento real

## Comandos de Execucao

Instalar dependencias:

npm install

Instalar browsers:

npx playwright install

Listar testes:

npx playwright test --list

Executar tudo (apenas testes automaticos, sem manual-assisted):

npm run test:all

Executar em headed:

npm run test:headed

DEMOS E TESTES ASSISTIDOS (requerem intervencao manual):

Executar demo completa de agendamento:

npm run test:demo:agendamento

Executar demo passo a passo:

npm run test:demo:passo-a-passo

TESTES DE REGRESSAO - AGENDAMENTO PRESENCIAL:

Executar todos os testes de agendamento presencial:

npm run test:agendamento

Executar validacoes de localizacao:

npx playwright test tests/agendamento-presencial/local.spec.ts --headed

Executar validacoes de data e hora:

npx playwright test tests/agendamento-presencial/data-hora.spec.ts --headed

Executar validacoes de requerente:

npx playwright test tests/agendamento-presencial/validacoes-requerente.spec.ts --headed

Executar validacoes de resumo:

npx playwright test tests/agendamento-presencial/resumo.spec.ts --headed

TESTES DE REGRESSAO - EMISSAO ONLINE:

Executar todos os testes de emissao online:

npm run test:emissao

Executar captura:

npm run test:emissao:captura

Executar resumo:

npm run test:emissao:resumo

TESTES DE REGRESSAO - CONSULTAS:

Executar consulta de pedido:

npx playwright test tests/consulta/consulta-pedido.spec.ts --headed

Executar consulta de agendamento:

npx playwright test tests/consulta/consulta-agendamento.spec.ts --headed

TESTES DE REGRESSAO - 2VIA:

Executar 2via expressa:

npx playwright test tests/2via/2via-expressa.spec.ts --headed

Executar 2via com alteracoes:

npx playwright test tests/2via/2via-alteracoes.spec.ts --headed

TESTES DE INTEGRACAO - API:

Executar testes de API (notificador GBDS):

npx playwright test tests/api/notificador-gbds.spec.ts --headed

TESTES E2E - FLUXOS COMPLETOS:

Executar todos os E2E:

npm run test:e2e

Executar E2E de agendamento presencial:

npx playwright test tests/e2e/agendamento-presencial-fluxo-completo.spec.ts --headed

Executar E2E de emissao online:

npx playwright test tests/e2e/emissao-online-fluxo-completo.spec.ts --headed

MODO DEBUG E DESENVOLVIMENTO:

Abrir Playwright Inspector:

npm run test:debug

Abrir Playwright Test UI:

npm run test:ui

Gerar relatorios:

npm run report

## Fluxo de trabalho

Fluxo de trabalho obrigatório:
1. Ler história ou requisito
2. Extrair critérios de aceitação
3. Gerar plano de teste em specs/
4. Explorar fluxo quando necessário
5. Gerar ou atualizar testes em tests/
6. Executar testes
7. Curar apenas falhas técnicas
8. Gerar relatório em test-results/
9. Pedir aprovação antes de commit

## Regras de correção técnica

Pode corrigir:
- seletor quebrado
- espera e timing
- asserção de rota
- import ausente
- formatação de massa de teste
- método de Page Object

Não pode corrigir:
- mudando expectativa de negócio
- removendo asserções para passar
- pulando passo sem justificativa
- confirmando ou cancelando fluxo real sem aprovação

## Regra de Relatorio

Todo relatorio deve conter:
- feature
- ambiente
- comando executado
- status
- cenarios aprovados
- cenarios falhos
- cenarios bloqueados
- caminhos de evidencia
- bugs encontrados
- proxima acao sugerida
