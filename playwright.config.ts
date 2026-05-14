import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Eu carrego primeiro o .env.local para respeitar a configuracao da maquina.
dotenv.config({ path: '.env.local' });
dotenv.config();

// Eu uso PW_SLOW_MO para deixar a execucao assistida mais visual.
const slowMo = Number(process.env.PW_SLOW_MO || 0);
const executionMode = process.env.EXECUTION_MODE || 'manual-assisted';
const isManualAssisted = executionMode === 'manual-assisted';

export default defineConfig({
  testDir: './tests',
  // Eu dou mais tempo para fluxos assistidos porque eles podem pausar em CAPTCHA/codigo.
  timeout: isManualAssisted ? 180_000 : 120_000,
  expect: {
    timeout: isManualAssisted ? 45_000 : 30_000,
  },
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    // Eu deixo a URL base configuravel para alternar entre 146, 201 ou outro ambiente.
    baseURL: process.env.CIDADAO_SMART_BASE_URL || 'https://172.16.1.146',
    ignoreHTTPSErrors: true,
    // Eu ligo mais evidencias no modo assistido para facilitar demo e investigacao.
    trace: isManualAssisted ? 'on' : 'on-first-retry',
    screenshot: isManualAssisted ? 'on' : 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      slowMo: Number.isFinite(slowMo) ? slowMo : 0,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
