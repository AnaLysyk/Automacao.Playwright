# [ASSISTIDO] SMART

## Objetivo

Validar telas e operacoes do SMART usadas no processamento dos protocolos.

## Tipo de execucao

Misto. Smoke read-only pode ser investigativo; `write` e finalizacao de protocolo sao assistidos.

## Comando principal

```bash
npm run test:smart:finalizar
```

## Pode entrar aqui

- Smoke do SMART.
- Busca e leitura de processos.
- Fluxos assistidos de finalizacao em ambiente controlado.

## Nao pode entrar aqui

- Alteracao de estado sem coordenar com QA.
- Credenciais ou dados sensiveis.
- Teste que deveria ser API ou Booking publico.

