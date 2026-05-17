import { loadEnv } from '../../../../../support/config/env';

const env = loadEnv();

export const cancelarAgendamentoData = {
  path: env.bookingCancelAppointmentPath,
  method: env.bookingCancelAppointmentMethod,
};
