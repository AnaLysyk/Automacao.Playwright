import { loadEnv } from '../../../../../support/config/env';

const env = loadEnv();

export const diagnosticarConsultaViaExpressaData = {
  pathOficial: '/api/v1/citizen-booking/processes/{protocolo}',
  birthDate: env.dataNascimentoRequerente,
};