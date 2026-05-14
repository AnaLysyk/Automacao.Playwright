# Evidências e Relatórios — Automação Cidadão Smart / Booking

## 1. Objetivo

Este documento explica como a automação gera e organiza provas de execução.
Ele orienta a equipe a identificar onde estão os arquivos de evidência e como interpretá-los.

## 2. O que registrar como evidência

### 2.1 Screenshots

- Captura de tela de falhas visuais.
- Útil para validar erro de UI, modal, mensagem ou campo ausente.
- Deve ser coletado sempre que um teste falha.

### 2.2 Vídeos

- Gravação do fluxo completo ou do trecho em que a falha ocorre.
- Importante para entender sequência de ações.
- Deve ser usado em testes complexos ou instáveis.

### 2.3 Trace

- Rastreio detalhado de execução Playwright.
- Contém rede, snapshots e passo a passo interno.
- Útil para análise profunda de erros intermitentes.

### 2.4 Relatório HTML

- Resumo de execução disponível pelo Playwright Report.
- Mostra testes passados, falhos, ignorados e tempo de execução.
- Deve ser consultado após qualquer execução relevante.

### 2.5 Logs

- Logs de console e de rede gerados pelo Playwright.
- Complementam screenshots e traces.
- Importantes quando o erro não é óbvio na interface.

## 3. Onde ficam as evidências

- `playwright-report/` — relatório HTML padrão do Playwright.
- `test-results/` — resultados de execuções anteriores.
- `tests/support/` — helpers e relatórios customizados.
- `artifacts/` (se existir) — evidências agrupadas por execução.

## 4. Como abrir o relatório

Executar:
```bash
npm run report
```

Após aberto, navegar por:
- testes que falharam;
- screenshots associadas;
- vídeos disponíveis;
- traces gerados.

## 5. Tipos de classificação de falha

### 5.1 Produto

- Comportamento incorreto do sistema.
- Ex.: botão não habilitado, mensagem errada, opção faltando.

### 5.2 Ambiente

- Problema de rede, VPN, endpoint inacessível ou servidor fora do ar.
- Ex.: falha na conexão `172.16.x.x`.

### 5.3 Massa de dados

- Dados de teste faltando ou inconsistentes.
- Ex.: CPF não existe, agendamento não encontrado.

### 5.4 Agenda indisponível

- Horários ou postos não disponíveis por agenda real.
- Ex.: tentativa de agendamento em dia sem vaga.

### 5.5 CAPTCHA

- Bloqueio manual imposto pela tela de CAPTCHA.
- Requer intervenção humana para continuar.

### 5.6 Código e e-mail

- Validação por código enviado por e-mail.
- Requer entrada manual ou fonte alternativa autorizada.

### 5.7 Permissão

- Usuário sem acesso ou ação proibida.
- Ex.: perfil operador tentando editar configuração.

### 5.8 Configuração Admin

- Falhas causadas por ajustes feitos no Booking Admin.
- Ex.: posto inativo, bloqueio de data, limite zerado.

### 5.9 Automação

- Falha do script, seletor errado, timeout ou regra incorreta.
- Verificar se o fluxo mudou antes de reportar bug.

### 5.10 Known issue

- Problema já documentado.
- Deve ser registrado e não reclassificado como novo bug sem verificação.

## 6. Como documentar uma execução

### 6.1 Identificação básica

- Nome do teste ou suíte.
- Ambiente usado.
- Data e hora da execução.
- Usuário que executou.

### 6.2 Resultado

- Passou
- Falhou
- Bloqueado
- Ignorado

### 6.3 Evidência coletada

- Screenshots: `screenshots/` ou `playwright-report/screenshots/`
- Vídeos: `videos/` ou `playwright-report/videos/`
- Trace: `trace.zip`
- Logs: arquivo de console ou rede

### 6.4 Comentário de análise

- Qual foi o comportamento observado?
- Qual é a suspeita inicial?
- O que já foi tentado?
- O próximo passo sugerido.

## 7. Relação com relatórios

### 7.1 Relatório de resultado

- Consolida status de execução e evidências.
- Deve apontar se a falha é produto, ambiente, massa ou automação.
- Deve referenciar o documento de `docs/GUIA_DE_ANALISE_DE_FALHAS.md` quando a causa não for clara.

### 7.2 Relatório de bug

- Deve incluir links para screenshots, vídeo e trace.
- Deve indicar ambiente e credenciais de perfil usadas.
- Deve apontar o impacto no fluxo público ou no Booking Admin.

### 7.3 Relatório de teste assistido

- Deve incluir manual steps seguidos.
- Deve explicar pontos de intervenção (CAPTCHA, código e-mail).
- Deve relatar se a execução foi parcial ou completa.

## 8. Boas práticas

- Sempre colecione pelo menos um screenshot em uma falha.
- Use vídeo para falhas intermitentes ou fluxos longos.
- Gere trace quando houver timeout ou erro de rede.
- Mantenha os arquivos de evidência organizados por execução.
- Anote se a execução foi em ambiente controlado ou compartilhado.

## 9. Referências

- `docs/GUIA_DE_EXECUCAO.md`
- `docs/MAPA_DE_TESTES.md`
- `context/requirements/booking-admin.md`
- `context/requirements/ambientes-e-acessos.md`
