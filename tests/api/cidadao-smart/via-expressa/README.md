# Automação API - Cidadão Smart | Via Expressa

Este diretório contém os testes automatizados do fluxo de **Via Expressa** do Cidadão Smart, executados via API com Playwright.

A automação foi criada para validar o comportamento principal do fluxo sem depender da interface, garantindo uma execução rápida para **Smoke**, **Regressão**, **Diagnóstico** e uso futuro em **CI/CD**.

---

## Objetivo da automação

O objetivo é validar se a API da Via Expressa consegue executar corretamente o ciclo principal:

1. Buscar um posto válido.
2. Emitir uma via expressa.
3. Consultar o protocolo emitido.
4. Deletar o processo criado.
5. Consultar novamente para confirmar que o processo não permanece ativo.

Esse fluxo é útil para identificar rapidamente se o problema está no backend/API ou em outra camada, como frontend, autenticação, regra de negócio ou integração.

---

## O que esta automação cobre

A automação cobre os seguintes cenários:

| Tag | Tipo | Descrição |
|---|---|---|
| `@emitir` | Smoke isolado | Busca um posto e emite uma via expressa |
| `@consultar` | Smoke isolado | Busca um posto, emite uma via expressa e consulta o protocolo gerado |
| `@deletar` | Smoke isolado | Busca um posto, emite uma via expressa e deleta o protocolo gerado |
| `@diagnostico-consulta` | Diagnóstico técnico | Testa variações de consulta com token, header e birthDate |
| `@cicd` | Fluxo completo | Executa o ciclo completo: buscar, emitir, consultar, deletar e validar pós-delete |

---

## Regra principal

Os testes isolados **não devem depender de protocolo fixo**.

Ou seja, os testes `@consultar` e `@deletar` precisam criar a própria massa antes de executar a ação principal.

Errado:

```txt
Usar sempre o mesmo protocolo salvo no .env
```

Certo:

```txt
Buscar posto → Emitir protocolo novo → Consultar ou deletar o protocolo criado
```

Isso evita falhas causadas por massa antiga, protocolo já deletado, protocolo inválido ou ambiente alterado.

---

## Estrutura dos arquivos

```txt
tests/api/cidadao-smart/via-expressa/
│
├── README.md
├── via-expressa.spec.ts
│
├── posto/
│   ├── posto.flow.ts
│   └── posto.data.ts
│
├── emitir/
│   ├── emitir.flow.ts
│   └── emitir.data.ts
│
├── consultar/
│   ├── consultar.flow.ts
│   └── consultar.data.ts
│
├── deletar/
│   ├── deletar.flow.ts
│   └── deletar.data.ts
│
└── diagnostico/
    ├── diagnosticar-consulta.flow.ts
    └── diagnosticar-consulta.data.ts
```

---

# Explicação dos arquivos

## `via-expressa.spec.ts`

Este é o arquivo principal dos testes.

Ele organiza os cenários Playwright e chama os flows de cada etapa.

Responsabilidades:

- Definir os testes por tag.
- Criar massa quando necessário.
- Validar os retornos principais.
- Anexar evidências no relatório HTML.
- Registrar observações conhecidas no relatório Markdown.

Cenários dentro dele:

```txt
@emitir
@consultar
@deletar
@diagnostico-consulta
@cicd
```

---

## `posto/posto.flow.ts`

Responsável por buscar um posto válido para usar no fluxo de Via Expressa.

Ele chama a API de postos e seleciona um posto compatível com o tipo esperado.

Fluxo interno:

```txt
Monta filtro de posto
Chama API de listagem de postos
Lê a lista retornada
Seleciona um posto válido
Retorna os dados principais do posto
```

Dados retornados:

```txt
id
description
type
cityName
uf
```

Exemplo de posto esperado:

```txt
PCI - FLORIANÓPOLIS - Top Tower
Florianópolis/SC
SERVICE_PICKUP
```

---

## `posto/posto.data.ts`

Arquivo de dados/configuração da busca de posto.

Normalmente contém:

