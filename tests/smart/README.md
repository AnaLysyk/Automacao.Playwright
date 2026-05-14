# SMART Interno: Processamento e Conferência

Sistema interno de processamento, conferência biométrica e entrega de documentos.

## Estrutura

```
smart/
├── smoke-smart.spec.ts         # Login e home do SMART
├── processos-civis/            # Processos civis
│   ├── lista.spec.ts
│   ├── detalhes.spec.ts
│   └── filters.spec.ts
├── captura-biometrica/         # Captura biométrica
│   ├── facial.spec.ts          # Captura facial (câmera)
│   ├── digitais.spec.ts        # Captura digital (leitor)
│   └── assinatura.spec.ts      # Assinatura (pad)
├── pagamento/                  # Integração de pagamento
│   ├── boleto.spec.ts
│   ├── cartao.spec.ts
│   └── comprovante.spec.ts
├── conferencia/                # Conferência biográfica
│   ├── dados-pessoais.spec.ts
│   ├── endereco.spec.ts
│   └── validacoes.spec.ts
├── envio/                      # Envio de processos
│   ├── lote.spec.ts
│   └── retorno.spec.ts
└── entrega/                    # Entrega de documento
    ├── retirada-presencial.spec.ts
    ├── retirada-correios.spec.ts
    └── download.spec.ts
```

## Fluxo Típico

1. **Login** → Autenticar como operador SMART
2. **Listagem de Processos** → Buscar processos para processar
3. **Detalhes** → Abrir processo, visualizar dados
4. **Captura** → Tirar foto facial ou digital (hardware)
5. **Conferência** → Validar dados pessoais, endereço, etc
6. **Pagamento** → Processar pagamento (simular ou real)
7. **Envio** → Enviar para backend/RFB/MJ
8. **Entrega** → Gerar documento para retirada

## Testes Implementados

- `[SMART-LOGIN-001]` Login no SMART
- `[SMART-MENU-001]` Menu principal carrega
- `[SMART-PROCESSOS-001]` Listar processos disponíveis
- `[SMART-DETALHE-001]` Abrir detalhes do processo

## Testes Futuros

- `[SMART-CAPTURA-001]` Captura facial (exige câmera)
- `[SMART-CONF-001]` Conferência biográfica
- `[SMART-PAG-001]` Processamento de pagamento
- `[SMART-ENVIO-001]` Enviar processo
- `[SMART-ENT-001]` Retirada presencial

## Variáveis de Ambiente

```
SMART_BASE_URL=https://smart.example.com
SMART_USER=
SMART_PASSWORD=
BCC_ENABLED=false  # Hardware biometria
BCC_PORT=COM3      # Porta do leitor
```

## Execução

```bash
# Testes de SMART (apenas tela)
npm run test:smart

# Com visualização (headed)
npm run test:smart -- --headed

# Apenas smoke
npm run test:smart -- --grep "smoke"

# Com debug
npm run test:smart -- --debug
```

## Tags

```
@smart           # Envolve SMART
@captura         # Exige hardware
@hardware        # Exige equipamento
@manual          # Requer ação humana
@readonly        # Apenas leitura
@write           # Altera dados
@smoke           # Teste rápido
```

## Notas Importantes

⚠️ **Hardware Necessário:**
- Câmera para captura facial
- Leitor biométrico para digitais
- Pad de assinatura (opcional)

⚠️ **Variáveis Críticas:**
- `SMART_PASSWORD` NUNCA em código. Use `.env.local`
- Logs podem expor credenciais. Mascarar em screenshots.

⚠️ **Limite de Massa:**
- Processos são de produção real
- Cada conferência/captura altera estado
- Coordenar com o time antes de testar em produção

## Troubleshooting

**Erro: "Câmera não detectada"**
- Verificar permissões do navegador
- Reiniciar Playwright
- `BCC_ENABLED=false` se não tiver hardware

**Erro: "Processo não encontrado"**
- Verificar se processo foi criado no Cidadão Smart primeiro
- Pode haver delay de sincronização

**Erro: "Erro na captura"**
- Iluminação inadequada
- Leitor não calibrado
- Retentar captura

## Futuros Integrações

- Mock de BCC Services (biometria)
- Mock de pagamento (Stripe/MercadoPago)
- API de envio para RFB/MJ
- Webhook de status para Notificador
