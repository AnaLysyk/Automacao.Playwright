import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

export type CaptchaMode = 'manual' | 'disabled' | 'test';
export type CaptureMode = 'manual' | 'fake-video' | 'disabled';
export type EmailCodeMode = 'manual' | 'env' | 'imap' | 'gmail-api' | 'internal-api' | 'log';
export type ExecutionMode = 'manual-assisted' | 'local' | 'ci';

export type EnvConfig = {
  targetEnv: string;
  cidadaoSmartBaseUrl: string;
  bookingAdminBaseUrl: string;
  smartReactUrl: string;
  smartBaseUrl: string;
  apiBaseUrl: string;
  apiToken?: string;
  captchaMode: CaptchaMode;
  captureMode: CaptureMode;
  cameraFakeImagePath?: string;
  cameraFakeVideoPath?: string;
  cameraFakeVideoSeconds: number;
  cameraFakeVideoSize: string;
  emailCodeMode: EmailCodeMode;
  securityCode?: string;
  gmailTestAccount?: string;
  gmailCredentialsPath?: string;
  gmailTokenPath?: string;
  gmailCodeQuery: string;
  gmailCodeRegex: string;
  imapHost?: string;
  imapPort: number;
  imapSecure: boolean;
  imapUser?: string;
  imapPassword?: string;
  imapMailbox: string;
  imapFromFilter?: string;
  emailPollTimeoutMs: number;
  emailPollIntervalMs: number;
  emailCodeRegex: string;
  executionMode: ExecutionMode;
  slowMo: number;
  evidenceDir: string;
  dryRun: boolean;
};

const envDefaults: Record<string, Pick<EnvConfig, 'cidadaoSmartBaseUrl' | 'bookingAdminBaseUrl' | 'smartReactUrl' | 'smartBaseUrl'>> = {
  '146': {
    cidadaoSmartBaseUrl: 'https://172.16.1.146',
    bookingAdminBaseUrl: 'https://172.16.1.146/admin/login',
    smartReactUrl: 'http://172.16.1.146:8100/react',
    smartBaseUrl: 'http://172.16.1.146:8100/react',
  },
  '201': {
    cidadaoSmartBaseUrl: 'https://172.16.1.201',
    bookingAdminBaseUrl: 'https://172.16.1.201/admin/login',
    smartReactUrl: 'http://172.16.1.201:8100/react',
    smartBaseUrl: 'http://172.16.1.201:8100/react',
  },
};

// Remove barras finais para evitar URLs duplicadas quando os testes montam rotas.
function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

// Le numeros do ambiente com fallback para evitar NaN no Playwright config.
function readNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// Le booleanos aceitando apenas "true" como valor ativo.
function readBoolean(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (!raw) return fallback;

  return raw.trim().toLowerCase() === 'true';
}

// Valida CAPTCHA_MODE para impedir erro silencioso por typo no .env.local.
function readCaptchaMode(): CaptchaMode {
  const mode = (process.env.CAPTCHA_MODE || 'manual').trim().toLowerCase();
  if (mode === 'manual' || mode === 'disabled' || mode === 'test') return mode;

  throw new Error(`[ENV] CAPTCHA_MODE invalido: ${mode}. Use manual, disabled ou test.`);
}

// Valida CAPTURE_MODE porque manual, fake-video e disabled mudam o fluxo.
function readCaptureMode(): CaptureMode {
  const mode = (process.env.CAPTURE_MODE || 'manual').trim().toLowerCase();
  if (mode === 'manual' || mode === 'fake-video' || mode === 'disabled') return mode;

  throw new Error(`[ENV] CAPTURE_MODE invalido: ${mode}. Use manual, fake-video ou disabled.`);
}

// Valida EMAIL_CODE_MODE para deixar claro como o codigo de seguranca sera obtido.
function readEmailCodeMode(): EmailCodeMode {
  const mode = (process.env.EMAIL_CODE_MODE || 'manual').trim().toLowerCase();
  if (
    mode === 'manual' ||
    mode === 'env' ||
    mode === 'imap' ||
    mode === 'gmail-api' ||
    mode === 'internal-api' ||
    mode === 'log'
  ) {
    return mode;
  }

  throw new Error(`[ENV] EMAIL_CODE_MODE invalido: ${mode}. Use manual, env, imap, gmail-api, internal-api ou log.`);
}

// Valida EXECUTION_MODE para separar execucao assistida, local e CI.
function readExecutionMode(): ExecutionMode {
  const mode = (process.env.EXECUTION_MODE || 'manual-assisted').trim().toLowerCase();
  if (mode === 'manual-assisted' || mode === 'local' || mode === 'ci') return mode;

  throw new Error(`[ENV] EXECUTION_MODE invalido: ${mode}. Use manual-assisted, local ou ci.`);
}

