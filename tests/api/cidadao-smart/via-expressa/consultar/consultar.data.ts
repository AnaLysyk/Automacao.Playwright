import { loadEnv } from '../../../../../support/config/env';

const env = loadEnv();

export const consultarViaExpressaData = {
  path: '/api/v1/citizen-booking/processes/{protocolo}',
  birthDate: env.dataNascimentoRequerente,
  cpf: env.cpfRequerenteBooking,
};