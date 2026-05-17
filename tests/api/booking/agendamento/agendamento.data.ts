import { loadEnv } from '../../../../support/config/env';
import { cancelarAgendamentoData } from './cancelar/cancelar.data';
import { consultarAgendamentoData } from './consultar/consultar.data';
import { criarAgendamentoData } from './criar/criar.data';

const env = loadEnv();

export const bookingAgendamentoData = {
  payload: criarAgendamentoData.payload,
  paths: {
    criar: criarAgendamentoData.path,
    consultar: consultarAgendamentoData.path,
    cancelar: cancelarAgendamentoData.path,
    cancelarMethod: cancelarAgendamentoData.method,
  },
  status: {
    ativo: /agendado|scheduled|created|ativo|active|confirmado|confirmed|pendente|pending|processing|approved/i,
    cancelado: /cancelado|cancelled|canceled|cancelada|cancel|deleted|error/i,
  },
  requiredConfig: {
    BOOKING_API_BASE_URL: env.bookingApiBaseUrl,
    BOOKING_CREATE_APPOINTMENT_PATH: criarAgendamentoData.path,
    BOOKING_GET_APPOINTMENT_PATH: consultarAgendamentoData.path,
    BOOKING_CANCEL_APPOINTMENT_PATH: cancelarAgendamentoData.path,
    BOOKING_CANCEL_APPOINTMENT_METHOD: cancelarAgendamentoData.method,
    API_TOKEN_PATH: env.apiTokenPath,
    API_TOKEN_GRANT_TYPE: env.apiTokenGrantType,
    API_TOKEN_USER_NAME: env.apiTokenUserName,
    API_TOKEN_USER_PASSWORD: env.apiTokenUserPassword,
    KEYCLOAK_TOKEN_URL: env.keycloakTokenUrl,
    KEYCLOAK_CLIENT_ID: env.keycloakClientId,
    KEYCLOAK_CLIENT_SECRET: env.keycloakClientSecret,
    KEYCLOAK_USERNAME: env.keycloakUsername,
    KEYCLOAK_PASSWORD: env.keycloakPassword,
    X_OPERATOR_CPF: env.xOperatorCpf,
    CPF_REQUERENTE_BOOKING: env.cpfRequerenteBooking,
    TEST_EMAIL: env.testEmail,
    TEST_PHONE: env.testPhone,
    SERVICE_ID: env.serviceId,
    BOOKING_DATE: env.bookingDate,
    BOOKING_TIME: env.bookingTime,
  },
};

export function getMissingBookingConfig(): string[] {
  return Object.entries(bookingAgendamentoData.requiredConfig)
    .filter(([, value]) => !value || String(value).includes('COLE_AQUI'))
    .map(([name]) => name);
}
