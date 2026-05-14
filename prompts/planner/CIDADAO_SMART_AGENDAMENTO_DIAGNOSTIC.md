# Cidadao Smart Agendamento - Diagnostic

## Escopo atual
- Fluxo Local -> Data/Hora -> Resumo -> Autenticacao -> Confirmacao.
- Base em Page Object + Selectors separados.

## Riscos de estabilidade
- Falta de data-testid em componentes de cidade/posto/data/horario.
- CAPTCHA manual pode alongar execucao de suite.
- Horario disponivel pode variar por ambiente.

## Recomendacoes
- Adicionar data-testid para elementos criticos.
- Criar massa de slots previsiveis para ambiente QA.
- Habilitar modo CAPTCHA QA em homologacao.

## Criterio de bloqueio
- Se selecionar Top Tower e aparecer Aeroporto em resumo/confirmacao, tratar como bug.
