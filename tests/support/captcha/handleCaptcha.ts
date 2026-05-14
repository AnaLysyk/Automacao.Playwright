import { Page } from "@playwright/test";

/**
 * Helper para simular CAPTCHA em diferentes modos.
 * Não tenta burlar CAPTCHA real.
 * 
 * Modos:
 * - manual: Pausa para resolução manual no browser
 * - disabled: Não faz nada (ambiente QA)
 * - test: Placeholder para futuro modo teste
 */
export async function handleCaptcha(page: Page) {
  const mode = process.env.CAPTCHA_MODE || "manual";

  if (mode === "disabled") {
    console.log("⏭️  CAPTCHA_MODE=disabled, pulando CAPTCHA");
    return;
  }

  if (mode === "manual") {
    console.log("⏸️  CAPTCHA detectado. Resolva manualmente e continue.");
    await page.pause();
    return;
  }

  if (mode === "test") {
    console.log("🧪 CAPTCHA_MODE=test disponível apenas em ambiente QA com bypass habilitado");
    return;
  }

  throw new Error(`CAPTCHA_MODE inválido: ${mode}`);
}

/**
 * Helper para esperar a resolução manual do CAPTCHA com timeout seguro.
 */
export async function waitForCaptchaResolution(
  page: Page,
  timeoutMs: number = 60000
) {
  const mode = process.env.CAPTCHA_MODE || "manual";

  if (mode === "disabled") return;

  console.log(`⏱️  Aguardando resolução do CAPTCHA (timeout: ${timeoutMs}ms)`);
  await page.pause();
}
