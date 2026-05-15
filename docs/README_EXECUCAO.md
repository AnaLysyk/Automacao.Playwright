# Execucao

Instalacao:

```bash
npm install
npx playwright install
```

Comandos principais:

```bash
npm run test:list
npm run test:booking:assistido
npm run test:booking
npm run test:cidadao
npm run test:api
```

`test:booking:assistido` abre navegador e pode exigir CAPTCHA, e-mail, VPN e massa de teste.

CI deve rodar somente `typecheck`, `test:list` e `test:api`.
