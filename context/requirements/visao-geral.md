# Visão Geral do Projeto Cidadão Smart

## Objetivo
Este documento orienta o uso dos ambientes disponíveis e define o contexto funcional da automação de testes para o Cidadão Smart.

## Produtos e domínios envolvidos
- Cidadão Smart: frontend de agendamento e emissão online.
- Booking/Admin: painel administrativo de gestão de postos, agendas, serviços e confirmações.
- SMART interno: sistema de processamento, conferência e integração de eventos.
- APIs auxiliares: integração com GBDS/MIR, notificadores, e-mail e serviços de back-end.

## Ambientes oficiais
- **146**: ambiente de homologação / desenvolvimento / QA. Ideal para validações de regressão e testes em evolução.
- **201**: ambiente próximo à produção. Deve ser usado para validações conservadoras e testes de confirmação. Ideal para verificações de consistência de dados, não para alterações destrutivas.
- **200**: ambiente GBDS/MIR / infraestrutura auxiliar. Usado para APIs de integração e serviços complementares.

## Regras de uso de ambiente
- Use `TARGET_ENV` para documentar o ambiente alvo no `.env.local`.
- Mantenha as variáveis reais fora do repositório e só configure credenciais localmente.
- Nunca commit credenciais, senhas ou códigos de segurança.
- Em `146`, o foco é automação de regressão e fluxo completo controlado.
- Em `201`, prefira testes de leitura e verificação de telas, evitando ações que possam alterar dados de produção.

## Configuração de teste
- Os arquivos de configuração usam variáveis de ambiente definidas em `.env.example` e `.env.local`.
- `playwright.config.ts` já está preparado para `ignoreHTTPSErrors` caso os ambientes usem certificados autoassinados.
- Use `CIDADAO_SMART_DRY_RUN=true` para fluxos de demonstração e validação sem confirmar transações reais.

## Organização de documentação
- `context/requirements/`: regras de negócio e contexto funcional.
- `context/test-cases/`: mapeamento de casos de teste por requisito.
- `tests/`: implementação de automação Playwright.
- `tests/pages/` e `tests/pages/selectors/`: Page Objects e seletores separados.

## Princípios de automação
- Separar seletores dos métodos de página.
- Preferir `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText` e `getByTestId`.
- Evitar XPath e CSS frágeis.
- Validar URL e texto de negócio após navegações.
- Usar `test.step` em fluxos maiores.

## Ambiente e execução
- Antes de executar, confirme que o ambiente está acessível manualmente.
- Configure `CIDADAO_SMART_BASE_URL`, `BOOKING_ADMIN_BASE_URL` e `SMART_BASE_URL` de acordo com o ambiente selecionado.
- Para testes automáticos, prefira `CAPTCHA_MODE=disabled` em ambientes QA controlados; caso contrário, use `manual` conforme as regras do projeto.

## Documentos relacionados
- `AGENTS.md`
- `README.md`
- `docs/GUIA_DE_EXECUCAO.md`
- `context/requirements/agendamento-presencial.md`
- `context/requirements/booking-admin.md`
