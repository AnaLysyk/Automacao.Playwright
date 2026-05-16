import { loadEnv } from '../../../support/config/env';

const env = loadEnv();

export const bookingAgendamentoData = {
  payload: {
    cpf: env.cpfRequerenteBooking,
    email: env.testEmail,
    telefone: env.testPhone,
    servicePointId: env.servicePointId,
    serviceId: env.serviceId,
    data: env.bookingDate,
    hora: env.bookingTime,
  },
  requiredConfig: {
    BOOKING_API_BASE_URL: env.bookingApiBaseUrl,
    BOOKING_CREATE_APPOINTMENT_PATH: env.bookingCreateAppointmentPath,
    BOOKING_GET_APPOINTMENT_PATH: env.bookingGetAppointmentPath,
    BOOKING_CANCEL_APPOINTMENT_PATH: env.bookingCancelAppointmentPath,
    BOOKING_API_TOKEN: env.bookingApiToken,
    CPF_REQUERENTE_BOOKING: env.cpfRequerenteBooking,
    TEST_EMAIL: env.testEmail,
    TEST_PHONE: env.testPhone,
    SERVICE_POINT_ID: env.servicePointId,
    SERVICE_ID: env.serviceId,
    BOOKING_DATE: env.bookingDate,
    BOOKING_TIME: env.bookingTime,
  },
};

export function getMissingBookingConfig(): string[] {
  return Object.entries(bookingAgendamentoData.requiredConfig)
    .filter(([, value]) => !value)
    .map(([name]) => name);
}
