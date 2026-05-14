# Visão Geral — Booking / Cidadão Smart / SMART

## Objetivo

Este documento apresenta a visão geral da automação dos fluxos do Booking, Cidadão Smart e integrações relacionadas ao SMART. Ele explica os produtos envolvidos, ambientes, organização da documentação e princípios gerais de execução.

## Produtos e Domínios Envolvidos

- Cidadão Smart: frontend de agendamento, emissão online, consultas e jornadas públicas.
- Booking/Admin: painel administrativo de gestão de postos, agendas, serviços, permissões e confirmações.
- SMART interno: sistema de processamento, conferência, análise de processos civis e integração de eventos.
- APIs auxiliares: integrações com GBDS/MIR, notificadores, e-mail, DAE e serviços de backend.

## Ambientes Oficiais

- `146`: ambiente de homologação, desenvolvimento e QA. É o ambiente preferencial para validações novas, automação assistida e testes em evolução.
- `201`: ambiente produção ou produção-like. Deve ser usado com cautela, priorizando validações read-only e comparações de comportamento.
- `200`: ambiente GBDS/MIR ou infraestrutura auxiliar, usado para APIs de integração e serviços complementares.

## Regras de Uso de Ambiente

- Use `TARGET_ENV` para identificar o ambiente alvo no `.env.local`.
- Mantenha URLs, usuários e credenciais reais fora do repositório.
- Nunca commitar senhas, tokens, códigos reais de segurança, dados sensíveis, VPN, root, banco ou servidor.
- Em `146`, priorize regressão, exploração e fluxo completo controlado.
- Em `201`, priorize consultas, smoke read-only e validações que não alterem dados reais.

## Configuração de Teste

- Os arquivos de configuração usam variáveis de ambiente definidas em `.env.example` e `.env.local`.
- `playwright.config.ts` deve ler a URL base, slow motion, evidências e modos de execução por variável de ambiente.
- Quando houver fluxos que possam gerar dados reais, eles devem ser classificados como `manual-assisted`, `read-only` ou executados apenas em ambiente controlado.
- Caso uma variável de modo seguro seja criada, como `CIDADAO_SMART_DRY_RUN`, ela deve estar documentada no `.env.example` e ser respeitada pela automação antes de qualquer confirmação real.

## Organização da Documentação

- `context/requirements/`: contexto funcional, regras de negócio, ambientes, integrações e known issues.
- `context/test-cases/`: casos de teste estruturados ou mapeamentos exportados de CDS/Qase.
- `docs/`: guias operacionais, estratégia de automação, evidências, relatórios e análise de falhas.
- `tests/`: automação executável com Playwright.
- `tests/pages/` e `tests/pages/selectors/`: Page Objects e seletores de tela.
- `tests/agents/`: orquestração de fluxos, etapas, evidências e barreiras manuais/controladas.

## Princípios de Automação

- Separar contexto, caso de teste e spec automatizada.
- Usar Page Objects para ações de tela.
- Usar Agents para orquestração de fluxo.
- Manter specs limpas e orientadas ao comportamento.
- Preferir `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText` e `getByTestId`.
- Evitar XPath, CSS frágil e excesso de `nth()`.
- Validar URL, texto de negócio, status visual e evidência após navegações relevantes.
- Usar `test.step` ou `StepAgent` em fluxos maiores.

## Ambiente e Execução

- Antes de executar, confirme VPN, URL e permissões de acesso.
- Configure `CIDADAO_SMART_BASE_URL`, `BOOKING_ADMIN_BASE_URL`, `SMART_REACT_URL` e `SMART_BASE_URL` conforme o ambiente.
- Para testes automáticos, use `CAPTCHA_MODE=disabled` somente quando houver bypass oficial de QA.
- Para CAPTCHA real, use `CAPTCHA_MODE=manual` e mantenha o fluxo em `manual-assisted`.

## Documentos Relacionados

- `AGENTS.md`
- `README.md`
- `docs/GUIA_DE_EXECUCAO.md`
- `docs/MAPA_DE_TESTES.md`
- `docs/EVIDENCIAS_E_RELATORIOS.md`
- `docs/GUIA_DE_ANALISE_DE_FALHAS.md`
- `context/requirements/agendamento-presencial.md`
- `context/requirements/booking-admin.md`
