# [REGRESSAO] Booking Admin read-only

## Objetivo

Validar o painel Booking Admin sem alterar estado real.

## Tipo de execucao

Regressao ou smoke read-only, conforme credenciais e ambiente.

## Comando principal

```bash
npm run test:admin:readonly
```

## Pode entrar aqui

- Login e logout.
- Consulta de telas.
- Disponibilidade de menus.

## Nao pode entrar aqui

- Acao que altere configuracao.
- Criacao, edicao ou exclusao de dados.
- Credenciais reais no codigo.

