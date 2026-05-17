import { loadEnv } from '../../../../../support/config/env';

const env = loadEnv();

export const emissaoOnlineData = {
  cpfElegivel: env.cpfElegivel,
  fotoValida: env.validPhotoPath,
};
