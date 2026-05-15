import { loadEnv } from '../../../../support/config/env';

const env = loadEnv();

export const bookingValidacaoEmailData = {
  email: env.testEmail,
};
