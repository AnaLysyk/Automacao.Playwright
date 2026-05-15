import { BaseApiClient } from './base.api';
import { loadEnv } from '../config/env';

export class BookingApi extends BaseApiClient {
  constructor() {
    const env = loadEnv();
    super({ baseUrl: env.bookingApiBaseUrl, token: env.bookingApiToken });
  }

  async consultarAgendamento<T>(protocolo: string): Promise<T> {
    return this.getJson<T>(`/agendamentos/${encodeURIComponent(protocolo)}`);
  }

  async consultarPostos<T>(): Promise<T> {
    return this.getJson<T>('/postos');
  }
}

export const bookingApi = new BookingApi();