```txt
filtroPreferencial
pageNumber
pageSize
types
```

Exemplo de uso:

```txt
Filtro: top tower
Tipos: SERVICE, PICKUP, SERVICE_PICKUP
```

Esse arquivo evita deixar massa fixa espalhada dentro do flow.

---

## `emitir/emitir.flow.ts`

Responsável por emitir uma Via Expressa.

Ele recebe o `pickupStationId`, monta o payload e chama a API de emissão.

Endpoint usado:

```txt
POST /api/v1/citizen-booking/processes/express
```

Fluxo interno:

```txt
Gera token Keycloak
Monta headers
Monta payload com dados da pessoa
Envia POST para emissão
Lê status, body e protocolo
Retorna os dados da emissão
```

Retorno esperado:

```json
{
  "protocol": "020260000000"
}
```

Esse flow retorna:

```txt
status
body
text
url
protocolo
payload
```

---

## `emitir/emitir.data.ts`

Arquivo de massa da emissão.

Normalmente contém:

```txt
path da API
nome da pessoa
CPF
data de nascimento
```

Exemplo:

```json
{
  "name": "Fernando da Silva",
  "cpf": "06842366720",
  "birthDate": "1990-05-20"
}
```

Observação: a massa deve ser controlada para não gerar conflito com regras do ambiente.

---

## `consultar/consultar.flow.ts`

Responsável por consultar uma Via Expressa pelo protocolo.

Endpoint usado:

```txt
GET /api/v1/citizen-booking/processes/{protocolo}
```

Fluxo interno:

```txt
Recebe protocolo
Gera token Keycloak
Monta URL da consulta
Executa GET
Retorna status, body, text e url
```

Status de processo reconhecidos:

```txt
PROCESSING
APPROVED
REJECTED
ERROR
DELETED
CANCELED
CANCELLED
PROCESSADO
CANCELADO
```

Observação importante:

```txt
O diagnóstico mostrou que a consulta funciona sem birthDate.
```

Por isso o fluxo principal consulta apenas pelo protocolo.

---

## `consultar/consultar.data.ts`

Arquivo de configuração da consulta.

Normalmente contém:

```txt
/api/v1/citizen-booking/processes/{protocolo}
```

A função `consultarViaExpressa` substitui `{protocolo}` ou `{protocol}` pelo protocolo recebido.

---

## `deletar/deletar.flow.ts`

Responsável por deletar uma Via Expressa pelo protocolo.

Endpoint usado:

```txt
DELETE /api/v1/citizen-booking/processes/{protocolo}
```

Fluxo interno:

```txt
Recebe protocolo
Gera token Keycloak
Monta URL do delete
Executa DELETE
Retorna status, body, text e url
```

Status aceitos no teste:

```txt
200
201
202
204
```

Observação:

Este flow **não cria massa**. Ele só deleta o protocolo recebido.

Quem cria a massa para o teste isolado é o `via-expressa.spec.ts`.

---

## `deletar/deletar.data.ts`

Arquivo de configuração do delete.

Normalmente contém:

```txt
/api/v1/citizen-booking/processes/{protocolo}
```

---

## `diagnostico/diagnosticar-consulta.flow.ts`

Arquivo auxiliar para diagnóstico técnico da consulta.

Ele serve para investigar qual combinação de token, header e parâmetro funciona melhor para consultar um protocolo.

Ele testa variações como:

```txt
1. Keycloak sem Content-Type com birthDate
2. Keycloak com Content-Type com birthDate
3. Token interno com birthDate
4. Keycloak com birthDate encoded
5. Keycloak sem birthDate
```

Esse arquivo **não é o fluxo principal da regressão**.

Uso correto:

```txt
Investigar comportamento de consulta
Comparar retorno entre variações
Ajudar a decidir qual endpoint/header usar no flow oficial
```

Resultado técnico:

```txt
diagnostico-consulta.json
```

Esse anexo fica disponível no relatório HTML.

---

## `diagnostico/diagnosticar-consulta.data.ts`

Arquivo de configuração do diagnóstico.

Normalmente contém:

