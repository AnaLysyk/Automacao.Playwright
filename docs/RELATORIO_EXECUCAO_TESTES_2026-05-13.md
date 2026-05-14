# Relatorio de Execucao de Testes - Cidadao Smart / Booking

**Cliente**: Griaule  
**Projeto**: Automacao E2E Cidadao Smart / Booking  
**Data da execucao**: 13/05/2026 22:22 (-03:00)  
**Ambiente**: DEV/Homologacao 146  
**Base URL**: `https://172.16.1.146`  
**Executor**: Testing Company  
**Status geral**: Falhou com bloqueios de ambiente, CAPTCHA e ajustes tecnicos pendentes

## Comando executado

```powershell
$env:CAPTCHA_MODE='disabled'
$env:EXECUTION_MODE='ci'
npm run test:all
```

## Resultado geral

| Total | Aprovados | Falhos | Pulados | Duracao |
| ---: | ---: | ---: | ---: | ---: |
| 70 | 10 | 42 | 18 | 20,9 min |

## Cenarios aprovados

- API SMART respondeu com sucesso.
- Home do Cidadao Smart exibiu conteudo esperado de Emissao Online.
- Home permitiu acesso a Consulta de Pedido.
- Emissao Online validou campos obrigatorios na autenticacao.
- Tipo de Emissao exibiu opcoes esperadas.
- Tipo de Emissao permitiu selecionar Reimpressao.
- Parte dos testes de navegacao/smoke do Cidadao Smart passou no Chromium.

## Cenarios falhos

- 2 Via Expressa falhou em fluxos de elegibilidade, menor de 16 anos e CPF cancelado.
- Agendamento Presencial falhou ao tentar avancar da localizacao porque o botao Prosseguir permaneceu desabilitado.
- Validacoes de Agendamento Presencial falharam antes da tela de Data e Hora por dependencia de CAPTCHA/Prosseguir.
- APIs de Cidadao Smart e Booking Admin retornaram falha/404 nos checks de saude esperados.
- API Notificador GBDS falhou nos cenarios de webhook, status mapping, rejeicao e protecao de CPF em plaintext.
- Consulta de Agendamento e Consulta de Pedido falharam em layout, campos obrigatorios e protocolo invalido.
- E2E JSON/CDS falhou em cenarios de idade, registro, situacao cadastral, 2 Via com alteracoes, documentos e upload invalido.
- Cenario critico Top Tower/Aeroporto nao chegou ao resumo porque o fluxo ficou bloqueado antes.
- Emissao Online - Autenticacao falhou ao localizar campo de data de nascimento esperado.

## Cenarios bloqueados ou pulados

- 18 testes foram pulados.
- Testes que dependem de massa valida, token, endpoints internos ou intervencao manual devem continuar fora da regressao automatica ate estabilizacao.
- Fluxos com CAPTCHA real nao devem ser tratados como regressao automatica enquanto o ambiente nao oferecer `CAPTCHA_MODE=disabled`, modo QA ou allowlist oficial.

## Principais achados

### CAPTCHA / Botao Prosseguir

Mesmo com `CAPTCHA_MODE=disabled`, a tela ainda manteve o botao Prosseguir desabilitado em varios fluxos. Isso indica que o ambiente ainda esta exigindo uma condicao visual/manual ou que a flag nao esta sendo respeitada pelo front/back.

Impacto: bloqueia regressao automatica de Agendamento Presencial, 2 Via e E2E JSON.

### APIs Booking/Admin

Alguns endpoints esperados retornaram `404 Not Found`, principalmente em rotas de postos e agenda:

- `/admin/api/v1/service-points`
- `/admin/api/v1/service-points/top-tower/schedule`

Impacto: testes de diagnostico API nao conseguem confirmar posto, agenda e horarios antes da UI.

### Consulta e Emissao Online

Os testes de Consulta e Emissao Online tiveram falhas de layout/seletores. O caso mais claro foi o campo de data de nascimento da autenticacao de Emissao Online, que nao foi encontrado pelo Page Object atual.

Impacto: precisa revisar seletores e confirmar se a tela mudou ou se o teste esta navegando para uma versao diferente da esperada.

### Top Tower / Aeroporto

O cenario critico Top Tower/Aeroporto ainda nao conseguiu validar o resumo porque a execucao ficou bloqueada antes da etapa de resumo. A divergencia continua registrada como ponto de atencao, mas esta rodada nao confirmou a exibicao final.

## Evidencias geradas

- Relatorio HTML do Playwright: `playwright-report/index.html`
- Artefatos por teste: `test-results/`
- Screenshots de falha: `test-results/**/test-failed-1.png`
- Videos de falha: `test-results/**/video.webm`
- Contexto de erro: `test-results/**/error-context.md`

Observacao: `test-results/` e `playwright-report/` sao artefatos locais de execucao e devem permanecer fora do Git por seguranca e volume.

## Bugs / riscos para abertura de ticket

- `[BLOCKER-CAPTCHA-001]` CAPTCHA/Prosseguir continua bloqueando fluxos automaticos mesmo com `CAPTCHA_MODE=disabled`.
- `[API-BOOKING-001]` Endpoints de postos e agenda retornam 404 no ambiente 146.
- `[AUTO-SEL-001]` Page Object de Emissao Online nao encontra campo de data de nascimento na tela de autenticacao.
- `[AUTO-FLOW-001]` Fluxos E2E JSON dependem de chegar em Data e Hora, mas param na localizacao por botao desabilitado.

## Proxima acao sugerida

1. Confirmar com o time do produto/backend se o ambiente 146 suporta `CAPTCHA_MODE=disabled` de ponta a ponta.
2. Validar rotas reais das APIs de postos, agenda e horarios no Booking Admin.
3. Ajustar Page Objects de Consulta e Emissao Online com base na tela atual.
4. Manter testes assistidos em `manual-assisted` para demos com CAPTCHA real.
5. Reexecutar `npm run test:all` depois da configuracao de CAPTCHA/API estar estabilizada.
