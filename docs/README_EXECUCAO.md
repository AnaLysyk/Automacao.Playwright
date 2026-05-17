
## Mas precisa adicionar isso no `package.json`

Para esse texto ficar verdadeiro, o Code precisa criar os scripts:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:list": "playwright test --list",
    "typecheck": "tsc --noEmit",

    "test:api": "playwright test tests/api --reporter=list",
    "test:booking": "playwright test tests/api/booking --reporter=list",
    "test:cidadao": "playwright test tests/api/cidadao-smart --reporter=list",

    "booking:agendamento": "playwright test tests/api/booking/agendamento/agendamento.spec.ts --reporter=list",
    "cidadao:via-expressa": "playwright test tests/api/cidadao-smart/via-expressa/via-expressa.spec.ts --reporter=list",

    "test:cidadao:ui": "playwright test tests/fluxos-assistidos/cidadao-smart --headed --project=chromium",
    "cidadao:via-expressa:assistido": "playwright test tests/fluxos-assistidos/cidadao-smart/emissao-expressa/fluxo-assistido --headed --project=chromium",
    "test:booking:assistido": "playwright test tests/fluxos-assistidos/booking/agendamento-presencial --headed --project=chromium",

    "report": "playwright show-report"
  }
}