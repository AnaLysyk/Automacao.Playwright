# Automação Playwright — Booking / Cidadão Smart

Repositório de automação com **Playwright** para validação dos fluxos do **Booking**, **Cidadão Smart** e integrações relacionadas ao **SMART**.

O objetivo deste projeto é organizar uma base de QA executável, com testes **E2E**, **API**, **validações assistidas**, evidências visuais e documentação de apoio para análise de falhas, regressão funcional e acompanhamento técnico dos fluxos críticos.

---

## Objetivo

Transformar os fluxos críticos do Booking e do Cidadão Smart em uma base de automação clara, rastreável e fácil de executar.

A automação deve apoiar:

- validações de regressão;
- execução assistida de fluxos com CAPTCHA ou código de segurança;
- análise de falhas em ambiente de homologação;
- geração de evidências visuais;
- separação entre testes de UI, API, E2E e Admin;
- documentação do comportamento esperado;
- apoio à tomada de decisão durante validações de release.

---

## Escopo inicial

O foco inicial da automação está nos fluxos relacionados ao **Booking consumido pelo Cidadão Smart**, principalmente:

- agendamento presencial;
- busca por cidade ou CEP;
- seleção de posto;
- preenchimento dos dados do requerente;
- seleção de data e horário;
- validação por código de segurança;
- confirmação de agendamento;
- geração de protocolo;
- guia/comprovante;
- cancelamento, quando disponível;
- consultas;
- Booking Admin;
- integrações API;
- fluxos assistidos com CAPTCHA e validação por e-mail.

Também serão organizados cenários para:

- emissão online;
- Notificador GBDS;
- SMART;
- conferência;
- integrações entre Booking, Cidadão Smart e SMART.

---

## Stack

- Playwright
- TypeScript
- Page Object Model
- Agentes de orquestração
- Configuração por ambiente via `.env.local`
- Evidências com screenshots, vídeos, traces e relatório HTML
- Organização por contexto, casos de teste, specs e documentação técnica

---

## Conceito da arquitetura

A automação é organizada em camadas:

- **Contextos**: explicam regras, ambientes, dependências, known issues e responsabilidades dos módulos.
- **Casos de teste**: descrevem cenários funcionais e regras esperadas.
- **Page Objects**: representam as telas e ações específicas da interface.
- **Agentes**: orquestram fluxos maiores, etapas, pausas assistidas, evidências e classificação de falhas.
- **Specs**: executam os testes chamando Page Objects, agentes ou APIs.
- **Evidências**: registram o comportamento observado durante a execução.

A ideia é evitar specs gigantes e deixar cada parte com uma responsabilidade clara.

---

## Estrutura principal

```txt
context/
  requirements/
  test-cases/

docs/

tests/
  agents/
  config/
  data/
  types/
  pages/
  booking/
  booking-admin/
  api/
  manual-assisted/

legacy/
  automation-exercise/
