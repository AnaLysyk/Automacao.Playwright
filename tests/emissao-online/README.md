# Emissão Online: Testes de Regressão

✅ **Testes automáticos estáveis do fluxo de emissão online.**

## Características

✓ Automáticos (sem intervalo humano)
✓ Rodam em CI
✓ Rodam em regressão diária
✓ Sem CAPTCHA manual
✓ Sem email real
✓ Massa controlada
✓ Independentes entre si

## Estrutura

```
emissao-online/
├── tipo.spec.ts                # Seleção de tipo de emissão
├── captura.spec.ts             # Captura de documentos
├── resumo.spec.ts              # Resumo e validações
├── autenticacao.spec.ts         # Autenticação/código
└── README.md
```

## Testes Disponíveis

### Tipo de Emissão

- `[REG-EMI-TIPO-001]` Validar seleção de certidão de nascimento
- `[REG-EMI-TIPO-002]` Validar seleção de tipo inválido bloqueada

### Captura de Documentos

- `[REG-EMI-CAPT-001]` Upload válido de documento
- `[REG-EMI-CAPT-002]` Upload de formato inválido rejeitado
- `[REG-EMI-CAPT-003]` Upload de arquivo não-imagem rejeitado
- `[REG-EMI-CAPT-004]` Validação de mensagem de imagem inválida

### Resumo

- `[REG-EMI-RES-001]` Validar resumo com dados corretos
- `[REG-EMI-RES-002]` Validar dados biográficos no resumo

### Autenticação

- `[REG-EMI-AUTH-001]` Validar código de segurança obrigatório

## Como Executar

```bash
# Todos os testes de emissão
npm run test:emissao

# Apenas captura
npm run test:emissao:captura

# Apenas resumo
npm run test:emissao:resumo

# Por tag
npx playwright test --grep @emissao

# Arquivo específico
npx playwright test tests/emissao-online/captura.spec.ts --headed
```

## Estrutura de Dados

Tipos suportados:
```typescript
{
  tipo: "Certidão de Nascimento",
  comarca: "São Paulo",
  distrito: "Centro",
  livro: "1000",
  folha: "500",
  termo: "1"
}
```

Documentos válidos:
- JPG, PNG, PDF
- Tamanho: 100KB - 10MB
- Resolução: mínimo 200dpi

## Page Objects Utilizados

- `CidadaoSmartEmissaoTipoPage` - Seleção de tipo
- `CidadaoSmartEmissaoCapturasPage` - Captura de documentos
- `CidadaoSmartEmissaoResumoPage` - Resumo
- `CidadaoSmartEmissaoAutenticacaoPage` - Autenticação

## Regras Críticas

1. **Cada teste é independente**
   - Não depende de outro ter rodado antes
   - Não reutiliza protocolo

2. **Sem CAPTCHA**
   - Todos correm com `CAPTCHA_MODE=disabled`

3. **Sem email real**
   - Não exigem código por email

4. **Massa controlada**
   - Usa dados de teste conhecidos
   - Documentos válidos fornecidos

5. **Validação de tipo**
   - Resumo **deve** refletir exatamente o tipo selecionado
   - Se não refletir = bug de produto

## Interpretação de Falhas

| Falha | Causa Provável | Ação |
|-------|----------------|------|
| Upload falha | Seletor alterado / formato rejeitado | Verificar suporte de formato |
| Resumo vazio | Bug de integração | Reportar |
| Captura rejeitada | Arquivo inválido | Verificar arquivo de teste |

## Comandos Úteis

```bash
# Com vídeo (útil para falhas)
npx playwright test tests/emissao-online --headed --output=video

# Com trace (debug detalhado)
npx playwright test tests/emissao-online --trace on
```

## Status de Maturidade

**ESTÁVEL** 🟢 - Pronto para produção e CI

Todos os testes desta pasta são considerados estáveis.

## Referências

- [ESTRATEGIA_EXECUCAO.md](../../ESTRATEGIA_EXECUCAO.md)
- [AGENTS.md](../../AGENTS.md)
