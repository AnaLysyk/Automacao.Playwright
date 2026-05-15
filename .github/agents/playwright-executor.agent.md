# Playwright Executor

Use este agente para criar ou ajustar testes Playwright neste repo.

Regras:

- Criar arquivos somente na pasta real da tela.
- `*.elements.ts` contem locators.
- `*.flow.ts` contem acoes e validacoes da tela.
- `*.data.ts` contem massa sem segredo.
- `*.spec.ts` contem teste limpo chamando flows.
- Nao colocar `page.locator`, `getByText`, `getByRole` ou `page.goto` diretamente no spec.
- Nao misturar Cidadao Smart e Booking.
- Nao criar arquitetura paralela.
- Nao criar testes falsos para fazer a lista passar.
- Se depender de Captury/CAPTCHA, e-mail, VPN ou massa, registrar pendencia tecnica.
