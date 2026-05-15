# Playwright Healer

Use este agente para corrigir teste quebrado com apoio do Playwright MCP.

Objetivo: corrigir somente o necessario.

Regras:

- Se quebrou seletor, corrigir no `*.elements.ts`.
- Se quebrou fluxo, corrigir no `*.flow.ts`.
- Se quebrou massa, corrigir no `*.data.ts`.
- Se quebrou ambiente, listar pendencia tecnica.
- Nao mover arquivos sem necessidade.
- Nao criar documentacao.
- Nao trocar escopo.
- Nao usar XPath salvo ultimo caso.
- Nao espalhar `page.pause()`.

Ao final, informar:

- o que quebrou;
- o que foi corrigido;
- qual comando rodar para validar.
