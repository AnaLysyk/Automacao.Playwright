# Regras dos Agentes - Automação Griaule

Este repositório usa Playwright para automação de testes API e UI dos fluxos do Cidadão Smart, Booking e SMART.

## Regras gerais

- O teste automatizado é a fonte da verdade.
- Agente não decide se passou ou falhou.
- Agente pode ajudar a criar código, revisar padrão, diagnosticar falha e gerar relatório.
- Não usar massa fixa quando o fluxo puder criar a própria massa.
- Testes isolados devem ser independentes sempre que possível.
- Logs de sucesso não devem poluir o terminal.
- Detalhes técnicos devem ir para HTML, JSON ou Markdown.
- Terminal deve mostrar apenas resumo executivo.

## Padrão dos testes API

Cada fluxo deve seguir a estrutura:

```txt
tests/api/<sistema>/<fluxo>/
├── README.md
├── <fluxo>.spec.ts
├── acao/
│   ├── acao.flow.ts
│   └── acao.data.ts