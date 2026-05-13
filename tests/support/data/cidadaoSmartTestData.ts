export const cidadaoSmartTestData = {
  requerenteDemo: {
    nome: 'Ana Teste Automacao',
    cpfSemMascara: '03659184829',
    cpfComMascara: '036.591.848-29',
    dataNascimento: '01/01/2009',
    email: process.env.CIDADAO_SMART_TEST_EMAIL || 'ana.testing.company@gmail.com',
    telefoneSemMascara: '55555555555',
    telefoneComMascara: '(55) 55555-5555',
  },
  agendamentoDemo: {
    dataAgendamento: '18/05/2026',
    horario: '08:00',
  },
};
