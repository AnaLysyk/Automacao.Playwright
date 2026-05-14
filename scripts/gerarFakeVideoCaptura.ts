import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

type VideoSize = {
  width: number;
  height: number;
};

// Eu leio uma variavel obrigatoria e falho com mensagem clara quando ela nao existe.
function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`[CAPTURE] Configure ${name} no .env.local antes de gerar o video fake.`);
  }

  return value;
}

// Eu transformo o formato 640x480 em largura e altura para montar o filtro do ffmpeg.
function parseVideoSize(rawSize: string): VideoSize {
  const match = rawSize.match(/^(\d+)x(\d+)$/);

  if (!match) {
    throw new Error('[CAPTURE] CAMERA_FAKE_VIDEO_SIZE invalido. Use o formato 640x480.');
  }

  return {
    width: Number(match[1]),
    height: Number(match[2]),
  };
}

// Eu valido se o ffmpeg esta instalado porque o Chromium precisa de um .y4m, nao de uma imagem solta.
function assertFfmpegAvailable(): void {
  const result = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });

  if (result.error || result.status !== 0) {
    throw new Error('[CAPTURE] ffmpeg nao encontrado. Instale o ffmpeg para converter imagem em .y4m.');
  }
}

// Eu gero um video curto repetindo a imagem fonte, mantendo proporcao e preenchendo o quadro.
function generateFakeVideoFromImage(): void {
  const sourceImagePath = path.resolve(readRequiredEnv('CAMERA_FAKE_IMAGE_PATH'));
  const targetVideoPath = path.resolve(readRequiredEnv('CAMERA_FAKE_VIDEO_PATH'));
  const durationSeconds = Number(process.env.CAMERA_FAKE_VIDEO_SECONDS || '5');
  const size = parseVideoSize(process.env.CAMERA_FAKE_VIDEO_SIZE || '640x480');

  if (!fs.existsSync(sourceImagePath)) {
    throw new Error(`[CAPTURE] Imagem fonte nao encontrada: ${sourceImagePath}`);
  }

  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new Error('[CAPTURE] CAMERA_FAKE_VIDEO_SECONDS precisa ser maior que zero.');
  }

  fs.mkdirSync(path.dirname(targetVideoPath), { recursive: true });
  assertFfmpegAvailable();

  const videoFilter = [
    `scale=${size.width}:${size.height}:force_original_aspect_ratio=decrease`,
    `pad=${size.width}:${size.height}:(ow-iw)/2:(oh-ih)/2`,
    'format=yuv420p',
  ].join(',');

  const result = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-loop',
      '1',
      '-i',
      sourceImagePath,
      '-t',
      String(durationSeconds),
      '-vf',
      videoFilter,
      '-r',
      '30',
      '-f',
      'yuv4mpegpipe',
      targetVideoPath,
    ],
    { stdio: 'inherit' },
  );

  if (result.error || result.status !== 0) {
    throw new Error('[CAPTURE] Falha ao gerar video fake de captura.');
  }

  console.log(`[CAPTURE] Video fake gerado em: ${targetVideoPath}`);
}

generateFakeVideoFromImage();
