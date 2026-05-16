import { BaseApiClient, type ApiResult } from './base.api';
import { loadEnv } from '../config/env';

export class BookingApi extends BaseApiClient {
  private readonly env = loadEnv();

  constructor() {
    const env = loadEnv();
    super({ baseUrl: env.bookingApiBaseUrl, token: env.bookingApiToken });
  }

  async criarAgendamento<T = unknown>(payload: unknown): Promise<ApiResult<T>> {
    return this.post<T>(this.env.bookingCreateAppointmentPath, payload);
  }

  async consultarAgendamento<T = unknown>(idOuProtocolo: string): Promise<ApiResult<T>> {
    const path = this.buildPath(this.env.bookingGetAppointmentPath, {
      id: idOuProtocolo,
      protocolo: idOuProtocolo,
    });

    return this.get<T>(path);
  }

  async cancelarAgendamento<T = unknown>(idOuProtocolo: string): Promise<ApiResult<T>> {
    const path = this.buildPath(this.env.bookingCancelAppointmentPath, {
      id: idOuProtocolo,
      protocolo: idOuProtocolo,
    });

    return this.requestByMethod<T>(this.env.bookingCancelAppointmentMethod, path);
  }

  async consultarPostos<T = unknown>(): Promise<ApiResult<T>> {
    return this.get<T>('/postos');
  }
}

export const bookingApi = new BookingApi();
