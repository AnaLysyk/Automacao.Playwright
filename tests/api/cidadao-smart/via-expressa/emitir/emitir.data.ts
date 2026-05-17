import { loadEnv } from '../../../../../support/config/env';

const env = loadEnv();

export const emitirViaExpressaData = {
  path: '/api/v1/citizen-booking/processes/express',

  pessoa: {
    name: env.nomeRequerenteBooking,
    cpf: env.cpfRequerenteBooking,
    birthDate: env.dataNascimentoRequerente,
  },

  posto: {
    filtroPreferencial: 'top tower',
    types: 'SERVICE,PICKUP,SERVICE_PICKUP',
  },
};