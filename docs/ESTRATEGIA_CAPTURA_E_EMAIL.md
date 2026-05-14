# Estratégia de Captura e Código por E-mail

## 1. Objetivo

Definir uma estratégia segura para reduzir bloqueios da automação assistida nos fluxos de Booking, Cidadão Smart e Emissão Online, separando CAPTCHA, captura por câmera e código enviado por e-mail.

## 2. Problemas Atuais

- CAPTCHA real exige intervenção humana.
- Captura/câmera pode bloquear testes de Emissão Online e 2ª via com alterações.
- Código de segurança por e-mail ainda depende de pessoa ou integração controlada.
- Sem classificação, esses bloqueios parecem falha de automação mesmo quando são barreiras externas.

## 3. Diferença Entre CAPTCHA, Captura e Código por E-mail

- CAPTCHA: barreira anti-automação real. Não deve ser burlada.
- Captura: uso de câmera, vídeo ou SDK de captura. Pode ser automatizada com fake camera em ambiente controlado.
- Código por e-mail: autenticação por mensagem. Pode ser manual, por variável de ambiente ou por integração autorizada.

## 4. Estratégia para Captura

Modos permitidos:

- `CAPTURE_MODE=manual`: pessoa realiza a captura e continua após Resume.
- `CAPTURE_MODE=fake-video`: Chromium usa câmera fake com arquivo `.y4m`.
- `CAPTURE_MODE=disabled`: somente se ambiente QA tiver captura desabilitada oficialmente.

## 5. Fake Camera com Vídeo

Quando `CAPTURE_MODE=fake-video`, o Playwright inicia o Chromium com:

```text
--use-fake-device-for-media-stream
--use-fake-ui-for-media-stream
--use-file-for-fake-video-capture=<CAMERA_FAKE_VIDEO_PATH>
```

Regras:

- usar arquivo `.y4m` válido;
- imagem estática pode ser usada como origem, mas deve ser convertida para `.y4m`;
- gerar o `.y4m` com `npm run media:fake-video` quando `CAMERA_FAKE_IMAGE_PATH` estiver configurado;
- não versionar imagem ou vídeo sensível;
- usar massa sintética, aprovada ou controlada;
- registrar evidência da captura;
- classificar falha como ambiente, permissão, Capturing ou automação conforme contexto.

## 6. POC de Captura

Antes de integrar no fluxo real, validar:

- permissão de câmera;
- `getUserMedia`;
- preview em `<video>`;
- screenshot de evidência;
- comportamento no Chromium com o arquivo `.y4m`.

Para usar uma das imagens de teste como captura, deixar o arquivo local em `fixtures/media/source/`, configurar `CAMERA_FAKE_IMAGE_PATH` e gerar o `.y4m` antes da POC. A pasta de mídia ignora imagens e vídeos para evitar versionar rosto ou dado sensível.

Spec criada para isso:

```text
tests/poc/captura-fake-video.spec.ts
```

## 7. Estratégia para Código por E-mail

Modos permitidos:

- `EMAIL_CODE_MODE=manual`: pessoa informa o código.
- `EMAIL_CODE_MODE=env`: código vem de `CIDADAO_SMART_SECURITY_CODE`.
- `EMAIL_CODE_MODE=gmail-api`: Gmail API/OAuth, sem UI do Gmail.
- `EMAIL_CODE_MODE=internal-api`: endpoint interno de QA.
- `EMAIL_CODE_MODE=log`: leitura autorizada de logs.

## 8. Gmail API/OAuth

A automação não deve abrir nem manipular a UI do Gmail.

A estratégia profissional é OAuth com uma caixa de teste, usando:

- `GMAIL_TEST_ACCOUNT`;
- `GMAIL_CREDENTIALS_PATH`;
- `GMAIL_TOKEN_PATH`;
- `GMAIL_CODE_QUERY`;
- `GMAIL_CODE_REGEX`.

Credenciais e tokens devem ficar somente em `.env.local` ou arquivos locais ignorados pelo Git.

## 9. Alternativas Internas de QA

Alternativas futuras:

- endpoint interno para buscar código por e-mail/protocolo;
- fake provider de e-mail em ambiente QA;
- leitura autorizada de logs;
- mock controlado por backend.

## 10. Segurança e Restrições

Não versionar:

- token OAuth;
- senha;
- app password;
- credencial Gmail;
- código real de segurança;
- vídeo com pessoa real sem aprovação;
- dado pessoal sensível.

## 11. O Que Não é Permitido

- burlar CAPTCHA real;
- automatizar UI do Gmail;
- commitar segredo;
- usar vídeo sensível sem autorização;
- mascarar falha de produto mudando expectativa de negócio.

## 12. Critério de Pronto

- `.env.example` documenta os modos.
- `CaptureAgent` existe.
- `EmailCodeAgent` suporta manual/env e base dos modos futuros.
- `GmailCodeProvider` existe como base segura.
- POC de fake video lista no Playwright.
- `npm run test:list` continua funcionando.
