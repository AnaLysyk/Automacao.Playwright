# Smoke Tests

## Objetivo

Testes smoke validam se o básico do sistema está de pé rapidamente.

## Características

- Rápidos
- Automatizados
- Sem CAPTCHA
- Sem email real
- Sem agenda instável
- Devem rodar em CI

## Como usar

```bash
npm run test:smoke
```

## Recomendações

- Use esta pasta para testes simples de layout e navegação
- Não coloque fluxos longos aqui
- Se precisar de dados, use fixtures/dados estáveis

## Exemplo de nomes

- `[SMOKE-HOME-001] Home carrega corretamente`
- `[SMOKE-LOCAL-001] Tela de localização abre`
- `[SMOKE-AGP-001] Link para agendamento está visível`
