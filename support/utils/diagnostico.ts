export function diagnosticoBookingCriacao(): string {
  return 'Falha na criacao do agendamento. Provavel causa: payload invalido, regra de negocio, autenticacao, disponibilidade de horario ou endpoint indisponivel.';
}

export function diagnosticoBookingConsulta(): string {
  return 'Falha na consulta do agendamento. Provavel causa: problema de persistencia, endpoint de consulta, atraso de sincronizacao ou id/protocolo incorreto.';
}

export function diagnosticoBookingCancelamento(): string {
  return 'Falha no cancelamento do agendamento. Provavel causa: regra de cancelamento, autenticacao, status nao cancelavel ou endpoint de cancelamento.';
}

export function diagnosticoBookingConsultaCancelado(): string {
  return 'Cancelamento nao refletiu na consulta. Provavel causa: persistencia, sincronizacao, regra de status ou cache.';
}

export function diagnosticoViaExpressaElegibilidade(): string {
  return 'CPF nao elegivel para via expressa. Provavel causa: massa invalida, processo anterior inexistente, status nao finalizado ou regra de elegibilidade.';
}

export function diagnosticoViaExpressaCriacao(): string {
  return 'Falha na criacao da via expressa. Provavel causa: payload invalido, CPF inelegivel, regra de negocio, autenticacao ou integracao Cidadao Smart/SMART.';
}

export function diagnosticoViaExpressaConsulta(): string {
  return 'Falha na consulta do processo criado. Provavel causa: persistencia, integracao com SMART, atraso de sincronizacao ou protocolo incorreto.';
}

export function diagnosticoViaExpressaCancelamento(): string {
  return 'Falha no cancelamento da via expressa. Provavel causa: regra de cancelamento, autenticacao, status nao cancelavel ou endpoint de cancelamento.';
}
