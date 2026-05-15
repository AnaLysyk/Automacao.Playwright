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
  emailCodeMode: EmailCodeMode;
  emailBrowserProfileDir: string;
  emailBrowserSearchQuery: string;
  securityCode: string;
  cpfElegivel: string;
  cpfSemHistorico: string;
  cpfInvalido: string;
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

export function loadEnv(): EnvConfig {
  return {
    cidadaoSmartBaseUrl: normalizeUrl(process.env.CIDADAO_SMART_BASE_URL || ''),
    bookingBaseUrl: normalizeUrl(process.env.BOOKING_BASE_URL || process.env.CIDADAO_SMART_BASE_URL || ''),
    smartApiBaseUrl: normalizeUrl(process.env.SMART_API_BASE_URL || ''),
    cidadaoSmartApiBaseUrl: normalizeUrl(process.env.CIDADAO_SMART_API_BASE_URL || ''),
    bookingApiBaseUrl: normalizeUrl(process.env.BOOKING_API_BASE_URL || ''),
    smartApiToken: process.env.SMART_API_TOKEN || '',
    cidadaoSmartApiToken: process.env.CIDADAO_SMART_API_TOKEN || '',
    bookingApiToken: process.env.BOOKING_API_TOKEN || '',
    testEmail: process.env.TEST_EMAIL || '',
    testEmailPassword: process.env.TEST_EMAIL_PASSWORD || '',
    testEmailProvider: process.env.TEST_EMAIL_PROVIDER || '',
    emailCodeMode: readEnum('EMAIL_CODE_MODE', ['manual', 'env', 'browser', 'gmail-api', 'imap', 'internal-api', 'log'], 'manual'),
    emailBrowserProfileDir: process.env.EMAIL_BROWSER_PROFILE_DIR || 'playwright/.profiles/email',
    emailBrowserSearchQuery: process.env.EMAIL_BROWSER_SEARCH_QUERY || 'codigo OR código',
    securityCode: process.env.CIDADAO_SMART_SECURITY_CODE || '',
    cpfElegivel: process.env.CPF_ELEGIVEL || '',
    cpfSemHistorico: process.env.CPF_SEM_HISTORICO || '',
    cpfInvalido: process.env.CPF_INVALIDO || '00000000000',
    captchaMode: readEnum('CAPTCHA_MODE', ['manual', 'disabled', 'test'], 'manual'),
    captureMode: readEnum('CAPTURE_MODE', ['manual', 'fake-video', 'disabled'], 'manual'),
    validPhotoPath: process.env.CIDADAO_SMART_VALID_PHOTO_PATH || '',
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
