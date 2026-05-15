# Indice de navegacao

Este arquivo e o ponto de entrada para entender onde cada coisa fica no projeto.

## Documentos principais

- `README.md`: visao geral do repositorio e comandos mais usados.
- `AGENTS.md`: regras obrigatorias para evoluir a automacao.
- `docs/MAPA_DO_REPOSITORIO.md`: mapa pratico de pastas, scripts e classificacao.
- `docs/STATUS_ATUAL_AUTOMACAO.md`: status dos fluxos aprovados, em estabilizacao e pendentes.
- `docs/CATALOGO_AUTOMACAO.md`: catalogo de fluxos, specs, comandos e status.
- `docs/GUIA_DE_EXECUCAO.md`: como preparar ambiente e executar fluxos.
- `docs/MAPA_DE_TESTES.md`: mapa dos grupos de teste.
- `docs/ESTRATEGIA_DE_AUTOMACAO.md`: estrategia tecnica da automacao.
- `docs/ESTRATEGIA_CAPTURA_E_EMAIL.md`: regras para captura, e-mail e fluxos assistidos.
- `docs/EVIDENCIAS_E_RELATORIOS.md`: padrao de evidencias e relatorios.
- `docs/MATRIZ_DE_TESTES_E_EXECUCAO.md`: matriz de cobertura e execucao.

## Arquivo historico

Documentos antigos, duplicados ou de apoio que estavam soltos na raiz foram movidos para:

```text
docs/archive/raiz/
```

Eles ficam preservados para consulta, mas nao devem ser o primeiro lugar de leitura.

## Classificacao das pastas de teste

- `tests/booking/public`: regressao publica de agendamento/Booking.
- `tests/booking/manual-assisted`: fluxos assistidos com CAPTCHA, codigo, e-mail ou intervencao manual.
- `tests/cidadao-smart/emissao-online/regressao`: emissao online em cenarios mais controlados.
- `tests/cidadao-smart/segunda-via/regressao`: regressao da segunda via.
- `tests/cidadao-smart/segunda-via/manual-assisted`: segunda via assistida.
- `tests/api`: validacoes de API.
- `tests/smart`: validacoes do SMART.
- `tests/poc`: provas de conceito e experimentos tecnicos.
- `legacy/automation-exercise`: referencia legada; nao entra na execucao principal.
