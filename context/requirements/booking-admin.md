# Booking Admin — Contexto Funcional

## 1. Objetivo do documento

Este documento descreve o papel funcional do painel administrativo do Booking.
Ele explica o que o Admin faz, quais módulos existem, o que é read-only e o que altera configuração.
O foco é dar contexto para os testes e evitar misturar:

- credenciais;
- URLs específicas;
- casos de teste;
- implementação Playwright.

## 2. O que é o Booking Admin

O Booking Admin é o painel de gestão do sistema Booking.
Ele apoia a operação interna e mantém as regras, parâmetros e dados que o Cidadão Smart consome.

Principais funções:
- controle de postos de atendimento;
- configuração de horários e agendas;
- consulta de agendamentos;
- gerenciamento de permissões e usuários;
- administração de ambiente e identidade visual;
- auditoria de alterações.

## 3. Relação com o agendamento público

O Booking Admin não é a jornada de agendamento do cidadão, mas influencia diretamente o fluxo público.

Impactos comuns:
- posto inativo no Admin desaparece da busca pública;
- agenda sem horários bloqueia o agendamento;
- limite de vagas impede novas solicitações;
- bloqueio de datas remove opções do calendário.

O Admin define o “espaço de opções” que o Cidadão Smart apresenta.

## 4. Módulos principais

### 4.1 Agendamentos

- Listar agendamentos ativos e cancelados.
- Filtrar por CPF, número de protocolo, data e posto.
- Abrir detalhes de cada solicitação.
- Conferir status e justificativas.

### 4.2 Busca por CPF

- Recurso essencial para validar solicitações.
- Deve retornar histórico e detalhes do cidadão.
- Importante para auditoria e suporte.

### 4.3 Paginação

- Listagens paginadas de agendamentos e postos.
- Deve manter filtros e ordenação.
- Testar navegação entre páginas.

### 4.4 Reagendamento

- Fluxo de alteração de data/hora.
- Normalmente exige autorização e validação de disponibilidade.
- Pode ser protegido por regras de permissão.

### 4.5 Cancelamento

- Remoção de agendamento do estado ativo.
- Pode exigir justificativa.
- Deve ser auditado.

### 4.6 Gestão de Postos

- Criar, editar e inativar postos.
- Definir endereço, município e UF.
- Relacionar posto a tipos e perfil de atendimento.
- Sincronizar posto com SMART.

### 4.7 Horários

- Configurar horários de funcionamento.
- Disponibilizar intervalos de atendimento.
- Ajustar capacidades por turno.

### 4.8 Bloqueios e feriados

- Definir datas especiais fora do calendário normal.
- Bloquear ou liberar acesso em períodos específicos.
- Usado para feriados e paradas operacionais.

### 4.9 Permissões

- Controlar quais perfis acessam cada módulo.
- Separar operador, supervisor e administrador.
- Limitar ações de write a perfis autorizados.

### 4.10 Auditoria

- Registro de alterações feitas no sistema.
- Histórico de login e ações sensíveis.
- Uso crítico para investigação de falhas.

### 4.11 Ambiente

- Parâmetros de ambiente (UF, serviço, rotas).
- Configuração que define o comportamento local do Booking.
- Afeta a distribuição de postos e filas.

### 4.12 Identidade visual

- Ajustes de marca e textos exibidos.
- Parte da apresentação, não da lógica de agendamento.
- Podem existir campos de cabeçalho, logotipo e instruções.

## 5. Separação read-only e write

### 5.1 Admin read-only

Esses testes são mais estáveis e seguros.
Eles apenas consultam o estado do sistema.

Exemplos típicos:
- login;
- listar agendamentos;
- buscar CPF;
- abrir detalhes;
- visualizar posto;
- visualizar configurações;
- visualizar auditoria.

### 5.2 Admin write

São testes sensíveis e devem rodar apenas em ambiente controlado.
Eles alteram o estado do Booking e podem impactar o público.

Exemplos típicos:
- criar posto;
- editar posto;
- alterar horário;
- alterar limite;
- criar bloqueio;
- alterar identidade visual;
- aprovar auditoria;
- cancelar agendamento;
- reagendar.

## 6. O que pode quebrar a jornada pública

Multiplicadores de risco:
- posto inativo ou excluído;
- horário removido ou capacidade zerada;
- bloqueio de data indevido;
- limite de vagas reduzido a zero;
- falha de sincronização entre Admin e público;
- permissão incorreta que impede visualização.

Um erro no Booking Admin frequentemente se manifesta como “não há opção disponível” no fluxo do cidadão.

## 7. O que deve virar teste API

- consulta de agendamentos por CPF;
- listagem de postos e status;
- leitura de configurações de agenda;
- verificação de permissões por perfil;
- recuperação de dados de auditoria;
- consulta de bloqueios e feriados.

Esses testes devem validar contratos e respostas sem depender de UI.

## 8. O que deve virar teste UI

- login e carregamento do painel;
- visualização de lista de postos;
- busca por CPF e abertura de detalhes;
- navegação entre módulos;
- visualização de agenda e bloqueios;
- acesso à auditoria;
- exibição de permissões.

O foco inicial deve ser em read-only e estabilidade.

## 9. Riscos e cuidados

### Riscos
- operações write sem controle;
- dados inconsistentes entre Admin e público;
- permissões mal configuradas;
- ambiente compartilhado sendo usado para alteração;
- testes que dependem de massa instável.

### Cuidados
- separar claramente read-only de write;
- usar ambiente homologação / controlado;
- registrar perfil de usuário;
- evitar execução noturna sem supervisão;
- documentar qualquer mudança feita para teste.

## 10. Relação com evidências

O Booking Admin deve gerar evidências sempre que houver alteração de estado ou investigação de falha.

Principais artefatos:
- screenshot da lista de postos / agendamentos;
- vídeo de navegação no painel;
- trace de execução em caso de erro;
- logs de auditoria consultados;
- relatório de comandos e resultados.

Em especial, operações write devem ser acompanhadas de evidência clara do antes/depois.

## 11. O que não deve ficar neste documento

- credenciais ou senhas;
- URLs específicas de ambiente;
- passo a passo de teste;
- massa de dados concreta;
- scripts ou seletores Playwright;
- resultados esperados de casos individuais.

## 12. Status do documento

- Versão: 1.0
- Origem: documentação funcional para automação
- Uso: base para testes de `tests/booking-admin/`
- Revisão: necessário validar com o time de produto e QA antes de automação final

- `tests/booking-admin/` — implementação dos testes.

## 13. Próximos passos

- Implementar testes read-only básicos.
- Validar impacto das configurações no Cidadão Smart.
- Evoluir para write controlado em ambiente QA.
- Integrar com API para validações cruzadas.
- Documentar known issues específicos do Admin.