```txt
path oficial da consulta
birthDate usado nos testes
```

---

# Variáveis de ambiente usadas no resumo

Antes de rodar os testes, é possível definir informações da execução.

Essas informações aparecem no terminal e no relatório Markdown.

```powershell
$env:QA_RUN_TYPE="Regressão"
$env:QA_SYSTEM="Cidadão Smart"
$env:QA_FLOW="Via Expressa"
$env:QA_ENV="172.16.1.146"
$env:QA_EXECUTOR="Ana"
```

| Variável | Exemplo | Função |
|---|---|---|
| `QA_RUN_TYPE` | `Smoke`, `Regressão`, `Diagnóstico`, `CI/CD` | Tipo da execução |
| `QA_SYSTEM` | `Cidadão Smart` | Sistema validado |
| `QA_FLOW` | `Via Expressa` | Fluxo validado |
| `QA_ENV` | `172.16.1.146` | Ambiente usado |
| `QA_EXECUTOR` | `Ana` | Pessoa que executou |

---

# Relatórios gerados

Após a execução, são gerados:

```txt
playwright-report/index.html
test-results/cicd-summary.md
test-results/cicd-results.json
```

---

## Relatório HTML

Arquivo:

```txt
playwright-report/index.html
```

Abrir com:

```powershell
npx playwright show-report
```

Uso:

```txt
Ver steps da execução
Ver anexos JSON
Ver erro técnico
Ver evidências
Analisar detalhes da chamada
```

---

## Resumo Markdown

Arquivo:

```txt
test-results/cicd-summary.md
```

Uso:

```txt
Copiar para daily
Registrar evidência
Guardar histórico da execução
Compartilhar resumo sem abrir HTML
```

---

## JSON de métricas

Arquivo:

```txt
test-results/cicd-results.json
```

Uso:

```txt
Métricas brutas
Leitura automatizada futura
Dashboard
Histórico de execução
```

---

# Comandos de execução

## Limpar relatórios antigos

Use antes de uma nova execução quando quiser resultado limpo.

```powershell
Remove-Item -Recurse -Force .\test-results, .\playwright-report -ErrorAction SilentlyContinue
```

Esse comando remove:

```txt
test-results
playwright-report
```

Assim o próximo HTML/Markdown/JSON gerado será apenas da execução atual.

---

## Abrir relatório HTML

```powershell
npx playwright show-report
```

Use depois de rodar o teste para abrir o relatório técnico.

---

# Comando - ciclo completo `@cicd`

Executa o fluxo completo:

```txt
buscar posto
emitir via expressa
consultar protocolo emitido
deletar processo
consultar após delete
```

Comando:

```powershell
Remove-Item -Recurse -Force .\test-results, .\playwright-report -ErrorAction SilentlyContinue

$env:QA_RUN_TYPE="Regressão"
$env:QA_SYSTEM="Cidadão Smart"
$env:QA_FLOW="Via Expressa"
$env:QA_ENV="172.16.1.146"
$env:QA_EXECUTOR="Ana"

npx playwright test "tests/api/cidadao-smart/via-expressa/via-expressa.spec.ts" --grep "@cicd"
```

Resultado esperado:

```txt
Resultado: PASSOU
Cenários: 1/1 passaram
Validações: 5/5 passaram
```

Quando usar:

```txt
Validar se o fluxo principal está funcionando
Rodar em CI/CD
Rodar como regressão rápida
Validar se backend está respondendo corretamente
```

---

# Comando - rodar tudo do arquivo

Executa todos os cenários:

```txt
@emitir
@consultar
@deletar
@diagnostico-consulta
@cicd
```

Comando:

```powershell
Remove-Item -Recurse -Force .\test-results, .\playwright-report -ErrorAction SilentlyContinue

$env:QA_RUN_TYPE="Regressão"
$env:QA_SYSTEM="Cidadão Smart"
$env:QA_FLOW="Via Expressa"
$env:QA_ENV="172.16.1.146"
$env:QA_EXECUTOR="Ana"

npx playwright test "tests/api/cidadao-smart/via-expressa/via-expressa.spec.ts"
```

