const env = (key: string, fallback = ''): string => process.env[key] || fallback;

export const cidadaoSmartTestData = {
  requerenteDemo: {
    nome: env('CIDADAO_SMART_TEST_NAME', 'Pessoa Teste Automacao'),
    cpfSemMascara: env('CIDADAO_SMART_TEST_CPF'),
    cpfComMascara: env('CIDADAO_SMART_TEST_CPF_FORMATTED'),
    dataNascimento: env('CIDADAO_SMART_TEST_BIRTH_DATE', '01/01/1990'),
    email: env('CIDADAO_SMART_TEST_EMAIL', 'qa-booking@example.com'),
    telefoneSemMascara: env('CIDADAO_SMART_TEST_PHONE_RAW', '55555555555'),
    telefoneComMascara: env('CIDADAO_SMART_TEST_PHONE', '(55) 55555-5555'),
  },
  agendamentoDemo: {
    dataAgendamento: env('CIDADAO_SMART_TEST_APPOINTMENT_DATE', '18/05/2026'),
    horario: env('CIDADAO_SMART_TEST_APPOINTMENT_TIME', '08:00'),
  },
};
