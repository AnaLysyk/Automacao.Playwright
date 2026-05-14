# API Cidadão Smart / Booking

## 1. Para que serve este arquivo

Este documento descreve o contexto funcional e técnico das APIs relacionadas ao ecossistema Cidadão Smart / Booking.
Ele não é um caso de teste, nem um guia de implementação de tela.
Serve para:

- Explicar quais APIs existem e quais domínios elas atendem.
- Mostrar a relação entre Booking, Cidadão Smart e SMART.
- Identificar endpoints relevantes para automação e validação por API.
- Mapear o que é apropriado validar por API antes ou junto da UI.
- Definir limites do documento e o que não deve ser tratado aqui.

## 2. Visão geral

O ecossistema inclui:

- **Booking**: backend que gerencia agendamentos, postos, disponibilidade e regras de atendimento.
- **Cidadão Smart**: interface pública consumidora das APIs, onde o usuário final faz agendamento, emissão, consulta e segunda via.
- **SMART**: sistema interno de processamento e conferência que recebe eventos de processo e documento.
- **APIs REST**: contrato de comunicação entre frontend público, Booking e sistemas auxiliares.

A base deste arquivo é um swagger/documentação REST que expõe controladores como Booking, Cidadão Smart, Postos, Processos, Tokens, DAE e endpoints auxiliares.

## 3. Relação entre API, Booking, Cidadão Smart e SMART

- **Cidadão Smart** é a camada de apresentação pública. Ela consome APIs para exibir dados ao cidadão e enviar solicitações.
- **Booking** é o módulo de negócio que processa agendamentos presenciais, segunda via e operações administrativas.
- **SMART** trata validação e conferência de processos/documentos e integrações de backend.
- **APIs** são a ponte entre a jornada pública e a lógica de backend.

Em termos de teste:

- Falhas de UI podem ocorrer em Cidadão Smart.
- Falhas de negócio tendem a estar em Booking.
- Validações de contrato e consistência podem ser feitas por API.

## 4. Autenticação

A autenticação dos endpoints deve ser documentada e revisada no swagger da SMART API REST.

Geralmente, os seguintes padrões podem existir:

- Token Bearer JWT para clientes autenticados.
- Credenciais específicas para o backend do Booking/Admin.
- Endpoints públicos que não exigem autenticação para consulta básica, mas exigem token para ações sensíveis.

Para automação de API, é importante estabelecer:

- Onde obter o token.
- Quais endpoints exigem autenticação.
- Como renovar ou invalidar tokens.
- Como tratar respostas de `401 Unauthorized` e `403 Forbidden`.

## 5. Endpoints de Booking

Estes endpoints tratam diretamente o módulo de agendamento e suas dependências.

Possíveis responsabilidades:

- Listar postos e cidades.
- Listar agenda, datas e horários disponíveis.
- Validar disponibilidade de vagas.
- Criar, editar e cancelar agendamentos.
- Buscar informações de processo por protocolo.
- Consultar ou confirmar código de segurança.
- Operações de segunda via.

O objetivo da documentação de Booking é identificar contratos que suportam a jornada de agendamento presencial e as operações administrativas associadas.

## 6. Endpoints de Cidadão Smart

Estes endpoints servem ao frontend público e geralmente incluem:

- Busca de postos por localização.
- Consulta de disponibilidade e horários.
- Criação de processo/solicitação de agendamento.
- Consulta de protocolo ou pedido do cidadão.
- Recursos de perfil, endereço ou dados do requerente.

São endpoints que o Cidadão Smart consome diretamente para suportar a experiência do usuário.

## 7. Endpoints de Postos

Endpoints de postos são essenciais para:

- Listar postos ativos e inativos.
- Recuperar detalhes de um posto (nome, endereço, cidade, station_id).
- Consultar status de sincronização entre Booking e SMART.
- Verificar capacidade e horários de atendimento.

Esses dados impactam diretamente quais postos aparecem na interface pública e qual posto será usado no agendamento.

## 8. Endpoints de Processos

Os endpoints de processos atendem à lógica de acompanhamento do pedido.

Incluem:

- Abertura de processo.
- Consulta de dados do processo por protocolo.
- Atualização de dados do processo.
- Verificação de status e workflow do processo.

Em muitos casos, o processo representa o pedido do cidadão no fluxo de agendamento ou segunda via.

## 9. DAE

A DAE (Documento de Arrecadação Estadual) é um serviço adicional relacionado ao pagamento ou emissão de guia.

Pontos de atenção:

- Identificar endpoints de geração e consulta de DAE.
- Verificar se o DAE está vinculado ao processo/agendamento.
- Avaliar se o DAE pode ser validado por API antes da confirmação da solicitação.

## 10. Consulta de protocolo

A consulta de protocolo é um fluxo comum de verificação de status.

Aspectos importantes:

- Endpoint que recebe protocolo/CPF e retorna dados do pedido.
- Validação de mensagens de erro para protocolo inexistente ou inválido.
- Uso em fluxos de consulta de pedido, consulta de agendamento e segunda via.

## 11. Segunda via expressa

Este conjunto de endpoints deve suportar a emissão rápida de segunda via sem alterações de dados.

Deve incluir:

- Verificação de elegibilidade para segunda via.
- Consulta de dados do pedido existente.
- Geração de nova via para impressão ou download.
- Retorno de status e identificadores do processo.

## 12. Segunda via com alterações

Este conjunto trata casos em que o cidadão solicita nova via com alterações em dados ou documentos.

Importante documentar:

- Endpoints para criar/editar segunda via com nova documentação.
- Dados obrigatórios para alterações.
- Regras de validação de documentos e processo.
- Passos em que o processo é reavaliado ou enviado para conferência.

## 13. O que validar por API

Por API, é recomendado validar:

- Disponibilidade do serviço e saúde dos endpoints.
- Contratos básicos de GET/POST e códigos HTTP esperados.
- Autenticação e autorização.
- Listagem de postos e dados de estação.
- Disponibilidade de agenda e horários.
- Criação de processos/agendamentos com payload válido.
- Consulta de protocolo e retorno de status correto.
- Segunda via expressa e segunda via com alterações.
- Geração e consulta de DAE.
- Erros esperados para entradas inválidas.

A validação por API deve priorizar contratos e consistência de dados, complementando as verificações de UI.

## 14. O que não fica neste documento

❌ Casos de teste detalhados ou scripts.
❌ Dados de massa específicos (CPF, e-mail, códigos reais).
❌ Seletor de UI ou Page Objects Playwright.
❌ Passo a passo de execução de teste.
❌ Documentação de ambiente de frontend ou de administração de Booking.

Este arquivo é apenas contexto funcional/técnico da API e deve ser usado como base para criar casos de teste e contratos de validação em `tests/api/`, sem misturar com a documentação de agendamento-presencial.
