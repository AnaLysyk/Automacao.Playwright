import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

export type CaptchaMode = 'manual' | 'disabled' | 'test';
export type CaptureMode = 'manual' | 'fake-video' | 'disabled';
export type EmailCodeMode = 'manual' | 'env' | 'browser' | 'gmail-api' | 'imap' | 'internal-api' | 'log';

export type EnvConfig = {
  cidadaoSmartBaseUrl: string;
  bookingBaseUrl: string;
  smartApiBaseUrl: string;
  cidadaoSmartApiBaseUrl: string;
  bookingApiBaseUrl: string;
  smartApiToken: string;
  cidadaoSmartApiToken: string;
  bookingApiToken: string;
  testEmail: string;
  testEmailPassword: string;
  testEmailProvider: string;
  testPhone: string;
  emailCodeMode: EmailCodeMode;
  emailBrowserProfileDir: string;
  emailBrowserSearchQuery: string;
  securityCode: string;
  cpfElegivel: string;
  cpfSemHistorico: string;
  cpfInvalido: string;
  cpfRequerenteBooking: string;
  cpfComProcessoFinalizado: string;
  servicePointId: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  bookingCreateAppointmentPath: string;
  bookingGetAppointmentPath: string;
  bookingCancelAppointmentPath: string;
  bookingCancelAppointmentMethod: string;
  smartFinishedProcessByCpfPath: string;
  smartGetProtocolPath: string;
  cidadaoSmartExpressEligibilityPath: string;
  cidadaoSmartCreateExpressPath: string;
  cidadaoSmartGetProcessPath: string;
  cidadaoSmartCancelExpressPath: string;
  cidadaoSmartCancelExpressMethod: string;
  captchaMode: CaptchaMode;
  captureMode: CaptureMode;
  validPhotoPath: string;
  headless: boolean;
};

function readBoolean(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (!value) return fallback;
  return value.trim().toLowerCase() === 'true';
}

function readEnum<T extends string>(name: string, allowed: readonly T[], fallback: T): T {
  const value = (process.env[name] || fallback).trim().toLowerCase() as T;
  if (allowed.includes(value)) return value;
  throw new Error(`[ENV] ${name} invalido: ${value}. Valores: ${allowed.join(', ')}.`);
}

function normalizeUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

function read(name: string, fallback = ''): string {
  return process.env[name] || fallback;
}

export function loadEnv(): EnvConfig {
  return {
    cidadaoSmartBaseUrl: normalizeUrl(read('CIDADAO_SMART_BASE_URL')),
    bookingBaseUrl: normalizeUrl(read('BOOKING_BASE_URL', read('CIDADAO_SMART_BASE_URL'))),
    smartApiBaseUrl: normalizeUrl(read('SMART_API_BASE_URL')),
    cidadaoSmartApiBaseUrl: normalizeUrl(read('CIDADAO_SMART_API_BASE_URL')),
    bookingApiBaseUrl: normalizeUrl(read('BOOKING_API_BASE_URL')),
    smartApiToken: read('SMART_API_TOKEN'),
    cidadaoSmartApiToken: read('CIDADAO_SMART_API_TOKEN'),
    bookingApiToken: read('BOOKING_API_TOKEN'),
    testEmail: read('TEST_EMAIL'),
    testEmailPassword: read('TEST_EMAIL_PASSWORD'),
    testEmailProvider: read('TEST_EMAIL_PROVIDER'),
    testPhone: read('TEST_PHONE', read('CIDADAO_SMART_TEST_PHONE')),
    emailCodeMode: readEnum('EMAIL_CODE_MODE', ['manual', 'env', 'browser', 'gmail-api', 'imap', 'internal-api', 'log'], 'manual'),
    emailBrowserProfileDir: read('EMAIL_BROWSER_PROFILE_DIR', 'playwright/.profiles/email'),
    emailBrowserSearchQuery: read('EMAIL_BROWSER_SEARCH_QUERY', 'codigo OR codigo'),
    securityCode: read('CIDADAO_SMART_SECURITY_CODE'),
    cpfElegivel: read('CPF_ELEGIVEL'),
    cpfSemHistorico: read('CPF_SEM_HISTORICO'),
    cpfInvalido: read('CPF_INVALIDO', '00000000000'),
    cpfRequerenteBooking: read('CPF_REQUERENTE_BOOKING', read('CPF_ELEGIVEL')),
    cpfComProcessoFinalizado: read('CPF_COM_PROCESSO_FINALIZADO'),
    servicePointId: read('SERVICE_POINT_ID', read('CIDADAO_SMART_DEFAULT_SERVICE_POINT')),
    serviceId: read('SERVICE_ID'),
    bookingDate: read('BOOKING_DATE', read('CIDADAO_SMART_TEST_APPOINTMENT_DATE')),
    bookingTime: read('BOOKING_TIME', read('CIDADAO_SMART_TEST_APPOINTMENT_TIME')),
    bookingCreateAppointmentPath: read('BOOKING_CREATE_APPOINTMENT_PATH'),
    bookingGetAppointmentPath: read('BOOKING_GET_APPOINTMENT_PATH'),
    bookingCancelAppointmentPath: read('BOOKING_CANCEL_APPOINTMENT_PATH'),
    bookingCancelAppointmentMethod: read('BOOKING_CANCEL_APPOINTMENT_METHOD', 'POST'),
    smartFinishedProcessByCpfPath: read('SMART_FINISHED_PROCESS_BY_CPF_PATH'),
    smartGetProtocolPath: read('SMART_GET_PROTOCOL_PATH', '/protocolos/{protocolo}'),
    cidadaoSmartExpressEligibilityPath: read('CIDADAO_SMART_EXPRESS_ELIGIBILITY_PATH'),
    cidadaoSmartCreateExpressPath: read('CIDADAO_SMART_CREATE_EXPRESS_PATH'),
    cidadaoSmartGetProcessPath: read('CIDADAO_SMART_GET_PROCESS_PATH'),
    cidadaoSmartCancelExpressPath: read('CIDADAO_SMART_CANCEL_EXPRESS_PATH'),
    cidadaoSmartCancelExpressMethod: read('CIDADAO_SMART_CANCEL_EXPRESS_METHOD', 'POST'),
    captchaMode: readEnum('CAPTCHA_MODE', ['manual', 'disabled', 'test'], 'manual'),
    captureMode: readEnum('CAPTURE_MODE', ['manual', 'fake-video', 'disabled'], 'manual'),
    validPhotoPath: read('CIDADAO_SMART_VALID_PHOTO_PATH'),
    headless: readBoolean('HEADLESS', true),
  };
}

export function requireConfiguredUrl(name: keyof Pick<EnvConfig, 'cidadaoSmartBaseUrl' | 'bookingBaseUrl'>): string {
  const value = loadEnv()[name];
  if (!value) {
    throw new Error(`[ENV] Configure ${String(name)} no .env.local.`);
  }

  return value;
}
