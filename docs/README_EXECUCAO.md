# Execucao

Instalacao:

```bash
npm install
npx playwright install
```

Comandos criticos de API:

```bash
npm run test:booking
npm run test:cidadao
npm run booking:agendamento
npm run cidadao:via-expressa
npm run test:api
```

Validacoes para CI/CD:

```bash
npm run typecheck
npm run test:list
npm run test:api
```

`test:booking:assistido` abre navegador e pode exigir CAPTCHA, e-mail, VPN e massa de teste. Esse fluxo e manual-assisted, nao smoke de CI.
