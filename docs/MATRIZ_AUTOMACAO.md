# Matriz de Automação

## Objetivo

Organizar os fluxos automatizados por nível de execução, separando o que roda no CI/CD, o que serve para diagnóstico front/back e o que deve permanecer como fluxo assistido.

---

## Nível 1 — CI/CD automático

Fluxos que devem rodar sozinhos, sem depender de câmera, e-mail real, Captury ou reCAPTCHA.

### Booking

- Agendar com CPF
- Agendar sem CPF
- Consultar agendamento/protocolo
- Cancelar agendamento
- Consultar após cancelamento
- Validar liberação de slot após cancelamento
- Validar disponibilidade de dias e horários
- Validar limite de agendamento por horário

### Cidadão Smart

- Consultar protocolo válido
- Consultar protocolo inexistente
- Consultar protocolo com data de nascimento divergente
- Validar elegibilidade de CPF
- Validar CPF com histórico de emissão
- Validar CPF sem histórico de emissão
- Validar CPF irregular

---

## Nível 2 — Diagnóstico front/back

Fluxos que comparam API e interface para identificar onde está a falha.

```text
API passou + UI passou = fluxo saudável
API passou + UI falhou = provável problema de front/cache/renderização
API falhou + UI falhou = provável problema de back/regra/integração
API falhou + UI passou = UI pode estar mascarando erro ou usando outro caminho