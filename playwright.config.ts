import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });
dotenv.config();

const headless = (process.env.HEADLESS || 'true').trim().toLowerCase() !== 'false';
const slowMo = Number(process.env.PW_SLOW_MO || 0);
const captureMode = process.env.CAPTURE_MODE || 'manual';
const fakeVideoPath = process.env.CAMERA_FAKE_VIDEO_PATH || '';
const baseURL =
  process.env.CIDADAO_SMART_BASE_URL ||
  process.env.BOOKING_BASE_URL ||
  'http://localhost';

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
  outputDir: 'test-results',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 120_000,
  expect: {
    timeout: 30_000,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL,
    headless,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
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
  ],
});
