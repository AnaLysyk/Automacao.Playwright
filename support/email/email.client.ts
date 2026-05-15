import { loadEnv } from '../config/env';
import { EmailBrowserClient } from './email.browser';

export type EmailClient = {
  getLatestCode(email: string): Promise<string>;
};

class DefaultEmailClient implements EmailClient {
  async getLatestCode(email: string): Promise<string> {
    const env = loadEnv();

    if (env.emailCodeMode === 'env' && env.securityCode) {
      return env.securityCode;
    }

    if (env.emailCodeMode === 'manual') {
      throw new Error(`EMAIL_CODE_MANUAL_REQUIRED email=${email}`);
    }

    if (env.emailCodeMode === 'browser') {
      const browserClient = new EmailBrowserClient();

      try {
        await browserClient.abrirEmail();
        return await browserClient.buscarCodigoMaisRecente();
      } finally {
        await browserClient.fechar();
      }
    }

    throw new Error(`EMAIL_CODE_PROVIDER_NOT_IMPLEMENTED mode=${env.emailCodeMode}`);
  }
}

export const emailClient: EmailClient = new DefaultEmailClient();
