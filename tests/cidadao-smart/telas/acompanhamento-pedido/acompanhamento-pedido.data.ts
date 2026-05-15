import { loadEnv } from '../../../../support/config/env';

const env = loadEnv();

export const acompanhamentoPedidoData = {
  protocoloInvalido: '0000000000',
  dataNascimento: '01/01/1990',
  cpfInvalido: env.cpfInvalido,
};
