import { loadEnv } from '../../../../../support/config/env';

const env = loadEnv();

export const consultarAgendamentoData = {
  path: env.bookingGetAppointmentPath,
};