Resultado esperado:

```txt
Resultado: PASSOU
Cenários: 5/5 passaram
```

Quando usar:

```txt
Antes de fechar a automação
Antes de commitar
Antes de validar que os testes isolados continuam funcionando
Na regressão completa da Via Expressa
```

---

# Comando - emitir isolado `@emitir`

Executa apenas o teste de emissão.

Fluxo:

```txt
buscar posto
emitir via expressa
```

Comando:

```powershell
Remove-Item -Recurse -Force .\test-results, .\playwright-report -ErrorAction SilentlyContinue

$env:QA_RUN_TYPE="Smoke"
$env:QA_SYSTEM="Cidadão Smart"
$env:QA_FLOW="Via Expressa - Emitir"
$env:QA_ENV="172.16.1.146"
$env:QA_EXECUTOR="Ana"

npx playwright test "tests/api/cidadao-smart/via-expressa/via-expressa.spec.ts" --grep "@emitir"
```

Resultado esperado:

```txt
Resultado: PASSOU
Cenários: 1/1 passaram
Validações: 2/2 passaram
```

Quando usar:

```txt
Validar apenas criação de protocolo
Investigar falha na emissão
Confirmar se a API de emissão está funcionando
```

---

# Comando - consultar isolado `@consultar`

Executa a consulta isolada sem depender de protocolo fixo.

Fluxo:

```txt
buscar posto
emitir via expressa
consultar protocolo emitido
```

Comando:

```powershell
Remove-Item -Recurse -Force .\test-results, .\playwright-report -ErrorAction SilentlyContinue

$env:QA_RUN_TYPE="Smoke"
$env:QA_SYSTEM="Cidadão Smart"
$env:QA_FLOW="Via Expressa - Consultar"
$env:QA_ENV="172.16.1.146"
$env:QA_EXECUTOR="Ana"

npx playwright test "tests/api/cidadao-smart/via-expressa/via-expressa.spec.ts" --grep "@consultar"
```

Resultado esperado:

```txt
Resultado: PASSOU
Cenários: 1/1 passaram
Validações: 3/3 passaram
```

Quando usar:

```txt
Validar consulta da Via Expressa
Investigar se o protocolo emitido está sendo encontrado
Confirmar se a consulta funciona sem birthDate
```

---

# Comando - deletar isolado `@deletar`

Executa o delete isolado sem depender de protocolo fixo.

Fluxo:

```txt
buscar posto
emitir via expressa
deletar protocolo emitido
```

Comando:

```powershell
Remove-Item -Recurse -Force .\test-results, .\playwright-report -ErrorAction SilentlyContinue

$env:QA_RUN_TYPE="Smoke"
$env:QA_SYSTEM="Cidadão Smart"
$env:QA_FLOW="Via Expressa - Deletar"
$env:QA_ENV="172.16.1.146"
$env:QA_EXECUTOR="Ana"

npx playwright test "tests/api/cidadao-smart/via-expressa/via-expressa.spec.ts" --grep "@deletar"
```

Resultado esperado:

```txt
Resultado: PASSOU
Cenários: 1/1 passaram
Validações: 3/3 passaram
```

Quando usar:

```txt
Validar apenas endpoint de delete
Investigar falha ao remover processo
Confirmar se o protocolo criado pode ser deletado
```

---

# Comando - diagnóstico de consulta `@diagnostico-consulta`

Executa diagnóstico técnico da consulta.

Fluxo:

```txt
buscar posto
emitir via expressa
executar variações de consulta
```

Comando:

```powershell
Remove-Item -Recurse -Force .\test-results, .\playwright-report -ErrorAction SilentlyContinue

$env:QA_RUN_TYPE="Diagnóstico"
$env:QA_SYSTEM="Cidadão Smart"
$env:QA_FLOW="Via Expressa - Diagnóstico Consulta"
$env:QA_ENV="172.16.1.146"
$env:QA_EXECUTOR="Ana"

npx playwright test "tests/api/cidadao-smart/via-expressa/via-expressa.spec.ts" --grep "@diagnostico-consulta"
```

