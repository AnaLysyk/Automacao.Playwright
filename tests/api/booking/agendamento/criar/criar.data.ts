import { loadEnv } from '../../../../../support/config/env';

const env = loadEnv();

export const criarAgendamentoData = {
  path: env.bookingCreateAppointmentPath,

  payload: {
    cpf: env.cpfRequerenteBooking,
    email: env.testEmail,
    telefone: env.testPhone,
    servicePointId: env.servicePointId,
    serviceId: env.serviceId,
    data: env.bookingDate,
    hora: env.bookingTime,
  },
};
