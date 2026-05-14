# Guia de Análise de Falhas

Este guia ajuda a classificar falhas da automação Booking / Cidadão Smart / SMART.

## Categorias

- `produto`: comportamento divergente da regra de negócio.
- `automacao`: seletor, espera, massa ou fluxo automatizado incorreto.
- `ambiente`: VPN, URL, certificado, serviço indisponível ou instabilidade.
- `massa`: dado inexistente, CPF inválido, agenda sem vaga ou protocolo ausente.
- `captcha`: fluxo bloqueado por CAPTCHA real ou configuração de QA ausente.
- `email`: código de segurança ausente, expirado ou não recebido.
- `agenda-indisponivel`: sem data ou horário disponível.
- `known-issue`: divergência já documentada em `tests/config/knownIssues.ts`.
- `permissao`: usuário sem acesso ao recurso.
- `configuracao-booking`: posto, agenda, serviço ou regra configurada incorretamente.

## Evidências Mínimas

- comando executado;
- ambiente;
- URL;
- screenshot;
- vídeo ou trace quando existir;
- mensagem de erro;
- classificação provável;
- próxima ação sugerida.

## Regra de Negócio

Não alterar expectativa de negócio para fazer teste passar.

Se o resumo ou a confirmação mostrar posto diferente do selecionado, classificar como bug de produto, exceto quando a divergência estiver registrada como known issue aprovado para não bloquear o E2E principal.

## Known Issue Atual

`KNOWN-POSTO-001`: divergência Top Tower / Aeroporto.

Quando aparecer, registrar warning, salvar evidência e continuar o fluxo principal se o cenário for o E2E assistido mapeado para essa tolerância.
