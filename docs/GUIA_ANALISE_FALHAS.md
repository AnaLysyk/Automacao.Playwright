# Guia de Analise de Falhas

Este guia ajuda a classificar falhas da automacao Booking / Cidadao Smart.

## Categorias

- `produto`: comportamento divergente da regra de negocio.
- `automacao`: seletor, espera, massa ou fluxo automatizado incorreto.
- `ambiente`: VPN, URL, certificado, servico indisponivel ou instabilidade.
- `massa`: dado inexistente, CPF invalido, agenda sem vaga ou protocolo ausente.
- `captcha`: fluxo bloqueado por CAPTCHA real ou flag QA nao aplicada.
- `email`: codigo de seguranca ausente, expirado ou nao recebido.
- `agenda-indisponivel`: sem data ou horario disponivel.
- `known-issue`: divergencia ja documentada em `tests/config/knownIssues.ts`.
- `permissao`: usuario sem acesso ao recurso.
- `configuracao-booking`: posto, agenda, servico ou regra configurada de forma incorreta.

## Evidencias minimas

- comando executado;
- ambiente;
- URL;
- screenshot;
- video ou trace quando existir;
- mensagem de erro;
- classificacao;
- proxima acao sugerida.

## Regra de negocio

Nao alterar expectativa de negocio para fazer teste passar. Se o resumo ou confirmacao mostrar posto diferente do selecionado, classificar como bug de produto e registrar no relatorio.