// Monta a configuracao central que os agents usam para nao espalhar process.env pelo projeto.
export function loadEnvConfig(): EnvConfig {
  const targetEnv = (process.env.TARGET_ENV || '146').trim();
  const defaults = envDefaults[targetEnv] || envDefaults['146'];

  return {
    targetEnv,
    cidadaoSmartBaseUrl: normalizeUrl(process.env.CIDADAO_SMART_BASE_URL || defaults.cidadaoSmartBaseUrl),
    bookingAdminBaseUrl: normalizeUrl(process.env.BOOKING_ADMIN_BASE_URL || defaults.bookingAdminBaseUrl),
    smartReactUrl: normalizeUrl(process.env.SMART_REACT_URL || process.env.SMART_BASE_URL || defaults.smartReactUrl),
    smartBaseUrl: normalizeUrl(process.env.SMART_BASE_URL || process.env.SMART_REACT_URL || defaults.smartBaseUrl),
    apiBaseUrl: normalizeUrl(process.env.API_BASE_URL || ''),
    apiToken: process.env.API_TOKEN || '',
    captchaMode: readCaptchaMode(),
    captureMode: readCaptureMode(),
    cameraFakeImagePath: process.env.CAMERA_FAKE_IMAGE_PATH || '',
    cameraFakeVideoPath: process.env.CAMERA_FAKE_VIDEO_PATH || '',
    cameraFakeVideoSeconds: readNumber('CAMERA_FAKE_VIDEO_SECONDS', 5),
    cameraFakeVideoSize: process.env.CAMERA_FAKE_VIDEO_SIZE || '640x480',
    emailCodeMode: readEmailCodeMode(),
    securityCode: process.env.CIDADAO_SMART_SECURITY_CODE || '',
    gmailTestAccount: process.env.GMAIL_TEST_ACCOUNT || '',
    gmailCredentialsPath: process.env.GMAIL_CREDENTIALS_PATH || '',
    gmailTokenPath: process.env.GMAIL_TOKEN_PATH || '',
    gmailCodeQuery: process.env.GMAIL_CODE_QUERY || 'from:noreply newer_than:10m',
    gmailCodeRegex: process.env.GMAIL_CODE_REGEX || String.raw`\b\d{6}\b`,
    imapHost: process.env.CIDADAO_SMART_EMAIL_IMAP_HOST || '',
    imapPort: readNumber('CIDADAO_SMART_EMAIL_IMAP_PORT', 993),
    imapSecure: readBoolean('CIDADAO_SMART_EMAIL_IMAP_SECURE', true),
    imapUser: process.env.CIDADAO_SMART_EMAIL_IMAP_USER || '',
    imapPassword: process.env.CIDADAO_SMART_EMAIL_IMAP_PASSWORD || '',
    imapMailbox: process.env.CIDADAO_SMART_EMAIL_IMAP_MAILBOX || 'INBOX',
    imapFromFilter: process.env.CIDADAO_SMART_EMAIL_FROM_FILTER || '',
    emailPollTimeoutMs: readNumber('CIDADAO_SMART_EMAIL_POLL_TIMEOUT_MS', 120_000),
    emailPollIntervalMs: readNumber('CIDADAO_SMART_EMAIL_POLL_INTERVAL_MS', 5_000),
    emailCodeRegex: process.env.CIDADAO_SMART_EMAIL_CODE_REGEX || process.env.GMAIL_CODE_REGEX || String.raw`\b\d{6}\b`,
    executionMode: readExecutionMode(),
    slowMo: readNumber('PW_SLOW_MO', 300),
    evidenceDir: process.env.EVIDENCE_DIR || 'test-results',
    dryRun: readBoolean('CIDADAO_SMART_DRY_RUN', false),
  };
}

// Falha cedo quando falta configuracao basica para um fluxo assistido.
export function validateManualAssistedEnv(config: EnvConfig): void {
  const missing: string[] = [];

  if (!config.cidadaoSmartBaseUrl) missing.push('CIDADAO_SMART_BASE_URL');
  if (!config.captchaMode) missing.push('CAPTCHA_MODE');
  if (!config.executionMode) missing.push('EXECUTION_MODE');

  if (config.captureMode === 'fake-video' && !config.cameraFakeVideoPath) {
    missing.push('CAMERA_FAKE_VIDEO_PATH');
  }

  if (config.emailCodeMode === 'env' && !config.securityCode) {
    missing.push('CIDADAO_SMART_SECURITY_CODE');
  }

  if (config.emailCodeMode === 'imap') {
    if (!config.imapHost) missing.push('CIDADAO_SMART_EMAIL_IMAP_HOST');
    if (!config.imapUser) missing.push('CIDADAO_SMART_EMAIL_IMAP_USER');
    if (!config.imapPassword) missing.push('CIDADAO_SMART_EMAIL_IMAP_PASSWORD');
  }

  if (missing.length > 0) {
    throw new Error(`[ENV] Variaveis obrigatorias ausentes: ${missing.join(', ')}. Configure no .env.local.`);
  }

  if (config.targetEnv === '201' && config.executionMode !== 'manual-assisted') {
    console.warn('[ENV] TARGET_ENV=201 detectado. Use preferencialmente fluxos read-only ou assistidos.');
  }
}
