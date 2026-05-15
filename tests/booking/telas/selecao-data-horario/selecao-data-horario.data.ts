import { loadEnv } from '../../../../support/config/env';

const env = loadEnv();

function dataFutura(dias = 5): string {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
}

export const selecaoDataHorarioData = {
  requerente: {
    nome: process.env.CIDADAO_SMART_TEST_NAME || 'Automacao Booking',
    dataNascimento: process.env.CIDADAO_SMART_TEST_BIRTH_DATE || '01/01/1990',
    email: env.testEmail || 'qa-booking@example.com',
    cpf: env.cpfElegivel,
    telefone: process.env.CIDADAO_SMART_TEST_PHONE || '48999999999',
  },
  dataAgendamento: process.env.CIDADAO_SMART_TEST_APPOINTMENT_DATE || dataFutura(),
  horario: process.env.CIDADAO_SMART_TEST_APPOINTMENT_TIME || '08:00',
};
