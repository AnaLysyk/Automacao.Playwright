import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Eu carrego primeiro o .env.local para respeitar a configuração da máquina.
dotenv.config({ path: '.env.local' });
dotenv.config();

// Eu uso PW_SLOW_MO para deixar a execução assistida mais visual.
const slowMo = Number(process.env.PW_SLOW_MO || 0);
const executionMode = process.env.EXECUTION_MODE || 'manual-assisted';
const isManualAssisted = executionMode === 'manual-assisted';
const evidenceDir = process.env.EVIDENCE_DIR || 'test-results';

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
