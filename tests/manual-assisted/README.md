# Manual-Assisted: Testes com Intervalo Humano

⚠️ **AVISO: Estes testes requerem intervalo humano. NÃO devem ser executados em CI.**

## O Que É Manual-Assisted?

Testes que exigem ação manual durante a execução. Úteis para:
- Demonstração visual do fluxo
- Investigação de problemas ponta a ponta
- Validação de integrações com email/SMS
- Resolução manual de CAPTCHA

## Características

✗ Não roda em CI
✗ Não roda em regressão automática
✗ Exige CAPTCHA manual
✗ Pode exigir código por email/SMS
✓ Excelente para demonstração
✓ Excelente para investigação

## Testes Disponíveis

- `[DEMO-AGP-001]` Fluxo completo de agendamento com CAPTCHA e código por email
- `[DEMO-PASSO-001]` Demo passo a passo com pausas

## Como Executar

```bash
# Rodar todos os testes assistidos
npm run test:demo

# Ou específico com playwright
npx playwright test tests/manual-assisted --headed
```

## Fluxo de Execução

1. Teste inicia e abre a aplicação
2. Navega até encontrar CAPTCHA
3. **Teste pausa** com `page.pause()`
4. **Você marca "Não sou um robô" no reCAPTCHA**
5. **Você clica em "Prosseguir" na página**
6. **Você retorna ao Playwright e clica "Resume"**
7. Teste continua até encontrar código por email
8. **Você consulta email e copia o código**
9. **Você cola o código no teste**
10. Teste finaliza e valida fluxo completo

## Configuração Necessária

```bash
# .env
CAPTCHA_MODE=manual              # Modo manual
CIDADAO_SMART_BASE_URL=https://172.16.1.146
EMAIL_CONFIGURADO=sim            # Email funcional
```

## Por Que Pausas?

Não burlamos CAPTCHA real. A estratégia é:
1. **CAPTCHA_MODE=manual** → Usuário marca manualmente
2. **page.pause()** → Teste aguarda interação
3. Usuário marca e clica
4. Teste retoma e valida

Isso deixa claro que a automação respeitou a segurança.

## Interpretação de Falhas

| Falha | Causa Provável | Ação |
|-------|----------------|------|
| Teste parou na pausa | Email não chegou | Aguardar ou reintentar |
| Código rejeitado | Código expirou | Gerar novo código |
| Resumo com dado errado | Bug de produto | Reportar |

## Próximos Passos

Quando CAPTCHA tiver solução automatizada:
1. Mover estes testes para `tests/e2e/`
2. Remover `page.pause()`
3. Usar `CAPTCHA_MODE=test` se disponível
4. Incluir em CI como E2E

## Referências

- [ESTRATEGIA_EXECUCAO.md](../../ESTRATEGIA_EXECUCAO.md) - Classificação de testes
- [AGENTS.md](../../AGENTS.md) - Regras gerais
