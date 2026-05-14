# Known Issues

Este documento registra comportamentos conhecidos que podem aparecer durante a execução dos testes.

Known issue não substitui bug. Ele apenas indica que a divergência já está mapeada e que o fluxo pode continuar quando a regra do projeto permitir.

## KNOWN-POSTO-001 — Divergência Top Tower / Aeroporto

Situação: após selecionar Top Tower, a aplicação pode exibir Aeroporto em uma etapa posterior.

Tratamento na automação:

- registrar warning;
- registrar evidência;
- não bloquear o E2E principal assistido enquanto a divergência estiver aprovada como known issue;
- não alterar a regra de negócio para mascarar o comportamento.

Mensagem esperada:

```text
[KNOWN-ISSUE][KNOWN-POSTO-001] Aeroporto visível após seleção de Top Tower. Divergência conhecida de configuração/tipo de posto no banco. Não bloquear E2E principal.
```
