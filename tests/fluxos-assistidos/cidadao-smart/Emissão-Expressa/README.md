# Fluxo assistido - Cidadao Smart | Via Expressa

Este diretorio organiza os testes assistidos da Via Expressa.

O objetivo e validar a jornada de interface usando massa criada pela API:

1. Criar a massa de Via Expressa pela API.
2. Confirmar pela API que o protocolo gerado existe.
3. Consultar na UI usando protocolo e data de nascimento da massa API.
4. Iniciar a emissao na UI usando o CPF da massa API.
5. Validar captura facial assistida quando a precondicao existir.
6. Validar resumo da emissao quando houver sessao previa.
7. Limpar a massa criada pela API.

## Estrutura

```txt
tests/fluxos-assistidos/cidadao-smart/Emissão-Expressa/
├── README.md
├── fluxo-assistido/
│   ├── fluxo-assistido.data.ts
│   ├── fluxo-assistido.flow.ts
│   └── fluxo-assistido.spec.ts
├── consulta-pedido/
│   ├── consulta-pedido.data.ts
│   ├── consulta-pedido.elements.ts
│   ├── consulta-pedido.flow.ts
│   └── consulta-pedido.spec.ts
└── emissao-online/
    ├── emissao-online.data.ts
    ├── emissao-online.elements.ts
    ├── emissao-online.flow.ts
    └── emissao-online.spec.ts
```

## Comandos

Executar somente o fluxo assistido integrado:

```powershell
npm run cidadao:via-expressa:assistido
```

Executar todos os testes assistidos do Cidadao Smart:

```powershell
npm run test:cidadao:ui
```

Executar sem abrir navegador:

```powershell
npx playwright test "tests/fluxos-assistidos/cidadao-smart" --grep "@integracao" --project=chromium
```

Executar como validacao automatizada sem pausa manual de CAPTCHA:

```powershell
$env:CAPTCHA_MODE='disabled'; npx playwright test "tests/fluxos-assistidos/cidadao-smart" --grep "@integracao" --project=chromium
```

Executar o smoke API correspondente:

```powershell
npm run cidadao:via-expressa
```

## Variaveis relevantes

```txt
CIDADAO_SMART_BASE_URL
BOOKING_API_BASE_URL
KEYCLOAK_TOKEN_URL
KEYCLOAK_CLIENT_ID
KEYCLOAK_CLIENT_SECRET
KEYCLOAK_USERNAME
KEYCLOAK_PASSWORD
X_OPERATOR_CPF
CPF_REQUERENTE_BOOKING
DATA_NASCIMENTO_REQUERENTE
CPF_ELEGIVEL
CIDADAO_SMART_VALID_PHOTO_PATH
CAPTCHA_MODE
CAPTURE_MODE
CAMERA_FAKE_VIDEO_PATH
HEADLESS
PW_SLOW_MO
```

## Dependencias externas

- VPN ou rota para `172.16.1.146`.
- Frontend do Cidadao Smart disponivel.
- API Booking disponivel para criar, consultar e limpar a massa do fluxo.
- Keycloak disponivel para gerar token da API.
- Captury/CAPTCHA com bypass oficial ou resolucao manual.
- Foto valida quando o teste precisar exercitar upload.
- Sessao previa quando o resumo da emissao nao puder ser aberto diretamente.

## Observacoes

- Este fluxo e assistido e nao deve ser smoke autonomo de CI.
- O teste integrado nao usa protocolo fixo: a UI recebe o protocolo, CPF e data de nascimento criados pela API no proprio teste.
- Detalhes tecnicos ficam no relatorio HTML e nos anexos JSON.
- O teste de API continua sendo a referencia para validar o contrato principal do backend.
- Quando `CIDADAO_SMART_VALID_PHOTO_PATH` nao estiver configurado, o teste valida a tela de captura e registra a pendencia em anotacao.
- Quando `CAPTCHA_MODE=disabled` e a UI exibir CAPTCHA, o teste falha com `CAPTCHA_ATIVO_SEM_BYPASS_OFICIAL`.
- Quando o resumo depender de sessao anterior, o teste registra a pendencia em anotacao sem inventar comportamento.
