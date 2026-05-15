import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Eu carrego primeiro o .env.local para respeitar a configuração da máquina.
dotenv.config({ path: '.env.local' });
dotenv.config();

const automatedRunScripts = new Set([
  'test:all',
  'test:ci',
  'test:regressao',
  'test:booking:public',
  'test:booking:e2e',
  'test:agendamento',
  'test:agendamento:local',
  'test:agendamento:data-hora',
  'test:agendamento:validacoes',
  'test:emissao',
  'test:consulta',
  'test:2via',
  'test:e2e',
  'test:smoke',
]);

// Scripts automaticos nao devem parar em page.pause().
// Fluxos com intervencao humana continuam nos comandos manual-assisted.
if (automatedRunScripts.has(process.env.npm_lifecycle_event || '') || process.env.CI) {
  if ((process.env.CAPTCHA_MODE || 'manual') === 'manual') {
    process.env.CAPTCHA_MODE = 'disabled';
  }

  if ((process.env.EXECUTION_MODE || 'manual-assisted') === 'manual-assisted') {
    process.env.EXECUTION_MODE = 'ci';
  }
}

// Eu uso PW_SLOW_MO para deixar a execução assistida mais visual.
const slowMo = Number(process.env.PW_SLOW_MO || 0);
const executionMode = process.env.EXECUTION_MODE || 'manual-assisted';
const isManualAssisted = executionMode === 'manual-assisted';
const evidenceDir = process.env.EVIDENCE_DIR || 'test-results';
const captureMode = process.env.CAPTURE_MODE || 'manual';
const fakeVideoPath = process.env.CAMERA_FAKE_VIDEO_PATH || '';

// Eu ativo a câmera fake somente quando o modo de captura pedir explicitamente.
const chromiumArgs =
  captureMode === 'fake-video' && fakeVideoPath
    ? [
        '--use-fake-device-for-media-stream',
        '--use-fake-ui-for-media-stream',
        `--use-file-for-fake-video-capture=${path.resolve(fakeVideoPath)}`,
      ]
    : [];

export default defineConfig({
  testDir: './tests',
  outputDir: evidenceDir,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  // Eu dou mais tempo para fluxos assistidos porque eles podem pausar em CAPTCHA/código.
  timeout: isManualAssisted ? 180_000 : 120_000,
  expect: {
    timeout: isManualAssisted ? 45_000 : 30_000,
  },
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    // Eu deixo a URL base configurável para alternar entre 146, 201 ou outro ambiente.
    baseURL: process.env.CIDADAO_SMART_BASE_URL || 'https://172.16.1.146',
    ignoreHTTPSErrors: true,
    // Eu ligo mais evidências no modo assistido para facilitar demo e investigação.
    trace: isManualAssisted ? 'on' : 'on-first-retry',
    screenshot: isManualAssisted ? 'on' : 'only-on-failure',
    video: 'retain-on-failure',
    permissions: captureMode === 'fake-video' ? ['camera', 'microphone'] : [],
    launchOptions: {
      slowMo: Number.isFinite(slowMo) ? slowMo : 0,
      args: chromiumArgs,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'mobile-chromium',
      use: {
        // Perfil mobile web para validar responsividade do Booking/Cidadao Smart.
        ...devices['Pixel 5'],
      },
    },
  ],
});
