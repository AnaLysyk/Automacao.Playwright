import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

export type CaptchaMode = 'manual' | 'disabled' | 'test';
export type ExecutionMode = 'manual-assisted' | 'local' | 'ci';

export type EnvConfig = {
  targetEnv: string;
  cidadaoSmartBaseUrl: string;
  bookingAdminBaseUrl: string;
  smartReactUrl: string;
  captchaMode: CaptchaMode;
  executionMode: ExecutionMode;
  slowMo: number;
  dryRun: boolean;
};

const envDefaults: Record<string, Pick<EnvConfig, 'cidadaoSmartBaseUrl' | 'bookingAdminBaseUrl' | 'smartReactUrl'>> = {
  '146': {
    cidadaoSmartBaseUrl: 'https://172.16.1.146',
    bookingAdminBaseUrl: 'https://172.16.1.146/admin/login',
    smartReactUrl: 'http://172.16.1.146:8100/react',
  },
  '201': {
    cidadaoSmartBaseUrl: 'https://172.16.1.201',
    bookingAdminBaseUrl: 'https://172.16.1.201/admin/login',
    smartReactUrl: 'http://172.16.1.201:8100/react',
  },
};

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

function readNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readCaptchaMode(): CaptchaMode {
  const mode = (process.env.CAPTCHA_MODE || 'manual').trim().toLowerCase();
  if (mode === 'manual' || mode === 'disabled' || mode === 'test') return mode;
  throw new Error(`[ENV] CAPTCHA_MODE invalido: ${mode}. Use manual, disabled ou test.`);
}

function readExecutionMode(): ExecutionMode {
  const mode = (process.env.EXECUTION_MODE || 'manual-assisted').trim().toLowerCase();
  if (mode === 'manual-assisted' || mode === 'local' || mode === 'ci') return mode;
  throw new Error(`[ENV] EXECUTION_MODE invalido: ${mode}. Use manual-assisted, local ou ci.`);
}

export function loadEnvConfig(): EnvConfig {
  const targetEnv = (process.env.TARGET_ENV || '146').trim();
  const defaults = envDefaults[targetEnv] || envDefaults['146'];

  return {
    targetEnv,
    cidadaoSmartBaseUrl: normalizeUrl(process.env.CIDADAO_SMART_BASE_URL || defaults.cidadaoSmartBaseUrl),
    bookingAdminBaseUrl: normalizeUrl(process.env.BOOKING_ADMIN_BASE_URL || defaults.bookingAdminBaseUrl),
    smartReactUrl: normalizeUrl(process.env.SMART_REACT_URL || process.env.SMART_BASE_URL || defaults.smartReactUrl),
    captchaMode: readCaptchaMode(),
    executionMode: readExecutionMode(),
    slowMo: readNumber('PW_SLOW_MO', 300),
    dryRun: (process.env.CIDADAO_SMART_DRY_RUN || 'false').trim().toLowerCase() === 'true',
  };
}

export function validateManualAssistedEnv(config: EnvConfig): void {
  const missing: string[] = [];

  if (!config.cidadaoSmartBaseUrl) missing.push('CIDADAO_SMART_BASE_URL');
  if (!config.captchaMode) missing.push('CAPTCHA_MODE');
  if (!config.executionMode) missing.push('EXECUTION_MODE');

  if (missing.length > 0) {
    throw new Error(`[ENV] Variaveis obrigatorias ausentes: ${missing.join(', ')}. Configure no .env.local.`);
  }

  if (config.targetEnv === '201' && config.executionMode !== 'manual-assisted') {
    console.warn('[ENV] TARGET_ENV=201 detectado. Use preferencialmente fluxos read-only ou assistidos.');
  }
}

