# [ASSISTIDO] Booking Admin write

## Objetivo

Guardar validacoes do Booking Admin que podem alterar configuracao ou massa.

## Tipo de execucao

Assistida ou controlada. Nao deve rodar em CI sem aprovacao.

## Comando principal

```bash
npm run test:admin:write
```

## Pode entrar aqui

- Fluxos de escrita em ambiente QA controlado.
- Validacoes autorizadas de configuracao.

## Nao pode entrar aqui

- Teste destrutivo sem aprovacao.
- Alteracao em ambiente sensivel.
- Credenciais, tokens ou massa protegida.

