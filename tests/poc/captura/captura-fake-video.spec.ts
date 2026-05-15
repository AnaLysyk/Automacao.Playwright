import fs from 'fs';
import path from 'path';
import { expect, test } from '@playwright/test';
import { CaptureAgent } from '@support/agents/CaptureAgent';

test.describe('@poc @capture captura fake video', () => {
  test('deve abrir preview de camera usando video fake do Chromium', async ({ page }) => {
    const captureMode = process.env.CAPTURE_MODE || 'manual';
    const fakeVideoPath = process.env.CAMERA_FAKE_VIDEO_PATH || '';
    const fakeImagePath = process.env.CAMERA_FAKE_IMAGE_PATH || '';
    const absoluteFakeVideoPath = fakeVideoPath ? path.resolve(fakeVideoPath) : '';

    test.skip(captureMode !== 'fake-video', 'POC requer CAPTURE_MODE=fake-video.');
    test.skip(
      !fakeVideoPath,
      fakeImagePath
        ? 'POC requer CAMERA_FAKE_VIDEO_PATH. Gere o .y4m com npm run media:fake-video.'
        : 'POC requer CAMERA_FAKE_VIDEO_PATH apontando para um arquivo .y4m.',
    );
    test.skip(
      !fs.existsSync(absoluteFakeVideoPath),
      `Arquivo de video fake nao encontrado: ${absoluteFakeVideoPath}. Gere com npm run media:fake-video.`,
    );

    const captureAgent = new CaptureAgent(page);

    await test.step('Preparar permissao de camera', async () => {
      await captureAgent.prepararCaptura();
      await page.context().grantPermissions(['camera', 'microphone']);
    });

    await test.step('Abrir pagina POC com getUserMedia', async () => {
      await page.setContent(`
        <!doctype html>
        <html lang="pt-BR">
          <body>
            <main>
              <h1>POC Captura Fake Video</h1>
              <p data-testid="camera-status">aguardando</p>
              <video data-testid="camera-preview" autoplay playsinline muted width="320" height="240"></video>
              <script>
                async function startCamera() {
                  const status = document.querySelector('[data-testid="camera-status"]');
                  const video = document.querySelector('[data-testid="camera-preview"]');
                  try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                    video.srcObject = stream;
                    await video.play();
                    status.textContent = 'preview-ok';
                  } catch (error) {
                    status.textContent = 'preview-falhou';
                    throw error;
                  }
                }
                startCamera();
              </script>
            </main>
          </body>
        </html>
      `);
    });

    await test.step('Validar preview e registrar evidencia', async () => {
      await expect(page.getByTestId('camera-status')).toHaveText('preview-ok', { timeout: 15_000 });
      await expect(page.getByTestId('camera-preview')).toBeVisible();
      fs.mkdirSync('test-results', { recursive: true });
      await page.screenshot({ path: 'test-results/poc-captura-fake-video.png', fullPage: true });
    });
  });
});
