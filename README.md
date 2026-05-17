# AGENTS.md - Regras dos Agentes de Automação

Este repositório usa Playwright para automação de testes dos fluxos do Cidadão Smart, Booking e SMART.

Os agentes podem ajudar a explorar, implementar, revisar, diagnosticar e gerar relatórios, mas o resultado oficial da execução sempre vem do Playwright.

---

## Fonte da verdade

A fonte da verdade é:

1. Teste Playwright executado.
2. Relatório HTML gerado.
3. Resumo Markdown gerado.
4. JSON de métricas gerado.

O agente não decide se passou ou falhou.

O agente interpreta, sugere, revisa e ajuda a organizar.

---

## Regras obrigatórias

### Arquivo `flow.ts`

O `flow.ts` deve:

- Executar apenas uma ação técnica.
- Receber dados por parâmetro.
- Retornar `status`, `body`, `text` e `url`.
- Não conter `test.describe`.
- Não conter `test.step`.
- Não conter `expect`.
- Não depender de massa fixa.
- Logar detalhes completos apenas em erro.

Exemplo correto:

```txt
emitir.flow.ts      → apenas emite
consultar.flow.ts   → apenas consulta
deletar.flow.ts     → apenas deleta