import { loadEnv } from '../../../../support/config/env';

const env = loadEnv();

export const selecaoPostoData = {
  cidade: process.env.CIDADAO_SMART_DEFAULT_CITY || 'Florianópolis',
  posto: process.env.CIDADAO_SMART_DEFAULT_SERVICE_POINT || 'Top Tower',
  cpf: env.cpfElegivel,
};