Resultado esperado:

```txt
Resultado: PASSOU
Cenários: 1/1 passaram
Validações: 3/3 passaram
```

Quando usar:

```txt
Investigar comportamento da consulta
Comparar token Keycloak com token interno
Validar se birthDate ainda é necessário
Confirmar qual variação da chamada funciona
```

---

# Observação conhecida - consulta após delete

Atualmente, após deletar uma Via Expressa, a API ainda pode permitir consulta do protocolo e retornar:

```txt
HTTP 200
status técnico ERROR
```

Esse comportamento é aceito no teste porque representa o fluxo atual existente.

Comportamento ideal esperado:

```txt
HTTP 404
HTTP 400
HTTP 422
ou status explícito DELETED/CANCELLED
```

Por isso o teste considera aprovado quando retorna:

```txt
400 / 404 / 422
ou
200 com status ERROR / DELETED / CANCELLED / CANCELED / INVALID
```

Essa observação fica registrada no relatório, mas não deve poluir o terminal.

---

# Padrão esperado no terminal

O terminal deve ser curto e executivo.

Exemplo:

```txt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRESSÃO | Cidadão Smart | Via Expressa
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Resultado: PASSOU
Data: 16/05/2026, 19:00:00
Executor: Ana
Ambiente: 172.16.1.146
Cenários: 5/5 passaram
Validações: 16/16 passaram
Duração: 4.0s

Relatório técnico: file:///.../playwright-report/index.html
Resumo:            file:///.../test-results/cicd-summary.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

# O que evitar

## Evitar `--reporter=list`

Não usar:

```powershell
--reporter=list
```

Porque ele polui o terminal com:

```txt
steps
payloads
body
text
detalhes técnicos
```

Esses detalhes devem ficar no relatório HTML.

---

## Evitar protocolo fixo

Evitar depender de:

```txt
VIA_EXPRESSA_PROTOCOLO_TESTE
```

Principalmente em:

```txt
@consultar
@deletar
```

Motivo:

```txt
O protocolo pode já ter sido deletado
O protocolo pode não existir mais
O protocolo pode estar em estado inválido
O ambiente pode ter sido limpo
A massa pode ficar velha
```

Padrão correto:

```txt
O teste cria a própria massa antes de consultar ou deletar.
```

---

# Diagnóstico rápido de problemas

## Problema: `@deletar` falha sozinho

Provável causa:

```txt
Teste ainda depende de protocolo fixo
```

Correção:

```txt
O teste @deletar deve buscar posto, emitir massa nova e deletar o protocolo emitido.
```

---

## Problema: `@consultar` falha ao rodar o arquivo inteiro

Provável causa:

```txt
Teste ainda depende de VIA_EXPRESSA_PROTOCOLO_TESTE
```

Correção:

```txt
O teste @consultar deve buscar posto, emitir massa nova e consultar o protocolo emitido.
```

---

## Problema: terminal mostra muitos logs

Provável causa:

```txt
Foi usado --reporter=list
ou algum flow ainda tem console.log em sucesso
```

Correção:

```txt
Remover --reporter=list
Manter logs detalhados apenas em erro
Usar anexos no relatório HTML
```

---

## Problema: aparece `ERROR` após delete

Contexto:

```txt
Esse é o comportamento atual conhecido da API.
```

Não deve ser tratado como falha se o processo não permanece ativo.

O comportamento fica documentado como observação técnica no relatório.

---

# Regra prática de uso

Use:

```txt
@cicd
```

Para validar o ciclo completo.

Use:

```txt
@emitir
@consultar
@deletar
```

Para validar partes isoladas.

Use:

```txt
@diagnostico-consulta
```

Para investigação técnica.

Use:

```txt
rodar o arquivo inteiro
```

Para validar todos os cenários antes de fechar a alteração.

---

# Status esperado final

Com os ajustes aplicados, a regressão completa deve retornar:

```txt
Resultado: PASSOU
Cenários: 5/5 passaram
```