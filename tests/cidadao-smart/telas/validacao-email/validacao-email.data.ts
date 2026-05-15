import { loadEnv } from '../../../../support/config/env';

const env = loadEnv();

export const validacaoEmailData = {
  cpfElegivel: env.cpfElegivel,
  email: env.testEmail,
};
